// components/ProfessionalBudgetDashboard.tsx
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
  AreaChart,
  Area,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage,FormDescription } from '@/components/ui/form';
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
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Star,
  Bookmark,
  Share2,
  IndianRupee
} from 'lucide-react';
import Header from '@/components/DynamicNavbar';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Enhanced Types
interface MLCategoryResponse {
  success: boolean;
  data: {
    description: string;
    category: 'Needs' | 'Wants' | 'Savings';
    confidence: number;
    method: string;
    amount: number;
    transaction_id?: string | null;
    alternatives?: any[] | null;
    error?: string | null;
    timestamp: string;
  };
  warning?: string | null;
  processing_time_ms: number;
}

interface ExpenseItem {
  id: string;
  description: string;
  amount: number;
  category: 'Needs' | 'Wants' | 'Savings';
  confidence: number;
  method: string;
  timestamp: string;
  processing_time: number;
  tags?: string[];
  merchant?: string;
  location?: string;
  notes?: string;
  isRecurring?: boolean;
  subcategory?: string;
}

interface AnalyticsData {
  totalAmount: number;
  transactionCount: number;
  averageConfidence: number;
  categoryBreakdown: Record<string, number>;
  methodDistribution: Record<string, number>;
  dailyTrends: Array<{ date: string; amount: number; count: number }>;
  monthlyTrends: Array<{ month: string; Needs: number; Wants: number; Savings: number }>;
  confidenceDistribution: Array<{ range: string; count: number }>;
  processingTimeStats: {
    average: number;
    min: number;
    max: number;
  };
}

interface ModelMetrics {
  accuracy: number;
  precision: Record<string, number>;
  recall: Record<string, number>;
  f1Score: Record<string, number>;
  confusionMatrix: number[][];
  lastTrainingDate: string;
  modelVersion: string;
  totalPredictions: number;
}

// Form schemas
const expenseSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  merchant: z.string().optional(),
  notes: z.string().optional(),
  tags: z.string().optional(),
});

const batchExpenseSchema = z.object({
  expenses: z.string().min(1, 'Please enter expense data'),
  format: z.enum(['csv', 'json']).default('csv')
});

// Helper Functions - MOVED BEFORE COMPONENT
const generateDailyTrends = (data: ExpenseItem[]) => {
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayData = data.filter(exp => exp.timestamp.startsWith(dateStr));
    last7Days.push({
      date: dateStr,
      amount: dayData.reduce((sum, exp) => sum + exp.amount, 0),
      count: dayData.length
    });
  }
  return last7Days;
};

const generateMonthlyTrends = (data: ExpenseItem[]) => {
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    const monthData = data.filter(exp => exp.timestamp.startsWith(monthStr));
    const monthTotals = monthData.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, { Needs: 0, Wants: 0, Savings: 0 });
    
    last6Months.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      ...monthTotals
    });
  }
  return last6Months;
};

const getCategoryColor = (category: string): string => {
  const colors = {
    Needs: '#3B82F6',     // Blue
    Wants: '#F59E0B',     // Amber  
    Savings: '#10B981'    // Emerald
  };
  return colors[category as keyof typeof colors] || '#6B7280';
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};

const formatPercent = (value: number) => {
  return `${value.toFixed(1)}%`;
};

const getConfidenceBadgeColor = (confidence: number) => {
  if (confidence >= 0.9) return 'bg-emerald-500 text-white';
  if (confidence >= 0.8) return 'bg-blue-500 text-white';
  if (confidence >= 0.7) return 'bg-yellow-500 text-white';
  if (confidence >= 0.6) return 'bg-orange-500 text-white';
  return 'bg-red-500 text-white';
};

const getMethodBadgeColor = (method: string) => {
  const colors = {
    'rule': 'bg-purple-500 text-white',
    'ml': 'bg-blue-500 text-white', 
    'hybrid': 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
  };
  return colors[method as keyof typeof colors] || 'bg-gray-500 text-white';
};

