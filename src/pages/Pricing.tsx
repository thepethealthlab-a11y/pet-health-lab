import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Testimonials from "@/components/Testimonials";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with basic pet health tracking",
      features: [
        "8 Educational Tools",
        "Basic Community Access",
        "Standard Support",
        "1 Pet Profile",
        "Health journal",
        "Educational articles"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Premium",
      price: "$8.99",
      period: "per month",
      description: "Advanced AI-powered features for comprehensive pet care",
      features: [
        "All 14 Tools Unlimited",
        "Advanced Features",
        "Priority Support",
        "5 Pet Profiles",
        "AI health analysis",
        "Predictive insights",
        "Smart reminders",
        "Comprehensive reports",
        "Ad-free experience"
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
        "Family Member Sharing",
        "Veterinarian collaboration tools",
        "Advanced analytics",
        "Custom care plans",
        "Dedicated account manager"
      ],
      cta: "Start 14-Day Free Trial",
      popular: false
    }
  ];

  const comparisonFeatures = [
    { feature: "Educational Tools", free: "8 Tools", premium: "14 Tools", family: "14 Tools" },
    { feature: "Pet Profiles", free: "1", premium: "5", family: "Unlimited" },
    { feature: "Community Access", free: true, premium: true, family: true },
    { feature: "Health Journal", free: true, premium: true, family: true },
    { feature: "AI Health Analysis", free: false, premium: true, family: true },
    { feature: "Predictive Insights", free: false, premium: true, family: true },
    { feature: "Priority Support", free: false, premium: true, family: true },
    { feature: "Advanced Analytics", free: false, premium: false, family: true },
    { feature: "Family Sharing", free: false, premium: false, family: true },
    { feature: "Vet Collaboration", free: false, premium: false, family: true },
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

          <div className="max-w-6xl mx-auto space-y-16">
            {/* Feature Comparison Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl text-center">Feature Comparison</CardTitle>
                <CardDescription className="text-center text-base">
                  Compare all features across our plans to find the perfect fit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">Feature</TableHead>
                        <TableHead className="text-center">Free</TableHead>
                        <TableHead className="text-center">Premium</TableHead>
                        <TableHead className="text-center">Family</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comparisonFeatures.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{row.feature}</TableCell>
                          <TableCell className="text-center">
                            {typeof row.free === 'boolean' ? (
                              row.free ? <Check className="h-5 w-5 text-primary mx-auto" /> : <X className="h-5 w-5 text-muted-foreground mx-auto" />
                            ) : (
                              <span>{row.free}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {typeof row.premium === 'boolean' ? (
                              row.premium ? <Check className="h-5 w-5 text-primary mx-auto" /> : <X className="h-5 w-5 text-muted-foreground mx-auto" />
                            ) : (
                              <span>{row.premium}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {typeof row.family === 'boolean' ? (
                              row.family ? <Check className="h-5 w-5 text-primary mx-auto" /> : <X className="h-5 w-5 text-muted-foreground mx-auto" />
                            ) : (
                              <span>{row.family}</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

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

      <Testimonials />

      <Footer />
    </div>
  );
};

export default Pricing;
