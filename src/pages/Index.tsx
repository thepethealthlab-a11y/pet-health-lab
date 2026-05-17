import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import PopularTools from "@/components/PopularTools";
import Features from "@/components/Features";
import ToolsPreview from "@/components/ToolsPreview";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { useSEO } from "@/hooks/useSEO";

const Index = () => {
  useSEO({
    title: "ThePetHealthLab — AI Pet Health & Care Tools",
    description: "AI-powered pet symptom checks, toxic food lookup, calorie planning and more. Educational tools trusted by 50,000+ pet parents.",
    keywords: "pet health, AI pet care, veterinary AI, pet symptoms, dog health, cat health, pet wellness",
    canonical: "https://pet-health-lab.lovable.app/",
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "name": "ThePetHealthLab",
          "url": "https://pet-health-lab.lovable.app",
          "description": "AI-powered pet health analysis and educational platform",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://pet-health-lab.lovable.app/tools?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Are these tools a replacement for veterinary care?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No, our tools provide educational information only. Always consult your veterinarian for medical diagnosis and treatment."
              }
            },
            {
              "@type": "Question",
              "name": "How accurate are your AI health insights?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our tools offer research-based educational information. For medical concerns, always consult your veterinarian."
              }
            }
          ]
        }
      ]
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <PopularTools />
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
