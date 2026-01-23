from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class FrameworkBase(BaseModel):
    name: str
    version: Optional[str] = None
    description: Optional[str] = None


class FrameworkCreate(FrameworkBase):
    pass


class FrameworkRead(FrameworkBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True