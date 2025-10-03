# app/api/routers/chatbot.py
from fastapi import APIRouter, HTTPException, BackgroundTasks
import logging
from datetime import datetime

from app.schemas.chatbot import (
    ChatRequest,
    ChatResponse,
    ChatHealthResponse,
    SupportedTopicsResponse,
    ErrorResponse
)
from app.services.chatbot_service import chatbot_service

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(
    prefix="/chatbot",
    tags=["Financial Chatbot"],
    responses={
        500: {"model": ErrorResponse, "description": "Internal Server Error"},
        422: {"model": ErrorResponse, "description": "Validation Error"}
    }
)

async def update_stats(endpoint: str):
    """Background task to update API usage statistics"""
    logger.info(f"📊 Chatbot API endpoint used: {endpoint}")

@router.post(
    "/chat",
    response_model=ChatResponse,
    summary="Get Financial Advice",
    description="""
    Get AI-powered personalized financial advice using Groq's LLaMA model.
    
    The chatbot analyzes your financial situation and provides tailored advice on:
    - **Savings Strategies**: Emergency funds, savings optimization
    - **Investment Planning**: Portfolio allocation, SIP recommendations
    - **Budgeting**: Expense tracking, 50-30-20 rule implementation
    - **Debt Management**: Repayment strategies, debt consolidation
    - **Retirement Planning**: Corpus calculation, long-term savings
    - **Tax Planning**: Deductions, tax-efficient investments
    
    **Input Requirements:**
    - **query**: Your specific financial question
    - **user_profile**: Personal and financial information
    - **transactions**: List of your financial transactions
    
    **AI Features:**
    - Contextual analysis of your financial health
    - Personalized recommendations with specific amounts
    - Category-specific expert advice
    - Integration with investment recommendation engine
    """
)
async def get_financial_advice(
    request: ChatRequest,
    background_tasks: BackgroundTasks
):
    """Get AI-powered financial advice"""
    background_tasks.add_task(update_stats, "chatbot_advice")
    
    try:
        response = await chatbot_service.get_financial_advice(request)
        return response
        
    except ValueError as e:
        logger.error(f"❌ Validation error: {str(e)}")
        raise HTTPException(
            status_code=422,
            detail={
                "error": "Validation failed",
                "message": str(e),
                "suggestion": "Please check your input data and try again"
            }
        )
    except Exception as e:
        logger.error(f"❌ Chatbot error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Financial advice generation failed",
                "message": str(e),
                "suggestion": "Please try again or contact support"
            }
        )

@router.get(
    "/health",
    response_model=ChatHealthResponse,
    summary="Health Check",
    description="""
    Check the health status of the financial chatbot service.
    
    **Returns:**
    - Service availability status
    - Groq API connectivity status
    - System uptime information
    - Timestamp of health check
    """
)
async def health_check():
    """Health check endpoint"""
    try:
        result = await chatbot_service.health_check()
        return result
        
    except Exception as e:
        logger.error(f"❌ Chatbot health check failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Health check failed",
                "message": str(e)
            }
        )

@router.get(
    "/topics",
    response_model=SupportedTopicsResponse,
    summary="Get Supported Topics",
    description="""
    Get list of supported financial topics and their descriptions.
    
    **Supported Categories:**
    - **Savings**: Emergency funds, savings rate optimization
    - **Investment**: Portfolio allocation, mutual funds, SIP planning
    - **Budgeting**: Expense tracking, spending optimization
    - **Debt**: Debt repayment strategies, EMI planning
    - **Retirement**: Retirement corpus calculation, pension planning
    - **Tax**: Tax planning, deductions, tax-efficient investments
    - **General Finance**: Comprehensive financial planning
    """
)
async def get_supported_topics():
    """Get supported financial topics"""
    try:
        result = await chatbot_service.get_supported_topics()
        return result
        
    except Exception as e:
        logger.error(f"❌ Error getting topics: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Failed to get topics",
                "message": str(e)
            }
        )

@router.post(
    "/quick-advice",
    summary="Quick Financial Advice",
    description="Get quick financial advice without detailed analysis"
)
async def get_quick_advice(
    query: str,
    monthly_income: float,
    age: int,
    background_tasks: BackgroundTasks
):
    """Get quick financial advice with minimal input"""
    background_tasks.add_task(update_stats, "chatbot_quick_advice")
    
    try:
        # Create simplified request
        request = ChatRequest(
            query=query,
            user_profile={
                "monthly_income": monthly_income,
                "age": age,
                "risk_profile": "Moderate",
                "goal": "General Financial Health"
            },
            transactions=[
                {"description": "Estimated expenses", "amount": monthly_income * 0.7, "category": "Needs"}
            ]
        )
        
        response = await chatbot_service.get_financial_advice(request)
        
        return {
            "answer": response.answer,
            "query_category": response.query_category,
            "timestamp": response.timestamp
        }
        
    except Exception as e:
        logger.error(f"❌ Quick advice error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Quick advice failed",
                "message": str(e)
            }
        )
