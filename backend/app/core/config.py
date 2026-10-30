import os
from typing import List, Union
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, field_validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "Smart Urban Heat & Climate Resilience Platform"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    
    # JWT & Auth
    SECRET_KEY: str = "super-secret-jwt-key-replace-in-production-for-climate-platform"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/urban_heat_db"
    USE_SQLITE_FALLBACK: bool = True
    SQLITE_DB_PATH: str = "urban_heat_dev.db"
    
    # Uploads
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_MB: int = 25
    
    # Payments
    RAZORPAY_KEY_ID: str = "rzp_test_placeholder"
    RAZORPAY_KEY_SECRET: str = "rzp_secret_placeholder"
    RAZORPAY_WEBHOOK_SECRET: str = "rzp_webhook_secret_placeholder"
    
    # Pilot Settings - Jalandhar, Punjab
    PILOT_CITY: str = "Jalandhar"
    PILOT_STATE: str = "Punjab"
    PILOT_COUNTRY: str = "India"
    PILOT_DEFAULT_LAT: float = 31.3260
    PILOT_DEFAULT_LNG: float = 75.5762

    # LLM Cognitive Decision Engine
    OPENAI_API_KEY: str = ""
    LLM_MODEL_NAME: str = "gpt-4o-mini"
    USE_LLM_DECISION_ENGINE: bool = True

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8", "case_sensitive": True, "extra": "ignore"}

settings = Settings()
