from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "Contributor"


class UserCreate(UserBase):
    password: str
    organization_id: Optional[int] = None


class UserRead(UserBase):
    id: int
    is_active: bool
    organization_id: Optional[int]
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: int
    exp: datetime


class LoginRequest(BaseModel):
    email: EmailStr
    password: str