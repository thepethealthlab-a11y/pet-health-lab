import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, Bell, Users, CreditCard, MessageSquare, Sparkles, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";

const Premium = () => {
  useSEO({
    title: "Premium Pet Health Tools - Advanced AI Features | ThePetHealthLab",
    description: "Unlock unlimited symptom checks, health analytics, smart reminders, and multi-pet management. Premium AI-powered pet health tools for comprehensive care.",
    keywords: "premium pet health, pet health analytics, unlimited symptom checks, multi-pet manager, pet health AI",
    canonical: "https://pet-health-lab.lovable.app/premium"
  });

  const premiumTools = [
    {
      icon: AlertTriangle,
      title: "UNLIMITED SYMPTOM ANALYSIS",
      freeFeatures: "3 checks/month",
      premiumFeatures: "Unlimited AI-powered analysis, detailed reports, symptom history tracking",
      buttonText: "Get Unlimited Access"
    },
    {
      icon: TrendingUp,
      title: "HEALTH ANALYTICS DASHBOARD",
      freeFeatures: "Basic tracking",
      premiumFeatures: "AI-powered health predictions, trend analysis, export vet reports",
      buttonText: "Get Advanced Insights"
    },
    {
      icon: Bell,
      title: "SMART SMS REMINDERS",
      freeFeatures: "Email reminders only",
      premiumFeatures: "SMS + WhatsApp + Email reminders, custom schedules",
      buttonText: "Enable Smart Alerts"
    },
    {
      icon: Users,
      title: "MULTI-PET FAMILY MANAGER",
      freeFeatures: "1 pet profile",
      premiumFeatures: "Up to 5 pets, family sharing, unified calendar",
      buttonText: "Manage Multiple Pets"
    },
    {
      icon: CreditCard,
      title: "EXPENSE TRACKING PRO",
      freeFeatures: "Manual entry, basic reports",
      premiumFeatures: "Receipt scanning (OCR), budget alerts, tax reports, trends",
      buttonText: "Get Pro Features"
    },
    {
      icon: MessageSquare,
      title: "PRIORITY SUPPORT",
      freeFeatures: "Standard email support",
      premiumFeatures: "Priority email response within 24 hours, early feature access",
      buttonText: "Get Priority Help"
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
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in border-primary/20 relative"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Badge 
                  className="absolute top-4 right-4 z-10 bg-green-600 hover:bg-green-700 text-white"
                >
                  Premium
                </Badge>
                
                <CardHeader>
                  <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                    <tool.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl mb-6 pr-20">{tool.title}</CardTitle>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex gap-3">
                      <X className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Free tier:</p>
                        <p className="text-sm text-muted-foreground">{tool.freeFeatures}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Premium:</p>
                        <p className="text-sm text-foreground">{tool.premiumFeatures}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full hover-scale" asChild>
                    <Link to="/pricing">{tool.buttonText}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-12 max-w-4xl mx-auto border border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Ready to Upgrade?</h2>
            <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
              Join thousands of pet parents using premium tools for comprehensive pet health management.
            </p>
            <Button size="lg" asChild className="hover-scale">
              <Link to="/pricing">See Pricing Plans</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Premium;
