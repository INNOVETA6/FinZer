# app/services/investment_service.py
import time
import logging
from typing import Dict, List, Any
from datetime import datetime

# Fix the import to use the global instance
from app.models.ml_models.investment_recommender import investment_recommender
from app.schemas.investment import (
    UserProfile,
    BatchInvestmentRequest,
    InvestmentRecommendationResponse,
    BatchInvestmentResponse,
    ModelTrainingResponse,
    HealthCheckResponse
)

logger = logging.getLogger(__name__)

class InvestmentService:
    def __init__(self):
        self.recommender = investment_recommender  # Use the global instance
        self.request_count = 0
        self.start_time = time.time()
    
    async def get_investment_recommendation(self, profile: UserProfile) -> InvestmentRecommendationResponse:
        """Get investment recommendation for a single user profile"""
        start_time = time.time()
        
        try:
            # Increment request counter
            self.request_count += 1
            
            # Validate inputs
            self._validate_profile(profile)
            
            # Get recommendation
            user_data = profile.dict()
            result = self.recommender.predict_allocation(user_data)
            
            processing_time = (time.time() - start_time) * 1000
            
            return InvestmentRecommendationResponse(
                success=True,
                data=result,
                metadata={
                    "model_version": result.get("model_metadata", {}).get("model_version", "1.0.0"),
                    "recommendation_timestamp": datetime.now().isoformat()
                },
                processing_time_ms=round(processing_time, 2)
            )
            
        except Exception as e:
            logger.error(f"❌ Error generating investment recommendation: {str(e)}")
            processing_time = (time.time() - start_time) * 1000
            
            return InvestmentRecommendationResponse(
                success=False,
                data={
                    "error": str(e),
                    "fallback_recommendation": "Please consult a financial advisor"
                },
                processing_time_ms=round(processing_time, 2)
            )
    
    async def batch_investment_recommendations(self, batch_request: BatchInvestmentRequest) -> BatchInvestmentResponse:
        """Get investment recommendations for multiple user profiles"""
        start_time = time.time()
        
        try:
            # Increment request counter
            self.request_count += len(batch_request.profiles)
            
            profiles_list = [p.dict() for p in batch_request.profiles]
            results = []
            failed_count = 0
            
            for profile in profiles_list:
                try:
                    # Validate individual profile
                    if profile['income'] <= 0 or profile['age'] < 18 or profile['age'] > 100:
                        failed_count += 1
                        continue
                    
                    result = self.recommender.predict_allocation(profile)
                    results.append(result)
                    
                except Exception as e:
                    logger.warning(f"Skipping invalid profile: {e}")
                    failed_count += 1
                    continue
            
            processing_time = (time.time() - start_time) * 1000
            
            return BatchInvestmentResponse(
                success=True,
                data={
                    "processed_count": len(batch_request.profiles),
                    "successful_count": len(results),
                    "failed_count": failed_count,
                    "results": results
                },
                processing_time_ms=round(processing_time, 2)
            )
            
        except Exception as e:
            logger.error(f"❌ Error in batch investment recommendations: {str(e)}")
            processing_time = (time.time() - start_time) * 1000
            
            return BatchInvestmentResponse(
                success=False,
                data={
                    "processed_count": 0,
                    "successful_count": 0,
                    "failed_count": len(batch_request.profiles),
                    "results": [],
                    "error": str(e)
                },
                processing_time_ms=round(processing_time, 2)
            )
    
    async def train_model(self) -> ModelTrainingResponse:
        """Trigger model training"""
        try:
            # Trigger model training
            success = self.recommender.train_advanced_model()
            
            if success:
                return ModelTrainingResponse(
                    success=True,
                    message="Investment model training completed successfully",
                    status="training_completed",
                    timestamp=datetime.now().isoformat()
                )
            else:
                return ModelTrainingResponse(
                    success=False,
                    message="Model training failed",
                    status="training_failed",
                    timestamp=datetime.now().isoformat()
                )
                
        except Exception as e:
            logger.error(f"❌ Model training error: {str(e)}")
            return ModelTrainingResponse(
                success=False,
                message=f"Training failed: {str(e)}",
                status="training_failed",
                timestamp=datetime.now().isoformat()
            )
    
    async def health_check(self) -> HealthCheckResponse:
        """Health check endpoint"""
        uptime = time.time() - self.start_time
        model_status = "ready" if self.recommender.is_trained else "not_ready"
        
        return HealthCheckResponse(
            status="healthy",
            timestamp=datetime.now().isoformat(),
            version="1.0.0",
            model_status=model_status,
            uptime_seconds=round(uptime, 2)
        )
    
    def _validate_profile(self, profile: UserProfile):
        """Validate user profile"""
        if profile.income <= 0:
            raise ValueError("Income must be positive")
        
        if profile.age < 18 or profile.age > 100:
            raise ValueError("Age must be between 18 and 100")
        
        if profile.risk_profile not in ["Conservative", "Moderate", "Aggressive"]:
            raise ValueError("Invalid risk profile")
        
        valid_goals = [
            "Emergency Fund", "Retirement", "Wealth Building", 
            "Education Fund", "House Down Payment", "Vacation Fund"
        ]
        if profile.goal_type not in valid_goals:
            raise ValueError("Invalid goal type")

# Global service instance
investment_service = InvestmentService()
