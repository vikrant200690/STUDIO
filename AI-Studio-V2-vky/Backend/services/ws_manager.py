from fastapi import WebSocket
from typing import List


class WebSocketManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        # Broadcast JSON message to all active connections
        living_connections = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
                living_connections.append(connection)
            except Exception:
                # Connection might be closed/disconnected, do not keep it
                pass
        self.active_connections = living_connections


# Singleton instance for reuse
ws_manager = WebSocketManager()
