from datetime import datetime, timedelta
from typing import Optional
import httpx
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# Cache for JWKS
_jwks_cache = None

def get_jwks(url: str):
    global _jwks_cache
    if _jwks_cache:
        return _jwks_cache
    try:
        # Append .well-known/jwks.json if not present
        target_url = url
        if not target_url.endswith("jwks.json"):
             target_url = target_url.rstrip("/") + "/.well-known/jwks.json"

        resp = httpx.get(target_url, timeout=5.0)
        if resp.status_code == 200:
            _jwks_cache = resp.json()
            return _jwks_cache
    except Exception as e:
        print(f"JWKS Fetch Error: {e}")
    return None


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> Optional[dict]:
    # 1. Try Neon Auth (RS256) if URL is configured
    if settings.NEON_AUTH_URL:
        jwks = get_jwks(settings.NEON_AUTH_URL)
        if jwks:
            try:
                # Extract kid from header
                header = jwt.get_unverified_header(token)
                rsa_key = {}
                for key in jwks["keys"]:
                    if key["kid"] == header.get("kid"):
                        rsa_key = key
                        break

                if rsa_key:
                    # Verify signature
                    return jwt.decode(
                        token,
                        rsa_key,
                        algorithms=["RS256"],
                        options={"verify_aud": False} # Relax audience check for now
                    )
            except Exception:
                pass # Try next method

    # 2. Fallback to Local Auth (HS256)
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None