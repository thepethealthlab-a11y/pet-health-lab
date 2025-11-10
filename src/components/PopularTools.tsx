import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Apple, Syringe } from "lucide-react";
import { Link } from "react-router-dom";

const PopularTools = () => {
  const tools = [
    {
      icon: AlertTriangle,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      title: "Pet Symptom Guide",
      description: "Is it urgent? Get educational information about symptoms in seconds.",
      buttonText: "Check Now",
      link: "/tools/symptom-checker"
    },
    {
      icon: Apple,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      title: "Toxic Food Database",
      description: "Safe to eat? Check 200+ foods instantly.",
      buttonText: "Search Foods",
      link: "/tools/toxic-food"
    },
    {
      icon: Syringe,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      title: "Vaccine Tracker",
      description: "Never miss important vaccinations with smart reminders.",
      buttonText: "Start Tracking",
      link: "/tools/vaccine-tracker"
    }
  ];

  return (
    <section className="py-20 bg-background" aria-label="Popular pet health tools">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Popular Tools
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to stay informed about your pet's health
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Card 
                key={index} 
                className="bg-card border border-border shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
              >
                <CardHeader className="space-y-4">
                  <div className={`w-14 h-14 rounded-lg ${tool.iconBg} flex items-center justify-center`}>
                    <Icon className={`h-7 w-7 ${tool.iconColor}`} />
                  </div>
                  <CardTitle className="text-xl font-bold">
                    {tool.title}
                  </CardTitle>
                  <CardDescription className="text-base text-muted-foreground">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button asChild className="w-full hover-scale">
                    <Link to={tool.link}>
                      {tool.buttonText}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PopularTools;
