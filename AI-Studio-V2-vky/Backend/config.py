import os
from dotenv import load_dotenv
load_dotenv(dotenv_path="/mnt/nvme/workspace/Ai Studio/AI-Studio-V2/Backend/.env")

class Settings:
    def __init__(self):
        self.LLM_SYSTEM_PROMPT = self.getPrompt()


    def getPrompt(self):
    # Provide the system prompt for the LLM
        # This prompt is designed to guide the LLM in generating responses that are casual, engaging
        prompt = """
        You're a friendly voice assistant, chatting like a buddy on a call.
        - Respond in exactly 2-3 short and strictly precise sentences with a casual, engaging tone.
        - Avoid lists, bullet points, or structured formats; use natural, flowing sentences.
        - Keep it clear, simple, and relevant for any topic, like you're talking to a friend.
        """

        return prompt
