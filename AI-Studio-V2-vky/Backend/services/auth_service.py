from sqlalchemy.orm import Session
from models.user import User
from core.security import hash_password, verify_password
from fastapi import HTTPException, status
import uuid


def signup_user(db:Session, username:str, email:str, password:str):
    #check if user exists
    existing_user = db.query(User).filter(
        (User.email==email) | (User.username == username)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code= status.HTTP_400_BAD_REQUEST,
            detail="User already exists"
        )
    
    user = User(
        id=str(uuid.uuid4()),
        username = username,
        email = email,
        hashed_password = hash_password(password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def login_user(db:Session, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()

    if not user:
        raise HTTPException(
            status_code= status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    if not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code= status.HTTP_401_UNAUTHORIZED,
            detail= "Invalid username or password"
        )
    
    return user