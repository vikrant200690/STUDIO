import time
import logging
from deepgram import DeepgramClient, PrerecordedOptions, FileSource

class DeepgramTranscriber:
    def __init__(self, api_key: str, timeout: int = 60, retries: int = 3):
        self.api_key = api_key
        self.timeout = timeout
        self.retries = retries
        self.deepgram = DeepgramClient(api_key)

    async def transcribe(self, audio_data: bytes) -> str:
        for attempt in range(self.retries):
            try:
                payload: FileSource = {"buffer": audio_data}
                options = PrerecordedOptions(model="nova-3", smart_format=True)
                response = self.deepgram.listen.rest.v("1").transcribe_file(payload, options)
                if response.results and response.results.channels:
                    alternatives = response.results.channels[0].alternatives
                    if alternatives:
                        return alternatives[0].transcript
                return ""
            except Exception as e:
                logging.error(f"Transcription attempt {attempt+1} failed: {e}")
                if attempt < self.retries - 1:
                    time.sleep(2)
        return ""
