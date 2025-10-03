// components/InvestmentRecommender.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import {
  PlusCircle,
  Brain,
  Sparkles,
  Loader2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Upload,
  Zap,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  DollarSign,
  Target,
  Clock,
  Filter,
  Download,
  Settings,
  Eye,
  EyeOff,
  RefreshCw,
  Calendar,
  Users,
  Layers,
  Globe,
  Database,
  Shield,
  Cpu,
  User,
  Briefcase,
  Home,
  GraduationCap,
  Plane,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Info,
  Wallet, // Using Wallet instead of PiggyBank
  Building,
  CreditCard
} from 'lucide-react';
import Header from '@/components/Navbar';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Enhanced Types
interface InvestmentRecommendation {
  recommendation_summary: {
    user_profile: {
      age: number;
      income: string;
      risk_profile: string;
      financial_goal: string;
      employment_type: string;
      investment_amount: string;
    };
    portfolio_overview: {
      total_investment: number;
      expected_annual_return: string;
      risk_level: string;
      diversification_score: number;
      suitability_score: number;
    };
  };
  allocation_breakdown: {
    percentages: Record<string, number>;
    amounts: Record<string, number>;
    by_asset_class: Record<string, number>;
  };
  detailed_analysis: {
    financial_health_scores: {
      stability_score: number;
      readiness_score: number;
      risk_capacity_score: number;
    };
    risk_metrics: {
      portfolio_risk_score: number;
      portfolio_risk_level: string;
      diversification_score: number;
      suitability_score: number;
      volatility_estimate: string;
    };
    expected_returns: {
      expected_return: number;
      time_horizon_years: number;
      risk_adjusted_return: number;
      projection_example?: {
        monthly_investment: number;
        projected_value: number;
        total_invested: number;
      };
    };
  };
  insights_and_recommendations: {
    portfolio_insights: string[];
    risk_management_insights: string[];
    goal_alignment_insights: string[];
    improvement_suggestions: string[];
  };
  implementation_plan: {
    immediate_actions: string[];
    short_term_plan: string[];
    long_term_strategy: string[];
    monitoring_recommendations: string[];
  };
  model_metadata: {
    confidence_score: number;
    method: string;
    model_version: string;
    training_date?: string;
  };
}

// Form schema with multi-step validation
const investmentProfileSchema = z.object({
  // Step 1: Basic Information
  income: z.number().min(10000, 'Income must be at least ₹10,000'),
  age: z.number().min(18, 'Age must be 18 or above').max(100, 'Age must be 100 or below'),
  employment_type: z.enum(['Salaried', 'Self-Employed', 'Business', 'Professional', 'Student']),
  
  // Step 2: Financial Situation
  existing_savings: z.number().min(0, 'Savings cannot be negative').optional(),
  debt_amount: z.number().min(0, 'Debt cannot be negative').optional(),
  monthly_expenses: z.number().min(0, 'Expenses cannot be negative').optional(),
  
  // Step 3: Investment Profile
  risk_profile: z.enum(['Conservative', 'Moderate', 'Aggressive']),
  goal_type: z.enum(['Emergency Fund', 'Retirement', 'Wealth Building', 'Education Fund', 'House Down Payment', 'Vacation Fund']),
  investment_amount: z.number().min(1000, 'Investment amount must be at least ₹1,000').optional(),
});

