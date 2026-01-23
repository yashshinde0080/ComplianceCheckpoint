from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AuditExportBase(BaseModel):
    framework_id: int
    export_type: str = "PDF"


class AuditExportCreate(AuditExportBase):
    pass


class AuditExportRead(AuditExportBase):
    id: int
    organization_id: int
    download_url: Optional[str]
    status: str
    generated_at: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True