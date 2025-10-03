# app/models/ml_models/financial_chatbot.py
import os
import json
import requests
from typing import List, Dict, Any, Optional
from datetime import datetime
import logging
from pathlib import Path

from app.core.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# -------------------------
# Configuration
# -------------------------
class ChatbotConfig:
    GROQ_API_KEY = settings.GROQ_API_KEY
    GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
    GROQ_MODEL = "llama-3.1-8b-instant"
    ENABLED = settings.ENABLE_CHATBOT_MODEL

# -------------------------
# Direct Groq API Client
# -------------------------
class GroqClient:
    def __init__(self, config: ChatbotConfig):
        self.config = config
        
        if not config.GROQ_API_KEY:
            logger.warning("⚠️  GROQ_API_KEY not provided. Chatbot will use fallback responses.")
            self.enabled = False
            return
        
        self.enabled = True
        self.headers = {
            "Authorization": f"Bearer {config.GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
    
    def chat_completion(self, messages: List[Dict[str, str]], 
                       temperature: float = 0.3, 
                       max_tokens: int = 1024) -> str:
        """Direct Groq API call"""
        if not self.enabled:
            raise Exception("Groq client not enabled - API key missing")
            
        payload = {
            "messages": messages,
            "model": self.config.GROQ_MODEL,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "top_p": 0.9,
            "stream": False
        }
        
        try:
            response = requests.post(
                self.config.GROQ_API_URL,
                headers=self.headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code != 200:
                logger.error(f"Groq API error: {response.status_code} - {response.text}")
                raise Exception(f"Groq API returned {response.status_code}")
            
            result = response.json()
            return result["choices"][0]["message"]["content"]
            
        except Exception as e:
            logger.error(f"Groq API call failed: {e}")
            raise

# -------------------------
# Financial Knowledge & Prompt Templates
# -------------------------
class FinancialPromptTemplates:
    """Professional prompt templates for different financial topics"""
    
    @staticmethod
    def get_system_prompt() -> str:
        return """You are FinAssist AI, a certified financial advisor specializing in Indian personal finance.

CREDENTIALS: Certified Financial Planner (CFP) with 10+ years experience

CORE PRINCIPLES:
1. Provide accurate, personalized advice based on user's financial data
2. Give specific, actionable recommendations with numbers
3. Explain concepts simply without jargon
4. Consider Indian financial context, taxes, and regulations
5. Always account for user's risk profile and goals

RESPONSE STRUCTURE:
- Start with direct answer to the query
- Provide 2-3 personalized recommendations
- Include specific actionable steps
- Mention risks/considerations
- End with encouraging next steps

TONE: Professional, approachable, empowering, culturally appropriate"""

    @staticmethod
    def get_savings_prompt(query: str, user_data: Dict, financial_summary: Dict) -> str:
        return f"""
USER QUERY: {query}

USER PROFILE:
- Age: {user_data.get('age', 'N/A')}
- Monthly Income: ₹{user_data.get('monthly_income', 0):,}
- Risk Profile: {user_data.get('risk_profile', 'Moderate')}
- Financial Goal: {user_data.get('goal', 'Wealth Building')}

FINANCIAL SNAPSHOT:
- Current Savings Rate: {financial_summary.get('savings_rate', 0)}%
- Monthly Expenses: ₹{financial_summary.get('total_expenses', 0):,}
- Top Spending Category: {financial_summary.get('top_category', 'N/A')}
- Financial Health Score: {financial_summary.get('financial_health_score', 0)}/100

Please provide specific savings advice including:
1. Ideal savings rate for their age and income
2. Practical ways to increase savings by 5-10%
3. Emergency fund recommendations
4. Automatic savings strategies
5. Next 3 actionable steps

Be specific with rupee amounts and percentages.
"""

    @staticmethod
    def get_investment_prompt(query: str, user_data: Dict, financial_summary: Dict, investment_advice: Dict = None) -> str:
        investment_context = ""
        if investment_advice:
            portfolio = investment_advice.get('recommendation_summary', {}).get('portfolio_overview', {})
            allocation = investment_advice.get('allocation_breakdown', {})
            
            investment_context = f"""
AI INVESTMENT RECOMMENDATION:
- Expected Return: {portfolio.get('expected_annual_return', 'N/A')}
- Risk Level: {portfolio.get('risk_level', 'N/A')}
- Equity Allocation: {allocation.get('by_asset_class', {}).get('equity', 0)}%
- Fixed Income: {allocation.get('by_asset_class', {}).get('fixed_income', 0)}%
- Confidence: {investment_advice.get('model_metadata', {}).get('confidence_score', 0)*100:.1f}%
"""

        return f"""
USER QUERY: {query}

USER PROFILE:
- Age: {user_data.get('age', 'N/A')}
- Monthly Income: ₹{user_data.get('monthly_income', 0):,}
- Risk Profile: {user_data.get('risk_profile', 'Moderate')}
- Investment Experience: {user_data.get('investment_experience', 'Beginner')}
- Time Horizon: {user_data.get('time_horizon', 'Long-term')}

FINANCIAL SNAPSHOT:
- Savings Rate: {financial_summary.get('savings_rate', 0)}%
- Available for Investment: ₹{financial_summary.get('savings_amount', 0):,}/month
- Financial Health: {financial_summary.get('financial_health_score', 0)}/100
{investment_context}

Please provide comprehensive investment advice including:
1. Suitable asset allocation based on risk profile
2. Specific investment products (mutual funds, stocks, etc.)
3. SIP recommendations with amounts
4. Tax-efficient investing strategies
5. Risk management approach
6. Next 3 actionable steps

Be specific with percentages and rupee amounts.
"""

    @staticmethod
    def get_budgeting_prompt(query: str, user_data: Dict, financial_summary: Dict) -> str:
        categories = financial_summary.get('category_breakdown', {})
        category_details = "\n".join([f"- {cat}: ₹{amt:,}" for cat, amt in categories.items()])
        
        return f"""
USER QUERY: {query}

USER PROFILE:
- Age: {user_data.get('age', 'N/A')}
- Monthly Income: ₹{user_data.get('monthly_income', 0):,}
- Financial Goal: {user_data.get('goal', 'Wealth Building')}

CURRENT SPENDING:
{category_details}

FINANCIAL OVERVIEW:
- Total Monthly Income: ₹{user_data.get('monthly_income', 0):,}
- Total Expenses: ₹{financial_summary.get('total_expenses', 0):,}
- Savings Rate: {financial_summary.get('savings_rate', 0)}%
- Top Spending Area: {financial_summary.get('top_category', 'N/A')}

Please provide practical budgeting advice including:
1. Analysis of current spending patterns
2. Recommended budget allocation (50-30-20 rule or customized)
3. Specific areas for potential savings
4. Tools/methods for tracking expenses
5. Monthly action plan
6. Next 3 actionable steps

Provide specific rupee amounts and percentages.
"""

    @staticmethod
    def get_debt_prompt(query: str, user_data: Dict, financial_summary: Dict) -> str:
        return f"""
USER QUERY: {query}

USER PROFILE:
- Age: {user_data.get('age', 'N/A')}
- Monthly Income: ₹{user_data.get('monthly_income', 0):,}
- Current Savings Rate: {financial_summary.get('savings_rate', 0)}%

FINANCIAL SNAPSHOT:
- Monthly Income: ₹{user_data.get('monthly_income', 0):,}
- Monthly Expenses: ₹{financial_summary.get('total_expenses', 0):,}
- Available for Debt Repayment: ₹{financial_summary.get('savings_amount', 0):,}

Please provide strategic debt management advice including:
1. Debt repayment prioritization strategy
2. Recommended monthly repayment amounts
3. Balance between debt repayment and savings
4. Negotiation strategies with lenders
5. Debt consolidation options if applicable
6. Next 3 actionable steps

Be specific with repayment timelines and amounts.
"""

    @staticmethod
    def get_retirement_prompt(query: str, user_data: Dict, financial_summary: Dict) -> str:
        age = user_data.get('age', 30)
        retirement_age = 60
        years_to_retire = retirement_age - age
        
        return f"""
USER QUERY: {query}

USER PROFILE:
- Current Age: {age}
- Retirement Age: {retirement_age}
- Years to Retirement: {years_to_retire}
- Monthly Income: ₹{user_data.get('monthly_income', 0):,}
- Risk Profile: {user_data.get('risk_profile', 'Moderate')}

FINANCIAL SNAPSHOT:
- Current Savings Rate: {financial_summary.get('savings_rate', 0)}%
- Monthly Investment Capacity: ₹{financial_summary.get('savings_amount', 0):,}

Please provide comprehensive retirement planning advice including:
1. Target retirement corpus calculation
2. Monthly savings/investment requirements
3. Suitable retirement investment products (NPS, PPF, EPF, etc.)
4. Asset allocation strategy over time
5. Tax planning for retirement
6. Next 3 actionable steps

Provide specific corpus targets and monthly contribution amounts.
"""

    @staticmethod
    def get_tax_prompt(query: str, user_data: Dict, financial_summary: Dict) -> str:
        return f"""
USER QUERY: {query}

USER PROFILE:
- Age: {user_data.get('age', 'N/A')}
- Monthly Income: ₹{user_data.get('monthly_income', 0):,}
- Employment Type: {user_data.get('employment_type', 'Salaried')}
- Current Investments: ₹{financial_summary.get('savings_amount', 0)*12:,}/year

FINANCIAL CONTEXT:
- Annual Income: ₹{user_data.get('monthly_income', 0)*12:,}
- Current Savings Rate: {financial_summary.get('savings_rate', 0)}%

Please provide strategic tax planning advice including:
1. Section 80C optimization strategies
2. Additional deductions (80D, NPS, HRA, etc.)
3. Tax-efficient investment products
4. Capital gains tax planning
5. Documentation and filing tips
6. Next 3 actionable steps before March 31st

Focus on Indian tax laws and provide specific deduction amounts.
"""

    @staticmethod
    def get_general_prompt(query: str, user_data: Dict, financial_summary: Dict) -> str:
        return f"""
USER QUERY: {query}

USER PROFILE:
- Age: {user_data.get('age', 'N/A')}
- Monthly Income: ₹{user_data.get('monthly_income', 0):,}
- Risk Profile: {user_data.get('risk_profile', 'Moderate')}
- Financial Goal: {user_data.get('goal', 'Wealth Building')}

FINANCIAL SNAPSHOT:
- Savings Rate: {financial_summary.get('savings_rate', 0)}%
- Monthly Expenses: ₹{financial_summary.get('total_expenses', 0):,}
- Financial Health Score: {financial_summary.get('financial_health_score', 0)}/100

Please provide comprehensive, personalized financial advice that:
1. Directly answers the user's query
2. Considers their specific financial situation
3. Provides 2-3 actionable recommendations
4. Includes specific next steps
5. Is encouraging and empowering

Be specific with numbers and timelines where applicable.
"""

# -------------------------
# Financial Chatbot
# -------------------------
class FinancialChatbot:
    def __init__(self):
        self.config = ChatbotConfig()
        self.groq_client = GroqClient(self.config)
        self.prompt_templates = FinancialPromptTemplates()
        
        # Integration with existing models
        try:
            from app.models.ml_models.budget_categorizer import budget_categorizer
            from app.models.ml_models.investment_recommender import investment_recommender
            self.budget_categorizer = budget_categorizer
            self.investment_recommender = investment_recommender
            logger.info("✅ Successfully imported existing ML models")
        except ImportError as e:
            logger.warning(f"⚠️  Could not import existing ML models: {e}")
            self.budget_categorizer = None
            self.investment_recommender = None
        
        if self.groq_client.enabled:
            logger.info("✅ Financial Chatbot initialized with Groq API")
        else:
            logger.info("⚠️  Financial Chatbot initialized in fallback mode (no Groq API)")
    
    def analyze_finances(self, transactions: List[Dict], profile: Dict) -> Dict[str, Any]:
        """Analyze user's financial situation"""
        income = profile.get("monthly_income", 0)
        
        # Calculate expenses, excluding income transactions
        expenses = 0
        for txn in transactions:
            if txn.get("category", "").lower() not in ['income', 'salary', 'investment_return']:
                expenses += txn.get("amount", 0)
        
        savings = max(0, income - expenses)
        savings_rate = (savings / income * 100) if income > 0 else 0
        
        # Category analysis
        categories = {}
        for txn in transactions:
            cat = txn.get("category", "Other")
            if cat.lower() not in ['income', 'salary']:  # Exclude income categories
                categories[cat] = categories.get(cat, 0) + txn.get("amount", 0)
        
        top_category = max(categories.items(), key=lambda x: x[1])[0] if categories else "None"
        
        # Calculate health score based on multiple factors
        health_score = 0
        
        # Savings rate component (40% weight)
        if savings_rate >= 20:
            health_score += 40
        elif savings_rate >= 15:
            health_score += 32
        elif savings_rate >= 10:
            health_score += 24
        elif savings_rate >= 5:
            health_score += 16
        else:
            health_score += 8
        
        # Expense diversification (30% weight)
        if len(categories) >= 5:
            health_score += 30
        elif len(categories) >= 3:
            health_score += 24
        elif len(categories) >= 2:
            health_score += 18
        else:
            health_score += 12
        
        # Income stability (30% weight)
        if income >= 50000:
            health_score += 30
        elif income >= 30000:
            health_score += 24
        elif income >= 20000:
            health_score += 18
        else:
            health_score += 12
        
        health_score = min(100, max(10, health_score))
        
        return {
            "total_income": income,
            "total_expenses": expenses,
            "savings_amount": savings,
            "savings_rate": round(savings_rate, 2),
            "category_breakdown": categories,
            "top_category": top_category,
            "financial_health_score": health_score
        }
    
    def get_investment_advice(self, profile: Dict) -> Optional[Dict]:
        """Get AI investment recommendation"""
        if (self.investment_recommender and 
            hasattr(self.investment_recommender, 'is_trained') and 
            self.investment_recommender.is_trained):
            try:
                return self.investment_recommender.predict_allocation(profile)
            except Exception as e:
                logger.error(f"Investment advice error: {e}")
        return None
    
    def _categorize_query(self, query: str) -> str:
        """Categorize query to select appropriate prompt template"""
        query_lower = query.lower()
        
        # Define keywords for each category
        savings_keywords = ['save', 'saving', 'savings', 'emergency fund', 'bank account', 'fd', 'fixed deposit']
        investment_keywords = ['invest', 'portfolio', 'sip', 'mutual fund', 'stock', 'equity', 'market', 'shares', 'bonds']
        budgeting_keywords = ['budget', 'spending', 'expense', '50-30-20', 'track money', 'manage money']
        debt_keywords = ['debt', 'loan', 'emi', 'repay', 'credit card', 'borrow', 'interest', 'payoff']
        retirement_keywords = ['retirement', 'pension', 'corpus', 'old age', 'nps', 'ppf', 'retire']
        tax_keywords = ['tax', '80c', 'deduction', 'itr', 'income tax', 'tax saving', 'elss']
        
        # Check each category
        if any(word in query_lower for word in savings_keywords):
            return 'savings'
        elif any(word in query_lower for word in investment_keywords):
            return 'investment'
        elif any(word in query_lower for word in budgeting_keywords):
            return 'budgeting'
        elif any(word in query_lower for word in debt_keywords):
            return 'debt'
        elif any(word in query_lower for word in retirement_keywords):
            return 'retirement'
        elif any(word in query_lower for word in tax_keywords):
            return 'tax'
        else:
            return 'general'
    
    def answer_query(self, query: str, user_profile: Dict, transactions: List[Dict]) -> Dict[str, Any]:
        """Main method to answer financial queries"""
        try:
            # Analyze finances
            financial_analysis = self.analyze_finances(transactions, user_profile)
            
            # Categorize query
            query_category = self._categorize_query(query)
            
            # Get investment advice if relevant
            investment_advice = None
            if query_category == 'investment':
                investment_advice = self.get_investment_advice(user_profile)
            
            # Select and format prompt based on category
            if query_category == 'savings':
                user_prompt = self.prompt_templates.get_savings_prompt(query, user_profile, financial_analysis)
            elif query_category == 'investment':
                user_prompt = self.prompt_templates.get_investment_prompt(query, user_profile, financial_analysis, investment_advice)
            elif query_category == 'budgeting':
                user_prompt = self.prompt_templates.get_budgeting_prompt(query, user_profile, financial_analysis)
            elif query_category == 'debt':
                user_prompt = self.prompt_templates.get_debt_prompt(query, user_profile, financial_analysis)
            elif query_category == 'retirement':
                user_prompt = self.prompt_templates.get_retirement_prompt(query, user_profile, financial_analysis)
            elif query_category == 'tax':
                user_prompt = self.prompt_templates.get_tax_prompt(query, user_profile, financial_analysis)
            else:
                user_prompt = self.prompt_templates.get_general_prompt(query, user_profile, financial_analysis)
            
            # Generate response
            try:
                if self.groq_client.enabled:
                    messages = [
                        {"role": "system", "content": self.prompt_templates.get_system_prompt()},
                        {"role": "user", "content": user_prompt}
                    ]
                    
                    answer = self.groq_client.chat_completion(messages, temperature=0.2, max_tokens=1200)
                    method = "groq_ai"
                else:
                    raise Exception("Groq API not available")
                
            except Exception as e:
                logger.error(f"Groq API failed, using fallback: {e}")
                answer = self._get_fallback_response(query, financial_analysis, query_category)
                method = "fallback"
            
            return {
                "answer": answer,
                "method": method,
                "query_category": query_category,
                "financial_analysis": financial_analysis,
                "investment_advice": investment_advice,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"❌ Error in answer_query: {e}")
            # Return error response
            return {
                "answer": "I'm sorry, I encountered an error while processing your request. Please try asking your question in a different way, or contact support if the problem persists.",
                "method": "error_fallback",
                "query_category": "error",
                "financial_analysis": {
                    "total_income": user_profile.get("monthly_income", 0),
                    "total_expenses": 0,
                    "savings_amount": 0,
                    "savings_rate": 0,
                    "category_breakdown": {},
                    "top_category": "Unknown",
                    "financial_health_score": 50
                },
                "investment_advice": None,
                "timestamp": datetime.now().isoformat()
            }
    
    def _get_fallback_response(self, query: str, financial_analysis: Dict, category: str) -> str:
        """Enhanced fallback responses with more context"""
        savings_rate = financial_analysis.get('savings_rate', 0)
        income = financial_analysis.get('total_income', 0)
        health_score = financial_analysis.get('financial_health_score', 0)
        
        responses = {
            'savings': f"""Based on your current savings rate of {savings_rate}%, here are my recommendations:

**Immediate Actions:**
1. **Target 20% Savings Rate**: With your monthly income of ₹{income:,}, aim to save ₹{int(income * 0.2):,} per month
2. **Emergency Fund**: Build 6 months of expenses (approximately ₹{int(financial_analysis.get('total_expenses', 0) * 6):,})
3. **Automate Savings**: Set up automatic transfer of ₹{int(income * 0.15):,} to a separate savings account

**Savings Strategies:**
- Open a high-yield savings account for emergency funds
- Consider PPF for long-term tax-free savings (₹1.5L annually)
- Use SIPs for systematic wealth building

**Next Steps:**
- Review and cut unnecessary expenses by 10%
- Increase savings by 2% each year
- Track progress monthly""",

            'investment': f"""For your investment journey with ₹{int(financial_analysis.get('savings_amount', 0)):,} monthly capacity:

**Beginner-Friendly Portfolio:**
1. **Large Cap Mutual Funds (40%)**: ₹{int(financial_analysis.get('savings_amount', 0) * 0.4):,}/month
2. **Mid Cap Funds (20%)**: ₹{int(financial_analysis.get('savings_amount', 0) * 0.2):,}/month
3. **Debt Funds (30%)**: ₹{int(financial_analysis.get('savings_amount', 0) * 0.3):,}/month
4. **ELSS for Tax Saving (10%)**: ₹{int(financial_analysis.get('savings_amount', 0) * 0.1):,}/month

**Platform Recommendations:**
- Use Groww, Zerodha Coin, or Paytm Money for low-cost investing
- Start with SIPs (Systematic Investment Plans)
- Review portfolio quarterly

**Expected Returns:** 10-12% annually for balanced portfolio""",

            'budgeting': f"""Your Financial Health Score: {health_score}/100

**50-30-20 Budget Allocation:**
- **Needs (50%)**: ₹{int(income * 0.5):,} - Rent, groceries, utilities, EMIs
- **Wants (30%)**: ₹{int(income * 0.3):,} - Entertainment, dining out, hobbies
- **Savings (20%)**: ₹{int(income * 0.2):,} - Investments, emergency fund

**Current Analysis:**
- Your top spending category: {financial_analysis.get('top_category', 'Unknown')}
- Monthly expenses: ₹{financial_analysis.get('total_expenses', 0):,}
- Improvement potential: Focus on reducing discretionary spending

**Action Plan:**
1. Track expenses using apps like Money Lover or ET Money
2. Set spending limits for each category
3. Review weekly and adjust as needed""",

            'debt': f"""Debt Management Strategy for your ₹{income:,} income:

**Debt Repayment Priority:**
1. **Credit Cards** (18-36% interest) - Pay immediately
2. **Personal Loans** (10-18% interest) - Aggressive repayment
3. **Home/Car Loans** (8-12% interest) - Regular EMIs

**Recommended Approach:**
- Allocate ₹{int(financial_analysis.get('savings_amount', 0) * 0.7):,}/month to debt repayment
- Keep ₹{int(financial_analysis.get('savings_amount', 0) * 0.3):,}/month for emergency fund
- Target debt-to-income ratio below 40%

**Strategies:**
- Consider debt consolidation if multiple loans
- Negotiate with lenders for better rates
- Avoid taking new debt while repaying existing ones""",

            'retirement': f"""Retirement Planning Roadmap:

**Target Corpus Calculation:**
- Monthly expenses at retirement: ₹{int(financial_analysis.get('total_expenses', 0) * 2):,} (inflation-adjusted)
- Required corpus: ₹{int(financial_analysis.get('total_expenses', 0) * 2 * 12 * 25):,} (25x annual expenses)

**Investment Strategy:**
- **NPS (National Pension System)**: ₹{int(income * 0.05):,}/month
- **PPF (Public Provident Fund)**: ₹12,500/month (₹1.5L annually)
- **Equity Mutual Funds**: ₹{int(income * 0.08):,}/month

**Benefits:**
- NPS: Additional ₹50,000 tax deduction under 80CCD(1B)
- PPF: Tax-free returns after 15 years
- Equity: Long-term wealth creation potential

**Action Items:**
1. Open NPS account online
2. Start PPF if not already done
3. Review and increase contributions annually""",

            'tax': f"""Tax Optimization Strategy for ₹{income * 12:,} annual income:

**Section 80C (₹1.5L limit):**
- EPF contribution: ₹{int(income * 0.12 * 12):,}
- PPF: ₹{150000 - int(income * 0.12 * 12):,} remaining
- ELSS Mutual Funds: Alternative to PPF

**Additional Deductions:**
- **80D**: Health insurance premiums (₹25,000 limit)
- **80CCD(1B)**: NPS contributions (₹50,000 limit)
- **HRA**: If paying rent (actual rent paid - 10% of salary)

**Tax-Efficient Investments:**
- ELSS funds: 3-year lock-in, equity growth potential
- NPS: Lowest cost, additional deduction
- Health insurance: Essential protection + tax benefit

**Estimated Tax Savings:** ₹46,800 - ₹62,400 annually

**Action Plan:**
1. Maximize 80C investments by January
2. Buy/renew health insurance before March 31st
3. Consider NPS for additional savings""",

            'general': f"""Hello! I'm your AI Financial Advisor with CFP-level expertise.

**Your Financial Snapshot:**
- Monthly Income: ₹{income:,}
- Savings Rate: {savings_rate}%
- Financial Health Score: {health_score}/100

**I can help you with:**
💰 **Savings**: Emergency funds, high-yield accounts, savings strategies
📈 **Investments**: Mutual funds, stocks, SIPs, portfolio planning
📊 **Budgeting**: 50-30-20 rule, expense tracking, money management
💳 **Debt Management**: Repayment strategies, consolidation, EMI planning
🏖️ **Retirement Planning**: Corpus calculation, NPS, PPF, long-term goals
📋 **Tax Planning**: 80C deductions, tax-efficient investments, ITR filing

**Popular Questions:**
- "How much should I save each month?"
- "What's the best investment for beginners?"
- "How can I reduce my expenses?"
- "Should I pay off debt or invest first?"

Feel free to ask me anything about your financial goals! I'll provide personalized advice based on your income, age, and risk profile."""
        }
        
        return responses.get(category, responses['general'])

# -------------------------
# Global Instance with Error Handling
# -------------------------
try:
    financial_chatbot = FinancialChatbot()
    logger.info("✅ Financial chatbot initialized successfully")
except Exception as e:
    logger.error(f"❌ Failed to initialize financial chatbot: {e}")
    financial_chatbot = None

# Export for use in other modules
__all__ = ['FinancialChatbot', 'financial_chatbot']
