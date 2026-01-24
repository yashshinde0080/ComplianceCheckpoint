from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PolicyBase(BaseModel):
    title: str
    content: str
    status: str = "Draft"


class PolicyCreate(PolicyBase):
    framework_id: Optional[int] = None


class PolicyRead(PolicyBase):
    id: int
    organization_id: int
    framework_id: Optional[int]
    version: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PolicyUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    status: Optional[str] = None


class PolicyGenerate(BaseModel):
    policy_type: str  # access_control, data_protection, incident_response, etc.
    framework_id: Optional[int] = None
    company_name: Optional[str] = None