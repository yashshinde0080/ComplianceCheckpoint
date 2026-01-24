from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class Control(Base, TimestampMixin):
    __tablename__ = "controls"

    id = Column(Integer, primary_key=True, index=True)
    framework_id = Column(Integer, ForeignKey("frameworks.id"), nullable=False)
    control_code = Column(String(50), nullable=False)  # e.g., CC6.1, A.8.2
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=True)
    severity = Column(String(20), default="Medium")  # Low, Medium, High, Critical
    guidance_text = Column(Text, nullable=True)
    evidence_guidance = Column(Text, nullable=True)

    # Relationships
    framework = relationship("Framework", back_populates="controls")
    evidence = relationship("Evidence", back_populates="control")
    tasks = relationship("Task", back_populates="control")