import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calculator, ChevronDown, Dog, Cat, Rabbit, Flame, Utensils } from "lucide-react";
import ToolShell from "@/components/tools/ToolShell";
import ToolStep from "@/components/tools/ToolStep";
import ResultCard from "@/components/tools/ResultCard";
import { useSEO } from "@/hooks/useSEO";

interface Results {
  minCalories: number;
  maxCalories: number;
  dryMin: number; dryMax: number;
  wetMin: number; wetMax: number;
}

const PET_TILES = [
  { value: "dog", label: "Dog", icon: Dog },
  { value: "cat", label: "Cat", icon: Cat },
  { value: "other", label: "Other", icon: Rabbit },
];

const CalorieCalculator = () => {
  useSEO({
    title: "Pet Calorie & Nutrition Calculator | ThePetHealthLab",
    description: "Calculate ideal daily calories and food portions for your dog or cat with our free pet nutrition calculator.",
  });

  const [petType, setPetType] = useState("");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<"lbs" | "kg">("lbs");
  const [age, setAge] = useState("");
  const [activity, setActivity] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [body, setBody] = useState("ideal");
  const [neutered, setNeutered] = useState(false);
  const [conditions, setConditions] = useState<string[]>([]);
  const [results, setResults] = useState<Results | null>(null);

  const toggleCond = (id: string, c: boolean) => setConditions(c ? [...conditions, id] : conditions.filter((x) => x !== id));

  const compute = () => {
    const kg = weightUnit === "lbs" ? parseFloat(weight) * 0.453592 : parseFloat(weight);
    const rer = 70 * Math.pow(kg, 0.75);
    let mult = activity === "low" ? 1.2 : activity === "high" ? 2.0 : 1.6;
    if (age === "puppy") mult *= 1.5; else if (age === "senior") mult *= 0.9;
    if (body === "underweight") mult *= 1.2; else if (body === "overweight") mult *= 0.8;
    if (neutered) mult *= 0.9;
    if (conditions.includes("pregnant")) mult *= 1.5;
    if (conditions.includes("weightloss")) mult *= 0.8;
    if (conditions.includes("weightgain")) mult *= 1.2;
    const base = rer * mult;
    const min = Math.round(base * 0.9), max = Math.round(base * 1.1);
    setResults({
      minCalories: min, maxCalories: max,
      dryMin: Math.round((min / 350) * 10) / 10,
      dryMax: Math.round((max / 350) * 10) / 10,
      wetMin: Math.round((min / 280) * 10) / 10,
      wetMax: Math.round((max / 280) * 10) / 10,
    });
  };

  const reset = () => { setPetType(""); setWeight(""); setAge(""); setActivity(""); setBody("ideal"); setNeutered(false); setConditions([]); setResults(null); setShowMore(false); };

  const canCalc = petType && weight && age && activity;

  return (
    <ToolShell
      eyebrow="Nutrition"
      title="Calorie & Portion Calculator"
      subtitle="Get a vet-formula calorie estimate and feeding portions for your pet."
      disclaimer="General guidance using the Resting Energy Requirement (RER) formula. Your veterinarian's advice always wins."
    >
      {!results ? (
        <div className="space-y-6">
          <ToolStep number={1} title="Type of pet" complete={!!petType}>
            <div className="grid grid-cols-3 gap-3">
              {PET_TILES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setPetType(value)}
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

          <ToolStep number={2} title="Basic information" active={!!petType} complete={!!(weight && age && activity)}>
            <div className="space-y-5">
              <div>
                <Label className="text-sm">Weight</Label>
                <div className="flex gap-2 mt-2">
                  <Input type="number" placeholder="Enter weight" value={weight} onChange={(e) => setWeight(e.target.value)} className="flex-1 bg-background" />
                  <div className="inline-flex rounded-md border" style={{ borderColor: "hsl(var(--hairline))" }}>
                    {(["lbs", "kg"] as const).map((u) => (
                      <button
                        key={u}
                        onClick={() => setWeightUnit(u)}
                        className={`px-4 text-sm transition-colors ${weightUnit === u ? "bg-foreground text-background" : "bg-background hover:bg-muted"}`}
                      >{u}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm">Age</Label>
                <Select value={age} onValueChange={setAge}>
                  <SelectTrigger className="mt-2"><SelectValue placeholder="Select life stage" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="puppy">Puppy / Kitten (0–1 yr)</SelectItem>
                    <SelectItem value="young">Young Adult (1–3 yrs)</SelectItem>
                    <SelectItem value="adult">Adult (3–7 yrs)</SelectItem>
                    <SelectItem value="senior">Senior (7+ yrs)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm mb-2 block">Activity level</Label>
                <div className="grid sm:grid-cols-3 gap-2">
                  {[
                    { v: "low", l: "Low", d: "Sedentary" },
                    { v: "moderate", l: "Moderate", d: "Regular walks" },
                    { v: "high", l: "High", d: "Athletic / working" },
                  ].map(({ v, l, d }) => (
                    <button
                      key={v}
                      onClick={() => setActivity(v)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        activity === v ? "border-primary bg-primary/5" : "bg-background hover:bg-muted"
                      }`}
                      style={activity !== v ? { borderColor: "hsl(var(--hairline))" } : undefined}
                    >
                      <div className="font-medium text-sm">{l}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{d}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </ToolStep>

          <Collapsible open={showMore} onOpenChange={setShowMore}>
            <CollapsibleTrigger asChild>
              <button className="w-full rounded-2xl border bg-[hsl(var(--surface-elevated))] p-5 flex items-center justify-between hover:bg-muted/30 transition-colors" style={{ borderColor: "hsl(var(--hairline))" }}>
                <span className="font-medium text-sm">Additional details (optional)</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showMore ? "rotate-180" : ""}`} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 rounded-2xl border bg-[hsl(var(--surface-elevated))] p-6 space-y-5" style={{ borderColor: "hsl(var(--hairline))" }}>
              <div>
                <Label className="text-sm">Body condition</Label>
                <Select value={body} onValueChange={setBody}>
                  <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="underweight">Underweight</SelectItem>
                    <SelectItem value="ideal">Ideal weight</SelectItem>
                    <SelectItem value="overweight">Overweight</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Spayed / neutered</Label>
                <Switch checked={neutered} onCheckedChange={setNeutered} />
              </div>
              <div>
                <Label className="text-sm mb-2 block">Health conditions</Label>
                <div className="space-y-2">
                  {[
                    { id: "pregnant", label: "Pregnant or nursing" },
                    { id: "weightloss", label: "Weight loss goal" },
                    { id: "weightgain", label: "Weight gain goal" },
                  ].map(({ id, label }) => (
                    <label key={id} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox checked={conditions.includes(id)} onCheckedChange={(c) => toggleCond(id, !!c)} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Button onClick={compute} disabled={!canCalc} size="lg" className="w-full">
            <Calculator className="mr-2 h-4 w-4" /> Calculate calories
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          <ResultCard tone="info" title="Daily calorie target" icon={<Flame className="h-5 w-5" />}>
            <div className="text-center py-2">
              <p className="font-display text-5xl md:text-6xl text-primary font-light tracking-tight">
                {results.minCalories}–{results.maxCalories}
              </p>
              <p className="text-sm text-muted-foreground mt-2">kcal per day</p>
            </div>
          </ResultCard>

          <ResultCard title="Feeding portions" icon={<Utensils className="h-5 w-5" />}>
            <div className="space-y-3">
              <PortionRow label="Dry kibble (350 kcal/cup)" value={`${results.dryMin}–${results.dryMax} cups/day`} />
              <PortionRow label="Wet food (280 kcal/can)" value={`${results.wetMin}–${results.wetMax} cans/day`} />
              <PortionRow label="Mixed 50/50" value={`${(results.dryMin / 2).toFixed(1)} cup dry + ${(results.wetMin / 2).toFixed(1)} can wet`} />
            </div>
            <p className="text-xs text-muted-foreground mt-4">Split into 2 meals/day for adults, 3+ for puppies and kittens.</p>
          </ResultCard>

          <ResultCard tone="warning" title="Reminders">
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>· These are general estimates — not veterinary advice</li>
              <li>· Monitor body condition and adjust portions over time</li>
              <li>· Make diet changes gradually over 7–10 days</li>
            </ul>
          </ResultCard>

          <div className="flex justify-center">
            <Button variant="outline" onClick={reset}>Calculate again</Button>
          </div>
        </div>
      )}
    </ToolShell>
  );
};

const PortionRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center py-2 border-b last:border-0" style={{ borderColor: "hsl(var(--hairline))" }}>
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default CalorieCalculator;
