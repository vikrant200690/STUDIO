import time
import logging
from deepgram import DeepgramClient, SpeakOptions
import os 
class ConvertToSpeech:
    @staticmethod
    async def text_to_speech(text: str, api_key: str) -> bytes | None:
        try:
            deepgram = DeepgramClient(api_key)
            model = os.getenv("DEEPGRAM_TTS_MODEL", "aura-2-thalia-en").strip()
            options = SpeakOptions(model=model)
            response =deepgram.speak.v("1").stream_memory({"text": text}, options)
            return response.stream.getvalue()
        except Exception as e:
            logging.error(f"TTS error: {e}")
            return None
