from core.database import Base
from sqlalchemy.sql import func
from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy import Column, String, DateTime, Boolean
import uuid


class User(Base):
    __tablename__ = 'users'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_email_verified = Column(Boolean, default=False, nullable=False)
    is_email_verified = Column(Boolean, default=False, nullable=False)
    
    created_at = Column(DateTime(timezone=False), server_default=func.current_timestamp())
    updated_at = Column(DateTime(timezone=False), onupdate=func.current_timestamp(), server_default=func.current_timestamp())
