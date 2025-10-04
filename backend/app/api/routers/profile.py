# app/api/routers/profile.py (Fixed Database Check)
from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any
import logging
from datetime import datetime

from app.core.database import get_database
from app.schemas.auth import SuccessResponse, ErrorResponse

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/profile",
    tags=["User Profile"],
    responses={
        400: {"model": ErrorResponse},
        500: {"model": ErrorResponse}
    }
)

@router.get("/me")
async def get_my_profile():
    """Get current user's complete profile"""
    try:
        logger.info("🔄 Getting user profile...")
        
        # Get database connection - FIXED: Proper None check
        db = get_database()
        if db is None:  # FIXED: Use 'is None' instead of 'not db'
            logger.error("❌ Database not available")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database connection not available. Please ensure MongoDB is running."
            )
        
        logger.info("✅ Database connection obtained")
        
        # Get the most recent user from database
        user = await db.users.find_one({}, sort=[("created_at", -1)])
        if user is None:  # FIXED: Use 'is None' instead of 'not user'
            logger.error("❌ No users found in database")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No users found. Please sign up first."
            )
        
        logger.info(f"✅ Found user: {user.get('email', 'Unknown')}")
        
        # Format profile data with safe gets
        profile_data = {
            "id": str(user["_id"]),
            "name": user.get("name", "Unknown User"),
            "email": user.get("email", ""),
            "role": user.get("role", "user"),
            "is_verified": user.get("is_verified", False),
            "created_at": user.get("created_at", datetime.utcnow()).isoformat() if user.get("created_at") else datetime.utcnow().isoformat(),
            "updated_at": user.get("updated_at", datetime.utcnow()).isoformat() if user.get("updated_at") else datetime.utcnow().isoformat(),
            "last_login": user.get("last_login").isoformat() if user.get("last_login") is not None else None,
            
            # Profile information with safe defaults
            "profile": {
                "avatar_url": user.get("profile", {}).get("avatar_url"),
                "phone": user.get("profile", {}).get("phone"),
                "bio": user.get("profile", {}).get("bio"),
                "date_of_birth": user.get("profile", {}).get("date_of_birth"),
                "country": user.get("profile", {}).get("country", "India"),
                "location": user.get("profile", {}).get("location")
            },
            
            # Preferences with safe defaults
            "preferences": {
                "currency": user.get("preferences", {}).get("currency", "INR"),
                "language": user.get("preferences", {}).get("language", "en"),
                "notifications": {
                    "email": user.get("preferences", {}).get("notifications", {}).get("email", True),
                    "push": user.get("preferences", {}).get("notifications", {}).get("push", True),
                    "budget_alerts": user.get("preferences", {}).get("notifications", {}).get("budget_alerts", True),
                    "weekly_reports": user.get("preferences", {}).get("notifications", {}).get("weekly_reports", False),
                    "newsletter": user.get("preferences", {}).get("notifications", {}).get("newsletter", False)
                }
            },
            
            # Financial profile with safe defaults
            "financial_profile": {
                "monthly_income_range": user.get("financial_profile", {}).get("monthly_income_range"),
                "financial_goal": user.get("financial_profile", {}).get("financial_goal"),
                "financial_status": user.get("financial_profile", {}).get("financial_status"),
                "risk_tolerance": user.get("financial_profile", {}).get("risk_tolerance", "moderate"),
                "investment_experience": user.get("financial_profile", {}).get("investment_experience", "beginner")
            },
            
            # Onboarding status with safe defaults
            "onboarding": {
                "completed": user.get("onboarding", {}).get("completed", True),
                "steps_completed": user.get("onboarding", {}).get("steps_completed", ["account", "profile"]),
                "completed_at": user.get("onboarding", {}).get("completed_at").isoformat() if user.get("onboarding", {}).get("completed_at") is not None else None
            },
            
            # Calculate stats
            "stats": calculate_profile_stats(user)
        }
        
        logger.info("✅ Profile data formatted successfully")
        return profile_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error getting profile: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get profile: {str(e)}"
        )

@router.put("/personal")
async def update_personal_info(profile_data: Dict[str, Any]):
    """Update personal information"""
    try:
        logger.info(f"🔄 Updating personal info: {profile_data}")
        
        # Get database - FIXED: Proper None check
        db = get_database()
        if db is None:  # FIXED: Use 'is None' instead of 'not db'
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database not available"
            )
        
        # Get the most recent user
        user = await db.users.find_one({}, sort=[("created_at", -1)])
        if user is None:  # FIXED: Use 'is None' instead of 'not user'
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No users found"
            )
        
        # Prepare update data
        update_fields = {"updated_at": datetime.utcnow()}
        
        # Update basic fields
        if profile_data.get("name"):
            update_fields["name"] = profile_data["name"]
        
        # Update profile nested fields
        if profile_data.get("phone"):
            update_fields["profile.phone"] = profile_data["phone"]
        if profile_data.get("bio"):
            update_fields["profile.bio"] = profile_data["bio"]
        if profile_data.get("country"):
            update_fields["profile.country"] = profile_data["country"]
        if profile_data.get("date_of_birth"):
            update_fields["profile.date_of_birth"] = profile_data["date_of_birth"]
        
        # Perform update
        result = await db.users.update_one(
            {"_id": user["_id"]},
            {"$set": update_fields}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        logger.info("✅ Personal info updated successfully")
        
        # Return updated profile
        return await get_my_profile()
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error updating personal info: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile: {str(e)}"
        )

