# api/auth.py
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from services.auth_service import signup_user, login_user, hash_password, verify_password
from services.otp_service import generate_otp, verify_otp, store_pending_signup, get_pending_signup
from services.email_service import send_signup_otp_email, send_login_otp_email
from core.database import get_db
from models.user import User
from datetime import datetime, timedelta
from jwt.exceptions import InvalidTokenError
import jwt
from typing import Optional
import os
from schemas.auth import (
    SignupOTPInitRequest,    # For OTP signup initial request
    SignupOTPRequest,        # For OTP signup verification
    LoginOTPRequest,         # For OTP login initial request
    OTPVerifyRequest         # For OTP verification
)

router = APIRouter()

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("JWT_SECRET_KEY environment variable is not set")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(request: Request, db: Session = Depends(get_db)):
    """Extract JWT from cookie and validate"""
    
    token = request.cookies.get("access_token")
    
    print(f"🔍 Cookies received: {dict(request.cookies)}")
    print(f"🔍 Token extracted: {token[:20] if token else 'None'}...")
    
    if not token:
        raise HTTPException(
            status_code=401, 
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        user_id: str = payload.get("user_id")
        
        # ✅ Check both username AND user_id
        if username is None or user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        print(f"✅ User authenticated: {username} (ID: {user_id})")
        return user
        
    except InvalidTokenError as e:
        print(f"❌ Token decode error: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")



# ============ OTP-BASED SIGNUP ============

@router.post("/signup/request-otp")
async def signup_request_otp(signup_data: SignupOTPInitRequest, db: Session = Depends(get_db)):
    """Step 1: Check if email exists and send OTP"""
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == signup_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Store signup data temporarily
    store_pending_signup(signup_data.email, signup_data.dict())
    
    # Generate and send OTP
    otp = generate_otp(signup_data.email)
    await send_signup_otp_email(signup_data.email, otp)
    
    return {
        "message": "OTP sent to your email. Please verify to complete registration.",
        "email": signup_data.email
    }

@router.post("/signup/verify-otp")
def signup_verify_otp(otp_data: SignupOTPRequest, response: Response, db: Session = Depends(get_db)):
    """Step 2: Verify OTP and create user account"""
    
    if not verify_otp(otp_data.email, otp_data.otp):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired OTP"
        )
    
    signup_data = get_pending_signup(otp_data.email)
    if not signup_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Signup session expired. Please start registration again."
        )
    
    existing_user = db.query(User).filter(User.email == signup_data["email"]).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    new_user = User(
        email=signup_data["email"],
        username=signup_data.get("username") or signup_data["email"].split("@")[0],
        hashed_password=hash_password(signup_data["password"]),
        is_email_verified=True
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create tokens
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.username},  # Use username for consistency
        expires_delta=access_token_expires
    )
    
    refresh_token_expires = timedelta(days=4)
    refresh_token = create_access_token(
        data={
            "sub": new_user.username,
            "user_id": str(new_user.id),
            "type": "refresh"
        },
        expires_delta=refresh_token_expires
    )
    
    # Set cookies (same as regular login)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=False,
        secure=False,
        samesite="lax",
        max_age=3600,
        path="/",
    )
    
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=False,
        secure=False,
        samesite="lax",
        max_age=345600,
        path="/",
    )
    
    print(f"✅ OTP Signup successful for: {new_user.username}")
    
    return {
        "message": "Account created successfully",
        "user_id": str(new_user.id),
        "username": new_user.username,
        "email": new_user.email
    }
# ============ OTP-BASED LOGIN ============

@router.post("/login/request-otp")
async def login_request_otp(login_data: LoginOTPRequest, db: Session = Depends(get_db)):
    """Step 1: Verify credentials and send OTP"""
    
    print(f"🔍 Looking up user: {login_data.email}")  # Debug log
    
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user:
        print(f"❌ User not found: {login_data.email}")  # Debug log
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    print(f"✅ User found, verifying password...")  # Debug log
    
    if not verify_password(login_data.password, user.hashed_password):
        print(f"❌ Password verification failed for: {login_data.email}")  # Debug log
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    print(f"✅ Password verified, generating OTP...")  # Debug log
    
    # Generate and send OTP
    otp = generate_otp(login_data.email)
    await send_login_otp_email(login_data.email, otp)
    
    print(f"📧 OTP sent successfully to {login_data.email}")  # Debug log
    
    return {"message": "OTP sent to your email", "email": login_data.email}


@router.post("/login/verify-otp")
def login_verify_otp(otp_data: OTPVerifyRequest, response: Response, db: Session = Depends(get_db)):
    """Step 2: Verify OTP and issue JWT token in cookie"""
    
    if not verify_otp(otp_data.email, otp_data.otp):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired OTP"
        )
    
    user = db.query(User).filter(User.email == otp_data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # ✅ Create tokens with user_id in BOTH tokens
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": user.username,
            "user_id": str(user.id)  # ✅ ADDED - Required for get_current_user
        },
        expires_delta=access_token_expires
    )
    
    refresh_token_expires = timedelta(days=4)
    refresh_token = create_access_token(
        data={
            "sub": user.username,
            "user_id": str(user.id),
            "type": "refresh"
        },
        expires_delta=refresh_token_expires
    )
    
    # Clear old cookies first
    response.delete_cookie(key="access_token", path="/")
    response.delete_cookie(key="refresh_token", path="/")
    
    # ✅ Set new cookies with httponly=True for security
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,  # ✅ CHANGED - Prevents XSS attacks
        secure=False,   # False for localhost, True for production
        samesite="lax",
        max_age=3600,
        path="/",
    )
    
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=345600,  # 4 days
        path="/",
    )
    
    print(f"✅ OTP Login successful for: {user.username}")
    
    return {
        "message": "Login successful",
        "user_id": str(user.id),
        "username": user.username,
        "email": user.email
    }


# ============ PROFILE & TOKEN MANAGEMENT ============

@router.post("/logout")
def logout(response: Response):
    """Clear both access and refresh tokens"""
    
    response.delete_cookie(key="access_token", path="/", samesite="lax")
    response.delete_cookie(key="refresh_token", path="/", samesite="lax")
    
    print("🚪 User logged out - cookies cleared")
    
    return {"message": "Logged out successfully"}

@router.get("/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile from cookie"""
    return {
        "user_id": str(current_user.id),
        "username": current_user.username,
        "email": current_user.email,
        "is_email_verified": current_user.is_email_verified
    }

@router.post("/refresh-token")
async def refresh_token(request: Request, response: Response, db: Session = Depends(get_db)):
    """Refresh access token using refresh token from cookie"""
    
    refresh_token = request.cookies.get("refresh_token")
    
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token not found")
    
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if username is None or token_type != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        
        user = db.query(User).filter(User.username == username).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        new_access_token = create_access_token(
            data={"sub": user.username},
            expires_delta=access_token_expires
        )
        
        response.set_cookie(
            key="access_token",
            value=new_access_token,
            httponly=False,
            secure=False,  # True in production with HTTPS
            samesite="lax",
            max_age=3600,
            path="/",
        )
        
        print(f"✅ Access token refreshed for user: {username}")
        
        return {
            "message": "Token refreshed successfully",
            "username": user.username
        }
        
    except InvalidTokenError as e:
        print(f"❌ Invalid refresh token: {e}")
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")