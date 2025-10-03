from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from contextlib import asynccontextmanager
import time
import logging
from pathlib import Path

from app.core.config import settings
from app.utils.logger import setup_logging
from app.api.routers import budget
from app.models.ml_models.budget_categorizer import budget_categorizer
from app.api.routers import budget, investment 


# Setup logging
logger = setup_logging()

# Lifespan events for ML model management
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan events"""
    # Startup
    logger.info("🚀 Starting Financial Literacy Budget API...")
    logger.info(f"📊 ML Model Status: {'Ready' if budget_categorizer.is_trained else 'Not Ready'}")
    
    if not budget_categorizer.is_trained:
        logger.warning("⚠️ ML model not ready. Some features may be limited.")
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down Financial Literacy Budget API...")

# Create FastAPI application
app = FastAPI(
    title=settings.API_TITLE,
    description=settings.API_DESCRIPTION,
    version=settings.API_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=settings.ALLOW_CREDENTIALS,
    allow_methods=settings.ALLOWED_METHODS,
    allow_headers=settings.ALLOWED_HEADERS,
)

# Trusted Host Middleware (security)
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1", "0.0.0.0", "*"]
)

# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """Add processing time to response headers"""
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Custom exception handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors"""
    logger.error(f"❌ Validation error on {request.url}: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": "Validation Error",
            "detail": exc.errors(),
            "message": "Please check your input data format"
        }
    )

@app.exception_handler(500)
async def internal_server_error_handler(request: Request, exc: Exception):
    """Handle internal server errors"""
    logger.error(f"❌ Internal server error on {request.url}: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": "Internal Server Error",
            "message": "An unexpected error occurred. Please try again later."
        }
    )

# Include routers
app.include_router(budget.router, prefix="/api/v1")
app.include_router(investment.router, prefix="/api/v1")

# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """API root endpoint"""
    return {
        "message": "🏦 Financial Literacy Budget Planner API",
        "version": settings.API_VERSION,
        "status": "running",
        "docs": "/docs",
        "ml_model_ready": budget_categorizer.is_trained,
        "endpoints": {
            "categorize": "/api/v1/budget/categorize",
            "batch_categorize": "/api/v1/budget/batch-categorize",
            "model_info": "/api/v1/budget/model-info",
            "health": "/api/v1/budget/health"
        }
    }

@app.get("/health", tags=["Root"])
async def health():
    """Simple health check"""
    return {
        "status": "healthy",
        "ml_model": "ready" if budget_categorizer.is_trained else "not_ready"
    }

if __name__ == "__main__":
    import uvicorn
    
    logger.info(f"🚀 Starting server on {settings.API_HOST}:{settings.API_PORT}")
    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.API_DEBUG,
        log_level=settings.LOG_LEVEL.lower()
    )
