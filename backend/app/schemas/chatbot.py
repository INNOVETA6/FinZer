# app/schemas/chatbot.py
from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional
from datetime import datetime

class ChatRequest(BaseModel):
    query: str = Field(..., example="How much should I save each month?", description="User's financial question")
    user_profile: Dict[str, Any] = Field(
        ..., 
        example={
            "name": "John Doe",
            "age": 28,
            "monthly_income": 75000,
            "risk_profile": "Moderate",
            "goal": "Wealth Building",
            "employment_type": "Salaried",
            "investment_experience": "Beginner"
        },
        description="User's profile information"
    )
    transactions: List[Dict[str, Any]] = Field(
        ...,
        example=[
            {"description": "Rent", "amount": 15000, "category": "Needs"},
            {"description": "Groceries", "amount": 8000, "category": "Needs"},
            {"description": "Entertainment", "amount": 5000, "category": "Wants"}
        ],
        description="List of user's financial transactions"
    )

class FinancialAnalysis(BaseModel):
    total_income: float
    total_expenses: float
    savings_amount: float
    savings_rate: float
    category_breakdown: Dict[str, float]
    top_category: str
    financial_health_score: int

class ChatResponse(BaseModel):
    answer: str = Field(..., description="AI-generated financial advice")
    method: str = Field(..., description="Method used to generate response")
    query_category: str = Field(..., description="Category of the financial query")
    financial_analysis: FinancialAnalysis = Field(..., description="Analysis of user's financial situation")
    timestamp: str = Field(..., description="Response timestamp")

class ChatHealthResponse(BaseModel):
    status: str = "healthy"
    service: str = "Financial Chatbot"
    groq_api_status: str
    timestamp: str

class SupportedTopicsResponse(BaseModel):
    supported_topics: List[str] = [
        "savings", "investment", "budgeting", "debt", 
        "retirement", "tax", "general_finance"
    ]
    descriptions: Dict[str, str] = {
        "savings": "Emergency funds, savings strategies, savings rate optimization",
        "investment": "Portfolio allocation, mutual funds, stocks, SIP planning",
        "budgeting": "Expense tracking, 50-30-20 rule, spending optimization",
        "debt": "Debt repayment strategies, EMI planning, debt consolidation",
        "retirement": "Retirement corpus calculation, pension planning, long-term savings",
        "tax": "Tax planning, 80C deductions, tax-efficient investments",
        "general_finance": "Comprehensive financial planning and advice"
    }

class ErrorResponse(BaseModel):
    success: bool = False
    error: str
    detail: Optional[str] = None
    timestamp: str