// Enhanced API Service
class EnhancedBudgetMLService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async categorizeExpense(expense: { description: string; amount: number }): Promise<MLCategoryResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/budget/categorize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error categorizing expense:', error);
      throw error;
    }
  }

  async batchCategorizeExpenses(expenses: Array<{ description: string; amount: number }>) {
    try {
      const response = await fetch(`${this.baseUrl}/budget/batch-categorize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expenses }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error batch categorizing expenses:', error);
      throw error;
    }
  }

  async getModelMetrics(): Promise<ModelMetrics> {
    // Simulated model metrics - replace with actual API call
    return {
      accuracy: 0.847,
      precision: { Needs: 0.89, Wants: 0.82, Savings: 0.91 },
      recall: { Needs: 0.85, Wants: 0.88, Savings: 0.79 },
      f1Score: { Needs: 0.87, Wants: 0.85, Savings: 0.84 },
      confusionMatrix: [[245, 23, 12], [19, 198, 15], [8, 13, 167]],
      lastTrainingDate: '2025-10-01T10:30:00Z',
      modelVersion: '2.1.3',
      totalPredictions: 15847
    };
  }
}

const ProfessionalBudgetDashboard: React.FC = () => {
  const apiService = new EnhancedBudgetMLService();
  const { toast } = useToast();

  // Enhanced State Management
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<ExpenseItem[]>([]);
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBatchLoading, setIsBatchLoading] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | 'ytd' | 'all'>('30d');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Needs', 'Wants', 'Savings']);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [realTimeMode, setRealTimeMode] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Dialog States
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showBatchDialog, setShowBatchDialog] = useState(false);
  const [showModelMetrics, setShowModelMetrics] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Form instances
  const expenseForm = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: '',
      amount: 0,
      merchant: '',
      notes: '',
      tags: ''
    }
  });

  const batchForm = useForm<z.infer<typeof batchExpenseSchema>>({
    resolver: zodResolver(batchExpenseSchema),
    defaultValues: {
      expenses: '',
      format: 'csv'
    }
  });

  // Load initial data
  useEffect(() => {
    loadModelMetrics();
    loadStoredExpenses();
  }, []);

  // Filter expenses based on current filters
  useEffect(() => {
    filterExpenses();
  }, [expenses, selectedTimeRange, selectedCategories]);

  const loadModelMetrics = async () => {
    try {
      const metrics = await apiService.getModelMetrics();
      setModelMetrics(metrics);
    } catch (error) {
      console.error('Failed to load model metrics:', error);
    }
  };

  const loadStoredExpenses = () => {
    const stored = localStorage.getItem('professional-budget-expenses');
    if (stored) {
      try {
        setExpenses(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load stored expenses:', error);
        setExpenses([]);
      }
    }
  };

  const saveExpenses = (newExpenses: ExpenseItem[]) => {
    localStorage.setItem('professional-budget-expenses', JSON.stringify(newExpenses));
  };

  const filterExpenses = () => {
    let filtered = [...expenses];

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(exp => selectedCategories.includes(exp.category));
    }

    // Filter by time range
    const now = new Date();
    const timeRanges = {
      '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      '90d': new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
      'ytd': new Date(now.getFullYear(), 0, 1),
      'all': new Date(0)
    };

    if (selectedTimeRange !== 'all') {
      const cutoffDate = timeRanges[selectedTimeRange];
      filtered = filtered.filter(exp => new Date(exp.timestamp) >= cutoffDate);
    }

    setFilteredExpenses(filtered);
  };

  // Enhanced Analytics Calculations - FIXED
  const analyticsData = useMemo((): AnalyticsData => {
    const data = filteredExpenses;
    
    const totalAmount = data.reduce((sum, exp) => sum + exp.amount, 0);
    const transactionCount = data.length;
    const averageConfidence = data.length > 0 
      ? data.reduce((sum, exp) => sum + exp.confidence, 0) / data.length 
      : 0;

    const categoryBreakdown = data.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    const methodDistribution = data.reduce((acc, exp) => {
      acc[exp.method] = (acc[exp.method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Generate trends using the helper functions
    const dailyTrends = generateDailyTrends(data);
    const monthlyTrends = generateMonthlyTrends(data);

    // Confidence distribution
    const confidenceDistribution = [
      { range: '90-100%', count: data.filter(e => e.confidence >= 0.9).length },
      { range: '80-89%', count: data.filter(e => e.confidence >= 0.8 && e.confidence < 0.9).length },
      { range: '70-79%', count: data.filter(e => e.confidence >= 0.7 && e.confidence < 0.8).length },
      { range: '60-69%', count: data.filter(e => e.confidence >= 0.6 && e.confidence < 0.7).length },
      { range: '< 60%', count: data.filter(e => e.confidence < 0.6).length }
    ];

    // Processing time stats
    const processingTimes = data.map(e => e.processing_time).filter(t => t > 0);
    const processingTimeStats = {
      average: processingTimes.length > 0 ? processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length : 0,
      min: processingTimes.length > 0 ? Math.min(...processingTimes) : 0,
      max: processingTimes.length > 0 ? Math.max(...processingTimes) : 0
    };

    return {
      totalAmount,
      transactionCount,
      averageConfidence,
      categoryBreakdown,
      methodDistribution,
      dailyTrends,
      monthlyTrends,
      confidenceDistribution,
      processingTimeStats
    };
  }, [filteredExpenses]);

  // Handle single expense submission
  const onSubmitExpense = async (data: z.infer<typeof expenseSchema>) => {
    setIsLoading(true);
    
    try {
      const result = await apiService.categorizeExpense({
        description: data.description,
        amount: data.amount
      });

      if (result.success) {
        const newExpense: ExpenseItem = {
          id: Date.now().toString(),
          description: result.data.description,
          amount: result.data.amount,
          category: result.data.category,
          confidence: result.data.confidence,
          method: result.data.method,
          timestamp: result.data.timestamp,
          processing_time: result.processing_time_ms,
          merchant: data.merchant,
          notes: data.notes,
          tags: data.tags ? data.tags.split(',').map(t => t.trim()) : []
        };

        const updatedExpenses = [newExpense, ...expenses];
        setExpenses(updatedExpenses);
        saveExpenses(updatedExpenses);

        toast({
          title: "Expense Categorized Successfully! 🎉",
          description: `Classified as "${result.data.category}" with ${(result.data.confidence * 100).toFixed(1)}% confidence using ${result.data.method} method`,
        });

        expenseForm.reset();
        setShowAddExpense(false);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Categorization Failed",
        description: "Unable to categorize expense. Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle batch processing
  const onSubmitBatch = async (data: z.infer<typeof batchExpenseSchema>) => {
    setIsBatchLoading(true);
    
    try {
      let expenseItems: Array<{ description: string; amount: number }> = [];

      if (data.format === 'csv') {
        const lines = data.expenses.trim().split('\n').filter(line => line.trim());
        expenseItems = lines.map(line => {
          const [description, amountStr] = line.split(',').map(s => s.trim());
          return {
            description,
            amount: parseFloat(amountStr) || 0
          };
        }).filter(item => item.description && item.amount > 0);
      } else {
        // JSON format
        expenseItems = JSON.parse(data.expenses);
      }

      if (expenseItems.length === 0) {
        throw new Error('No valid expenses found. Please check your format.');
      }

      const result = await apiService.batchCategorizeExpenses(expenseItems);

      if (result.success) {
        const newExpenses: ExpenseItem[] = result.data.results.map((item, index) => ({
          id: (Date.now() + index).toString(),
          description: item.description,
          amount: item.amount,
          category: item.category,
          confidence: item.confidence,
          method: item.method,
          timestamp: new Date().toISOString(),
          processing_time: 0
        }));

        const updatedExpenses = [...newExpenses, ...expenses];
        setExpenses(updatedExpenses);
        saveExpenses(updatedExpenses);

        toast({
          title: `Batch Processing Complete! 🚀`,
          description: `Successfully categorized ${result.data.processed_count} expenses. Total amount: $${result.data.summary.total_amount.toFixed(2)}`,
        });

        batchForm.reset();
        setShowBatchDialog(false);
      }
    } catch (error) {
      console.error('Batch error:', error);
      toast({
        title: "Batch Processing Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsBatchLoading(false);
    }
  };

  // Chart data preparation
  const pieData = Object.entries(analyticsData.categoryBreakdown)
    .filter(([_, amount]) => amount > 0)
    .map(([category, amount]) => ({
      name: category,
      value: amount,
      percentage: ((amount / analyticsData.totalAmount) * 100).toFixed(1),
      color: getCategoryColor(category)
    }));

  const treemapData = Object.entries(analyticsData.categoryBreakdown)
    .map(([category, amount]) => ({
      name: category,
      size: amount,
      fill: getCategoryColor(category)
    }));

  const radarData = [
    {
      subject: 'Accuracy',
      current: modelMetrics?.accuracy ? modelMetrics.accuracy * 100 : 0,
      target: 90,
      fullMark: 100
    },
    {
      subject: 'Precision',
      current: modelMetrics?.precision ? Object.values(modelMetrics.precision).reduce((a, b) => a + b) / 3 * 100 : 0,
      target: 85,
      fullMark: 100
    },
    {
      subject: 'Recall',
      current: modelMetrics?.recall ? Object.values(modelMetrics.recall).reduce((a, b) => a + b) / 3 * 100 : 0,
      target: 85,
      fullMark: 100
    },
    {
      subject: 'F1-Score',
      current: modelMetrics?.f1Score ? Object.values(modelMetrics.f1Score).reduce((a, b) => a + b) / 3 * 100 : 0,
      target: 87,
      fullMark: 100
    }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <div className="max-w-[2000px] mx-auto p-4 space-y-6">
          
          {/* Enhanced Header */}
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardHeader className="relative z-10 pb-8">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                <div className="space-y-2">
                  <CardTitle className="text-4xl lg:text-5xl font-bold flex items-center space-x-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Brain className="h-10 w-10" />
                    </div>
                    <span>AI Budget Analytics</span>
                  </CardTitle>
                  <CardDescription className="text-blue-100 text-lg">
                    Enterprise-grade expense categorization & financial intelligence
                  </CardDescription>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
                    <Cpu className="h-4 w-4 mr-2" />
                    Model v{modelMetrics?.modelVersion || '2.1.3'}
                  </Badge>
                  <Badge className="bg-emerald-500/20 text-emerald-100 border-emerald-400/30 px-4 py-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {realTimeMode ? 'Live' : 'Offline'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Executive Summary KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Analyzed</p>
                    <p className="text-3xl font-bold text-blue-900">{formatCurrency(analyticsData.totalAmount)}</p>
                    <p className="text-xs text-blue-500 mt-1">+12.5% vs last period</p>
                  </div>
                  <IndianRupee className="h-10 w-10 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-600">Transactions</p>
                    <p className="text-3xl font-bold text-emerald-900">{analyticsData.transactionCount.toLocaleString()}</p>
                    <p className="text-xs text-emerald-500 mt-1">+8.2% this month</p>
                  </div>
                  <Activity className="h-10 w-10 text-emerald-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">AI Confidence</p>
                    <p className="text-3xl font-bold text-purple-900">{formatPercent(analyticsData.averageConfidence * 100)}</p>
                    <p className="text-xs text-purple-500 mt-1">Model accuracy</p>
                  </div>
                  <Brain className="h-10 w-10 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-600">Avg Processing</p>
                    <p className="text-3xl font-bold text-amber-900">{analyticsData.processingTimeStats.average.toFixed(1)}ms</p>
                    <p className="text-xs text-amber-500 mt-1">Response time</p>
                  </div>
                  <Zap className="h-10 w-10 text-amber-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-rose-600">Top Category</p>
                    <p className="text-2xl font-bold text-rose-900">
                      {Object.entries(analyticsData.categoryBreakdown).length > 0 
                        ? Object.entries(analyticsData.categoryBreakdown).reduce((a, b) => a[1] > b[1] ? a : b, ['N/A', 0])[0]
                        : 'N/A'}
                    </p>
                    <p className="text-xs text-rose-500 mt-1">Primary spending</p>
                  </div>
                  <Target className="h-10 w-10 text-rose-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Model Accuracy</p>
                    <p className="text-3xl font-bold text-slate-900">{formatPercent((modelMetrics?.accuracy || 0) * 100)}</p>
                    <p className="text-xs text-slate-500 mt-1">Validation score</p>
                  </div>
                  <Shield className="h-10 w-10 text-slate-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Bar */}
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                  <Select value={selectedTimeRange} onValueChange={(value: any) => setSelectedTimeRange(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                      <SelectItem value="ytd">Year to date</SelectItem>
                      <SelectItem value="all">All time</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center space-x-2">
                    {['Needs', 'Wants', 'Savings'].map(category => (
                      <Badge
                        key={category}
                        variant={selectedCategories.includes(category) ? 'default' : 'outline'}
                        className={`cursor-pointer transition-all ${
                          selectedCategories.includes(category) 
                            ? 'text-white' 
                            : ''
                        }`}
                        style={{
                          backgroundColor: selectedCategories.includes(category) ? getCategoryColor(category) : 'transparent',
                          borderColor: getCategoryColor(category)
                        }}
                        onClick={() => {
                          const newCategories = selectedCategories.includes(category)
                            ? selectedCategories.filter(c => c !== category)
                            : [...selectedCategories, category];
                          setSelectedCategories(newCategories);
                        }}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Advanced
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Expense
                      </Button>
                    </DialogTrigger>
                  </Dialog>

                  <Dialog open={showBatchDialog} onOpenChange={setShowBatchDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Batch Process
                      </Button>
                    </DialogTrigger>
                  </Dialog>

                  <Button variant="outline" onClick={() => setShowModelMetrics(true)}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Model Metrics
                  </Button>

                  <Button variant="outline" onClick={() => setShowExportDialog(true)}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Simple Overview Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            
            {/* Enhanced Pie Chart */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChartIcon className="h-5 w-5 text-blue-600" />
                  <span>Category Distribution</span>
                </CardTitle>
                <CardDescription>
                  Spending breakdown by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pieData.length > 0 ? (
                  <div className="space-y-4">
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          paddingAngle={3}
                          label={({name, percentage}) => `${percentage}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [formatCurrency(Number(value)), 'Amount']}
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    <div className="space-y-2">
                      {pieData.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="font-medium">{item.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">{formatCurrency(item.value)}</div>
                            <div className="text-sm text-gray-500">{item.percentage}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <PieChartIcon className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium mb-2">No data available</p>
                    <p className="text-sm">Add expenses to see category breakdown</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="shadow-lg xl:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <span>Recent Transactions</span>
                  </div>
                  <Badge variant="secondary">
                    {filteredExpenses.length} Total
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredExpenses.length > 0 ? (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {filteredExpenses.slice(0, 10).map((expense) => (
                        <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-center space-x-4">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{backgroundColor: getCategoryColor(expense.category)}}
                            />
                            <div>
                              <div className="font-medium">{expense.description}</div>
                              <div className="text-sm text-gray-500 flex items-center space-x-2">
                                <span>{expense.category}</span>
                                <Badge 
                                  className={`${getConfidenceBadgeColor(expense.confidence)} text-xs`}
                                >
                                  {(expense.confidence * 100).toFixed(1)}% {expense.method}
                                </Badge>
                                <span>• {new Date(expense.timestamp).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">{formatCurrency(expense.amount)}</div>
                            {expense.processing_time > 0 && (
                              <div className="text-xs text-gray-400">
                                {expense.processing_time.toFixed(1)}ms
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Activity className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium mb-2">No transactions found</p>
                    <p className="text-sm">Add expenses or adjust your filters to see data</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Dialogs */}
          
          {/* Add Expense Dialog */}
          <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Brain className="h-6 w-6 text-purple-600" />
                  <span>Add New Expense</span>
                </DialogTitle>
                <DialogDescription>
                  Enter expense details for AI-powered categorization
                </DialogDescription>
              </DialogHeader>
              <Form {...expenseForm}>
                <form onSubmit={expenseForm.handleSubmit(onSubmitExpense)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={expenseForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Starbucks coffee, Netflix subscription" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={expenseForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              placeholder="450.00"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={expenseForm.control}
                      name="merchant"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Merchant</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Amazon, Walmart" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={expenseForm.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., work, personal, recurring" {...field} />
                          </FormControl>
                          <FormDescription>
                            Comma-separated tags for organization
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={expenseForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Additional notes about this expense..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowAddExpense(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isLoading} 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing with AI...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Categorize with AI
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Batch Processing Dialog */}
          <Dialog open={showBatchDialog} onOpenChange={setShowBatchDialog}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Upload className="h-6 w-6 text-blue-600" />
                  <span>Batch Processing</span>
                </DialogTitle>
                <DialogDescription>
                  Process multiple expenses simultaneously using AI categorization
                </DialogDescription>
              </DialogHeader>
              <Form {...batchForm}>
                <form onSubmit={batchForm.handleSubmit(onSubmitBatch)} className="space-y-6">
                  <FormField
                    control={batchForm.control}
                    name="format"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Input Format</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="csv">CSV Format (description,amount)</SelectItem>
                            <SelectItem value="json">JSON Format</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={batchForm.control}
                    name="expenses"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expense Data</FormLabel>
                        <FormControl>
                          <Textarea 
                            className="min-h-[300px] font-mono text-sm"
                            placeholder={`Starbucks coffee,4.50
Netflix subscription,15.99
Grocery shopping,85.30
Gas station fill-up,42.00
Amazon purchase,127.50`}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter one expense per line in the selected format
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowBatchDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isBatchLoading}
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                    >
                      {isBatchLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing {batchForm.watch('expenses').split('\n').filter(l => l.trim()).length} items...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Process Batch
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Performance Summary Footer */}
          <Card className="shadow-lg bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-slate-800">{formatCurrency(analyticsData.totalAmount)}</div>
                  <div className="text-sm text-slate-600">Total Processed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">{analyticsData.transactionCount}</div>
                  <div className="text-sm text-slate-600">Transactions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">{formatPercent(analyticsData.averageConfidence * 100)}</div>
                  <div className="text-sm text-slate-600">Avg Confidence</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">{analyticsData.processingTimeStats.average.toFixed(1)}ms</div>
                  <div className="text-sm text-slate-600">Avg Response</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600">
                    {Object.values(analyticsData.methodDistribution).reduce((a, b) => a + b, 0) > 0 
                      ? Object.entries(analyticsData.methodDistribution).find(([_, count]) => count === Math.max(...Object.values(analyticsData.methodDistribution)))?.[0] || 'N/A'
                      : 'N/A'}
                  </div>
                  <div className="text-sm text-slate-600">Primary Method</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-indigo-600">
                    {modelMetrics ? formatPercent(modelMetrics.accuracy * 100) : 'N/A'}
                  </div>
                  <div className="text-sm text-slate-600">Model Accuracy</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ProfessionalBudgetDashboard;
