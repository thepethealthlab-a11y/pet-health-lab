import { Brain, Shield, Clock, TrendingUp, Users, Award } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced machine learning algorithms trained on millions of veterinary records to provide accurate health insights.",
  },
  {
    icon: Shield,
    title: "Veterinary Approved",
    description: "All our tools and recommendations are reviewed and approved by licensed veterinarians.",
  },
  {
    icon: Clock,
    title: "Instant Results",
    description: "Get immediate health insights and recommendations without waiting for appointments.",
  },
  {
    icon: TrendingUp,
    title: "Health Tracking",
    description: "Monitor your pet's health trends over time with comprehensive tracking and analytics.",
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Connect with other pet parents and share experiences in our supportive community.",
  },
  {
    icon: Award,
    title: "Trusted Platform",
    description: "Used by thousands of pet parents and recommended by veterinary professionals.",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why Pet Parents Trust Us
          </h2>
          <p className="text-lg text-muted-foreground">
            Combining cutting-edge AI technology with veterinary expertise to give you 
            the best care insights for your pets.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex p-3 bg-gradient-primary rounded-lg mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
