import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from joblib import dump, load
import json
import os
from pathlib import Path
import logging
from typing import Dict, List, Optional, Tuple, Any
from datetime import datetime

from app.core.config import settings

logger = logging.getLogger(__name__)

class BudgetCategorizer:
    def __init__(self):
        self.rules = {
            "Needs": [
                "rent", "electricity", "water", "groceries", "emi", "bill",
                "loan", "mortgage", "insurance", "medical", "doctor", "hospital",
                "pharmacy", "supermarket", "utility", "gas", "fuel", "transport",
                "bus", "train", "metro", "tuition", "education", "school", "college",
                "maintenance", "repair", "essential", "basic", "necessary"
            ],
            "Wants": [
                "swiggy", "zomato", "netflix", "amazon", "shopping", "myntra",
                "flipkart", "movie", "cinema", "restaurant", "cafe", "bar",
                "pub", "fashion", "electronics", "entertainment", "game", "gaming",
                "vacation", "travel", "hotel", "spa", "salon", "luxury", "hobby",
                "subscription", "streaming", "dining", "takeout", "delivery"
            ],
            "Savings": [
                "fd", "sip", "investment", "mutual fund", "stock", "equity",
                "bond", "fixed deposit", "recurring deposit", "ppf", "nps",
                "retirement", "pension", "gold", "crypto", "bitcoin", "save",
                "invest", "portfolio", "asset", "wealth", "fund", "scheme"
            ]
        }
        
        self.model = None
        self.is_trained = False
        self.model_path = Path(settings.ML_MODEL_PATH) / settings.MODEL_FILE_NAME
        self.dataset_path = Path(settings.ML_MODEL_PATH) / settings.DATASET_FILE_NAME
        
        # Initialize model on startup
        self._initialize_model()
    
    def _initialize_model(self):
        """Initialize model - load if exists, train if not"""
        try:
            if self.model_path.exists():
                self.model = load(self.model_path)
                self.is_trained = True
                logger.info(f"✅ Model loaded successfully from {self.model_path}")
            else:
                logger.info("🔄 Model not found. Training new model...")
                self.train_ml_model()
        except Exception as e:
            logger.error(f"❌ Model initialization failed: {str(e)}")
            self.model = None
            self.is_trained = False
    
    def create_sample_dataset(self, num_samples: int = 200) -> pd.DataFrame:
        """Create realistic sample transaction data for training"""
        samples = []
        
        # Enhanced Needs transactions
        needs_data = [
            ("Monthly Rent Payment", 15000, "Needs"),
            ("Electricity Bill BESCOM", 2500, "Needs"),
            ("Water Bill Corporation", 800, "Needs"),
            ("Groceries BigBasket", 3500, "Needs"),
            ("Home Loan EMI HDFC", 12000, "Needs"),
            ("Medical Insurance Premium", 4500, "Needs"),
            ("LPG Gas Cylinder", 1100, "Needs"),
            ("BMTC Bus Pass", 800, "Needs"),
            ("College Fee Payment", 25000, "Needs"),
            ("Medicine Apollo Pharmacy", 1200, "Needs"),
            ("Airtel Broadband Bill", 899, "Needs"),
            ("Jio Mobile Recharge", 299, "Needs"),
            ("Car Insurance Renewal", 5000, "Needs"),
            ("DMart Essential Shopping", 2800, "Needs"),
            ("Namma Metro Card", 500, "Needs"),
            ("School Fees", 8000, "Needs"),
            ("Loan Payment Bank", 7000, "Needs"),
            ("Utility Bill Payment", 1500, "Needs"),
            ("Medical Consultation", 800, "Needs"),
            ("Grocery Store", 2200, "Needs")
        ]
        
        # Enhanced Wants transactions  
        wants_data = [
            ("Swiggy Food Delivery", 450, "Wants"),
            ("Zomato Dinner Order", 350, "Wants"),
            ("Netflix Monthly Plan", 649, "Wants"),
            ("Amazon Prime Shopping", 2500, "Wants"),
            ("Myntra Fashion Sale", 1800, "Wants"),
            ("PVR Cinema Tickets", 600, "Wants"),
            ("Starbucks Coffee Date", 400, "Wants"),
            ("Dominos Pizza Weekend", 550, "Wants"),
            ("BookMyShow Event", 1200, "Wants"),
            ("Flipkart Electronics", 15000, "Wants"),
            ("Uber Cab Ride", 250, "Wants"),
            ("OYO Hotel Booking", 5000, "Wants"),
            ("Salon Treatment", 2000, "Wants"),
            ("Steam Game Purchase", 999, "Wants"),
            ("Restaurant Fine Dining", 1800, "Wants"),
            ("Spotify Premium", 119, "Wants"),
            ("Gaming Console", 35000, "Wants"),
            ("Designer Clothes", 3500, "Wants"),
            ("Luxury Watch", 25000, "Wants"),
            ("Weekend Getaway", 8000, "Wants")
        ]
        
        # Enhanced Savings transactions
        savings_data = [
            ("HDFC Fixed Deposit", 10000, "Savings"),
            ("SIP Mutual Fund ICICI", 5000, "Savings"),
            ("Zerodha Stock Purchase", 8000, "Savings"),
            ("Recurring Deposit SBI", 3000, "Savings"),
            ("PPF Annual Contribution", 50000, "Savings"),
            ("NPS Tier 1 Investment", 7000, "Savings"),
            ("Digital Gold Paytm", 15000, "Savings"),
            ("Bitcoin Crypto Investment", 6000, "Savings"),
            ("Retirement Fund ICICI", 10000, "Savings"),
            ("Child Education Plan", 8000, "Savings"),
            ("ELSS Tax Saving Fund", 15000, "Savings"),
            ("Corporate Bond", 20000, "Savings"),
            ("Equity Mutual Fund", 12000, "Savings"),
            ("Index Fund Investment", 7500, "Savings"),
            ("Emergency Fund Transfer", 5000, "Savings"),
            ("Gold ETF Purchase", 10000, "Savings"),
            ("Real Estate Investment", 100000, "Savings"),
            ("Insurance Investment Plan", 15000, "Savings"),
            ("Pension Fund", 8000, "Savings"),
            ("Wealth Management", 25000, "Savings")
        ]
        
        # Combine all samples
        samples.extend(needs_data)
        samples.extend(wants_data)
        samples.extend(savings_data)
        
        # Add variations and edge cases
        variations = [
            ("RENT APRIL 2024", 12000, "Needs"),
            ("ELECTRICITY MARCH", 1800, "Needs"),
            ("FOOD PANDA DELIVERY", 550, "Wants"),
            ("ONLINE SHOPPING SALE", 3200, "Wants"),
            ("MONTHLY SIP HDFC", 4000, "Savings"),
            ("FD MATURITY REINVEST", 20000, "Savings"),
            ("EMERGENCY MEDICAL", 3000, "Needs"),
            ("CAB OFFICE TRAVEL", 350, "Wants"),
            ("MUTUAL FUND SIP", 6000, "Savings"),
            ("DEPARTMENTAL STORE", 4200, "Needs"),
            ("PETROL PUMP", 2500, "Needs"),
            ("RESTAURANT BILL", 800, "Wants"),
            ("INVESTMENT PORTFOLIO", 15000, "Savings"),
            ("MAINTENANCE CHARGES", 2000, "Needs"),
            ("ENTERTAINMENT EXPENSE", 1200, "Wants")
        ]
        
        samples.extend(variations)
        
        # Create DataFrame
        df = pd.DataFrame(samples, columns=['description', 'amount', 'category'])
        
        # Add random variations to reach num_samples
        categories = ['Needs', 'Wants', 'Savings']
        while len(df) < num_samples:
            category = np.random.choice(categories)
            if category == 'Needs':
                desc = f"Essential Expense {len(df)}"
                amount = np.random.randint(500, 20000)
            elif category == 'Wants':
                desc = f"Discretionary Purchase {len(df)}"
                amount = np.random.randint(200, 5000)
            else:
                desc = f"Investment Transfer {len(df)}"
                amount = np.random.randint(1000, 25000)
            
            df.loc[len(df)] = [desc, amount, category]
        
        return df.sample(frac=1).reset_index(drop=True)  # Shuffle data
    
    def rule_based_categorize(self, description: str) -> Tuple[Optional[str], float]:
        """Rule-based categorization using keyword matching"""
        desc_lower = description.lower()
        
        # Score each category
        category_scores = {}
        for category, keywords in self.rules.items():
            score = sum(1 for keyword in keywords if keyword in desc_lower)
            if score > 0:
                category_scores[category] = score
        
        if not category_scores:
            return None, 0.0
        
        # Return category with highest score
        best_category = max(category_scores, key=category_scores.get)
        confidence = min(category_scores[best_category] / 5.0, 1.0)  # Normalize confidence
        
        return best_category, confidence
    
    def train_ml_model(self, df: Optional[pd.DataFrame] = None) -> Pipeline:
        """Train the ML model on transaction data"""
        try:
            if df is None:
                logger.info("Creating sample dataset for training...")
                df = self.create_sample_dataset(200)
            
            # Save dataset for reference
            df.to_csv(self.dataset_path, index=False)
            logger.info(f"Dataset saved to {self.dataset_path}")
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                df['description'], df['category'], 
                test_size=0.2, random_state=42, stratify=df['category']
            )
            
            # Create and train pipeline
            self.model = Pipeline([
                ('tfidf', TfidfVectorizer(
                    lowercase=True,
                    stop_words='english',
                    ngram_range=(1, 3),  # Include trigrams
                    max_features=2000,
                    min_df=1,
                    max_df=0.9
                )),
                ('classifier', LogisticRegression(
                    random_state=42,
                    max_iter=1000,
                    C=1.0,
                    class_weight='balanced'  # Handle class imbalance
                ))
            ])
            
            # Train model
            logger.info("Training ML model...")
            self.model.fit(X_train, y_train)
            
            # Evaluate
            train_score = self.model.score(X_train, y_train)
            test_score = self.model.score(X_test, y_test)
            
            logger.info(f"✅ Model trained successfully!")
            logger.info(f"📊 Training accuracy: {train_score:.3f}")
            logger.info(f"📊 Testing accuracy: {test_score:.3f}")
            
            self.is_trained = True
            
            # Save model
            dump(self.model, self.model_path)
            logger.info(f"💾 Model saved to {self.model_path}")
            
            return self.model
            
        except Exception as e:
            logger.error(f"❌ Model training failed: {str(e)}")
            raise e
    
    def hybrid_categorize(self, description: str, amount: Optional[float] = None) -> Dict[str, Any]:
        """
        Hybrid categorization: rules first, then ML fallback
        
        Args:
            description (str): Transaction description
            amount (float, optional): Transaction amount
            
        Returns:
            dict: Categorization result with confidence and method
        """
        if not description or not description.strip():
            return {
                "description": description,
                "category": "Other",
                "confidence": 0.0,
                "method": "error",
                "amount": amount,
                "error": "Empty description provided"
            }
        
        # Try rule-based first
        rule_category, rule_confidence = self.rule_based_categorize(description)
        
        if rule_category and rule_confidence > 0.5:
            return {
                "description": description,
                "category": rule_category,
                "confidence": float(rule_confidence),
                "method": "rule",
                "amount": amount,
                "timestamp": datetime.now().isoformat()
            }
        
        # ML fallback
        if not self.is_trained or self.model is None:
            return {
                "description": description,
                "category": "Other",
                "confidence": 0.0,
                "method": "none",
                "amount": amount,
                "error": "ML model not available",
                "timestamp": datetime.now().isoformat()
            }
        
        try:
            ml_prediction = self.model.predict([description])[0]
            ml_probabilities = self.model.predict_proba([description])[0]
            ml_confidence = float(max(ml_probabilities))
            
            # Combine rule and ML if both available
            if rule_category and rule_confidence > 0.3:
                # Weighted combination
                if rule_category == ml_prediction:
                    combined_confidence = min((rule_confidence + ml_confidence) / 2, 1.0)
                    method = "hybrid"
                else:
                    # Choose the one with higher confidence
                    if rule_confidence > ml_confidence:
                        final_category = rule_category
                        combined_confidence = rule_confidence
                        method = "rule_priority"
                    else:
                        final_category = ml_prediction
                        combined_confidence = ml_confidence
                        method = "ml_priority"
                    
                    return {
                        "description": description,
                        "category": final_category,
                        "confidence": float(combined_confidence),
                        "method": method,
                        "amount": amount,
                        "alternatives": {
                            "rule": {"category": rule_category, "confidence": rule_confidence},
                            "ml": {"category": ml_prediction, "confidence": ml_confidence}
                        },
                        "timestamp": datetime.now().isoformat()
                    }
            
            return {
                "description": description,
                "category": ml_prediction if not rule_category else rule_category,
                "confidence": float(ml_confidence if not rule_category else max(rule_confidence, ml_confidence)),
                "method": "ml" if not rule_category else "hybrid",
                "amount": amount,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"❌ ML categorization error: {str(e)}")
            return {
                "description": description,
                "category": rule_category if rule_category else "Other",
                "confidence": float(rule_confidence if rule_category else 0.0),
                "method": "rule_fallback" if rule_category else "error",
                "amount": amount,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    def batch_categorize(self, transactions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Categorize multiple transactions at once
        
        Args:
            transactions: List of dicts with 'description' and optional 'amount'
            
        Returns:
            list: Categorized transactions
        """
        results = []
        
        for i, transaction in enumerate(transactions):
            try:
                desc = transaction.get('description', '')
                amount = transaction.get('amount')
                result = self.hybrid_categorize(desc, amount)
                result['transaction_id'] = i
                results.append(result)
            except Exception as e:
                logger.error(f"❌ Error processing transaction {i}: {str(e)}")
                results.append({
                    "transaction_id": i,
                    "description": transaction.get('description', ''),
                    "category": "Other",
                    "confidence": 0.0,
                    "method": "error",
                    "amount": transaction.get('amount'),
                    "error": str(e),
                    "timestamp": datetime.now().isoformat()
                })
        
        return results
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the current model"""
        return {
            "is_trained": self.is_trained,
            "model_path": str(self.model_path),
            "model_exists": self.model_path.exists(),
            "dataset_path": str(self.dataset_path),
            "dataset_exists": self.dataset_path.exists(),
            "categories": list(self.rules.keys()),
            "rules_count": {category: len(keywords) for category, keywords in self.rules.items()},
            "last_modified": self.model_path.stat().st_mtime if self.model_path.exists() else None
        }

# Global instance
budget_categorizer = BudgetCategorizer()
