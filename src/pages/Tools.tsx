import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Apple,
  Utensils,
  Syringe,
  CreditCard,
  Megaphone,
  AlertCircle,
  Brain,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";

const Tools = () => {
  useSEO({
    title: "Pet Health Tools - AI-Powered Pet Care | ThePetHealthLab",
    description:
      "All pet health tools available to every user. Free monthly usage on AI features, unlimited with Premium.",
    keywords: "pet health tools, pet symptom checker, toxic food scanner, pet behavior, vaccination tracker",
    canonical: "https://pet-health-lab.lovable.app/tools",
    schema: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Pet Health Tools",
      description: "Educational pet health tools and resources",
      url: "https://pet-health-lab.lovable.app/tools",
    },
  });

  const tools = [
    {
      icon: AlertTriangle,
      title: "Pet Symptom Information Guide",
      description: "AI-powered educational analysis of symptoms with urgency guidance.",
      badge: "3 free / month",
      badgeVariant: "secondary" as const,
      buttonText: "Check Symptoms",
      link: "/tools/symptom-checker",
    },
    {
      icon: Brain,
      title: "Pet Behaviour Solver",
      description: "Get structured causes, solutions, and escalation signals for behaviour issues.",
      badge: "3 free / month",
      badgeVariant: "secondary" as const,
      buttonText: "Solve Behaviour",
      link: "/tools/pet-behavior-problem-solver",
    },
    {
      icon: Apple,
      title: "Toxic Food Database",
      description: "Search foods that are unsafe for pets. Always verify with your vet.",
      badge: "Unlimited & Free",
      badgeVariant: "default" as const,
      buttonText: "Search Foods",
      link: "/tools/toxic-food-scanner",
    },
    {
      icon: Utensils,
      title: "Daily Calorie Calculator",
      description: "Calculate ideal daily calories and portions for your pet.",
      badge: "Free for 1 pet",
      badgeVariant: "secondary" as const,
      buttonText: "Calculate Now",
      link: "/tools/food-planner",
    },
    {
      icon: Syringe,
      title: "Vaccination Schedule Tracker",
      description: "Track vaccinations and health checkup reminders.",
      badge: "Free (email reminders)",
      badgeVariant: "secondary" as const,
      buttonText: "Start Tracking",
      link: "/tools/vaccine-scheduler",
    },
    {
      icon: CreditCard,
      title: "Pet Expense Tracker",
      description: "Track all pet spending and see monthly totals.",
      badge: "Free (basic)",
      badgeVariant: "secondary" as const,
      buttonText: "Track Expenses",
      link: "/tools/cost-calculator",
    },
    {
      icon: Megaphone,
      title: "Lost Pet Poster Maker",
      description: "Create instant lost pet posters and alerts.",
      badge: "Free templates",
      badgeVariant: "default" as const,
      buttonText: "Create Alert",
      link: "/tools/lost-pet-generator",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <header className="max-w-4xl mx-auto text-center mb-8 space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">Pet Health Tools</h1>
            <p className="text-xl text-muted-foreground">
              Every tool is available to every user. Free plan includes a monthly usage allowance —
              upgrade any time for unlimited access.
            </p>

            {/* Disclaimer Banner */}
            <div className="bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-400 dark:border-amber-600 rounded-lg p-4 flex items-center gap-3 max-w-3xl mx-auto">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <p className="text-amber-900 dark:text-amber-200 font-medium text-left">
                ⚠️ Educational use only - Always consult your veterinarian
              </p>
            </div>
          </header>

          <section
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-16"
            aria-label="Pet health tools"
          >
            {tools.map((tool, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in relative"
                style={{ animationDelay: `${index * 50}ms` }}
                itemScope
                itemType="https://schema.org/SoftwareApplication"
              >
                <Badge variant={tool.badgeVariant} className="absolute top-4 right-4 z-10">
                  {tool.badge}
                </Badge>

                <CardHeader>
                  <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit" aria-hidden="true">
                    <tool.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl pr-20" itemProp="name">
                    {tool.title}
                  </CardTitle>
                  <CardDescription className="text-base" itemProp="description">
                    {tool.description}
                  </CardDescription>
                  <meta itemProp="applicationCategory" content="HealthApplication" />
                  <meta itemProp="operatingSystem" content="Web" />
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full hover-scale">
                    <Link to={tool.link}>{tool.buttonText}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </section>

          <aside className="mt-16 text-center bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-10 max-w-4xl mx-auto border border-primary/20">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <Sparkles className="h-3 w-3" /> Premium
            </div>
            <h2 className="text-3xl font-bold mb-4 text-foreground">Hit your free limit?</h2>
            <p className="text-muted-foreground mb-6 text-lg">
              Upgrade to Premium for unlimited AI analyses, SMS reminders, multi-pet management and more.
            </p>
            <Button size="lg" asChild className="hover-scale">
              <Link to="/pricing">Subscribe to Premium</Link>
            </Button>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Tools;
