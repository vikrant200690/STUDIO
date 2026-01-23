import openai
import logging
from typing import List, Dict, Tuple
import os
from config import Settings
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

settings = Settings()
logger = logging.getLogger(__name__)

class RerankerService:
    def __init__(self):
        self.openai_model = "gpt-4o-mini"
        self.section_weights = {
            "METHODS": 1.8, "METHOD": 1.8, "RESULTS": 1.6,
            "TABLE": 1.7, "FIGURE": 1.5,  # Boost tables and figures
            "CONCLUSION": 1.4, "DISCUSSION": 1.3,
            "INTRODUCTION": 1.2, "ABSTRACT": 1.1,
            "SUPPLEMENTARY": 1.1, "OTHER": 1.0
        }
    
    async def batch_rerank(self, query: str, chunks: List[Dict], top_k: int = 5) -> List[Dict]:
        """Enhanced LLM-based reranking with cross-encoder approach"""
        
        if not chunks:
            return []
        
        if len(chunks) <= top_k:
            # If we have fewer chunks than requested, return all with scores
            return [{"passage": chunk, "score": 1.0} for chunk in chunks]
        
        try:
            # Use LLM-based cross-encoder reranking
            scored_chunks = await self._llm_cross_encoder_rerank(query, chunks)
            
            # Apply section-based boosting
            boosted_chunks = self._apply_section_boosting(scored_chunks)
            
            # Apply content-type boosting
            final_chunks = self._apply_content_type_boosting(query, boosted_chunks)
            
            # Sort by final score and return top_k
            final_chunks.sort(key=lambda x: x["score"], reverse=True)
            return final_chunks[:top_k]
            
        except Exception as e:
            logger.error(f"LLM reranking failed, falling back to simple reranking: {e}")
            return self._simple_fallback_rerank(query, chunks, top_k)
    
    async def _llm_cross_encoder_rerank(self, query: str, chunks: List[Dict]) -> List[Dict]:
        """Use LLM as cross-encoder to score query-passage relevance"""
        scored_chunks = []
        
        # Process chunks in batches to avoid token limits
        batch_size = 5
        for i in range(0, len(chunks), batch_size):
            batch = chunks[i:i+batch_size]
            
            try:
                # Create reranking prompt
                passages_for_prompt = [{"text": chunk["text"][:1000]} for chunk in batch]  # Truncate for token limits
                prompt = self._create_rerank_prompt(query, passages_for_prompt)
                
                response = openai.chat.completions.create(
                    model=self.openai_model,
                    messages=[
                        {"role": "system", "content": prompt["system"]},
                        {"role": "user", "content": prompt["user"]}
                    ],
                    temperature=0,
                    max_tokens=100
                )
                
                # Parse scores from response
                scores_text = response.choices[0].message.content.strip()
                scores = self._parse_rerank_scores(scores_text, len(batch))
                
                # Combine chunks with scores
                for j, chunk in enumerate(batch):
                    score = scores[j] if j < len(scores) else 0.5
                    scored_chunks.append({
                        "passage": chunk,
                        "score": score
                    })
                    
            except Exception as e:
                logger.warning(f"Batch reranking failed for batch {i//batch_size + 1}: {e}")
                # Fallback to neutral scores for this batch
                for chunk in batch:
                    scored_chunks.append({
                        "passage": chunk,
                        "score": 0.5
                    })
        
        return scored_chunks
    
    def _create_rerank_prompt(self, query: str, passages: List[Dict]) -> Dict:
        """Create reranking prompt"""
        passages_str = "\n---\n".join(
            f"Passage {i+1}: {p['text'][:500]}"
            for i, p in enumerate(passages)
        )
        
        return {
            "system": "You are a relevance scorer. Evaluate the passages based only on how closely they match the query. Use a score from 0.0 (no match) to 1.0 (perfect match). Do not explain, only return scores.",
            "user": f"""### RELEVANCE SCORING:
Query: '{query}'

Passages:
{passages_str}

Score each passage from 0.0 to 1.0 based on relevance.
Output format: score1|score2|...|scoreN"""
        }
    
    def _parse_rerank_scores(self, scores_text: str, expected_count: int) -> List[float]:
        """Parse LLM reranking scores from response"""
        try:
            # Expected format: "0.8|0.6|0.9|0.3|0.7"
            if "|" in scores_text:
                score_strings = scores_text.split("|")
            else:
                # Fallback: try to extract numbers
                import re
                score_strings = re.findall(r'\d+\.?\d*', scores_text)
            
            scores = []
            for score_str in score_strings:
                try:
                    score = float(score_str.strip())
                    # Clamp score between 0 and 1
                    score = max(0.0, min(1.0, score))
                    scores.append(score)
                except ValueError:
                    scores.append(0.5)  # Default score
            
            # Pad or truncate to expected count
            while len(scores) < expected_count:
                scores.append(0.5)
            
            return scores[:expected_count]
            
        except Exception as e:
            logger.warning(f"Score parsing failed: {e}")
            return [0.5] * expected_count
    
    def _apply_section_boosting(self, scored_chunks: List[Dict]) -> List[Dict]:
        """Apply section-based boosting to scored chunks"""
        boosted_chunks = []
        
        for chunk_data in scored_chunks:
            chunk = chunk_data["passage"]
            base_score = chunk_data["score"]
            
            # Extract section information from metadata
            metadata = chunk.get("metadata", {})
            section = metadata.get("section", "OTHER")
            section_weight = self.section_weights.get(section, 1.0)
            
            # Apply section boosting
            boosted_score = base_score * section_weight
            
            boosted_chunks.append({
                "passage": chunk,
                "score": min(1.0, boosted_score)  # Cap at 1.0
            })
        
        return boosted_chunks
    
    def _apply_content_type_boosting(self, query: str, scored_chunks: List[Dict]) -> List[Dict]:
        """Apply content-type boosting based on query intent"""
        boosted_chunks = []
        query_lower = query.lower()
        
        # Detect query intent
        table_keywords = ["table", "data", "results", "values", "numbers", "statistics"]
        figure_keywords = ["figure", "image", "diagram", "chart", "graph", "visualization"]
        
        is_table_query = any(keyword in query_lower for keyword in table_keywords)
        is_figure_query = any(keyword in query_lower for keyword in figure_keywords)
        
        for chunk_data in scored_chunks:
            chunk = chunk_data["passage"]
            base_score = chunk_data["score"]
            
            # Get content type from metadata
            metadata = chunk.get("metadata", {})
            content_type = metadata.get("content_type", "text")
            
            # Apply content-type boosting
            boost_factor = 1.0
            if is_table_query and content_type == "table":
                boost_factor = 1.5
            elif is_figure_query and content_type == "figure":
                boost_factor = 1.4
            elif content_type in ["table", "figure"] and not (is_table_query or is_figure_query):
                boost_factor = 1.2
            
            final_score = base_score * boost_factor
            boosted_chunks.append({
                "passage": chunk,
                "score": min(1.0, final_score)
            })
        
        return boosted_chunks
    
    def _simple_fallback_rerank(self, query: str, chunks: List[Dict], top_k: int) -> List[Dict]:
        """Fallback to simple keyword-based reranking"""
        scored_chunks = []
        query_terms = query.lower().split()
        
        for chunk in chunks:
            text = chunk["text"].lower()
            
            # Calculate relevance score
            score = 0
            for term in query_terms:
                score += text.count(term)
            
            # Boost score for important document terms
            important_terms = ["table", "figure", "data", "results", "analysis", "study", "method"]
            for term in important_terms:
                if term in text:
                    score += 2
            
            # Normalize score
            max_possible_score = len(query_terms) * 10 + len(important_terms) * 2
            normalized_score = min(1.0, score / max_possible_score) if max_possible_score > 0 else 0.5
            
            scored_chunks.append({
                "passage": chunk,
                "score": normalized_score
            })
        
        # Sort by score and return top_k
        scored_chunks.sort(key=lambda x: x["score"], reverse=True)
        return scored_chunks[:top_k] 