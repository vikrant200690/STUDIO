from fastapi import APIRouter, HTTPException, Query, WebSocket, WebSocketDisconnect, Depends
from fastapi.responses import JSONResponse
from typing import Optional
import asyncio
import json
import jwt
import os
from services.analytics_service import AnalyticsService
from services.analytics_websocket import analytics_ws_manager
from utils.logger import get_logger
from services.api_usage_tracker import extract_user_id_from_request
from fastapi import Request
 
logger = get_logger("analytics_api")
 
router = APIRouter()
analytics_service = AnalyticsService()
 
# JWT config
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")
JWT_ALGORITHM = "HS256"
 
 
async def get_current_user_id(request: Request) -> Optional[str]:
    """Dependency to extract user_id from request"""
    user_id = extract_user_id_from_request(request)
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")
    return user_id
 
 
@router.get("/analytics/metrics")
async def get_dashboard_metrics(request: Request):
    """Get dashboard metrics for the authenticated user"""
    try:
        user_id = await get_current_user_id(request)
        metrics = analytics_service.get_dashboard_metrics(user_id=user_id)
        return JSONResponse(content=metrics)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting dashboard metrics: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to retrieve dashboard metrics")
 
 
@router.get("/analytics/usage")
async def get_usage_data(
    request: Request,
    time_range: Optional[str] = Query(
        "30D", description="Time range: 7D, 30D, 90D, 1Y"),
    custom_days: Optional[int] = Query(
        None, description="Custom number of days")
):
    """Get usage time series data for the authenticated user"""
    try:
        user_id = await get_current_user_id(request)
        
        if custom_days:
            series_data = analytics_service.get_custom_usage_data(custom_days, user_id=user_id)
            return JSONResponse(content={"series": series_data})
        else:
            usage_series = analytics_service.get_usage_series(user_id=user_id)
            if time_range in usage_series:
                return JSONResponse(content={"series": usage_series[time_range]})
            else:
                return JSONResponse(content={"series": usage_series.get("30D", [])})
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting usage data: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to retrieve usage data")
 
 
@router.get("/analytics/models")
async def get_model_distribution(request: Request):
    """Get model usage distribution for the authenticated user"""
    try:
        user_id = await get_current_user_id(request)
        distribution = analytics_service.get_model_distribution(user_id=user_id)
        return JSONResponse(content={"distribution": distribution})
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting model distribution: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to retrieve model distribution")
 
 
@router.get("/analytics/endpoints")
async def get_endpoint_stats(request: Request):
    """Get statistics by endpoint for the authenticated user"""
    try:
        user_id = await get_current_user_id(request)
        stats = analytics_service.get_endpoint_stats(user_id=user_id)
        return JSONResponse(content={"endpoints": stats})
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting endpoint stats: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to retrieve endpoint statistics")
 
 
@router.get("/analytics/realtime")
async def get_realtime_metrics(request: Request):
    """Get real-time metrics snapshot for the authenticated user"""
    try:
        user_id = await get_current_user_id(request)
        metrics = analytics_service.get_real_time_metrics(user_id=user_id)
        return JSONResponse(content=metrics)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting real-time metrics: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to retrieve real-time metrics")
 
 
from fastapi import Cookie
from typing import Optional
 
@router.websocket("/ws/analytics")
async def websocket_analytics(
    websocket: WebSocket,
    token: Optional[str] = Query(None, description="JWT access token"),
    access_token: Optional[str] = Cookie(None),  # Try to get from cookies
    session: Optional[str] = Cookie(None)  # Alternative cookie name
):
    """WebSocket endpoint for real-time analytics streaming"""
    
    # Priority order: query param > access_token cookie > session cookie > other cookies
    if not token:
        token = access_token or session
    
    if not token:
        # Try to extract from any cookie
        token = websocket.cookies.get("access_token") or \
                websocket.cookies.get("session") or \
                websocket.cookies.get("token")
    
    if not token:
        logger.error(f"WebSocket connection rejected: No token provided. Cookies: {websocket.cookies}")
        await websocket.close(code=1008, reason="Authentication required")
        return
    
    # Decode token to get user_id
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("user_id")
        if not user_id:
            logger.error("WebSocket connection rejected: Invalid token (no user_id)")
            await websocket.close(code=1008, reason="Invalid token")
            return
    except jwt.ExpiredSignatureError:
        logger.error("WebSocket connection rejected: Token expired")
        await websocket.close(code=1008, reason="Token expired")
        return
    except jwt.InvalidTokenError as e:
        logger.error(f"WebSocket auth failed: Invalid token - {e}")
        await websocket.close(code=1008, reason="Invalid token")
        return
    except Exception as e:
        logger.error(f"WebSocket auth failed: {e}")
        await websocket.close(code=1008, reason="Authentication failed")
        return
    
    await analytics_ws_manager.connect(websocket, user_id)
    logger.info(f"✅ Analytics WebSocket client connected for user: {user_id}")
 
    try:
        # Send initial data
        await analytics_ws_manager.send_initial_data(websocket, user_id)
 
        # Keep connection alive
        while True:
            try:
                message = await asyncio.wait_for(websocket.receive_json(), timeout=1.0)
                await analytics_ws_manager.handle_client_message(websocket, message, user_id)
 
            except asyncio.TimeoutError:
                continue
            except WebSocketDisconnect:
                logger.info(f"Analytics WebSocket client disconnected for user: {user_id}")
                break
            except Exception as e:
                logger.debug(f"WebSocket receive error (normal): {e}")
                await asyncio.sleep(1)
 
    except WebSocketDisconnect:
        logger.info(f"Analytics WebSocket client disconnected for user: {user_id}")
    except Exception as e:
        logger.error(f"Unexpected error in WebSocket analytics: {e}")
    finally:
        analytics_ws_manager.disconnect(websocket)
 
@router.get("/analytics/connections")
async def get_analytics_connections():
    """Get analytics WebSocket connection status"""
    return JSONResponse(content={
        "active_connections": analytics_ws_manager.get_connection_count(),
        "is_broadcasting": analytics_ws_manager.is_broadcasting
    })
 
 
@router.get("/analytics/test")
async def test_analytics(request: Request):
    """Test endpoint to verify analytics data"""
    try:
        user_id = await get_current_user_id(request)
        metrics = analytics_service.get_dashboard_metrics(user_id=user_id)
        return JSONResponse(content={
            "status": "working",
            "user_id": user_id,
            "sample_metrics": metrics,
            "message": "Analytics service is operational"
        })
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Analytics test failed: {e}")
        return JSONResponse(status_code=500, content={
            "status": "error",
            "error": str(e),
            "message": "Analytics service has issues"
        })
 
 
@router.get("/analytics/health")
async def analytics_health():
    """Health check for analytics service"""
    try:
        analytics_service.get_connection().close()
        return JSONResponse(content={
            "status": "healthy",
            "service": "analytics",
            "timestamp": analytics_service.get_real_time_metrics().get("timestamp")
        })
    except Exception as e:
        logger.error(f"Analytics health check failed: {e}")
        raise HTTPException(
            status_code=503, detail="Analytics service unavailable")