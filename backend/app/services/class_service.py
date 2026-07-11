import random
import string

from sqlalchemy.orm import Session
from app.models.enrollment import Enrollment
from app.models.class_model import Class
from app.schemas.class_schema import CreateClass


def generate_class_code(length=6):
    characters = string.ascii_uppercase + string.digits

    return "".join(
        random.choice(characters)
        for _ in range(length)
    )


def create_class(
    db: Session,
    teacher_id: int,
    data: CreateClass
):
    while True:
        code = generate_class_code()

        exists = db.query(Class).filter(
            Class.class_code == code
        ).first()

        if not exists:
            break

    new_class = Class(
        class_name=data.class_name,
        description=data.description,
        class_code=code,
        teacher_id=teacher_id
    )

    db.add(new_class)
    db.commit()
    db.refresh(new_class)

    return new_class

def get_teacher_classes(
    db: Session,
    teacher_id: int
):
    return db.query(Class).filter(
        Class.teacher_id == teacher_id
    ).all()

def get_class_detail(
    db: Session,
    teacher_id: int,
    class_id: int
):
    return db.query(Class).filter(
        Class.id == class_id,
        Class.teacher_id == teacher_id
    ).first()

def get_student_class_detail(
    db: Session,
    student_id: int,
    class_id: int
):
    enrollment = (
        db.query(Enrollment)
        .filter(
            Enrollment.student_id == student_id,
            Enrollment.class_id == class_id
        )
        .first()
    )

    if enrollment is None:
        return None

    return (
        db.query(Class)
        .filter(
            Class.id == class_id
        )
        .first()
    )