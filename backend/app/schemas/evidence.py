from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class EvidenceBase(BaseModel):
    description: Optional[str] = None


class EvidenceCreate(EvidenceBase):
    control_id: int
    file_name: str
    file_url: str
    file_hash: Optional[str] = None
    file_size: Optional[int] = None
    mime_type: Optional[str] = None


class EvidenceRead(EvidenceBase):
    id: int
    control_id: int
    organization_id: int
    uploaded_by: int
    file_name: str
    file_url: str
    file_hash: Optional[str]
    file_size: Optional[int]
    mime_type: Optional[str]
    version: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class EvidenceUpdate(BaseModel):
    description: Optional[str] = None
    status: Optional[str] = None