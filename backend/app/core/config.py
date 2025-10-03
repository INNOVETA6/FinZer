from pydantic_settings import BaseSettings
from typing import List
import os
from pathlib import Path

class Settings(BaseSettings):
    # API Configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_DEBUG: bool = True
    API_TITLE: str = "Financial Literacy Budget Planner API"
    API_VERSION: str = "1.0.0"
    API_DESCRIPTION: str = "AI-powered budget categorization and financial planning API"
    
    # CORS Configuration
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ]
    ALLOWED_METHODS: List[str] = ["*"]
    ALLOWED_HEADERS: List[str] = ["*"]
    ALLOW_CREDENTIALS: bool = True
    
    # ML Model Configuration
    ML_MODEL_PATH: str = "./app/models/ml_models/"
    MODEL_FILE_NAME: str = "expense_classifier.pkl"
    DATASET_FILE_NAME: str = "transactions_dataset.csv"
    ENABLE_ML_LOGGING: bool = True
    MODEL_AUTO_RETRAIN: bool = False
    
    # Logging Configuration
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "./logs/app.log"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # Background Tasks
    ENABLE_BACKGROUND_TASKS: bool = True
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW: int = 60  # seconds
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()

# Ensure directories exist
os.makedirs(settings.ML_MODEL_PATH, exist_ok=True)
os.makedirs(Path(settings.LOG_FILE).parent, exist_ok=True)
