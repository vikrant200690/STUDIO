from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
from urllib.parse import quote_plus  # ✅ Import this
import os

load_dotenv()

# 🔹 Snowflake connection details
SNOWFLAKE_ACCOUNT = os.getenv('SNOWFLAKE_ACCOUNT')
SNOWFLAKE_USER = os.getenv('SNOWFLAKE_USER')
SNOWFLAKE_PASSWORD = os.getenv('SNOWFLAKE_PASSWORD')  # This is the raw password from .env
SNOWFLAKE_DATABASE = os.getenv('SNOWFLAKE_DATABASE')
SNOWFLAKE_SCHEMA = os.getenv('SNOWFLAKE_SCHEMA')
SNOWFLAKE_WAREHOUSE = os.getenv('SNOWFLAKE_WAREHOUSE')
SNOWFLAKE_ROLE = os.getenv('SNOWFLAKE_ROLE')

# 🔹 URL-encode username and password for SQLAlchemy
encoded_user = quote_plus(SNOWFLAKE_USER)
encoded_password = quote_plus(SNOWFLAKE_PASSWORD)  # ✅ This will convert @ to %40

# 🔹 SQLAlchemy connection URL for Snowflake
DATABASE_URL = (
    f"snowflake://{encoded_user}:{encoded_password}"  # ✅ Use encoded credentials
    f"@{SNOWFLAKE_ACCOUNT}/{SNOWFLAKE_DATABASE}/{SNOWFLAKE_SCHEMA}"
    f"?warehouse={SNOWFLAKE_WAREHOUSE}&role={SNOWFLAKE_ROLE}"
)

# 🔹 Engine
engine = create_engine(DATABASE_URL)

# 🔹 Session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# 🔹 Base class for models
Base = declarative_base()

# 🔹 Dependency for FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()