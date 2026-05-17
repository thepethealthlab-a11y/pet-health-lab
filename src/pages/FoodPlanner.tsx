import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dog, Cat, Rabbit, Utensils, Pizza, Clock, ShoppingBag, Lightbulb } from "lucide-react";
import ToolShell from "@/components/tools/ToolShell";
import ToolStep from "@/components/tools/ToolStep";
import ResultCard from "@/components/tools/ResultCard";
import { useSEO } from "@/hooks/useSEO";

interface DietResults {
  dailyCalories: number;
  foodPortion: number;
  foodType: string;
  feedingFrequency: string;
  tip: string;
  petName?: string;
}

const PET_TILES = [
  { value: "Dog", icon: Dog },
  { value: "Cat", icon: Cat },
  { value: "Other", icon: Rabbit },
];

const FoodPlanner = () => {
  useSEO({
    title: "Pet Food & Diet Planner | ThePetHealthLab",
    description: "Calculate your dog or cat's ideal daily diet, calories and feeding guide with our pet nutrition planner.",
    canonical: "https://pet-health-lab.lovable.app/tools/food-planner",
  });

  const [petType, setPetType] = useState("");
  const [breed, setBreed] = useState("");
  const [ageYears, setAgeYears] = useState("");
  const [ageMonths, setAgeMonths] = useState("");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [activity, setActivity] = useState("");
  const [allergies, setAllergies] = useState("");
  const [results, setResults] = useState<DietResults | null>(null);

  const calc = () => {
    if (!petType || !weight || !activity) return;
    const kg = weightUnit === "lbs" ? parseFloat(weight) * 0.453592 : parseFloat(weight);
    const totalMonths = parseInt(ageYears || "0") * 12 + parseInt(ageMonths || "0");
    const rer = 70 * Math.pow(kg, 0.75);
    let m = activity === "low" ? 1.2 : activity === "high" ? 2.0 : 1.6;
    if (totalMonths < 4) m *= 3; else if (totalMonths < 12) m *= 2; else if (totalMonths > 84) m *= 0.8;
    const daily = Math.round(rer * m);
    const portion = parseFloat((daily / 350).toFixed(1));
    let foodType = "Dry food";
    if (kg < 5 || totalMonths < 6) foodType = "Mix of wet and dry food";
    else if (totalMonths > 96 && activity === "low") foodType = "Soft dry or wet food";
    let freq = "2 times per day";
    if (totalMonths < 4) freq = "3–4 times per day";
    else if (totalMonths < 12) freq = "3 times per day";
    const tips = [
      "Always provide fresh water alongside meals.",
      "Monitor weight regularly and adjust portions.",
      "Avoid table scraps to keep the diet balanced.",
      "Split daily portions into multiple meals.",
      "Choose age-appropriate formulas.",
    ];
    setResults({
      dailyCalories: daily,
      foodPortion: portion,
      foodType,
      feedingFrequency: freq,
      tip: tips[Math.floor(Math.random() * tips.length)],
      petName: breed || petType,
    });
  };

  const reset = () => { setPetType(""); setBreed(""); setAgeYears(""); setAgeMonths(""); setWeight(""); setActivity(""); setAllergies(""); setResults(null); };

  const canCalc = !!(petType && weight && activity);

  return (
    <ToolShell
      eyebrow="Diet Planner"
      title="Pet Food & Diet Planner"
      subtitle="Calculate the ideal daily portions, calories and feeding schedule for your pet."
      disclaimer="Educational tool — always consult your veterinarian for tailored nutrition advice."
    >
      {!results ? (
        <div className="space-y-6">
          <ToolStep number={1} title="Pet type" complete={!!petType}>
            <div className="grid grid-cols-3 gap-3">
              {PET_TILES.map(({ value, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setPetType(value)}
                  className={`p-5 rounded-xl border transition-all text-center ${
                    petType === value ? "border-primary bg-primary/5 shadow-soft" : "bg-background hover:bg-muted"
                  }`}
                  style={petType !== value ? { borderColor: "hsl(var(--hairline))" } : undefined}
                >
                  <Icon className={`h-7 w-7 mx-auto mb-2 ${petType === value ? "text-primary" : "text-foreground/70"}`} />
                  <span className="text-sm font-medium">{value}</span>
                </button>
              ))}
            </div>
          </ToolStep>

          <ToolStep number={2} title="Pet details" active={!!petType} complete={canCalc}>
            <div className="space-y-5">
              <div>
                <Label className="text-sm">Breed (optional)</Label>
                <Input className="mt-2 bg-background" placeholder="e.g. Golden Retriever" value={breed} onChange={(e) => setBreed(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm">Age — years</Label>
                  <Input className="mt-2 bg-background" type="number" min="0" max="30" placeholder="0" value={ageYears} onChange={(e) => setAgeYears(e.target.value)} />
                </div>
                <div>
                  <Label className="text-sm">Age — months</Label>
                  <Input className="mt-2 bg-background" type="number" min="0" max="11" placeholder="0" value={ageMonths} onChange={(e) => setAgeMonths(e.target.value)} />
                </div>
              </div>

              <div>
                <Label className="text-sm">Weight</Label>
                <div className="flex gap-2 mt-2">
                  <Input type="number" min="0.1" step="0.1" placeholder="Enter weight" value={weight} onChange={(e) => setWeight(e.target.value)} className="flex-1 bg-background" />
                  <div className="inline-flex rounded-md border" style={{ borderColor: "hsl(var(--hairline))" }}>
                    {(["kg", "lbs"] as const).map((u) => (
                      <button key={u} onClick={() => setWeightUnit(u)} className={`px-4 text-sm ${weightUnit === u ? "bg-foreground text-background" : "bg-background hover:bg-muted"}`}>{u}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm mb-2 block">Activity level</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { v: "low", l: "Low" },
                    { v: "normal", l: "Normal" },
                    { v: "high", l: "High" },
                  ].map(({ v, l }) => (
                    <button
                      key={v}
                      onClick={() => setActivity(v)}
                      className={`py-3 rounded-lg border text-sm font-medium transition-all ${
                        activity === v ? "border-primary bg-primary/5 text-primary" : "bg-background hover:bg-muted"
                      }`}
                      style={activity !== v ? { borderColor: "hsl(var(--hairline))" } : undefined}
                    >{l}</button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm">Allergies (optional)</Label>
                <Textarea className="mt-2 bg-background" rows={2} placeholder="Known food allergies or sensitivities" value={allergies} onChange={(e) => setAllergies(e.target.value)} />
              </div>
            </div>

            <div className="mt-6">
              <Button onClick={calc} disabled={!canCalc} size="lg" className="w-full">Generate diet plan</Button>
            </div>
          </ToolStep>
        </div>
      ) : (
        <div className="space-y-5">
          <ResultCard tone="success" title={`Plan for ${results.petName}`}>
            <p className="text-base">
              {results.petName} needs about <span className="font-display text-2xl text-primary">{results.foodPortion} cups</span> of {results.foodType.toLowerCase()} per day.
            </p>
          </ResultCard>

          <div className="grid sm:grid-cols-2 gap-4">
            <Stat icon={<Utensils className="h-5 w-5" />} label="Daily calories" value={`${results.dailyCalories} kcal`} />
            <Stat icon={<Pizza className="h-5 w-5" />} label="Food portion" value={`${results.foodPortion} cups · ~${Math.round(results.foodPortion * 240)}g`} />
            <Stat icon={<ShoppingBag className="h-5 w-5" />} label="Food type" value={results.foodType} />
            <Stat icon={<Clock className="h-5 w-5" />} label="Feeding frequency" value={results.feedingFrequency} />
          </div>

          <ResultCard tone="info" title="Nutrition tip" icon={<Lightbulb className="h-5 w-5" />}>
            {results.tip}
          </ResultCard>

          {allergies && (
            <ResultCard tone="warning" title="Allergy note">
              Your pet has listed allergies: <span className="text-foreground">{allergies}</span>. Make sure any chosen food is allergen-free.
            </ResultCard>
          )}

          <div className="flex justify-center">
            <Button variant="outline" onClick={reset}>Plan another pet</Button>
          </div>
        </div>
      )}
    </ToolShell>
  );
};

const Stat = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="rounded-2xl border bg-[hsl(var(--surface-elevated))] p-5 shadow-soft" style={{ borderColor: "hsl(var(--hairline))" }}>
    <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide mb-2">
      {icon}<span>{label}</span>
    </div>
    <p className="font-display text-xl text-foreground leading-snug">{value}</p>
  </div>
);

export default FoodPlanner;
