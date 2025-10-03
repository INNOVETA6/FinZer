import { useState } from "react";
import {
    Search,
    Wallet,
    TrendingUp,
    Shield,
    Target,
    Clock,
    BookmarkPlus,
    ChevronRight,
    BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Header from "@/components/Navbar";

const LearningHub = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [bookmarkedArticles, setBookmarkedArticles] = useState<number[]>([]);

    const categories = [
        {
            id: 1,
            title: "Budgeting Basics",
            icon: Wallet,
            gradient: "from-blue-500 to-blue-600",
            lessons: 12,
            color: "#4285f4"
        },
        {
            id: 2,
            title: "How Stocks Work",
            icon: TrendingUp,
            gradient: "from-green-500 to-green-600",
            lessons: 8,
            color: "#34a853"
        },
        {
            id: 3,
            title: "Emergency Fund",
            icon: Shield,
            gradient: "from-yellow-500 to-yellow-600",
            lessons: 6,
            color: "#9333ea"
        },
        {
            id: 4,
            title: "Credit Score & Loans",
            icon: Target,
            gradient: "from-orange-500 to-orange-600",
            lessons: 10,
            color: "#fb923c"
        }
    ];

    const articles = [
        {
            id: 1,
            title: "Understanding the 50/30/20 Budget Rule",
            description: "Learn how to allocate your income effectively using this simple budgeting framework that divides spending into needs, wants, and savings.",
            readTime: "5 min",
            difficulty: "Beginner",
            category: "Budgeting Basics",
            gradient: "from-blue-500 to-blue-600",
            content: `The 50/30/20 rule simplifies budgeting by dividing your after-tax income into three categories: 50% for needs (rent, utilities, groceries), 30% for wants (entertainment, dining out), and 20% for savings and debt repayment. This method provides flexibility while ensuring you prioritize financial security.`
        },
        {
            id: 2,
            title: "Building Your First Stock Portfolio",
            description: "Step-by-step guide to selecting and managing your initial investment portfolio with confidence and smart risk management.",
            readTime: "8 min",
            difficulty: "Intermediate",
            category: "How Stocks Work",
            gradient: "from-green-500 to-green-600",
            content: `Start by determining your risk tolerance and investment timeline. Diversify across different sectors and company sizes. Consider index funds for broad market exposure and individual stocks for targeted growth potential.`
        },
        {
            id: 3,
            title: "How Much Should You Save for Emergencies?",
            description: "Calculate the ideal emergency fund size based on your lifestyle, expenses, and financial obligations.",
            readTime: "4 min",
            difficulty: "Beginner",
            category: "Emergency Fund",
            gradient: "from-yellow-500 to-yellow-600",
            content: `Financial experts recommend saving 3-6 months of living expenses. If you have variable income or dependents, aim for 6-9 months. Start with $1,000 as your initial goal, then build from there.`
        },
        {
            id: 4,
            title: "Improving Your Credit Score in 90 Days",
            description: "Practical strategies to boost your credit score quickly and access better loan rates and financial opportunities.",
            readTime: "6 min",
            difficulty: "Intermediate",
            category: "Credit Score & Loans",
            gradient: "from-orange-500 to-orange-600",
            content: `Pay bills on time, reduce credit card balances below 30% utilization, don't close old accounts, and dispute any errors on your credit report. These actions can significantly improve your score within 90 days.`
        },
        {
            id: 5,
            title: "Common Budgeting Mistakes to Avoid",
            description: "Discover the most frequent pitfalls in personal budgeting and proven strategies to overcome them successfully.",
            readTime: "3 min",
            difficulty: "Beginner",
            category: "Budgeting Basics",
            gradient: "from-blue-800 to-blue-900",
            content: `Avoid underestimating expenses, forgetting irregular costs, being too restrictive, and not tracking spending. Build flexibility into your budget and review it monthly to stay on track.`
        },
        {
            id: 6,
            title: "Diversification: Don't Put All Eggs in One Basket",
            description: "Why spreading investments across different assets protects your wealth and reduces overall portfolio risk.",
            readTime: "7 min",
            difficulty: "Intermediate",
            category: "How Stocks Work",
            gradient: "from-green-300 to-green-500",
            content: `Diversification spreads risk across various asset classes, sectors, and geographic regions. This strategy helps protect your portfolio from significant losses while maintaining growth potential.`
        },
        {
            id: 7,
            title: "Starting an Emergency Fund from Zero",
            description: "Practical steps to build your first $1000 emergency fund even on a tight budget.",
            readTime: "5 min",
            difficulty: "Beginner",
            category: "Emergency Fund",
            gradient: "from-yellow-300 to-yellow-400",
            content: `Start small by automating $25-50 weekly transfers. Cut one non-essential expense, sell unused items, and use windfalls like tax refunds. Celebrate milestones to stay motivated.`
        },
        {
            id: 8,
            title: "Understanding Credit Card Interest Rates",
            description: "How APR works and strategies to minimize interest charges on credit card balances.",
            readTime: "6 min",
            difficulty: "Beginner",
            category: "Credit Score & Loans",
            gradient: "from-orange-400 to-orange-600",
            content: `APR (Annual Percentage Rate) determines your interest charges. Pay your full balance monthly to avoid interest. If carrying a balance, prioritize high-APR cards first using the avalanche method.`
        },
        {
            id: 9,
            title: "Zero-Based Budgeting Explained",
            description: "Learn how to assign every dollar a purpose and gain complete control over your spending.",
            readTime: "6 min",
            difficulty: "Intermediate",
            category: "Budgeting Basics",
            gradient: "from-blue-500 to-blue-300",
            content: `Zero-based budgeting means income minus expenses equals zero. Every dollar gets assigned to a category—spending, saving, or debt. This method forces intentional financial decisions.`
        }
    ];

    const videos = [
        {
            id: 1,
            title: "Budgeting In 26 Minutes - Complete Guide",
            duration: "26:13",
            views: "500K",
            videoId: "Jkf5pTLTTFY",
            embedUrl: "https://www.youtube.com/embed/Jkf5pTLTTFY",
            channel: "Financial Education",
            difficulty: "Beginner"
        },
        {
            id: 2,
            title: "How To Make A Budget | Beginner Budgeting",
            duration: "16:03",
            views: "300K",
            videoId: "GtIB8obvhvs",
            embedUrl: "https://www.youtube.com/embed/GtIB8obvhvs",
            channel: "Aja Dang",
            difficulty: "Beginner"
        },
        {
            id: 3,
            title: "Stock Market for Beginners Explained",
            duration: "10:32",
            views: "2M",
            videoId: "p7HKvqRI_Bo",
            embedUrl: "https://www.youtube.com/embed/p7HKvqRI_Bo",
            channel: "ClearValue Tax",
            difficulty: "Beginner"
        },
        {
            id: 4,
            title: "Emergency Fund 101: How Much Do You Need?",
            duration: "11:28",
            views: "400K",
            videoId: "XB5h7B3KSNg",
            embedUrl: "https://www.youtube.com/embed/tVGJqaOkqac",
            channel: "Graham Stephan",
            difficulty: "Beginner"
        },
        {
            id: 5,
            title: "What is a Credit Score? Explained Simply",
            duration: "8:30",
            views: "600K",
            videoId: "MZ3ZWzIGP1Q",
            embedUrl: "https://www.youtube.com/embed/W_nzukD8ra0",
            channel: "NerdWallet",
            difficulty: "Beginner"
        },
        {
            id: 6,
            title: "How to Build Credit from SCRATCH",
            duration: "12:18",
            views: "450K",
            videoId: "T5_XCrJPprc",
            embedUrl: "https://www.youtube.com/embed/VrOB35_7QCE",
            channel: "Graham Stephan",
            difficulty: "Beginner"
        }
    ];

    const infographics = [
        {
            id: 1,
            title: "The Ultimate Budgeting Cheat Sheet",
            image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80"
        },
        {
            id: 2,
            title: "Investment Types Explained Visually",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
        },
        {
            id: 3,
            title: "Credit Score Factors Breakdown",
            image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80"
        },
        {
            id: 4,
            title: "Emergency Fund Calculator",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
        },
        {
            id: 5,
            title: "50/30/20 Rule Visualization",
            image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80"
        }
    ];

    const toggleBookmark = (articleId: number) => {
        setBookmarkedArticles(prev =>
            prev.includes(articleId)
                ? prev.filter(id => id !== articleId)
                : [...prev, articleId]
        );
    };

    return (
        <>
            <Header />
            <div className="min-h-screen" style={{ backgroundColor: "#ffffff" }}>
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 px-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-transparent backdrop-blur-3xl" />
                    <div className="relative max-w-6xl mx-auto text-center">
                        <h1
                            className="text-5xl md:text-6xl mb-6 animate-fade-in"
                            style={{
                                fontFamily: "'Google Sans', sans-serif",
                                fontWeight: 800,
                                color: "#202124"
                            }}
                        >
                            Master Your Financial Future
                        </h1>
                        <p
                            className="text-xl md:text-2xl mb-12 flex items-center justify-center gap-2"
                            style={{
                                fontFamily: "Google Sans, sans-serif",
                                fontWeight: 400,
                                color: "#5f6368"
                            }}
                        >
                            <Target className="w-6 h-6" style={{ color: "#4285f4" }} />
                            Bite-sized lessons to build your financial confidence
                        </p>
                        {/* Search Bar */}
                        <form className="max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
                            <div className="relative group">
                                <Search
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors"
                                    style={{ color: "#5f6368" }}
                                />
                                <Input
                                    type="text"
                                    placeholder="Search for topics, articles, or videos..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-14 pl-12 pr-4 text-base rounded-full transition-all duration-300 hover:shadow-lg focus:shadow-xl"
                                    style={{
                                        fontFamily: "'Roboto', sans-serif",
                                        border: "2px solid #e8eaed",
                                        backgroundColor: "#ffffff"
                                    }}
                                />
                            </div>
                        </form>
                    </div>
                </section>

                {/* Category Grid */}
                <section className="py-16 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                            {categories.map((category) => {
                                const Icon = category.icon;
                                return (
                                    <Card
                                        key={category.id}
                                        className="group relative overflow-hidden rounded-2xl border-none cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                                        style={{ borderColor: "#e8eaed" }}
                                    >
                                        <div className={`h-full bg-gradient-to-br ${category.gradient} p-6 text-white min-h-[180px]`}>
                                            <div className="flex flex-col h-full justify-between">
                                                <div>
                                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                                                        <Icon className="w-8 h-8" />
                                                    </div>
                                                    <h3
                                                        className="text-xl mb-2"
                                                        style={{
                                                            fontFamily: "'Google Sans', sans-serif",
                                                            fontWeight: 800
                                                        }}
                                                    >
                                                        {category.title}
                                                    </h3>
                                                </div>
                                                <Badge
                                                    className="w-fit bg-white/20 text-black border-none backdrop-blur-sm"
                                                    style={{ fontFamily: "'Roboto', sans-serif" }}
                                                >
                                                    {category.lessons} lessons
                                                </Badge>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Featured Articles */}
                <section className="py-16 px-6" style={{ backgroundColor: "#f8f9fa" }}>
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center justify-center gap-3 mb-12">
                            <BookOpen className="w-8 h-8" style={{ color: "#4285f4" }} />
                            <h2
                                className="text-4xl text-center"
                                style={{
                                    fontFamily: "'Google Sans', sans-serif",
                                    fontWeight: 600,
                                    color: "#202124"
                                }}
                            >
                                Featured Articles
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {articles.map((article) => (
                                <Card
                                    key={article.id}
                                    className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:scale-[1.02]"
                                    style={{
                                        backgroundColor: "#ffffff",
                                        border: "1px solid #e8eaed"
                                    }}
                                >
                                    {/* Gradient Header */}
                                    <div className={`h-32 bg-gradient-to-br ${article.gradient} relative`}>
                                        <button
                                            onClick={() => toggleBookmark(article.id)}
                                            className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white"
                                        >
                                            <BookmarkPlus
                                                className="w-5 h-5"
                                                style={{
                                                    color: bookmarkedArticles.includes(article.id) ? "#4285f4" : "#5f6368",
                                                    fill: bookmarkedArticles.includes(article.id) ? "#4285f4" : "none"
                                                }}
                                            />
                                        </button>
                                    </div>
                                    {/* Content */}
                                    <div className="p-6">
                                        <h3
                                            className="text-xl mb-3 line-clamp-2"
                                            style={{
                                                fontFamily: "'Google Sans', sans-serif",
                                                fontWeight: 600,
                                                color: "#202124"
                                            }}
                                        >
                                            {article.title}
                                        </h3>
                                        <p
                                            className="text-sm mb-4 line-clamp-3"
                                            style={{
                                                fontFamily: "'Roboto', sans-serif",
                                                color: "#5f6368"
                                            }}
                                        >
                                            {article.description}
                                        </p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Badge
                                                className="flex items-center gap-1"
                                                style={{
                                                    backgroundColor: "#e8eaed",
                                                    color: "#5f6368",
                                                    fontFamily: "'Roboto', sans-serif"
                                                }}
                                            >
                                                <Clock className="w-3 h-3" />
                                                {article.readTime}
                                            </Badge>
                                            <Badge
                                                style={{
                                                    backgroundColor: article.difficulty === "Beginner" ? "#34a853" : "#fb923c",
                                                    color: "#ffffff",
                                                    fontFamily: "'Roboto', sans-serif"
                                                }}
                                            >
                                                {article.difficulty}
                                            </Badge>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Video Learning Section */}
                <section className="py-16 px-6">
                    <div className="max-w-6xl mx-auto">
                        <h2
                            className="text-4xl mb-12 text-center flex items-center justify-center gap-3"
                            style={{
                                fontFamily: "'Google Sans', sans-serif",
                                fontWeight: 600,
                                color: "#202124"
                            }}
                        >
                            Learn with Videos 🎥
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {videos.map((video) => (
                                <Card
                                    key={video.id}
                                    className="group overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                                    style={{
                                        backgroundColor: "#ffffff",
                                        border: "1px solid #e8eaed"
                                    }}
                                >
                                    {/* YouTube Embed */}
                                    <div className="relative aspect-video overflow-hidden">
                                        <iframe
                                            src={video.embedUrl}
                                            title={video.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="w-full h-full"
                                        />
                                    </div>
                                    {/* Video Info */}
                                    <div className="p-5">
                                        <h3
                                            className="text-lg mb-2 line-clamp-2"
                                            style={{
                                                fontFamily: "'Google Sans', sans-serif",
                                                fontWeight: 600,
                                                color: "#202124"
                                            }}
                                        >
                                            {video.title}
                                        </h3>
                                        <p
                                            className="text-sm mb-3"
                                            style={{
                                                fontFamily: "'Roboto', sans-serif",
                                                color: "#5f6368"
                                            }}
                                        >
                                            {video.channel}
                                        </p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Badge
                                                style={{
                                                    backgroundColor: "#e8eaed",
                                                    color: "#5f6368",
                                                    fontFamily: "'Roboto', sans-serif"
                                                }}
                                            >
                                                {video.duration}
                                            </Badge>
                                            <Badge
                                                style={{
                                                    backgroundColor: "#34a853",
                                                    color: "#ffffff",
                                                    fontFamily: "'Roboto', sans-serif"
                                                }}
                                            >
                                                {video.difficulty}
                                            </Badge>
                                            <span
                                                className="text-xs"
                                                style={{
                                                    color: "#5f6368",
                                                    fontFamily: "'Roboto', sans-serif"
                                                }}
                                            >
                                                {video.views} views
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Infographic Gallery */}
                <section className="py-16 px-6" style={{ backgroundColor: "#f8f9fa" }}>
                    <div className="max-w-6xl mx-auto">
                        <h2
                            className="text-4xl mb-12 text-center flex items-center justify-center gap-3"
                            style={{
                                fontFamily: "'Google Sans', sans-serif",
                                fontWeight: 600,
                                color: "#202124"
                            }}
                        >
                            Visual Guides 📊
                        </h2>
                        <div className="relative">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                                {infographics.map((infographic) => (
                                    <Card
                                        key={infographic.id}
                                        className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                                        style={{
                                            backgroundColor: "#ffffff",
                                            border: "1px solid #e8eaed"
                                        }}
                                    >
                                        <div className="relative aspect-[3/4] overflow-hidden">
                                            <img
                                                src={infographic.image}
                                                alt={infographic.title}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                            {/* Overlay on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                                <h3
                                                    className="text-white text-base mb-3"
                                                    style={{
                                                        fontFamily: "'Google Sans', sans-serif",
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    {infographic.title}
                                                </h3>
                                                <Button
                                                    size="sm"
                                                    className="w-full rounded-full transition-all duration-300"
                                                    style={{
                                                        backgroundColor: "#4285f4",
                                                        fontFamily: "'Roboto', sans-serif"
                                                    }}
                                                >
                                                    View
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Continue Learning Section */}
                <section className="py-16 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div
                            className="rounded-3xl p-8 md:p-12 text-center"
                            style={{
                                background: "linear-gradient(135deg, #4285f4 0%, #34a853 100%)"
                            }}
                        >
                            <h2
                                className="text-3xl md:text-4xl text-white mb-4"
                                style={{
                                    fontFamily: "'Google Sans', sans-serif",
                                    fontWeight: 600
                                }}
                            >
                                Ready to Continue Learning?
                            </h2>
                            <p
                                className="text-lg text-white/90 mb-8"
                                style={{ fontFamily: "'Roboto', sans-serif" }}
                            >
                                Join thousands of users already improving their financial literacy
                            </p>
                            <Button
                                size="lg"
                                className="rounded-full px-8 h-12 text-base transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                style={{
                                    backgroundColor: "#ffffff",
                                    color: "#4285f4",
                                    fontFamily: "'Roboto', sans-serif",
                                    fontWeight: 500
                                }}
                            >
                                Explore All Courses
                                <ChevronRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default LearningHub;
