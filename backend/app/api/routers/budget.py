from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from fastapi.responses import JSONResponse
import logging
from typing import Dict, Any

from app.schemas.budget import (
    ExpenseItem,
    BatchExpenseRequest,
    SingleCategorizationResponse,
    BatchCategorizationResponse,
    ModelInfoResponse,
    HealthCheckResponse,
    ErrorResponse
)
from app.services.budget_service import budget_service

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(
    prefix="/budget",
    tags=["Budget Analysis"],
    responses={
        500: {"model": ErrorResponse, "description": "Internal Server Error"},
        422: {"model": ErrorResponse, "description": "Validation Error"}
    }
)

async def update_stats(endpoint: str):
    """Background task to update API usage statistics"""
    # You can implement analytics/monitoring here
    logger.info(f"📊 API endpoint used: {endpoint}")

@router.post(
    "/categorize",
    response_model=SingleCategorizationResponse,
    summary="Categorize Single Expense",
    description="""
    Categorize a single expense transaction using AI-powered hybrid model.
    
    The system uses a combination of rule-based and machine learning approaches:
    - **Rule-based**: Fast keyword matching for common patterns
    - **Machine Learning**: Trained classifier for complex cases
    - **Hybrid**: Combines both approaches for maximum accuracy
    
    **Categories:**
    - **Needs**: Essential expenses (rent, utilities, groceries, etc.)
    - **Wants**: Discretionary spending (entertainment, dining out, shopping, etc.)
    - **Savings**: Investments and savings (SIP, FD, stocks, etc.)
    
    **Parameters:**
    - **description**: Transaction description (required)
    - **amount**: Transaction amount (optional, helps with context)
    """
)
async def categorize_expense(
    expense: ExpenseItem,
    background_tasks: BackgroundTasks
):
    """Categorize a single expense transaction"""
    background_tasks.add_task(update_stats, "budget_categorize")
    
    try:
        result = await budget_service.categorize_single_expense(expense)
        return result
        
    except Exception as e:
        logger.error(f"❌ Budget categorization error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Categorization failed",
                "message": str(e),
                "suggestion": "Please check your input and try again"
            }
        )

@router.post(
    "/batch-categorize",
    response_model=BatchCategorizationResponse,
    summary="Batch Categorize Expenses",
    description="""
    Categorize multiple expenses in a single request for better performance.
    
    **Features:**
    - Process up to 100 transactions at once
    - Automatic summary statistics
    - Category distribution analysis
    - Individual confidence scores
    
    **Response includes:**
    - Individual categorization results
    - Category-wise totals
    - Percentage distribution
    - Processing metrics
    """
)
async def batch_categorize_expenses(
    batch_request: BatchExpenseRequest,
    background_tasks: BackgroundTasks
):
    """Categorize multiple expenses in batch"""
    background_tasks.add_task(update_stats, "budget_batch_categorize")
    
    try:
        if len(batch_request.expenses) > 100:
            raise HTTPException(
                status_code=422,
                detail="Maximum 100 expenses allowed per batch request"
            )
        
        result = await budget_service.batch_categorize_expenses(batch_request)
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Batch categorization error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Batch categorization failed",
                "message": str(e),
                "suggestion": "Please check your input format and try again"
            }
        )

@router.get(
    "/model-info",
    response_model=ModelInfoResponse,
    summary="Get Model Information",
    description="""
    Get detailed information about the AI model and service status.
    
    **Returns:**
    - Model training status
    - File paths and existence
    - Category rules and counts
    - Service statistics
    - Performance metrics
    """
)
async def get_model_info(background_tasks: BackgroundTasks):
    """Get information about the ML model"""
    background_tasks.add_task(update_stats, "model_info")
    
    try:
        result = await budget_service.get_model_info()
        return result
        
    except Exception as e:
        logger.error(f"❌ Error fetching model info: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Failed to fetch model information",
                "message": str(e)
            }
        )

@router.get(
    "/health",
    response_model=HealthCheckResponse,
    summary="Health Check",
    description="""
    Check the health status of the budget analysis service.
    
    **Status Information:**
    - Service availability
    - ML model readiness
    - System uptime
    - Version information
    """
)
async def health_check():
    """Health check endpoint"""
    try:
        result = await budget_service.health_check()
        return result
        
    except Exception as e:
        logger.error(f"❌ Health check failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Health check failed",
                "message": str(e)
            }
        )

@router.get(
    "/categories",
    summary="Get Available Categories",
    description="Get list of available expense categories and their descriptions"
)
async def get_categories():
    """Get available expense categories"""
    return {
        "success": True,
        "data": {
            "categories": [
                {
                    "name": "Needs",
                    "description": "Essential expenses required for basic living",
                    "examples": ["rent", "utilities", "groceries", "medical", "transportation"]
                },
                {
                    "name": "Wants", 
                    "description": "Discretionary spending for lifestyle and entertainment",
                    "examples": ["dining out", "entertainment", "shopping", "travel", "subscriptions"]
                },
                {
                    "name": "Savings",
                    "description": "Investments and savings for future financial goals",
                    "examples": ["SIP", "fixed deposits", "stocks", "mutual funds", "retirement planning"]
                }
            ],
            "total_categories": 3,
            "default_category": "Other"
        }
    }
