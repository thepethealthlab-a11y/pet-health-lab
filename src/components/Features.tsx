import { AlertTriangle, Apple, Brain, Syringe, Calculator, Heart } from "lucide-react";

const features = [
  {
    icon: AlertTriangle,
    title: "AI Symptom Checker",
    description: "Learn about symptoms and understand when it's time to consult your veterinarian with our educational AI tool.",
  },
  {
    icon: Apple,
    title: "Toxic Food Scanner",
    description: "Educational food safety information to help you learn about potentially harmful foods for your pets.",
  },
  {
    icon: Brain,
    title: "Behavior Decoder",
    description: "Understand pet behavior patterns and get insights into training approaches and behavioral science.",
  },
  {
    icon: Syringe,
    title: "Vaccination Tracker",
    description: "Schedule reminders and keep track of your pet's vaccination history and upcoming appointments.",
  },
  {
    icon: Calculator,
    title: "Cost Calculator",
    description: "Budget planning tools to help you estimate and prepare for pet care expenses throughout the year.",
  },
  {
    icon: Heart,
    title: "First Aid Guide",
    description: "Emergency information and educational resources for common pet first aid situations.",
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
