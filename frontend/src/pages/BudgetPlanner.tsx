// components/BudgetPlanner.tsx
import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,   } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  PlusCircle,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  Trash2,
  Calculator,
  Calendar,
  DollarSign,
  PiggyBank,
  CreditCard,
  ShoppingCart,
  Home,
  Car,
  Heart,
  GraduationCap,
  Coffee,
  Smartphone,
  MoreHorizontal
} from 'lucide-react';
import Header from '@/components/Navbar';

interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  remaining: number;
  type: 'essential' | 'lifestyle' | 'savings' | 'debt';
  color: string;
  icon: string;
  description?: string;
  isRecurring: boolean;
  frequency?: 'monthly' | 'weekly' | 'yearly';
}

interface BudgetGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  isCompleted: boolean;
}

interface Expense {
  id: string;
  amount: number;
  description: string;
  categoryId: string;
  date: string;
  isRecurring: boolean;
  merchant?: string;
}

interface BudgetTemplate {
  id: string;
  name: string;
  description: string;
  categories: Omit<BudgetCategory, 'id' | 'spent' | 'remaining'>[];
}

const BudgetPlanner: React.FC = () => {
  const [totalBudget, setTotalBudget] = useState<number>(5000);
  const [budgetPeriod, setBudgetPeriod] = useState<'monthly' | 'weekly' | 'yearly'>('monthly');
  const [isEditingBudget, setIsEditingBudget] = useState<boolean>(false);

  const [categories, setCategories] = useState<BudgetCategory[]>([
    {
      id: '1',
      name: 'Housing',
      budgeted: 1500,
      spent: 1450,
      remaining: 50,
      type: 'essential',
      color: 'hsl(217, 91%, 60%)',
      icon: '🏠',
      description: 'Rent, utilities, home maintenance',
      isRecurring: true,
      frequency: 'monthly'
    },
    {
      id: '2',
      name: 'Food & Groceries',
      budgeted: 600,
      spent: 680,
      remaining: -80,
      type: 'essential',
      color: 'hsl(142, 71%, 45%)',
      icon: '🛒',
      description: 'Groceries, dining out, food delivery',
      isRecurring: true,
      frequency: 'weekly'
    },
    {
      id: '3',
      name: 'Transportation',
      budgeted: 400,
      spent: 350,
      remaining: 50,
      type: 'essential',
      color: 'hsl(173, 80%, 40%)',
      icon: '🚗',
      description: 'Gas, public transport, car maintenance',
      isRecurring: true,
      frequency: 'monthly'
    },
    {
      id: '4',
      name: 'Entertainment',
      budgeted: 300,
      spent: 420,
      remaining: -120,
      type: 'lifestyle',
      color: 'hsl(258, 90%, 66%)',
      icon: '🎬',
      description: 'Movies, games, subscriptions',
      isRecurring: false
    },
    {
      id: '5',
      name: 'Healthcare',
      budgeted: 250,
      spent: 180,
      remaining: 70,
      type: 'essential',
      color: 'hsl(38, 92%, 50%)',
      icon: '⚕️',
      description: 'Insurance, medications, doctor visits',
      isRecurring: true,
      frequency: 'monthly'
    },
    {
      id: '6',
      name: 'Emergency Fund',
      budgeted: 500,
      spent: 500,
      remaining: 0,
      type: 'savings',
      color: 'hsl(0, 72%, 51%)',
      icon: '💰',
      description: 'Emergency savings account',
      isRecurring: true,
      frequency: 'monthly'
    }
  ]);

  const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>([
    {
      id: '1',
      title: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 6500,
      targetDate: '2025-12-31',
      category: 'savings',
      priority: 'high',
      isCompleted: false
    },
    {
      id: '2',
      title: 'Vacation to Europe',
      targetAmount: 3500,
      currentAmount: 1200,
      targetDate: '2025-08-15',
      category: 'lifestyle',
      priority: 'medium',
      isCompleted: false
    },
    {
      id: '3',
      title: 'New Laptop',
      targetAmount: 1500,
      currentAmount: 800,
      targetDate: '2025-06-01',
      category: 'lifestyle',
      priority: 'low',
      isCompleted: false
    }
  ]);

  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([
    {
      id: '1',
      amount: 85.50,
      description: 'Weekly groceries',
      categoryId: '2',
      date: '2025-10-01',
      isRecurring: true,
      merchant: 'Walmart'
    },
    {
      id: '2',
      amount: 50.00,
      description: 'Gas fill-up',
      categoryId: '3',
      date: '2025-09-30',
      isRecurring: false,
      merchant: 'Shell'
    },
    {
      id: '3',
      amount: 12.99,
      description: 'Netflix subscription',
      categoryId: '4',
      date: '2025-09-29',
      isRecurring: true,
      merchant: 'Netflix'
    }
  ]);

  const [budgetTemplates] = useState<BudgetTemplate[]>([
    {
      id: '1',
      name: '50/30/20 Rule',
      description: 'Allocate 50% needs, 30% wants, 20% savings',
      categories: [
        { name: 'Housing', budgeted: 0, type: 'essential', color: 'hsl(217, 91%, 60%)', icon: '🏠', isRecurring: true },
        { name: 'Food', budgeted: 0, type: 'essential', color: 'hsl(142, 71%, 45%)', icon: '🛒', isRecurring: true },
        { name: 'Transportation', budgeted: 0, type: 'essential', color: 'hsl(173, 80%, 40%)', icon: '🚗', isRecurring: true },
        { name: 'Entertainment', budgeted: 0, type: 'lifestyle', color: 'hsl(258, 90%, 66%)', icon: '🎬', isRecurring: false },
        { name: 'Savings', budgeted: 0, type: 'savings', color: 'hsl(38, 92%, 50%)', icon: '💰', isRecurring: true }
      ]
    },
    {
      id: '2',
      name: 'Zero-Based Budget',
      description: 'Every dollar has a purpose',
      categories: [
        { name: 'Housing', budgeted: 0, type: 'essential', color: 'hsl(217, 91%, 60%)', icon: '🏠', isRecurring: true },
        { name: 'Utilities', budgeted: 0, type: 'essential', color: 'hsl(142, 71%, 45%)', icon: '⚡', isRecurring: true },
        { name: 'Food', budgeted: 0, type: 'essential', color: 'hsl(173, 80%, 40%)', icon: '🛒', isRecurring: true },
        { name: 'Transportation', budgeted: 0, type: 'essential', color: 'hsl(258, 90%, 66%)', icon: '🚗', isRecurring: true },
        { name: 'Debt Payment', budgeted: 0, type: 'debt', color: 'hsl(0, 72%, 51%)', icon: '💳', isRecurring: true },
        { name: 'Emergency Fund', budgeted: 0, type: 'savings', color: 'hsl(38, 92%, 50%)', icon: '🛡️', isRecurring: true }
      ]
    }
  ]);

  // Calculations
  const totalBudgeted = categories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalRemaining = totalBudgeted - totalSpent;
  const budgetUtilization = (totalSpent / totalBudgeted) * 100;

  // Chart data
  const categoryBreakdownData = categories.map(cat => ({
    name: cat.name,
    budgeted: cat.budgeted,
    spent: cat.spent,
    remaining: Math.max(0, cat.remaining),
    overspent: Math.max(0, -cat.remaining),
    color: cat.color
  }));

  const spendingTrendData = [
    { week: 'Week 1', planned: 1250, actual: 1180, savings: 70 },
    { week: 'Week 2', planned: 1250, actual: 1320, savings: -70 },
    { week: 'Week 3', planned: 1250, actual: 1150, savings: 100 },
    { week: 'Week 4', planned: 1250, actual: 1350, savings: -100 }
  ];

  const goalProgressData = budgetGoals.map(goal => ({
    name: goal.title,
    progress: (goal.currentAmount / goal.targetAmount) * 100,
    current: goal.currentAmount,
    target: goal.targetAmount,
    fill: goal.priority === 'high' ? 'hsl(217, 91%, 60%)' : 
          goal.priority === 'medium' ? 'hsl(38, 92%, 50%)' : 'hsl(142, 71%, 45%)'
  }));

  const getBudgetStatusColor = (category: BudgetCategory) => {
    if (category.remaining < 0) return 'text-destructive';
    if (category.remaining < category.budgeted * 0.2) return 'text-warning';
    return 'text-success';
  };

  const getBudgetStatusIcon = (category: BudgetCategory) => {
    if (category.remaining < 0) return <AlertTriangle className="h-4 w-4 text-destructive" />;
    if (category.remaining < category.budgeted * 0.2) return <TrendingDown className="h-4 w-4 text-warning" />;
    return <CheckCircle2 className="h-4 w-4 text-success" />;
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const addNewCategory = () => {
    const newCategory: BudgetCategory = {
      id: Date.now().toString(),
      name: 'New Category',
      budgeted: 0,
      spent: 0,
      remaining: 0,
      type: 'lifestyle',
      color: 'hsl(217, 91%, 60%)',
      icon: '📦',
      isRecurring: false
    };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<BudgetCategory>) => {
    setCategories(categories.map(cat => 
      cat.id === id 
        ? { 
            ...cat, 
            ...updates, 
            remaining: (updates.budgeted !== undefined ? updates.budgeted : cat.budgeted) - cat.spent 
          }
        : cat
    ));
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const applyBudgetTemplate = (template: BudgetTemplate) => {
    const newCategories = template.categories.map((cat, index) => ({
      ...cat,
      id: Date.now().toString() + index,
      spent: 0,
      remaining: cat.budgeted
    }));
    setCategories(newCategories);
  };

  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-muted/40 p-4 md:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-bold text-gradient-primary ">
              Budget Planner
            </h1>
            
            <p className="text-lg text-muted-foreground font-medium">
              Take control of your finances with smart budget planning
            </p>
          </div>
          
          {/* Budget Overview Card */}
          <Card className="w-full lg:w-auto border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-primary">${totalBudget.toLocaleString()}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{budgetPeriod} Budget</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Utilization</span>
                    <span className={budgetUtilization > 100 ? 'text-destructive' : 'text-muted-foreground'}>
                      {budgetUtilization.toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(budgetUtilization, 100)} 
                    className={`h-2 ${budgetUtilization > 100 ? 'progress-destructive' : ''}`}
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditingBudget(true)}
                  className="flex items-center space-x-1"
                >
                  <Edit3 className="h-3 w-3" />
                  <span>Edit Budget</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </header>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Budgeted
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                ${totalBudgeted.toLocaleString()}
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>This {budgetPeriod.slice(0, -2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Spent
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalSpent > totalBudgeted ? 'text-destructive' : 'text-foreground'}`}>
                ${totalSpent.toLocaleString()}
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                {totalSpent > totalBudgeted ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-destructive" />
                    <span className="text-destructive">Over budget</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-success" />
                    <span className="text-success">On track</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Remaining
              </CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalRemaining < 0 ? 'text-destructive' : 'text-success'}`}>
                ${Math.abs(totalRemaining).toLocaleString()}
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                {totalRemaining < 0 ? (
                  <>
                    <AlertTriangle className="h-3 w-3 text-destructive" />
                    <span className="text-destructive">Overspent</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 text-success" />
                    <span className="text-success">Available</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Goals
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {budgetGoals.filter(goal => !goal.isCompleted).length}
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3 w-3 text-success" />
                <span>{budgetGoals.filter(goal => goal.isCompleted).length} completed</span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Main Content */}
        <Tabs defaultValue="categories" className="space-y-6">
          <TabsList className="grid w-full lg:w-[600px] grid-cols-4">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          {/* Budget Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Budget Categories</h2>
                <p className="text-muted-foreground">Manage your spending categories and allocations</p>
              </div>
              <Button onClick={addNewCategory} className="flex items-center space-x-2">
                <PlusCircle className="h-4 w-4" />
                <span>Add Category</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Categories List */}
              <div className="lg:col-span-2 space-y-4">
                {categories.map((category) => (
                  <Card key={category.id} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{category.icon}</div>
                          <div>
                            <h3 className="font-semibold text-lg">{category.name}</h3>
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getBudgetStatusIcon(category)}
                          <Badge variant="outline" className="capitalize">
                            {category.type}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-primary">
                              ${category.budgeted}
                            </div>
                            <div className="text-xs text-muted-foreground">Budgeted</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold">
                              ${category.spent}
                            </div>
                            <div className="text-xs text-muted-foreground">Spent</div>
                          </div>
                          <div>
                            <div className={`text-lg font-bold ${getBudgetStatusColor(category)}`}>
                              ${Math.abs(category.remaining)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {category.remaining < 0 ? 'Over' : 'Remaining'}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span className={category.remaining < 0 ? 'text-destructive' : 'text-muted-foreground'}>
                              {((category.spent / category.budgeted) * 100).toFixed(0)}%
                            </span>
                          </div>
                          <Progress 
                            value={Math.min((category.spent / category.budgeted) * 100, 100)} 
                            className={`h-2 ${category.remaining < 0 ? 'progress-destructive' : ''}`}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {category.isRecurring && (
                              <Badge variant="secondary" className="text-xs">
                                Recurring
                              </Badge>
                            )}
                            {category.frequency && (
                              <Badge variant="outline" className="text-xs capitalize">
                                {category.frequency}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {/* Handle edit */}}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => deleteCategory(category.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Category Breakdown Chart */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Category Breakdown</CardTitle>
                    <CardDescription>Budget allocation by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={categoryBreakdownData}
                          dataKey="budgeted"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          paddingAngle={2}
                        >
                          {categoryBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`$${value}`, 'Budgeted']}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Expenses</CardTitle>
                    <CardDescription>Latest transactions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentExpenses.slice(0, 5).map((expense) => {
                      const category = categories.find(cat => cat.id === expense.categoryId);
                      return (
                        <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="text-lg">{category?.icon || '💳'}</div>
                            <div>
                              <div className="font-medium text-sm">{expense.description}</div>
                              <div className="text-xs text-muted-foreground">
                                {expense.merchant} • {expense.date}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-sm">${expense.amount}</div>
                            {expense.isRecurring && (
                              <Badge variant="outline" className="text-xs">
                                Recurring
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Budget Analytics</h2>
              <p className="text-muted-foreground">Insights into your spending patterns and trends</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Spending Trend */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Spending Trend</CardTitle>
                  <CardDescription>Planned vs actual spending over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={spendingTrendData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="week" 
                        className="text-muted-foreground"
                        fontSize={12}
                      />
                      <YAxis className="text-muted-foreground" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="planned" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        name="Planned"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="actual" 
                        stroke="hsl(var(--destructive))" 
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        name="Actual"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Budget vs Actual */}
              <Card>
                <CardHeader>
                  <CardTitle>Budget vs Actual</CardTitle>
                  <CardDescription>Category comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryBreakdownData.slice(0, 5)}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="name" 
                        className="text-muted-foreground"
                        fontSize={10}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis className="text-muted-foreground" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="budgeted" fill="hsl(var(--primary))" name="Budgeted" />
                      <Bar dataKey="spent" fill="hsl(var(--secondary))" name="Spent" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Budget Health Score */}
              <Card>
                <CardHeader>
                  <CardTitle>Budget Health</CardTitle>
                  <CardDescription>Overall budget performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {(100 - Math.max(0, budgetUtilization - 100)).toFixed(0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Health Score</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Categories on track</span>
                      <span className="text-sm font-medium">
                        {categories.filter(cat => cat.remaining >= 0).length}/{categories.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average utilization</span>
                      <span className="text-sm font-medium">{budgetUtilization.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Categories overspent</span>
                      <span className="text-sm font-medium text-destructive">
                        {categories.filter(cat => cat.remaining < 0).length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Financial Goals</h2>
                <p className="text-muted-foreground">Track your progress toward financial milestones</p>
              </div>
              <Button className="flex items-center space-x-2">
                <PlusCircle className="h-4 w-4" />
                <span>Add Goal</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Goals List */}
              <div className="lg:col-span-2 space-y-4">
                {budgetGoals.map((goal) => (
                  <Card key={goal.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{goal.title}</h3>
                          <p className="text-sm text-muted-foreground">Target: {goal.targetDate}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getPriorityBadgeColor(goal.priority)} className="capitalize">
                            {goal.priority}
                          </Badge>
                          {goal.isCompleted && (
                            <CheckCircle2 className="h-5 w-5 text-success" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Progress</span>
                          <span className="text-sm font-medium">
                            ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                          </span>
                        </div>
                        
                        <Progress 
                          value={(goal.currentAmount / goal.targetAmount) * 100} 
                          className="h-3"
                        />
                        
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">
                            {((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}% complete
                          </span>
                          <span className="font-medium text-primary">
                            ${(goal.targetAmount - goal.currentAmount).toLocaleString()} remaining
                          </span>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="capitalize">
                          {goal.category}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Goals Progress Chart */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Goal Progress</CardTitle>
                    <CardDescription>Visual progress overview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <RadialBarChart 
                        data={goalProgressData} 
                        innerRadius={20} 
                        outerRadius={80}
                      >
                        <RadialBar
                          dataKey="progress"
                          cornerRadius={10}
                          fill="hsl(var(--primary))"
                        />
                        <Tooltip 
                          formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Progress']}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Goal Summary</CardTitle>
                    <CardDescription>Quick overview</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {budgetGoals.filter(goal => !goal.isCompleted).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Active Goals</div>
                    </div>
                    
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-success">
                        ${budgetGoals.reduce((sum, goal) => sum + goal.currentAmount, 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Saved</div>
                    </div>
                    
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold">
                        ${budgetGoals.reduce((sum, goal) => sum + goal.targetAmount, 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Target</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Budget Templates</h2>
              <p className="text-muted-foreground">Get started with proven budgeting strategies</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgetTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Includes:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {template.categories.slice(0, 4).map((cat, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <span>{cat.icon}</span>
                            <span className="truncate">{cat.name}</span>
                          </div>
                        ))}
                      </div>
                      {template.categories.length > 4 && (
                        <div className="text-xs text-muted-foreground">
                          +{template.categories.length - 4} more categories
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => applyBudgetTemplate(template)}
                    >
                      Apply Template
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {/* Custom Template Card */}
              <Card className="border-dashed border-2 hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <PlusCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Create Custom Template</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Build your own budget template
                  </p>
                  <Button variant="outline">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </>
  );
};

export default BudgetPlanner;
