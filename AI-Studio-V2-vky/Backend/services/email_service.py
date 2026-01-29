import os
import resend

# Load API key once
resend.api_key = os.getenv("RESEND_API_KEY")

if not resend.api_key:
    raise ValueError("❌ RESEND_API_KEY environment variable is not set")


# 🔹 Common email wrapper
def send_email(to_email: str, subject: str, html_content: str):
    try:
        resend.Emails.send({
            "from": "AI Studio V2 <onboarding@resend.dev>",  # change after domain verification
            "to": [to_email],
            "subject": subject,
            "html": html_content,
        })
        print(f"✅ Email sent to {to_email}")
    except Exception as e:
        print(f"❌ Failed to send email: {e}")
        raise e


# 🔹 Signup OTP
async def send_signup_otp_email(email: str, otp: str):
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

    send_email(
        to_email=email,
        subject="Verify Your Email - AI Studio V2",
        html_content=html_content
    )


# 🔹 Login OTP
async def send_login_otp_email(email: str, otp: str):
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

    send_email(
        to_email=email,
        subject="Your Login OTP - AI Studio V2",
        html_content=html_content
    )
