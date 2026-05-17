import { useState, useMemo } from "react";
import { Search, AlertTriangle, Check, Phone, ShieldAlert, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ToolShell from "@/components/tools/ToolShell";
import ResultCard from "@/components/tools/ResultCard";
import { useSEO } from "@/hooks/useSEO";
import { Link } from "react-router-dom";

interface FoodItem {
  name: string;
  safe: boolean;
  toxicityLevel?: "High" | "Medium" | "Low";
  toxicComponent?: string;
  danger?: string;
  symptoms?: string[];
  whatToDo?: string[];
  benefits?: string;
  servingSuggestions?: string[];
  precautions?: string[];
  category: string[];
  alternativeNames?: string[];
}

const FOOD_DATABASE: FoodItem[] = [
  { name: "Chocolate", safe: false, toxicityLevel: "High", toxicComponent: "Theobromine and caffeine", danger: "Toxic to dogs and cats — affects the heart and nervous system. Dark chocolate is the most dangerous.", symptoms: ["Vomiting", "Diarrhea", "Rapid breathing", "Increased heart rate", "Seizures", "Tremors"], whatToDo: ["Call your veterinarian immediately", "Note the amount, type and time", "Do not induce vomiting unless instructed"], category: ["Sweets & Desserts"], alternativeNames: ["cocoa", "cacao", "dark chocolate", "milk chocolate"] },
  { name: "Grapes", safe: false, toxicityLevel: "High", toxicComponent: "Unknown toxic substance", danger: "Grapes and raisins can cause sudden kidney failure in dogs. Even small amounts can be fatal.", symptoms: ["Vomiting", "Lethargy", "Loss of appetite", "Abdominal pain", "Decreased urination"], whatToDo: ["Call your veterinarian immediately", "Note quantity and time consumed", "Monitor closely"], category: ["Fruits"], alternativeNames: ["raisins", "currants", "sultanas"] },
  { name: "Onion", safe: false, toxicityLevel: "High", toxicComponent: "N-propyl disulfide", danger: "Damages red blood cells, causing anemia. All forms (raw, cooked, powdered) are toxic.", symptoms: ["Weakness", "Pale gums", "Dark urine", "Vomiting", "Elevated heart rate"], whatToDo: ["Contact veterinarian immediately", "Note quantity consumed", "Watch breathing and gum color"], category: ["Vegetables"], alternativeNames: ["garlic", "leeks", "chives", "shallots", "scallions"] },
  { name: "Avocado", safe: false, toxicityLevel: "Medium", toxicComponent: "Persin", danger: "Persin can cause vomiting and diarrhea. The pit is also a choking hazard.", symptoms: ["Vomiting", "Diarrhea", "Difficulty breathing", "Abdominal discomfort"], whatToDo: ["Contact veterinarian", "Monitor symptoms", "Remove access to avocado"], category: ["Fruits"], alternativeNames: ["alligator pear"] },
  { name: "Xylitol", safe: false, toxicityLevel: "High", toxicComponent: "Xylitol (artificial sweetener)", danger: "Causes rapid insulin release leading to hypoglycemia and liver failure. Even small amounts are extremely dangerous.", symptoms: ["Vomiting", "Loss of coordination", "Weakness", "Seizures", "Collapse"], whatToDo: ["Emergency vet visit immediately", "Bring product packaging", "Time is critical"], category: ["Sweets & Desserts"], alternativeNames: ["sugar-free gum", "sugar-free candy", "birch sugar"] },
  { name: "Macadamia Nuts", safe: false, toxicityLevel: "Medium", toxicComponent: "Unknown toxic compound", danger: "Causes temporary neurological symptoms in dogs.", symptoms: ["Weakness in hind legs", "Depression", "Vomiting", "Tremors", "Hyperthermia"], whatToDo: ["Contact veterinarian", "Note amount consumed", "Keep pet cool and calm"], category: ["Proteins"] },
  { name: "Coffee", safe: false, toxicityLevel: "High", toxicComponent: "Caffeine", danger: "Caffeine is toxic to dogs and cats, affecting the heart and nervous system.", symptoms: ["Restlessness", "Rapid breathing", "Heart palpitations", "Tremors", "Seizures"], whatToDo: ["Contact emergency vet", "Note caffeine amount and time", "Monitor heart rate"], category: ["Beverages"], alternativeNames: ["caffeine", "tea", "energy drinks", "espresso"] },
  { name: "Alcohol", safe: false, toxicityLevel: "High", toxicComponent: "Ethanol", danger: "Even small amounts can cause serious intoxication, coma or death.", symptoms: ["Vomiting", "Disorientation", "Difficulty breathing", "Tremors", "Coma"], whatToDo: ["Emergency vet immediately", "Note type and amount", "Do not induce vomiting"], category: ["Beverages"], alternativeNames: ["beer", "wine", "spirits", "liquor"] },
  { name: "Cooked Bones", safe: false, toxicityLevel: "High", toxicComponent: "Splintering hazard", danger: "Cooked bones splinter and can cause choking, perforation or blockages.", symptoms: ["Choking", "Bloody stools", "Constipation", "Vomiting", "Lethargy"], whatToDo: ["Emergency vet immediately if consumed", "Do not induce vomiting", "Monitor for distress"], category: ["Bones & Chews"], alternativeNames: ["chicken bones", "turkey bones", "rib bones"] },
  { name: "Chicken", safe: true, benefits: "Excellent lean protein with B-vitamins and minerals.", servingSuggestions: ["Cook thoroughly without seasoning", "Remove all bones", "Serve plain, boiled or baked"], precautions: ["Never serve raw", "No garlic, onion or salt"], category: ["Proteins"], alternativeNames: ["poultry", "chicken breast"] },
  { name: "Carrots", safe: true, benefits: "Low-calorie, high-fiber, rich in beta-carotene. Good for dental health.", servingSuggestions: ["Serve raw as crunchy treats", "Cook and mash for easier digestion", "Cut into bite-sized pieces"], precautions: ["Cut to appropriate size", "Introduce gradually"], category: ["Vegetables"] },
  { name: "Peanut Butter", safe: true, benefits: "Protein, healthy fats, and B/E vitamins. Useful for hiding medication.", servingSuggestions: ["Use unsalted, unsweetened only", "Small amounts (high in calories)", "Great for puzzle toys"], precautions: ["CRITICAL: Check label for xylitol — never give if present", "High in fat — use sparingly"], category: ["Proteins"], alternativeNames: ["nut butter"] },
  { name: "Cheese", safe: true, benefits: "Protein, calcium, vitamins. Useful as high-value treats.", servingSuggestions: ["Small amounts as training rewards", "Choose low-fat varieties"], precautions: ["Many pets are lactose intolerant", "High in fat — use sparingly"], category: ["Proteins"], alternativeNames: ["cheddar", "mozzarella", "cottage cheese"] },
  { name: "Eggs", safe: true, benefits: "Complete protein with essential amino acids and minerals.", servingSuggestions: ["Cook thoroughly (scrambled or boiled)", "Serve plain"], precautions: ["Always cook — never raw", "No salt, butter or seasonings"], category: ["Proteins"] },
  { name: "Apples", safe: true, benefits: "Vitamins A and C, fiber and antioxidants.", servingSuggestions: ["Remove core and seeds", "Cut into bite-sized pieces"], precautions: ["ALWAYS remove seeds (cyanide)", "High in sugar — feed in moderation"], category: ["Fruits"] },
  { name: "Blueberries", safe: true, benefits: "Antioxidants, fiber, vitamins C and K.", servingSuggestions: ["Fresh or frozen", "Great as training treats"], precautions: ["Introduce slowly", "Wash thoroughly"], category: ["Fruits"] },
  { name: "Watermelon", safe: true, benefits: "Hydrating, low in calories, vitamins A, B6 and C.", servingSuggestions: ["Remove all seeds and rind", "Serve chilled"], precautions: ["Remove seeds completely", "Remove rind", "Feed in moderation"], category: ["Fruits"] },
  { name: "Sweet Potato", safe: true, benefits: "Fiber, vitamins A, C, B6 and minerals.", servingSuggestions: ["Cook thoroughly (baked or boiled)", "Serve plain"], precautions: ["Always cook", "No butter, salt or marshmallow"], category: ["Vegetables"], alternativeNames: ["yam"] },
  { name: "Green Beans", safe: true, benefits: "Low-calorie, high fiber. Good for weight management.", servingSuggestions: ["Raw, steamed, or cooked plain"], precautions: ["No added salt", "Avoid canned with sodium"], category: ["Vegetables"] },
  { name: "Pumpkin", safe: true, benefits: "Excellent for digestion. Helps with both diarrhea and constipation.", servingSuggestions: ["Plain canned pumpkin (not pie filling)", "Mix small amounts into food"], precautions: ["Plain only — no spices or sugar", "Start with 1-2 tablespoons"], category: ["Vegetables"] },
  { name: "Salmon", safe: true, benefits: "Omega-3 fatty acids, protein, and vitamins. Excellent for coat health.", servingSuggestions: ["Cook thoroughly — never raw", "Remove all bones"], precautions: ["MUST be cooked", "Remove all bones", "High in fat — moderation"], category: ["Proteins"], alternativeNames: ["fish"] },
  { name: "Rice", safe: true, benefits: "Easily digestible carbohydrate. Good for upset stomachs.", servingSuggestions: ["Plain, cooked white or brown", "Mix with lean protein"], precautions: ["Always cooked", "No salt or seasonings"], category: ["Proteins"], alternativeNames: ["white rice", "brown rice"] },
  { name: "Banana", safe: true, benefits: "Potassium, vitamins B6 and C, fiber.", servingSuggestions: ["Peel and slice", "Freeze for a cool treat"], precautions: ["High in sugar — moderation", "Remove peel"], category: ["Fruits"] },
  { name: "Strawberries", safe: true, benefits: "Fiber, vitamin C and antioxidants.", servingSuggestions: ["Remove leaves and stems", "Cut into small pieces"], precautions: ["High in sugar — sparingly", "Wash thoroughly"], category: ["Fruits"] },
];

const POPULAR = ["Chocolate", "Grapes", "Onion", "Avocado", "Chicken", "Peanut Butter", "Cheese", "Eggs"];
const CATEGORIES = ["Fruits", "Vegetables", "Proteins", "Sweets & Desserts", "Beverages", "Bones & Chews"];

const ToxicFoodScanner = () => {
  useSEO({
    title: "Toxic Food Database for Pets | ThePetHealthLab",
    description: "Check if a food is safe for your pet. Search common foods instantly with toxicity information and safety guidelines.",
    canonical: "https://pet-health-lab.lovable.app/tools/toxic-food",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFoods = useMemo(() => {
    let results = FOOD_DATABASE;
    if (selectedCategory) results = results.filter((f) => f.category.includes(selectedCategory));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (f) => f.name.toLowerCase().includes(q) || f.alternativeNames?.some((a) => a.toLowerCase().includes(q))
      );
    }
    return results.sort((a, b) => (a.safe === b.safe ? 0 : a.safe ? 1 : -1));
  }, [searchQuery, selectedCategory]);

  return (
    <ToolShell
      eyebrow="Food Safety"
      title="Toxic Food Database"
      subtitle="Search common foods to instantly check if they're safe for your pet."
      disclaimer="Educational reference only. When in doubt, contact your veterinarian or a pet poison helpline."
    >
      <div className="space-y-8">
        {/* Search */}
        <div className="rounded-2xl border bg-[hsl(var(--surface-elevated))] shadow-soft p-6 md:p-7" style={{ borderColor: "hsl(var(--hairline))" }}>
          <label className="text-sm font-medium text-foreground mb-3 block">Search any food</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="e.g. chocolate, grapes, peanut butter…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 text-base bg-background"
            />
          </div>

          <div className="mt-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Popular</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR.map((name) => (
                <button
                  key={name}
                  onClick={() => { setSearchQuery(name); setSelectedCategory(null); }}
                  className="px-3 py-1.5 rounded-full text-sm border bg-background hover:bg-muted transition-colors"
                  style={{ borderColor: "hsl(var(--hairline))" }}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Browse by category</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => { setSelectedCategory(selectedCategory === c ? null : c); setSearchQuery(""); }}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    selectedCategory === c ? "bg-foreground text-background border-foreground" : "bg-background hover:bg-muted"
                  }`}
                  style={selectedCategory === c ? undefined : { borderColor: "hsl(var(--hairline))" }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredFoods.length > 0 && (
          <div className="space-y-5">
            {filteredFoods.map((food, i) => (
              <ResultCard
                key={i}
                tone={food.safe ? "success" : "danger"}
                title={food.name}
                icon={food.safe ? <ShieldCheck className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
              >
                <div className="space-y-5">
                  <div className="flex items-center gap-2">
                    {food.safe ? (
                      <Badge className="bg-secondary text-secondary-foreground"><Check className="mr-1 h-3.5 w-3.5" /> Generally safe</Badge>
                    ) : (
                      <Badge variant="destructive"><AlertTriangle className="mr-1 h-3.5 w-3.5" /> Toxic — {food.toxicityLevel} risk</Badge>
                    )}
                    {food.alternativeNames && food.alternativeNames.length > 0 && (
                      <span className="text-xs text-muted-foreground italic">also: {food.alternativeNames.join(", ")}</span>
                    )}
                  </div>

                  {!food.safe ? (
                    <>
                      {food.danger && <p>{food.danger}</p>}
                      {food.toxicComponent && (
                        <p className="text-sm"><span className="font-medium text-foreground">Toxic component:</span> <span className="text-muted-foreground">{food.toxicComponent}</span></p>
                      )}
                      {food.symptoms && (
                        <div>
                          <p className="text-sm font-medium mb-2">Symptoms to watch for</p>
                          <div className="flex flex-wrap gap-1.5">
                            {food.symptoms.map((s) => (
                              <span key={s} className="text-xs px-2 py-1 rounded-md bg-muted">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {food.whatToDo && (
                        <div className="rounded-xl bg-background p-4 border" style={{ borderColor: "hsl(var(--hairline))" }}>
                          <p className="text-sm font-medium mb-2">What to do</p>
                          <ol className="space-y-1.5 text-sm text-muted-foreground list-decimal list-inside">
                            {food.whatToDo.map((a, j) => <li key={j}>{a}</li>)}
                          </ol>
                        </div>
                      )}
                      <div className="rounded-xl border bg-background p-4 text-sm" style={{ borderColor: "hsl(var(--hairline))" }}>
                        <p className="font-medium flex items-center gap-2 mb-2"><Phone className="h-4 w-4" /> Emergency hotlines (US)</p>
                        <p className="text-muted-foreground">Pet Poison Helpline · <strong className="text-foreground">(855) 764-7661</strong></p>
                        <p className="text-muted-foreground">ASPCA Animal Poison Control · <strong className="text-foreground">(888) 426-4435</strong></p>
                      </div>
                    </>
                  ) : (
                    <>
                      {food.benefits && <p>{food.benefits}</p>}
                      {food.servingSuggestions && (
                        <div>
                          <p className="text-sm font-medium mb-2">Serving suggestions</p>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {food.servingSuggestions.map((s) => <li key={s}>· {s}</li>)}
                          </ul>
                        </div>
                      )}
                      {food.precautions && (
                        <div>
                          <p className="text-sm font-medium mb-2">Precautions</p>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {food.precautions.map((s) => <li key={s}>· {s}</li>)}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </ResultCard>
            ))}
          </div>
        )}

        {searchQuery && filteredFoods.length === 0 && (
          <ResultCard tone="warning" title="No matches found" icon={<AlertTriangle className="h-5 w-5" />}>
            We couldn't find "{searchQuery}" in our database. When in doubt, contact your veterinarian.
          </ResultCard>
        )}

        <div className="rounded-2xl border bg-gradient-ink text-background p-6 md:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="font-display text-lg">Personalised alerts for your pet</p>
            <p className="text-sm text-background/70">Premium tailors warnings to breed, age and health conditions.</p>
          </div>
          <Button asChild variant="secondary"><Link to="/premium">Upgrade</Link></Button>
        </div>
      </div>
    </ToolShell>
  );
};

export default ToxicFoodScanner;
