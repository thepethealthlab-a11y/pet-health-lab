import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Apple, Brain, Calculator, Megaphone, Syringe, Heart, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";

const Tools = () => {
  useSEO({
    title: "Free Pet Health Tools - AI-Powered Pet Care Analysis | ThePetHealthLab",
    description: "Access free pet health tools including symptom checker, toxic food scanner, behavior analyzer, and more. Educational resources for informed pet care decisions.",
    keywords: "pet health tools, pet symptom checker, toxic food scanner, pet behavior, vaccination tracker",
    canonical: "https://thepethealthlab.com/tools",
    schema: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Free Pet Health Tools",
      "description": "Educational pet health tools and resources",
      "url": "https://thepethealthlab.com/tools"
    }
  });
  const freeTools = [
    {
      icon: AlertTriangle,
      title: "Emergency Symptom Checker",
      description: "Educational tool to learn about pet symptoms and when to consult your veterinarian",
      link: "/tools/symptom-checker"
    },
    {
      icon: Apple,
      title: "Toxic Food Scanner",
      description: "Learn about potentially harmful foods for pets. Always verify with your vet",
      link: "/tools/food-scanner"
    },
    {
      icon: Brain,
      title: "Behavior Problem Solver",
      description: "Understand pet behavior patterns and get training insights",
      link: "/tools/behavior-solver"
    },
    {
      icon: Calculator,
      title: "Pet Cost Calculator",
      description: "Plan your pet care budget with our cost estimation tool",
      link: "/tools/cost-calculator"
    },
    {
      icon: Megaphone,
      title: "Lost Pet Alert Generator",
      description: "Create instant lost pet posters and alerts",
      link: "/tools/lost-pet-alert"
    },
    {
      icon: Syringe,
      title: "Vaccination Scheduler",
      description: "Track vaccination schedules and get reminders",
      link: "/tools/vaccination-scheduler"
    },
    {
      icon: Heart,
      title: "First Aid Guide",
      description: "Educational first aid information for pet emergencies",
      link: "/tools/first-aid"
    },
    {
      icon: Shield,
      title: "Home Safety Scanner",
      description: "Check your home for potential pet hazards",
      link: "/tools/home-safety"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <header className="max-w-4xl mx-auto text-center mb-16 space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Free Pet Health Tools
            </h1>
            <p className="text-xl text-muted-foreground">
              Educational resources and tracking tools for informed pet care decisions.
            </p>
            <p className="text-lg text-muted-foreground font-semibold mt-2">
              Educational use only - Always consult your veterinarian
            </p>
          </header>

          <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto" aria-label="Pet health tools">
            {freeTools.map((tool, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow animate-fade-in" itemScope itemType="https://schema.org/SoftwareApplication">
                <CardHeader>
                  <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit" aria-hidden="true">
                    <tool.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl" itemProp="name">{tool.title}</CardTitle>
                  <CardDescription className="text-base" itemProp="description">{tool.description}</CardDescription>
                  <meta itemProp="applicationCategory" content="HealthApplication" />
                  <meta itemProp="operatingSystem" content="Web" />
                </CardHeader>
                <CardContent>
                  <Button variant="outline" asChild className="w-full">
                    <Link to={tool.link}>
                      {tool.title === "Emergency Symptom Checker" && "Use Educational Tool"}
                      {tool.title === "Toxic Food Scanner" && "Check Food Safety"}
                      {tool.title === "Behavior Problem Solver" && "Analyze Behavior"}
                      {tool.title === "Pet Cost Calculator" && "Calculate Costs"}
                      {tool.title === "Lost Pet Alert Generator" && "Create Alert"}
                      {tool.title === "Vaccination Scheduler" && "Set Schedule"}
                      {tool.title === "First Aid Guide" && "Learn First Aid"}
                      {tool.title === "Home Safety Scanner" && "Scan Home Safety"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </section>

          <aside className="mt-16 text-center bg-muted/30 rounded-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Need More Advanced Features?</h2>
            <p className="text-muted-foreground mb-6">
              Upgrade to Premium for AI-powered analysis, personalized recommendations, and more.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/premium">View Premium Tools</Link>
            </Button>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Tools;
