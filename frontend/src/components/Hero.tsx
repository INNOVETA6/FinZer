import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FinancialChatbot from "./FinancialChatbot";
import Carousel from "./Carousel";

const Hero = () => {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (isAuthenticated) {
      // already logged in → go to budget planner
      navigate('/budget-planner');
    } else {
      // not logged in → go to signup
      navigate('/sign-up');
    }
  }; 
  // const handleStartJourney = () => {
  //   navigate('/sign-up');
  // };

  const learninghub = () => {
    navigate('/learning-hub');
  };

  return (
    <>
      <section className="relative pt-10 pb-2 px-4 lg:px-8 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-sm">
                <Zap className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-black">
                  Smart Financial Management
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Your{" "}
                <span
                  className="bg-gradient-hero bg-clip-text text-transparent relative inline-block"
                  style={{ fontFamily: "Google Sans, sans-serif", fontWeight: 800 }}
                >
                  Financial Future
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3"
                    viewBox="0 0 200 12"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,7 Q50,0 100,7 T200,7"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="3"
                      opacity="0.6"
                    />
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>{" "}
                Starts Here
              </h1>

              <p
                className="text-xl text-muted-foreground leading-relaxed max-w-xl"
                style={{ fontFamily: "Google Sans, sans-serif", fontWeight: 500 }}
              >
                Take control of your finances with personalized budgeting, smart
                investment recommendations, and real-time financial insights.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 backdrop-blur-sm border border-border/50">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Smart Investing</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 backdrop-blur-sm border border-border/50">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Secure & Private</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  onClick={handleStartJourney}
                  className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/50"
                >
                  <span className="relative z-10 flex items-center">
                    Start Your Journey
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={learninghub}
                  className="group border-2 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300"
                >
                  Learn More
                  <ArrowRight className="ml-2 w-0 group-hover:w-4 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </Button>
              </div>
            </div>


            {/* Right Illustration - Carousel */}
            <div className="relative animate-scale-in">
              <Carousel />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;