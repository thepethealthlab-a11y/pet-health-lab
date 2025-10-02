import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-lab.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-subtle overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img 
          src={heroImage} 
          alt="Pet Health Laboratory" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            AI-Powered Pet Health Analysis
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
            The Pet Health Lab - 
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              AI-Powered Pet Care Education
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl font-semibold text-foreground max-w-3xl mx-auto mb-4">
            Research-Backed Tools & Educational Resources for Pet Parents
          </p>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Get AI-powered insights about pet health. Educational tools to help you understand your pet better. Always consult your veterinarian for medical advice.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button variant="hero" size="lg" asChild>
              <Link to="/tools">
                Explore Free Tools
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/premium">View Premium Features</Link>
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              <span>Used by 50,000+ Pet Parents</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              <span>Research-Backed Information</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              <span>Educational Resources Only</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
