import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Microscope } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email too long"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long")
    .regex(/[A-Za-z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  displayName: z.string().trim().max(100, "Display name too long").optional(),
});

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; displayName?: string }>({});

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/community");
      }
    });
  }, [navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!agreedToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and privacy policy.",
        variant: "destructive",
      });
      return;
    }

    // Validate input
    const result = signupSchema.safeParse({ email, password, displayName: displayName || undefined });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string; displayName?: string } = {};
      result.error.errors.forEach((error) => {
        if (error.path[0] === 'email') fieldErrors.email = error.message;
        if (error.path[0] === 'password') fieldErrors.password = error.message;
        if (error.path[0] === 'displayName') fieldErrors.displayName = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.signUp({
      email: result.data.email,
      password: result.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/community`,
        data: {
          display_name: result.data.displayName || result.data.email.split('@')[0],
        }
      }
    });

    setIsLoading(false);

    if (error) {
      let errorMessage = error.message;
      if (error.message.includes('already registered')) {
        errorMessage = "This email is already registered. Please sign in or use a different email.";
      }
      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success!",
        description: "Your account has been created. You can now sign in.",
      });
      navigate("/community");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto animate-fade-in">
            <div className="text-center mb-8">
              <div className="inline-flex p-4 bg-gradient-primary rounded-lg mb-4">
                <Microscope className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Get Started Free</h1>
              <p className="text-muted-foreground">Create your account and start tracking your pet's health</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Join 50,000+ pet parents using our platform</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input 
                      id="displayName" 
                      placeholder="Your name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className={errors.displayName ? "border-destructive" : ""}
                    />
                    {errors.displayName && (
                      <p className="text-sm text-destructive">{errors.displayName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={errors.email ? "border-destructive" : ""}
                      required
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={errors.password ? "border-destructive" : ""}
                      required
                    />
                    {errors.password ? (
                      <p className="text-sm text-destructive">{errors.password}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">At least 8 characters with a letter and number</p>
                    )}
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                      required 
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the{" "}
                      <Link to="/disclaimer" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/disclaimer" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <Button 
                    variant="hero" 
                    className="w-full" 
                    size="lg"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline font-medium">
                      Sign in
                    </Link>
                  </p>
                </form>
              </CardContent>
            </Card>

            <p className="text-center text-xs text-muted-foreground mt-6">
              By creating an account, you acknowledge that our tools provide educational information only 
              and are not a replacement for professional veterinary care.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Signup;
