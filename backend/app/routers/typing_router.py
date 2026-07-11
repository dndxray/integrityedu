from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.typing_schema import TypingLogCreate
from app.services.typing_service import save_typing_log, get_typing_log

router = APIRouter(
    prefix="/typing",
    tags=["Typing"]
)


@router.post("/")
def create_typing_log(
    data: TypingLogCreate,
    db: Session = Depends(get_db)
):
    return save_typing_log(
        db,
        data
    )

@router.get("/{submission_id}")
def typing_detail(
    submission_id: int,
    db: Session = Depends(get_db)
):
    return get_typing_log(
        db,
        submission_id
    )