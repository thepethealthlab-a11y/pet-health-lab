import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-lab.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-subtle overflow-hidden" aria-label="Hero section">
      <div className="absolute inset-0 opacity-10">
        <img 
          src={heroImage} 
          alt="Modern pet health laboratory with advanced AI technology for analyzing pet health and wellness" 
          className="w-full h-full object-cover"
          loading="eager"
          {...{ fetchpriority: "high" }}
          width="1920"
          height="1080"
        />
      </div>
      
      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
            Understand Your Pet's Health in 
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Seconds
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            AI-powered tools for informed pet care. Trusted by 10,000+ pet parents.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" asChild className="hover-scale">
              <Link to="/tools/symptom-checker">
                Check Symptoms Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="hover-scale">
              <Link to="/free-tools">Browse All Tools</Link>
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 pt-8 text-sm md:text-base text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary" />
              <span className="font-medium">Veterinarian Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary" />
              <span className="font-medium">Research-Backed</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary" />
              <span className="font-medium">50,000+ Checks Done</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
