# app/api/routers/investment.py
from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from fastapi.responses import JSONResponse
import logging
from typing import Dict, Any
from datetime import datetime

from app.schemas.investment import (
    UserProfile,
    BatchInvestmentRequest,
    InvestmentRecommendationResponse,
    BatchInvestmentResponse,
    ModelTrainingResponse,
    HealthCheckResponse,
    ErrorResponse
)
from app.services.investment_service import investment_service

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(
    prefix="/investment",
    tags=["Investment Planning"],
    responses={
        500: {"model": ErrorResponse, "description": "Internal Server Error"},
        422: {"model": ErrorResponse, "description": "Validation Error"}
    }
)

async def update_stats(endpoint: str):
    """Background task to update API usage statistics"""
    logger.info(f"📊 Investment API endpoint used: {endpoint}")

@router.post(
    "/recommend",
    response_model=InvestmentRecommendationResponse,
    summary="Get Investment Recommendation",
    description="""
    Get AI-powered personalized investment portfolio recommendation.
    
    The system analyzes your financial profile and generates:
    - **Optimized Asset Allocation**: Personalized portfolio mix
    - **Risk-Adjusted Returns**: Expected performance metrics
    - **Implementation Plan**: Step-by-step investment strategy
    - **Financial Health Scores**: Comprehensive financial analysis
    
    **Required Parameters:**
    - **income**: Monthly income in INR (required)
    - **age**: User age between 18-100 (required)
    - **risk_profile**: Conservative, Moderate, or Aggressive (required)
    - **goal_type**: Investment goal type (required)
    
    **Optional Parameters:**
    - **employment_type**: Type of employment
    - **existing_savings**: Current savings amount
    - **debt_amount**: Current debt amount
    - **monthly_expenses**: Monthly expenses (auto-calculated if not provided)
    - **investment_amount**: Specific investment amount (auto-calculated if not provided)
    """
)
async def recommend_investment(
    profile: UserProfile,
    background_tasks: BackgroundTasks
):
    """Get AI-powered personalized investment portfolio recommendation"""
    background_tasks.add_task(update_stats, "investment_recommend")
    
    try:
        result = await investment_service.get_investment_recommendation(profile)
        return result
        
    except Exception as e:
        logger.error(f"❌ Investment recommendation error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Investment recommendation failed",
                "message": str(e),
                "suggestion": "Please check your input and try again"
            }
        )

@router.post(
    "/batch-recommend",
    response_model=BatchInvestmentResponse,
    summary="Batch Investment Recommendations",
    description="""
    Get investment recommendations for multiple users in batch.
    
    **Features:**
    - Process up to 50 user profiles at once
    - Automatic error handling for invalid profiles
    - Detailed success/failure reporting
    - Optimized for bulk processing
    
    **Response includes:**
    - Individual recommendation results
    - Processing statistics
    - Error handling for failed profiles
    """
)
async def batch_recommend_investments(
    batch_request: BatchInvestmentRequest,
    background_tasks: BackgroundTasks
):
    """Get investment recommendations for multiple users in batch"""
    background_tasks.add_task(update_stats, "investment_batch_recommend")
    
    try:
        if len(batch_request.profiles) > 50:
            raise HTTPException(
                status_code=422,
                detail="Maximum 50 profiles allowed per batch request"
            )
        
        result = await investment_service.batch_investment_recommendations(batch_request)
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Batch investment recommendation error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Batch investment recommendation failed",
                "message": str(e),
                "suggestion": "Please check your input format and try again"
            }
        )

@router.post(
    "/train",
    response_model=ModelTrainingResponse,
    summary="Train Investment Model",
    description="""
    Retrain the investment recommendation model with latest data.
    
    **Note:** This operation may take several minutes and runs in the background.
    
    **Training Process:**
    - Generates synthetic financial data
    - Trains advanced ML algorithms
    - Validates model performance
    - Updates model metadata
    """
)
async def train_investment_model(background_tasks: BackgroundTasks):
    """Retrain the investment recommendation model with latest data"""
    background_tasks.add_task(update_stats, "investment_train")
    
    try:
        result = await investment_service.train_model()
        return result
        
    except Exception as e:
        logger.error(f"❌ Model training error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Model training failed",
                "message": str(e)
            }
        )

@router.get(
    "/health",
    response_model=HealthCheckResponse,
    summary="Health Check",
    description="""
    Check the health status of the investment recommendation service.
    
    **Status Information:**
    - Service availability
    - ML model readiness
    - System uptime
    - Performance metrics
    """
)
async def health_check():
    """Health check endpoint"""
    try:
        result = await investment_service.health_check()
        return result
        
    except Exception as e:
        logger.error(f"❌ Investment health check failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Health check failed",
                "message": str(e)
            }
        )

@router.get(
    "/risk-profiles",
    summary="Get Risk Profiles",
    description="Get available risk profiles and their descriptions"
)
async def get_risk_profiles():
    """Get available risk profiles"""
    return {
        "success": True,
        "data": {
            "risk_profiles": [
                {
                    "name": "Conservative",
                    "description": "Lower risk, stable returns, capital preservation focused",
                    "equity_max": "30%",
                    "expected_return": "7-9% annually",
                    "suitable_for": ["Retirees", "Risk-averse investors", "Short-term goals"]
                },
                {
                    "name": "Moderate",
                    "description": "Balanced risk-return profile, moderate growth potential",
                    "equity_max": "60%",
                    "expected_return": "9-12% annually",
                    "suitable_for": ["Working professionals", "Medium-term goals", "Balanced approach"]
                },
                {
                    "name": "Aggressive",
                    "description": "Higher risk, high growth potential, long-term wealth creation",
                    "equity_max": "80%",
                    "expected_return": "12-15% annually",
                    "suitable_for": ["Young investors", "Long-term goals", "High risk tolerance"]
                }
            ]
        }
    }

@router.get(
    "/goal-types",
    summary="Get Goal Types",
    description="Get available investment goal types and their characteristics"
)
async def get_goal_types():
    """Get available investment goal types"""
    return {
        "success": True,
        "data": {
            "goal_types": [
                {
                    "name": "Emergency Fund",
                    "description": "Emergency fund covering 6-12 months of expenses",
                    "time_horizon": "1-2 years",
                    "liquidity_importance": "Very High",
                    "recommended_allocation": "High liquidity instruments"
                },
                {
                    "name": "Retirement",
                    "description": "Long-term retirement planning and wealth accumulation",
                    "time_horizon": "15-30 years",
                    "liquidity_importance": "Low",
                    "recommended_allocation": "Growth-oriented portfolio"
                },
                {
                    "name": "Wealth Building",
                    "description": "General wealth creation and financial growth",
                    "time_horizon": "10-20 years",
                    "liquidity_importance": "Medium",
                    "recommended_allocation": "Balanced growth portfolio"
                },
                {
                    "name": "Education Fund",
                    "description": "Funding for education expenses (self or children)",
                    "time_horizon": "5-15 years",
                    "liquidity_importance": "Medium-High",
                    "recommended_allocation": "Conservative to moderate growth"
                },
                {
                    "name": "House Down Payment",
                    "description": "Saving for house down payment",
                    "time_horizon": "3-7 years",
                    "liquidity_importance": "High",
                    "recommended_allocation": "Conservative instruments"
                },
                {
                    "name": "Vacation Fund",
                    "description": "Short-term travel and vacation planning",
                    "time_horizon": "1-3 years",
                    "liquidity_importance": "Very High",
                    "recommended_allocation": "High liquidity, low risk"
                }
            ]
        }
    }
