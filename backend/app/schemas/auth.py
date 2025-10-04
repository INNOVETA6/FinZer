# app/schemas/auth.py
from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"

class UserSignUpRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, example="John Doe")
    email: str = Field(..., example="john@example.com")
    password: str = Field(..., min_length=8, example="SecurePassword123!")
    confirm_password: str = Field(..., example="SecurePassword123!")
    
    # Optional profile fields
    date_of_birth: Optional[str] = Field(None, example="1995-01-15")
    phone_number: Optional[str] = Field(None, example="+91 98765 43210")
    country: Optional[str] = Field("India", example="India")
    monthly_income_range: Optional[str] = Field(None, example="60k-100k")
    financial_goal: Optional[str] = Field(None, example="emergency-fund")
    financial_status: Optional[str] = Field(None, example="starting")
    subscribe_newsletter: Optional[bool] = Field(False, example=True)
    agree_to_terms: Optional[bool] = Field(True, example=True)
    
    @validator('email')
    def validate_email(cls, v):
        import re
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(pattern, v):
            raise ValueError('Invalid email format')
        return v.lower()
    
    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v

class UserSignInRequest(BaseModel):
    email: str = Field(..., example="john@example.com")
    password: str = Field(..., example="SecurePassword123!")
    remember_me: bool = Field(default=False)

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: UserRole
    is_verified: bool
    created_at: datetime
    updated_at: datetime

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    errors: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class SuccessResponse(BaseModel):
    success: bool = True
    message: str
    data: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
