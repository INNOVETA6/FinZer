// src/data/learningHub.ts

// Note on icons:
// Storing icon component names as strings keeps this data module UI-agnostic.
// Map these strings to actual components (e.g., lucide-react) in the UI layer.

export const categories = [
    {
        id: 1,
        title: "Budgeting Basics",
        icon: "Wallet",
        gradient: "from-blue-500 to-blue-600",
        lessons: 12,
        color: "#4285f4",
    },
    {
        id: 2,
        title: "How Stocks Work",
        icon: "TrendingUp",
        gradient: "from-green-500 to-green-600",
        lessons: 8,
        color: "#34a853",
    },
    {
        id: 3,
        title: "Emergency Fund",
        icon: "Shield",
        gradient: "from-yellow-500 to-yellow-600",
        lessons: 6,
        color: "#9333ea",
    },
    {
        id: 4,
        title: "Credit Score & Loans",
        icon: "Target",
        gradient: "from-orange-500 to-orange-600",
        lessons: 10,
        color: "#fb923c",
    },
];

export const articles = [
    {
        id: 1,
        title: "Understanding the 50/30/20 Budget Rule",
        description:
            "Learn how to allocate your income effectively using this simple budgeting framework that divides spending into needs, wants, and savings.",
        readTime: "5 min",
        difficulty: "Beginner",
        category: "Budgeting Basics",
        gradient: "from-blue-500 to-blue-600",
        content: `The 50/30/20 rule simplifies budgeting by dividing your after-tax income into three categories: 50% for needs (rent, utilities, groceries), 30% for wants (entertainment, dining out), and 20% for savings and debt repayment. This method provides flexibility while ensuring you prioritize financial security.

Key Benefits:
• Easy to implement and track
• Flexible for different income levels
• Ensures savings are prioritized
• Helps identify overspending areas

Getting Started:
1. Calculate your after-tax income
2. Multiply by 0.50 for needs
3. Multiply by 0.30 for wants
4. Multiply by 0.20 for savings
5. Track your spending in each category`,
    },
    {
        id: 2,
        title: "Building Your First Stock Portfolio",
        description:
            "Step-by-step guide to selecting and managing your initial investment portfolio with confidence and smart risk management.",
        readTime: "8 min",
        difficulty: "Intermediate",
        category: "How Stocks Work",
        gradient: "from-green-500 to-green-600",
        content: `Start by determining your risk tolerance and investment timeline. Diversify across different sectors and company sizes. Consider index funds for broad market exposure and individual stocks for targeted growth potential.

Portfolio Building Steps:
1. Assess your risk tolerance
2. Determine investment timeline
3. Allocate assets appropriately
4. Research companies and funds
5. Start with index funds for safety
6. Add individual stocks gradually
7. Rebalance portfolio quarterly

Diversification Tips:
• Include different industries
• Mix large and small companies
• Consider international exposure
• Balance growth and value stocks`,
    },
    {
        id: 3,
        title: "How Much Should You Save for Emergencies?",
        description:
            "Calculate the ideal emergency fund size based on your lifestyle, expenses, and financial obligations.",
        readTime: "4 min",
        difficulty: "Beginner",
        category: "Emergency Fund",
        gradient: "from-yellow-500 to-yellow-600",
        content: `Financial experts recommend saving 3-6 months of living expenses. If you have variable income or dependents, aim for 6-9 months. Start with $1,000 as your initial goal, then build from there.

Emergency Fund Calculator:
• Single income, stable job: 3 months
• Dual income, stable jobs: 3-6 months
• Single income, variable work: 6-9 months
• Family with dependents: 6-12 months
• Business owners: 9-12 months

Where to Keep Your Emergency Fund:
• High-yield savings account
• Money market account
• Liquid, accessible accounts
• Avoid locking in long-term CDs`,
    },
    {
        id: 4,
        title: "Improving Your Credit Score in 90 Days",
        description:
            "Practical strategies to boost your credit score quickly and access better loan rates and financial opportunities.",
        readTime: "6 min",
        difficulty: "Intermediate",
        category: "Credit Score & Loans",
        gradient: "from-orange-500 to-orange-600",
        content: `Pay bills on time, reduce credit card balances below 30% utilization, don't close old accounts, and dispute any errors on your credit report. These actions can significantly improve your score within 90 days.

90-Day Action Plan:
Month 1:
• Get free credit reports from all bureaus
• Dispute any errors immediately
• Set up payment reminders
• Pay down highest utilization cards

Month 2:
• Keep utilization below 30%
• Make multiple small payments
• Avoid new credit applications
• Continue timely payments

Month 3:
• Maintain good habits
• Monitor score progress
• Consider credit builder loans
• Plan next financial goals`,
    },
    {
        id: 5,
        title: "Common Budgeting Mistakes to Avoid",
        description:
            "Discover the most frequent pitfalls in personal budgeting and proven strategies to overcome them successfully.",
        readTime: "3 min",
        difficulty: "Beginner",
        category: "Budgeting Basics",
        gradient: "from-blue-800 to-blue-900",
        content: `Avoid underestimating expenses, forgetting irregular costs, being too restrictive, and not tracking spending. Build flexibility into your budget and review it monthly to stay on track.

Common Budgeting Mistakes:
1. Underestimating true expenses
2. Forgetting irregular/annual costs
3. Being too restrictive
4. Not tracking actual spending
5. Ignoring small purchases
6. No emergency category
7. Setting unrealistic goals
8. Not reviewing regularly

Solutions:
• Track spending for 30 days first
• Include "fun money" category
• Create sinking funds for irregular expenses
• Use budgeting apps for tracking
• Review and adjust monthly`,
    },
    {
        id: 6,
        title: "Diversification: Don't Put All Eggs in One Basket",
        description:
            "Why spreading investments across different assets protects your wealth and reduces overall portfolio risk.",
        readTime: "7 min",
        difficulty: "Intermediate",
        category: "How Stocks Work",
        gradient: "from-green-300 to-green-500",
        content: `Diversification spreads risk across various asset classes, sectors, and geographic regions. This strategy helps protect your portfolio from significant losses while maintaining growth potential.

Diversification Strategies:
Asset Class Diversification:
• Stocks (domestic/international)
• Bonds (government/corporate)
• Real Estate (REITs)
• Commodities (gold, oil)
• Cash equivalents

Sector Diversification:
• Technology
• Healthcare
• Financials
• Consumer goods
• Industrial
• Energy

Geographic Diversification:
• Domestic markets
• Developed international
• Emerging markets
• Global index funds`,
    },
    {
        id: 7,
        title: "Starting an Emergency Fund from Zero",
        description:
            "Practical steps to build your first $1000 emergency fund even on a tight budget.",
        readTime: "5 min",
        difficulty: "Beginner",
        category: "Emergency Fund",
        gradient: "from-yellow-300 to-yellow-400",
        content: `Start small by automating $25-50 weekly transfers. Cut one non-essential expense, sell unused items, and use windfalls like tax refunds. Celebrate milestones to stay motivated.

$1000 Emergency Fund Plan:
Week 1-4: Save $50/week = $200
• Cancel one subscription
• Pack lunch 3x/week
• Use public transportation

Week 5-8: Save $75/week = $500
• Sell unused items online
• Take on freelance work
• Reduce dining out

Week 9-12: Save $83/week = $1000
• Use cashback rewards
• Temporary side hustle
• Tax refund allocation

Automation Tips:
• Set up automatic transfers
• Use round-up apps
• Direct deposit split
• Windfall commitment`,
    },
    {
        id: 8,
        title: "Understanding Credit Card Interest Rates",
        description:
            "How APR works and strategies to minimize interest charges on credit card balances.",
        readTime: "6 min",
        difficulty: "Beginner",
        category: "Credit Score & Loans",
        gradient: "from-orange-400 to-orange-600",
        content: `APR (Annual Percentage Rate) determines your interest charges. Pay your full balance monthly to avoid interest. If carrying a balance, prioritize high-APR cards first using the avalanche method.

APR Breakdown:
• Purchase APR: Regular purchases
• Cash Advance APR: Higher rate for cash
• Penalty APR: Late payments trigger
• Introductory APR: Temporary low rate

Interest Calculation:
Average Daily Balance Method:
1. Daily balance tracked
2. Summed for billing cycle
3. Divided by days in cycle
4. Multiplied by daily rate
5. Added to your balance

Strategies to Avoid Interest:
• Pay full balance monthly
• Use 0% balance transfers
• Negotiate lower rates
• Prioritize high-APR cards
• Make multiple payments`,
    },
    {
        id: 9,
        title: "Zero-Based Budgeting Explained",
        description:
            "Learn how to assign every dollar a purpose and gain complete control over your spending.",
        readTime: "6 min",
        difficulty: "Intermediate",
        category: "Budgeting Basics",
        gradient: "from-blue-500 to-blue-300",
        content: `Zero-based budgeting means income minus expenses equals zero. Every dollar gets assigned to a category—spending, saving, or debt. This method forces intentional financial decisions.

Zero-Based Budgeting Steps:
1. List monthly income
2. List all expenses (fixed/variable)
3. Assign every dollar to categories
4. Income - Expenses = $0
5. Track throughout month
6. Adjust as needed

Category Examples:
Fixed Expenses:
• Rent/Mortgage
• Utilities
• Insurance
• Loan payments

Variable Expenses:
• Groceries
• Transportation
• Entertainment
• Personal care

Savings & Debt:
• Emergency fund
• Retirement
• Debt extra payments
• Investment accounts`,
    },
];

