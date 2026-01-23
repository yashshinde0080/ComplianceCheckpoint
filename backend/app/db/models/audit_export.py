from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class AuditExport(Base, TimestampMixin):
    __tablename__ = "audit_exports"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    framework_id = Column(Integer, ForeignKey("frameworks.id"), nullable=False)
    
    export_type = Column(String(20), default="PDF")  # PDF, ZIP
    download_url = Column(String(500), nullable=True)
    status = Column(String(20), default="Pending")  # Pending, Processing, Ready, Failed
    generated_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    organization = relationship("Organization", back_populates="audit_exports")
    framework = relationship("Framework", back_populates="audit_exports")