from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.class_model import Class
from app.models.enrollment import Enrollment
from app.models.assignment import Assignment
from app.models.submission import Submission
from app.models.typing_log import TypingLog


def get_dashboard_analytics(db: Session):
    total_classes = db.query(Class).count()

    total_students = (
        db.query(Enrollment.student_id)
        .distinct()
        .count()
    )

    total_assignments = db.query(Assignment).count()

    total_submissions = db.query(Submission).count()

    average_ai_score = (
        db.query(func.avg(Submission.ai_score))
        .scalar()
        or 0
    )

    average_typing_risk = (
        db.query(func.avg(TypingLog.risk_score))
        .scalar()
        or 0
    )

    average_wpm = (
        db.query(func.avg(TypingLog.average_wpm))
        .scalar()
        or 0
    )

    low_risk = (
        db.query(TypingLog)
        .filter(TypingLog.risk_score < 30)
        .count()
    )

    medium_risk = (
        db.query(TypingLog)
        .filter(
            TypingLog.risk_score >= 30,
            TypingLog.risk_score < 70,
        )
        .count()
    )

    high_risk = (
        db.query(TypingLog)
        .filter(TypingLog.risk_score >= 70)
        .count()
    )

    return {
        "total_classes": total_classes,
        "total_students": total_students,
        "total_assignments": total_assignments,
        "total_submissions": total_submissions,

        "average_ai_score": round(average_ai_score, 1),
        "average_typing_risk": round(average_typing_risk, 1),
        "average_wpm": round(average_wpm, 1),

        "low_risk": low_risk,
        "medium_risk": medium_risk,
        "high_risk": high_risk,
    }