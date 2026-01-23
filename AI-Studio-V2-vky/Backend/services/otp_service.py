# services/otp_service.py
import pyotp
import random
from datetime import datetime, timedelta

# Store OTPs temporarily (use Redis in production)
otp_storage = {}

def generate_otp(email: str) -> str:
    """Generate 6-digit OTP"""
    otp = str(random.randint(100000, 999999))
    
    # Store with 5-minute expiration
    otp_storage[email] = {
        "otp": otp,
        "expires_at": datetime.utcnow() + timedelta(minutes=5)
    }
    return otp

def verify_otp(email: str, otp: str) -> bool:
    """Verify OTP is correct and not expired"""
    stored_data = otp_storage.get(email)
    
    if not stored_data:
        return False
    
    if datetime.utcnow() > stored_data["expires_at"]:
        del otp_storage[email]
        return False
    
    if stored_data["otp"] == otp:
        del otp_storage[email]  # Remove after successful verification
        return True# services/otp_service.py
import random
from datetime import datetime, timedelta

# Store OTPs and pending signup data (use Redis in production)
otp_storage = {}
pending_signups = {}

def generate_otp(email: str) -> str:
    """Generate 6-digit OTP"""
    otp = str(random.randint(100000, 999999))
    
    otp_storage[email] = {
        "otp": otp,
        "expires_at": datetime.utcnow() + timedelta(minutes=5)
    }
    return otp

def verify_otp(email: str, otp: str) -> bool:
    """Verify OTP is correct and not expired"""
    stored_data = otp_storage.get(email)
    
    if not stored_data:
        return False
    
    if datetime.utcnow() > stored_data["expires_at"]:
        del otp_storage[email]
        return False
    
    if stored_data["otp"] == otp:
        del otp_storage[email]
        return True
    
    return False

def store_pending_signup(email: str, signup_data: dict):
    """Store signup data temporarily until email is verified"""
    pending_signups[email] = {
        "data": signup_data,
        "expires_at": datetime.utcnow() + timedelta(minutes=10)
    }

def get_pending_signup(email: str) -> dict:
    """Retrieve pending signup data after OTP verification"""
    pending = pending_signups.get(email)
    
    if not pending:
        return None
    
    if datetime.utcnow() > pending["expires_at"]:
        del pending_signups[email]
        return None
    
    # Remove after retrieval
    data = pending["data"]
    del pending_signups[email]
    return data

    
    return False
