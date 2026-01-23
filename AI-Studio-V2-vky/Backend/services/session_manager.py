import os
import uuid
import time
import json
import snowflake.connector
from typing import Dict, List, Optional
from datetime import datetime, timedelta


class DocumentSessionManager:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DocumentSessionManager, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return

        self._initialized = True
        self.sessions: Dict[str, Dict] = {}
        # session_id -> [doc_ids]
        self.session_documents: Dict[str, List[str]] = {}
        self.session_start_times: Dict[str, float] = {}

        # Initialize Snowflake connection
        self.snowflake_config = self._get_snowflake_config()

    def _get_snowflake_config(self):
        """Get Snowflake configuration from environment variables"""
        return {
            'user': os.getenv('SNOWFLAKE_USER'),
            'password': os.getenv('SNOWFLAKE_PASSWORD'),
            'account': os.getenv('SNOWFLAKE_ACCOUNT'),
            'warehouse': os.getenv('SNOWFLAKE_WAREHOUSE'),
            'database': os.getenv('SNOWFLAKE_DATABASE'),
            'schema': os.getenv('SNOWFLAKE_SCHEMA'),
            'role': os.getenv('SNOWFLAKE_ROLE')  # Optional
        }

    def create_session(self) -> str:
        """Create a new session and return session ID"""
        session_id = str(uuid.uuid4())
        self.sessions[session_id] = {
            'created_at': datetime.now().isoformat(),
            'status': 'active',
            'document_count': 0
        }
        self.session_documents[session_id] = []
        self.session_start_times[session_id] = time.time()

        print(f"🆕 Created new session: {session_id}")
        return session_id

    def add_document(self, session_id: str, doc_id: str, filename: str, content_summary: str, file_type: str):
        """Add a document to a session"""
        if session_id not in self.sessions:
            print(f"⚠️ Session {session_id} not found, creating new one")
            session_id = self.create_session()

        # Add document to session
        if doc_id not in self.session_documents[session_id]:
            self.session_documents[session_id].append(doc_id)
            self.sessions[session_id]['document_count'] = len(
                self.session_documents[session_id])

        print(f"📄 Added document {doc_id} to session {session_id}")
        print(
            f"📊 Session {session_id} now has {self.sessions[session_id]['document_count']} documents")

        return session_id

    def get_session_summary(self) -> Dict:
        """Get summary of all active sessions"""
        active_sessions = {}
        for session_id, session_data in self.sessions.items():
            if session_data['status'] == 'active':
                active_sessions[session_id] = {
                    'created_at': session_data['created_at'],
                    'document_count': session_data['document_count'],
                    'age_minutes': round((time.time() - self.session_start_times.get(session_id, 0)) / 60, 1)
                }

        return {
            'total_sessions': len(active_sessions),
            'sessions': active_sessions
        }

    def cleanup_session(self, session_id: str, snowflake_conn=None) -> Dict:
        """Clean up a specific session and delete all associated data"""
        if session_id not in self.sessions:
            return {"error": "Session not found"}

        try:
            # Get documents for this session
            doc_ids = self.session_documents.get(session_id, [])

            # Delete chunks and documents from Snowflake
            deleted_chunks = self._delete_session_chunks(
                session_id, snowflake_conn)
            deleted_docs = self._delete_session_documents(
                session_id, snowflake_conn)

            # Clean up session data
            del self.sessions[session_id]
            del self.session_documents[session_id]
            if session_id in self.session_start_times:
                del self.session_start_times[session_id]

            print(f"🧹 Cleaned up session {session_id}")
            print(f"   - Deleted {deleted_chunks} chunks")
            print(f"   - Deleted {deleted_docs} documents")

            return {
                "success": True,
                "session_id": session_id,
                "deleted_chunks": deleted_chunks,
                "deleted_documents": deleted_docs
            }

        except Exception as e:
            print(f"❌ Error cleaning up session {session_id}: {str(e)}")
            return {"error": str(e)}

    def cleanup_all_sessions(self, snowflake_conn=None) -> Dict:
        """Clean up all sessions (for testing/debugging)"""
        session_ids = list(self.sessions.keys())
        total_deleted = 0

        for session_id in session_ids:
            result = self.cleanup_session(session_id, snowflake_conn)
            if result.get("success"):
                total_deleted += 1

        return {
            "success": True,
            "total_sessions_cleaned": total_deleted,
            "message": f"Cleaned up {total_deleted} sessions"
        }

    def _delete_session_chunks(self, session_id: str, snowflake_conn=None) -> int:
        """Delete all chunks for documents in a session"""
        try:
            # Use provided connection or create new one
            if snowflake_conn is None:
                conn = snowflake.connector.connect(**self.snowflake_config)
                should_close = True
            else:
                conn = snowflake_conn
                should_close = False

            try:
                # Get document IDs for this session
                doc_ids = self.session_documents.get(session_id, [])
                if not doc_ids:
                    return 0

                # Delete chunks for these documents
                placeholders = ','.join(['%s'] * len(doc_ids))
                cursor = conn.cursor()
                cursor.execute(f"""
                    DELETE FROM document_chunks 
                    WHERE doc_id IN ({placeholders})
                """, doc_ids)

                deleted_count = cursor.rowcount
                conn.commit()
                print(
                    f"🗑️ Deleted {deleted_count} chunks for session {session_id}")
                return deleted_count

            finally:
                if should_close:
                    conn.close()

        except Exception as e:
            print(
                f"❌ Error deleting chunks for session {session_id}: {str(e)}")
            return 0

    def _delete_session_documents(self, session_id: str, snowflake_conn=None) -> int:
        """Delete all documents for a session"""
        try:
            # Use provided connection or create new one
            if snowflake_conn is None:
                conn = snowflake.connector.connect(**self.snowflake_config)
                should_close = True
            else:
                conn = snowflake_conn
                should_close = False

            try:
                # Get document IDs for this session
                doc_ids = self.session_documents.get(session_id, [])
                if not doc_ids:
                    return 0

                # Delete documents
                placeholders = ','.join(['%s'] * len(doc_ids))
                cursor = conn.cursor()
                cursor.execute(f"""
                    DELETE FROM documents 
                    WHERE doc_id IN ({placeholders})
                """, doc_ids)

                deleted_count = cursor.rowcount
                conn.commit()
                print(
                    f"🗑️ Deleted {deleted_count} documents for session {session_id}")
                return deleted_count

            finally:
                if should_close:
                    conn.close()

        except Exception as e:
            print(
                f"❌ Error deleting documents for session {session_id}: {str(e)}")
            return 0

    def get_session_info(self, session_id: str) -> Optional[Dict]:
        """Get information about a specific session"""
        if session_id not in self.sessions:
            return None

        session_data = self.sessions[session_id]
        doc_ids = self.session_documents.get(session_id, [])

        return {
            'session_id': session_id,
            'created_at': session_data['created_at'],
            'status': session_data['status'],
            'document_count': session_data['document_count'],
            'document_ids': doc_ids,
            'age_minutes': round((time.time() - self.session_start_times.get(session_id, 0)) / 60, 1)
        }

    def has_active_documents(self) -> bool:
        """Check if there are any active documents across all sessions"""
        total_docs = sum(len(docs) for docs in self.session_documents.values())
        return total_docs > 0

    def get_active_documents(self) -> List[Dict]:
        """Get all active documents across all sessions"""
        active_docs = []
        for session_id, doc_ids in self.session_documents.items():
            for doc_id in doc_ids:
                active_docs.append({
                    'doc_id': doc_id,
                    'session_id': session_id
                })
        return active_docs

    def get_documents_for_session(self, session_id: str) -> List[str]:
        """Get document IDs for a specific session"""
        return self.session_documents.get(session_id, [])

    def get_current_session_id(self) -> Optional[str]:
        """Get the most recent session ID"""
        if not self.sessions:
            return None
        # Return the most recent session
        latest_session = max(self.sessions.items(),
                             key=lambda x: x[1]['created_at'])
        return latest_session[0]

    def store_pdf_metadata(self, doc_id: str, pdf_metadata: Dict):
        """Store PDF metadata for a document"""
        try:
            # Initialize PDF metadata storage if it doesn't exist
            if not hasattr(self, 'pdf_metadata'):
                self.pdf_metadata = {}

            # Store metadata for this document
            self.pdf_metadata[doc_id] = {
                'metadata': pdf_metadata,
                'stored_at': datetime.now().isoformat(),
                'document_id': doc_id
            }

            print(f"💾 PDF metadata stored for document {doc_id}")
            print(
                f"   📄 Pages: {pdf_metadata.get('document_summary', {}).get('total_pages', 0)}")
            print(
                f"   📊 Tables: {pdf_metadata.get('document_summary', {}).get('total_tables', 0)}")
            print(
                f"   🖼️ Figures: {pdf_metadata.get('document_summary', {}).get('total_figures', 0)}")

        except Exception as e:
            print(f"❌ Failed to store PDF metadata for document {doc_id}: {e}")

    def get_pdf_metadata(self, doc_id: str) -> Optional[Dict]:
        """Retrieve PDF metadata for a document"""
        try:
            if hasattr(self, 'pdf_metadata') and doc_id in self.pdf_metadata:
                return self.pdf_metadata[doc_id]
            return None
        except Exception as e:
            print(
                f"❌ Failed to retrieve PDF metadata for document {doc_id}: {e}")
            return None

    def get_all_pdf_metadata(self) -> Dict:
        """Get all stored PDF metadata"""
        try:
            if hasattr(self, 'pdf_metadata'):
                return self.pdf_metadata
            return {}
        except Exception as e:
            print(f"❌ Failed to retrieve all PDF metadata: {e}")
            return {}

    def clear_session(self):
        """Clear all documents from current session"""
        try:
            # Get current session ID
            current_session_id = self.get_current_session_id()
            if current_session_id:
                # Clean up the current session
                result = self.cleanup_session(current_session_id)
                print(f"🧹 Session cleared: {result}")
                return result
            else:
                print("ℹ️ No active session to clear")
                return {"message": "No active session to clear"}
        except Exception as e:
            print(f"❌ Error clearing session: {e}")
            return {"error": str(e)}
