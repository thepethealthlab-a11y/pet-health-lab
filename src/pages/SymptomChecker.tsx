import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Loader2,
  MapPin,
  Save,
  RefreshCw,
  Lock,
  Sparkles
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AnalysisResult {
  urgency: "HIGH" | "MEDIUM" | "LOW";
  urgencyMessage: string;
  possibleCauses: string[];
  generalInfo: string;
  warningSignsImmediate: string[];
  homeMonitoringTips: string[];
}

const SymptomChecker = () => {
  useSEO({
    title: "Pet Symptom Information Guide - Educational Tool | ThePetHealthLab",
    description: "Educational tool to learn about pet symptoms and when to consult your veterinarian. Get information about common symptoms in dogs and cats.",
    keywords: "pet symptoms, dog symptoms, cat symptoms, pet health information, veterinary guidance",
    canonical: "https://thepethealthlab.com/tools/symptom-checker",
  });

  const [petType, setPetType] = useState<string>("");
  const [symptoms, setSymptoms] = useState<string>("");
  const [showAdditional, setShowAdditional] = useState(false);
  const [age, setAge] = useState<string>("");
  const [breed, setBreed] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [checksUsed, setChecksUsed] = useState(0);
  const maxFreeChecks = 3;

  const characterCount = symptoms.length;
  const maxCharacters = 500;

  const handleAnalyze = async () => {
    if (!petType || !symptoms.trim()) {
      toast.error("Please select a pet type and describe the symptoms");
      return;
    }

    if (checksUsed >= maxFreeChecks) {
      toast.error("You've reached your free check limit. Upgrade to Premium for unlimited checks.");
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("analyze-symptom", {
        body: {
          petType,
          symptoms,
          age: age || undefined,
          breed: breed || undefined,
          duration: duration || undefined,
        },
      });

      if (error) {
        console.error("Function error:", error);
        if (error.message?.includes("429") || error.message?.includes("rate limit")) {
          toast.error("Too many requests. Please try again in a moment.");
        } else if (error.message?.includes("402") || error.message?.includes("payment")) {
          toast.error("Service temporarily unavailable. Please contact support.");
        } else {
          toast.error("Failed to analyze symptoms. Please try again.");
        }
        return;
      }

      setResults(data);
      setChecksUsed(prev => prev + 1);
      toast.success("Analysis complete!");
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById("results-section")?.scrollIntoView({ 
          behavior: "smooth", 
          block: "start" 
        });
      }, 100);

    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setPetType("");
    setSymptoms("");
    setAge("");
    setBreed("");
    setDuration("");
    setShowAdditional(false);
    setResults(null);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "HIGH":
        return "bg-red-500 text-white";
      case "MEDIUM":
        return "bg-amber-500 text-white";
      case "LOW":
        return "bg-green-500 text-white";
      default:
        return "bg-muted";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "HIGH":
        return "🔴";
      case "MEDIUM":
        return "🟡";
      case "LOW":
        return "🟢";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <header className="text-center mb-8 space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Pet Symptom Information Guide
            </h1>
            <p className="text-xl text-muted-foreground">
              Educational tool to learn about pet symptoms. Always consult your veterinarian for medical advice.
            </p>
            
            <Alert className="bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-400 dark:border-amber-600">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-900 dark:text-amber-200 font-medium">
                <strong>⚠️ EDUCATIONAL INFORMATION ONLY</strong> - We are NOT veterinarians. This tool provides general information. Always consult a licensed veterinarian for diagnosis and treatment.
              </AlertDescription>
            </Alert>
          </header>

          {!results ? (
            <section className="space-y-6 animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">1️⃣</span> Pet Type
                  </CardTitle>
                  <CardDescription>Select your pet type</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={petType} onValueChange={setPetType}>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex items-center space-x-2 flex-1">
                        <RadioGroupItem value="dog" id="dog" />
                        <Label htmlFor="dog" className="cursor-pointer text-base flex-1 p-3 border rounded-lg hover:bg-muted/50">
                          🐕 Dog
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 flex-1">
                        <RadioGroupItem value="cat" id="cat" />
                        <Label htmlFor="cat" className="cursor-pointer text-base flex-1 p-3 border rounded-lg hover:bg-muted/50">
                          🐈 Cat
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 flex-1">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other" className="cursor-pointer text-base flex-1 p-3 border rounded-lg hover:bg-muted/50">
                          🐾 Other
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">2️⃣</span> Symptom Description
                  </CardTitle>
                  <CardDescription>Describe what's happening with your pet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    placeholder="Describe what's happening with your pet...

Example: 'My dog has been vomiting since yesterday, seems lethargic, and won't eat his food'"
                    value={symptoms}
                    onChange={(e) => {
                      if (e.target.value.length <= maxCharacters) {
                        setSymptoms(e.target.value);
                      }
                    }}
                    rows={6}
                    className="resize-none"
                  />
                  <div className="flex justify-between items-center text-sm">
                    <span className={characterCount > maxCharacters * 0.9 ? "text-amber-600" : "text-muted-foreground"}>
                      {characterCount}/{maxCharacters} characters
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="cursor-pointer" onClick={() => setShowAdditional(!showAdditional)}>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">3️⃣</span> Additional Details (Optional)
                    </div>
                    {showAdditional ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </CardTitle>
                  <CardDescription>Add more details for better information</CardDescription>
                </CardHeader>
                {showAdditional && (
                  <CardContent className="space-y-4 animate-fade-in">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Select value={age} onValueChange={setAge}>
                          <SelectTrigger id="age">
                            <SelectValue placeholder="Select age" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="puppy-kitten">Puppy/Kitten (0-1 year)</SelectItem>
                            <SelectItem value="young">Young Adult (1-3 years)</SelectItem>
                            <SelectItem value="adult">Adult (3-7 years)</SelectItem>
                            <SelectItem value="senior">Senior (7+ years)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration</Label>
                        <Select value={duration} onValueChange={setDuration}>
                          <SelectTrigger id="duration">
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="less-24h">Less than 24 hours</SelectItem>
                            <SelectItem value="1-3-days">1-3 days</SelectItem>
                            <SelectItem value="more-3-days">More than 3 days</SelectItem>
                            <SelectItem value="weeks">Weeks</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="breed">Breed (optional)</Label>
                      <Input
                        id="breed"
                        placeholder="e.g., Golden Retriever, Persian Cat"
                        value={breed}
                        onChange={(e) => setBreed(e.target.value)}
                      />
                    </div>
                  </CardContent>
                )}
              </Card>

              <div className="space-y-4">
                <Button
                  onClick={handleAnalyze}
                  disabled={!petType || !symptoms.trim() || isAnalyzing || checksUsed >= maxFreeChecks}
                  className="w-full"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Analyzing Symptoms...
                    </>
                  ) : (
                    "Analyze Symptoms"
                  )}
                </Button>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {checksUsed} of {maxFreeChecks} free checks used this month
                  </p>
                  {checksUsed >= maxFreeChecks && (
                    <Alert className="bg-primary/5 border-primary">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        You've reached your free limit. <Link to="/pricing" className="font-semibold underline">Upgrade to Premium</Link> for unlimited checks.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </section>
          ) : (
            <section id="results-section" className="space-y-6 animate-fade-in">
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="text-2xl">Analysis Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Urgency Level */}
                  <div className={`p-6 rounded-lg ${getUrgencyColor(results.urgency)}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{getUrgencyIcon(results.urgency)}</span>
                      <div>
                        <h3 className="text-xl font-bold">URGENCY LEVEL: {results.urgency}</h3>
                        <p className="text-lg mt-1">{results.urgencyMessage}</p>
                      </div>
                    </div>
                  </div>

                  {/* Possible Causes */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Possible Causes
                    </h3>
                    <ol className="space-y-2 pl-5 list-decimal">
                      {results.possibleCauses.map((cause, index) => (
                        <li key={index} className="text-base">{cause}</li>
                      ))}
                    </ol>
                    <p className="text-sm text-muted-foreground italic mt-3">
                      Note: These are educational possibilities based on common patterns. Only a veterinarian can provide accurate diagnosis.
                    </p>
                  </div>

                  {/* General Information */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold">General Information</h3>
                    <p className="text-base leading-relaxed">{results.generalInfo}</p>
                  </div>

                  {/* Warning Signs */}
                  <div className="space-y-3 bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border-2 border-red-200 dark:border-red-800">
                    <h3 className="text-xl font-semibold text-red-900 dark:text-red-100">
                      When to Seek Immediate Help
                    </h3>
                    <ul className="space-y-2 pl-5 list-disc">
                      {results.warningSignsImmediate.map((sign, index) => (
                        <li key={index} className="text-base text-red-900 dark:text-red-100">{sign}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Home Monitoring Tips */}
                  <div className="space-y-3 bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                    <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
                      Home Monitoring Tips
                    </h3>
                    <ul className="space-y-2 pl-5 list-disc">
                      {results.homeMonitoringTips.map((tip, index) => (
                        <li key={index} className="text-base text-blue-900 dark:text-blue-100">{tip}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Reminder */}
                  <Alert className="bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-400 dark:border-amber-600">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <AlertDescription className="text-amber-900 dark:text-amber-200 font-medium">
                      ⚠️ REMINDER: This is educational information only. Contact your veterinarian for medical advice.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild variant="default" size="lg" className="flex-1">
                  <Link to="/tools/vet-finder">
                    <MapPin className="h-5 w-5 mr-2" />
                    Find Nearby Vets
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="flex-1 relative" disabled>
                  <Lock className="h-4 w-4 mr-2" />
                  Save Report
                  <Badge variant="secondary" className="ml-2">Premium</Badge>
                </Button>
                <Button variant="ghost" size="lg" onClick={handleReset}>
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Check Another
                </Button>
              </div>

              {/* Free User Progress */}
              <Card className="bg-muted/30">
                <CardContent className="pt-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Free Checks This Month</span>
                    <span className="text-muted-foreground">{checksUsed}/{maxFreeChecks}</span>
                  </div>
                  <Progress value={(checksUsed / maxFreeChecks) * 100} className="h-2" />
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-sm text-muted-foreground">
                      {maxFreeChecks - checksUsed} checks remaining
                    </p>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/pricing">Upgrade Now</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Premium Upsell */}
          {!results && (
            <Card className="mt-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Sparkles className="h-6 w-6" />
                  <h3 className="text-xl font-semibold">Premium Benefits</h3>
                </div>
                <p className="text-muted-foreground">
                  💎 Premium users get unlimited checks + detailed reports + symptom history tracking
                </p>
                <Button asChild variant="default">
                  <Link to="/pricing">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SymptomChecker;
