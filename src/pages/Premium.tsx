import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Calendar, Bell, FileBarChart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Premium = () => {
  const premiumTools = [
    {
      icon: Brain,
      title: "AI Health Analysis",
      description: "Advanced AI-powered analysis of your pet's health patterns and trends.",
      badge: "Premium"
    },
    {
      icon: TrendingUp,
      title: "Predictive Insights",
      description: "Data-driven predictions about potential health considerations based on patterns.",
      badge: "Premium"
    },
    {
      icon: Calendar,
      title: "Smart Reminders",
      description: "Automated reminders for medications, vet visits, and wellness checkups.",
      badge: "Premium"
    },
    {
      icon: Bell,
      title: "Priority Alerts",
      description: "Get notified about significant health pattern changes requiring attention.",
      badge: "Premium"
    },
    {
      icon: FileBarChart,
      title: "Comprehensive Reports",
      description: "Detailed health reports you can share with your veterinarian.",
      badge: "Premium"
    },
    {
      icon: Sparkles,
      title: "Personalized Recommendations",
      description: "Customized care suggestions based on your pet's unique health profile.",
      badge: "Premium"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16 space-y-4 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Advanced AI-Powered Features
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Premium Pet Health Tools
            </h1>
            <p className="text-xl text-muted-foreground">
              Unlock advanced AI-powered features for comprehensive pet health management.
              Educational insights enhanced by cutting-edge technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-16">
            {premiumTools.map((tool, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow animate-fade-in border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-primary rounded-lg">
                      <tool.icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <Badge variant="secondary">{tool.badge}</Badge>
                  </div>
                  <CardTitle className="text-xl">{tool.title}</CardTitle>
                  <CardDescription className="text-base">{tool.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center bg-gradient-subtle rounded-lg p-12 max-w-4xl mx-auto border border-border">
            <h2 className="text-3xl font-bold mb-4">Ready to Upgrade?</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Start your 14-day free trial and experience the full power of AI-driven pet health insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/pricing">View Pricing Plans</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/tools">Try Free Tools First</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              No credit card required • Cancel anytime • 14-day money-back guarantee
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Premium;
