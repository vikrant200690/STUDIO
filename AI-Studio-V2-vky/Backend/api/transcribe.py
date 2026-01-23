import base64
import os
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from services.transcriber import DeepgramTranscriber
from services.tts import ConvertToSpeech
from services.responder import Responsellm

app = APIRouter()


@app.post("/transcribe")
async def transcribe_audio(
    audio: UploadFile = File(...),
    document_mode: bool = Form(False)
):

    try:
        deepgram_api_key = os.getenv("DEEPGRAM_API_KEY")
        if not deepgram_api_key:
            raise HTTPException(
                status_code=500, detail="DEEPGRAM_API_KEY not found")

        audio_data = await audio.read()
        if len(audio_data) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=400, detail="Audio file exceeds 10MB limit")

        transcriber = DeepgramTranscriber(deepgram_api_key)
        transcript = await transcriber.transcribe(audio_data)

        if transcript:
            # Create instance of Responsellm and call generate_response
            responder = Responsellm()
            response_data = await responder.generate_response(transcript, document_mode=document_mode)
            response = response_data.get("response") if response_data else None
            sources = response_data.get("sources", []) if response_data else []
            context_used = response_data.get(
                "context_used", False) if response_data else False
        else:
            response = None
            sources = []
            context_used = False

        # Only generate audio if we have a text response
        audio_response = None
        if response and isinstance(response, str):
            audio_response = await ConvertToSpeech.text_to_speech(response, deepgram_api_key)

        if audio_response:
            audio_base64 = base64.b64encode(audio_response).decode("utf-8")
            return {
                "transcript": transcript,
                "response": response,
                "audio": audio_base64,
                "audio_format": "mp3",
                "sources": sources,
                "context_used": context_used,
                "document_mode": document_mode
            }

        return {
            "transcript": transcript,
            "response": response,
            "audio": None,
            "audio_format": None,
            "sources": sources,
            "context_used": context_used,
            "document_mode": document_mode
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Voice transcription error: {str(e)}")
