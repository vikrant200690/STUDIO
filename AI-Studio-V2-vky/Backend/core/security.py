# core/security.py
import hashlib
import bcrypt

def _prehash(password: str) -> bytes:
    """Pre-hash password with SHA-256 to handle any length"""
    return hashlib.sha256(password.encode("utf-8")).hexdigest().encode("utf-8")

def hash_password(password: str) -> str:
    """Hash password with SHA-256 pre-hashing and bcrypt"""
    prehashed = _prehash(password)
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(prehashed, salt)
    return hashed.decode("utf-8")

def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hashed password"""
    prehashed = _prehash(password)
    return bcrypt.checkpw(prehashed, hashed.encode("utf-8"))