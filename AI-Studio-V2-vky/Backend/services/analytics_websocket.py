import asyncio
from typing import Set, Dict
from fastapi import WebSocket
from services.analytics_service import AnalyticsService
from utils.logger import get_logger
from starlette.websockets import WebSocketDisconnect
from uvicorn.protocols.utils import ClientDisconnected
 
logger = get_logger("analytics_websocket")
 
class AnalyticsWebSocketManager:
    """Enhanced WebSocket manager specifically for analytics streaming with user context"""
    
    def __init__(self):
        # Store connections with user_id mapping
        self.active_connections: Dict[WebSocket, str] = {}  # websocket -> user_id
        self.analytics_service = AnalyticsService()
        self.broadcast_tasks: Dict[str, asyncio.Task] = {}  # user_id -> task
        self.is_broadcasting = False
    
    async def connect(self, websocket: WebSocket, user_id: str):
        """Connect a new WebSocket client with user context"""
        await websocket.accept()
        self.active_connections[websocket] = user_id
        logger.info(f"Analytics WebSocket client connected for user {user_id}. Total: {len(self.active_connections)}")
        
        # Start broadcasting for this user if not already running
        if user_id not in self.broadcast_tasks:
            await self.start_broadcasting_for_user(user_id)
    
    def disconnect(self, websocket: WebSocket):
        """Disconnect a WebSocket client"""
        user_id = self.active_connections.get(websocket)
        if websocket in self.active_connections:
            del self.active_connections[websocket]
            
        logger.info(f"Analytics WebSocket client disconnected for user {user_id}. Total: {len(self.active_connections)}")
        
        # Stop broadcasting for this user if no more connections
        if user_id and not self._has_active_connections_for_user(user_id):
            self.stop_broadcasting_for_user(user_id)
    
    def _has_active_connections_for_user(self, user_id: str) -> bool:
        """Check if there are any active connections for a specific user"""
        return any(uid == user_id for uid in self.active_connections.values())
    
    def _get_connections_for_user(self, user_id: str) -> Set[WebSocket]:
        """Get all active connections for a specific user"""
        return {ws for ws, uid in self.active_connections.items() if uid == user_id}
    
    async def send_to_client(self, websocket: WebSocket, data: dict):
        """Send data to a specific client"""
        try:
            logger.info(f"Sending data to client: {len(str(data))} characters")
            await websocket.send_json(data)
            logger.info("Data sent successfully to client")
        except Exception as e:
            logger.error(f"Failed to send data to client: {e}", exc_info=True)
            self.disconnect(websocket)
    
    async def broadcast_to_user(self, user_id: str, data: dict):
        """Safely broadcast analytics data to all connected clients for a specific user"""
        user_connections = self._get_connections_for_user(user_id)
        
        if not user_connections:
            return
 
        disconnected_clients = set()
 
        for websocket in user_connections:
            try:
                await websocket.send_json(data)
 
            except (WebSocketDisconnect, ClientDisconnected):
                disconnected_clients.add(websocket)
 
            except Exception as e:
                logger.debug(f"WebSocket send skipped: {e}")
                disconnected_clients.add(websocket)
 
        # Cleanup disconnected sockets
        for websocket in disconnected_clients:
            self.disconnect(websocket)
 
        # Stop broadcasting if nobody is connected for this user
        if not self._has_active_connections_for_user(user_id):
            self.stop_broadcasting_for_user(user_id)
 
    async def start_broadcasting_for_user(self, user_id: str):
        """Start the background broadcasting task for a specific user"""
        if user_id in self.broadcast_tasks:
            return
            
        self.broadcast_tasks[user_id] = asyncio.create_task(
            self._broadcast_loop_for_user(user_id)
        )
        self.is_broadcasting = True
        logger.info(f"Started analytics broadcasting for user: {user_id}")
    
    def stop_broadcasting_for_user(self, user_id: str):
        """Stop the background broadcasting task for a specific user"""
        if user_id not in self.broadcast_tasks:
            return
        
        task = self.broadcast_tasks[user_id]
        task.cancel()
        del self.broadcast_tasks[user_id]
        
        if not self.broadcast_tasks:
            self.is_broadcasting = False
            
        logger.info(f"Stopped analytics broadcasting for user: {user_id}")
    
    async def _broadcast_loop_for_user(self, user_id: str):
        """Background loop for broadcasting analytics updates for a specific user"""
        logger.info(f"Starting analytics broadcast loop for user: {user_id}")
        
        while self._has_active_connections_for_user(user_id):
            try:
                # Get fresh analytics data for this user
                logger.info(f"Fetching analytics data for user {user_id}...")
                analytics_data = self.analytics_service.get_real_time_metrics(user_id=user_id)
                logger.info(f"Analytics data fetched for user {user_id}: {analytics_data}")
 
                # Broadcast to all connected clients for this user
                await self.broadcast_to_user(user_id, analytics_data)
 
                user_connections = self._get_connections_for_user(user_id)
                logger.info(f"Broadcasted analytics to {len(user_connections)} clients for user {user_id}")
 
                # Wait 30 seconds before next broadcast
                await asyncio.sleep(30)
 
            except asyncio.CancelledError:
                logger.info(f"Analytics broadcast loop cancelled for user: {user_id}")
                break
            except Exception as e:
                logger.error(f"Error in analytics broadcast loop for user {user_id}: {e}", exc_info=True)
                await asyncio.sleep(10)
 
        logger.info(f"Analytics broadcast loop ended for user: {user_id}")
        if user_id in self.broadcast_tasks:
            del self.broadcast_tasks[user_id]
    
    async def send_initial_data(self, websocket: WebSocket, user_id: str):
        """Send initial analytics data to a newly connected client"""
        try:
            logger.info(f"Fetching initial analytics data for user: {user_id}...")
            initial_data = self.analytics_service.get_real_time_metrics(user_id=user_id)
            logger.info(f"Initial data fetched for user {user_id}: {initial_data}")
            await self.send_to_client(websocket, initial_data)
            logger.info(f"Sent initial analytics data to new client for user: {user_id}")
        except Exception as e:
            logger.error(f"Failed to send initial data for user {user_id}: {e}", exc_info=True)
    
    def get_connection_count(self) -> int:
        """Get the number of active connections"""
        return len(self.active_connections)
    
    async def handle_client_message(self, websocket: WebSocket, message: dict, user_id: str):
        """Handle messages from clients (if needed for interactive features)"""
        try:
            message_type = message.get('type')
            
            if message_type == 'ping':
                await self.send_to_client(websocket, {'type': 'pong'})
            elif message_type == 'request_update':
                # Send immediate update for this user
                data = self.analytics_service.get_real_time_metrics(user_id=user_id)
                await self.send_to_client(websocket, data)
            elif message_type == 'custom_query':
                # Handle custom analytics queries for this user
                days = message.get('days', 30)
                custom_data = self.analytics_service.get_custom_usage_data(days, user_id=user_id)
                await self.send_to_client(websocket, {
                    'type': 'custom_data',
                    'data': custom_data
                })
            else:
                logger.warning(f"Unknown message type: {message_type}")
                
        except Exception as e:
            logger.error(f"Error handling client message for user {user_id}: {e}")
 
# Global instance
analytics_ws_manager = AnalyticsWebSocketManager()