# app/models/ml_models/investment_recommender.py
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler, OneHotEncoder
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from joblib import dump, load
import json
import os
import warnings
from datetime import datetime, timedelta
import logging
from typing import Dict, List, Optional, Tuple, Any
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
warnings.filterwarnings('ignore')

class AdvancedInvestmentRecommender:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.preprocessor = None
        self.encoders = {}
        self.is_trained = False
        self.feature_names = []
        self.model_metadata = {}
        
        # Create models directory if it doesn't exist
        self.model_dir = Path("./app/models/ml_models/")
        self.model_dir.mkdir(parents=True, exist_ok=True)
        
        self.model_path = self.model_dir / "investment_model_advanced.pkl"
        self.metadata_path = self.model_dir / "investment_metadata.json"
        
        # Investment categories with sub-types
        self.investment_categories = {
            'fixed_income': {
                'fixed_deposits': 'Bank FDs',
                'debt_funds': 'Debt Mutual Funds',
                'corporate_bonds': 'Corporate Bonds',
                'government_bonds': 'Government Securities'
            },
            'equity': {
                'large_cap': 'Large Cap Stocks',
                'mid_cap': 'Mid Cap Stocks', 
                'small_cap': 'Small Cap Stocks',
                'sectoral_funds': 'Sectoral Mutual Funds'
            },
            'hybrid': {
                'balanced_funds': 'Balanced Advantage Funds',
                'arbitrage_funds': 'Arbitrage Funds',
                'multi_asset': 'Multi Asset Funds'
            },
            'alternatives': {
                'gold': 'Gold ETFs/Physical',
                'real_estate': 'Real Estate Funds',
                'international': 'International Funds'
            }
        }
        
        # Risk profiling matrix
        self.risk_matrix = {
            'Conservative': {'equity_max': 0.3, 'fixed_income_min': 0.5, 'volatility_tolerance': 0.1},
            'Moderate': {'equity_max': 0.6, 'fixed_income_min': 0.3, 'volatility_tolerance': 0.25},
            'Aggressive': {'equity_max': 0.8, 'fixed_income_min': 0.1, 'volatility_tolerance': 0.4}
        }
        
        # Goal-based allocation strategies
        self.goal_strategies = {
            'Emergency Fund': {'liquidity_importance': 0.9, 'time_horizon': 0.1, 'risk_tolerance': 0.1},
            'Retirement': {'liquidity_importance': 0.3, 'time_horizon': 0.9, 'risk_tolerance': 0.6},
            'Wealth Building': {'liquidity_importance': 0.4, 'time_horizon': 0.7, 'risk_tolerance': 0.8},
            'Education Fund': {'liquidity_importance': 0.6, 'time_horizon': 0.5, 'risk_tolerance': 0.4},
            'House Down Payment': {'liquidity_importance': 0.7, 'time_horizon': 0.3, 'risk_tolerance': 0.2},
            'Vacation Fund': {'liquidity_importance': 0.8, 'time_horizon': 0.2, 'risk_tolerance': 0.1}
        }

        # Initialize model on startup
        self._initialize_model()

    def _initialize_model(self):
        """Initialize model - load if exists, train if not"""
        try:
            if self.model_path.exists():
                self.load_model()
                logger.info(f"✅ Investment model loaded successfully from {self.model_path}")
            else:
                logger.info("🔄 Investment model not found. Training new model...")
                self.train_advanced_model()
        except Exception as e:
            logger.error(f"❌ Investment model initialization failed: {str(e)}")
            self.model = None
            self.is_trained = False

    def create_advanced_dataset(self, num_samples: int = 5000) -> pd.DataFrame:
        """Create comprehensive synthetic dataset for training"""
        np.random.seed(42)
        
        data = []
        
        # Define realistic parameter ranges
        age_ranges = {
            'young': (22, 35),
            'middle': (35, 50),
            'mature': (50, 65)
        }
        
        income_ranges = {
            'low': (25000, 50000),
            'medium': (50000, 100000),
            'high': (100000, 300000),
            'very_high': (300000, 1000000)
        }
        
        for i in range(num_samples):
            # Basic demographics
            age_group = np.random.choice(['young', 'middle', 'mature'], p=[0.4, 0.4, 0.2])
            age = np.random.uniform(*age_ranges[age_group])
            
            income_level = np.random.choice(['low', 'medium', 'high', 'very_high'], p=[0.3, 0.4, 0.25, 0.05])
            income = np.random.uniform(*income_ranges[income_level])
            
            # Employment type influences income stability
            employment_type = np.random.choice([
                'Salaried', 'Self-Employed', 'Business', 'Professional', 'Student'
            ], p=[0.6, 0.2, 0.1, 0.08, 0.02])
            
            # Risk profile correlates with age and income
            if age < 30:
                risk_profile = np.random.choice(['Conservative', 'Moderate', 'Aggressive'], p=[0.2, 0.5, 0.3])
            elif age < 50:
                risk_profile = np.random.choice(['Conservative', 'Moderate', 'Aggressive'], p=[0.3, 0.6, 0.1])
            else:
                risk_profile = np.random.choice(['Conservative', 'Moderate', 'Aggressive'], p=[0.7, 0.25, 0.05])
            
            # Goal type influences allocation strategy
            goal_weights = [0.15, 0.3, 0.25, 0.15, 0.1, 0.05]  # Emergency, Retirement, Wealth, Education, House, Vacation
            goal_type = np.random.choice([
                'Emergency Fund', 'Retirement', 'Wealth Building', 
                'Education Fund', 'House Down Payment', 'Vacation Fund'
            ], p=goal_weights)
            
            # Financial situation
            existing_savings = np.random.uniform(0, income * 2)
            debt_amount = np.random.uniform(0, income * 0.5) if np.random.random() > 0.3 else 0
            
            # Monthly expenses (60-80% of income typically)
            expense_ratio = np.random.uniform(0.5, 0.8)
            monthly_expenses = income * expense_ratio
            
            # Investment amount (10-30% of income)
            investment_ratio = np.random.uniform(0.1, 0.3)
            investment_amount = income * investment_ratio
            
            # Calculate derived features
            debt_to_income = debt_amount / income if income > 0 else 0
            savings_to_income = existing_savings / income if income > 0 else 0
            investment_to_income = investment_amount / income if income > 0 else 0
            age_factor = (65 - age) / 65  # Time to retirement factor
            
            # Generate realistic allocation based on profile
            allocation = self._generate_realistic_allocation(
                age, income, risk_profile, goal_type, employment_type,
                debt_to_income, savings_to_income, investment_to_income, age_factor
            )
            
            # Create record
            record = {
                'income': income,
                'age': age,
                'employment_type': employment_type,
                'risk_profile': risk_profile,
                'goal_type': goal_type,
                'existing_savings': existing_savings,
                'debt_amount': debt_amount,
                'monthly_expenses': monthly_expenses,
                'investment_amount': investment_amount,
                'debt_to_income_ratio': debt_to_income,
                'savings_to_income_ratio': savings_to_income,
                'investment_to_income_ratio': investment_to_income,
                'age_factor': age_factor,
                **allocation
            }
            
            data.append(record)
        
        return pd.DataFrame(data)

    def _generate_realistic_allocation(self, age, income, risk_profile, goal_type, 
                                     employment_type, debt_to_income, savings_to_income, 
                                     investment_to_income, age_factor):
        """Generate realistic allocation percentages based on input parameters"""
        
        # Base allocation templates
        base_allocations = {
            'Conservative': {
                'fixed_deposits': 0.4, 'debt_funds': 0.25, 'government_bonds': 0.15,
                'large_cap_stocks': 0.1, 'gold': 0.05, 'balanced_funds': 0.05
            },
            'Moderate': {
                'fixed_deposits': 0.2, 'debt_funds': 0.15, 'large_cap_stocks': 0.25,
                'mid_cap_stocks': 0.15, 'balanced_funds': 0.15, 'gold': 0.05, 'government_bonds': 0.05
            },
            'Aggressive': {
                'large_cap_stocks': 0.3, 'mid_cap_stocks': 0.25, 'small_cap_stocks': 0.15,
                'sectoral_funds': 0.1, 'international': 0.1, 'debt_funds': 0.05, 'gold': 0.05
            }
        }
        
        # Start with base allocation
        allocation = base_allocations[risk_profile].copy()
        
        # Adjust based on goal type
        goal_adjustments = {
            'Emergency Fund': {'fixed_deposits': 0.2, 'debt_funds': 0.1, 'large_cap_stocks': -0.15},
            'Retirement': {'large_cap_stocks': 0.1, 'mid_cap_stocks': 0.05, 'fixed_deposits': -0.1},
            'Wealth Building': {'mid_cap_stocks': 0.1, 'sectoral_funds': 0.05, 'debt_funds': -0.1},
            'Education Fund': {'balanced_funds': 0.1, 'government_bonds': 0.05, 'small_cap_stocks': -0.1},
            'House Down Payment': {'fixed_deposits': 0.15, 'debt_funds': 0.1, 'mid_cap_stocks': -0.15},
            'Vacation Fund': {'fixed_deposits': 0.2, 'government_bonds': 0.1, 'large_cap_stocks': -0.2}
        }
        
        if goal_type in goal_adjustments:
            for asset, adjustment in goal_adjustments[goal_type].items():
                if asset in allocation:
                    allocation[asset] = max(0, allocation[asset] + adjustment)
        
        # Age-based adjustments
        if age < 30:
            allocation['mid_cap_stocks'] = allocation.get('mid_cap_stocks', 0) + 0.05
            allocation['fixed_deposits'] = max(0, allocation.get('fixed_deposits', 0) - 0.05)
        elif age > 50:
            allocation['fixed_deposits'] = allocation.get('fixed_deposits', 0) + 0.1
            allocation['government_bonds'] = allocation.get('government_bonds', 0) + 0.05
            allocation['small_cap_stocks'] = max(0, allocation.get('small_cap_stocks', 0) - 0.1)
        
        # High debt adjustment - more conservative
        if debt_to_income > 0.3:
            allocation['fixed_deposits'] = allocation.get('fixed_deposits', 0) + 0.1
            allocation['debt_funds'] = allocation.get('debt_funds', 0) + 0.05
            allocation['small_cap_stocks'] = max(0, allocation.get('small_cap_stocks', 0) - 0.1)
        
        # Normalize to ensure sum = 1
        total = sum(allocation.values())
        if total > 0:
            allocation = {k: v/total for k, v in allocation.items()}
        
        # Add missing assets with 0
        all_assets = [
            'fixed_deposits', 'debt_funds', 'government_bonds', 'corporate_bonds',
            'large_cap_stocks', 'mid_cap_stocks', 'small_cap_stocks', 'sectoral_funds',
            'balanced_funds', 'arbitrage_funds', 'multi_asset', 'gold', 'real_estate', 'international'
        ]
        
        for asset in all_assets:
            if asset not in allocation:
                allocation[asset] = 0.0
        
        return allocation

    def train_advanced_model(self):
        """Train the investment recommendation model"""
        try:
            logger.info("🔄 Creating advanced training dataset...")
            df = self.create_advanced_dataset(5000)
            
            # Define features and targets
            feature_columns = [
                'income', 'age', 'existing_savings', 'debt_amount', 'monthly_expenses',
                'investment_amount', 'debt_to_income_ratio', 'savings_to_income_ratio',
                'investment_to_income_ratio', 'age_factor'
            ]
            
            categorical_features = ['employment_type', 'risk_profile', 'goal_type']
            
            # Target columns (allocation percentages)
            target_columns = [
                'fixed_deposits', 'debt_funds', 'government_bonds', 'corporate_bonds',
                'large_cap_stocks', 'mid_cap_stocks', 'small_cap_stocks', 'sectoral_funds',
                'balanced_funds', 'arbitrage_funds', 'multi_asset', 'gold', 'real_estate', 'international'
            ]
            
            # Prepare features
            X = df[feature_columns + categorical_features].copy()
            y = df[target_columns].copy()
            
            # Create preprocessor
            numeric_transformer = Pipeline(steps=[
                ('imputer', SimpleImputer(strategy='median')),
                ('scaler', StandardScaler())
            ])
            
            categorical_transformer = Pipeline(steps=[
                ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
                ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
            ])
            
            self.preprocessor = ColumnTransformer(
                transformers=[
                    ('num', numeric_transformer, feature_columns),
                    ('cat', categorical_transformer, categorical_features)
                ]
            )
            
            # Create and train model
            self.model = Pipeline([
                ('preprocessor', self.preprocessor),
                ('regressor', RandomForestRegressor(
                    n_estimators=100,
                    max_depth=15,
                    min_samples_split=5,
                    min_samples_leaf=2,
                    random_state=42,
                    n_jobs=-1
                ))
            ])
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Train model
            logger.info("🔄 Training Random Forest model...")
            self.model.fit(X_train, y_train)
            
            # Evaluate model
            train_score = self.model.score(X_train, y_train)
            test_score = self.model.score(X_test, y_test)
            
            logger.info(f"✅ Model training completed!")
            logger.info(f"📊 Training R² Score: {train_score:.3f}")
            logger.info(f"📊 Testing R² Score: {test_score:.3f}")
            
            # Save model and metadata
            self.save_model()
            
            self.is_trained = True
            self.feature_names = X.columns.tolist()
            
            # Store metadata
            self.model_metadata = {
                'model_version': '1.0.0',
                'training_date': datetime.now().isoformat(),
                'train_score': train_score,
                'test_score': test_score,
                'feature_count': len(self.feature_names),
                'target_count': len(target_columns),
                'training_samples': len(X_train)
            }
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Model training failed: {str(e)}")
            return False

    def save_model(self):
        """Save the trained model"""
        try:
            if self.model is not None:
                dump(self.model, self.model_path)
                logger.info(f"💾 Model saved to {self.model_path}")
                
                # Save metadata
                with open(self.metadata_path, 'w') as f:
                    json.dump(self.model_metadata, f, indent=2)
                    
        except Exception as e:
            logger.error(f"❌ Failed to save model: {str(e)}")

    def load_model(self):
        """Load the trained model"""
        try:
            if self.model_path.exists():
                self.model = load(self.model_path)
                self.is_trained = True
                
                # Load metadata if exists
                if self.metadata_path.exists():
                    with open(self.metadata_path, 'r') as f:
                        self.model_metadata = json.load(f)
                
                return True
        except Exception as e:
            logger.error(f"❌ Failed to load model: {str(e)}")
            return False

    def _prepare_user_data(self, user_data: Dict) -> Dict:
        """Prepare user data for prediction"""
        processed_data = user_data.copy()
        
        # Calculate derived features
        income = user_data.get('income', 0)
        debt_amount = user_data.get('debt_amount', 0)
        existing_savings = user_data.get('existing_savings', 0)
        investment_amount = user_data.get('investment_amount', 0)
        age = user_data.get('age', 25)
        
        processed_data['debt_to_income_ratio'] = debt_amount / income if income > 0 else 0
        processed_data['savings_to_income_ratio'] = existing_savings / income if income > 0 else 0
        processed_data['investment_to_income_ratio'] = investment_amount / income if income > 0 else 0
        processed_data['age_factor'] = (65 - age) / 65
        
        # Set defaults for missing values
        defaults = {
            'monthly_expenses': income * 0.7 if income > 0 else 0,
            'investment_amount': income * 0.2 if income > 0 else 0,
            'existing_savings': 0,
            'debt_amount': 0,
            'employment_type': 'Salaried'
        }
        
        for key, default_value in defaults.items():
            if key not in processed_data or processed_data[key] is None:
                processed_data[key] = default_value
        
        return processed_data

    def predict_allocation(self, user_data: Dict) -> Dict:
        """Generate comprehensive investment recommendation"""
        if not self.is_trained:
            if not self.load_model():
                return self._get_fallback_recommendation(user_data)
        
        try:
            # Prepare user data with calculated features
            processed_data = self._prepare_user_data(user_data)
            
            # Create input DataFrame
            feature_columns = [
                'income', 'age', 'existing_savings', 'debt_amount', 'monthly_expenses',
                'investment_amount', 'debt_to_income_ratio', 'savings_to_income_ratio',
                'investment_to_income_ratio', 'age_factor', 'employment_type', 'risk_profile', 'goal_type'
            ]
            
            input_data = {col: processed_data.get(col, 0) for col in feature_columns}
            input_df = pd.DataFrame([input_data])
            
            # Predict allocation
            allocation_pred = self.model.predict(input_df)[0]
            
            # Target columns
            target_columns = [
                'fixed_deposits', 'debt_funds', 'government_bonds', 'corporate_bonds',
                'large_cap_stocks', 'mid_cap_stocks', 'small_cap_stocks', 'sectoral_funds',
                'balanced_funds', 'arbitrage_funds', 'multi_asset', 'gold', 'real_estate', 'international'
            ]
            
            # Create allocation dictionary
            allocation_dict = dict(zip(target_columns, allocation_pred))
            
            # Post-process allocation
            final_allocation = self._post_process_allocation(allocation_dict, user_data)
            
            # Generate comprehensive response
            recommendation = self._generate_comprehensive_recommendation(
                user_data, final_allocation, processed_data
            )
            
            return recommendation
            
        except Exception as e:
            logger.error(f"Investment prediction error: {e}")
            return self._get_fallback_recommendation(user_data)

    def _post_process_allocation(self, allocation: Dict, user_data: Dict) -> Dict:
        """Post-process allocation to ensure realistic constraints"""
        # Remove very small allocations
        allocation = {k: v for k, v in allocation.items() if v > 0.01}
        
        # Normalize to ensure sum = 1
        total = sum(allocation.values())
        if total > 0:
            allocation = {k: v/total for k, v in allocation.items()}
        
        # Apply risk profile constraints
        risk_profile = user_data.get('risk_profile', 'Moderate')
        if risk_profile == 'Conservative':
            # Limit equity exposure
            equity_assets = ['large_cap_stocks', 'mid_cap_stocks', 'small_cap_stocks', 'sectoral_funds']
            total_equity = sum(allocation.get(asset, 0) for asset in equity_assets)
            if total_equity > 0.3:
                # Reduce equity and increase fixed income
                reduction_factor = 0.3 / total_equity
                for asset in equity_assets:
                    if asset in allocation:
                        reduction = allocation[asset] * (1 - reduction_factor)
                        allocation[asset] *= reduction_factor
                        allocation['fixed_deposits'] = allocation.get('fixed_deposits', 0) + reduction * 0.6
                        allocation['debt_funds'] = allocation.get('debt_funds', 0) + reduction * 0.4
        
        return allocation

    def _generate_comprehensive_recommendation(self, user_data: Dict, allocation: Dict, processed_data: Dict) -> Dict:
        """Generate comprehensive investment recommendation response"""
        
        investment_amount = user_data.get('investment_amount', user_data.get('income', 0) * 0.2)
        
        # Calculate amounts
        amounts = {asset: allocation[asset] * investment_amount for asset in allocation}
        
        # Calculate asset class breakdown
        asset_class_mapping = {
            'fixed_income': ['fixed_deposits', 'debt_funds', 'government_bonds', 'corporate_bonds'],
            'equity': ['large_cap_stocks', 'mid_cap_stocks', 'small_cap_stocks', 'sectoral_funds'],
            'hybrid': ['balanced_funds', 'arbitrage_funds', 'multi_asset'],
            'alternatives': ['gold', 'real_estate', 'international']
        }
        
        by_asset_class = {}
        for asset_class, assets in asset_class_mapping.items():
            by_asset_class[asset_class] = sum(allocation.get(asset, 0) for asset in assets) * 100
        
        # Calculate expected return
        expected_returns = {
            'fixed_deposits': 6.5, 'debt_funds': 7.5, 'government_bonds': 7.0, 'corporate_bonds': 8.0,
            'large_cap_stocks': 12.0, 'mid_cap_stocks': 14.0, 'small_cap_stocks': 15.0, 'sectoral_funds': 13.0,
            'balanced_funds': 10.0, 'arbitrage_funds': 6.0, 'multi_asset': 9.0,
            'gold': 8.0, 'real_estate': 11.0, 'international': 10.0
        }
        
        weighted_return = sum(allocation.get(asset, 0) * expected_returns.get(asset, 8.0) 
                            for asset in allocation) / len(allocation) if allocation else 8.0
        
        # Risk assessment
        risk_scores = {
            'fixed_deposits': 1, 'debt_funds': 2, 'government_bonds': 1, 'corporate_bonds': 2,
            'large_cap_stocks': 6, 'mid_cap_stocks': 7, 'small_cap_stocks': 8, 'sectoral_funds': 7,
            'balanced_funds': 4, 'arbitrage_funds': 2, 'multi_asset': 5,
            'gold': 5, 'real_estate': 6, 'international': 7
        }
        
        portfolio_risk_score = sum(allocation.get(asset, 0) * risk_scores.get(asset, 5) 
                                 for asset in allocation)
        
        risk_level = 'Low' if portfolio_risk_score < 3 else 'Moderate' if portfolio_risk_score < 6 else 'High'
        
        # Calculate scores
        age = user_data.get('age', 25)
        income = user_data.get('income', 50000)
        debt_ratio = processed_data.get('debt_to_income_ratio', 0)
        
        stability_score = min(100, max(0, 100 - debt_ratio * 100 + (income / 100000) * 20))
        readiness_score = min(100, max(0, 70 + (processed_data.get('savings_to_income_ratio', 0) * 30)))
        risk_capacity_score = min(100, max(0, (65 - age) * 1.5 + (income / 100000) * 10))
        
        # Generate insights
        insights = self._generate_insights(user_data, allocation, processed_data)
        
        return {
            'recommendation_summary': {
                'user_profile': {
                    'age': user_data.get('age'),
                    'income': f"₹{user_data.get('income', 0):,.0f}",
                    'risk_profile': user_data.get('risk_profile'),
                    'financial_goal': user_data.get('goal_type'),
                    'employment_type': user_data.get('employment_type'),
                    'investment_amount': f"₹{investment_amount:,.0f}"
                },
                'portfolio_overview': {
                    'total_investment': investment_amount,
                    'expected_annual_return': f"{weighted_return:.1f}%",
                    'risk_level': risk_level,
                    'diversification_score': len([v for v in allocation.values() if v > 0.05]) * 20,
                    'suitability_score': min(100, stability_score * 0.4 + readiness_score * 0.3 + risk_capacity_score * 0.3)
                }
            },
            'allocation_breakdown': {
                'percentages': {k: v * 100 for k, v in allocation.items()},
                'amounts': amounts,
                'by_asset_class': by_asset_class
            },
            'detailed_analysis': {
                'financial_health_scores': {
                    'stability_score': stability_score,
                    'readiness_score': readiness_score,
                    'risk_capacity_score': risk_capacity_score
                },
                'risk_metrics': {
                    'portfolio_risk_score': portfolio_risk_score,
                    'portfolio_risk_level': risk_level,
                    'diversification_score': len([v for v in allocation.values() if v > 0.05]) * 20,
                    'suitability_score': min(100, stability_score * 0.4 + readiness_score * 0.3 + risk_capacity_score * 0.3),
                    'volatility_estimate': f"{portfolio_risk_score * 2:.0f}%"
                },
                'expected_returns': {
                    'expected_return': weighted_return,
                    'time_horizon_years': max(1, min(30, 65 - age)),
                    'risk_adjusted_return': weighted_return - (portfolio_risk_score * 0.5),
                    'projection_example': {
                        'monthly_investment': investment_amount,
                        'projected_value': investment_amount * (1 + weighted_return/100) ** 10,
                        'total_invested': investment_amount * 12 * 10
                    } if investment_amount > 0 else None
                }
            },
            'insights_and_recommendations': insights,
            'implementation_plan': {
                'immediate_actions': [
                    f"Open investment accounts with recommended fund houses",
                    f"Set up SIP for ₹{investment_amount:,.0f} monthly investment",
                    f"Complete KYC documentation for all investment platforms"
                ],
                'short_term_plan': [
                    f"Monitor portfolio performance monthly",
                    f"Review and rebalance allocation quarterly",
                    f"Increase SIP amount by 10% annually"
                ],
                'long_term_strategy': [
                    f"Gradually shift to more conservative allocation after age 50",
                    f"Consider tax-efficient investment options",
                    f"Review goals and risk appetite annually"
                ],
                'monitoring_recommendations': [
                    f"Track portfolio returns against benchmark indices",
                    f"Rebalance if any asset class deviates by >5%",
                    f"Annual review with financial advisor recommended"
                ]
            },
            'model_metadata': {
                'confidence_score': min(0.95, max(0.6, 0.8 + (readiness_score - 50) / 500)),
                'method': 'advanced_ml',
                'model_version': self.model_metadata.get('model_version', '1.0.0'),
                'training_date': self.model_metadata.get('training_date')
            }
        }

    def _generate_insights(self, user_data: Dict, allocation: Dict, processed_data: Dict) -> Dict:
        """Generate personalized insights and recommendations"""
        insights = {
            'portfolio_insights': [],
            'risk_management_insights': [],
            'goal_alignment_insights': [],
            'improvement_suggestions': []
        }
        
        # Portfolio insights
        if allocation.get('large_cap_stocks', 0) > 0.3:
            insights['portfolio_insights'].append("Heavy allocation to large-cap stocks provides stability with growth potential")
        
        if sum(allocation.get(asset, 0) for asset in ['fixed_deposits', 'debt_funds', 'government_bonds']) > 0.5:
            insights['portfolio_insights'].append("Conservative allocation ensures capital protection with steady returns")
            
        if len([v for v in allocation.values() if v > 0.05]) >= 5:
            insights['portfolio_insights'].append("Well-diversified portfolio reduces concentration risk")
        
        # Risk management insights
        risk_profile = user_data.get('risk_profile', 'Moderate')
        if risk_profile == 'Conservative':
            insights['risk_management_insights'].append("Low-risk profile maintained with emphasis on capital preservation")
        elif risk_profile == 'Aggressive':
            insights['risk_management_insights'].append("Higher risk tolerance allows for greater growth potential")
            
        debt_ratio = processed_data.get('debt_to_income_ratio', 0)
        if debt_ratio > 0.3:
            insights['risk_management_insights'].append("High debt ratio suggests prioritizing debt reduction alongside investments")
        
        # Goal alignment insights
        goal_type = user_data.get('goal_type', 'Wealth Building')
        if goal_type == 'Emergency Fund':
            insights['goal_alignment_insights'].append("Liquid investments prioritized for emergency fund accessibility")
        elif goal_type == 'Retirement':
            insights['goal_alignment_insights'].append("Long-term growth focus aligns with retirement planning horizon")
            
        # Improvement suggestions
        age = user_data.get('age', 25)
        if age < 30:
            insights['improvement_suggestions'].append("Consider increasing equity allocation for long-term wealth creation")
        elif age > 50:
            insights['improvement_suggestions'].append("Gradually shift towards more stable investments as retirement approaches")
            
        if processed_data.get('investment_to_income_ratio', 0) < 0.15:
            insights['improvement_suggestions'].append("Consider increasing monthly investment amount to accelerate wealth building")
        
        return insights

    def _get_fallback_recommendation(self, user_data: Dict) -> Dict:
        """Generate fallback recommendation when ML model is not available"""
        investment_amount = user_data.get('investment_amount', user_data.get('income', 50000) * 0.2)
        risk_profile = user_data.get('risk_profile', 'Moderate')
        
        # Simple rule-based allocation
        if risk_profile == 'Conservative':
            allocation = {
                'fixed_deposits': 0.4,
                'debt_funds': 0.3,
                'large_cap_stocks': 0.2,
                'gold': 0.1
            }
        elif risk_profile == 'Aggressive':
            allocation = {
                'large_cap_stocks': 0.4,
                'mid_cap_stocks': 0.3,
                'small_cap_stocks': 0.2,
                'debt_funds': 0.1
            }
        else:  # Moderate
            allocation = {
                'large_cap_stocks': 0.3,
                'debt_funds': 0.25,
                'fixed_deposits': 0.25,
                'mid_cap_stocks': 0.2
            }
        
        amounts = {asset: allocation[asset] * investment_amount for asset in allocation}
        
        return {
            'recommendation_summary': {
                'user_profile': {
                    'age': user_data.get('age'),
                    'income': f"₹{user_data.get('income', 0):,.0f}",
                    'risk_profile': risk_profile,
                    'financial_goal': user_data.get('goal_type'),
                    'employment_type': user_data.get('employment_type'),
                    'investment_amount': f"₹{investment_amount:,.0f}"
                },
                'portfolio_overview': {
                    'total_investment': investment_amount,
                    'expected_annual_return': "8.5%",
                    'risk_level': 'Moderate',
                    'diversification_score': 60,
                    'suitability_score': 75
                }
            },
            'allocation_breakdown': {
                'percentages': {k: v * 100 for k, v in allocation.items()},
                'amounts': amounts,
                'by_asset_class': {
                    'fixed_income': 50,
                    'equity': 40,
                    'alternatives': 10
                }
            },
            'detailed_analysis': {
                'financial_health_scores': {
                    'stability_score': 70,
                    'readiness_score': 75,
                    'risk_capacity_score': 80
                },
                'risk_metrics': {
                    'portfolio_risk_score': 5.0,
                    'portfolio_risk_level': 'Moderate',
                    'diversification_score': 60,
                    'suitability_score': 75,
                    'volatility_estimate': "10%"
                },
                'expected_returns': {
                    'expected_return': 8.5,
                    'time_horizon_years': 10,
                    'risk_adjusted_return': 7.5
                }
            },
            'insights_and_recommendations': {
                'portfolio_insights': ["Balanced allocation suitable for moderate risk profile"],
                'risk_management_insights': ["Diversification helps manage portfolio risk"],
                'goal_alignment_insights': ["Allocation matches stated investment goals"],
                'improvement_suggestions': ["Consider systematic investment approach"]
            },
            'implementation_plan': {
                'immediate_actions': ["Open investment accounts", "Set up SIP"],
                'short_term_plan': ["Monitor monthly performance"],
                'long_term_strategy': ["Review allocation annually"],
                'monitoring_recommendations': ["Track returns quarterly"]
            },
            'model_metadata': {
                'confidence_score': 0.6,
                'method': 'rule_based_fallback',
                'model_version': '1.0.0'
            }
        }

# Global instance - THIS IS THE KEY FIX
investment_recommender = AdvancedInvestmentRecommender()

# Export for testing
__all__ = ['AdvancedInvestmentRecommender', 'investment_recommender']
