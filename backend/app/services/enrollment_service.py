from sqlalchemy.orm import Session

from app.models.class_model import Class
from app.models.enrollment import Enrollment

def join_class(
    db: Session,
    student_id: int,
    class_code: str
):
    classroom = db.query(Class).filter(
        Class.class_code == class_code
    ).first()

    if classroom is None:
        return None

    enrolled = db.query(Enrollment).filter(
        Enrollment.student_id == student_id,
        Enrollment.class_id == classroom.id
    ).first()

    if enrolled:
        return False

    enrollment = Enrollment(
        student_id=student_id,
        class_id=classroom.id
    )

    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)

    return enrollment



def get_my_classes(db: Session, student_id: int):
    return (
        db.query(Class)
        .join(Enrollment)
        .filter(Enrollment.student_id == student_id)
        .all()
    )