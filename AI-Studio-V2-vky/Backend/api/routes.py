from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
import os
from openai import OpenAI
import traceback
import uuid
from datetime import datetime
 
# NEW IMPORTS
from services.responder import Responsellm
from services.file_service import FileService
from services.embedding_service import EmbeddingService
 
# Load .env once at the top
load_dotenv()
 
router = APIRouter()
 
# Initialize services
file_service = FileService()
embedding_service = EmbeddingService()
responder = Responsellm()
 
# Add cleanup request model
 
 
class CleanupSessionRequest(BaseModel):
    session_id: str
 
 
PLUGIN_FILE_MAP = {
    "insight-logger": "logging_utils-0.1.0-py3-none-any.whl",
    "confique": "config_loader-0.1.0-py3-none-any.whl",
    "api-bridge": "frontend_api-0.1.2-py3-none-any.whl",
    "docflow": "docflow-1.0.2-py3-none-any.whl",
    "intelligence-agent": "ai_utility_orchestrator-0.1.0-py3-none-any.whl",
    "vocalis": "voice_assistant-0.1.0-py3-none-any.whl",
}
 
 
class ChatRequest(BaseModel):
    model: str
    temperature: float
    top_p: float
    system_prompt: Optional[str] = "You are a helpful assistant."
    user_message: str
    document_mode: Optional[bool] = False
 
 
@router.post("/chat")
async def chat(payload: ChatRequest):
    print("Received payload:", payload)
    try:
        # Use enhanced responder with document context and out-of-scope detection
        result = await responder.generate_response(
            transcript=payload.user_message,
            system_prompt=payload.system_prompt,
            model=payload.model,
            temperature=payload.temperature,
            top_p=payload.top_p,
            document_mode=payload.document_mode
        )
 
        # Add session information to response
        session_summary = embedding_service.session_manager.get_session_summary()
        result["session_info"] = session_summary
 
        return result
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})
 
 
@router.post("/upload-document")
async def upload_document(file: UploadFile = File(...)):
    try:
        # Generate a unique document ID
        doc_id = str(uuid.uuid4())
 
        # Upload file and process
        result = await file_service.upload_file(file, doc_id)
 
        # Process document for embeddings
        if result.get("success"):
            embedding_result = await embedding_service.process_document(
                doc_id=doc_id,
                text_content=result["text_content"]
            )
            result["embedding_result"] = embedding_result
 
        return result
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})
 
 
@router.get("/documents")
async def get_documents():
    try:
        # Get documents from Snowflake
        conn = file_service.get_snowflake_connection()
        cursor = conn.cursor()
 
        cursor.execute("""
            SELECT doc_id, filename, file_type, upload_timestamp, status
            FROM documents
            ORDER BY upload_timestamp DESC
        """)
 
        documents = []
        for row in cursor.fetchall():
            documents.append({
                "doc_id": row[0],
                "filename": row[1],
                "file_type": row[2],
                "upload_timestamp": str(row[3]) if row[3] else None,
                "status": row[4]
            })
 
        conn.close()
        return {"documents": documents}
 
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})
 
 
@router.post("/cleanup-session")
async def cleanup_session(payload: CleanupSessionRequest):
    """Clean up a specific session and delete all associated data"""
    try:
        # Use the existing connection from embedding service
        result = embedding_service.session_manager.cleanup_session(
            payload.session_id,
            embedding_service.snowflake_conn
        )
        return result
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})
 
 
@router.delete("/api/cleanup-all-sessions")
async def cleanup_all_sessions():
    """Clean up all sessions (for testing/debugging)"""
    try:
        # Use the existing connection from embedding service
        result = embedding_service.session_manager.cleanup_all_sessions(
            embedding_service.snowflake_conn
        )
        return result
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})
 
 
@router.get("/session-info/{session_id}")
async def get_session_info(session_id: str):
    """Get information about a specific session"""
    try:
        result = embedding_service.session_manager.get_session_info(session_id)
        if result is None:
            return JSONResponse(status_code=404, content={"error": "Session not found"})
        return result
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})
 
 
@router.get("/sessions")
async def get_all_sessions():
    """Get summary of all active sessions"""
    try:
        result = embedding_service.session_manager.get_session_summary()
        return result
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})
 
 
@router.get("/session")
async def get_session_info():
    """Get current session information including active documents"""
    try:
        session_summary = embedding_service.session_manager.get_session_summary()
        return session_summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
 
 
@router.delete("/api/session")
async def clear_session():
    """Clear all documents from current session"""
    try:
        embedding_service.session_manager.clear_session()
        return {"message": "Session cleared successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
 
 
@router.get("/plugins/download/{plugin_id}")
async def download_plugin(plugin_id: str):
    base_dir = os.path.dirname(__file__)
    plugins_dir = os.path.abspath(os.path.join(base_dir, "../plugins_repo"))
    filename = PLUGIN_FILE_MAP.get(plugin_id)
 
    print("[DEBUG] plugin_id:", plugin_id)
    print("[DEBUG] resolved filename:", filename)
    print("[DEBUG] plugins_dir:", plugins_dir)
 
    if not filename:
        raise HTTPException(status_code=404, detail="Plugin not found in map")
 
    file_path = os.path.join(plugins_dir, filename)
    print("[DEBUG] full file_path:", file_path)
 
    if not os.path.isfile(file_path):
        print(f"[ERROR] File not found: {file_path}")
        raise HTTPException(status_code=404, detail="Wheel file missing.")
 
    return FileResponse(
        path=file_path,
        media_type="application/octet-stream",
        filename=filename
    )
 
# PDF Metadata Endpoints
 
 
@router.get("/pdf-metadata/{doc_id}")
async def get_pdf_metadata(doc_id: str):
    """Get PDF metadata for a specific document"""
    try:
        pdf_metadata = embedding_service.session_manager.get_pdf_metadata(
            doc_id)
        if pdf_metadata is None:
            return JSONResponse(status_code=404, content={"error": "PDF metadata not found for this document"})
        return pdf_metadata
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})
 
 
@router.get("/pdf-metadata")
async def get_all_pdf_metadata():
    """Get all stored PDF metadata"""
    try:
        all_metadata = embedding_service.session_manager.get_all_pdf_metadata()
        return {"pdf_metadata": all_metadata}
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})
 
 
@router.get("/pdf-summary/{doc_id}")
async def get_pdf_summary(doc_id: str):
    """Get a summary of PDF content with page numbers"""
    try:
        pdf_metadata = embedding_service.session_manager.get_pdf_metadata(
            doc_id)
        if pdf_metadata is None:
            return JSONResponse(status_code=404, content={"error": "PDF metadata not found for this document"})
 
        metadata = pdf_metadata.get('metadata', {})
        document_summary = metadata.get('document_summary', {})
        page_summary = metadata.get('page_summary', [])
        table_summary = metadata.get('table_summary', [])
        figure_summary = metadata.get('figure_summary', [])
 
        summary = {
            "document_id": doc_id,
            "total_pages": document_summary.get('total_pages', 0),
            "total_tables": document_summary.get('total_tables', 0),
            "total_figures": document_summary.get('total_figures', 0),
            "total_text_characters": document_summary.get('total_text_characters', 0),
            "extraction_timestamp": document_summary.get('extraction_timestamp'),
            "page_details": page_summary,
            "table_details": table_summary,
            "figure_details": figure_summary,
            "content_distribution": metadata.get('content_distribution', {})
        }
 
        return summary
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})