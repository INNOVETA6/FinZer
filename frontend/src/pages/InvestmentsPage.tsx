// components/InvestmentsPage.tsx
import React, { useState, useEffect } from 'react';
import Header from '@/components/Navbar';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  TrendingUp,
  TrendingDown,
  Target,
  PieChart as PieChartIcon,
  BarChart3,
  Plus,
  Minus,
  Edit3,
  Trash2,
  RefreshCw,
  DollarSign,
  Percent,
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Search,
  Download,
  Upload,
  Settings,
  Bell,
  Star,
  ExternalLink
} from 'lucide-react';

// Types
interface Investment {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  averageCost: number;
  currentPrice: number;
  marketValue: number;
  dayChange: number;
  dayChangePercent: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  sector: string;
  assetType: 'stock' | 'etf' | 'bond' | 'crypto' | 'mutual_fund';
  dividendYield?: number;
  peRatio?: number;
  marketCap?: number;
  lastUpdated: string;
  isWatchlisted: boolean;
}

interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  dayChange: number;
  dayChangePercent: number;
  cashBalance: number;
  diversificationScore: number;
}

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'dividend';
  symbol: string;
  shares: number;
  price: number;
  amount: number;
  date: string;
  fees?: number;
}

interface MarketIndex {
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
}

interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  alerts: {
    enabled: boolean;
    priceTarget?: number;
    type: 'above' | 'below';
  };
}

