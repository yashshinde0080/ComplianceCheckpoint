from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class Policy(Base, TimestampMixin):
    __tablename__ = "policies"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    framework_id = Column(Integer, ForeignKey("frameworks.id"), nullable=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)  # Markdown content
    status = Column(String(20), default="Draft")  # Draft, Under Review, Approved
    version = Column(Integer, default=1)
    
    # Relationships
    organization = relationship("Organization", back_populates="policies")
    framework = relationship("Framework", back_populates="policies")