// Enhanced API Service
class InvestmentAPIService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async getInvestmentRecommendation(profile: z.infer<typeof investmentProfileSchema>) {
    try {
      const response = await fetch(`${this.baseUrl}/investment/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error getting investment recommendation:', error);
      throw error;
    }
  }

  async getRiskProfiles() {
    try {
      const response = await fetch(`${this.baseUrl}/investment/risk-profiles`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error getting risk profiles:', error);
      throw error;
    }
  }

  async getGoalTypes() {
    try {
      const response = await fetch(`${this.baseUrl}/investment/goal-types`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error getting goal types:', error);
      throw error;
    }
  }
}

// Helper functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount);
};

const getAssetColor = (asset: string) => {
  const colors = {
    'fixed_deposits': '#3B82F6',
    'debt_funds': '#06B6D4',
    'government_bonds': '#8B5CF6',
    'large_cap_stocks': '#10B981',
    'mid_cap_stocks': '#F59E0B',
    'small_cap_stocks': '#EF4444',
    'sectoral_funds': '#F97316',
    'balanced_funds': '#6366F1',
    'gold': '#FBBF24',
    'real_estate': '#8B5A2B',
    'international': '#EC4899'
  };
  return colors[asset as keyof typeof colors] || '#6B7280';
};

const getRiskColor = (riskLevel: string) => {
  const colors = {
    'Very Low': '#10B981',
    'Low': '#06B6D4',
    'Moderate': '#F59E0B',
    'High': '#EF4444',
    'Very High': '#DC2626'
  };
  return colors[riskLevel as keyof typeof colors] || '#6B7280';
};

const InvestmentRecommender: React.FC = () => {
  const apiService = new InvestmentAPIService();
  const { toast } = useToast();

  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<InvestmentRecommendation | null>(null);
  const [riskProfiles, setRiskProfiles] = useState<any[]>([]);
  const [goalTypes, setGoalTypes] = useState<any[]>([]);

  // Form instance
  const form = useForm<z.infer<typeof investmentProfileSchema>>({
    resolver: zodResolver(investmentProfileSchema),
    defaultValues: {
      income: 75000,
      age: 28,
      employment_type: 'Salaried',
      existing_savings: 80000,
      debt_amount: 15000,
      monthly_expenses: 45000,
      risk_profile: 'Moderate',
      goal_type: 'Wealth Building',
      investment_amount: 20000
    }
  });

  // Load reference data
  useEffect(() => {
    loadReferenceData();
  }, []);

  const loadReferenceData = async () => {
    try {
      const [riskData, goalData] = await Promise.all([
        apiService.getRiskProfiles(),
        apiService.getGoalTypes()
      ]);
      
      if (riskData.success) setRiskProfiles(riskData.data.risk_profiles);
      if (goalData.success) setGoalTypes(goalData.data.goal_types);
    } catch (error) {
      console.error('Failed to load reference data:', error);
    }
  };

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof investmentProfileSchema>) => {
    setIsLoading(true);
    
    try {
      const result = await apiService.getInvestmentRecommendation(data);
      
      if (result.success) {
        setRecommendation(result.data);
        setCurrentStep(4); // Move to results step
        
        toast({
          title: "Investment Recommendation Generated! 🎉",
          description: `Personalized portfolio created with ${(result.data.model_metadata.confidence_score * 100).toFixed(0)}% confidence`,
        });
      } else {
        throw new Error('Failed to generate recommendation');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Recommendation Failed",
        description: "Unable to generate investment recommendation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate steps
  const nextStep = async () => {
    const currentStepFields = getFieldsForStep(currentStep);
    const isStepValid = await form.trigger(currentStepFields);
    
    if (isStepValid) {
      if (currentStep === 3) {
        // Submit form on last step
        form.handleSubmit(onSubmit)();
      } else {
        setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      }
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const getFieldsForStep = (step: number): (keyof z.infer<typeof investmentProfileSchema>)[] => {
    switch (step) {
      case 1:
        return ['income', 'age', 'employment_type'];
      case 2:
        return ['existing_savings', 'debt_amount', 'monthly_expenses'];
      case 3:
        return ['risk_profile', 'goal_type', 'investment_amount'];
      default:
        return [];
    }
  };

  // Chart data preparation
  const allocationChartData = useMemo(() => {
    if (!recommendation) return [];
    
    return Object.entries(recommendation.allocation_breakdown.percentages)
      .filter(([_, percentage]) => percentage > 0)
      .map(([asset, percentage]) => ({
        name: asset.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: percentage,
        amount: recommendation.allocation_breakdown.amounts[asset],
        color: getAssetColor(asset)
      }));
  }, [recommendation]);

  const assetClassChartData = useMemo(() => {
    if (!recommendation) return [];
    
    return Object.entries(recommendation.allocation_breakdown.by_asset_class)
      .map(([assetClass, percentage]) => ({
        name: assetClass.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: percentage,
        color: getAssetColor(assetClass)
      }));
  }, [recommendation]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <div className="max-w-6xl mx-auto p-4 space-y-6">
          
          {/* Header */}
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardHeader className="relative z-10 pb-8">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                <div className="space-y-2">
                  <CardTitle className="text-4xl lg:text-5xl font-bold flex items-center space-x-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Target className="h-10 w-10" />
                    </div>
                    <span>AI Investment Advisor</span>
                  </CardTitle>
                  <CardDescription className="text-blue-100 text-lg">
                    Get personalized investment recommendations powered by advanced AI
                  </CardDescription>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
                    <Brain className="h-4 w-4 mr-2" />
                    ML Powered
                  </Badge>
                  <Badge className="bg-emerald-500/20 text-emerald-100 border-emerald-400/30 px-4 py-2 text-sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Secure & Private
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Progress Indicator */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Investment Profile Assessment</h3>
                <span className="text-sm text-muted-foreground">
                  Step {currentStep} of {totalSteps}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <React.Fragment key={i}>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        i + 1 <= currentStep
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      {i + 1 < currentStep ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        i + 1
                      )}
                    </div>
                    {i < totalSteps - 1 && (
                      <div
                        className={`flex-1 h-2 rounded ${
                          i + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Multi-Step Form */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  
                  {/* Step 1: Basic Information */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <User className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
                        <p className="text-muted-foreground">Tell us about yourself to get started</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="income"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center space-x-2">
                                <DollarSign className="h-4 w-4" />
                                <span>Monthly Income (₹)</span>
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="75000"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="age"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <span>Age</span>
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="28"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="employment_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center space-x-2">
                              <Briefcase className="h-4 w-4" />
                              <span>Employment Type</span>
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select employment type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Salaried">Salaried Employee</SelectItem>
                                <SelectItem value="Self-Employed">Self Employed</SelectItem>
                                <SelectItem value="Business">Business Owner</SelectItem>
                                <SelectItem value="Professional">Professional</SelectItem>
                                <SelectItem value="Student">Student</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 2: Financial Situation */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <Wallet className="h-16 w-16 text-green-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Financial Situation</h2>
                        <p className="text-muted-foreground">Help us understand your current financial position</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="existing_savings"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center space-x-2">
                                <Wallet className="h-4 w-4" />
                                <span>Current Savings (₹)</span>
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="80000"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="debt_amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center space-x-2">
                                <CreditCard className="h-4 w-4" />
                                <span>Total Debt (₹)</span>
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="15000"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="monthly_expenses"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center space-x-2">
                              <Home className="h-4 w-4" />
                              <span>Monthly Expenses (₹)</span>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="45000"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 3: Investment Profile */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <Target className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Investment Profile</h2>
                        <p className="text-muted-foreground">Define your investment goals and risk appetite</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="risk_profile"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center space-x-2">
                                <TrendingUp className="h-4 w-4" />
                                <span>Risk Profile</span>
                              </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select risk profile" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Conservative">Conservative - Low Risk</SelectItem>
                                  <SelectItem value="Moderate">Moderate - Balanced Risk</SelectItem>
                                  <SelectItem value="Aggressive">Aggressive - High Risk</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="goal_type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center space-x-2">
                                <Target className="h-4 w-4" />
                                <span>Investment Goal</span>
                              </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select investment goal" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Emergency Fund">Emergency Fund</SelectItem>
                                  <SelectItem value="Retirement">Retirement Planning</SelectItem>
                                  <SelectItem value="Wealth Building">Wealth Building</SelectItem>
                                  <SelectItem value="Education Fund">Education Fund</SelectItem>
                                  <SelectItem value="House Down Payment">House Down Payment</SelectItem>
                                  <SelectItem value="Vacation Fund">Vacation Fund</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="investment_amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4" />
                              <span>Monthly Investment Amount (₹)</span>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="20000"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 4: Results */}
                  {currentStep === 4 && recommendation && (
                    <div className="space-y-8">
                      <div className="text-center mb-8">
                        <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Your Personalized Investment Plan</h2>
                        <p className="text-muted-foreground">AI-powered recommendations tailored to your profile</p>
                      </div>

                      {/* Portfolio Overview */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="text-center">
                          <CardContent className="p-6">
                            <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-blue-900">
                              {formatCurrency(recommendation.recommendation_summary.portfolio_overview.total_investment)}
                            </div>
                            <div className="text-sm text-muted-foreground">Total Investment</div>
                          </CardContent>
                        </Card>

                        <Card className="text-center">
                          <CardContent className="p-6">
                            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-green-900">
                              {recommendation.recommendation_summary.portfolio_overview.expected_annual_return}
                            </div>
                            <div className="text-sm text-muted-foreground">Expected Return</div>
                          </CardContent>
                        </Card>

                        <Card className="text-center">
                          <CardContent className="p-6">
                            <Shield className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-orange-900">
                              {recommendation.recommendation_summary.portfolio_overview.risk_level}
                            </div>
                            <div className="text-sm text-muted-foreground">Risk Level</div>
                          </CardContent>
                        </Card>

                        <Card className="text-center">
                          <CardContent className="p-6">
                            <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-purple-900">
                              {recommendation.recommendation_summary.portfolio_overview.suitability_score.toFixed(0)}%
                            </div>
                            <div className="text-sm text-muted-foreground">Suitability Score</div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Asset Allocation Chart */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Portfolio Allocation</CardTitle>
                          <CardDescription>Recommended asset distribution</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Pie Chart */}
                            <ResponsiveContainer width="100%" height={300}>
                              <PieChart>
                                <Pie
                                  data={allocationChartData}
                                  dataKey="value"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={100}
                                  paddingAngle={2}
                                  label={({name, value}) => `${value.toFixed(1)}%`}
                                >
                                  {allocationChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip 
                                  formatter={(value, name) => [
                                    `${Number(value).toFixed(1)}%`,
                                    name
                                  ]}
                                />
                                <Legend />
                              </PieChart>
                            </ResponsiveContainer>

                            {/* Allocation Details */}
                            <div className="space-y-3">
                              {allocationChartData.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <div 
                                      className="w-4 h-4 rounded-full" 
                                      style={{ backgroundColor: item.color }}
                                    />
                                    <span className="font-medium">{item.name}</span>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-bold">{formatCurrency(item.amount)}</div>
                                    <div className="text-sm text-muted-foreground">{item.value.toFixed(1)}%</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Implementation Plan */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Implementation Plan</CardTitle>
                          <CardDescription>Step-by-step guide to implement your investment strategy</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Tabs defaultValue="immediate" className="space-y-4">
                            <TabsList className="grid w-full grid-cols-3">
                              <TabsTrigger value="immediate">Immediate</TabsTrigger>
                              <TabsTrigger value="short-term">Short Term</TabsTrigger>
                              <TabsTrigger value="long-term">Long Term</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="immediate">
                              <ul className="space-y-3">
                                {recommendation.implementation_plan.immediate_actions.map((action, index) => (
                                  <li key={index} className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">
                                      {index + 1}
                                    </div>
                                    <span className="text-sm">{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </TabsContent>
                            
                            <TabsContent value="short-term">
                              <ul className="space-y-3">
                                {recommendation.implementation_plan.short_term_plan.map((plan, index) => (
                                  <li key={index} className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">
                                      {index + 1}
                                    </div>
                                    <span className="text-sm">{plan}</span>
                                  </li>
                                ))}
                              </ul>
                            </TabsContent>
                            
                            <TabsContent value="long-term">
                              <ul className="space-y-3">
                                {recommendation.implementation_plan.long_term_strategy.map((strategy, index) => (
                                  <li key={index} className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                                      {index + 1}
                                    </div>
                                    <span className="text-sm">{strategy}</span>
                                  </li>
                                ))}
                              </ul>
                            </TabsContent>
                          </Tabs>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="flex items-center space-x-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Previous</span>
                    </Button>

                    {currentStep < 4 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={isLoading}
                        className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                      >
                        {currentStep === 3 ? (
                          isLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Generating...</span>
                            </>
                          ) : (
                            <>
                              <Brain className="h-4 w-4" />
                              <span>Get Recommendation</span>
                            </>
                          )
                        ) : (
                          <>
                            <span>Next</span>
                            <ChevronRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => {
                          setCurrentStep(1);
                          setRecommendation(null);
                          form.reset();
                        }}
                        className="flex items-center space-x-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Start New Assessment</span>
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Model Information Footer */}
          {recommendation && (
            <Card className="shadow-lg bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {(recommendation.model_metadata.confidence_score * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-slate-600">AI Confidence</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600 capitalize">
                      {recommendation.model_metadata.method}
                    </div>
                    <div className="text-sm text-slate-600">Analysis Method</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      v{recommendation.model_metadata.model_version}
                    </div>
                    <div className="text-sm text-slate-600">Model Version</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      <Shield className="h-8 w-8 mx-auto" />
                    </div>
                    <div className="text-sm text-slate-600">Secure & Private</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default InvestmentRecommender;
