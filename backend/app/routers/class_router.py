from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.core.dependencies import (
    require_teacher,
    require_student,
)
from app.models.user import User

from app.schemas.class_schema import CreateClass
from app.services.class_service import (
    create_class,
    get_teacher_classes,
    get_class_detail,
    get_student_class_detail,
)

router = APIRouter(
    prefix="/classes",
    tags=["Classes"]
)


@router.post("/")
def create_new_class(
    data: CreateClass,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher)
):
    new_class = create_class(
        db,
        current_user.id,
        data
    )

    return new_class

@router.get("/my")
def my_classes(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher)
):
    return get_teacher_classes(
        db,
        current_user.id
    )

@router.get("/{class_id}")
def class_detail(
    class_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher)
):
    classroom = get_class_detail(
        db,
        current_user.id,
        class_id
    )

    if classroom is None:
        raise HTTPException(
            status_code=404,
            detail="Class not found"
        )
    return classroom

@router.get("/student/{class_id}")
def student_class_detail(
    class_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_student)
):
    classroom = get_student_class_detail(
        db,
        current_user.id,
        class_id
    )
    if classroom is None:
        raise HTTPException(
            status_code=404,
            detail="Class not found"
        )
    return classroom