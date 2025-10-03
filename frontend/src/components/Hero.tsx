import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import hero from "../assets/videos/hero-video.mp4";
import FinancialChatbot from "./FinancialChatbot";

const Hero = () => {
  return (
    <>
    <FinancialChatbot/>
    <section className="pt-32 pb-20 px-4 lg:px-8">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Your{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent "
                style={{ fontFamily: "Google Sans, sans-serif", fontWeight: 800 }}>
                Financial Future
              </span>{" "}
              Starts Here
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed"
              style={{ fontFamily: "Google Sans, sans-serif", fontWeight: 500 }}>
              Take control of your finances with personalized budgeting,
              smart investment recommendations, and real-time financial insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg">
                Start Your Journey
                <ArrowRight className="ml-2" />
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative animate-scale-in">
            <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full"></div>
            <video
              src={hero}
              className="relative z-10 w-full h-auto rounded-2xl shadow-xl"
              autoPlay
              loop
              muted
              playsInline
            />

          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default Hero;
