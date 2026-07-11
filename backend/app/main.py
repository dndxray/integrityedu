from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import Base, engine

from app.models.user import User
from app.models.class_model import Class
from app.models.enrollment import Enrollment
from app.models.assignment import Assignment
from app.models.submission import Submission
from app.models.typing_log import TypingLog
from app.routers import auth
from app.routers import class_router
from app.routers import enrollment_router
from app.routers import assignment_router
from app.routers import submission_router
from app.routers import typing_router
from app.routers import analytics_router
from app.routers.ai_router import router as ai_router
app = FastAPI(
    title="IntegrityEdu API",
    version="1.0.0"
)
handler = app

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(class_router.router)
app.include_router(enrollment_router.router)
app.include_router(assignment_router.router)
app.include_router(submission_router.router)
app.include_router(typing_router.router)
app.include_router(analytics_router.router)
app.include_router(ai_router)

@app.get("/")
def root():
    return {
        "message": "IntegrityEdu Backend Running!"
    }