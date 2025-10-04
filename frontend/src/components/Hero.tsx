import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FinancialChatbot from "./FinancialChatbot";
import Carousel from "./Carousel";

const Hero = () => {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    navigate('/sign-up');
  };

  const learninghub = () => {
    navigate('/learning-hub');
  };

  return (
    <>
      <section className="pt-10 pb-20 px-4 lg:px-8">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Your{" "}
                <span
                  className="bg-gradient-hero bg-clip-text text-transparent"
                  style={{ fontFamily: "Google Sans, sans-serif", fontWeight: 800 }}
                >
                  Financial Future
                </span>{" "}
                Starts Here
              </h1>
              <p
                className="text-xl text-muted-foreground leading-relaxed"
                style={{ fontFamily: "Google Sans, sans-serif", fontWeight: 500 }}
              >
                Take control of your finances with personalized budgeting, smart
                investment recommendations, and real-time financial insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={handleStartJourney}>
                  Start Your Journey
                  <ArrowRight className="ml-2" />
                </Button>
                <Button variant="outline" size="lg" onClick={learninghub}>
                  Learn More
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