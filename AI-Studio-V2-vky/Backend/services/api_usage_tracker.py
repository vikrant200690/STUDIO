import time
import uuid
import json
import asyncio
import jwt
import os
import hashlib
from datetime import datetime
from typing import Optional, Dict, Any
 
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response as StarletteResponse
 
import snowflake.connector
 
from utils.snowflake_setup import get_snowflake_config
from utils.logger import get_logger
 
logger = get_logger("api_usage_tracker")
 
# JWT config (MUST match auth.py)
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")
JWT_ALGORITHM = "HS256"
 
 
# --------------------------------------------------
# JWT USER EXTRACTION
# --------------------------------------------------
 
def extract_user_id_from_request(request: Request) -> Optional[str]:
    """
    Extract user_id from access_token cookie.
    Returns None for unauthenticated users.
    """
    try:
        token = request.cookies.get("access_token")
        if not token:
            return None
 
        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM]
        )
        return payload.get("user_id")
 
    except Exception:
        return None
 
 
# --------------------------------------------------
# TRACKER
# --------------------------------------------------
 
class APIUsageTracker:
    def __init__(self):
        self.snowflake_config = get_snowflake_config()
        
        # Model cost estimation (tokens per dollar)
        self.model_costs = {
            'gpt-4': {'input': 0.03/1000, 'output': 0.06/1000},
            'gpt-4o': {'input': 0.005/1000, 'output': 0.015/1000},
            'gpt-4o-mini': {'input': 0.00015/1000, 'output': 0.0006/1000},
            'gpt-3.5-turbo': {'input': 0.001/1000, 'output': 0.002/1000},
        }
 
    def get_connection(self):
        return snowflake.connector.connect(**self.snowflake_config)
 
    async def log_api_usage(self, usage_data: Dict[str, Any]):
        """Log API usage data to Snowflake"""
        try:
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(None, self._insert_usage_data, usage_data)
        except Exception as e:
            logger.error(f"Failed to log API usage: {e}")
 
    def _insert_usage_data(self, usage_data: Dict[str, Any]):
        """Insert usage data into Snowflake (blocking operation)"""
        conn = None
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
 
            cursor.execute("""
                INSERT INTO api_usage_metrics (
                    usage_id, endpoint, method, status_code, response_time_ms,
                    request_timestamp, session_id, user_ip, user_agent,
                    model_used, tokens_input, tokens_output, tokens_total,
                    estimated_cost, request_size_bytes, response_size_bytes,
                    error_message, additional_metadata, user_id
                ) VALUES (
                    %(usage_id)s, %(endpoint)s, %(method)s, %(status_code)s, %(response_time_ms)s,
                    %(request_timestamp)s, %(session_id)s, %(user_ip)s, %(user_agent)s,
                    %(model_used)s, %(tokens_input)s, %(tokens_output)s, %(tokens_total)s,
                    %(estimated_cost)s, %(request_size_bytes)s, %(response_size_bytes)s,
                    %(error_message)s, %(additional_metadata)s, %(user_id)s
                )
            """, usage_data)
 
            conn.commit()
            logger.debug(f"✅ Logged API usage: {usage_data['endpoint']} | Model: {usage_data['model_used']} | Tokens: {usage_data['tokens_total']} | Cost: ${usage_data['estimated_cost']:.6f}")
 
        except Exception as e:
            logger.error(f"Database error logging API usage: {e}")
            if conn:
                conn.rollback()
        finally:
            if conn:
                conn.close()
 
    def calculate_cost(self, model: Optional[str], tokens_input: int, tokens_output: int) -> float:
        """Calculate estimated cost based on model and tokens"""
        if not model or model not in self.model_costs:
            return 0.0
 
        costs = self.model_costs[model]
        input_cost = tokens_input * costs['input']
        output_cost = tokens_output * costs['output']
 
        return input_cost + output_cost
 
 
# --------------------------------------------------
# MIDDLEWARE
# --------------------------------------------------
 
class APIUsageMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, tracker: APIUsageTracker):
        super().__init__(app)
        self.tracker = tracker
 
        # Define which endpoints to track
        self.tracked_endpoints = {
            "/api/chat",
            "/api/upload-document",
            "/transcribe",
            "/api/tts",
            "/api/sessions",
            "/api/session-info"
        }
        
        # Define which endpoints have LLM usage (model + tokens)
        self.llm_endpoints = {
            "/api/chat"
        }
 
    def _get_client_ip(self, request: Request) -> str:
        """Extract client IP from request"""
        forwarded_for = request.headers.get('x-forwarded-for')
        if forwarded_for:
            return forwarded_for.split(',')[0].strip()
 
        real_ip = request.headers.get('x-real-ip')
        if real_ip:
            return real_ip
 
        if request.client:
            return request.client.host
 
        return 'unknown'
 
    def _extract_session_id(self, request: Request) -> str:
        """Extract session ID from request"""
        # Try headers
        session_id = request.headers.get('x-session-id')
        if session_id:
            return session_id
 
        # Try query params
        session_id = request.query_params.get('session_id')
        if session_id:
            return session_id
 
        # Try cookies
        session_id = request.cookies.get('session')
        if session_id:
            return session_id
 
        # Generate hash-based session ID
        client_ip = self._get_client_ip(request)
        user_agent = request.headers.get('user-agent', '')
        session_data = f"{client_ip}:{user_agent[:50]}"
        session_hash = hashlib.md5(session_data.encode()).hexdigest()[:16]
        return f"auto_{session_hash}"
 
    async def _extract_model_and_tokens(self, request: Request, request_body: bytes) -> tuple:
        """
        Extract model name and token counts from request.
        Returns: (model_name, tokens_input, tokens_output)
        """
        model_used = None
        tokens_input = 0
        tokens_output = 0
        
        # Only extract for LLM endpoints
        if request.url.path not in self.llm_endpoints:
            return model_used, tokens_input, tokens_output
        
        try:
            if not request_body:
                return model_used, tokens_input, tokens_output
                
            request_data = json.loads(request_body)
            
            # Extract model name
            model_used = (
                request_data.get('model') or
                request_data.get('model_name') or
                request_data.get('llm_model') or
                'gpt-4o'  # Default fallback
            )
            
            # Extract or estimate tokens
            user_message = request_data.get('user_message', '')
            system_prompt = request_data.get('system_prompt', '')
            
            # Estimate input tokens (~4 chars per token)
            input_text = f"{system_prompt} {user_message}"
            tokens_input = max(1, len(input_text) // 4)
            
            # Estimate output tokens (typically 50-150% of input)
            tokens_output = max(10, int(tokens_input * 1.2))
            
            logger.debug(f"📊 Extracted - Model: {model_used}, Input tokens: {tokens_input}, Output tokens: {tokens_output}")
            
        except Exception as e:
            logger.error(f"Error extracting model/tokens: {e}")
            # For chat endpoints, provide reasonable defaults
            if request.url.path in self.llm_endpoints:
                model_used = 'gpt-4o'
                tokens_input = 20
                tokens_output = 50
        
        return model_used, tokens_input, tokens_output
 
    async def dispatch(self, request: Request, call_next):
        # Skip non-tracked endpoints
        if not any(request.url.path.startswith(p) for p in self.tracked_endpoints):
            return await call_next(request)
 
        # Start timing
        start_time = time.time()
        request_timestamp = datetime.now()
        usage_id = str(uuid.uuid4())
 
        # Get request metadata
        client_ip = self._get_client_ip(request)
        user_agent = request.headers.get('user-agent', '')
        session_id = self._extract_session_id(request)
        user_id = extract_user_id_from_request(request)
 
        # Read request body ONCE and store it
        request_body = await request.body()
        request_size = len(request_body) if request_body else 0
 
        # Extract model and token info
        model_used, tokens_input, tokens_output = await self._extract_model_and_tokens(
            request, request_body
        )
 
        # Store usage_id in request state
        request.state.usage_id = usage_id
 
        response = None
        error_message = None
 
        try:
            # Process request
            response = await call_next(request)
        except Exception as e:
            error_message = str(e)
            logger.error(f"❌ Error processing request: {e}")
            response = StarletteResponse(
                content=json.dumps({"error": "Internal server error"}),
                status_code=500,
                media_type="application/json"
            )
 
        # Calculate response time
        response_time_ms = (time.time() - start_time) * 1000
 
        # Get response size
        response_size = 0
        if hasattr(response, 'body') and response.body:
            response_size = len(response.body)
 
        # Calculate cost (only for LLM endpoints)
        estimated_cost = 0.0
        if model_used and tokens_input > 0:
            estimated_cost = self.tracker.calculate_cost(
                model_used, tokens_input, tokens_output
            )
 
        # Prepare usage data - ALWAYS include all fields, even if NULL
        usage_data = {
            'usage_id': usage_id,
            'endpoint': request.url.path,
            'method': request.method,
            'status_code': response.status_code if response else 500,
            'response_time_ms': response_time_ms,
            'request_timestamp': request_timestamp,
            'session_id': session_id,
            'user_ip': client_ip,
            'user_agent': user_agent,
            'model_used': model_used,  # Will be None for non-LLM endpoints
            'tokens_input': tokens_input,  # Will be 0 for non-LLM endpoints
            'tokens_output': tokens_output,  # Will be 0 for non-LLM endpoints
            'tokens_total': tokens_input + tokens_output,
            'estimated_cost': estimated_cost,  # Will be 0.0 for non-LLM endpoints
            'request_size_bytes': request_size,
            'response_size_bytes': response_size,
            'error_message': error_message,
            'additional_metadata': json.dumps({
                'query_params': dict(request.query_params),
                'path_params': dict(request.path_params) if hasattr(request, 'path_params') else {},
                'endpoint_type': 'llm' if request.url.path in self.llm_endpoints else 'non-llm'
            }),
            'user_id': user_id  # Will be None for unauthenticated requests
        }
 
        # Log usage asynchronously
        asyncio.create_task(self.tracker.log_api_usage(usage_data))
 
        return response