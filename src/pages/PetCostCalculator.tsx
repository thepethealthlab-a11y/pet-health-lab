import { useState } from "react";
import { Calculator, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useSEO } from "@/hooks/useSEO";

const PetCostCalculator = () => {
  useSEO({
    title: "Pet Cost Calculator - Estimate Pet Ownership Expenses | ThePetHealthLab",
    description: "Calculate the estimated costs of pet ownership including initial expenses, monthly costs, and yearly totals for dogs, cats, and other pets.",
    keywords: "pet cost calculator, pet expenses, dog ownership costs, cat ownership costs, pet budget",
    canonical: "https://thepethealthlab.com/tools/cost-calculator",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Pet Cost Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate estimated pet ownership expenses",
    },
  });

  const [petType, setPetType] = useState<string>("");
  const [petSize, setPetSize] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [hasInsurance, setHasInsurance] = useState<string>("no");
  const [calculated, setCalculated] = useState(false);

  const calculateCosts = () => {
    setCalculated(true);
  };

  const getInitialCosts = () => {
    let adoption = 0;
    let supplies = 0;
    let initial_vet = 0;

    if (petType === "dog") {
      adoption = petSize === "small" ? 150 : petSize === "medium" ? 200 : 300;
      supplies = petSize === "small" ? 300 : petSize === "medium" ? 400 : 500;
      initial_vet = 300;
    } else if (petType === "cat") {
      adoption = 100;
      supplies = 250;
      initial_vet = 250;
    } else if (petType === "bird") {
      adoption = 50;
      supplies = 200;
      initial_vet = 150;
    } else if (petType === "rabbit") {
      adoption = 75;
      supplies = 200;
      initial_vet = 150;
    }

    const locationMultiplier = location === "urban" ? 1.2 : location === "suburban" ? 1 : 0.9;
    
    return {
      adoption,
      supplies,
      initial_vet: initial_vet * locationMultiplier,
      total: adoption + supplies + (initial_vet * locationMultiplier),
    };
  };

  const getMonthlyCosts = () => {
    let food = 0;
    let grooming = 0;
    let routine_vet = 0;
    let insurance = 0;

    if (petType === "dog") {
      food = petSize === "small" ? 50 : petSize === "medium" ? 75 : 100;
      grooming = petSize === "small" ? 30 : petSize === "medium" ? 40 : 60;
      routine_vet = 40;
      insurance = hasInsurance === "yes" ? (petSize === "small" ? 30 : petSize === "medium" ? 40 : 50) : 0;
    } else if (petType === "cat") {
      food = 40;
      grooming = 15;
      routine_vet = 30;
      insurance = hasInsurance === "yes" ? 25 : 0;
    } else if (petType === "bird") {
      food = 25;
      grooming = 10;
      routine_vet = 20;
      insurance = hasInsurance === "yes" ? 15 : 0;
    } else if (petType === "rabbit") {
      food = 30;
      grooming = 15;
      routine_vet = 25;
      insurance = hasInsurance === "yes" ? 20 : 0;
    }

    const locationMultiplier = location === "urban" ? 1.2 : location === "suburban" ? 1 : 0.9;

    return {
      food: food * locationMultiplier,
      grooming: grooming * locationMultiplier,
      routine_vet: routine_vet * locationMultiplier,
      insurance,
      other: 20,
      total: (food + grooming + routine_vet + insurance + 20) * locationMultiplier,
    };
  };

  const initialCosts = getInitialCosts();
  const monthlyCosts = getMonthlyCosts();
  const yearlyCosts = monthlyCosts.total * 12;
  const lifetimeCosts = petType === "dog" 
    ? initialCosts.total + (yearlyCosts * 12) 
    : petType === "cat"
    ? initialCosts.total + (yearlyCosts * 15)
    : initialCosts.total + (yearlyCosts * 8);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-primary">
            Pet Cost Calculator
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Estimate the costs of pet ownership and plan your budget
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Pet Information
                </CardTitle>
                <CardDescription>
                  Enter your pet details to calculate estimated costs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pet-type">Pet Type</Label>
                  <Select value={petType} onValueChange={setPetType}>
                    <SelectTrigger id="pet-type">
                      <SelectValue placeholder="Select pet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dog">Dog</SelectItem>
                      <SelectItem value="cat">Cat</SelectItem>
                      <SelectItem value="bird">Bird</SelectItem>
                      <SelectItem value="rabbit">Rabbit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {petType === "dog" && (
                  <div className="space-y-2">
                    <Label htmlFor="pet-size">Dog Size</Label>
                    <Select value={petSize} onValueChange={setPetSize}>
                      <SelectTrigger id="pet-size">
                        <SelectValue placeholder="Select dog size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (under 25 lbs)</SelectItem>
                        <SelectItem value="medium">Medium (25-50 lbs)</SelectItem>
                        <SelectItem value="large">Large (over 50 lbs)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select location type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urban">Urban Area</SelectItem>
                      <SelectItem value="suburban">Suburban Area</SelectItem>
                      <SelectItem value="rural">Rural Area</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="insurance">Pet Insurance</Label>
                  <Select value={hasInsurance} onValueChange={setHasInsurance}>
                    <SelectTrigger id="insurance">
                      <SelectValue placeholder="Do you have insurance?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={calculateCosts} 
                  className="w-full"
                  disabled={!petType || (petType === "dog" && !petSize) || !location}
                >
                  Calculate Costs
                </Button>
              </CardContent>
            </Card>
          </div>

          {calculated && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Initial Costs
                  </CardTitle>
                  <CardDescription>One-time expenses when getting your pet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Adoption/Purchase:</span>
                    <span className="font-semibold">${initialCosts.adoption.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Initial Supplies:</span>
                    <span className="font-semibold">${initialCosts.supplies.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Initial Vet Visit:</span>
                    <span className="font-semibold">${initialCosts.initial_vet.toFixed(2)}</span>
                  </div>
                  <div className="pt-3 border-t flex justify-between text-lg">
                    <span className="font-bold">Total Initial:</span>
                    <Badge variant="default" className="text-base px-3 py-1">
                      ${initialCosts.total.toFixed(2)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Monthly Costs
                  </CardTitle>
                  <CardDescription>Recurring monthly expenses</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Food:</span>
                    <span className="font-semibold">${monthlyCosts.food.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Grooming:</span>
                    <span className="font-semibold">${monthlyCosts.grooming.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Routine Vet:</span>
                    <span className="font-semibold">${monthlyCosts.routine_vet.toFixed(2)}</span>
                  </div>
                  {hasInsurance === "yes" && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Insurance:</span>
                      <span className="font-semibold">${monthlyCosts.insurance.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Other (toys, treats):</span>
                    <span className="font-semibold">${monthlyCosts.other.toFixed(2)}</span>
                  </div>
                  <div className="pt-3 border-t flex justify-between text-lg">
                    <span className="font-bold">Total Monthly:</span>
                    <Badge variant="default" className="text-base px-3 py-1">
                      ${monthlyCosts.total.toFixed(2)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Yearly Cost:</span>
                    <Badge variant="secondary" className="text-base px-3 py-1">
                      ${yearlyCosts.toFixed(2)}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Estimated Lifetime Cost:</span>
                    <Badge variant="default" className="text-base px-3 py-1">
                      ${lifetimeCosts.toFixed(2)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground pt-2">
                    * Lifetime estimate based on average lifespan: {petType === "dog" ? "12 years" : petType === "cat" ? "15 years" : "8 years"}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {!calculated && (
          <section className="mt-8 max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>About This Calculator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  This calculator provides estimated costs based on average expenses for pet ownership. 
                  Actual costs can vary significantly based on your specific circumstances, location, 
                  pet health, lifestyle, and personal choices.
                </p>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Factors Included:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Adoption or purchase fees</li>
                    <li>Initial supplies (bed, bowls, toys, etc.)</li>
                    <li>Routine veterinary care</li>
                    <li>Food and treats</li>
                    <li>Grooming</li>
                    <li>Pet insurance (optional)</li>
                    <li>Emergency care savings</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default PetCostCalculator;