from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.core.dependencies import require_student
from app.models.user import User

from app.schemas.enrollment_schema import JoinClassRequest
from app.services.enrollment_service import get_my_classes, join_class

router = APIRouter(
    prefix="/enrollment",
    tags=["Enrollment"]
)


@router.post("/join")
def join(
    data: JoinClassRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_student)
):
    result = join_class(
        db,
        current_user.id,
        data.class_code
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Class not found"
        )

    if result is False:
        raise HTTPException(
            status_code=400,
            detail="Already joined"
        )

    return {
        "message": "Joined successfully"
    }

@router.get("/my-classes")
def my_classes(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_student)
):
    return get_my_classes(
        db,
        current_user.id
    )