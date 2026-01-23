# test_email.py
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

async def test_email_sending():
    """Test if email configuration works"""
    from services.email_service import send_signup_otp_email, send_login_otp_email
    
    test_email = "vky200690@gmail.com"  # Replace with your email
    test_otp = "123456"
    
    print("🧪 Testing Email Service...")
    print(f"📧 Test email: {test_email}")
    print(f"🔑 Test OTP: {test_otp}")
    print("-" * 50)
    
    # Check environment variables
    mail_username = os.getenv("MAIL_USERNAME")
    mail_password = os.getenv("MAIL_PASSWORD")
    mail_from = os.getenv("MAIL_FROM")
    
    print(f"✅ MAIL_USERNAME: {mail_username}")
    print(f"✅ MAIL_PASSWORD: {'*' * 8 if mail_password else 'NOT SET'}")
    print(f"✅ MAIL_FROM: {mail_from}")
    print("-" * 50)
    
    try:
        # Test signup OTP email
        print("📤 Sending signup OTP email...")
        await send_signup_otp_email(test_email, test_otp)
        print("✅ Signup OTP email sent successfully!")
        print(f"📬 Check {test_email} inbox")
        
        # Wait a bit
        await asyncio.sleep(2)
        
        # Test login OTP email
        print("\n📤 Sending login OTP email...")
        await send_login_otp_email(test_email, test_otp)
        print("✅ Login OTP email sent successfully!")
        print(f"📬 Check {test_email} inbox")
        
        print("\n" + "=" * 50)
        print("🎉 All email tests passed!")
        print("=" * 50)
        
    except Exception as e:
        print(f"\n❌ Email test failed: {e}")
        print(f"Error type: {type(e).__name__}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_email_sending())
