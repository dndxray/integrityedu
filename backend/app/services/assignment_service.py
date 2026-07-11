from sqlalchemy.orm import Session

from app.models.assignment import Assignment
from app.models.class_model import Class
from app.models.enrollment import Enrollment


def create_assignment(
    db: Session,
    teacher_id: int,
    data
):
    classroom = db.query(Class).filter(
        Class.id == data.class_id,
        Class.teacher_id == teacher_id
    ).first()

    if classroom is None:
        return None

    assignment = Assignment(
        class_id=data.class_id,
        title=data.title,
        description=data.description,
        deadline=data.deadline
    )

    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    return assignment

def get_assignments_by_class(
    db: Session,
    teacher_id: int,
    class_id: int
):
    classroom = db.query(Class).filter(
        Class.id == class_id,
        Class.teacher_id == teacher_id
    ).first()

    if classroom is None:
        return None

    return db.query(Assignment).filter(
        Assignment.class_id == class_id
    ).all()

def get_student_assignments(
    db: Session,
    class_id: int
):
    return db.query(Assignment).filter(
        Assignment.class_id == class_id
    ).all()

def get_assignment_detail(
    db: Session,
    assignment_id: int
):
    return (
        db.query(Assignment)
        .filter(
            Assignment.id == assignment_id
        )
        .first()
    )

def get_my_assignments(
    db: Session,
    student_id: int
):
    return (
        db.query(Assignment)
        .join(
            Class,
            Assignment.class_id == Class.id
        )
        .join(
            Enrollment,
            Enrollment.class_id == Class.id
        )
        .filter(
            Enrollment.student_id == student_id
        )
        .order_by(
            Assignment.deadline.asc()
        )
        .all()
    )