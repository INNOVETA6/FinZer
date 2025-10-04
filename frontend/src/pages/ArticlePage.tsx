import { useEffect, useMemo, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Navbar";
import { articles } from "../data/Learningdata";
import { ArrowLeft, Home, ChevronUp, Clock, Share2, Bookmark, Eye, User } from "lucide-react";

export default function ArticlePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const headingRef = useRef<HTMLHeadingElement>(null);

    const article = useMemo(
        () => articles.find((a) => String(a.id) === String(id)),
        [id]
    );

    useEffect(() => {
        headingRef.current?.focus();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [id]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const shareArticle = () => {
        if (navigator.share) {
            navigator.share({
                title: article?.title,
                text: article?.description,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    if (!article) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
                    <div className="max-w-md mx-auto text-center">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Eye className="w-12 h-12 text-blue-600" />
                        </div>
                        <h1
                            className="text-3xl font-bold mb-4 text-gray-900"
                            style={{ fontFamily: "var(--font-google-sans)" }}
                        >
                            Article Not Found
                        </h1>
                        <p
                            className="text-lg text-gray-600 mb-8"
                            style={{ fontFamily: "var(--font-roboto)" }}
                        >
                            The article you're looking for doesn't exist or has been moved.
                        </p>
                        <Button
                            asChild
                            className="rounded-full px-8 h-12 text-base bg-blue-600 hover:bg-blue-700"
                        >
                            <Link to="/learning-hub" className="flex items-center gap-2">
                                <Home className="w-5 h-5" />
                                Back to Learning Hub
                            </Link>
                        </Button>
                    </div>
                </div>
            </>
        );
    }

    const relatedArticles = articles
        .filter((a) => a.id !== article.id && a.category === article.category)
        .slice(0, 3);

    return (
        <>
            <Header />

            {/* Fixed Back Button in Corner */}
            <Button
                onClick={() => navigate(-1)}
                className="fixed top-24 left-6 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white hover:shadow-lg rounded-full px-4 py-2 shadow-md transition-all duration-300"
                style={{ fontFamily: "var(--font-roboto)" }}
            >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
            </Button>

            <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
                {/* Hero Section */}
                <section className={`relative py-20 bg-gradient-to-br ${article.gradient}`}>
                    <div className="absolute inset-0 bg-black/5"></div>
                    <div className="relative max-w-5xl mx-auto px-6">
                        <Badge
                            className="mb-6 bg-white/20 text-white border-none backdrop-blur-sm px-4 py-2 rounded-full"
                            style={{ fontFamily: "var(--font-roboto)" }}
                        >
                            {article.category}
                        </Badge>

                        <h1
                            ref={headingRef}
                            tabIndex={-1}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white"
                            style={{ fontFamily: "var(--font-google-sans)" }}
                        >
                            {article.title}
                        </h1>

                        <p
                            className="text-xl md:text-2xl mb-8 text-white/95 max-w-3xl leading-relaxed"
                            style={{ fontFamily: "var(--font-roboto)" }}
                        >
                            {article.description}
                        </p>

                        <div className="flex items-center gap-6 flex-wrap text-white/90">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                <span style={{ fontFamily: "var(--font-roboto)" }}>{article.readTime} read</span>
                            </div>
                            <Badge
                                className={`px-4 py-1.5 rounded-full ${article.difficulty === "Beginner"
                                        ? "bg-green-500/20 text-green-100"
                                        : "bg-orange-500/20 text-orange-100"
                                    } border-none`}
                                style={{ fontFamily: "var(--font-roboto)" }}
                            >
                                {article.difficulty}
                            </Badge>
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                <span style={{ fontFamily: "var(--font-roboto)" }}>Financial Expert</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-12 px-6 -mt-12">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid lg:grid-cols-4 gap-8">
                            {/* Main Content with Gradient */}
                            <div className="lg:col-span-3">
                                <Card className={`p-0 shadow-2xl border-0 rounded-3xl overflow-hidden bg-gradient-to-br ${article.gradient}`}>
                                    <div className="p-8 lg:p-12 bg-white text">
                                        <article
                                            className=" prose prose-lg max-w-none prose-headings:text-white prose-p:text-white prose-strong:text-white prose-li:text-white"
                                            style={{ fontFamily: "var(--font-roboto)" }}
                                        >
                                            <div className="text-black leading-8 text-lg whitespace-pre-line">
                                                {article.content}
                                            </div>
                                        </article>

                                        {/* Key Takeaways */}
                                        <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                                            <h3
                                                className="text-2xl font-bold mb-4 text-black"
                                                style={{ fontFamily: "var(--font-google-sans)" }}
                                            >
                                                Key Takeaways
                                            </h3>
                                            <ul className="space-y-3 text-black/95">
                                                {article.content
                                                    .split("\n")
                                                    .filter((line) => line.trim().startsWith("•") || line.trim().startsWith("-"))
                                                    .slice(0, 4)
                                                    .map((point, index) => (
                                                        <li
                                                            key={index}
                                                            className="flex items-start gap-3"
                                                            style={{ fontFamily: "var(--font-roboto)" }}
                                                        >
                                                            <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                                                            <span>{point.replace(/^[•\-]\s*/, "")}</span>
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-12 flex items-center justify-between border-t border-white/20 pt-8">
                                            <div className="flex items-center gap-4">
                                                <Button
                                                    onClick={shareArticle}
                                                    className="flex items-center gap-2 rounded-full px-6 bg-white/20 hover:bg-white/30 text-black border-white/20"
                                                    style={{ fontFamily: "var(--font-roboto)" }}
                                                >
                                                    <Share2 className="w-4 h-4" />
                                                    Share
                                                </Button>
                                                <Button
                                                    className="flex items-center gap-2 rounded-full px-6 bg-white/20 hover:bg-white/30 text-black border-white/20"
                                                    style={{ fontFamily: "var(--font-roboto)" }}
                                                >
                                                    <Bookmark className="w-4 h-4" />
                                                    Save
                                                </Button>
                                            </div>
                                            <Button
                                                onClick={scrollToTop}
                                                className="flex items-center gap-2 rounded-full px-6 bg-white/20 hover:bg-white/30 text-black border-white/20"
                                                style={{ fontFamily: "var(--font-roboto)" }}
                                            >
                                                <ChevronUp className="w-4 h-4" />
                                                Top
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-24 space-y-6">
                                    {/* Quick Actions */}
                                    <Card className="p-6 border-0 shadow-lg rounded-2xl">
                                        <h4
                                            className="font-semibold text-gray-900 mb-4"
                                            style={{ fontFamily: "var(--font-google-sans)" }}
                                        >
                                            Quick Actions
                                        </h4>
                                        <div className="space-y-3">
                                            <Button
                                                asChild
                                                variant="outline"
                                                className="w-full justify-start gap-3 rounded-xl h-12"
                                            >
                                                <Link to="/learning-hub" className="flex items-center gap-3">
                                                    <Home className="w-4 h-4" />
                                                    <span style={{ fontFamily: "var(--font-roboto)" }}>Learning Hub</span>
                                                </Link>
                                            </Button>
                                            <Button
                                                onClick={scrollToTop}
                                                variant="outline"
                                                className="w-full justify-start gap-3 rounded-xl h-12"
                                            >
                                                <ChevronUp className="w-4 h-4" />
                                                <span style={{ fontFamily: "var(--font-roboto)" }}>Back to Top</span>
                                            </Button>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </div>

                        {/* Related Articles */}
                        {relatedArticles.length > 0 && (
                            <div className="mt-16">
                                <div className="flex items-center justify-between mb-8">
                                    <h2
                                        className="text-3xl font-bold text-gray-900"
                                        style={{ fontFamily: "var(--font-google-sans)" }}
                                    >
                                        Continue Learning
                                    </h2>
                                    <Button
                                        asChild
                                        variant="ghost"
                                        className="text-blue-600 hover:text-blue-700"
                                        style={{ fontFamily: "var(--font-roboto)" }}
                                    >
                                        <Link to="/learning-hub">View All</Link>
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {relatedArticles.map((relatedArticle) => (
                                        <Card
                                            key={relatedArticle.id}
                                            className="group p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 rounded-2xl hover:-translate-y-2"
                                            onClick={() => navigate(`/articles/${relatedArticle.id}`)}
                                        >
                                            <div
                                                className={`h-3 rounded-lg bg-gradient-to-br ${relatedArticle.gradient} mb-4 group-hover:scale-105 transition-transform duration-300`}
                                            ></div>
                                            <h3
                                                className="font-bold text-gray-900 line-clamp-2 mb-3 text-lg leading-tight"
                                                style={{ fontFamily: "var(--font-google-sans)" }}
                                            >
                                                {relatedArticle.title}
                                            </h3>
                                            <p
                                                className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed"
                                                style={{ fontFamily: "var(--font-roboto)" }}
                                            >
                                                {relatedArticle.description}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant="secondary"
                                                    className="text-xs bg-gray-100 text-gray-700"
                                                    style={{ fontFamily: "var(--font-roboto)" }}
                                                >
                                                    {relatedArticle.readTime}
                                                </Badge>
                                                <Badge
                                                    className={`text-xs ${relatedArticle.difficulty === "Beginner"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-orange-100 text-orange-700"
                                                        }`}
                                                    style={{ fontFamily: "var(--font-roboto)" }}
                                                >
                                                    {relatedArticle.difficulty}
                                                </Badge>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
}
