import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ToolsPreview from "@/components/ToolsPreview";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { useSEO } from "@/hooks/useSEO";

const Index = () => {
  useSEO({
    title: "ThePetHealthLab - AI-Powered Pet Care & Health Analysis Platform",
    description: "Advanced AI technology meets veterinary science. Get instant pet health insights, symptom analysis, and personalized care recommendations. Trusted by 50,000+ pet parents.",
    keywords: "pet health, AI pet care, veterinary AI, pet symptoms, dog health, cat health, pet wellness",
    canonical: "https://thepethealthlab.com/",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "ThePetHealthLab",
      "url": "https://thepethealthlab.com",
      "description": "AI-powered pet health analysis and educational platform",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://thepethealthlab.com/tools?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <Features />
        <ToolsPreview />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
