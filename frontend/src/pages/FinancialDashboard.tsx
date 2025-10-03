// components/FinancialDashboard.tsx
import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import Header from '../components/Navbar';
import FinancialChatbot from '@/components/FinancialChatbot';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  PiggyBank,
  Target,
  BookOpen,
  BarChart3,
  Users,
  Award,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface FinancialData {
  monthlyIncome: number;
  monthlyExpenses: number;
  savings: number;
  investments: number;
  debts: number;
  financialLiteracyScore: number;
}

interface BudgetCategory {
  name: string;
  allocated: number;
  spent: number;
  category: string;
}

interface LearningModule {
  id: string;
  title: string;
  description: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const FinancialDashboard: React.FC = () => {
  const [financialData] = useState<FinancialData>({
    monthlyIncome: 5000,
    monthlyExpenses: 3200,
    savings: 15000,
    investments: 8500,
    debts: 4200,
    financialLiteracyScore: 72
  });

  const [budgetCategories] = useState<BudgetCategory[]>([
    { name: 'Housing', allocated: 1500, spent: 1450, category: 'Essential' },
    { name: 'Food', allocated: 600, spent: 680, category: 'Essential' },
    { name: 'Transportation', allocated: 400, spent: 350, category: 'Essential' },
    { name: 'Entertainment', allocated: 300, spent: 420, category: 'Lifestyle' },
    { name: 'Healthcare', allocated: 200, spent: 180, category: 'Essential' },
    { name: 'Education', allocated: 250, spent: 200, category: 'Investment' }
  ]);

  const [learningModules] = useState<LearningModule[]>([
    {
      id: '1',
      title: 'Budgeting Fundamentals',
      description: 'Master the art of creating and maintaining effective budgets',
      progress: 75,
      totalLessons: 8,
      completedLessons: 6,
      icon: '🎯',
      difficulty: 'Beginner'
    },
    {
      id: '2',
      title: 'Credit & Debt Management',
      description: 'Understanding credit scores and debt reduction strategies',
      progress: 45,
      totalLessons: 10,
      completedLessons: 4,
      icon: '💳',
      difficulty: 'Intermediate'
    },
    {
      id: '3',
      title: 'Investment Basics',
      description: 'Introduction to investing and portfolio diversification',
      progress: 20,
      totalLessons: 12,
      completedLessons: 2,
      icon: '📈',
      difficulty: 'Intermediate'
    },
    {
      id: '4',
      title: 'Financial Planning',
      description: 'Long-term financial planning and retirement strategies',
      progress: 10,
      totalLessons: 15,
      completedLessons: 1,
      icon: '🏠',
      difficulty: 'Advanced'
    }
  ]);

  // Sample data for charts
  const incomeExpenseData = [
    { month: 'Jan', income: 4800, expenses: 3100, savings: 1700 },
    { month: 'Feb', income: 5200, expenses: 3400, savings: 1800 },
    { month: 'Mar', income: 4900, expenses: 3000, savings: 1900 },
    { month: 'Apr', income: 5300, expenses: 3500, savings: 1800 },
    { month: 'May', income: 5100, expenses: 3300, savings: 1800 },
    { month: 'Jun', income: 5000, expenses: 3200, savings: 1800 }
  ];

  const savingsGoalData = [
    { name: 'Emergency Fund', value: 35, amount: 5250, color: 'hsl(var(--chart-1))' },
    { name: 'House Down Payment', value: 25, amount: 3750, color: 'hsl(var(--chart-2))' },
    { name: 'Retirement', value: 20, amount: 3000, color: 'hsl(var(--chart-3))' },
    { name: 'Vacation', value: 15, amount: 2250, color: 'hsl(var(--chart-4))' },
    { name: 'Education', value: 5, amount: 750, color: 'hsl(var(--chart-5))' }
  ];

  const budgetComparisonData = budgetCategories.map(cat => ({
    category: cat.name,
    allocated: cat.allocated,
    spent: cat.spent,
    remaining: Math.max(0, cat.allocated - cat.spent),
    overspent: Math.max(0, cat.spent - cat.allocated)
  }));

  const financialHealthData = [
    { score: '0-25', label: 'Poor', value: 10, color: 'hsl(var(--destructive))' },
    { score: '26-50', label: 'Fair', value: 30, color: 'hsl(var(--warning))' },
    { score: '51-75', label: 'Good', value: 35, color: 'hsl(var(--chart-3))' },
    { score: '76-100', label: 'Excellent', value: 25, color: 'hsl(var(--chart-1))' }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const calculateNetWorth = () => {
    return financialData.savings + financialData.investments - financialData.debts;
  };

  const calculateSavingsRate = () => {
    return ((financialData.monthlyIncome - financialData.monthlyExpenses) / financialData.monthlyIncome * 100).toFixed(1);
  };

  return (
    <>
    <Header />

    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-muted/40 p-4 md:p-6 lg:p-8 font-sans">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Financial Wellness Dashboard
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              Empowering your journey to financial literacy and independence
            </p>
          </div>
          
          {/* Financial Health Score */}
          <Card className="w-full lg:w-auto border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-primary/60 p-1">
                  <div className="w-full h-full bg-background rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {financialData.financialLiteracyScore}
                    </span>
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-sm text-muted-foreground">Financial Health Score</h3>
              <Badge variant="secondary" className="mt-2">
                {financialData.financialLiteracyScore >= 75 ? 'Excellent' : 
                 financialData.financialLiteracyScore >= 50 ? 'Good' : 'Needs Improvement'}
              </Badge>
            </CardContent>
          </Card>
        </header>

        {/* Key Metrics Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Income
              </CardTitle>
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                ${financialData.monthlyIncome.toLocaleString()}
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <ArrowUpRight className="h-3 w-3 text-green-600" />
                <span>+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-red-200 dark:border-red-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Expenses
              </CardTitle>
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <CreditCard className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700 dark:text-red-400">
                ${financialData.monthlyExpenses.toLocaleString()}
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <ArrowDownRight className="h-3 w-3 text-red-600" />
                <span>-5% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Savings
              </CardTitle>
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <PiggyBank className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                ${financialData.savings.toLocaleString()}
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <ArrowUpRight className="h-3 w-3 text-blue-600" />
                <span>Savings Rate: {calculateSavingsRate()}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-purple-200 dark:border-purple-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Net Worth
              </CardTitle>
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                ${calculateNetWorth().toLocaleString()}
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <ArrowUpRight className="h-3 w-3 text-purple-600" />
                <span>+8% from last quarter</span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Charts Section */}
        <section className="space-y-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full lg:w-[600px] grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="budget">Budget</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Income vs Expenses Trend */}
                <Card className="xl:col-span-2 hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <span>Income vs Expenses Trend</span>
                    </CardTitle>
                    <CardDescription>
                      Monthly comparison over the last 6 months
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={incomeExpenseData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="month" 
                          className="text-muted-foreground"
                          fontSize={12}
                        />
                        <YAxis 
                          className="text-muted-foreground"
                          fontSize={12}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="income"
                          stackId="1"
                          stroke="hsl(var(--chart-1))"
                          fill="hsl(var(--chart-1))"
                          fillOpacity={0.6}
                          name="Income"
                        />
                        <Area
                          type="monotone"
                          dataKey="expenses"
                          stackId="2"
                          stroke="hsl(var(--chart-2))"
                          fill="hsl(var(--chart-2))"
                          fillOpacity={0.6}
                          name="Expenses"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Financial Health Distribution */}
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span>Population Comparison</span>
                    </CardTitle>
                    <CardDescription>
                      Where you stand financially
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={financialHealthData}
                          dataKey="value"
                          nameKey="label"
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={2}
                        >
                          {financialHealthData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="budget" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Budget Overview Chart */}
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle>Budget Overview</CardTitle>
                    <CardDescription>Allocated vs Actual Spending</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={budgetComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="category" 
                          className="text-muted-foreground"
                          fontSize={11}
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
                        <Bar dataKey="allocated" fill="hsl(var(--chart-1))" name="Allocated" />
                        <Bar dataKey="spent" fill="hsl(var(--chart-2))" name="Spent" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Budget Categories Breakdown */}
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle>Budget Categories</CardTitle>
                    <CardDescription>Detailed breakdown by category</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {budgetCategories.map((category, index) => {
                      const percentage = (category.spent / category.allocated) * 100;
                      const isOverBudget = percentage > 100;
                      
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                              <Badge variant="outline" className="text-xs">
                                {category.category}
                              </Badge>
                              <span className="font-medium text-sm">{category.name}</span>
                            </div>
                            <div className="text-right text-sm">
                              <div className={`font-semibold ${isOverBudget ? 'text-destructive' : 'text-muted-foreground'}`}>
                                ${category.spent} / ${category.allocated}
                              </div>
                              <div className={`text-xs ${isOverBudget ? 'text-destructive' : 'text-muted-foreground'}`}>
                                {percentage.toFixed(0)}%
                              </div>
                            </div>
                          </div>
                          <Progress 
                            value={Math.min(percentage, 100)} 
                            className={`h-2 ${isOverBudget ? 'progress-destructive' : ''}`}
                          />
                          {isOverBudget && (
                            <p className="text-xs text-destructive">
                              Over budget by ${(category.spent - category.allocated).toLocaleString()}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="goals" className="space-y-6">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span>Savings Goals Distribution</span>
                  </CardTitle>
                  <CardDescription>
                    Track your progress toward financial goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={savingsGoalData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          paddingAngle={2}
                        >
                          {savingsGoalData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name) => [`${value}%`, name]}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    <div className="space-y-4">
                      {savingsGoalData.map((goal, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium text-sm">{goal.name}</h4>
                            <p className="text-xs text-muted-foreground">{goal.value}% allocation</p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-sm">${goal.amount.toLocaleString()}</div>
                            <Badge variant="secondary" className="text-xs">
                              {goal.value >= 25 ? 'High Priority' : 
                               goal.value >= 15 ? 'Medium Priority' : 'Low Priority'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Monthly Financial Trend</CardTitle>
                  <CardDescription>Comprehensive view of your financial journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={incomeExpenseData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="month" 
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
                        dataKey="income" 
                        stroke="hsl(var(--chart-1))" 
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        name="Income"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="expenses" 
                        stroke="hsl(var(--chart-2))" 
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        name="Expenses"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="savings" 
                        stroke="hsl(var(--chart-3))" 
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        name="Monthly Savings"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Financial Literacy Modules */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Financial Literacy Modules</h2>
              <p className="text-muted-foreground">Build your financial knowledge step by step</p>
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>View All Courses</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningModules.map((module) => (
              <Card key={module.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="text-2xl">{module.icon}</div>
                    <Badge className={getDifficultyColor(module.difficulty)}>
                      {module.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">{module.title}</CardTitle>
                  <CardDescription className="text-sm line-clamp-2">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{module.completedLessons}/{module.totalLessons} lessons</span>
                      <span>{module.totalLessons - module.completedLessons} remaining</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    variant={module.progress > 0 ? "default" : "outline"}
                    size="sm"
                  >
                    {module.progress > 0 ? 'Continue Learning' : 'Start Module'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              className="h-16 text-left justify-start space-x-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" 
              size="lg"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-white/20 text-white">📝</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">Create Budget</div>
                <div className="text-xs opacity-90">Set up monthly budget</div>
              </div>
            </Button>

            <Button 
              className="h-16 text-left justify-start space-x-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700" 
              size="lg"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-white/20 text-white">🎯</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">Set Financial Goal</div>
                <div className="text-xs opacity-90">Define savings targets</div>
              </div>
            </Button>

            <Button 
              className="h-16 text-left justify-start space-x-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700" 
              size="lg"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-white/20 text-white">📚</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">Take Quiz</div>
                <div className="text-xs opacity-90">Test your knowledge</div>
              </div>
            </Button>

            <Button 
              className="h-16 text-left justify-start space-x-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700" 
              size="lg"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-white/20 text-white">🤝</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">Get Advice</div>
                <div className="text-xs opacity-90">Expert consultation</div>
              </div>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8">
          <Separator className="mb-6" />
          <div className="text-center space-y-2">
            <p className="text-muted-foreground font-medium">
              Building financial literacy for a better tomorrow
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <span>Privacy Policy</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Terms of Service</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Contact Support</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
    </>
  );
};

export default FinancialDashboard;
