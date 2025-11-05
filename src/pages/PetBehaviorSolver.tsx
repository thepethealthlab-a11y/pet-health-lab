import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useSEO } from "@/hooks/useSEO";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lightbulb, AlertTriangle, Stethoscope } from "lucide-react";

const PetBehaviorSolver = () => {
  useSEO({
    title: "Pet Behavior Problem Solver | The Pet Health Lab",
    description: "Understand why your pet acts out! Use our Pet Behavior Problem Solver to find causes, get expert tips, and fix common behavior issues in dogs, cats, and more.",
    keywords: "pet behavior, dog behavior problems, cat behavior issues, pet training, behavior solutions, pet psychology",
    canonical: "https://thepethealthlab.com/tools/pet-behavior-problem-solver",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Pet Behavior Problem Solver",
      "applicationCategory": "HealthApplication",
      "description": "AI-powered tool to analyze and solve pet behavior problems",
    },
  });

  const [petType, setPetType] = useState("");
  const [petAge, setPetAge] = useState("");
  const [behaviorIssue, setBehaviorIssue] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{
    diagnosisSummary: string;
    solutions: string[];
    vetAdvice: string;
  } | null>(null);
  const { toast } = useToast();

  const petEmojis: Record<string, string> = {
    dog: "🐕",
    cat: "🐈",
    bird: "🦜",
    rabbit: "🐰",
    other: "🐾",
  };

  const analyzeBehavior = async () => {
    if (!petType || !petAge || !behaviorIssue.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields before analyzing",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-pet-behavior', {
        body: { petType, petAge, behaviorIssue }
      });

      if (error) throw error;

      if (data?.analysis) {
        // Parse the JSON response from AI
        const cleanJson = data.analysis.replace(/```json\n?|\n?```/g, '').trim();
        const parsedResults = JSON.parse(cleanJson);
        setResults(parsedResults);
        toast({
          title: "Analysis complete",
          description: "Here's what we found about your pet's behavior",
        });
      }
    } catch (error: any) {
      console.error("Error analyzing behavior:", error);
      toast({
        title: "Analysis failed",
        description: error.message || "Failed to analyze behavior. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🐾</div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Pet Behavior Problem Solver
            </h1>
            <p className="text-lg text-muted-foreground">
              Understand and Fix Your Pet's Behavior
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Get AI-powered insights to help solve common pet behavior issues
            </p>
          </div>

          {/* Input Form */}
          <Card className="mb-8 backdrop-blur-sm bg-white/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🔍</span>
                Tell Us About Your Pet
              </CardTitle>
              <CardDescription>
                Provide details about your pet and their behavior issue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="pet-type">Pet Type</Label>
                  <Select value={petType} onValueChange={setPetType}>
                    <SelectTrigger id="pet-type">
                      <SelectValue placeholder="Select pet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dog">🐕 Dog</SelectItem>
                      <SelectItem value="cat">🐈 Cat</SelectItem>
                      <SelectItem value="bird">🦜 Bird</SelectItem>
                      <SelectItem value="rabbit">🐰 Rabbit</SelectItem>
                      <SelectItem value="other">🐾 Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pet-age">Pet Age</Label>
                  <Select value={petAge} onValueChange={setPetAge}>
                    <SelectTrigger id="pet-age">
                      <SelectValue placeholder="Select age group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="puppy-kitten">Puppy/Kitten (0-1 year)</SelectItem>
                      <SelectItem value="young-adult">Young Adult (1-3 years)</SelectItem>
                      <SelectItem value="adult">Adult (3-7 years)</SelectItem>
                      <SelectItem value="senior">Senior (7+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="behavior-issue">Behavior Issue</Label>
                <Textarea
                  id="behavior-issue"
                  placeholder="Describe your pet's behavior problem… (e.g., excessive barking, scratching furniture, not using litter box, biting, anxiety)"
                  value={behaviorIssue}
                  onChange={(e) => setBehaviorIssue(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              <Button 
                onClick={analyzeBehavior} 
                disabled={isAnalyzing}
                className="w-full"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing Behavior...
                  </>
                ) : (
                  <>
                    <Lightbulb className="mr-2 h-5 w-5" />
                    Analyze Behavior
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <div className="space-y-6 animate-in fade-in-50 duration-500">
              {/* Diagnosis Summary */}
              <Card className="backdrop-blur-sm bg-white/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{petEmojis[petType] || "🐾"}</span>
                    Diagnosis Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {results.diagnosisSummary}
                  </p>
                </CardContent>
              </Card>

              {/* Solutions */}
              <Card className="backdrop-blur-sm bg-white/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-6 w-6 text-primary" />
                    Top 3 Solutions
                  </CardTitle>
                  <CardDescription>
                    Practical tips to help fix this behavior issue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.solutions.map((solution, index) => (
                      <div key={index} className="flex gap-3">
                        <Badge className="h-6 w-6 rounded-full flex items-center justify-center shrink-0">
                          {index + 1}
                        </Badge>
                        <p className="text-muted-foreground leading-relaxed">
                          {solution}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Vet Advice */}
              <Alert className="backdrop-blur-sm bg-amber-50/80 border-amber-200">
                <Stethoscope className="h-5 w-5 text-amber-600" />
                <AlertDescription>
                  <strong className="text-amber-900">When to See a Vet or Trainer:</strong>
                  <p className="mt-2 text-amber-800">{results.vetAdvice}</p>
                </AlertDescription>
              </Alert>

              {/* Disclaimer */}
              <Alert className="backdrop-blur-sm bg-blue-50/80 border-blue-200">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 text-sm">
                  <strong>Important:</strong> Tips are for guidance only. Always consult your vet or a certified animal behaviorist for serious cases or if the behavior persists.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PetBehaviorSolver;