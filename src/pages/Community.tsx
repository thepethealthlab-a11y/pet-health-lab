import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Users, Heart, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Community = () => {
  const forumCategories = [
    {
      icon: MessageSquare,
      title: "General Discussion",
      description: "Share experiences and connect with other pet parents.",
      topics: 1234,
      posts: 8567
    },
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Discuss pet health topics and share wellness tips.",
      topics: 891,
      posts: 5643
    },
    {
      icon: TrendingUp,
      title: "Success Stories",
      description: "Celebrate your pet's health improvements and milestones.",
      topics: 456,
      posts: 2341
    },
    {
      icon: Users,
      title: "Pet Care Tips",
      description: "Exchange practical advice on daily pet care routines.",
      topics: 723,
      posts: 4521
    }
  ];

  const recentDiscussions = [
    {
      title: "How do you track your pet's daily activities?",
      author: "Sarah M.",
      replies: 23,
      likes: 45,
      category: "General Discussion",
      time: "2 hours ago"
    },
    {
      title: "Celebrating 6 months of improved health!",
      author: "John D.",
      replies: 67,
      likes: 142,
      category: "Success Stories",
      time: "5 hours ago"
    },
    {
      title: "Best practices for medication schedules",
      author: "Emily R.",
      replies: 34,
      likes: 78,
      category: "Health & Wellness",
      time: "1 day ago"
    },
    {
      title: "Tips for introducing new food gradually",
      author: "Michael K.",
      replies: 19,
      likes: 52,
      category: "Pet Care Tips",
      time: "1 day ago"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16 space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Pet Care Community
            </h1>
            <p className="text-xl text-muted-foreground">
              Connect with 50,000+ pet parents, share experiences, and learn from the community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
            {forumCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow animate-fade-in cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="p-3 bg-primary/10 rounded-lg mb-4">
                      <category.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div>{category.topics} topics</div>
                      <div>{category.posts} posts</div>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  <CardDescription className="text-base">{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Browse Category
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Recent Discussions</h2>
            <div className="space-y-4">
              {recentDiscussions.map((discussion, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {discussion.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                            {discussion.title}
                          </h3>
                          <Badge variant="secondary">{discussion.category}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>by {discussion.author}</span>
                          <span>•</span>
                          <span>{discussion.time}</span>
                          <span>•</span>
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              {discussion.replies}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              {discussion.likes}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center bg-gradient-subtle rounded-lg p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Join the Conversation</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Create an account to participate in discussions and connect with the community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/signup">Sign Up Free</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/login">Log In</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Community;
