# app/services/auth_service.py
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
from bson import ObjectId
from pymongo.errors import DuplicateKeyError
from fastapi import HTTPException, status
import logging

from app.core.database import get_database
from app.utils.auth import (
    get_password_hash, 
    verify_password, 
    create_access_token, 
    create_refresh_token,
    verify_token,
    validate_email,
    validate_password_strength
)
from app.schemas.auth import (
    UserSignUpRequest, 
    UserSignInRequest, 
    UserResponse, 
    TokenResponse,
    UserRole
)
from app.core.config import settings

logger = logging.getLogger(__name__)

class AuthService:
    def __init__(self):
        self.db = None
        
    async def get_database(self):
        """Get database instance with connection check"""
        try:
            self.db = get_database()
            if self.db is None:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="Database connection not available. Please ensure MongoDB is running."
                )
            return self.db
        except Exception as e:
            logger.error(f"Database connection error: {e}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database service unavailable"
            )
    
    async def create_user(self, user_data: UserSignUpRequest) -> UserResponse:
        """Create a new user with complete profile"""
        try:
            db = await self.get_database()
            
            # Validate email format
            if not validate_email(user_data.email):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid email format"
                )
            
            # Validate password strength
            is_strong, message = validate_password_strength(user_data.password)
            if not is_strong:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=message
                )
            
            # Check if user already exists
            existing_user = await db.users.find_one({"email": user_data.email.lower()})
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )
            
            # Hash password
            hashed_password = get_password_hash(user_data.password)
            
            # Parse date of birth if provided
            date_of_birth = None
            if hasattr(user_data, 'date_of_birth') and user_data.date_of_birth:
                try:
                    from datetime import datetime
                    date_of_birth = datetime.strptime(user_data.date_of_birth, "%Y-%m-%d").date()
                except ValueError:
                    pass  # Invalid date format, keep as None
            
            # Create comprehensive user document
            user_doc = {
                "name": user_data.name.strip(),
                "email": user_data.email.lower(),
                "password": hashed_password,
                "role": UserRole.USER,
                "is_verified": True,  # Auto-verify for now
                "is_active": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "last_login": None,
                "profile": {
                    "avatar_url": None,
                    "phone": getattr(user_data, 'phone_number', None),
                    "date_of_birth": date_of_birth.isoformat() if date_of_birth else None,
                    "country": getattr(user_data, 'country', 'India'),
                    "location": None
                },
                "preferences": {
                    "currency": "INR" if getattr(user_data, 'country', 'India') == "India" else "USD",
                    "language": "en",
                    "notifications": {
                        "email": True,
                        "push": True,
                        "newsletter": getattr(user_data, 'subscribe_newsletter', False)
                    }
                },
                "financial_profile": {
                    "monthly_income_range": getattr(user_data, 'monthly_income_range', None),
                    "financial_goal": getattr(user_data, 'financial_goal', None),
                    "financial_status": getattr(user_data, 'financial_status', None),
                    "risk_tolerance": "moderate",  # Default
                    "investment_experience": "beginner"  # Default
                },
                "onboarding": {
                    "completed": True,
                    "steps_completed": ["account", "profile", "preferences"],
                    "completed_at": datetime.utcnow()
                }
            }
            
            # Insert user
            result = await db.users.insert_one(user_doc)
            logger.info(f"✅ Created new user: {user_data.email}")
            
            # Fetch created user
            created_user = await db.users.find_one({"_id": result.inserted_id})
            
            # Return user response
            return UserResponse(
                id=str(created_user["_id"]),
                name=created_user["name"],
                email=created_user["email"],
                role=created_user["role"],
                is_verified=created_user["is_verified"],
                created_at=created_user["created_at"],
                updated_at=created_user["updated_at"]
            )
            
        except HTTPException:
            raise
        except DuplicateKeyError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        except Exception as e:
            logger.error(f"Error creating user: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create user account"
            )
    
    async def authenticate_user(self, credentials: UserSignInRequest) -> TokenResponse:
        """Authenticate user and return tokens"""
        try:
            db = await self.get_database()
            
            # Find user by email
            user = await db.users.find_one({"email": credentials.email.lower()})
            if not user or not verify_password(credentials.password, user["password"]):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password"
                )
            
            # Check if user is active
            if not user.get("is_active", True):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Account is deactivated"
                )
            
            # Update last login
            await db.users.update_one(
                {"_id": user["_id"]},
                {
                    "$set": {
                        "last_login": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            # Create tokens
            token_data = {"sub": str(user["_id"]), "email": user["email"]}
            
            # Adjust token expiry if remember_me is True
            if credentials.remember_me:
                access_expires = timedelta(days=1)  # Longer access token
            else:
                access_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
            
            access_token = create_access_token(token_data, access_expires)
            refresh_token = create_refresh_token(token_data)
            
            logger.info(f"✅ User authenticated: {credentials.email}")
            
            # Create user response
            user_response = UserResponse(
                id=str(user["_id"]),
                name=user["name"],
                email=user["email"],
                role=user["role"],
                is_verified=user["is_verified"],
                created_at=user["created_at"],
                updated_at=user["updated_at"]
            )
            
            return TokenResponse(
                access_token=access_token,
                refresh_token=refresh_token,
                expires_in=int(access_expires.total_seconds()),
                user=user_response
            )
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Authentication error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Authentication failed"
            )
    
    async def refresh_access_token(self, refresh_token: str) -> TokenResponse:
        """Refresh access token using refresh token"""
        try:
            db = await self.get_database()
            
            # Verify refresh token
            payload = verify_token(refresh_token, "refresh")
            if not payload:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid refresh token"
                )
            
            user_id = payload.get("sub")
            user = await db.users.find_one({"_id": ObjectId(user_id)})
            
            if not user or not user.get("is_active", True):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User not found or inactive"
                )
            
            # Create new tokens
            token_data = {"sub": str(user["_id"]), "email": user["email"]}
            access_token = create_access_token(token_data)
            new_refresh_token = create_refresh_token(token_data)
            
            user_response = UserResponse(
                id=str(user["_id"]),
                name=user["name"],
                email=user["email"],
                role=user["role"],
                is_verified=user["is_verified"],
                created_at=user["created_at"],
                updated_at=user["updated_at"]
            )
            
            return TokenResponse(
                access_token=access_token,
                refresh_token=new_refresh_token,
                expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
                user=user_response
            )
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Token refresh error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to refresh token"
            )
    
    async def get_user_by_id(self, user_id: str) -> Optional[UserResponse]:
        """Get user by ID"""
        try:
            db = await self.get_database()
            user = await db.users.find_one({"_id": ObjectId(user_id)})
            
            if not user:
                return None
                
            return UserResponse(
                id=str(user["_id"]),
                name=user["name"],
                email=user["email"],
                role=user["role"],
                is_verified=user["is_verified"],
                created_at=user["created_at"],
                updated_at=user["updated_at"]
            )
        except Exception as e:
            logger.error(f"Error getting user: {e}")
            return None

# Global service instance
auth_service = AuthService()
