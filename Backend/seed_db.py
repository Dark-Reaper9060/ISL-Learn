from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, crud, schemas

# Initialize DB tables
models.Base.metadata.create_all(bind=engine)

def seed_data():
    db: Session = SessionLocal()
    try:
        # Check if user exists
        dummy_user = crud.get_user_by_username(db, "oraon")
        if not dummy_user:
            print("Creating user 'oraon'...")
            user_in = schemas.UserCreate(username="oraon", password="test@01", email="oraon@test.com")
            dummy_user = crud.create_user(db, user_in)
        else:
            print("User 'oraon' already exists.")

        # Check/Add Scores
        scores = crud.get_user_scores(db, dummy_user.id)
        if not scores:
            print("Adding dummy scores...")
            crud.create_score(db, schemas.ScoreCreate(quiz_type="alphabet", score=85), dummy_user.id)
            crud.create_score(db, schemas.ScoreCreate(quiz_type="words", score=40), dummy_user.id)
            crud.create_score(db, schemas.ScoreCreate(quiz_type="alphabet", score=92), dummy_user.id)
            print("Dummy scores added.")
        else:
            print("Scores already exist.")
            
    except Exception as e:
        print(f"Error seeding data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
