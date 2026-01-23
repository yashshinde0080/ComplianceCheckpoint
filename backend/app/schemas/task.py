from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[date] = None
    priority: str = "Medium"


class TaskCreate(TaskBase):
    control_id: int
    owner_id: Optional[int] = None


class TaskRead(TaskBase):
    id: int
    control_id: int
    organization_id: int
    owner_id: Optional[int]
    status: str
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[date] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    notes: Optional[str] = None
    owner_id: Optional[int] = None