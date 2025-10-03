# app/services/chatbot_service.py
import time
import logging
from typing import Dict, List, Any
from datetime import datetime

from app.models.ml_models.financial_chatbot import financial_chatbot
from app.schemas.chatbot import (
    ChatRequest,
    ChatResponse,
    ChatHealthResponse,
    SupportedTopicsResponse,
    FinancialAnalysis
)

logger = logging.getLogger(__name__)

class ChatbotService:
    def __init__(self):
        self.chatbot = financial_chatbot
        self.request_count = 0
        self.start_time = time.time()
    
    async def get_financial_advice(self, request: ChatRequest) -> ChatResponse:
        """Get AI-powered financial advice"""
        start_time = time.time()
        
        try:
            # Increment request counter
            self.request_count += 1
            
            # Validate request
            self._validate_request(request)
            
            # Get chatbot response
            result = self.chatbot.answer_query(
                query=request.query,
                user_profile=request.user_profile,
                transactions=request.transactions
            )
            
            # Convert to response format
            financial_analysis = FinancialAnalysis(**result["financial_analysis"])
            
            response = ChatResponse(
                answer=result["answer"],
                method=result["method"],
                query_category=result["query_category"],
                financial_analysis=financial_analysis,
                timestamp=result["timestamp"]
            )
            
            processing_time = (time.time() - start_time) * 1000
            logger.info(f"Chat request processed in {processing_time:.2f}ms")
            
            return response
            
        except Exception as e:
            logger.error(f"❌ Error processing chat request: {str(e)}")
            raise e
    
    async def health_check(self) -> ChatHealthResponse:
        """Health check for chatbot service"""
        try:
            # Test Groq API availability
            groq_status = "available"
            try:
                test_messages = [
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": "Hello"}
                ]
                self.chatbot.groq_client.chat_completion(test_messages, max_tokens=10)
            except Exception:
                groq_status = "unavailable"
            
            return ChatHealthResponse(
                status="healthy",
                service="Financial Chatbot",
                groq_api_status=groq_status,
                timestamp=datetime.now().isoformat()
            )
            
        except Exception as e:
            logger.error(f"❌ Health check failed: {str(e)}")
            return ChatHealthResponse(
                status="unhealthy",
                service="Financial Chatbot",
                groq_api_status="error",
                timestamp=datetime.now().isoformat()
            )
    
    async def get_supported_topics(self) -> SupportedTopicsResponse:
        """Get supported financial topics"""
        return SupportedTopicsResponse()
    
    def _validate_request(self, request: ChatRequest):
        """Validate chat request"""
        if not request.query.strip():
            raise ValueError("Query cannot be empty")
        
        if not request.user_profile:
            raise ValueError("User profile is required")
        
        if not isinstance(request.transactions, list):
            raise ValueError("Transactions must be a list")
        
        # Validate essential profile fields
        required_fields = ['monthly_income', 'age']
        for field in required_fields:
            if field not in request.user_profile:
                raise ValueError(f"User profile missing required field: {field}")

# Global service instance
chatbot_service = ChatbotService()
