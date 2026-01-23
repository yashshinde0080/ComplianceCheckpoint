from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class User(Base, TimestampMixin):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="Contributor")  # Founder, Admin, Contributor, Auditor
    is_active = Column(Boolean, default=True)
    
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    
    # Relationships
    organization = relationship("Organization", back_populates="users")
    tasks = relationship("Task", back_populates="owner")
    uploaded_evidence = relationship("Evidence", back_populates="uploaded_by_user")