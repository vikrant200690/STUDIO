# routes/export.py
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from schemas.auth import ExportRequest
from utils.exporters import export_txt, export_json, export_pdf
from io import BytesIO

router = APIRouter(prefix="/export", tags=["Export"])


@router.post("/")
def export_conversation(payload: ExportRequest):
    messages = [m.dict() for m in payload.messages]

    if payload.format == "txt":
        data = export_txt(messages)
        media_type = "text/plain"
        filename = "conversation.txt"

    elif payload.format == "json":
        data = export_json(messages)
        media_type = "application/json"
        filename = "conversation.json"

    elif payload.format == "pdf":
        data = export_pdf(messages)
        media_type = "application/pdf"
        filename = "conversation.pdf"

    return StreamingResponse(
        BytesIO(data),
        media_type=media_type,
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        },
    )
