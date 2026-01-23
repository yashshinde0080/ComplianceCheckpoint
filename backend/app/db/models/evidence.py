from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class Evidence(Base, TimestampMixin):
    __tablename__ = "evidence"
    
    id = Column(Integer, primary_key=True, index=True)
    control_id = Column(Integer, ForeignKey("controls.id"), nullable=False)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    file_name = Column(String(255), nullable=False)
    file_url = Column(String(500), nullable=False)
    file_hash = Column(String(64), nullable=True)  # SHA-256 hash
    file_size = Column(Integer, nullable=True)
    mime_type = Column(String(100), nullable=True)
    
    description = Column(Text, nullable=True)
    version = Column(Integer, default=1)
    status = Column(String(20), default="Pending")  # Pending, Accepted, Rejected
    
    # Relationships
    control = relationship("Control", back_populates="evidence")
    organization = relationship("Organization", back_populates="evidence")
    uploaded_by_user = relationship("User", back_populates="uploaded_evidence")