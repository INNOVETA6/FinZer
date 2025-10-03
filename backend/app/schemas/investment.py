# app/schemas/investment.py
from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class RiskProfileEnum(str, Enum):
    CONSERVATIVE = "Conservative"
    MODERATE = "Moderate"
    AGGRESSIVE = "Aggressive"

class GoalTypeEnum(str, Enum):
    EMERGENCY_FUND = "Emergency Fund"
    RETIREMENT = "Retirement"
    WEALTH_BUILDING = "Wealth Building"
    EDUCATION_FUND = "Education Fund"
    HOUSE_DOWN_PAYMENT = "House Down Payment"
    VACATION_FUND = "Vacation Fund"

class EmploymentTypeEnum(str, Enum):
    SALARIED = "Salaried"
    SELF_EMPLOYED = "Self-Employed"
    BUSINESS = "Business"
    PROFESSIONAL = "Professional"
    STUDENT = "Student"

class UserProfile(BaseModel):
    income: float = Field(..., ge=0, example=75000, description="Monthly income in INR")
    age: int = Field(..., ge=18, le=100, example=28, description="User age")
    risk_profile: RiskProfileEnum = Field(..., example="Moderate")
    goal_type: GoalTypeEnum = Field(..., example="Wealth Building")
    employment_type: Optional[EmploymentTypeEnum] = Field("Salaried", example="Salaried")
    existing_savings: Optional[float] = Field(0, ge=0, example=80000)
    debt_amount: Optional[float] = Field(0, ge=0, example=15000)
    monthly_expenses: Optional[float] = Field(None, example=45000)
    investment_amount: Optional[float] = Field(None, example=20000)

    @validator('income')
    def validate_income(cls, v):
        if v <= 0:
            raise ValueError('Income must be positive')
        return v

    @validator('age')
    def validate_age(cls, v):
        if v < 18 or v > 100:
            raise ValueError('Age must be between 18 and 100')
        return v

class BatchInvestmentRequest(BaseModel):
    profiles: List[UserProfile] = Field(
        ...,
        min_items=1,
        max_items=50,
        description="List of user profiles (max 50 items)"
    )

class AllocationBreakdown(BaseModel):
    percentages: Dict[str, float]
    amounts: Dict[str, float]
    by_asset_class: Dict[str, float]

class FinancialHealthScores(BaseModel):
    stability_score: float
    readiness_score: float
    risk_capacity_score: float

class RiskMetrics(BaseModel):
    portfolio_risk_score: float
    portfolio_risk_level: str
    diversification_score: float
    suitability_score: float
    volatility_estimate: str

class ExpectedReturns(BaseModel):
    expected_return: float
    time_horizon_years: int
    risk_adjusted_return: float
    projection_example: Optional[Dict[str, float]] = None

class InvestmentInsights(BaseModel):
    portfolio_insights: List[str]
    risk_management_insights: List[str]
    goal_alignment_insights: List[str]
    improvement_suggestions: List[str]

class ImplementationPlan(BaseModel):
    immediate_actions: List[str]
    short_term_plan: List[str]
    long_term_strategy: List[str]
    monitoring_recommendations: List[str]

class ModelMetadata(BaseModel):
    confidence_score: float
    method: str
    model_version: str
    training_date: Optional[str] = None

class InvestmentRecommendationResponse(BaseModel):
    success: bool = True
    data: Dict[str, Any] = Field(
        ...,
        example={
            "recommendation_summary": {},
            "allocation_breakdown": {},
            "detailed_analysis": {},
            "insights_and_recommendations": {},
            "implementation_plan": {},
            "model_metadata": {}
        }
    )
    metadata: Optional[Dict[str, Any]] = None
    processing_time_ms: Optional[float] = None

class BatchInvestmentResponse(BaseModel):
    success: bool = True
    data: Dict[str, Any] = Field(
        ...,
        example={
            "processed_count": 5,
            "successful_count": 5,
            "failed_count": 0,
            "results": []
        }
    )
    processing_time_ms: Optional[float] = None

class ModelTrainingResponse(BaseModel):
    success: bool = True
    message: str
    status: str
    timestamp: str

class HealthCheckResponse(BaseModel):
    status: str = "healthy"
    timestamp: str
    version: str = "1.0.0"
    model_status: str
    uptime_seconds: float

class ErrorResponse(BaseModel):
    success: bool = False
    error: str
    detail: Optional[str] = None
    timestamp: str
