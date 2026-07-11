from sqlalchemy import Column, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.database.database import Base
from sqlalchemy import DateTime
from datetime import datetime
class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)

    assignment_id = Column(
        Integer,
        ForeignKey("assignments.id")
    )

    student_id = Column(
        Integer,
        ForeignKey("users.id")
    )
    answer = Column(Text)
    file_name = Column(Text, nullable=True)
    file_path = Column(Text, nullable=True)
    file_type = Column(Text, nullable=True)
    submitted_at = Column( DateTime, default=datetime.utcnow )
    ai_score = Column(Integer, default=0)
    ai_result = Column(
        Text,
        default="Belum dianalisis"
    )
    ai_reason = Column(
    Text,
    default=""
    )

    ai_recommendation = Column(
    Text,
    default=""
    )

    assignment = relationship("Assignment")

    student = relationship("User")