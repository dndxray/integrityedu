from sqlalchemy.orm import Session

from app.models.typing_log import TypingLog
from app.schemas.typing_schema import TypingLogCreate


def calculate_risk(data: TypingLogCreate):

    risk = 0

    if data.paste_count > 0:
        risk += 40

    if data.tab_switch >= 5:
        risk += 20

    if data.average_wpm >= 120:
        risk += 20

    if data.pause_count <= 2:
        risk += 10

    if data.idle_time >= 300:
        risk += 10

    return min(risk, 100)


def save_typing_log(
    db: Session,
    data: TypingLogCreate
):

    risk = calculate_risk(data)

    log = TypingLog(
        submission_id=data.submission_id,

        typing_time=data.typing_time,

        word_count=data.word_count,

        average_wpm=data.average_wpm,

        paste_count=data.paste_count,

        tab_switch=data.tab_switch,

        pause_count=data.pause_count,

        idle_time=data.idle_time,

        risk_score=risk
    )

    db.add(log)
    db.commit()
    db.refresh(log)

    return log

def get_typing_log(
    db: Session,
    submission_id: int
):
    return (
        db.query(TypingLog)
        .filter(
            TypingLog.submission_id == submission_id
        )
        .first()
    )