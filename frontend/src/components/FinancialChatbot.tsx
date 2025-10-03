// components/FinancialChatbot.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Send,
  Bot,
  User,
  MessageSquare,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RefreshCw,
  TrendingUp,
  DollarSign,
  PiggyBank,
  Target,
  BookOpen,
  Calculator,
  BarChart3,
  Lightbulb,
  Clock,
  CheckCircle,
  AlertCircle,
  Minimize2,
  Maximize2,
  X
} from 'lucide-react';

// Types
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'action';
  metadata?: {
    suggestions?: string[];
    actions?: ChatAction[];
    confidence?: number;
  };
}

interface ChatAction {
  id: string;
  label: string;
  type: 'navigate' | 'calculate' | 'create' | 'learn';
  icon: React.ReactNode;
  action: () => void;
}

interface QuickSuggestion {
  id: string;
  text: string;
  category: 'budget' | 'investment' | 'savings' | 'learn';
  icon: React.ReactNode;
}

const FinancialChatbot: React.FC = () => {
  // State management
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your personal financial assistant. I can help you with budgeting, investment advice, savings goals, and financial education. How can I assist you today?",
      role: 'assistant',
      timestamp: new Date(),
      type: 'text',
      metadata: {
        suggestions: [
          "Help me create a budget",
          "What's a good savings rate?",
          "Explain compound interest",
          "Investment advice for beginners"
        ]
      }
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Quick suggestions for different categories
  const quickSuggestions: QuickSuggestion[] = [
    {
      id: '1',
      text: "Help me create a monthly budget",
      category: 'budget',
      icon: <Calculator className="h-4 w-4" />
    },
    {
      id: '2',
      text: "What's the 50/30/20 rule?",
      category: 'learn',
      icon: <BookOpen className="h-4 w-4" />
    },
    {
      id: '3',
      text: "How to start investing with $1000?",
      category: 'investment',
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      id: '4',
      text: "Calculate compound interest",
      category: 'savings',
      icon: <PiggyBank className="h-4 w-4" />
    },
    {
      id: '5',
      text: "Emergency fund guidelines",
      category: 'savings',
      icon: <Target className="h-4 w-4" />
    },
    {
      id: '6',
      text: "Explain risk tolerance",
      category: 'learn',
      icon: <BarChart3 className="h-4 w-4" />
    }
  ];

  // Predefined responses for common financial queries
  const getFinancialResponse = (query: string): { content: string; actions?: ChatAction[]; suggestions?: string[] } => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('budget') && (lowerQuery.includes('create') || lowerQuery.includes('make'))) {
      return {
        content: "I'd be happy to help you create a budget! A good budget typically follows the 50/30/20 rule:\n\n• **50%** for needs (housing, utilities, groceries)\n• **30%** for wants (entertainment, dining out)\n• **20%** for savings and debt repayment\n\nLet me help you set this up step by step.",
        actions: [
          {
            id: 'create-budget',
            label: 'Create Budget',
            type: 'navigate',
            icon: <Calculator className="h-4 w-4" />,
            action: () => console.log('Navigate to budget planner')
          },
          {
            id: 'calculate-expenses',
            label: 'Calculate Expenses',
            type: 'calculate',
            icon: <DollarSign className="h-4 w-4" />,
            action: () => console.log('Open expense calculator')
          }
        ],
        suggestions: [
          "What if my expenses exceed 50%?",
          "How to track spending automatically?",
          "Budget apps recommendations"
        ]
      };
    }

    if (lowerQuery.includes('50/30/20') || lowerQuery.includes('rule')) {
      return {
        content: "The **50/30/20 rule** is a simple budgeting framework:\n\n**🏠 50% - Needs (Essential expenses)**\n• Rent/mortgage\n• Utilities\n• Groceries\n• Transportation\n• Insurance\n\n**🎬 30% - Wants (Discretionary spending)**\n• Entertainment\n• Dining out\n• Hobbies\n• Shopping\n\n**💰 20% - Savings & Debt**\n• Emergency fund\n• Retirement savings\n• Debt payments\n• Investments\n\nThis rule provides a balanced approach to managing your money!",
        suggestions: [
          "How to calculate my 50/30/20 breakdown?",
          "What if my housing costs more than 50%?",
          "Alternative budgeting methods"
        ]
      };
    }

    if (lowerQuery.includes('invest') && lowerQuery.includes('1000')) {
      return {
        content: "Great question! Here's how to invest $1,000 wisely:\n\n**🎯 Beginner-Friendly Options:**\n• **Index Funds** - Diversified, low fees (VTI, VTIAX)\n• **Target-Date Funds** - Automatic rebalancing\n• **Robo-Advisors** - Betterment, Wealthfront\n• **High-Yield Savings** - Emergency fund first\n\n**📈 Steps to Start:**\n1. Emergency fund (3-6 months expenses)\n2. Pay off high-interest debt\n3. Start with broad market index funds\n4. Dollar-cost average monthly\n\nRemember: Time in market > Timing the market!",
        actions: [
          {
            id: 'investment-calculator',
            label: 'Investment Calculator',
            type: 'calculate',
            icon: <TrendingUp className="h-4 w-4" />,
            action: () => console.log('Open investment calculator')
          },
          {
            id: 'learn-investing',
            label: 'Learn Investing',
            type: 'learn',
            icon: <BookOpen className="h-4 w-4" />,
            action: () => console.log('Navigate to investment course')
          }
        ],
        suggestions: [
          "What's dollar-cost averaging?",
          "Best brokers for beginners?",
          "How to research stocks?"
        ]
      };
    }

    if (lowerQuery.includes('compound interest')) {
      return {
        content: "**Compound Interest** is the 8th wonder of the world! 🌟\n\n**Formula:** A = P(1 + r/n)^(nt)\n\n**Example:** \n• Initial: $1,000\n• Rate: 7% annually\n• Time: 30 years\n• Result: **$7,612**\n\nYour money grows exponentially because you earn interest on both your principal AND previous interest earned.\n\n**Key Insight:** Starting early makes a HUGE difference. Someone who invests $200/month from age 25-35 (just 10 years) will have more at retirement than someone who invests $200/month from age 35-65 (30 years)!",
        actions: [
          {
            id: 'compound-calculator',
            label: 'Compound Calculator',
            type: 'calculate',
            icon: <Calculator className="h-4 w-4" />,
            action: () => console.log('Open compound interest calculator')
          }
        ],
        suggestions: [
          "Calculate my retirement savings",
          "How often should I contribute?",
          "Best accounts for compound growth"
        ]
      };
    }

    if (lowerQuery.includes('emergency fund')) {
      return {
        content: "An **Emergency Fund** is your financial safety net! 🛡️\n\n**Guidelines:**\n• **3-6 months** of living expenses\n• **6-12 months** if self-employed\n• Keep in **high-yield savings** (liquid)\n• Separate from other savings goals\n\n**Building Strategy:**\n1. Start with $500-$1,000\n2. Save $25-50 per week\n3. Use windfalls (tax refunds, bonuses)\n4. Automate transfers\n\n**When to Use:**\n✅ Job loss\n✅ Medical emergencies\n✅ Major car repairs\n❌ Vacation\n❌ Shopping\n❌ Investments",
        actions: [
          {
            id: 'emergency-calculator',
            label: 'Calculate Emergency Fund',
            type: 'calculate',
            icon: <Target className="h-4 w-4" />,
            action: () => console.log('Open emergency fund calculator')
          }
        ],
        suggestions: [
          "Where to keep emergency fund?",
          "How to build fund faster?",
          "What counts as an emergency?"
        ]
      };
    }

    if (lowerQuery.includes('risk tolerance') || lowerQuery.includes('risk')) {
      return {
        content: "**Risk Tolerance** is your comfort level with investment volatility. 📊\n\n**🔵 Conservative (Low Risk)**\n• Bonds, CDs, high-yield savings\n• 20-30% stocks, 70-80% bonds\n• Lower returns, more stability\n\n**🟡 Moderate (Medium Risk)**\n• Balanced portfolio\n• 50-70% stocks, 30-50% bonds\n• Moderate growth potential\n\n**🔴 Aggressive (High Risk)**\n• Growth stocks, emerging markets\n• 80-100% stocks\n• Higher potential returns, more volatility\n\n**Factors to Consider:**\n• Age (younger = more aggressive)\n• Timeline (longer = more risk)\n• Financial situation\n• Sleep-at-night factor",
        suggestions: [
          "Risk tolerance questionnaire",
          "Asset allocation by age",
          "Rebalancing strategies"
        ]
      };
    }

    // Default response for unmatched queries
    return {
      content: "I'd be happy to help with that! I specialize in:\n\n💰 **Budgeting & Expenses**\n📈 **Investing & Portfolios** \n🎯 **Savings Goals**\n📚 **Financial Education**\n🧮 **Financial Calculators**\n\nCould you provide more details about what you'd like to know?",
      suggestions: [
        "Help me create a budget",
        "Investment advice for beginners", 
        "How to build an emergency fund",
        "Explain compound interest"
      ]
    };
  };

  // Handle sending messages
  const handleSendMessage = async (content: string = inputValue) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);
    setShowSuggestions(false);

    // Simulate AI processing time
    setTimeout(() => {
      const response = getFinancialResponse(content);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        role: 'assistant',
        timestamp: new Date(),
        type: 'text',
        metadata: {
          actions: response.actions,
          suggestions: response.suggestions,
          confidence: 0.95
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
      setIsTyping(false);
    }, 1500);
  };

  // Handle quick suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  // Copy message content
  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    // Add toast notification here
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  // Focus input when chat expands
  useEffect(() => {
    if (chatExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [chatExpanded]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'budget': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'investment': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'savings': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'learn': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!chatExpanded ? (
        /* Floating Chat Button */
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setChatExpanded(true)}
                className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Bot className="h-6 w-6 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Financial Assistant</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        /* Expanded Chat Interface */
        <Card className="w-96 h-[32rem] shadow-xl border-2 border-primary/20 bg-background">
          <CardHeader className="bg-gradient-to-r from-primary to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8 border-2 border-white/20">
                  <AvatarFallback className="bg-white/10 text-white">
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-white text-sm">Financial Assistant</CardTitle>
                  <CardDescription className="text-white/80 text-xs">
                    {isTyping ? 'Typing...' : 'Online • Ready to help'}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 text-white hover:bg-white/10"
                  onClick={() => setChatExpanded(false)}
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 text-white hover:bg-white/10"
                  onClick={() => setChatExpanded(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex flex-col h-full">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start space-x-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <Avatar className="h-6 w-6 mt-1">
                        <AvatarFallback className={message.role === 'user' ? 'bg-primary text-white' : 'bg-muted'}>
                          {message.role === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`group relative ${message.role === 'user' ? 'bg-primary text-white' : 'bg-muted'} rounded-lg p-3`}>
                        <div className="text-sm leading-relaxed whitespace-pre-line">
                          {message.content}
                        </div>
                        
                        {/* Message Actions */}
                        <div className="flex items-center justify-between mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="text-xs opacity-70">
                            {formatTimestamp(message.timestamp)}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-white/10"
                              onClick={() => copyMessage(message.content)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            {message.role === 'assistant' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-white/10"
                                >
                                  <ThumbsUp className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-white/10"
                                >
                                  <ThumbsDown className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {message.metadata?.actions && (
                          <div className="mt-3 space-y-2">
                            {message.metadata.actions.map((action) => (
                              <Button
                                key={action.id}
                                variant="outline"
                                size="sm"
                                className="w-full justify-start text-xs"
                                onClick={action.action}
                              >
                                {action.icon}
                                <span className="ml-2">{action.label}</span>
                              </Button>
                            ))}
                          </div>
                        )}

                        {/* Suggestions */}
                        {message.metadata?.suggestions && (
                          <div className="mt-3 space-y-1">
                            {message.metadata.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-xs text-left h-auto p-2 hover:bg-white/10"
                                onClick={() => handleSuggestionClick(suggestion)}
                              >
                                💡 {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-start space-x-2">
                    <Avatar className="h-6 w-6 mt-1">
                      <AvatarFallback className="bg-muted">
                        <Bot className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Quick Suggestions */}
            {showSuggestions && messages.length === 1 && (
              <div className="p-4 border-t">
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Quick questions:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {quickSuggestions.slice(0, 4).map((suggestion) => (
                    <Button
                      key={suggestion.id}
                      variant="outline"
                      size="sm"
                      className="justify-start text-xs h-auto p-2"
                      onClick={() => handleSuggestionClick(suggestion.text)}
                    >
                      {suggestion.icon}
                      <span className="ml-1 truncate">{suggestion.text}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-2"
              >
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about budgeting, investing, or saving..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!inputValue.trim() || isLoading}
                  className="px-3"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
              <div className="flex items-center justify-center mt-2">
                <p className="text-xs text-muted-foreground">
                  <Sparkles className="h-3 w-3 inline mr-1" />
                  AI-powered financial guidance
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FinancialChatbot;
