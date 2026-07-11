from pydantic import BaseModel


class CreateClass(BaseModel):
    class_name: str
    description: str


class ClassResponse(BaseModel):
    id: int
    class_name: str
    class_code: str
    description: str

    class Config:
        from_attributes = True