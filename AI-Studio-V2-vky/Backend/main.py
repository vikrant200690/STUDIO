from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router as chat_router
from api.analytics import router as analytics_router
from api.auth import router as auth_router
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import os
from urllib.parse import urlparse
from api.transcribe import app as transcribe_app
from api.tts_route import app as tts_app
from utils.logger import setup_logger
from services.api_usage_tracker import APIUsageTracker, APIUsageMiddleware
from routes.export import router as export_router
from huggingface_hub import login

hf_token = os.getenv("HF_TOKEN")
if hf_token:
    login(token=hf_token)
    print("✅ Hugging Face token loaded")
else:
    print("⚠️ HF_TOKEN not set")
    
    
load_dotenv()

# Get URL configuration with fallback
url = os.getenv("URL")
parsed_url = urlparse(url)
host = parsed_url.hostname 
port = parsed_url.port


app = FastAPI(
    title="AI Studio V2",
    description="Enhanced AI Studio with PDF Page Number Support, Live Analytics, and OTP Authentication"
)


# Initialize API usage tracker
api_tracker = APIUsageTracker()


# Add API usage tracking middleware
app.add_middleware(APIUsageMiddleware, tracker=api_tracker)


@app.on_event("startup")
async def startup_event():
    setup_logger("ai_studio", "INFO")
    print("🚀 AI Studio V2 Backend starting up...")
    print("📄 PDF Page Number Support: ENABLED")
    print("🔍 Enhanced logging: ENABLED")
    print("📊 Live Analytics Dashboard: ENABLED")
    print("🔌 WebSocket Analytics: ENABLED")
    print("🔐 JWT Cookie Authentication: ENABLED")
    print("📧 Email OTP Authentication: ENABLED")

    try:
        from utils.snowflake_setup import create_api_usage_table
        create_api_usage_table()
        print("✅ Analytics database ready")
    except Exception as e:
        print(f"⚠️  Analytics database setup warning: {e}")


# CORS Configuration - MUST come before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5177",
        "http://127.0.0.1:5177",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ✅ REGISTER ROUTERS FIRST (BEFORE app.mount)
app.include_router(auth_router, prefix="/api/auth", tags=["authentication"])
app.include_router(chat_router, prefix="/api", tags=["chat"])
app.include_router(analytics_router, prefix="/api", tags=["analytics"])
app.include_router(export_router)

# ✅ MOUNT SUB-APPS AFTER ROUTERS
app.mount("/api/transcribe", transcribe_app)
app.mount("/api/tts", tts_app)


# ✅ MOUNT STATIC FILES LAST
app.mount("/static", StaticFiles(directory="plugins_repo"), name="plugins_repo")


# Test endpoint
@app.get("/")
def root():
    return {"message": "AI Studio V2 is running", "status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8080))
    )