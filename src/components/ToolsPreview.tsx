import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Stethoscope, 
  Heart, 
  Activity, 
  Thermometer, 
  AlertCircle, 
  Calendar,
  Pill,
  FileText,
  Sparkles,
  Crown
} from "lucide-react";

const freeTools = [
  {
    icon: Stethoscope,
    title: "Symptom Checker",
    description: "Analyze symptoms and get preliminary health insights",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Heart,
    title: "Vital Signs Monitor",
    description: "Track heart rate, breathing, and temperature",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    icon: Activity,
    title: "Behavior Analyzer",
    description: "Understand unusual pet behaviors and patterns",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: Calendar,
    title: "Vaccination Tracker",
    description: "Never miss important vaccination schedules",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
];

const premiumTools = [
  {
    icon: Thermometer,
    title: "Advanced Diagnostics",
    description: "Deep health analysis with AI recommendations",
    isPremium: true,
  },
  {
    icon: AlertCircle,
    title: "Emergency Protocol",
    description: "Step-by-step guidance for emergencies",
    isPremium: true,
  },
  {
    icon: Pill,
    title: "Medication Manager",
    description: "Smart reminders and interaction checker",
    isPremium: true,
  },
  {
    icon: FileText,
    title: "Health Reports",
    description: "Comprehensive health reports for your vet",
    isPremium: true,
  },
];

const ToolsPreview = () => {
  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Free Tools Section */}
        <div className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full text-secondary text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Free Tools
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Essential Pet Care Tools
            </h2>
            <p className="text-lg text-muted-foreground">
              Start with our free tools to monitor and understand your pet's health
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {freeTools.map((tool, index) => (
              <div
                key={index}
                className="group p-6 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`inline-flex p-3 ${tool.bgColor} rounded-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <tool.icon className={`h-6 w-6 ${tool.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {tool.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {tool.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button variant="default" size="lg" asChild>
              <Link to="/tools">View All Free Tools</Link>
            </Button>
          </div>
        </div>

        {/* Premium Tools Section */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-primary border border-primary/20 rounded-full text-primary-foreground text-sm font-medium mb-4">
              <Crown className="h-4 w-4" />
              Premium Tools
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Advanced Health Monitoring
            </h2>
            <p className="text-lg text-muted-foreground">
              Unlock professional-grade tools for comprehensive pet health management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {premiumTools.map((tool, index) => (
              <div
                key={index}
                className="group p-6 bg-card rounded-xl border-2 border-primary/30 hover:border-primary hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute top-2 right-2">
                  <Crown className="h-5 w-5 text-primary" />
                </div>
                <div className="inline-flex p-3 bg-gradient-primary rounded-lg mb-4 group-hover:scale-110 transition-transform">
                  <tool.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {tool.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {tool.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/premium">Explore Premium Features</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToolsPreview;
