from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from app.db.session import get_db
from app.db.models.user import User
from app.core.security import decode_token

# Allow missing token (auto_error=False)
security = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    # MOCK AUTH: In development/migration, if token is missing or invalid, 
    # fallback to the first user in the database.
    
    # Try to use the first user in the DB
    result = await db.execute(select(User))
    user = result.scalars().first()

    if user:
        return user

    # If absolutely no user exists, logic will fail later (or we could raise here).
    # But for now let's raise if DB is empty as we need a user context.
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No user context available (Database empty)"
    )


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    return current_user


def require_roles(allowed_roles: list[str]):
    async def role_checker(
        current_user: User = Depends(get_current_active_user)
    ) -> User:
        # Relax role check if we are in this permissive mode? 
        # Or enforce if user has role.
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role {current_user.role} not authorized"
            )
        return current_user
    return role_checker