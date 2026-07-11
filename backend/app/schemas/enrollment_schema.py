from pydantic import BaseModel


class JoinClassRequest(BaseModel):
    class_code: str