from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from app.database.database import Base


class TypingLog(Base):
    __tablename__ = "typing_logs"

    id = Column(Integer, primary_key=True, index=True)

    submission_id = Column(
        Integer,
        ForeignKey("submissions.id")
    )

    typing_time = Column(Integer, default=0)

    word_count = Column(Integer, default=0)

    average_wpm = Column(Integer, default=0)

    paste_count = Column(Integer, default=0)

    tab_switch = Column(Integer, default=0)

    pause_count = Column(Integer, default=0)

    idle_time = Column(Integer, default=0)

    risk_score = Column(Integer, default=0)

    submission = relationship("Submission")