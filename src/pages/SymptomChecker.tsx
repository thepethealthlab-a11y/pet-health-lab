import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Phone, History, X } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

interface Symptom {
  id: string;
  label: string;
}

interface Condition {
  name: string;
  symptoms: string[];
  urgency: "Low" | "Medium" | "High";
  description: string;
}

interface SavedCheck {
  id: string;
  date: string;
  petType: string;
  age: string;
  symptoms: string[];
  results: Condition[];
}

const SYMPTOMS: Symptom[] = [
  { id: "vomiting", label: "Vomiting" },
  { id: "diarrhea", label: "Diarrhea" },
  { id: "lethargy", label: "Lethargy/Weakness" },
  { id: "loss_appetite", label: "Loss of Appetite" },
  { id: "coughing", label: "Coughing" },
  { id: "itching", label: "Excessive Itching/Scratching" },
  { id: "limping", label: "Limping/Difficulty Walking" },
];

const CONDITIONS: Condition[] = [
  {
    name: "Gastroenteritis",
    symptoms: ["vomiting", "diarrhea", "loss_appetite"],
    urgency: "Medium",
    description: "Inflammation of the digestive tract. May be caused by dietary indiscretion, infections, or other factors.",
  },
  {
    name: "Severe Dehydration Risk",
    symptoms: ["vomiting", "diarrhea", "lethargy"],
    urgency: "High",
    description: "Multiple symptoms indicating potential dehydration. Immediate veterinary attention recommended.",
  },
  {
    name: "Respiratory Infection",
    symptoms: ["coughing", "lethargy", "loss_appetite"],
    urgency: "Medium",
    description: "Possible upper or lower respiratory infection. Common in pets but requires veterinary evaluation.",
  },
  {
    name: "Allergic Reaction",
    symptoms: ["itching", "vomiting"],
    urgency: "Medium",
    description: "Possible allergic reaction to food, environment, or contact allergens.",
  },
  {
    name: "Skin Allergy/Parasites",
    symptoms: ["itching"],
    urgency: "Low",
    description: "May indicate fleas, mites, allergies, or skin infections. Schedule a vet visit for proper diagnosis.",
  },
  {
    name: "Musculoskeletal Injury",
    symptoms: ["limping", "lethargy"],
    urgency: "Medium",
    description: "Possible strain, sprain, or more serious orthopedic issue. Veterinary examination recommended.",
  },
  {
    name: "Poisoning/Toxicity",
    symptoms: ["vomiting", "diarrhea", "lethargy", "loss_appetite"],
    urgency: "High",
    description: "Multiple severe symptoms may indicate poisoning. Seek emergency veterinary care immediately.",
  },
  {
    name: "General Illness",
    symptoms: ["lethargy", "loss_appetite"],
    urgency: "Medium",
    description: "Non-specific symptoms that warrant veterinary attention to rule out underlying conditions.",
  },
];