export const videos = [
    {
        id: 1,
        title: "Budgeting In 26 Minutes - Complete Guide",
        duration: "26:13",
        views: "500K",
        videoId: "Jkf5pTLTTFY",
        embedUrl: "https://www.youtube.com/embed/Jkf5pTLTTFY",
        channel: "Financial Education",
        difficulty: "Beginner",
    },
    {
        id: 2,
        title: "How To Make A Budget | Beginner Budgeting",
        duration: "16:03",
        views: "300K",
        videoId: "GtIB8obvhvs",
        embedUrl: "https://www.youtube.com/embed/GtIB8obvhvs",
        channel: "Aja Dang",
        difficulty: "Beginner",
    },
    {
        id: 3,
        title: "Stock Market for Beginners Explained",
        duration: "10:32",
        views: "2M",
        videoId: "p7HKvqRI_Bo",
        embedUrl: "https://www.youtube.com/embed/p7HKvqRI_Bo",
        channel: "ClearValue Tax",
        difficulty: "Beginner",
    },
    {
        id: 4,
        title: "Emergency Fund 101: How Much Do You Need?",
        duration: "11:28",
        views: "400K",
        videoId: "XB5h7B3KSNg",
        embedUrl: "https://www.youtube.com/embed/tVGJqaOkqac",
        channel: "Graham Stephan",
        difficulty: "Beginner",
    },
    {
        id: 5,
        title: "What is a Credit Score? Explained Simply",
        duration: "8:30",
        views: "600K",
        videoId: "MZ3ZWzIGP1Q",
        embedUrl: "https://www.youtube.com/embed/W_nzukD8ra0",
        channel: "NerdWallet",
        difficulty: "Beginner",
    },
    {
        id: 6,
        title: "How to Build Credit from SCRATCH",
        duration: "12:18",
        views: "450K",
        videoId: "T5_XCrJPprc",
        embedUrl: "https://www.youtube.com/embed/VrOB35_7QCE",
        channel: "Graham Stephan",
        difficulty: "Beginner",
    },
];

export const infographics = [
    {
        id: 1,
        title: "The Ultimate Budgeting Cheat Sheet",
        image:
            "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
    },
    {
        id: 2,
        title: "Investment Types Explained Visually",
        image:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    },
    {
        id: 3,
        title: "Credit Score Factors Breakdown",
        image:
            "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80",
    },
    {
        id: 4,
        title: "Emergency Fund Calculator",
        image:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    },
    {
        id: 5,
        title: "50/30/20 Rule Visualization",
        image:
            "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80",
    },
];
