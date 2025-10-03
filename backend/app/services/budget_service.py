import time
import logging
from typing import Dict, List, Any
from datetime import datetime

from app.models.ml_models.budget_categorizer import budget_categorizer
from app.schemas.budget import (
    ExpenseItem, 
    BatchExpenseRequest,
    CategorizationResult,
    SingleCategorizationResponse,
    BatchCategorizationResponse,
    CategorySummary,
    ModelInfoResponse,
    HealthCheckResponse
)

logger = logging.getLogger(__name__)

class BudgetService:
    def __init__(self):
        self.categorizer = budget_categorizer
        self.request_count = 0
        self.start_time = time.time()
    
    async def categorize_single_expense(self, expense: ExpenseItem) -> SingleCategorizationResponse:
        """Categorize a single expense item"""
        start_time = time.time()
        
        try:
            # Increment request counter
            self.request_count += 1
            
            # Perform categorization
            result = self.categorizer.hybrid_categorize(
                description=expense.description,
                amount=expense.amount
            )
            
            # Convert to Pydantic model
            categorization_result = CategorizationResult(**result)
            
            processing_time = (time.time() - start_time) * 1000  # Convert to milliseconds
            
            response = SingleCategorizationResponse(
                success=True,
                data=categorization_result,
                processing_time_ms=round(processing_time, 2)
            )
            
            # Add warning if there was an error in the result
            if result.get('error'):
                response.warning = result['error']
            
            logger.info(f"✅ Single expense categorized: {expense.description} -> {result['category']} (confidence: {result['confidence']:.2f})")
            
            return response
            
        except Exception as e:
            logger.error(f"❌ Error categorizing single expense: {str(e)}")
            processing_time = (time.time() - start_time) * 1000
            
            return SingleCategorizationResponse(
                success=False,
                data=CategorizationResult(
                    description=expense.description,
                    category="Other",
                    confidence=0.0,
                    method="error",
                    amount=expense.amount,
                    error=str(e),
                    timestamp=datetime.now().isoformat()
                ),
                processing_time_ms=round(processing_time, 2)
            )
    
    async def batch_categorize_expenses(self, batch_request: BatchExpenseRequest) -> BatchCategorizationResponse:
        """Categorize multiple expenses in batch"""
        start_time = time.time()
        
        try:
            # Increment request counter
            self.request_count += len(batch_request.expenses)
            
            # Convert to list of dicts
            expenses_list = [
                {
                    "description": expense.description,
                    "amount": expense.amount
                }
                for expense in batch_request.expenses
            ]
            
            # Perform batch categorization
            results = self.categorizer.batch_categorize(expenses_list)
            
            # Calculate summary statistics
            category_totals = {}
            total_amount = 0.0
            valid_results = []
            
            for result in results:
                # Convert to Pydantic model
                categorization_result = CategorizationResult(**result)
                valid_results.append(categorization_result)
                
                category = result["category"]
                amount = result.get("amount", 0) or 0
                
                if category not in category_totals:
                    category_totals[category] = 0.0
                
                category_totals[category] += amount
                total_amount += amount
            
            # Calculate distribution percentages
            category_distribution = {}
            if total_amount > 0:
                category_distribution = {
                    category: round((amount / total_amount) * 100, 2)
                    for category, amount in category_totals.items()
                }
            else:
                category_distribution = {category: 0.0 for category in category_totals.keys()}
            
            processing_time = (time.time() - start_time) * 1000
            
            response_data = {
                "processed_count": len(valid_results),
                "results": [result.dict() for result in valid_results],
                "summary": {
                    "category_totals": category_totals,
                    "total_amount": total_amount,
                    "category_distribution": category_distribution
                }
            }
            
            logger.info(f"✅ Batch categorization completed: {len(valid_results)} items processed")
            
            return BatchCategorizationResponse(
                success=True,
                data=response_data,
                processing_time_ms=round(processing_time, 2)
            )
            
        except Exception as e:
            logger.error(f"❌ Error in batch categorization: {str(e)}")
            processing_time = (time.time() - start_time) * 1000
            
            return BatchCategorizationResponse(
                success=False,
                data={
                    "processed_count": 0,
                    "results": [],
                    "summary": {
                        "category_totals": {},
                        "total_amount": 0.0,
                        "category_distribution": {}
                    },
                    "error": str(e)
                },
                processing_time_ms=round(processing_time, 2)
            )
    
    async def get_model_info(self) -> ModelInfoResponse:
        """Get information about the ML model"""
        try:
            info = self.categorizer.get_model_info()
            
            # Add service statistics
            info.update({
                "service_stats": {
                    "total_requests": self.request_count,
                    "uptime_seconds": time.time() - self.start_time,
                    "model_ready": self.categorizer.is_trained
                }
            })
            
            return ModelInfoResponse(
                success=True,
                data=info
            )
            
        except Exception as e:
            logger.error(f"❌ Error getting model info: {str(e)}")
            return ModelInfoResponse(
                success=False,
                data={"error": str(e)}
            )
    
    async def health_check(self) -> HealthCheckResponse:
        """Health check endpoint"""
        uptime = time.time() - self.start_time
        ml_status = "ready" if self.categorizer.is_trained else "not_ready"
        
        return HealthCheckResponse(
            status="healthy",
            timestamp=datetime.now().isoformat(),
            version="1.0.0",
            ml_model_status=ml_status,
            uptime_seconds=round(uptime, 2)
        )

# Global service instance
budget_service = BudgetService()
