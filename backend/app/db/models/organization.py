from sqlalchemy import Column, Integer, String, ARRAY, DateTime, func
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class Organization(Base, TimestampMixin):
    __tablename__ = "organizations"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    industry = Column(String(100), nullable=True)
    employee_count = Column(Integer, nullable=True)
    compliance_targets = Column(ARRAY(String), default=[])
    
    # Relationships
    users = relationship("User", back_populates="organization")
    policies = relationship("Policy", back_populates="organization")
    evidence = relationship("Evidence", back_populates="organization")
    tasks = relationship("Task", back_populates="organization")
    audit_exports = relationship("AuditExport", back_populates="organization")