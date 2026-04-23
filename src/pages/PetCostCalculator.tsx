import { useState } from "react";
import { Calculator, Dog, Cat, Bird, Rabbit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ToolShell from "@/components/tools/ToolShell";
import ToolStep from "@/components/tools/ToolStep";
import ResultCard from "@/components/tools/ResultCard";
import { useSEO } from "@/hooks/useSEO";

const PET_OPTIONS = [
  { value: "dog", label: "Dog", icon: Dog },
  { value: "cat", label: "Cat", icon: Cat },
  { value: "bird", label: "Bird", icon: Bird },
  { value: "rabbit", label: "Rabbit", icon: Rabbit },
];

const PetCostCalculator = () => {
  useSEO({
    title: "Pet Cost Calculator — Estimate Pet Ownership Expenses | ThePetHealthLab",
    description: "Calculate estimated initial, monthly, yearly and lifetime pet ownership costs for dogs, cats, birds and rabbits.",
    canonical: "https://thepethealthlab.com/tools/cost-calculator",
  });

  const [petType, setPetType] = useState("");
  const [petSize, setPetSize] = useState("");
  const [location, setLocation] = useState("");
  const [hasInsurance, setHasInsurance] = useState("no");
  const [calculated, setCalculated] = useState(false);

  const reset = () => { setPetType(""); setPetSize(""); setLocation(""); setHasInsurance("no"); setCalculated(false); };

  const initial = () => {
    let adoption = 0, supplies = 0, vet = 0;
    if (petType === "dog") { adoption = petSize === "small" ? 150 : petSize === "medium" ? 200 : 300; supplies = petSize === "small" ? 300 : petSize === "medium" ? 400 : 500; vet = 300; }
    else if (petType === "cat") { adoption = 100; supplies = 250; vet = 250; }
    else if (petType === "bird") { adoption = 50; supplies = 200; vet = 150; }
    else if (petType === "rabbit") { adoption = 75; supplies = 200; vet = 150; }
    const m = location === "urban" ? 1.2 : location === "suburban" ? 1 : 0.9;
    return { adoption, supplies, vet: vet * m, total: adoption + supplies + vet * m };
  };

  const monthly = () => {
    let food = 0, grooming = 0, vet = 0, ins = 0;
    if (petType === "dog") { food = petSize === "small" ? 50 : petSize === "medium" ? 75 : 100; grooming = petSize === "small" ? 30 : petSize === "medium" ? 40 : 60; vet = 40; ins = hasInsurance === "yes" ? (petSize === "small" ? 30 : petSize === "medium" ? 40 : 50) : 0; }
    else if (petType === "cat") { food = 40; grooming = 15; vet = 30; ins = hasInsurance === "yes" ? 25 : 0; }
    else if (petType === "bird") { food = 25; grooming = 10; vet = 20; ins = hasInsurance === "yes" ? 15 : 0; }
    else if (petType === "rabbit") { food = 30; grooming = 15; vet = 25; ins = hasInsurance === "yes" ? 20 : 0; }
    const m = location === "urban" ? 1.2 : location === "suburban" ? 1 : 0.9;
    return { food: food * m, grooming: grooming * m, vet: vet * m, ins, other: 20, total: (food + grooming + vet + ins + 20) * m };
  };

  const ic = initial();
  const mc = monthly();
  const yearly = mc.total * 12;
  const lifeYears = petType === "dog" ? 12 : petType === "cat" ? 15 : 8;
  const lifetime = ic.total + yearly * lifeYears;

  const canCalc = petType && (petType !== "dog" || petSize) && location;

  return (
    <ToolShell
      eyebrow="Budget Planner"
      title="Pet Cost Calculator"
      subtitle="Estimate the true cost of pet ownership — initial setup, monthly running costs and lifetime."
    >
      <div className="space-y-6">
        <ToolStep number={1} title="Choose your pet" complete={!!petType}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PET_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => { setPetType(value); setPetSize(""); setCalculated(false); }}
                className={`p-5 rounded-xl border transition-all text-center ${
                  petType === value ? "border-primary bg-primary/5 shadow-soft" : "bg-background hover:bg-muted"
                }`}
                style={petType !== value ? { borderColor: "hsl(var(--hairline))" } : undefined}
              >
                <Icon className={`h-7 w-7 mx-auto mb-2 ${petType === value ? "text-primary" : "text-foreground/70"}`} />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </ToolStep>

        <ToolStep number={2} title="Details" active={!!petType} complete={canCalc}>
          <div className="grid sm:grid-cols-2 gap-5">
            {petType === "dog" && (
              <div className="space-y-2">
                <Label>Dog size</Label>
                <Select value={petSize} onValueChange={(v) => { setPetSize(v); setCalculated(false); }}>
                  <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (under 25 lbs)</SelectItem>
                    <SelectItem value="medium">Medium (25–50 lbs)</SelectItem>
                    <SelectItem value="large">Large (over 50 lbs)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label>Location</Label>
              <Select value={location} onValueChange={(v) => { setLocation(v); setCalculated(false); }}>
                <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="urban">Urban (high cost)</SelectItem>
                  <SelectItem value="suburban">Suburban (avg)</SelectItem>
                  <SelectItem value="rural">Rural (lower cost)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Pet insurance</Label>
              <Select value={hasInsurance} onValueChange={(v) => { setHasInsurance(v); setCalculated(false); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-6">
            <Button onClick={() => setCalculated(true)} disabled={!canCalc} size="lg" className="w-full sm:w-auto">
              <Calculator className="mr-2 h-4 w-4" /> Calculate costs
            </Button>
          </div>
        </ToolStep>

        {calculated && (
          <div className="space-y-5">
            <ResultCard tone="info" title="Lifetime estimate">
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Per month</p>
                  <p className="font-display text-3xl mt-1">${mc.total.toFixed(0)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Per year</p>
                  <p className="font-display text-3xl mt-1">${yearly.toFixed(0)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Lifetime (~{lifeYears}y)</p>
                  <p className="font-display text-3xl mt-1 text-primary">${lifetime.toFixed(0)}</p>
                </div>
              </div>
            </ResultCard>

            <div className="grid md:grid-cols-2 gap-5">
              <ResultCard title="Initial setup">
                <Row k="Adoption / purchase" v={ic.adoption} />
                <Row k="Initial supplies" v={ic.supplies} />
                <Row k="First vet visit" v={ic.vet} />
                <div className="border-t pt-3 mt-2 flex justify-between font-medium" style={{ borderColor: "hsl(var(--hairline))" }}>
                  <span>Total</span><span>${ic.total.toFixed(0)}</span>
                </div>
              </ResultCard>
              <ResultCard title="Monthly running cost">
                <Row k="Food" v={mc.food} />
                <Row k="Grooming" v={mc.grooming} />
                <Row k="Routine vet" v={mc.vet} />
                {hasInsurance === "yes" && <Row k="Insurance" v={mc.ins} />}
                <Row k="Toys, treats, misc" v={mc.other} />
                <div className="border-t pt-3 mt-2 flex justify-between font-medium" style={{ borderColor: "hsl(var(--hairline))" }}>
                  <span>Total per month</span><span>${mc.total.toFixed(0)}</span>
                </div>
              </ResultCard>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" onClick={reset}>Calculate again</Button>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
};

const Row = ({ k, v }: { k: string; v: number }) => (
  <div className="flex justify-between py-1.5 text-sm">
    <span className="text-muted-foreground">{k}</span>
    <span className="font-medium">${v.toFixed(0)}</span>
  </div>
);

export default PetCostCalculator;
