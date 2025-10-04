# app/api/routers/auth.py
from fastapi import APIRouter, HTTPException, status, Depends, BackgroundTasks
from typing import Dict, Any
import logging

from app.schemas.auth import (
    UserSignUpRequest,
    UserSignInRequest,
    TokenResponse,
    UserResponse,
    RefreshTokenRequest,
    ErrorResponse,
    SuccessResponse
)
from app.services.auth_service import auth_service
from app.utils.dependencies import get_current_active_user

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
    responses={
        400: {"model": ErrorResponse},
        401: {"model": ErrorResponse},
        500: {"model": ErrorResponse}
    }
)

@router.post("/signup", response_model=SuccessResponse, status_code=status.HTTP_201_CREATED)
async def sign_up(user_data: UserSignUpRequest, background_tasks: BackgroundTasks):
    """Register a new user account"""
    try:
        user = await auth_service.create_user(user_data)
        
        logger.info(f"✅ New user registered: {user.email}")
        
        return SuccessResponse(
            message="Account created successfully! Welcome to FinZer.",
            data={
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "created_at": user.created_at.isoformat()
                }
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Signup error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create account"
        )

@router.post("/signin", response_model=TokenResponse)
async def sign_in(credentials: UserSignInRequest):
    """Sign in to user account"""
    try:
        token_response = await auth_service.authenticate_user(credentials)
        logger.info(f"✅ User signed in: {credentials.email}")
        return token_response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Signin error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication failed"
        )

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(request: RefreshTokenRequest):
    """Refresh access token"""
    try:
        token_response = await auth_service.refresh_access_token(request.refresh_token)
        return token_response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Token refresh error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to refresh token"
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: UserResponse = Depends(get_current_active_user)
):
    """Get current user profile"""
    return current_user

@router.post("/signout", response_model=SuccessResponse)
async def sign_out(current_user: UserResponse = Depends(get_current_active_user)):
    """Sign out user (client should delete tokens)"""
    logger.info(f"✅ User signed out: {current_user.email}")
    
    return SuccessResponse(
        message=f"Successfully signed out. Goodbye {current_user.name}!"
    )

@router.get("/validate", response_model=SuccessResponse)
async def validate_token(current_user: UserResponse = Depends(get_current_active_user)):
    """Validate current token"""
    return SuccessResponse(
        message="Token is valid",
        data={
            "user": {
                "id": current_user.id,
                "name": current_user.name,
                "email": current_user.email
            }
        }
    )
