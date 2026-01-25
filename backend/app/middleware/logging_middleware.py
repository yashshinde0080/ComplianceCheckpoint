"""
Logging middleware for FastAPI
Logs all requests and responses with status indicators
"""
import time
from typing import Callable
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

from app.core.logging_config import get_logger, LogStatus

logger = get_logger("middleware.logging")


class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware to log all HTTP requests and responses"""
    
    def __init__(self, app: ASGIApp):
        super().__init__(app)
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Start timer
        start_time = time.time()
        
        # Get request details
        method = request.method
        path = request.url.path
        client_ip = request.client.host if request.client else "unknown"
        
        # Log incoming request
        logger.info(
            f"⏳ {method} {path} - Request from {client_ip}",
            extra={"status": LogStatus.PENDING}
        )
        
        # Process request
        try:
            response = await call_next(request)
            
            # Calculate duration
            duration = (time.time() - start_time) * 1000  # ms
            
            # Determine status based on response code
            status_code = response.status_code
            if status_code >= 500:
                status = LogStatus.ERROR
                log_level = "error"
            elif status_code >= 400:
                status = LogStatus.WARNING
                log_level = "warning"
            else:
                status = LogStatus.SUCCESS
                log_level = "info"
            
            # Log response
            getattr(logger, log_level)(
                f"{status.value} {method} {path} - {status_code} ({duration:.2f}ms)",
                extra={
                    "status": status,
                    "method": method,
                    "path": path,
                    "status_code": status_code,
                    "duration_ms": round(duration, 2),
                    "client_ip": client_ip,
                }
            )
            
            return response
            
        except Exception as e:
            # Calculate duration
            duration = (time.time() - start_time) * 1000
            
            # Log error
            logger.error(
                f"❌ {method} {path} - Exception ({duration:.2f}ms): {str(e)}",
                extra={
                    "status": LogStatus.ERROR,
                    "method": method,
                    "path": path,
                    "duration_ms": round(duration, 2),
                    "client_ip": client_ip,
                    "error": str(e),
                },
                exc_info=True
            )
            raise
