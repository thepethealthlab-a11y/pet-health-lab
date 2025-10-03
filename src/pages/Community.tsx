import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Users, Heart, TrendingUp, MessageCircle, Clock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Thread {
  id: string;
  category_id: string;
  title: string;
  content: string;
  created_at: string;
  profiles: { display_name: string | null } | null;
  reply_count?: number;
}

const Community = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [isCreatingThread, setIsCreatingThread] = useState(false);

  const stats = [
    { icon: Users, label: "Active Members", value: "10,000+" },
    { icon: MessageSquare, label: "Discussions", value: "5,000+" },
    { icon: Heart, label: "Helpful Responses", value: "15,000+" },
    { icon: TrendingUp, label: "Weekly Growth", value: "25%" }
  ];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    loadCategories();
    loadThreads();
  }, [selectedCategory]);

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('forum_categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error loading categories:', error);
    } else {
      setCategories(data || []);
    }
  };

  const loadThreads = async () => {
    let query = supabase
      .from('forum_threads')
      .select(`
        *,
        profiles (display_name)
      `)
      .order('created_at', { ascending: false })
      .limit(20);

    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error loading threads:', error);
      setThreads([
        {
          id: '1',
          category_id: 'emergency',
          title: 'My dog is vomiting - what should I learn about?',
          content: 'My 3-year-old Labrador has been vomiting since this morning. Can someone share educational resources?',
          created_at: new Date().toISOString(),
          profiles: { display_name: 'PetLover23' },
          reply_count: 5
        },
        {
          id: '2',
          category_id: 'health',
          title: 'Best food for sensitive stomach?',
          content: 'Looking for recommendations on food brands that work well for dogs with sensitive stomachs.',
          created_at: new Date().toISOString(),
          profiles: { display_name: 'DogParent99' },
          reply_count: 12
        },
        {
          id: '3',
          category_id: 'behavior',
          title: 'Potty training tips needed!',
          content: 'We just got an 8-week-old puppy and need all the potty training advice we can get!',
          created_at: new Date().toISOString(),
          profiles: { display_name: 'NewPuppyOwner' },
          reply_count: 8
        },
        {
          id: '4',
          category_id: 'emergency',
          title: 'Vaccination schedule questions',
          content: 'Can someone explain the typical vaccination schedule for puppies?',
          created_at: new Date().toISOString(),
          profiles: { display_name: 'CuriousCatOwner' },
          reply_count: 15
        },
        {
          id: '5',
          category_id: 'products',
          title: 'Pet insurance recommendations',
          content: 'Researching pet insurance options. What providers do you recommend?',
          created_at: new Date().toISOString(),
          profiles: { display_name: 'SmartPetParent' },
          reply_count: 20
        }
      ]);
    } else {
      setThreads(data || []);
    }
  };

  const handleCreateThread = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to create a new discussion thread.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!selectedCategory || !newThreadTitle.trim() || !newThreadContent.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a category and fill in both title and content.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingThread(true);

    const { error } = await supabase
      .from('forum_threads')
      .insert({
        category_id: selectedCategory,
        user_id: user.id,
        title: newThreadTitle.trim(),
        content: newThreadContent.trim()
      });

    setIsCreatingThread(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create thread. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success!",
        description: "Your discussion thread has been created.",
      });
      setNewThreadTitle("");
      setNewThreadContent("");
      loadThreads();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <article className="max-w-4xl mx-auto text-center mb-12 space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Pet Care Community
            </h1>
            <p className="text-xl text-muted-foreground">
              Join thousands of pet parents sharing knowledge, experiences, and support.
            </p>
          </article>

          <section className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12" aria-label="Community statistics">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center animate-fade-in">
                <CardHeader>
                  <stat.icon className="h-8 w-8 mx-auto text-secondary mb-2" />
                  <CardTitle className="text-3xl">{stat.value}</CardTitle>
                  <CardDescription>{stat.label}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </section>

          <div className="max-w-6xl mx-auto grid lg:grid-cols-4 gap-6">
            <aside className="lg:col-span-1" aria-label="Forum categories">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant={selectedCategory === null ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(null)}
                  >
                    All Discussions
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "ghost"}
                      className="w-full justify-start text-left"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <span className="truncate">{category.name}</span>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </aside>

            <section className="lg:col-span-3 space-y-6" aria-label="Discussion threads">
              {user && (
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle>Start a New Discussion</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <select
                        className="w-full p-2 border rounded-md bg-background"
                        value={selectedCategory || ""}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Title</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md bg-background"
                        placeholder="What's your question or topic?"
                        value={newThreadTitle}
                        onChange={(e) => setNewThreadTitle(e.target.value)}
                        maxLength={200}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Content</label>
                      <Textarea
                        placeholder="Share more details..."
                        value={newThreadContent}
                        onChange={(e) => setNewThreadContent(e.target.value)}
                        rows={4}
                        maxLength={2000}
                      />
                    </div>
                    <Button 
                      onClick={handleCreateThread} 
                      disabled={isCreatingThread || !newThreadTitle.trim() || !newThreadContent.trim()}
                      className="w-full"
                    >
                      {isCreatingThread ? "Creating..." : "Create Thread"}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {!user && (
                <Card className="animate-fade-in bg-secondary/5 border-secondary/20">
                  <CardContent className="p-6 text-center">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-secondary" />
                    <h3 className="text-xl font-semibold mb-2">Join the Conversation</h3>
                    <p className="text-muted-foreground mb-4">
                      Sign in to start discussions and reply to threads
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button asChild>
                        <Link to="/login">Sign In</Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link to="/signup">Sign Up</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                {threads.map((thread) => (
                  <Card key={thread.id} className="hover:shadow-md transition-shadow animate-fade-in">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-xl mb-2 leading-tight">{thread.title}</CardTitle>
                          <CardDescription className="line-clamp-2">{thread.content}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{thread.profiles?.display_name || 'Anonymous'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(thread.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{thread.reply_count || 0} replies</span>
                        </div>
                      </div>
                      <Button variant="ghost" className="mt-4 w-full" disabled={!user}>
                        {user ? "View & Reply" : "Sign in to reply"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}

                {threads.length === 0 && (
                  <Card className="p-8 text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      No discussions yet in this category. Be the first to start one!
                    </p>
                  </Card>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Community;