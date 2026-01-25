import time
from fastapi import Request, HTTPException, status
from collections import defaultdict

# Simple in-memory rate limiter
# Key: IP address
# Value: List of timestamps
_requests = defaultdict(list)

def rate_limiter(max_requests: int = 5, window_seconds: int = 60):
    """
    Simple in-memory rate limiter dependency.
    WARNING: This does not work across multiple worker processes.
    For production with multiple workers, use Redis.
    """
    async def dependency(request: Request):
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()

        # Clean old requests for this IP
        _requests[client_ip] = [t for t in _requests[client_ip] if now - t < window_seconds]

        if len(_requests[client_ip]) >= max_requests:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later."
            )

        _requests[client_ip].append(now)
    return dependency
