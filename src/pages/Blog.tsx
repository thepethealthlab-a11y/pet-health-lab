import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Blog = () => {
  const blogPosts = [
    {
      title: "Understanding Common Pet Health Symptoms",
      excerpt: "Learn about the most common health symptoms in pets and when to consult your veterinarian.",
      category: "Health Education",
      date: "March 15, 2024",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=400&fit=crop"
    },
    {
      title: "The Importance of Regular Vet Checkups",
      excerpt: "Why routine veterinary visits are crucial for your pet's long-term health and wellness.",
      category: "Preventive Care",
      date: "March 12, 2024",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1530041539828-114de669390e?w=800&h=400&fit=crop"
    },
    {
      title: "AI in Pet Healthcare: Education vs. Diagnosis",
      excerpt: "Understanding the role of AI tools in pet health education and their limitations.",
      category: "Technology",
      date: "March 10, 2024",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=800&h=400&fit=crop"
    },
    {
      title: "Nutrition Guidelines for Different Pet Breeds",
      excerpt: "Research-backed nutritional advice for maintaining your pet's optimal health.",
      category: "Nutrition",
      date: "March 8, 2024",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=400&fit=crop"
    },
    {
      title: "Recognizing Signs of Pet Stress and Anxiety",
      excerpt: "Learn to identify behavioral signs that may indicate stress or anxiety in your pet.",
      category: "Behavior",
      date: "March 5, 2024",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=400&fit=crop"
    },
    {
      title: "Emergency Preparedness for Pet Owners",
      excerpt: "Essential steps to prepare for pet health emergencies and when to seek immediate care.",
      category: "Emergency Care",
      date: "March 1, 2024",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1581888227599-779811939961?w=800&h=400&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16 space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Pet Health Blog
            </h1>
            <p className="text-xl text-muted-foreground">
              Research-backed articles, expert insights, and educational resources for informed pet care.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {blogPosts.map((post, index) => (
              <Card key={index} className="hover:shadow-lg transition-all animate-fade-in overflow-hidden group">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
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
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <Button variant="ghost" className="w-full group/btn">
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

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
