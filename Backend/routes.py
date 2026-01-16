from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import database, schemas, crud, models

router = APIRouter()

# Dependency
def get_db():
    return database.get_db()

@router.post("/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud.create_user(db=db, user=user)

@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(database.get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if not db_user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    if not crud.verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    # In a real app, generate a JWT token here. 
    # For this MVP, we return the user info directly to store in frontend context.
    return {"id": db_user.id, "username": db_user.username, "email": db_user.email}

@router.post("/scores/", response_model=schemas.Score)
def create_score(score: schemas.ScoreCreate, user_id: int, db: Session = Depends(database.get_db)):
    # Note: user_id is passed as query param for simplicity in this MVP, 
    # instead of extracting from JWT token.
    return crud.create_score(db=db, score=score, user_id=user_id)

@router.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user
