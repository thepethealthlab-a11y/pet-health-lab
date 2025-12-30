import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertTriangle, Dog, Cat, Rabbit, ChevronDown, Lock, Calculator, DollarSign, Shield, Syringe } from "lucide-react";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";

interface CalorieResults {
  minCalories: number;
  maxCalories: number;
  dryFoodCups: { min: number; max: number };
  wetFoodCans: { min: number; max: number };
  mixedDry: number;
  mixedWet: number;
}

const CalorieCalculator = () => {
  useSEO({
    title: "Pet Calorie & Nutrition Calculator | ThePetHealthLab",
    description: "Calculate ideal daily calories and portions for your dog or cat. Free pet nutrition calculator with feeding guidelines.",
  });

  const [step, setStep] = useState(1);
  const [petType, setPetType] = useState<string>("");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<"lbs" | "kg">("lbs");
  const [age, setAge] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);
  const [bodyCondition, setBodyCondition] = useState("ideal");
  const [isNeutered, setIsNeutered] = useState(false);
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [results, setResults] = useState<CalorieResults | null>(null);

  const handleHealthConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      setHealthConditions([...healthConditions, condition]);
    } else {
      setHealthConditions(healthConditions.filter(c => c !== condition));
    }
  };

  const calculateCalories = () => {
    const weightInKg = weightUnit === "lbs" ? parseFloat(weight) * 0.453592 : parseFloat(weight);
    
    // Base RER (Resting Energy Requirement) calculation
    let rer = 70 * Math.pow(weightInKg, 0.75);
    
    // Activity multiplier
    let multiplier = 1.6; // Default moderate
    if (activityLevel === "low") multiplier = 1.2;
    else if (activityLevel === "high") multiplier = 2.0;
    
    // Age adjustments
    if (age === "puppy") multiplier *= 1.5;
    else if (age === "senior") multiplier *= 0.9;
    
    // Body condition adjustments
    if (bodyCondition === "underweight") multiplier *= 1.2;
    else if (bodyCondition === "overweight") multiplier *= 0.8;
    
    // Neutered adjustment
    if (isNeutered) multiplier *= 0.9;
    
    // Health condition adjustments
    if (healthConditions.includes("pregnant")) multiplier *= 1.5;
    if (healthConditions.includes("weightloss")) multiplier *= 0.8;
    if (healthConditions.includes("weightgain")) multiplier *= 1.2;
    
    const baseCalories = rer * multiplier;
    const minCalories = Math.round(baseCalories * 0.9);
    const maxCalories = Math.round(baseCalories * 1.1);
    
    // Feeding calculations (assuming 350 cal/cup dry, 280 cal/can wet)
    const dryCalPerCup = 350;
    const wetCalPerCan = 280;
    
    setResults({
      minCalories,
      maxCalories,
      dryFoodCups: {
        min: Math.round((minCalories / dryCalPerCup) * 10) / 10,
        max: Math.round((maxCalories / dryCalPerCup) * 10) / 10,
      },
      wetFoodCans: {
        min: Math.round((minCalories / wetCalPerCan) * 10) / 10,
        max: Math.round((maxCalories / wetCalPerCan) * 10) / 10,
      },
      mixedDry: Math.round((minCalories / 2 / dryCalPerCup) * 10) / 10,
      mixedWet: Math.round((minCalories / 2 / wetCalPerCan) * 10) / 10,
    });
  };

  const resetCalculator = () => {
    setStep(1);
    setPetType("");
    setWeight("");
    setAge("");
    setActivityLevel("");
    setBodyCondition("ideal");
    setIsNeutered(false);
    setHealthConditions([]);
    setResults(null);
    setShowAdditionalDetails(false);
  };

  const canCalculate = petType && weight && age && activityLevel;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Pet Calorie & Nutrition Calculator
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            Calculate ideal daily calories and portions for your pet
          </p>
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-2 rounded-full text-sm">
            <AlertTriangle className="h-4 w-4" />
            General guidelines only. Consult your veterinarian for specific dietary needs.
          </div>
        </div>

        {!results ? (
          <Card className="border-border/50 shadow-lg">
            <CardContent className="p-6 md:p-8">
              {/* Step 1: Pet Type */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <h2 className="text-xl font-semibold">Pet Type</h2>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { type: "dog", icon: Dog, label: "Dog", emoji: "🐕" },
                    { type: "cat", icon: Cat, label: "Cat", emoji: "🐱" },
                    { type: "other", icon: Rabbit, label: "Other", emoji: "🐰" },
                  ].map(({ type, label, emoji }) => (
                    <Button
                      key={type}
                      variant={petType === type ? "default" : "outline"}
                      className={`h-24 flex flex-col gap-2 text-lg ${
                        petType === type ? "" : "hover:bg-secondary/50"
                      }`}
                      onClick={() => setPetType(type)}
                    >
                      <span className="text-3xl">{emoji}</span>
                      <span>{label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Step 2: Basic Information */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    petType ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    2
                  </div>
                  <h2 className="text-xl font-semibold">Basic Information</h2>
                </div>
                
                <div className="space-y-6">
                  {/* Weight */}
                  <div>
                    <Label className="text-base mb-2 block">Weight *</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Enter weight"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="flex-1"
                      />
                      <div className="flex rounded-md border border-input overflow-hidden">
                        <Button
                          type="button"
                          variant={weightUnit === "lbs" ? "default" : "ghost"}
                          className="rounded-none px-4"
                          onClick={() => setWeightUnit("lbs")}
                        >
                          lbs
                        </Button>
                        <Button
                          type="button"
                          variant={weightUnit === "kg" ? "default" : "ghost"}
                          className="rounded-none px-4"
                          onClick={() => setWeightUnit("kg")}
                        >
                          kg
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Age */}
                  <div>
                    <Label className="text-base mb-2 block">Age *</Label>
                    <Select value={age} onValueChange={setAge}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select age range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="puppy">Puppy/Kitten (0-1 year)</SelectItem>
                        <SelectItem value="young">Young Adult (1-3 years)</SelectItem>
                        <SelectItem value="adult">Adult (3-7 years)</SelectItem>
                        <SelectItem value="senior">Senior (7+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Activity Level */}
                  <div>
                    <Label className="text-base mb-3 block">Activity Level *</Label>
                    <RadioGroup value={activityLevel} onValueChange={setActivityLevel} className="space-y-3">
                      <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-secondary/30 transition-colors">
                        <RadioGroupItem value="low" id="low" className="mt-1" />
                        <Label htmlFor="low" className="cursor-pointer flex-1">
                          <span className="font-medium">Low</span>
                          <p className="text-sm text-muted-foreground">Mostly sedentary, minimal activity</p>
                        </Label>
                      </div>
                      <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-secondary/30 transition-colors">
                        <RadioGroupItem value="moderate" id="moderate" className="mt-1" />
                        <Label htmlFor="moderate" className="cursor-pointer flex-1">
                          <span className="font-medium">Moderate</span>
                          <p className="text-sm text-muted-foreground">Regular walks/play, typical activity</p>
                        </Label>
                      </div>
                      <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-secondary/30 transition-colors">
                        <RadioGroupItem value="high" id="high" className="mt-1" />
                        <Label htmlFor="high" className="cursor-pointer flex-1">
                          <span className="font-medium">High</span>
                          <p className="text-sm text-muted-foreground">Very active, working dog, athletic</p>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* Step 3: Additional Details */}
              <div className="mb-8">
                <Collapsible open={showAdditionalDetails} onOpenChange={setShowAdditionalDetails}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                          showAdditionalDetails ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                          3
                        </div>
                        <h2 className="text-xl font-semibold">Additional Details</h2>
                        <span className="text-sm text-muted-foreground">(optional)</span>
                      </div>
                      <ChevronDown className={`h-5 w-5 transition-transform ${showAdditionalDetails ? "rotate-180" : ""}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4 space-y-6">
                    {/* Body Condition */}
                    <div>
                      <Label className="text-base mb-2 block">Body Condition</Label>
                      <Select value={bodyCondition} onValueChange={setBodyCondition}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="underweight">Underweight</SelectItem>
                          <SelectItem value="ideal">Ideal weight</SelectItem>
                          <SelectItem value="overweight">Overweight</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Spayed/Neutered */}
                    <div className="flex items-center justify-between">
                      <Label className="text-base">Spayed/Neutered</Label>
                      <Switch checked={isNeutered} onCheckedChange={setIsNeutered} />
                    </div>

                    {/* Health Conditions */}
                    <div>
                      <Label className="text-base mb-3 block">Health Conditions</Label>
                      <div className="space-y-2">
                        {[
                          { id: "pregnant", label: "Pregnant/Nursing" },
                          { id: "diabetes", label: "Diabetes" },
                          { id: "kidney", label: "Kidney disease" },
                          { id: "weightloss", label: "Weight loss goal" },
                          { id: "weightgain", label: "Weight gain goal" },
                        ].map(({ id, label }) => (
                          <div key={id} className="flex items-center space-x-2">
                            <Checkbox
                              id={id}
                              checked={healthConditions.includes(id)}
                              onCheckedChange={(checked) => handleHealthConditionChange(id, checked as boolean)}
                            />
                            <Label htmlFor={id} className="cursor-pointer">{label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* Calculate Button */}
              <Button
                size="lg"
                className="w-full text-lg h-14"
                onClick={calculateCalories}
                disabled={!canCalculate}
              >
                <Calculator className="mr-2 h-5 w-5" />
                Calculate Calories
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Results Section */
          <div className="space-y-6">
            <Card className="border-2 border-primary/30 shadow-lg overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-primary/20">
                <CardTitle className="text-center text-2xl">Daily Calorie Recommendation</CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                {/* Main Calorie Display */}
                <div className="text-center mb-8">
                  <p className="text-lg text-muted-foreground mb-2">Estimated Daily Calories:</p>
                  <p className="text-5xl md:text-6xl font-bold text-primary">
                    {results.minCalories}-{results.maxCalories}
                  </p>
                  <p className="text-lg text-muted-foreground mt-2">calories per day</p>
                </div>

                {/* Calculation Basis */}
                <div className="bg-secondary/30 rounded-lg p-4 mb-8">
                  <p className="font-medium mb-2">This estimate is based on:</p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• {weight} {weightUnit} {petType}</li>
                    <li>• {age === "puppy" ? "Puppy/Kitten" : age === "young" ? "Young adult" : age === "adult" ? "Adult" : "Senior"} life stage</li>
                    <li>• {activityLevel.charAt(0).toUpperCase() + activityLevel.slice(1)} activity level</li>
                    <li>• {bodyCondition.charAt(0).toUpperCase() + bodyCondition.slice(1)} body condition</li>
                  </ul>
                </div>

                {/* Feeding Guidelines */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Feeding Guidelines</h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-border rounded-lg">
                      <p className="font-medium text-foreground mb-2">If feeding dry kibble (350 cal/cup):</p>
                      <p className="text-muted-foreground">
                        → Approximately {results.dryFoodCups.min}-{results.dryFoodCups.max} cups per day
                      </p>
                      <p className="text-muted-foreground">
                        → Split into 2 meals: ~{(results.dryFoodCups.min / 2).toFixed(1)} cups each
                      </p>
                    </div>
                    
                    <div className="p-4 border border-border rounded-lg">
                      <p className="font-medium text-foreground mb-2">If feeding wet food (280 cal/can):</p>
                      <p className="text-muted-foreground">
                        → Approximately {results.wetFoodCans.min}-{results.wetFoodCans.max} cans per day
                      </p>
                    </div>
                    
                    <div className="p-4 border border-border rounded-lg">
                      <p className="font-medium text-foreground mb-2">If mixing dry + wet (50/50):</p>
                      <p className="text-muted-foreground">
                        → {results.mixedDry} cup dry food + {results.mixedWet} cans wet food
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feeding Tips */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Feeding Tips</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Divide into 2-3 meals per day
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Measure portions using a standard measuring cup
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Adjust based on your pet's body condition
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Reduce food if weight increases
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Increase food if weight decreases
                    </li>
                  </ul>
                </div>

                {/* Important Reminders */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <h4 className="font-semibold text-amber-700 dark:text-amber-400">Important Reminders</h4>
                  </div>
                  <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
                    <li>• These are general estimates, not veterinary advice</li>
                    <li>• Individual needs vary based on metabolism</li>
                    <li>• Monitor your pet's body condition regularly</li>
                    <li>• Consult your veterinarian for specific recommendations</li>
                    <li>• Sudden diet changes should be gradual</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              <Button variant="outline" disabled className="gap-2">
                <Lock className="h-4 w-4" />
                Save to Dashboard
                <span className="text-xs bg-primary/20 px-2 py-0.5 rounded">Premium</span>
              </Button>
              <Button variant="outline" disabled className="gap-2">
                <Lock className="h-4 w-4" />
                Track Weight Over Time
                <span className="text-xs bg-primary/20 px-2 py-0.5 rounded">Premium</span>
              </Button>
              <Button variant="secondary" onClick={resetCalculator}>
                Calculate Again
              </Button>
            </div>

            {/* Premium Features Banner */}
            <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">💎</span>
                  <h3 className="text-xl font-semibold">Premium Features</h3>
                </div>
                <ul className="space-y-2 mb-6 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span> Save multiple calculations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span> Track weight changes with graphs
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span> Weekly meal variety suggestions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span> Food brand recommendations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span> Custom meal plans
                  </li>
                </ul>
                <Button asChild className="w-full md:w-auto">
                  <Link to="/premium">Upgrade to Premium - $8.99/month</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Related Tools */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-center">You might also like:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/tools/expense-tracker">
                  <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Expense Tracker</p>
                        <p className="text-sm text-muted-foreground">Track food costs</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <Link to="/tools/toxic-food-scanner">
                  <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Toxic Food Scanner</p>
                        <p className="text-sm text-muted-foreground">Check food safety</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <Link to="/tools/vaccine-tracker">
                  <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Syringe className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Vaccine Tracker</p>
                        <p className="text-sm text-muted-foreground">Complete health tracking</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CalorieCalculator;
