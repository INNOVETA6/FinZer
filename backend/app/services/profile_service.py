# app/services/profile_service.py
from typing import Optional, Dict, Any
from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException, status
import logging

from app.core.database import get_database
from app.schemas.auth import UserRole

logger = logging.getLogger(__name__)

class ProfileService:
    def __init__(self):
        self.db = None
        
    async def get_database(self):
        """Get database instance"""
        if not self.db:
            self.db = get_database()
            if not self.db:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="Database connection not available"
                )
        return self.db
    
    async def get_user_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get complete user profile from database"""
        try:
            db = await self.get_database()
            user = await db.users.find_one({"_id": ObjectId(user_id)})
            
            if not user:
                return None
            
            # Format the profile data for frontend
            profile_data = {
                "id": str(user["_id"]),
                "name": user["name"],
                "email": user["email"],
                "role": user["role"],
                "is_verified": user["is_verified"],
                "created_at": user["created_at"].isoformat(),
                "updated_at": user["updated_at"].isoformat(),
                "last_login": user.get("last_login").isoformat() if user.get("last_login") else None,
                
                # Profile information
                "profile": user.get("profile", {}),
                "preferences": user.get("preferences", {
                    "currency": "INR",
                    "language": "en",
                    "notifications": {
                        "email": True,
                        "push": True,
                        "budget_alerts": True,
                        "weekly_reports": False,
                        "newsletter": False
                    }
                }),
                "financial_profile": user.get("financial_profile", {}),
                "onboarding": user.get("onboarding", {}),
                
                # Calculate profile statistics
                "stats": await self._calculate_profile_stats(user)
            }
            
            return profile_data
            
        except Exception as e:
            logger.error(f"Error getting user profile: {e}")
            return None
    
    async def update_personal_info(self, user_id: str, update_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update personal information"""
        try:
            db = await self.get_database()
            
            # Prepare update data
            update_fields = {"updated_at": datetime.utcnow()}
            
            # Update basic fields
            if update_data.get("name"):
                update_fields["name"] = update_data["name"]
            
            # Update profile nested fields
            profile_updates = {}
            if update_data.get("phone"):
                profile_updates["phone"] = update_data["phone"]
            if update_data.get("bio"):
                profile_updates["bio"] = update_data["bio"]
            if update_data.get("country"):
                profile_updates["country"] = update_data["country"]
            if update_data.get("date_of_birth"):
                profile_updates["date_of_birth"] = update_data["date_of_birth"]
            
            # Add profile updates to main update
            for key, value in profile_updates.items():
                update_fields[f"profile.{key}"] = value
            
            # Perform update
            result = await db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_fields}
            )
            
            if result.matched_count == 0:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )
            
            # Return updated user data
            return await self.get_user_profile(user_id)
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error updating personal info: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update personal information"
            )
    
    async def update_preferences(self, user_id: str, preferences_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update user preferences"""
        try:
            db = await self.get_database()
            
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
                {"_id": ObjectId(user_id)},
                {"$set": update_fields}
            )
            
            if result.matched_count == 0:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )
            
            # Return updated user data
            return await self.get_user_profile(user_id)
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error updating preferences: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update preferences"
            )
    
    async def _calculate_profile_stats(self, user: Dict[str, Any]) -> Dict[str, Any]:
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
            
            # Calculate account age
            created_at = user.get("created_at", datetime.utcnow())
            account_age_days = (datetime.utcnow() - created_at).days
            
            # Calculate financial score
            financial_score = self._calculate_financial_score(user)
            
            return {
                "profile_completion": profile_completion,
                "account_age_days": account_age_days,
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
    
    def _calculate_financial_score(self, user: Dict[str, Any]) -> int:
        """Calculate financial literacy score"""
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

# Global service instance
profile_service = ProfileService()
