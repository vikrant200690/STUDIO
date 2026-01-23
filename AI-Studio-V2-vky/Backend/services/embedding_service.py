from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
import uuid
import json
import numpy as np
import openai
import os
import re
import logging
from utils.snowflake_setup import get_snowflake_config
import snowflake.connector
from typing import List, Dict, Tuple, Any
from services.reranker import RerankerService
from utils.content_processor import ContentProcessor
from services.session_manager import DocumentSessionManager


class EmbeddingService:
    _instance = None
    _initialized = False

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmbeddingService, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        # Only initialize once
        if EmbeddingService._initialized:
            return

        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        print("Loading embedding model...")
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        snowflake_config = get_snowflake_config()
        self.snowflake_conn = snowflake.connector.connect(**snowflake_config)

        # Initialize reranker and content processor
        self.reranker = RerankerService()
        self.content_processor = ContentProcessor()
        self.session_manager = DocumentSessionManager()
        self.logger = logging.getLogger(__name__)

        # Configuration for enhanced chunking
        self.SECTION_HEADERS = [
            "ABSTRACT", "INTRODUCTION", "METHODS", "METHOD",
            "RESULTS", "DISCUSSION", "CONCLUSION", "REFERENCES",
            "TABLE", "FIGURE", "SUPPLEMENTARY"
        ]

        print("✅ Embedding service initialized")
        EmbeddingService._initialized = True

    def get_snowflake_connection(self):
        """Get a fresh Snowflake connection"""
        snowflake_config = get_snowflake_config()
        return snowflake.connector.connect(**snowflake_config)

    async def process_document(self, doc_id: str, text_content: str):
        print(f"Processing document {doc_id} for chunking and embedding...")

        # Fetch filename for metadata
        cursor = self.snowflake_conn.cursor()
        filename = None
        try:
            cursor.execute(
                "SELECT filename FROM documents WHERE doc_id = %s", (doc_id,))
            row = cursor.fetchone()
            filename = row[0] if row else "unknown"
        except Exception as e:
            print(f"⚠️ Could not fetch filename for {doc_id}: {e}")
            filename = "unknown"

        # Split the incoming text into page blocks using the injected page headers
        # Header format inserted earlier: "--- PAGE X ---"
        page_blocks: List[Tuple[int, str]] = []
        try:
            pattern = re.compile(r"^\s*--- PAGE (\d+) ---\s*$", re.MULTILINE)
            indices = [(m.start(), m.end(), int(m.group(1)))
                       for m in pattern.finditer(text_content)]
            if not indices:
                # No page headers found; treat entire text as page N/A
                page_blocks = [(None, text_content)]
            else:
                for i, (start, end, pg) in enumerate(indices):
                    next_start = indices[i + 1][0] if i + \
                        1 < len(indices) else len(text_content)
                    content_slice = text_content[end:next_start]
                    page_blocks.append((pg, content_slice))
        except Exception as e:
            print(
                f"⚠️ Failed to parse page headers, proceeding without page mapping: {e}")
            page_blocks = [(None, text_content)]

        # Enhanced chunking with content-aware processing per page block
        all_chunks: List[Tuple[str, Dict[str, Any]]] = []
        total_blocks = 0
        for page_num, page_text in page_blocks:
            if not page_text or not page_text.strip():
                continue
            content_blocks = self.content_processor.process_mixed_content(
                page_text)
            paragraph_counter = 0
            # Pre-split paragraphs for paragraph numbering
            paragraphs = [p for p in re.split(
                r"\n\n+", page_text) if p.strip()]
            paragraph_index_map: Dict[int, int] = {}
            running_text = ""
            for idx, p in enumerate(paragraphs):
                # 1-based paragraph index
                paragraph_index_map[len(running_text)] = idx + 1
                running_text += p + "\n\n"

            for block in content_blocks:
                block_type = block.get("type", "text")
                block_text = block.get("content", "")
                section = block.get("section", "OTHER")
                if not block_text.strip():
                    continue

                if block_type in ("table", "figure"):
                    # Single chunk, paragraph not applicable
                    metadata = {
                        "filename": filename,
                        "source_file": filename,
                        "page": page_num if page_num is not None else "N/A",
                        "paragraph_start": None,
                        "content_type": block_type,
                        "section": section,
                    }
                    all_chunks.append((block_text, metadata))
                    total_blocks += 1
                    continue

                # Regular text -> split into chunks
                text_chunks = self.text_splitter.split_text(block_text)
                for chunk_text in text_chunks:
                    # Estimate starting paragraph index within the page
                    try:
                        # Find the first occurrence of the chunk within the page to map paragraph
                        pos = page_text.find(chunk_text[:50]) if len(
                            chunk_text) >= 50 else page_text.find(chunk_text)
                        paragraph_start = None
                        if pos != -1:
                            # Find the nearest paragraph start not after pos
                            keys = sorted(paragraph_index_map.keys())
                            for k in keys:
                                if k <= pos:
                                    paragraph_start = paragraph_index_map[k]
                                else:
                                    break
                    except Exception:
                        paragraph_start = None

                    metadata = {
                        "filename": filename,
                        "source_file": filename,
                        "page": page_num if page_num is not None else "N/A",
                        "paragraph_start": paragraph_start,
                        "content_type": "text",
                        "section": section,
                    }
                    all_chunks.append((chunk_text, metadata))
                    total_blocks += 1

        print(
            f"Created {len(all_chunks)} chunks across {len(page_blocks)} page blocks")

        # Generate embeddings and store
        cursor = self.snowflake_conn.cursor()

        for i, (chunk, meta) in enumerate(all_chunks):
            chunk_id = str(uuid.uuid4())

            # Generate embedding
            embedding = self.embedding_model.encode(chunk)

            # Store in Snowflake - convert embedding to a format Snowflake can handle
            embedding_list = embedding.tolist()
            # Convert to regular floats to avoid scientific notation and limit precision
            embedding_list = [round(float(x), 6) for x in embedding_list]

            # Store as JSON string in TEXT column
            embedding_json = json.dumps(embedding_list)

            # Create enhanced metadata for the chunk
            content_type = meta.get(
                "content_type") or self.content_processor.classify_content_type(chunk)
            section = meta.get(
                "section") or self.content_processor.detect_section(chunk)
            metadata = self.content_processor.create_content_metadata(
                chunk, content_type, section)
            metadata["chunk_index"] = i
            # Add source/page/paragraph details
            metadata["source_file"] = meta.get("source_file")
            metadata["filename"] = meta.get("filename")
            metadata["page"] = meta.get("page")
            metadata["paragraph_start"] = meta.get("paragraph_start")
            metadata_json = json.dumps(metadata)

            try:
                cursor.execute("""
                    INSERT INTO document_chunks 
                    (chunk_id, doc_id, chunk_text, chunk_index, embedding_vector, metadata)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (chunk_id, doc_id, chunk, i, embedding_json, metadata_json))
                print(f"Processed chunk {i+1}/{len(all_chunks)}")
                self.logger.info(f"Stored chunk idx={i}")
            except Exception as e:
                print(f"Error inserting chunk {i}: {e}")
                # Continue with next chunk instead of failing completely
                continue

        self.snowflake_conn.commit()

        # Update document status
        cursor.execute(
            "UPDATE documents SET status = 'processed' WHERE doc_id = %s", (doc_id,))
        self.snowflake_conn.commit()

        print(f"✅ Document {doc_id} processing complete")

        return {
            "doc_id": doc_id,
            "chunks_created": len(all_chunks),
            "status": "processed"
        }

    async def find_relevant_chunks(self, question: str, top_k: int = 5, session_id: str = None):
        """Enhanced retrieval with reranking and content-type awareness - SESSION SCOPED"""
        print(f"Searching for relevant chunks for: {question}")

        # Get current session if none provided
        if session_id is None:
            session_id = self.session_manager.get_current_session_id()

        if not session_id:
            print("❌ No active session found")
            return None

        # Get documents for this session
        session_doc_ids = self.session_manager.get_documents_for_session(
            session_id)
        if not session_doc_ids:
            print(f"❌ No documents found in session {session_id}")
            return None

        print(
            f"🔍 Searching in session {session_id} with {len(session_doc_ids)} documents")

        # Generate question embedding
        question_embedding = self.embedding_model.encode(question)
        question_embedding_list = question_embedding.tolist()
        question_embedding_list = [round(float(x), 6)
                                   for x in question_embedding_list]

        cursor = self.snowflake_conn.cursor()

        try:
            # Get chunks only from the current session's documents
            placeholders = ','.join(['%s'] * len(session_doc_ids))
            cursor.execute(f"""
                SELECT 
                    dc.chunk_text,
                    d.filename,
                    dc.embedding_vector,
                    dc.metadata
                FROM document_chunks dc
                JOIN documents d ON dc.doc_id = d.doc_id
                WHERE d.doc_id IN ({placeholders})
                AND d.status = 'processed'
            """, session_doc_ids)

            chunks_with_similarity = []
            for chunk_text, filename, embedding_json, metadata_json in cursor.fetchall():
                try:
                    # Parse the stored embedding and metadata
                    stored_embedding = json.loads(embedding_json)
                    metadata = json.loads(
                        metadata_json) if metadata_json else {}

                    # Compute cosine similarity
                    similarity = self._cosine_similarity(
                        question_embedding_list, stored_embedding)

                    # Create chunk object with metadata
                    chunk_obj = {
                        "text": chunk_text,
                        "metadata": metadata,
                        "filename": filename,
                    }

                    chunks_with_similarity.append(
                        (chunk_obj, filename, similarity))
                except Exception as e:
                    print(f"Error processing chunk similarity: {e}")
                    continue

            # Apply reranking
            reranked_chunks = await self._rerank_chunks(question, chunks_with_similarity, top_k)

        except Exception as e:
            print(f"Error in similarity search: {e}")
            # Fallback to simple text search within session
            placeholders = ','.join(['%s'] * len(session_doc_ids))
            cursor.execute(f"""
                SELECT 
                    dc.chunk_text,
                    d.filename
                FROM document_chunks dc
                JOIN documents d ON dc.doc_id = d.doc_id
                WHERE d.doc_id IN ({placeholders})
                AND d.status = 'processed'
                LIMIT %s
            """, session_doc_ids + [top_k])

            # Build a minimal structure compatible with downstream usage
            reranked_chunks = []
            for chunk_text, filename in cursor.fetchall():
                reranked_chunks.append({
                    "text": chunk_text,
                    "filename": filename,
                    "metadata": {},
                    "score": 0.5,
                })

        if not reranked_chunks:
            print(f"❌ No relevant documents found in session {session_id}")
            return None

        print(
            f"✅ Found {len(reranked_chunks)} relevant chunks in session {session_id}")

        # Build context and sources with page/paragraph logging
        context_parts = []
        sources = []
        for item in reranked_chunks:
            text = item["text"] if isinstance(item, dict) else item[0]
            fname = item["filename"] if isinstance(item, dict) else item[1]
            score = item["score"] if isinstance(item, dict) else item[2]
            metadata = item.get("metadata", {}) if isinstance(
                item, dict) else {}
            pg = metadata.get("page", "N/A")
            para = metadata.get("paragraph_start")
            para_str = f", para={para}" if para is not None else ""
            print(
                f"🔗 Selected chunk from file={fname} page={pg}{para_str} (score={score:.2f})")
            context_parts.append(f"[From {fname} p.{pg}{para_str}]: {text}")
            sources.append(f"{fname} p.{pg} (similarity: {score:.2f})")
        context = "\n\n".join(context_parts)

        return {
            "context": context,
            "sources": sources
        }

    async def _rerank_chunks(self, query: str, chunks_with_similarity: List[Tuple], top_k: int) -> List[Tuple]:
        """Apply advanced reranking using the dedicated reranker service"""
        if not chunks_with_similarity:
            return []

        if len(chunks_with_similarity) <= top_k:
            return chunks_with_similarity

        # Convert to format expected by reranker service
        chunks_for_reranking = []
        for chunk_obj, filename, base_score in chunks_with_similarity:
            chunks_for_reranking.append({
                "text": chunk_obj["text"],
                "metadata": chunk_obj["metadata"],
                "filename": filename,
                "base_score": base_score
            })

        # Apply reranking using the dedicated reranker service
        try:
            reranked_results = await self.reranker.batch_rerank(query, chunks_for_reranking, top_k)

            # Convert back to a structured format preserving metadata
            reranked_chunks = []
            for result in reranked_results:
                passage = result["passage"]
                score = result["score"]
                meta = passage.get("metadata", {}) if isinstance(
                    passage, dict) else {}
                pg = meta.get("page", "N/A")
                para = meta.get("paragraph_start", None)
                fname = passage.get("filename") if isinstance(
                    passage, dict) else None
                if fname:
                    print(
                        f"🔎 Reranked select: file={fname} page={pg} para={para} score={score:.2f}")
                reranked_chunks.append({
                    "text": passage["text"],
                    "filename": passage["filename"],
                    "metadata": meta,
                    "score": score,
                })

            print(
                f"✅ Reranking completed successfully with {len(reranked_chunks)} chunks")
            return reranked_chunks

        except Exception as e:
            print(f"⚠️ Reranking failed, falling back to base similarity: {e}")
            # Fallback: sort by base similarity and return top_k
            chunks_with_similarity.sort(key=lambda x: x[2], reverse=True)
            fallback = []
            for chunk_obj, filename, base_score in chunks_with_similarity[:top_k]:
                fallback.append({
                    "text": chunk_obj["text"],
                    "filename": filename,
                    "metadata": chunk_obj.get("metadata", {}),
                    "score": base_score,
                })
            return fallback

    def _cosine_similarity(self, vec1, vec2):
        """Compute cosine similarity between two vectors"""
        try:
            vec1 = np.array(vec1)
            vec2 = np.array(vec2)

            # Normalize vectors
            norm1 = np.linalg.norm(vec1)
            norm2 = np.linalg.norm(vec2)

            if norm1 == 0 or norm2 == 0:
                return 0.0

            # Compute cosine similarity
            similarity = np.dot(vec1, vec2) / (norm1 * norm2)
            return float(similarity)
        except Exception as e:
            print(f"Error computing similarity: {e}")
            return 0.0

    async def check_query_relevance(self, query: str, session_id: str = None) -> Dict:
        """Check if query is relevant to uploaded documents in current session"""
        try:
            # Get current session if none provided
            if session_id is None:
                session_id = self.session_manager.get_current_session_id()

            if not session_id:
                return {
                    "is_relevant": False,
                    "relevance_score": 0.0,
                    "matched_documents": [],
                    "scope_message": "No active session",
                    "reason": "no_session"
                }

            # Check if there are active documents in this session
            session_docs = self.session_manager.get_documents_for_session(
                session_id)
            if not session_docs:
                return {
                    "is_relevant": False,
                    "relevance_score": 0.0,
                    "matched_documents": [],
                    "scope_message": f"No documents in session {session_id}",
                    "reason": "no_documents_in_session"
                }

            print(
                f"🔍 Checking relevance for session {session_id} with {len(session_docs)} documents")

            # Generate query embedding
            query_embedding = self.embedding_model.encode(query)
            query_embedding_list = [round(float(x), 6)
                                    for x in query_embedding.tolist()]

            cursor = self.snowflake_conn.cursor()

            # Get chunks from this session's documents only
            placeholders = ','.join(['%s'] * len(session_docs))
            cursor.execute(f"""
                SELECT 
                    dc.chunk_text,
                    d.filename,
                    dc.embedding_vector
                FROM document_chunks dc
                JOIN documents d ON dc.doc_id = d.doc_id
                WHERE d.doc_id IN ({placeholders})
                AND d.status = 'processed'
            """, session_docs)

            chunks = cursor.fetchall()

            if not chunks:
                return {
                    "is_relevant": False,
                    "relevance_score": 0.0,
                    "matched_documents": [],
                    "scope_message": f"No processed chunks in session {session_id}",
                    "reason": "no_processed_chunks"
                }

            # Calculate relevance scores
            relevance_scores = []
            for chunk_text, filename, embedding_json in chunks:
                try:
                    stored_embedding = json.loads(embedding_json)
                    similarity = self._cosine_similarity(
                        query_embedding_list, stored_embedding)
                    relevance_scores.append({
                        "filename": filename,
                        "similarity": similarity,
                        "chunk_preview": chunk_text[:100] + "..." if len(chunk_text) > 100 else chunk_text
                    })
                except Exception as e:
                    print(f"Error processing chunk relevance: {e}")
                    continue

            if not relevance_scores:
                return {
                    "is_relevant": False,
                    "relevance_score": 0.0,
                    "matched_documents": [],
                    "scope_message": f"Error processing chunks in session {session_id}",
                    "reason": "processing_error"
                }

            # Sort by relevance and get top matches
            relevance_scores.sort(key=lambda x: x["similarity"], reverse=True)
            top_matches = relevance_scores[:3]
            avg_relevance = sum(r["similarity"]
                                for r in top_matches) / len(top_matches)

            # Determine if query is relevant
            is_relevant = avg_relevance > 0.3  # Threshold for relevance

            return {
                "is_relevant": is_relevant,
                "relevance_score": avg_relevance,
                "matched_documents": top_matches,
                "scope_message": f"Query relevance: {avg_relevance:.2f} in session {session_id}",
                "reason": "relevance_calculated",
                "session_id": session_id,
                "total_documents": len(session_docs)
            }

        except Exception as e:
            print(f"❌ Error checking query relevance: {e}")
            return {
                "is_relevant": False,
                "relevance_score": 0.0,
                "matched_documents": [],
                "scope_message": f"Error: {str(e)}",
                "reason": "exception"
            }
