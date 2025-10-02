import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Shield, Activity, Utensils, Plane, Users, Sparkles, Check, X } from "lucide-react";
import { Link } from "react-router-dom";

const Premium = () => {
  const premiumTools = [
    {
      icon: Stethoscope,
      title: "24/7 VET CONNECT",
      freeFeatures: "Basic vet directory",
      premiumFeatures: "Live chat with vet assistants, emergency service finder",
      buttonText: "Get Live Help"
    },
    {
      icon: Shield,
      title: "INSURANCE COMPARISON PRO",
      freeFeatures: "Basic insurance information",
      premiumFeatures: "Real-time insurance comparisons, claim assistance",
      buttonText: "Compare Plans"
    },
    {
      icon: Activity,
      title: "ADVANCED HEALTH MONITOR",
      freeFeatures: "Basic health tracking",
      premiumFeatures: "AI-powered health predictions, trend analysis",
      buttonText: "Get Advanced Insights"
    },
    {
      icon: Utensils,
      title: "SMART FOOD PLANNER",
      freeFeatures: "7-day basic plans",
      premiumFeatures: "365-day customized meal plans, allergy management",
      buttonText: "Get Custom Plans"
    },
    {
      icon: Plane,
      title: "TRAVEL ASSISTANT",
      freeFeatures: "Basic travel search",
      premiumFeatures: "Complete travel planning, documentation help",
      buttonText: "Plan Travel"
    },
    {
      icon: Users,
      title: "MULTI-PET MANAGER",
      freeFeatures: "Single pet profile",
      premiumFeatures: "Unlimited pet profiles, family sharing",
      buttonText: "Manage Multiple Pets"
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
                    <Badge variant="secondary">Premium</Badge>
                  </div>
                  <CardTitle className="text-xl mb-6">{tool.title}</CardTitle>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex gap-3">
                      <X className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Free:</p>
                        <p className="text-sm text-muted-foreground">{tool.freeFeatures}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Check className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Premium:</p>
                        <p className="text-sm text-foreground">{tool.premiumFeatures}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="default" className="w-full" asChild>
                    <Link to="/pricing">{tool.buttonText}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center bg-gradient-subtle rounded-lg p-12 max-w-4xl mx-auto border border-border">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full text-secondary text-sm font-medium mb-6">
              ⚡ Limited Time Offer
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Unlock Premium Pet Care Today</h2>
            <p className="text-muted-foreground mb-4 text-lg max-w-2xl mx-auto">
              Join 50,000+ pet parents who trust our premium tools for comprehensive pet health management.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8 text-left max-w-3xl mx-auto">
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-secondary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">24/7 Access</p>
                  <p className="text-sm text-muted-foreground">Always available when you need it</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-secondary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">AI-Powered</p>
                  <p className="text-sm text-muted-foreground">Advanced health predictions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-secondary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Expert Support</p>
                  <p className="text-sm text-muted-foreground">Vet-reviewed resources</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/pricing">Start Free Trial - 14 Days</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/tools">Explore Free Tools</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              No credit card required • Cancel anytime • 30-day money-back guarantee
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Premium;
