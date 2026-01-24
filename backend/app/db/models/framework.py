from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class Framework(Base, TimestampMixin):
    __tablename__ = "frameworks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)  # SOC 2, ISO 27001, GDPR
    version = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)

    # Relationships
    controls = relationship("Control", back_populates="framework")
    policies = relationship("Policy", back_populates="framework")
    audit_exports = relationship("AuditExport", back_populates="framework")