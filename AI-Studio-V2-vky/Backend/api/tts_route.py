import base64
import os
import time
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.tts import ConvertToSpeech

app = APIRouter()

class TTSRequest(BaseModel):
    text: str

@app.post("/text-to-speech")
async def text_to_speech_api(request: TTSRequest):
    start_time = time.time()

    try:
        deepgram_api_key = os.getenv("DEEPGRAM_API_KEY")
        if not deepgram_api_key:
            raise HTTPException(status_code=500, detail="DEEPGRAM_API_KEY not found")

        text = request.text.strip()
        print("TTS Text received:", text)

        if not text:
            raise HTTPException(status_code=400, detail="Text input is empty")

        if len(text) > 2000:
            raise HTTPException(status_code=400, detail="Text exceeds 2000 character limit")

        audio_response = await ConvertToSpeech.text_to_speech(
            text,
            deepgram_api_key
        )

        print("Audio response type:", type(audio_response))
        print("Audio response length:", len(audio_response) if audio_response else "None")

        if not audio_response:
            raise HTTPException(status_code=500, detail="Deepgram returned empty audio")

        audio_base64 = base64.b64encode(audio_response).decode("utf-8")

        return {
            "audio": audio_base64,
            "audio_format": "mp3"
        }

    except HTTPException:
        raise
    except Exception as e:
        print("TTS BACKEND ERROR:", str(e))
        raise HTTPException(status_code=500, detail="TTS generation failed")
