import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

type BillingCycle = "monthly" | "yearly";

interface Plan {
  name: string;
  tagline: string;
  monthly: number;
  yearly: number; // per month when billed yearly
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
  highlight?: boolean;
}

const PLANS: Plan[] = [
  {
    name: "Free",
    tagline: "Start here",
    monthly: 0,
    yearly: 0,
    description: "Essential pet care tools with monthly limits.",
    features: [
      "1 pet profile",
      "Symptom Checker — 3 / month",
      "Behavior Solver — 3 / month",
      "Toxic Food Scanner — unlimited",
      "Calorie & Cost Calculators — unlimited",
      "Lost Pet Poster — unlimited",
      "Community access",
    ],
    cta: "Get started",
  },
  {
    name: "Premium",
    tagline: "Most popular",
    monthly: 2,
    yearly: 1.67,
    description: "Unlimited AI tools and tracking for one pet parent.",
    features: [
      "Up to 3 pet profiles",
      "Unlimited Symptom & Behavior checks",
      "Vaccine Tracker with reminders",
      "Expense Tracker + CSV export",
      "Food & Diet Planner",
      "Email + SMS reminders",
      "Priority support",
    ],
    cta: "Choose Premium",
    popular: true,
  },
  {
    name: "Family",
    tagline: "For households",
    monthly: 4,
    yearly: 3.33,
    description: "Share care across multiple pets and family members.",
    features: [
      "Up to 8 pet profiles",
      "Everything in Premium",
      "Share with up to 5 family members",
      "WhatsApp reminders",
      "Receipt scanning (OCR)",
      "PDF health reports",
    ],
    cta: "Choose Family",
  },
  {
    name: "Pro",
    tagline: "For vets & breeders",
    monthly: 6,
    yearly: 5,
    description: "Advanced tools for professionals and large households.",
    features: [
      "Unlimited pet profiles",
      "Everything in Family",
      "Vet collaboration workspace",
      "Custom care plans",
      "Advanced analytics",
      "Dedicated account manager",
      "Early access to new tools",
    ],
    cta: "Choose Pro",
    highlight: true,
  },
];

const Pricing = () => {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const isYearly = cycle === "yearly";

  const formatPrice = (plan: Plan) => {
    const value = isYearly ? plan.yearly : plan.monthly;
    if (value === 0) return "$0";
    return `$${Number.isInteger(value) ? value : value.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs uppercase tracking-widest text-muted-foreground mb-6"
              style={{ borderColor: "hsl(var(--hairline))" }}>
              <Sparkles className="h-3.5 w-3.5" />
              Pricing
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-light text-foreground mb-4">
              Care that scales with your family
            </h1>
            <p className="text-lg text-muted-foreground">
              Start free with limited use, or unlock unlimited tools from $2/month.
            </p>
          </div>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4 mb-14">
            <span className={`text-sm transition-colors ${!isYearly ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={(v) => setCycle(v ? "yearly" : "monthly")}
              aria-label="Toggle yearly billing"
            />
            <span className={`text-sm transition-colors ${isYearly ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              Yearly
            </span>
            <Badge variant="secondary" className="ml-1">Save ~17%</Badge>
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-20">
            {PLANS.map((plan) => (
              <Card
                key={plan.name}
                className={`relative flex flex-col transition-all hover:shadow-soft ${
                  plan.popular ? "border-primary shadow-soft" : ""
                }`}
                style={plan.popular ? undefined : { borderColor: "hsl(var(--hairline))" }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-premium text-primary-foreground px-3 py-1 text-xs uppercase tracking-wider">
                      Most popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-4 pt-8">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                    {plan.tagline}
                  </p>
                  <CardTitle className="font-display text-3xl font-light">{plan.name}</CardTitle>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="font-display text-5xl font-light">{formatPrice(plan)}</span>
                    {plan.monthly > 0 && (
                      <span className="text-muted-foreground text-sm">/mo</span>
                    )}
                  </div>
                  {isYearly && plan.monthly > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Billed ${(plan.yearly * 12).toFixed(0)}/year
                    </p>
                  )}
                  <CardDescription className="mt-3 text-sm leading-relaxed">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/90">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.popular ? "default" : "outline"}
                    className="w-full"
                    size="lg"
                    asChild
                  >
                    <Link to="/login">{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl font-light text-center mb-8">
              Common questions
            </h2>
            <div className="space-y-4">
              {[
                { q: "Can I start free?", a: "Yes — the Free tier lets you try every essential tool with monthly limits, no card required." },
                { q: "Can I cancel anytime?", a: "Cancel from your dashboard anytime. You'll keep access until the end of your billing period." },
                { q: "How much do I save with yearly?", a: "Yearly billing saves roughly 17% — about 2 months free compared to monthly." },
                { q: "Do you offer refunds?", a: "Yes — 14-day money-back guarantee on all paid plans." },
              ].map((f) => (
                <Card key={f.q} style={{ borderColor: "hsl(var(--hairline))" }}>
                  <CardContent className="p-6">
                    <h3 className="font-medium mb-2">{f.q}</h3>
                    <p className="text-sm text-muted-foreground">{f.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
