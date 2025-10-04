// src/pages/LearningHub.tsx
import { useState, useEffect } from "react";
import {
    Search,
    Wallet,
    TrendingUp,
    Shield,
    Target,
    Clock,
    BookmarkPlus,
    ChevronRight,
    BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Header from "@/components/Navbar";
import { Link } from "react-router-dom";

// Data: if alias '@' is not configured, switch to relative imports like "../data/learningHub"
import { articles, videos, categories, infographics } from "@/data/Learningdata";

// Map string icon names from data to actual lucide components (for Category Grid)
const IconMap = {
    Wallet,
    TrendingUp,
    Shield,
    Target,
} as const; 

// Map each visual guide to a relevant external resource
const visualGuideLinks: Record<number, string> = {
    1: "https://www.nerdwallet.com/article/finance/how-to-budget",            // The Ultimate Budgeting Cheat Sheet
    2: "https://www.investopedia.com/terms/i/investment.asp",                 // Investment Types Explained Visually
    3: "https://www.consumerfinance.gov/ask-cfpb/what-are-the-factors-that-affect-my-credit-score-en-316/", // Credit Score Factors Breakdown
    4: "https://www.nerdwallet.com/article/savings/how-much-to-save-emergency-fund", // Emergency Fund Calculator
    5: "https://www.investopedia.com/terms/f/fifty-30-20-rule.asp",           // 50/30/20 Rule Visualization
};


const LearningHub = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [bookmarkedArticles, setBookmarkedArticles] = useState<number[]>([]);

    // Visual Guides modal state/handlers
    const [activeIdx, setActiveIdx] = useState<number | null>(null);
    const open = activeIdx !== null;
    const openAt = (idx: number) => setActiveIdx(idx);
    const close = () => setActiveIdx(null);
    const next = () =>
        setActiveIdx((i) => (i !== null ? (i + 1) % infographics.length : 0));
    const prev = () =>
        setActiveIdx((i) => (i !== null ? (i - 1 + infographics.length) % infographics.length : 0));

    // Favorites for Visual Guides
    const [favIds, setFavIds] = useState<number[]>(() => {
        try {
            return JSON.parse(localStorage.getItem("lh_favorites") || "[]");
        } catch {
            return [];
        }
    });
    useEffect(() => {
        localStorage.setItem("lh_favorites", JSON.stringify(favIds));
    }, [favIds]);
    const toggleFav = (id: number) =>
        setFavIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    // Article bookmarks
    const toggleBookmark = (articleId: number) => {
        setBookmarkedArticles((prev) =>
            prev.includes(articleId) ? prev.filter((id) => id !== articleId) : [...prev, articleId]
        );
    };

    // Optional: basic client-side search over titles/descriptions (articles/videos only for now)
    const filteredArticles = articles.filter(
        (a) =>
            a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const filteredVideos = videos.filter(
        (v) => v.title.toLowerCase().includes(searchQuery.toLowerCase()) || v.channel.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                            style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 800, color: "#202124" }}
                        >
                            Master Your Financial Future
                        </h1>
                        <p
                            className="text-xl md:text-2xl mb-12 flex items-center justify-center gap-2"
                            style={{ fontFamily: "Google Sans, sans-serif", fontWeight: 400, color: "#5f6368" }}
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
                                    className="w-full h-14 pl-12 pr-4 px-5 text-base rounded-full transition-all duration-300 hover:shadow-lg focus:shadow-xl"
                                    style={{
                                        fontFamily: "'Roboto', sans-serif",
                                        border: "2px solid #e8eaed",
                                        backgroundColor: "#ffffff",
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
                                // Handle both string and component icons; if your data stores strings, map via IconMap
                                const IconComp =
                                    typeof category.icon === "string"
                                        ? (IconMap[category.icon as keyof typeof IconMap] ?? Wallet)
                                        : category.icon;

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
                                                        {/* If IconComp is a lucide icon, render it with size color from CSS */}
                                                        <IconComp className="w-8 h-8" />
                                                    </div>
                                                    <h3
                                                        className="text-xl mb-2"
                                                        style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 800 }}
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
                                style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 600, color: "#202124" }}
                            >
                                Featured Articles
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {filteredArticles.map((article) => (
                                <Link
                                    key={article.id}
                                    to={`/articles/${article.id}`}
                                    className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl"
                                    aria-label={`Open article: ${article.title}`}
                                >
                                    <Card
                                        className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:scale-[1.02]"
                                        style={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed" }}
                                    >
                                        {/* Gradient Header */}
                                        <div className={`h-32 bg-gradient-to-br ${article.gradient} relative`}>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault(); // prevent navigating when bookmarking
                                                    e.stopPropagation();
                                                    toggleBookmark(article.id);
                                                }}
                                                className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white"
                                                aria-label={
                                                    bookmarkedArticles.includes(article.id) ? "Remove bookmark" : "Add bookmark"
                                                }
                                            >
                                                <BookmarkPlus
                                                    className="w-5 h-5"
                                                    style={{
                                                        color: bookmarkedArticles.includes(article.id) ? "#4285f4" : "#5f6368",
                                                        fill: bookmarkedArticles.includes(article.id) ? "#4285f4" : "none",
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
                                                    color: "#202124",
                                                }}
                                            >
                                                {article.title}
                                            </h3>
                                            <p
                                                className="text-sm mb-4 line-clamp-3"
                                                style={{ fontFamily: "'Roboto', sans-serif", color: "#5f6368" }}
                                            >
                                                {article.description}
                                            </p>
                                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        className="flex items-center gap-1"
                                                        style={{
                                                            backgroundColor: "#e8eaed",
                                                            color: "#5f6368",
                                                            fontFamily: "'Roboto', sans-serif",
                                                        }}
                                                    >
                                                        <Clock className="w-3 h-3" />
                                                        {article.readTime}
                                                    </Badge>
                                                    <Badge
                                                        style={{
                                                            backgroundColor: article.difficulty === "Beginner" ? "#34a853" : "#fb923c",
                                                            color: "#ffffff",
                                                            fontFamily: "'Roboto', sans-serif",
                                                        }}
                                                    >
                                                        {article.difficulty}
                                                    </Badge>
                                                </div>
                                                <Button asChild size="sm" className="rounded-full">
                                                    <Link to={`/articles/${article.id}`}>Read more</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Video Learning Section */}
                <section className="py-16 px-6">
                    <div className="max-w-6xl mx-auto">
                        <h2
                            className="text-4xl mb-12 text-center flex items-center justify-center gap-3"
                            style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 600, color: "#202124" }}
                        >
                            Learn with Videos
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredVideos.map((video) => (
                                <Card
                                    key={video.id}
                                    className="group overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                                    style={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed" }}
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
                                                color: "#202124",
                                            }}
                                        >
                                            {video.title}
                                        </h3>
                                        <p
                                            className="text-sm mb-3"
                                            style={{ fontFamily: "'Roboto', sans-serif", color: "#5f6368" }}
                                        >
                                            {video.channel}
                                        </p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Badge
                                                style={{
                                                    backgroundColor: "#e8eaed",
                                                    color: "#5f6368",
                                                    fontFamily: "'Roboto', sans-serif",
                                                }}
                                            >
                                                {video.duration}
                                            </Badge>
                                            <Badge
                                                style={{
                                                    backgroundColor: "#34a853",
                                                    color: "#ffffff",
                                                    fontFamily: "'Roboto', sans-serif",
                                                }}
                                            >
                                                {video.difficulty}
                                            </Badge>
                                            <span
                                                className="text-xs"
                                                style={{ color: "#5f6368", fontFamily: "'Roboto', sans-serif" }}
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

                {/* Infographic Gallery (Visual Guides) */}
                <section className="py-16 px-6" style={{ backgroundColor: "#f8f9fa" }}>
                    <div className="max-w-6xl mx-auto">
                        <h2
                            className="text-4xl mb-12 text-center flex items-center justify-center gap-3"
                            style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 600, color: "#202124" }}
                        >
                            Visual Guides
                        </h2>

                        <div className="relative">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                                {infographics.map((infographic, idx) => (
                                    <Card
                                        key={infographic.id}
                                        onClick={() => openAt(idx)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") openAt(idx);
                                        }}
                                        className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                                        style={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed" }}
                                    >
                                        <div className="relative aspect-[3/4] overflow-hidden">
                                            <img
                                                src={infographic.image}
                                                alt={infographic.title}
                                                loading="lazy"
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />

                                            {/* Favorite button (doesn't open modal) */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleFav(infographic.id);
                                                }}
                                                className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white"
                                                aria-label="Toggle favorite"
                                            >
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    width="20"
                                                    height="20"
                                                    fill={favIds.includes(infographic.id) ? "#ef4444" : "none"}
                                                    stroke={favIds.includes(infographic.id) ? "#ef4444" : "#5f6368"}
                                                    strokeWidth="2"
                                                >
                                                    <path d="M12 21s-6.716-4.332-9.333-7.027C.11 11.377.772 8.5 3.2 7.2c1.883-1.024 4.2-.53 5.6 1 1.4-1.53 3.717-2.024 5.6-1 2.428 1.3 3.09 4.177.533 6.773C18.716 16.668 12 21 12 21z" />
                                                </svg>
                                            </button>

                                            {/* Overlay on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                                <h3
                                                    className="text-white text-base mb-3"
                                                    style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 600 }}
                                                >
                                                    {infographic.title}
                                                </h3>

                                                {/* View routes to detail page; stop propagation so modal doesn't open */}
                                                <Button
                                                    asChild
                                                    size="sm"
                                                    className="w-full rounded-full transition-all duration-300"
                                                    style={{ backgroundColor: "#4285f4", fontFamily: "'Roboto', sans-serif" }}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Link to={`/visual-guides/${infographic.id}`} aria-label={`Open ${infographic.title}`}>
                                                        View
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Lightbox Dialog (sibling to grid) */}
                    <Dialog open={open} onOpenChange={(v) => { if (!v) close(); }}>
                        <DialogContent className="max-w-3xl p-0">
                            {activeIdx !== null && (
                                <div className="relative">
                                    <img
                                        src={infographics[activeIdx].image}
                                        alt={infographics[activeIdx].title}
                                        className="w-full h-auto"
                                    />
                                    <div className="p-4 flex items-center justify-between">
                                        <h3 className="text-lg font-semibold">{infographics[activeIdx].title}</h3>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => {
                                                    const id = infographics[activeIdx].id;
                                                    const url = visualGuideLinks[id];
                                                    if (url) window.open(url, "_blank", "noopener,noreferrer");
                                                }}
                                            >
                                                More
                                            </Button>
                                            <Button size="sm" variant="secondary" onClick={prev}>
                                                Prev
                                            </Button>
                                            <Button size="sm" variant="secondary" onClick={next}>
                                                Next
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    const a = document.createElement("a");
                                                    a.href = infographics[activeIdx].image;
                                                    a.download = `${infographics[activeIdx].title}.jpg`;
                                                    a.click();
                                                }}
                                            >
                                                Download
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </section>

                {/* Continue Learning Section */}
                <section className="py-16 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div
                            className="rounded-3xl p-8 md:p-12 text-center"
                            style={{ background: "linear-gradient(135deg, #4285f4 0%, #34a853 100%)" }}
                        >
                            <h2
                                className="text-3xl md:text-4xl text-white mb-4"
                                style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 600 }}
                            >
                                Ready to Continue Learning?
                            </h2>
                            <p className="text-lg text-white/90 mb-8" style={{ fontFamily: "'Roboto', sans-serif" }}>
                                Join thousands of users already improving their financial literacy
                            </p>
                            <Button
                                size="lg"
                                className="rounded-full px-8 h-12 text-base transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                style={{
                                    backgroundColor: "#ffffff",
                                    fontFamily: "'Roboto', sans-serif",
                                    fontWeight: 500,
                                    color: "#ffffff", // matches your prior style; adjust if you want dark text
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
