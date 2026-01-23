import openai
import os
from dotenv import load_dotenv
from schemas.chat import ChatRequest
from typing import AsyncGenerator

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

async def stream_openai_response(chat: ChatRequest) -> AsyncGenerator[str, None]:
    messages = [{"role": "system", "content": chat.system_message}] + chat.chat_history
    response = openai.ChatCompletion.create(
        model=chat.model,
        temperature=chat.temperature,
        max_tokens=chat.max_tokens,
        top_p=chat.top_p,
        messages=messages,
        stream=True
    )

    collected = ""
    for chunk in response:
        if "choices" in chunk:
            delta = chunk["choices"][0]["delta"]
            content = delta.get("content", "")
            collected += content
            yield content
    chat.chat_history.append({"role": "assistant", "content": collected})
