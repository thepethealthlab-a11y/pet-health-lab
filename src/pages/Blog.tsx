import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";


import { useSEO } from "@/hooks/useSEO";

const Blog = () => {
  useSEO({
    title: "Pet Health Blog — Educational Resources",
    description: "Research-backed articles, expert insights, and educational resources for informed pet care, behavior, nutrition and safety.",
    canonical: "https://pet-health-lab.lovable.app/blog",
    schema: {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "ThePetHealthLab Blog",
      "url": "https://pet-health-lab.lovable.app/blog",
      "description": "Educational pet health, behavior and nutrition articles.",
    },
  });

  const categories = [
    "Pet Health Education",
    "Behavior & Training",
    "Nutrition & Diet",
    "Safety & Emergency"
  ];

  const blogPosts = [
    {
      title: "Understanding Common Pet Symptoms - Educational Guide",
      excerpt: "Learn about the most common health symptoms in pets and when to consult your veterinarian. Educational information to help you understand what to watch for in your pet's health.",
      category: "Pet Health Education",
      date: "March 15, 2024",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=400&fit=crop",
      toolLinks: ["AI Symptom Checker", "First Aid Guide"],
      relatedArticles: [1, 4]
    },
    {
      title: "Toxic Foods Every Pet Owner Should Know About",
      excerpt: "Complete guide to foods that can be harmful to pets. Learn which common household foods to keep away from your furry friends and what to do in case of ingestion.",
      category: "Safety & Emergency",
      date: "March 12, 2024",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1530041539828-114de669390e?w=800&h=400&fit=crop",
      toolLinks: ["Toxic Food Scanner", "First Aid Guide"],
      relatedArticles: [2, 0]
    },
    {
      title: "How to Create a Pet-Friendly Home Environment",
      excerpt: "Transform your home into a safe and comfortable space for your pets. Practical tips for pet-proofing, creating enriching environments, and ensuring your pet's wellbeing.",
      category: "Behavior & Training",
      date: "March 10, 2024",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=800&h=400&fit=crop",
      toolLinks: ["Behavior Decoder"],
      relatedArticles: [3, 1]
    },
    {
      title: "Budgeting for Pet Care - Complete Cost Breakdown",
      excerpt: "Comprehensive guide to understanding and planning for pet care expenses. From routine care to emergency funds, learn how to budget effectively for your pet's needs.",
      category: "Pet Health Education",
      date: "March 8, 2024",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=400&fit=crop",
      toolLinks: ["Cost Calculator", "Vaccination Tracker"],
      relatedArticles: [0, 4]
    },
    {
      title: "When to Visit the Vet - Helpful Guidelines",
      excerpt: "Essential guidance on recognizing when your pet needs professional veterinary care. Learn to distinguish between minor issues and situations requiring immediate attention.",
      category: "Pet Health Education",
      date: "March 5, 2024",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=400&fit=crop",
      toolLinks: ["AI Symptom Checker", "First Aid Guide"],
      relatedArticles: [0, 1]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <article className="max-w-4xl mx-auto text-center mb-12 space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Pet Health Blog
            </h1>
            <p className="text-xl text-muted-foreground">
              Research-backed articles, expert insights, and educational resources for informed pet care.
            </p>
          </article>

          <section className="max-w-7xl mx-auto mb-12" aria-label="Blog categories">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <Badge key={category} variant="secondary" className="text-sm px-4 py-2">
                  {category}
                </Badge>
              ))}
            </div>
          </section>

          <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto" aria-label="Blog articles">
            {blogPosts.map((post, index) => (
              <article key={index} className="hover:shadow-lg transition-all animate-fade-in overflow-hidden group">
                <Card className="h-full flex flex-col">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={`${post.title} - Pet health education`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                    </div>
                    <CardTitle className="text-xl leading-tight">{post.title}</CardTitle>
                    <CardDescription className="text-base">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between">
                    <div className="space-y-4 mb-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-border">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Related Tools:</p>
                        <div className="flex flex-wrap gap-2">
                          {post.toolLinks.map((tool) => (
                            <Link 
                              key={tool}
                              to="/tools" 
                              className="text-xs text-secondary hover:text-secondary/80 transition-colors underline"
                            >
                              {tool}
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border">
                        <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          Related Articles:
                        </p>
                        <div className="space-y-1">
                          {post.relatedArticles.map((relatedIndex) => (
                            <p key={relatedIndex} className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                              → {blogPosts[relatedIndex].title}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="ghost" className="w-full group/btn mt-4">
                      Read Full Article
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </article>
            ))}
          </section>

          <div className="mt-16 text-center">
            <Button variant="outline" size="lg">
              Load More Articles
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
