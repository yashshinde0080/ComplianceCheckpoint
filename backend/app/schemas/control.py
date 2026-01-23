from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ControlBase(BaseModel):
    control_code: str
    title: str
    description: str
    category: Optional[str] = None
    severity: str = "Medium"
    guidance_text: Optional[str] = None
    evidence_guidance: Optional[str] = None


class ControlCreate(ControlBase):
    framework_id: int


class ControlRead(ControlBase):
    id: int
    framework_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class ControlUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    severity: Optional[str] = None
    guidance_text: Optional[str] = None
    evidence_guidance: Optional[str] = None


class ControlWithStatus(ControlRead):
    evidence_count: int = 0
    task_count: int = 0
    completion_status: str = "Not Started"