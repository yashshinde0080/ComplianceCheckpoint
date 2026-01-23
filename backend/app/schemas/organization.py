from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class OrganizationBase(BaseModel):
    name: str
    industry: Optional[str] = None
    employee_count: Optional[int] = None
    compliance_targets: List[str] = []


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationRead(OrganizationBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    industry: Optional[str] = None
    employee_count: Optional[int] = None
    compliance_targets: Optional[List[str]] = None
    