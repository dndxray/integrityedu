from pydantic import BaseModel


class TypingLogCreate(BaseModel):
    submission_id: int

    typing_time: int

    word_count: int

    average_wpm: int

    paste_count: int

    tab_switch: int

    pause_count: int

    idle_time: int