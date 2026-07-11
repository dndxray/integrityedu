from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ai_service import analyze_text
from fastapi import UploadFile, File
from app.services.file_service import analyze_uploaded_file
router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)


class TextRequest(BaseModel):
    text: str


@router.post("/analyze")
def analyze(request: TextRequest):
    return analyze_text(request.text)

@router.post("/analyze-file")
def analyze_file(file: UploadFile = File(...)):
    return analyze_uploaded_file(file)
