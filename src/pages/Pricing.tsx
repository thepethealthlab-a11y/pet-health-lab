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
        "7 Educational Tools",
        "Symptom Guide (3 checks/month)",
        "Toxic Food Scanner (unlimited)",
        "Calorie Calculator (1 pet)",
        "Vaccine Tracker (email reminders)",
        "Expense Tracker (basic)",
        "Lost Pet Generator",
        "Vet Finder",
        "1 Pet Profile",
        "Health Journal",
        "Educational Articles",
        "Basic Community Access",
        "Standard Support"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Premium",
      price: "$8.99",
      period: "per month",
      yearlyNote: "or $89/year",
      description: "Advanced AI-powered features for comprehensive pet care",
      features: [
        "All 10 Tools Unlimited",
        "Unlimited Symptom Checks",
        "Advanced Features in all tools",
        "Priority Support (24hr response)",
        "5 Pet Profiles",
        "AI Health Analysis",
        "Predictive Insights",
        "Smart Reminders (SMS + Email)",
        "Comprehensive Reports (PDF export)",
        "Receipt Scanning (OCR)",
        "Budget Alerts & Trends",
        "Ad-free Experience"
      ],
      cta: "Start 14-Day Free Trial",
      popular: true
    },
    {
      name: "Family",
      price: "$15.99",
      period: "per month",
      description: "For households with multiple pets",
      features: [
        "Everything in Premium",
        "Unlimited Pet Profiles",
        "Family Member Sharing (up to 5 members)",
        "Veterinarian Collaboration Tools",
        "Advanced Analytics Dashboard",
        "Custom Care Plans",
        "Dedicated Account Manager",
        "Priority Feature Requests"
      ],
      cta: "Start 14-Day Free Trial",
      popular: false
    }
  ];

  const faqs = [
    {
      question: "Can I cancel anytime?",
      answer: "Yes, cancel anytime with no questions asked. Your data stays accessible."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and Apple Pay via Lemon Squeezy."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! Premium and Family plans include a 14-day free trial. No credit card required."
    },
    {
      question: "What if I have more than 5 pets?",
      answer: "Contact us for a custom enterprise plan tailored to your needs."
    },
    {
      question: "Can I switch plans?",
      answer: "Yes, upgrade or downgrade anytime. Changes take effect immediately."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, 14-day money-back guarantee on all paid plans, no questions asked."
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
                    {plan.yearlyNote && (
                      <div className="text-sm text-muted-foreground mt-1">{plan.yearlyNote}</div>
                    )}
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
                    variant={plan.name === "Free" ? "outline" : "default"} 
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

          <div className="max-w-5xl mx-auto space-y-16">
            {/* FAQ Section */}
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index}>
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Ready to Upgrade Banner */}
            <div className="text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-12 border border-primary/20">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Ready to Upgrade?</h2>
              <Button size="lg" asChild className="hover-scale">
                <Link to="/pricing">See Pricing Plans</Link>
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
