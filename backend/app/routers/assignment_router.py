from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.core.dependencies import (
    get_current_user,
    require_teacher,
    require_student,
)

from app.models.user import User

from app.schemas.assignment_schema import AssignmentCreate

from app.services.assignment_service import (
    create_assignment,
    get_assignments_by_class,
    get_student_assignments,
    get_assignment_detail,
)


router = APIRouter(
    prefix="/assignments",
    tags=["Assignments"]
)


@router.post("/")
def create(
    data: AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher)
):
    assignment = create_assignment(
        db,
        current_user.id,
        data
    )

    if assignment is None:
        raise HTTPException(
            status_code=404,
            detail="Class not found"
        )

    return assignment

@router.get("/class/{class_id}")
def assignment_list(
    class_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher)
):
    assignments = get_assignments_by_class(
        db,
        current_user.id,
        class_id
    )

    if assignments is None:
        raise HTTPException(
            status_code=404,
            detail="Class not found"
        )

    return assignments


@router.get("/student/{class_id}")
def student_assignment(
    class_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_student)
):
    return get_student_assignments(
        db,
        class_id
    )

@router.get("/{assignment_id}")
def assignment_detail(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    assignment = get_assignment_detail(
        db,
        assignment_id
    )

    if assignment is None:
        raise HTTPException(
            status_code=404,
            detail="Assignment not found"
        )

    return assignment

@router.get("/my")
def my_assignments(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_student)
):
    return get_my_assignments(
        db,
        current_user.id
    )