@router.put("/preferences")
async def update_preferences(preferences_data: Dict[str, Any]):
    """Update user preferences"""
    try:
        logger.info(f"🔄 Updating preferences: {preferences_data}")
        
        # Get database - FIXED: Proper None check
        db = get_database()
        if db is None:  # FIXED: Use 'is None' instead of 'not db'
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database not available"
            )
        
        # Get the most recent user
        user = await db.users.find_one({}, sort=[("created_at", -1)])
        if user is None:  # FIXED: Use 'is None' instead of 'not user'
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No users found"
            )
        
        # Prepare update data
        update_fields = {"updated_at": datetime.utcnow()}
        
        # Handle preference updates
        if preferences_data.get("email_notifications") is not None:
            update_fields["preferences.notifications.email"] = preferences_data["email_notifications"]
        
        if preferences_data.get("budget_alerts") is not None:
            update_fields["preferences.notifications.budget_alerts"] = preferences_data["budget_alerts"]
        
        if preferences_data.get("weekly_reports") is not None:
            update_fields["preferences.notifications.weekly_reports"] = preferences_data["weekly_reports"]
        
        if preferences_data.get("newsletter") is not None:
            update_fields["preferences.notifications.newsletter"] = preferences_data["newsletter"]
        
        if preferences_data.get("currency"):
            update_fields["preferences.currency"] = preferences_data["currency"]
        
        if preferences_data.get("language"):
            update_fields["preferences.language"] = preferences_data["language"]
        
        # Perform update
        result = await db.users.update_one(
            {"_id": user["_id"]},
            {"$set": update_fields}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        logger.info("✅ Preferences updated successfully")
        
        # Return updated profile
        return await get_my_profile()
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error updating preferences: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update preferences: {str(e)}"
        )

def calculate_profile_stats(user: Dict[str, Any]) -> Dict[str, Any]:
    """Calculate profile completion and other stats"""
    try:
        profile = user.get("profile", {})
        financial_profile = user.get("financial_profile", {})
        
        # Count completed fields
        total_fields = 10
        completed_fields = 0
        
        # Basic fields
        if profile.get("phone"):
            completed_fields += 1
        if profile.get("date_of_birth"):
            completed_fields += 1
        if profile.get("country"):
            completed_fields += 1
        if profile.get("bio"):
            completed_fields += 1
            
        # Financial profile fields
        if financial_profile.get("monthly_income_range"):
            completed_fields += 1
        if financial_profile.get("financial_goal"):
            completed_fields += 1
        if financial_profile.get("financial_status"):
            completed_fields += 1
        if financial_profile.get("risk_tolerance"):
            completed_fields += 1
        if financial_profile.get("investment_experience"):
            completed_fields += 1
            
        # Account verification
        if user.get("is_verified"):
            completed_fields += 1
        
        profile_completion = int((completed_fields / total_fields) * 100)
        
        # Calculate account age - FIXED: Better date handling
        created_at = user.get("created_at", datetime.utcnow())
        try:
            if isinstance(created_at, str):
                created_at = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
            account_age_days = (datetime.utcnow() - created_at).days
        except Exception:
            account_age_days = 0
        
        # Calculate financial score
        financial_score = calculate_financial_score(user)
        
        return {
            "profile_completion": profile_completion,
            "account_age_days": max(0, account_age_days),
            "financial_score": financial_score,
            "is_verified": user.get("is_verified", False),
            "account_type": "premium" if user.get("is_premium", False) else "free",
            "total_logins": user.get("login_count", 1)
        }
        
    except Exception as e:
        logger.error(f"Error calculating profile stats: {e}")
        return {
            "profile_completion": 0,
            "account_age_days": 0,
            "financial_score": 50,
            "is_verified": False,
            "account_type": "free",
            "total_logins": 1
        }

def calculate_financial_score(user: Dict[str, Any]) -> int:
    """Calculate financial literacy score"""
    try:
        score = 30  # Base score
        
        profile = user.get("profile", {})
        financial_profile = user.get("financial_profile", {})
        onboarding = user.get("onboarding", {})
        
        # Add points for completed profile
        if profile.get("date_of_birth"):
            score += 10
        if profile.get("phone"):
            score += 5
        if profile.get("country"):
            score += 5
        if profile.get("bio"):
            score += 5
        
        # Add points for financial profile
        if financial_profile.get("monthly_income_range"):
            score += 15
        if financial_profile.get("financial_goal"):
            score += 10
        if financial_profile.get("financial_status"):
            score += 10
        if financial_profile.get("risk_tolerance"):
            score += 5
        if financial_profile.get("investment_experience"):
            score += 5
        
        # Add points for verification and onboarding
        if user.get("is_verified"):
            score += 10
        if onboarding.get("completed"):
            score += 5
        
        return min(score, 100)  # Cap at 100
    except Exception as e:
        logger.error(f"Error calculating financial score: {e}")
        return 50  # Default score
