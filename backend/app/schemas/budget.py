from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class CategoryEnum(str, Enum):
    NEEDS = "Needs"
    WANTS = "Wants"
    SAVINGS = "Savings"
    OTHER = "Other"

class MethodEnum(str, Enum):
    RULE = "rule"
    ML = "ml"
    HYBRID = "hybrid"
    RULE_PRIORITY = "rule_priority"
    ML_PRIORITY = "ml_priority"
    RULE_FALLBACK = "rule_fallback"
    NONE = "none"
    ERROR = "error"

class ExpenseItem(BaseModel):
    description: str = Field(
        ..., 
        min_length=1,
        max_length=500,
        example="Swiggy Food Order",
        description="Transaction description"
    )
    amount: Optional[float] = Field(
        None, 
        ge=0,
        example=450.0,
        description="Transaction amount (optional)"
    )
    
    @validator('description')
    def validate_description(cls, v):
        if not v or not v.strip():
            raise ValueError('Description cannot be empty')
        return v.strip()

class BatchExpenseRequest(BaseModel):
    expenses: List[ExpenseItem] = Field(
        ...,
        min_items=1,
        max_items=100,
        description="List of expenses to categorize (max 100 items)"
    )

class AlternativeCategory(BaseModel):
    category: str
    confidence: float

class CategorizationResult(BaseModel):
    description: str
    category: CategoryEnum
    confidence: float = Field(..., ge=0.0, le=1.0)
    method: MethodEnum
    amount: Optional[float] = None
    transaction_id: Optional[int] = None
    alternatives: Optional[Dict[str, AlternativeCategory]] = None
    error: Optional[str] = None
    timestamp: str

class SingleCategorizationResponse(BaseModel):
    success: bool = True
    data: CategorizationResult
    warning: Optional[str] = None
    processing_time_ms: Optional[float] = None

class CategorySummary(BaseModel):
    category_totals: Dict[str, float]
    total_amount: float
    category_distribution: Dict[str, float]
    processed_count: int

class BatchCategorizationResponse(BaseModel):
    success: bool = True
    data: Dict[str, Any] = Field(
        ...,
        example={
            "processed_count": 5,
            "results": [],
            "summary": {
                "category_totals": {"Needs": 1500.0, "Wants": 800.0, "Savings": 5000.0},
                "total_amount": 7300.0,
                "category_distribution": {"Needs": 20.55, "Wants": 10.96, "Savings": 68.49}
            }
        }
    )
    processing_time_ms: Optional[float] = None

class ModelInfoResponse(BaseModel):
    success: bool = True
    data: Dict[str, Any]

class HealthCheckResponse(BaseModel):
    status: str = "healthy"
    timestamp: str
    version: str = "1.0.0"
    ml_model_status: str
    uptime_seconds: float

class ErrorResponse(BaseModel):
    success: bool = False
    error: str
    detail: Optional[str] = None
    timestamp: str
