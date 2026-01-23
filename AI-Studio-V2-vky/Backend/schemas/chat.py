from pydantic import BaseModel
from typing import List, Optional

class ChatRequest(BaseModel):
    model: str
    temperature: float = 0.7
    system_message: Optional[str] = "You are a helpful assistant."
    max_tokens: int = 500
    top_p: float = 1.0
    chat_history: List[dict]
