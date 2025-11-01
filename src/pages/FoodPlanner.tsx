import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Pizza, Clock, Lightbulb, ShoppingBag, Utensils } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

interface DietResults {
  dailyCalories: number;
  foodPortion: number;
  foodType: string;
  feedingFrequency: string;
  tip: string;
  petName?: string;
}

const FoodPlanner = () => {
  useSEO({
    title: "Pet Food & Diet Planner | AI-Powered Pet Nutrition Calculator | ThePetHealthLab",
    description: "AI-powered pet food calculator to find your dog's or cat's ideal daily diet, calories, and feeding guide. Calculate perfect portions for optimal pet health.",
    keywords: "pet food calculator, dog diet planner, cat feeding chart, pet calorie calculator, pet nutrition guide, dog food portions, cat food portions",
    canonical: "https://thepethealthlab.com/tools/food-planner",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Pet Food & Diet Planner",
      "description": "Calculate ideal daily diet, calories, and feeding guide for pets",
      "url": "https://thepethealthlab.com/tools/food-planner",
      "applicationCategory": "HealthApplication",
    },
  });

  const [petType, setPetType] = useState<string>("");
  const [breed, setBreed] = useState<string>("");
  const [ageYears, setAgeYears] = useState<string>("");
  const [ageMonths, setAgeMonths] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [weightUnit, setWeightUnit] = useState<string>("kg");
  const [activityLevel, setActivityLevel] = useState<string>("");
  const [allergies, setAllergies] = useState<string>("");
  const [results, setResults] = useState<DietResults | null>(null);

  const calculateDiet = () => {
    if (!petType || !weight || !activityLevel) return;

    const weightInKg = weightUnit === "lbs" ? parseFloat(weight) * 0.453592 : parseFloat(weight);
    const totalAgeMonths = (parseInt(ageYears || "0") * 12) + parseInt(ageMonths || "0");
    
    // Calculate Resting Energy Requirement (RER) = 70 * (weight in kg)^0.75
    const rer = 70 * Math.pow(weightInKg, 0.75);
    
    // Activity multipliers
    let multiplier = 1.6; // Normal activity
    if (activityLevel === "low") multiplier = 1.2;
    if (activityLevel === "high") multiplier = 2.0;
    
    // Age adjustments
    if (totalAgeMonths < 4) multiplier *= 3; // Puppies/kittens
    else if (totalAgeMonths < 12) multiplier *= 2; // Young pets
    else if (totalAgeMonths > 84) multiplier *= 0.8; // Senior pets
    
    const dailyCalories = Math.round(rer * multiplier);
    
    // Calculate food portions (assuming average dry food = 350 kcal/cup)
    const caloriesPerCup = 350;
    const foodPortion = parseFloat((dailyCalories / caloriesPerCup).toFixed(1));
    
    // Determine food type
    let foodType = "Dry food";
    if (weightInKg < 5 || totalAgeMonths < 6) {
      foodType = "Mix of wet and dry food";
    } else if (totalAgeMonths > 96 && activityLevel === "low") {
      foodType = "Soft dry or wet food";
    }
    
    // Determine feeding frequency
    let feedingFrequency = "2 times per day";
    if (totalAgeMonths < 4) feedingFrequency = "3-4 times per day";
    else if (totalAgeMonths < 12) feedingFrequency = "3 times per day";
    else if (weightInKg > 25) feedingFrequency = "2 times per day";
    
    // Generate tip
    const tips = [
      "Always provide fresh water alongside meals for proper hydration.",
      "Monitor your pet's weight regularly and adjust portions as needed.",
      "Avoid feeding table scraps to maintain a balanced diet.",
      "Split daily portions into multiple meals for better digestion.",
      "Consult your vet if you notice sudden appetite changes.",
      "Consider age-appropriate food formulas for optimal nutrition.",
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    
    setResults({
      dailyCalories,
      foodPortion,
      foodType,
      feedingFrequency,
      tip: randomTip,
      petName: breed || petType,
    });
  };

  const resetForm = () => {
    setPetType("");
    setBreed("");
    setAgeYears("");
    setAgeMonths("");
    setWeight("");
    setActivityLevel("");
    setAllergies("");
    setResults(null);
  };

  const products = [
    {
      name: "Royal Canin",
      description: "Breed-specific nutrition formulas",
      url: "https://www.chewy.com/b/royal-canin-237",
    },
    {
      name: "Hill's Science Diet",
      description: "Veterinarian-recommended nutrition",
      url: "https://www.chewy.com/b/hills-science-diet-309",
    },
    {
      name: "Blue Buffalo",
      description: "Natural ingredients, no by-products",
      url: "https://www.chewy.com/b/blue-buffalo-296",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <header className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Pet Food & Diet Planner
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Calculate the perfect daily food portions and calorie needs for your pet
            </p>
            <Alert className="mt-4 border-primary bg-primary/5">
              <Heart className="h-4 w-4 text-primary" />
              <AlertDescription className="text-sm">
                <strong>Educational Tool:</strong> These calculations provide general guidance. Always consult your veterinarian for personalized nutrition advice tailored to your pet's specific health needs.
              </AlertDescription>
            </Alert>
          </header>

          {!results ? (
            <section className="space-y-6 animate-fade-in" aria-label="Pet diet calculator form">
              <Card>
                <CardHeader>
                  <CardTitle>Pet Information</CardTitle>
                  <CardDescription>
                    Tell us about your pet to calculate their ideal diet
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="petType">Pet Type</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <Button
                        type="button"
                        variant={petType === "Dog" ? "default" : "outline"}
                        onClick={() => setPetType("Dog")}
                        className="w-full"
                      >
                        Dog
                      </Button>
                      <Button
                        type="button"
                        variant={petType === "Cat" ? "default" : "outline"}
                        onClick={() => setPetType("Cat")}
                        className="w-full"
                      >
                        Cat
                      </Button>
                      <Button
                        type="button"
                        variant={petType === "Other" ? "default" : "outline"}
                        onClick={() => setPetType("Other")}
                        className="w-full"
                      >
                        Other
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="breed">Breed (Optional)</Label>
                    <Input
                      id="breed"
                      type="text"
                      placeholder="e.g., Golden Retriever, Persian Cat"
                      value={breed}
                      onChange={(e) => setBreed(e.target.value)}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ageYears">Age (Years)</Label>
                      <Input
                        id="ageYears"
                        type="number"
                        min="0"
                        max="30"
                        placeholder="0"
                        value={ageYears}
                        onChange={(e) => setAgeYears(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ageMonths">Age (Months)</Label>
                      <Input
                        id="ageMonths"
                        type="number"
                        min="0"
                        max="11"
                        placeholder="0"
                        value={ageMonths}
                        onChange={(e) => setAgeMonths(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight</Label>
                    <div className="flex gap-2">
                      <Input
                        id="weight"
                        type="number"
                        min="0.1"
                        step="0.1"
                        placeholder="Enter weight"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="flex-1"
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={weightUnit === "kg" ? "default" : "outline"}
                          onClick={() => setWeightUnit("kg")}
                        >
                          kg
                        </Button>
                        <Button
                          type="button"
                          variant={weightUnit === "lbs" ? "default" : "outline"}
                          onClick={() => setWeightUnit("lbs")}
                        >
                          lbs
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activityLevel">Activity Level</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <Button
                        type="button"
                        variant={activityLevel === "low" ? "default" : "outline"}
                        onClick={() => setActivityLevel("low")}
                        className="w-full"
                      >
                        Low
                      </Button>
                      <Button
                        type="button"
                        variant={activityLevel === "normal" ? "default" : "outline"}
                        onClick={() => setActivityLevel("normal")}
                        className="w-full"
                      >
                        Normal
                      </Button>
                      <Button
                        type="button"
                        variant={activityLevel === "high" ? "default" : "outline"}
                        onClick={() => setActivityLevel("high")}
                        className="w-full"
                      >
                        High
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies (Optional)</Label>
                    <Textarea
                      id="allergies"
                      placeholder="List any known food allergies or sensitivities"
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={calculateDiet}
                disabled={!petType || !weight || !activityLevel}
                className="w-full"
                size="lg"
              >
                Calculate Diet Plan
              </Button>
            </section>
          ) : (
            <section className="space-y-6 animate-fade-in" aria-label="Diet plan results">
              <Alert className="border-secondary bg-secondary/10">
                <Heart className="h-4 w-4 text-secondary" />
                <AlertDescription className="text-base font-medium">
                  Perfect! 🐶 {results.petName} needs approximately{" "}
                  <strong>{results.foodPortion} cups</strong> of {results.foodType.toLowerCase()} per day.
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mb-2 p-3 bg-primary/10 rounded-lg w-fit">
                      <Utensils className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Daily Calories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-primary">
                      {results.dailyCalories} kcal
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Based on weight, age, and activity level
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mb-2 p-3 bg-secondary/10 rounded-lg w-fit">
                      <Pizza className="h-6 w-6 text-secondary" />
                    </div>
                    <CardTitle>Food Portion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-secondary">
                      {results.foodPortion} cups
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Or {Math.round(results.foodPortion * 240)} grams per day
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mb-2 p-3 bg-accent/10 rounded-lg w-fit">
                      <ShoppingBag className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle>Food Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-semibold text-foreground">
                      {results.foodType}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Recommended based on pet profile
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mb-2 p-3 bg-primary/10 rounded-lg w-fit">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Feeding Frequency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-semibold text-foreground">
                      {results.feedingFrequency}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Split portions evenly throughout the day
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-accent bg-accent/5">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-accent" />
                    <CardTitle>Nutrition Tip</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-base">{results.tip}</p>
                </CardContent>
              </Card>

              {allergies && (
                <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-900/20">
                  <AlertDescription>
                    <strong>Allergy Note:</strong> Your pet has listed allergies: {allergies}. Please ensure selected food brands are allergen-free.
                  </AlertDescription>
                </Alert>
              )}

              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle>Recommended Food Brands</CardTitle>
                  <CardDescription>
                    High-quality nutrition options for your pet (affiliate links)
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-4">
                  {products.map((product, index) => (
                    <a
                      key={index}
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 bg-background rounded-lg border border-border hover:border-primary hover:shadow-md transition-all"
                    >
                      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {product.description}
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        View on Chewy
                      </Button>
                    </a>
                  ))}
                </CardContent>
              </Card>

              <Button onClick={resetForm} variant="outline" className="w-full" size="lg">
                Calculate for Another Pet
              </Button>
            </section>
          )}

          <section className="mt-16 animate-fade-in">
            <h2 className="text-3xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  How many times should I feed my dog daily?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Adult dogs typically do well with 2 meals per day, while puppies under 6 months need 3-4 smaller meals. Senior dogs may benefit from 2-3 smaller portions to aid digestion. Always split the daily total into equal portions.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  What's the best diet for indoor cats?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Indoor cats have lower activity levels and need fewer calories to prevent obesity. Look for indoor-specific formulas with controlled calories, higher fiber for digestion, and quality protein. Wet food can help with hydration.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  Can I mix dry and wet food?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes! Mixing dry and wet food can provide variety and extra hydration. Generally, you can replace about 3 oz of wet food for every ¼ cup of dry food. Adjust total portions to maintain the correct daily calorie intake.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">
                  How accurate are these calorie calculations?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Our calculator uses standard veterinary formulas (Resting Energy Requirement), but individual needs vary based on metabolism, health conditions, and breed specifics. Monitor your pet's weight and body condition, adjusting portions as needed with your vet's guidance.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">
                  Should I adjust portions for spayed/neutered pets?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes, spayed and neutered pets often have lower metabolic rates and may need 10-20% fewer calories. Monitor their weight closely after the procedure and work with your vet to adjust portions to maintain a healthy body condition.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FoodPlanner;
