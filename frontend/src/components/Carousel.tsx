import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react';

const Carousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const slides = [
        {
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop",
            title: "Financial Dashboard",
            description: "Track your expenses and income in real-time with our intuitive dashboard"
        },
        {
            image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&h=600&fit=crop",
            title: "Investment Growth",
            description: "Watch your portfolio grow with smart investment recommendations"
        },
        {
            image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=600&fit=crop",
            title: "Budget Planning",
            description: "Create and manage budgets that work for your lifestyle"
        },
        {
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop",
            title: "Financial Insights",
            description: "Get AI-powered insights to make better financial decisions"
        }
    ];

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, slides.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    return (
        <div className="relative w-full max-w-7xl mx-auto px-4">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Main Carousel Container */}
            <div className="relative group">
                {/* Gradient Border Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>

                <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl">
                    {/* Slides Container */}
                    <div className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden">
                        {slides.map((slide, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentSlide
                                        ? 'opacity-100 scale-100'
                                        : 'opacity-0 scale-105'
                                    }`}
                            >
                                {/* Image with Overlay */}
                                <div className="relative h-full w-full">
                                    <img
                                        src={slide.image}
                                        alt={slide.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                                    {/* Content Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                                        <h3 className="text-3xl md:text-5xl font-bold mb-3 animate-fade-in">
                                            {slide.title}
                                        </h3>
                                        <p className="text-lg md:text-xl text-white/90 max-w-2xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
                                            {slide.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 dark:bg-slate-800/40 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 dark:bg-slate-800/40 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                    </button>

                    {/* Dot Indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className="group/dot relative"
                                aria-label={`Go to slide ${index + 1}`}
                            >
                                {index === currentSlide ? (
                                    <div className="relative">
                                        <Circle className="w-3 h-3 md:w-4 md:h-4 fill-white text-white" />
                                        <div className="absolute inset-0 animate-ping">
                                            <Circle className="w-3 h-3 md:w-4 md:h-4 fill-white/50 text-white/50" />
                                        </div>
                                    </div>
                                ) : (
                                    <Circle className="w-3 h-3 md:w-4 md:h-4 fill-white/30 text-white/30 hover:fill-white/60 hover:scale-125 transition-all duration-300" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 transition-all duration-300"
                            style={{
                                width: isAutoPlaying ? '100%' : '0%',
                                transition: isAutoPlaying ? 'width 5s linear' : 'width 0.3s',
                                animation: isAutoPlaying ? 'none' : 'none'
                            }}
                            key={currentSlide}
                        ></div>
                    </div>
                </div>

            </div>


            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Carousel;