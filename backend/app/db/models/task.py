from sqlalchemy import Column, Integer, String, Text, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class Task(Base, TimestampMixin):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    control_id = Column(Integer, ForeignKey("controls.id"), nullable=False)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    due_date = Column(Date, nullable=True)
    status = Column(String(20), default="Pending")  # Pending, In Progress, Completed, Blocked
    priority = Column(String(20), default="Medium")  # Low, Medium, High
    notes = Column(Text, nullable=True)

    # Relationships
    control = relationship("Control", back_populates="tasks")
    organization = relationship("Organization", back_populates="tasks")
    owner = relationship("User", back_populates="tasks")