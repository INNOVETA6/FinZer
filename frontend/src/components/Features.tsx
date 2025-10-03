import { Wallet, TrendingUp, Lightbulb, Bell } from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Budget Planning",
    description:
      "Create personalized budgets and track your spending effortlessly with intuitive tools.",
    gradient: "from-primary to-accent",
  },
  {
    icon: TrendingUp,
    title: "Smart Investments",
    description:
      "Get AI-powered investment recommendations tailored to your financial goals and risk tolerance.",
    gradient: "from-secondary to-accent",
  },
  {
    icon: Lightbulb,
    title: "Financial Insights",
    description:
      "Receive actionable insights and analytics to make informed financial decisions.",
    gradient: "from-accent to-purple",
  },
  {
    icon: Bell,
    title: "Alerts & Reminders",
    description:
      "Stay on top of bills, savings goals, and important financial milestones with smart notifications.",
    gradient: "from-purple to-primary",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 mt-7 px-4 lg:px-8 bg-muted/30" style={{ fontFamily: "Google Sans, sans-serif", fontWeight: 500 }}>


      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4"
          style={{ fontFamily: "Google Sans, sans-serif", fontWeight: 800 }}>

          <h2 className="text-4xl lg:text-6xl font-extrabold">
            Everything You Need to{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Succeed Financially
            </span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed"
            style={{ fontFamily: "Google Sans, sans-serif", fontWeight: 500 }}>
            Powerful features designed to simplify your financial journey and help you achieve your goals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group bg-card rounded-2xl p-8 shadow-md border border-border 
    transform transition-all duration-500 ease-in-out
    hover:shadow-2xl hover:-translate-y-2  hover:scale-105
    hover:brightness-80 hover:z-6
  `}
            >
              <div
                className={`
      w-14 h-14 rounded-xl 
      bg-gradient-to-br 
      ${feature.gradient} 
      flex items-center justify-center mb-6 
      group-hover:scale-125
      group-hover:shadow-lg
      transition-transform duration-500 ease-in-out
      group-hover:brightness-100
      group-hover:animate-pulse-slow
    `}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed" >{feature.description}</p>
            </div>

          ))}

        </div>
      </div>
    </section>
  );
};

export default Features;
