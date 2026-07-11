from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user import User
from fastapi import UploadFile, File, Form
from app.schemas.submission_schema import SubmissionCreate
from app.core.dependencies import (
    get_current_user,
    require_teacher,
    require_student,
)
from app.services.submission_service import (
    generate_questions,
    submit_assignment,
    upload_assignment,
    get_submissions,
    get_submission_detail,
    check_submission,
)

router = APIRouter(
    prefix="/submissions",
    tags=["Submissions"]
)

@router.post("/")
def create_submission(
    data: SubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_student)
):
    submission = submit_assignment(
        db,
        current_user.id,
        data
    )

    if submission is None:
        raise HTTPException(
            status_code=400,
            detail="You have already submitted this assignment."
        )

    return submission

@router.post("/upload")
def upload_submission(
    assignment_id: int = Form(...),
    answer: str = Form(""),
    question_answers: str = Form(""),
    file: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_student)
):
    return upload_assignment(
        db,
        current_user.id,
        assignment_id,
        answer,
        question_answers,
        file
    )

@router.get("/{assignment_id}")
def submission_list(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher)
):
    return get_submissions(
        db,
        assignment_id
    )

@router.get("/check/{assignment_id}")
def check_student_submission(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_student)
):
    return check_submission(
        db,
        current_user.id,
        assignment_id
    )

@router.get("/detail/{submission_id}")
def submission_detail(
    submission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher)
):
    submission = get_submission_detail(
        db,
        submission_id
    )

    if submission is None:
        raise HTTPException(
            status_code=404,
            detail="Submission not found"
        )

    return submission

@router.post("/generate-questions")
def generate_ai_questions(
    file: UploadFile = File(...)
):
    return generate_questions(file)