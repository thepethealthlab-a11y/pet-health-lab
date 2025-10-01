import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with basic pet health tracking",
      features: [
        "Basic symptom tracking",
        "Health journal",
        "Educational articles",
        "Community forum access",
        "Care guides",
        "Email support"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Premium",
      price: "$19",
      period: "per month",
      description: "Advanced AI-powered features for comprehensive pet care",
      features: [
        "Everything in Free",
        "AI health analysis",
        "Predictive insights",
        "Smart reminders",
        "Priority alerts",
        "Comprehensive reports",
        "Personalized recommendations",
        "Priority support",
        "Ad-free experience"
      ],
      cta: "Start 14-Day Free Trial",
      popular: true
    },
    {
      name: "Family",
      price: "$39",
      period: "per month",
      description: "For households with multiple pets",
      features: [
        "Everything in Premium",
        "Up to 5 pets",
        "Family sharing",
        "Veterinarian collaboration tools",
        "Advanced analytics",
        "Custom care plans",
        "Dedicated account manager",
        "Video consultation credits"
      ],
      cta: "Start 14-Day Free Trial",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16 space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground">
              Choose the plan that's right for you and your pets. All plans include a 14-day money-back guarantee.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`hover:shadow-lg transition-all animate-fade-in relative ${
                  plan.popular ? 'border-primary shadow-lg scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-primary text-primary-foreground px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8 pt-8">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">/ {plan.period}</span>
                  </div>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant={plan.popular ? "hero" : "outline"} 
                    className="w-full" 
                    size="lg"
                    asChild
                  >
                    <Link to="/signup">{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
                  <p className="text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                  <p className="text-muted-foreground">We accept all major credit cards, PayPal, and Apple Pay.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Is there a long-term contract?</h3>
                  <p className="text-muted-foreground">No, all plans are month-to-month. Cancel anytime with no penalties.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Are these tools a replacement for veterinary care?</h3>
                  <p className="text-muted-foreground">No, our tools provide educational information only. Always consult your veterinarian for medical diagnosis and treatment.</p>
                </div>
              </CardContent>
            </Card>

            <div className="text-center bg-gradient-subtle rounded-lg p-12 border border-border">
              <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Our team is here to help you choose the right plan for your needs.
              </p>
              <Button variant="outline" size="lg">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
