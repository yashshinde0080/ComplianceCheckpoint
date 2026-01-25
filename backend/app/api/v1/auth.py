from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import timedelta

from app.db.session import get_db
from app.db.models.user import User
from app.db.models.organization import Organization
from app.schemas.user import UserCreate, UserRead, Token, LoginRequest
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.config import settings
from app.core.dependencies import get_current_active_user
from app.core.logging_config import get_logger, log_auth, log_success, log_error, log_warning

router = APIRouter()
logger = get_logger("api.auth")


@router.post("/register", response_model=UserRead)
async def register(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    log_auth(logger, f"🔐 Registration attempt for email: {user_data.email}")
    
    # Check if email already exists
    result = await db.execute(
        select(User).where(User.email == user_data.email)
    )
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        log_warning(logger, f"⚠️ Registration failed - Email already exists: {user_data.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create organization for the user if they're a Founder and don't have one
    organization_id = user_data.organization_id
    if not organization_id and user_data.role == "Founder":
        # Create a default organization
        new_org = Organization(
            name=f"{user_data.full_name}'s Organization",
            industry="Technology",
            size="1-10"
        )
        db.add(new_org)
        await db.flush()
        organization_id = new_org.id
        log_auth(logger, f"🏢 Created new organization for user: {user_data.full_name}")
    
    # Create user
    new_user = User(
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        full_name=user_data.full_name,
        role=user_data.role,
        organization_id=organization_id,
        is_active=True
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    log_success(logger, f"✅ User registered successfully: {user_data.email} (ID: {new_user.id})")
    
    return new_user


@router.post("/login", response_model=Token)
async def login(
    login_data: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    log_auth(logger, f"🔐 Login attempt for email: {login_data.email}")
    
    # Find user by email
    result = await db.execute(
        select(User).where(User.email == login_data.email)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        log_warning(logger, f"⚠️ Login failed - User not found: {login_data.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(login_data.password, user.hashed_password):
        log_warning(logger, f"⚠️ Login failed - Invalid password for: {login_data.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check if user is active
    if not user.is_active:
        log_warning(logger, f"⚠️ Login failed - Account disabled: {login_data.email}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled"
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    log_success(logger, f"✅ Login successful: {login_data.email} (ID: {user.id}, Role: {user.role})")
    
    return Token(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=UserRead)
async def get_current_user_info(
    current_user: User = Depends(get_current_active_user)
):
    log_auth(logger, f"👤 User info requested: {current_user.email}")
    return current_user


@router.post("/logout")
async def logout():
    log_auth(logger, "👋 User logged out")
    # For JWT-based auth, we don't need to do anything server-side
    # The client should just remove the token
    return {"message": "Successfully logged out"}
