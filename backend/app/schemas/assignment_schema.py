from datetime import datetime
from pydantic import BaseModel


class AssignmentCreate(BaseModel):
    class_id: int
    title: str
    description: str
    deadline: datetime