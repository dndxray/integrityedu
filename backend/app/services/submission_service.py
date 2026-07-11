from sqlalchemy.orm import Session
from fastapi import UploadFile
from app.models.submission import Submission
from app.schemas.submission_schema import SubmissionCreate
from app.services.file_service import analyze_uploaded_file
from app.services.ai_service import analyze_answer
from app.services.ai_service import generate_questions_from_pdf
import os
import shutil
def submit_assignment(
    db: Session,
    student_id: int,
    data: SubmissionCreate
):
        # Cek apakah student sudah submit
    existing = (
        db.query(Submission)
        .filter(
            Submission.assignment_id == data.assignment_id,
            Submission.student_id == student_id
        )
        .first()
    )

    if existing:
        return None

    analysis = analyze_answer(data.answer)
    print("========== QUESTION ANSWERS ==========")
    print(question_answers)
    print("======================================")

    submission = Submission(
        assignment_id=data.assignment_id,
        student_id=student_id,
        answer=data.answer,
        ai_score=analysis["score"],
        ai_result=analysis["result"],
        ai_reason=analysis["reason"],
        ai_recommendation=analysis["recommendation"]
    )

    db.add(submission)
    db.commit()
    db.refresh(submission)

    return submission

def get_submissions(
    db: Session,
    assignment_id: int
):
    return (
        db.query(Submission)
        .filter(
            Submission.assignment_id == assignment_id
        )
        .all()
    )


def get_submission_detail(
    db: Session,
    submission_id: int
):
    return (
        db.query(Submission)
        .filter(
            Submission.id == submission_id
        )
        .first()
    )

def check_submission(
    db: Session,
    student_id: int,
    assignment_id: int
):
    submission = (
        db.query(Submission)
        .filter(
            Submission.student_id == student_id,
            Submission.assignment_id == assignment_id
        )
        .first()
    )

    if submission is None:
        return {
            "submitted": False
        }

    return {
        "submitted": True,
        "submission_id": submission.id,
        "ai_score": submission.ai_score,
        "ai_result": submission.ai_result
    }

def upload_assignment(
    db: Session,
    student_id: int,
    assignment_id: int,
    answer: str,
    question_answers: str,
    file: UploadFile
):
    # Cek apakah sudah pernah submit
    existing = (
        db.query(Submission)
        .filter(
            Submission.assignment_id == assignment_id,
            Submission.student_id == student_id
        )
        .first()
    )

    if existing:
        return None

    file_name = None
    file_path = None
    file_type = None

    # Simpan file jika ada
    if file is not None:
        os.makedirs(
            "app/uploads/submissions",
            exist_ok=True
        )

        file_name = file.filename

        file_path = (
            f"app/uploads/submissions/{file.filename}"
        )

        file_type = file.content_type

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

    if file_path and file_type == "application/pdf":
        analysis = analyze_pdf(file_path)

    elif answer.strip():
        analysis = analyze_answer(answer)

    else:
        analysis = {
            "success": False,
            "summary_and_questions": ""
    }

    submission = Submission(
        assignment_id=assignment_id,
        student_id=student_id,
        answer=answer,
        file_name=file_name,
        file_path=file_path,
        file_type=file_type,
        ai_score=analysis["score"],
        ai_result=analysis["result"],
        ai_reason=analysis["reason"],
        ai_recommendation=analysis["recommendation"],
    )

    db.add(submission)
    db.commit()
    db.refresh(submission)

    return submission

def generate_questions(file: UploadFile):

    os.makedirs(
        "app/uploads/temp",
        exist_ok=True
    )

    temp_path = f"app/uploads/temp/{file.filename}"

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = generate_questions_from_pdf(
        temp_path
    )

    os.remove(temp_path)

    return result