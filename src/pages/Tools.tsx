import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Microscope, Activity, FileText, Search, Heart, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";

const Tools = () => {
  const freeTools = [
    {
      icon: Activity,
      title: "Symptom Tracker",
      description: "Track and monitor your pet's symptoms over time with our educational tracking tool.",
      link: "/tools/symptom-tracker"
    },
    {
      icon: FileText,
      title: "Health Journal",
      description: "Keep a comprehensive health journal for your pet's wellness journey.",
      link: "/tools/health-journal"
    },
    {
      icon: Search,
      title: "Symptom Checker",
      description: "Educational information about common pet symptoms. Not a diagnostic tool.",
      link: "/tools/symptom-checker"
    },
    {
      icon: Heart,
      title: "Wellness Tips",
      description: "Research-backed tips for maintaining your pet's overall wellness.",
      link: "/tools/wellness-tips"
    },
    {
      icon: Stethoscope,
      title: "Care Guide",
      description: "Comprehensive guides for different pet breeds and health conditions.",
      link: "/tools/care-guide"
    },
    {
      icon: Microscope,
      title: "AI Health Insights",
      description: "Get educational insights about pet health based on research data.",
      link: "/tools/ai-insights"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16 space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Free Pet Health Tools
            </h1>
            <p className="text-xl text-muted-foreground">
              Educational resources and tracking tools for informed pet care decisions.
              Always consult your veterinarian for medical advice.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {freeTools.map((tool, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow animate-fade-in">
                <CardHeader>
                  <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                    <tool.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{tool.title}</CardTitle>
                  <CardDescription className="text-base">{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" asChild className="w-full">
                    <Link to={tool.link}>Explore Tool</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center bg-muted/30 rounded-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Need More Advanced Features?</h2>
            <p className="text-muted-foreground mb-6">
              Upgrade to Premium for AI-powered analysis, personalized recommendations, and more.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/premium">View Premium Tools</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Tools;
