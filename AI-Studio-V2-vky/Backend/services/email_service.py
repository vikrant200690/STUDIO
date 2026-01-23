# services/email_service.py
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
import os
import ssl
import certifi

ssl_context = ssl.create_default_context(cafile=certifi.where())


def get_email_config():
    """Lazy load email configuration with validation"""
    
    mail_username = os.getenv("MAIL_USERNAME")
    mail_password = os.getenv("MAIL_PASSWORD")
    mail_from = os.getenv("MAIL_FROM")
    
    # Validate environment variables
    if not mail_username:
        raise ValueError("❌ MAIL_USERNAME environment variable is not set")
    if not mail_password:
        raise ValueError("❌ MAIL_PASSWORD environment variable is not set")
    if not mail_from:
        raise ValueError("❌ MAIL_FROM environment variable is not set")
    
    print(f"✅ Email config loaded: {mail_username}")
    
    return ConnectionConfig(
        MAIL_USERNAME=mail_username,
        MAIL_PASSWORD=mail_password,
        MAIL_FROM=mail_from,
        MAIL_PORT=587,
        MAIL_SERVER="smtp.gmail.com",
        MAIL_STARTTLS=True,
        MAIL_SSL_TLS=False,
        VALIDATE_CERTS=False,
    )

async def send_signup_otp_email(email: str, otp: str):
    """Send OTP for signup verification"""
    html_content = f"""
    <html>
        <body>
            <h2>Welcome to AI Studio V2!</h2>
            <p>Thank you for signing up! To complete your registration, please use this OTP:</p>
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
                <h1 style="color: #4CAF50; letter-spacing: 5px; margin: 0;">{otp}</h1>
            </div>
            <p>This code will expire in <strong>5 minutes</strong>.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <br>
            <p style="color: #666; font-size: 12px;">AI Studio V2 - Powered by Advanced AI</p>
        </body>
    </html>
    """
    
    message = MessageSchema(
        subject="Verify Your Email - AI Studio V2",
        recipients=[email],
        body=html_content,
        subtype="html"
    )
    
    fast_mail = FastMail(get_email_config())
    await fast_mail.send_message(message)

async def send_login_otp_email(email: str, otp: str):
    """Send OTP for login verification"""
    html_content = f"""
    <html>
        <body>
            <h2>Login Verification</h2>
            <p>Your login OTP code is:</p>
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
                <h1 style="color: #2196F3; letter-spacing: 5px; margin: 0;">{otp}</h1>
            </div>
            <p>This code will expire in <strong>5 minutes</strong>.</p>
            <p>If you didn't request this login, please secure your account immediately.</p>
            <br>
            <p style="color: #666; font-size: 12px;">AI Studio V2 - Powered by Advanced AI</p>
        </body>
    </html>
    """
    
    message = MessageSchema(
        subject="Your Login OTP - AI Studio V2",
        recipients=[email],
        body=html_content,
        subtype="html"
    )
    
    fast_mail = FastMail(get_email_config())
    await fast_mail.send_message(message)