const InvestmentsPage: React.FC = () => {
  // State management
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary>({
    totalValue: 125750.50,
    totalCost: 108500.00,
    totalGainLoss: 17250.50,
    totalGainLossPercent: 15.9,
    dayChange: -2145.30,
    dayChangePercent: -1.68,
    cashBalance: 8450.75,
    diversificationScore: 82
  });

  const [investments, setInvestments] = useState<Investment[]>([
    {
      id: '1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      shares: 50,
      averageCost: 165.75,
      currentPrice: 185.92,
      marketValue: 9296.00,
      dayChange: -92.50,
      dayChangePercent: -0.98,
      totalGainLoss: 1008.50,
      totalGainLossPercent: 12.16,
      sector: 'Technology',
      assetType: 'stock',
      dividendYield: 0.52,
      peRatio: 28.4,
      marketCap: 2890000000000,
      lastUpdated: '2025-10-03T15:30:00Z',
      isWatchlisted: true
    },
    {
      id: '2',
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      shares: 35,
      averageCost: 285.40,
      currentPrice: 312.85,
      marketValue: 10949.75,
      dayChange: -175.35,
      dayChangePercent: -1.58,
      totalGainLoss: 960.75,
      totalGainLossPercent: 9.61,
      sector: 'Technology',
      assetType: 'stock',
      dividendYield: 0.72,
      peRatio: 32.1,
      marketCap: 2350000000000,
      lastUpdated: '2025-10-03T15:30:00Z',
      isWatchlisted: false
    },
    {
      id: '3',
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      shares: 25,
      averageCost: 128.90,
      currentPrice: 142.65,
      marketValue: 3566.25,
      dayChange: -71.25,
      dayChangePercent: -1.96,
      totalGainLoss: 343.75,
      totalGainLossPercent: 10.66,
      sector: 'Technology',
      assetType: 'stock',
      peRatio: 26.8,
      marketCap: 1800000000000,
      lastUpdated: '2025-10-03T15:30:00Z',
      isWatchlisted: true
    },
    {
      id: '4',
      symbol: 'SPY',
      name: 'SPDR S&P 500 ETF',
      shares: 100,
      averageCost: 425.30,
      currentPrice: 448.75,
      marketValue: 44875.00,
      dayChange: -675.00,
      dayChangePercent: -1.48,
      totalGainLoss: 2345.00,
      totalGainLossPercent: 5.52,
      sector: 'Diversified',
      assetType: 'etf',
      dividendYield: 1.28,
      lastUpdated: '2025-10-03T15:30:00Z',
      isWatchlisted: false
    },
    {
      id: '5',
      symbol: 'BTC-USD',
      name: 'Bitcoin',
      shares: 0.5,
      averageCost: 45000.00,
      currentPrice: 52350.00,
      marketValue: 26175.00,
      dayChange: -1050.00,
      dayChangePercent: -3.85,
      totalGainLoss: 3675.00,
      totalGainLossPercent: 16.33,
      sector: 'Cryptocurrency',
      assetType: 'crypto',
      lastUpdated: '2025-10-03T15:30:00Z',
      isWatchlisted: true
    }
  ]);

  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'buy',
      symbol: 'AAPL',
      shares: 10,
      price: 185.92,
      amount: 1859.20,
      date: '2025-10-01',
      fees: 1.00
    },
    {
      id: '2',
      type: 'sell',
      symbol: 'MSFT',
      shares: 5,
      price: 315.20,
      amount: 1576.00,
      date: '2025-09-28',
      fees: 1.00
    },
    {
      id: '3',
      type: 'dividend',
      symbol: 'SPY',
      shares: 100,
      price: 1.28,
      amount: 128.00,
      date: '2025-09-25'
    }
  ]);

  const [marketIndices, setMarketIndices] = useState<MarketIndex[]>([
    {
      name: 'S&P 500',
      symbol: 'SPX',
      value: 4485.25,
      change: -67.30,
      changePercent: -1.48
    },
    {
      name: 'Dow Jones',
      symbol: 'DJI',
      value: 33875.40,
      change: -425.15,
      changePercent: -1.24
    },
    {
      name: 'NASDAQ',
      symbol: 'IXIC',
      value: 14125.85,
      change: -285.75,
      changePercent: -1.98
    }
  ]);

  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([
    {
      id: '1',
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      price: 242.68,
      change: -8.45,
      changePercent: -3.36,
      alerts: { enabled: true, priceTarget: 250, type: 'above' }
    },
    {
      id: '2',
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      price: 435.20,
      change: 12.35,
      changePercent: 2.92,
      alerts: { enabled: false, priceTarget: 450, type: 'below' }
    }
  ]);

  const [selectedTimeframe, setSelectedTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL'>('1D');
  const [showBalances, setShowBalances] = useState<boolean>(true);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  // Chart data
  const portfolioPerformanceData = [
    { date: '2025-09-01', value: 118500, benchmark: 115000 },
    { date: '2025-09-08', value: 121200, benchmark: 117500 },
    { date: '2025-09-15', value: 119800, benchmark: 116800 },
    { date: '2025-09-22', value: 123400, benchmark: 119200 },
    { date: '2025-09-29', value: 127900, benchmark: 121800 },
    { date: '2025-10-03', value: 125750, benchmark: 120500 }
  ];

  const assetAllocationData = [
    { name: 'Stocks', value: 65, amount: 81737.50, color: 'hsl(217, 91%, 60%)' },
    { name: 'ETFs', value: 20, amount: 25150.00, color: 'hsl(142, 71%, 45%)' },
    { name: 'Crypto', value: 10, amount: 12575.00, color: 'hsl(258, 90%, 66%)' },
    { name: 'Cash', value: 5, amount: 6287.50, color: 'hsl(173, 80%, 40%)' }
  ];

  const sectorAllocationData = [
    { name: 'Technology', value: 45, color: 'hsl(217, 91%, 60%)' },
    { name: 'Healthcare', value: 15, color: 'hsl(142, 71%, 45%)' },
    { name: 'Finance', value: 12, color: 'hsl(258, 90%, 66%)' },
    { name: 'Consumer', value: 18, color: 'hsl(173, 80%, 40%)' },
    { name: 'Other', value: 10, color: 'hsl(38, 92%, 50%)' }
  ];

  const performanceMetricsData = [
    { period: '1D', portfolio: -1.68, benchmark: -1.45 },
    { period: '1W', portfolio: 2.15, benchmark: 1.85 },
    { period: '1M', portfolio: 4.85, benchmark: 3.92 },
    { period: '3M', portfolio: 12.45, benchmark: 9.87 },
    { period: '1Y', portfolio: 18.75, benchmark: 15.23 },
    { period: 'All', portfolio: 15.9, benchmark: 12.8 }
  ];

  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toFixed(2)}`;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUpRight className="h-4 w-4 text-success" />;
    if (change < 0) return <ArrowDownRight className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getAssetTypeIcon = (assetType: string) => {
    switch (assetType) {
      case 'stock': return '📈';
      case 'etf': return '🏛️';
      case 'bond': return '🏦';
      case 'crypto': return '₿';
      case 'mutual_fund': return '💼';
      default: return '📊';
    }
  };

  return (
    <>
      <Header   />
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-muted/40 p-4 md:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-bold text-gradient-primary">
              Investment Portfolio
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              Track, analyze, and optimize your investment performance
            </p>
          </div>
          
          {/* Portfolio Summary Card */}
          <Card className="w-full lg:w-auto border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6 text-center lg:text-left">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold text-primary">
                    {showBalances ? formatCurrency(portfolioSummary.totalValue) : '••••••'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Gain/Loss</p>
                  <p className={`text-2xl font-bold ${getChangeColor(portfolioSummary.totalGainLoss)}`}>
                    {showBalances ? (
                      <>
                        {formatCurrency(portfolioSummary.totalGainLoss)}
                        <span className="text-sm ml-1">
                          ({formatPercent(portfolioSummary.totalGainLossPercent)})
                        </span>
                      </>
                    ) : '••••••'}
                  </p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBalances(!showBalances)}
                  >
                    {showBalances ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  {getChangeIcon(portfolioSummary.dayChange)}
                  <span className={getChangeColor(portfolioSummary.dayChange)}>
                    {formatCurrency(Math.abs(portfolioSummary.dayChange))} today
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </header>

        {/* Market Indices */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {marketIndices.map((index, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">{index.name}</h3>
                    <p className="text-lg font-bold">{index.value.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      {getChangeIcon(index.change)}
                      <span className={`text-sm font-medium ${getChangeColor(index.change)}`}>
                        {formatCurrency(Math.abs(index.change))}
                      </span>
                    </div>
                    <p className={`text-xs ${getChangeColor(index.change)}`}>
                      {formatPercent(index.changePercent)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full lg:w-[600px] grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Portfolio Performance Chart */}
              <Card className="xl:col-span-2 hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        <span>Portfolio Performance</span>
                      </CardTitle>
                      <CardDescription>Portfolio vs benchmark comparison</CardDescription>
                    </div>
                    <Select value={selectedTimeframe} onValueChange={(value: any) => setSelectedTimeframe(value)}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1D">1D</SelectItem>
                        <SelectItem value="1W">1W</SelectItem>
                        <SelectItem value="1M">1M</SelectItem>
                        <SelectItem value="3M">3M</SelectItem>
                        <SelectItem value="1Y">1Y</SelectItem>
                        <SelectItem value="ALL">ALL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={portfolioPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="date" 
                        className="text-muted-foreground"
                        fontSize={12}
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <YAxis 
                        className="text-muted-foreground" 
                        fontSize={12}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                      />
                      <Tooltip 
                        formatter={(value: any, name: string) => [formatCurrency(value), name]}
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
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
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.6}
                        name="Portfolio"
                      />
                      <Area
                        type="monotone"
                        dataKey="benchmark"
                        stroke="hsl(var(--muted-foreground))"
                        fill="hsl(var(--muted-foreground))"
                        fillOpacity={0.3}
                        name="S&P 500"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Asset Allocation */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChartIcon className="h-5 w-5 text-primary" />
                    <span>Asset Allocation</span>
                  </CardTitle>
                  <CardDescription>Portfolio distribution by asset type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={assetAllocationData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        paddingAngle={2}
                      >
                        {assetAllocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any, name: string) => [`${value}%`, name]}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-4">
                    {assetAllocationData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span>{item.name}</span>
                        </div>
                        <div className="font-medium">
                          {item.value}% • {formatCurrency(item.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Comparison</CardTitle>
                <CardDescription>Portfolio vs S&P 500 benchmark across different periods</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={performanceMetricsData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="period" className="text-muted-foreground" fontSize={12} />
                    <YAxis className="text-muted-foreground" fontSize={12} />
                    <Tooltip 
                      formatter={(value: any, name: string) => [`${value}%`, name]}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Legend />
                    <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />
                    <Bar dataKey="portfolio" fill="hsl(var(--primary))" name="Portfolio" />
                    <Bar dataKey="benchmark" fill="hsl(var(--muted-foreground))" name="S&P 500" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Sector Allocation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sector Allocation</CardTitle>
                  <CardDescription>Portfolio distribution by sectors</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={sectorAllocationData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                      >
                        {sectorAllocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any, name: string) => [`${value}%`, name]}
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

              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Analytics</CardTitle>
                  <CardDescription>Key portfolio metrics and insights</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {portfolioSummary.diversificationScore}
                      </div>
                      <div className="text-sm text-muted-foreground">Diversification Score</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold">
                        {investments.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Holdings</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Risk Level</span>
                      <Badge variant="secondary">Moderate</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Beta</span>
                      <span className="font-medium">1.15</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
                      <span className="font-medium">1.82</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Volatility</span>
                      <span className="font-medium">18.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Holdings Tab */}
          <TabsContent value="holdings" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Investment Holdings</h2>
                <p className="text-muted-foreground">Detailed view of your investment positions</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Position
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {investments.map((investment) => (
                <Card key={investment.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">
                          {getAssetTypeIcon(investment.assetType)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-bold text-lg">{investment.symbol}</h3>
                            {investment.isWatchlisted && (
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            )}
                            <Badge variant="outline" className="capitalize">
                              {investment.assetType}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{investment.name}</p>
                          <p className="text-xs text-muted-foreground">{investment.sector}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          {getChangeIcon(investment.dayChange)}
                          <span className={`font-bold ${getChangeColor(investment.dayChange)}`}>
                            {formatCurrency(Math.abs(investment.dayChange))}
                          </span>
                        </div>
                        <p className={`text-sm ${getChangeColor(investment.dayChange)}`}>
                          {formatPercent(investment.dayChangePercent)} today
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Shares</p>
                        <p className="font-semibold">{investment.shares.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Current Price</p>
                        <p className="font-semibold">{formatCurrency(investment.currentPrice)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Market Value</p>
                        <p className="font-semibold">{formatCurrency(investment.marketValue)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg Cost</p>
                        <p className="font-semibold">{formatCurrency(investment.averageCost)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Gain/Loss</p>
                        <p className={`font-semibold ${getChangeColor(investment.totalGainLoss)}`}>
                          {formatCurrency(investment.totalGainLoss)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Return %</p>
                        <p className={`font-semibold ${getChangeColor(investment.totalGainLoss)}`}>
                          {formatPercent(investment.totalGainLossPercent)}
                        </p>
                      </div>
                    </div>

                    {investment.dividendYield && (
                      <div className="mt-4 flex items-center space-x-4 text-sm">
                        <Badge variant="secondary">
                          Dividend Yield: {investment.dividendYield}%
                        </Badge>
                        {investment.peRatio && (
                          <Badge variant="outline">
                            P/E: {investment.peRatio}
                          </Badge>
                        )}
                        {investment.marketCap && (
                          <Badge variant="outline">
                            Market Cap: {formatMarketCap(investment.marketCap)}
                          </Badge>
                        )}
                      </div>
                    )}

                    <Separator className="my-4" />

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        Last updated: {new Date(investment.lastUpdated).toLocaleString()}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
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
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Performance Analysis</h2>
              <p className="text-muted-foreground">Detailed performance metrics and analytics</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>Best performing investments by return %</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {investments
                    .sort((a, b) => b.totalGainLossPercent - a.totalGainLossPercent)
                    .slice(0, 5)
                    .map((investment, index) => (
                      <div key={investment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold">{investment.symbol}</div>
                            <div className="text-sm text-muted-foreground">{investment.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${getChangeColor(investment.totalGainLoss)}`}>
                            {formatPercent(investment.totalGainLossPercent)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatCurrency(investment.totalGainLoss)}
                          </div>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Worst Performers</CardTitle>
                  <CardDescription>Investments that need attention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {investments
                    .sort((a, b) => a.totalGainLossPercent - b.totalGainLossPercent)
                    .slice(0, 5)
                    .map((investment, index) => (
                      <div key={investment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold">{investment.symbol}</div>
                            <div className="text-sm text-muted-foreground">{investment.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${getChangeColor(investment.totalGainLoss)}`}>
                            {formatPercent(investment.totalGainLossPercent)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatCurrency(investment.totalGainLoss)}
                          </div>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Watchlist Tab */}
          <TabsContent value="watchlist" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Watchlist</h2>
                <p className="text-muted-foreground">Monitor stocks and set price alerts</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add to Watchlist
              </Button>
            </div>

            <div className="space-y-4">
              {watchlist.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-bold text-lg">{item.symbol}</h3>
                          <p className="text-sm text-muted-foreground">{item.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">{formatCurrency(item.price)}</div>
                        <div className="flex items-center space-x-1">
                          {getChangeIcon(item.change)}
                          <span className={`text-sm ${getChangeColor(item.change)}`}>
                            {formatCurrency(Math.abs(item.change))} ({formatPercent(item.changePercent)})
                          </span>
                        </div>
                      </div>
                    </div>

                    {item.alerts.enabled && (
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Bell className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Price Alert</span>
                          </div>
                          <Badge variant="secondary">
                            Alert when {item.alerts.type} {formatCurrency(item.alerts.priceTarget!)}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Transaction History</h2>
                <p className="text-muted-foreground">Complete record of your investment activities</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="p-4 font-medium">Date</th>
                        <th className="p-4 font-medium">Type</th>
                        <th className="p-4 font-medium">Symbol</th>
                        <th className="p-4 font-medium">Shares</th>
                        <th className="p-4 font-medium">Price</th>
                        <th className="p-4 font-medium">Amount</th>
                        <th className="p-4 font-medium">Fees</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b hover:bg-muted/50">
                          <td className="p-4">{new Date(transaction.date).toLocaleDateString()}</td>
                          <td className="p-4">
                            <Badge 
                              variant={transaction.type === 'buy' ? 'default' : 
                                      transaction.type === 'sell' ? 'destructive' : 'secondary'}
                              className="capitalize"
                            >
                              {transaction.type}
                            </Badge>
                          </td>
                          <td className="p-4 font-medium">{transaction.symbol}</td>
                          <td className="p-4">{transaction.shares.toLocaleString()}</td>
                          <td className="p-4">{formatCurrency(transaction.price)}</td>
                          <td className="p-4 font-medium">{formatCurrency(transaction.amount)}</td>
                          <td className="p-4">{transaction.fees ? formatCurrency(transaction.fees) : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </>
  );
};

export default InvestmentsPage;
