from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# --- Score Schemas ---
class ScoreBase(BaseModel):
    quiz_type: str
    score: int

class ScoreCreate(ScoreBase):
    pass

class Score(ScoreBase):
    id: int
    user_id: int
    timestamp: datetime

    class Config:
        orm_mode = True

# --- User Schemas ---
class UserBase(BaseModel):
    username: str
    email: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    scores: List[Score] = []

    class Config:
        orm_mode = True
