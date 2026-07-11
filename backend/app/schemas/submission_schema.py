from pydantic import BaseModel


class SubmissionCreate(BaseModel):
    assignment_id: int
    answer: str