const SymptomChecker = () => {
  useSEO({
    title: "Emergency Symptom Checker - Educational Pet Health Tool | ThePetHealthLab",
    description: "Educational symptom checker to learn about pet symptoms and when to consult your veterinarian. Check common symptoms in dogs and cats.",
    keywords: "pet symptoms, dog symptoms, cat symptoms, pet health checker, veterinary guidance",
    canonical: "https://thepethealthlab.com/tools/symptom-checker",
    schema: {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      "name": "Pet Symptom Checker",
      "description": "Educational tool for understanding pet symptoms",
      "url": "https://thepethealthlab.com/tools/symptom-checker",
    },
  });

  const [petType, setPetType] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [results, setResults] = useState<Condition[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [savedChecks, setSavedChecks] = useState<SavedCheck[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("symptomChecks");
    if (stored) {
      setSavedChecks(JSON.parse(stored));
    }
  }, []);

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId)
        ? prev.filter((s) => s !== symptomId)
        : [...prev, symptomId]
    );
  };

  const analyzeSymptoms = () => {
    if (!petType || !age || selectedSymptoms.length === 0) {
      return;
    }

    const matchedConditions = CONDITIONS.filter((condition) =>
      condition.symptoms.some((symptom) => selectedSymptoms.includes(symptom))
    )
      .map((condition) => ({
        ...condition,
        matchCount: condition.symptoms.filter((symptom) =>
          selectedSymptoms.includes(symptom)
        ).length,
      }))
      .sort((a, b) => b.matchCount - a.matchCount)
      .slice(0, 3);

    setResults(matchedConditions);
    setShowResults(true);

    // Save to local storage
    const newCheck: SavedCheck = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      petType,
      age,
      symptoms: selectedSymptoms,
      results: matchedConditions,
    };

    const updatedChecks = [newCheck, ...savedChecks].slice(0, 10);
    setSavedChecks(updatedChecks);
    localStorage.setItem("symptomChecks", JSON.stringify(updatedChecks));
  };

  const resetForm = () => {
    setPetType("");
    setAge("");
    setSelectedSymptoms([]);
    setResults([]);
    setShowResults(false);
  };

  const deleteCheck = (id: string) => {
    const updatedChecks = savedChecks.filter((check) => check.id !== id);
    setSavedChecks(updatedChecks);
    localStorage.setItem("symptomChecks", JSON.stringify(updatedChecks));
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High":
        return "text-destructive";
      case "Medium":
        return "text-orange-600 dark:text-orange-400";
      case "Low":
        return "text-secondary";
      default:
        return "text-muted-foreground";
    }
  };

  const getUrgencyBg = (urgency: string) => {
    switch (urgency) {
      case "High":
        return "bg-destructive/10 border-destructive";
      case "Medium":
        return "bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700";
      case "Low":
        return "bg-secondary/10 border-secondary";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <header className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Pet Symptom Checker
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              Educational tool to understand common pet symptoms
            </p>
            <Alert className="mt-4 border-primary bg-primary/5">
              <AlertTriangle className="h-4 w-4 text-primary" />
              <AlertDescription className="text-sm">
                <strong>Educational Use Only:</strong> This tool provides general
                information and does not replace professional veterinary advice.
                Always consult your veterinarian for accurate diagnosis and treatment.
              </AlertDescription>
            </Alert>
          </header>

          {!showResults ? (
            <section className="space-y-6 animate-fade-in" aria-label="Symptom checker form">
              <Card>
                <CardHeader>
                  <CardTitle>Pet Information</CardTitle>
                  <CardDescription>
                    Tell us about your pet to get started
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="petType">Pet Type</Label>
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant={petType === "dog" ? "default" : "outline"}
                          onClick={() => setPetType("dog")}
                          className="flex-1"
                        >
                          Dog
                        </Button>
                        <Button
                          type="button"
                          variant={petType === "cat" ? "default" : "outline"}
                          onClick={() => setPetType("cat")}
                          className="flex-1"
                        >
                          Cat
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age (years)</Label>
                      <Input
                        id="age"
                        type="number"
                        min="0"
                        max="30"
                        placeholder="Enter age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Select Symptoms</CardTitle>
                  <CardDescription>
                    Check all symptoms your pet is experiencing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {SYMPTOMS.map((symptom) => (
                      <div key={symptom.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={symptom.id}
                          checked={selectedSymptoms.includes(symptom.id)}
                          onCheckedChange={() => handleSymptomToggle(symptom.id)}
                        />
                        <Label
                          htmlFor={symptom.id}
                          className="text-base cursor-pointer"
                        >
                          {symptom.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button
                  onClick={analyzeSymptoms}
                  disabled={!petType || !age || selectedSymptoms.length === 0}
                  className="flex-1"
                  size="lg"
                >
                  Analyze Symptoms
                </Button>
                <Button
                  onClick={() => setShowHistory(!showHistory)}
                  variant="outline"
                  size="lg"
                >
                  <History className="h-4 w-4 mr-2" />
                  History
                </Button>
              </div>

              {showHistory && savedChecks.length > 0 && (
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle>Recent Checks</CardTitle>
                    <CardDescription>
                      Your last {savedChecks.length} symptom checks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {savedChecks.map((check) => (
                      <div
                        key={check.id}
                        className="flex items-start justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium">
                            {check.petType.charAt(0).toUpperCase() +
                              check.petType.slice(1)}{" "}
                            - {check.age} years old
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(check.date).toLocaleDateString()} at{" "}
                            {new Date(check.date).toLocaleTimeString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Symptoms: {check.symptoms.length}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteCheck(check.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </section>
          ) : (
            <section className="space-y-6 animate-fade-in" aria-label="Analysis results">
              <Card className="border-destructive bg-destructive/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    Important Notice
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-base">
                    <strong>Consult your veterinarian immediately</strong> if your
                    pet is showing any concerning symptoms. This tool is for
                    educational purposes only and cannot diagnose medical conditions.
                  </p>
                  <div className="bg-background p-4 rounded-lg space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Emergency Veterinary Contacts
                    </h3>
                    <ul className="space-y-1 text-sm">
                      <li>
                        • <strong>Pet Poison Helpline:</strong> (855) 764-7661
                      </li>
                      <li>
                        • <strong>ASPCA Animal Poison Control:</strong> (888)
                        426-4435
                      </li>
                      <li>
                        • <strong>Local Emergency Vet:</strong> Search "emergency
                        vet near me"
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                  <CardDescription>
                    Based on the symptoms you selected, here are possible
                    conditions to discuss with your veterinarian
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm">
                      <strong>Pet:</strong> {petType.charAt(0).toUpperCase() +
                        petType.slice(1)}
                    </p>
                    <p className="text-sm">
                      <strong>Age:</strong> {age} years old
                    </p>
                    <p className="text-sm">
                      <strong>Symptoms:</strong>{" "}
                      {selectedSymptoms
                        .map((s) => SYMPTOMS.find((sym) => sym.id === s)?.label)
                        .join(", ")}
                    </p>
                  </div>

                  {results.length > 0 ? (
                    <div className="space-y-4">
                      {results.map((condition, index) => (
                        <article
                          key={index}
                          className={`p-4 rounded-lg border-2 ${getUrgencyBg(
                            condition.urgency
                          )}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-lg">
                              {condition.name}
                            </h3>
                            <span
                              className={`text-sm font-semibold px-3 py-1 rounded-full ${getUrgencyColor(
                                condition.urgency
                              )}`}
                            >
                              {condition.urgency} Urgency
                            </span>
                          </div>
                          <p className="text-sm text-foreground/90">
                            {condition.description}
                          </p>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground">
                      No specific conditions matched. Please consult your
                      veterinarian for proper evaluation.
                    </p>
                  )}
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button onClick={resetForm} variant="outline" className="flex-1">
                  Check Again
                </Button>
                <Button onClick={() => window.print()} variant="secondary">
                  Print Results
                </Button>
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SymptomChecker;
