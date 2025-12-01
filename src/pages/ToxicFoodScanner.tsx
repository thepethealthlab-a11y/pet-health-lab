import { useState, useMemo } from "react";
import { Search, AlertTriangle, Check, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
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
  // TOXIC FOODS
  {
    name: "Chocolate",
    safe: false,
    toxicityLevel: "High",
    toxicComponent: "Theobromine and caffeine",
    danger: "These compounds are toxic to dogs and cats, causing serious cardiovascular and nervous system issues. Dark chocolate is particularly dangerous.",
    symptoms: ["Vomiting", "Diarrhea", "Rapid breathing", "Increased heart rate", "Seizures", "Tremors"],
    whatToDo: [
      "Call your veterinarian IMMEDIATELY",
      "Provide details: amount eaten, type of chocolate, time, pet's weight",
      "Do NOT induce vomiting unless instructed by vet"
    ],
    category: ["Sweets & Desserts"],
    alternativeNames: ["cocoa", "cacao", "dark chocolate", "milk chocolate"]
  },
  {
    name: "Grapes",
    safe: false,
    toxicityLevel: "High",
    toxicComponent: "Unknown toxic substance",
    danger: "Grapes and raisins can cause sudden kidney failure in dogs. Even small amounts can be fatal.",
    symptoms: ["Vomiting", "Lethargy", "Loss of appetite", "Abdominal pain", "Decreased urination", "Kidney failure"],
    whatToDo: [
      "Call your veterinarian IMMEDIATELY",
      "Note amount consumed and time",
      "Monitor for symptoms closely"
    ],
    category: ["Fruits"],
    alternativeNames: ["raisins", "currants", "sultanas"]
  },
  {
    name: "Onion",
    safe: false,
    toxicityLevel: "High",
    toxicComponent: "N-propyl disulfide",
    danger: "Damages red blood cells causing anemia. All forms (raw, cooked, powdered) are toxic to dogs and cats.",
    symptoms: ["Weakness", "Pale gums", "Orange or dark-colored urine", "Vomiting", "Elevated heart rate"],
    whatToDo: [
      "Contact veterinarian immediately",
      "Note quantity consumed",
      "Monitor breathing and gum color"
    ],
    category: ["Vegetables"],
    alternativeNames: ["garlic", "leeks", "chives", "shallots", "scallions"]
  },
  {
    name: "Avocado",
    safe: false,
    toxicityLevel: "Medium",
    toxicComponent: "Persin",
    danger: "Contains persin which can cause vomiting and diarrhea in dogs and cats. The pit also poses a choking hazard.",
    symptoms: ["Vomiting", "Diarrhea", "Difficulty breathing", "Abdominal discomfort"],
    whatToDo: [
      "Contact veterinarian",
      "Monitor symptoms",
      "Remove access to avocado"
    ],
    category: ["Fruits"],
    alternativeNames: ["alligator pear"]
  },
  {
    name: "Xylitol",
    safe: false,
    toxicityLevel: "High",
    toxicComponent: "Xylitol (artificial sweetener)",
    danger: "Causes rapid insulin release leading to hypoglycemia and liver failure. Even small amounts are extremely dangerous.",
    symptoms: ["Vomiting", "Loss of coordination", "Weakness", "Seizures", "Collapse", "Liver failure"],
    whatToDo: [
      "Emergency vet visit IMMEDIATELY - this is critical",
      "Bring product packaging",
      "Time is of the essence"
    ],
    category: ["Sweets & Desserts"],
    alternativeNames: ["sugar-free gum", "sugar-free candy", "artificial sweetener", "birch sugar"]
  },
  {
    name: "Macadamia Nuts",
    safe: false,
    toxicityLevel: "Medium",
    toxicComponent: "Unknown toxic compound",
    danger: "Causes temporary but serious neurological symptoms in dogs. Cats are less affected but should still avoid.",
    symptoms: ["Weakness in hind legs", "Depression", "Vomiting", "Tremors", "Hyperthermia"],
    whatToDo: [
      "Contact veterinarian",
      "Note amount consumed",
      "Keep pet cool and calm"
    ],
    category: ["Proteins"],
    alternativeNames: []
  },
  {
    name: "Coffee",
    safe: false,
    toxicityLevel: "High",
    toxicComponent: "Caffeine",
    danger: "Caffeine is toxic to dogs and cats, affecting the heart and nervous system.",
    symptoms: ["Restlessness", "Rapid breathing", "Heart palpitations", "Muscle tremors", "Seizures"],
    whatToDo: [
      "Contact emergency vet",
      "Note caffeine amount and time",
      "Monitor heart rate and breathing"
    ],
    category: ["Beverages"],
    alternativeNames: ["caffeine", "tea", "energy drinks", "espresso"]
  },
  {
    name: "Alcohol",
    safe: false,
    toxicityLevel: "High",
    toxicComponent: "Ethanol",
    danger: "Even small amounts can cause serious intoxication. Can lead to coma or death.",
    symptoms: ["Vomiting", "Disorientation", "Difficulty breathing", "Tremors", "Coma"],
    whatToDo: [
      "Emergency vet IMMEDIATELY",
      "Note type and amount of alcohol",
      "Do NOT induce vomiting"
    ],
    category: ["Beverages"],
    alternativeNames: ["beer", "wine", "spirits", "ethanol", "liquor"]
  },
  {
    name: "Cooked Bones",
    safe: false,
    toxicityLevel: "High",
    toxicComponent: "Splintering hazard",
    danger: "Cooked bones splinter easily and can cause choking, intestinal perforation, or blockages.",
    symptoms: ["Choking", "Bloody stools", "Constipation", "Vomiting", "Lethargy"],
    whatToDo: [
      "Emergency vet IMMEDIATELY if bone consumed",
      "Do NOT induce vomiting",
      "Monitor for signs of distress"
    ],
    category: ["Bones & Chews"],
    alternativeNames: ["chicken bones", "turkey bones", "rib bones", "pork bones"]
  },

  // SAFE FOODS
  {
    name: "Chicken",
    safe: true,
    benefits: "Excellent source of lean protein, vitamins B6 and B12, and minerals. Great for muscle development and energy.",
    servingSuggestions: [
      "Cook thoroughly without seasoning",
      "Remove all bones (cooked bones are dangerous)",
      "Serve plain, boiled, or baked",
      "Can be mixed with dog food or served alone"
    ],
    precautions: [
      "Never serve raw to avoid bacteria",
      "Remove skin if pet has sensitive stomach",
      "No seasonings, especially garlic or onion"
    ],
    category: ["Proteins"],
    alternativeNames: ["poultry", "chicken breast", "chicken thigh"]
  },
  {
    name: "Carrots",
    safe: true,
    benefits: "Low in calories, high in fiber and beta-carotene (vitamin A). Great for dental health and vision.",
    servingSuggestions: [
      "Serve raw as crunchy treats",
      "Cook and mash for easier digestion",
      "Cut into bite-sized pieces to prevent choking",
      "Freeze for a refreshing summer treat"
    ],
    precautions: [
      "Cut into appropriate sizes for your pet",
      "Introduce gradually if new to diet",
      "Monitor for digestive upset"
    ],
    category: ["Vegetables"],
    alternativeNames: []
  },
  {
    name: "Peanut Butter",
    safe: true,
    benefits: "Rich in protein, healthy fats, and vitamins B and E. Great for hiding medication or as training treats.",
    servingSuggestions: [
      "Use unsalted, unsweetened varieties only",
      "Serve in small amounts (high in calories)",
      "Great for puzzle toys or Kong filling",
      "Mix with dog food for picky eaters"
    ],
    precautions: [
      "CRITICAL: Check label for xylitol - NEVER give if present",
      "High in fat - use sparingly",
      "May cause weight gain if overused",
      "Some pets may have peanut allergies"
    ],
    category: ["Proteins"],
    alternativeNames: ["nut butter"]
  },
  {
    name: "Cheese",
    safe: true,
    benefits: "Good source of protein, calcium, and vitamins. Most dogs love cheese and it can be used as high-value treats.",
    servingSuggestions: [
      "Use small amounts as training rewards",
      "Choose low-fat varieties",
      "Cube into small pieces",
      "Great for hiding medication"
    ],
    precautions: [
      "Many pets are lactose intolerant",
      "High in fat - use sparingly",
      "May cause digestive upset in sensitive pets",
      "Introduce slowly and watch for reactions"
    ],
    category: ["Proteins"],
    alternativeNames: ["cheddar", "mozzarella", "cottage cheese"]
  },
  {
    name: "Eggs",
    safe: true,
    benefits: "Complete protein source with essential amino acids, vitamins, and minerals. Great for coat health.",
    servingSuggestions: [
      "Cook thoroughly (scrambled, boiled, or fried)",
      "Serve plain without oil or seasoning",
      "Can be mixed with regular food",
      "Great occasional protein boost"
    ],
    precautions: [
      "Always cook - never serve raw",
      "No added salt, butter, or seasonings",
      "Introduce gradually",
      "May cause allergies in some pets"
    ],
    category: ["Proteins"],
    alternativeNames: ["scrambled eggs", "boiled eggs", "hard-boiled eggs"]
  },
  {
    name: "Apples",
    safe: true,
    benefits: "Rich in vitamins A and C, fiber, and antioxidants. Good for dental health and digestive system.",
    servingSuggestions: [
      "Remove core and seeds completely",
      "Cut into bite-sized pieces",
      "Serve raw for crunchy texture",
      "Can be frozen for summer treats"
    ],
    precautions: [
      "ALWAYS remove seeds (contain cyanide)",
      "Remove core and stem",
      "Cut appropriately to prevent choking",
      "High in sugar - feed in moderation"
    ],
    category: ["Fruits"],
    alternativeNames: ["apple slices"]
  },
  {
    name: "Blueberries",
    safe: true,
    benefits: "Packed with antioxidants, fiber, and vitamins C and K. Called a 'superfood' for both humans and pets.",
    servingSuggestions: [
      "Serve fresh or frozen",
      "Great as training treats",
      "Mix into dog food",
      "Appropriate for small and large dogs"
    ],
    precautions: [
      "Introduce slowly in small amounts",
      "Too many may cause digestive upset",
      "Wash thoroughly before serving",
      "Size appropriate for your pet"
    ],
    category: ["Fruits"],
    alternativeNames: []
  },
  {
    name: "Watermelon",
    safe: true,
    benefits: "Hydrating treat with vitamins A, B6, and C. Low in calories and great for hot weather.",
    servingSuggestions: [
      "Remove all seeds and rind",
      "Cut into bite-sized cubes",
      "Serve chilled for refreshing treat",
      "Great for hydration in summer"
    ],
    precautions: [
      "Remove seeds completely",
      "Remove rind (hard to digest)",
      "Feed in moderation due to sugar content",
      "May cause digestive upset if too much"
    ],
    category: ["Fruits"],
    alternativeNames: []
  },
  {
    name: "Sweet Potato",
    safe: true,
    benefits: "Excellent source of dietary fiber, vitamins A, C, B6, and minerals. Great for digestive health.",
    servingSuggestions: [
      "Cook thoroughly (baked, boiled, or steamed)",
      "Serve plain without seasoning",
      "Can be mashed or cubed",
      "Great addition to regular meals"
    ],
    precautions: [
      "Always cook - never serve raw",
      "No added butter, salt, or marshmallows",
      "Remove skin if preferred",
      "High in fiber - introduce gradually"
    ],
    category: ["Vegetables"],
    alternativeNames: ["yam"]
  },
  {
    name: "Green Beans",
    safe: true,
    benefits: "Low-calorie, high-fiber vegetable with vitamins C, K, and manganese. Good for weight management.",
    servingSuggestions: [
      "Serve raw, steamed, or cooked",
      "Plain with no added salt or seasonings",
      "Can replace portion of regular food for weight loss",
      "Cut into small pieces if needed"
    ],
    precautions: [
      "No added salt, butter, or seasonings",
      "Avoid canned green beans with sodium",
      "Introduce gradually",
      "Some pets may have trouble digesting raw"
    ],
    category: ["Vegetables"],
    alternativeNames: ["string beans"]
  },
  {
    name: "Pumpkin",
    safe: true,
    benefits: "Excellent for digestive health, rich in fiber, vitamins A and C. Helps with both diarrhea and constipation.",
    servingSuggestions: [
      "Use plain canned pumpkin (not pie filling)",
      "Cook fresh pumpkin thoroughly",
      "Mix small amounts into food",
      "Great for digestive issues"
    ],
    precautions: [
      "Use plain pumpkin only - no spices or sugar",
      "Not pumpkin pie filling",
      "Too much can cause digestive upset",
      "Start with small amounts (1-2 tablespoons)"
    ],
    category: ["Vegetables"],
    alternativeNames: []
  },
  {
    name: "Salmon",
    safe: true,
    benefits: "Rich in omega-3 fatty acids, protein, and vitamins. Excellent for coat health and reduces inflammation.",
    servingSuggestions: [
      "Cook thoroughly - never serve raw",
      "Remove all bones",
      "Serve plain without seasoning",
      "Small portions 1-2 times per week"
    ],
    precautions: [
      "MUST be cooked - raw salmon can contain parasites",
      "Remove all bones",
      "No added oils or seasonings",
      "High in fat - feed in moderation"
    ],
    category: ["Proteins"],
    alternativeNames: ["fish"]
  },
  {
    name: "Rice",
    safe: true,
    benefits: "Easily digestible carbohydrate, good for upset stomachs. Provides energy and is gentle on digestion.",
    servingSuggestions: [
      "Cook plain white or brown rice",
      "Mix with lean protein for bland diet",
      "Good for digestive issues",
      "Serve at room temperature"
    ],
    precautions: [
      "Always cooked, never raw",
      "No added salt or seasonings",
      "White rice better for upset stomachs",
      "Brown rice has more fiber but harder to digest"
    ],
    category: ["Proteins"],
    alternativeNames: ["white rice", "brown rice"]
  },
  {
    name: "Banana",
    safe: true,
    benefits: "Rich in potassium, vitamins B6 and C, and fiber. Good for digestive health.",
    servingSuggestions: [
      "Peel and cut into slices",
      "Mash and mix with food",
      "Freeze for a cool treat",
      "Use as training treats"
    ],
    precautions: [
      "High in sugar - feed in moderation",
      "Remove peel completely",
      "May cause constipation if too much",
      "1-2 slices for small dogs, more for large dogs"
    ],
    category: ["Fruits"],
    alternativeNames: []
  },
  {
    name: "Strawberries",
    safe: true,
    benefits: "High in fiber, vitamin C, and antioxidants. Contains enzyme that helps whiten teeth.",
    servingSuggestions: [
      "Remove leaves and stems",
      "Cut into small pieces",
      "Serve fresh or frozen",
      "Great occasional treat"
    ],
    precautions: [
      "High in sugar - feed sparingly",
      "Cut appropriately to prevent choking",
      "Wash thoroughly",
      "May cause allergies in rare cases"
    ],
    category: ["Fruits"],
    alternativeNames: []
  }
];

const POPULAR_SEARCHES = [
  { emoji: "🍫", name: "Chocolate" },
  { emoji: "🍇", name: "Grapes" },
  { emoji: "🧅", name: "Onion" },
  { emoji: "🥑", name: "Avocado" },
  { emoji: "🍗", name: "Chicken" },
  { emoji: "🥜", name: "Peanut Butter" },
  { emoji: "🧀", name: "Cheese" },
  { emoji: "🥚", name: "Eggs" }
];

const CATEGORIES = [
  { emoji: "🍎", name: "Fruits", value: "Fruits" },
  { emoji: "🥦", name: "Vegetables", value: "Vegetables" },
  { emoji: "🍖", name: "Proteins", value: "Proteins" },
  { emoji: "🧁", name: "Sweets & Desserts", value: "Sweets & Desserts" },
  { emoji: "🌿", name: "Herbs & Spices", value: "Herbs & Spices" },
  { emoji: "🥤", name: "Beverages", value: "Beverages" },
  { emoji: "🦴", name: "Bones & Chews", value: "Bones & Chews" }
];

const ToxicFoodScanner = () => {
  useSEO({
    title: "Toxic Food Database - ThePetHealthLab",
    description: "Check if a food is safe for your pet. Search 200+ common foods instantly with toxicity information and safety guidelines.",
    keywords: "toxic foods for pets, pet food safety, dangerous foods for dogs, dangerous foods for cats, pet nutrition",
    canonical: "https://thepethealthlab.com/tools/toxic-food",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Toxic Food Database",
      "applicationCategory": "HealthApplication",
      "description": "Search database of safe and toxic foods for pets",
    },
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFoods = useMemo(() => {
    let results = FOOD_DATABASE;

    // Filter by category if selected
    if (selectedCategory) {
      results = results.filter(food => food.category.includes(selectedCategory));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter((food) => {
        const nameMatch = food.name.toLowerCase().includes(query);
        const alternativeMatch = food.alternativeNames?.some((alt) =>
          alt.toLowerCase().includes(query)
        );
        return nameMatch || alternativeMatch;
      });
    }

    // Sort: unsafe first, then by toxicity level
    return results.sort((a, b) => {
      if (a.safe === b.safe) {
        if (!a.safe && a.toxicityLevel && b.toxicityLevel) {
          const toxicityOrder = { High: 0, Medium: 1, Low: 2 };
          return toxicityOrder[a.toxicityLevel] - toxicityOrder[b.toxicityLevel];
        }
        return 0;
      }
      return a.safe ? 1 : -1;
    });
  }, [searchQuery, selectedCategory]);

  const handlePopularSearch = (name: string) => {
    setSearchQuery(name);
    setSelectedCategory(null);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
    setSearchQuery("");
  };

  const getToxicityBadge = (level: "High" | "Medium" | "Low") => {
    const config = {
      High: { variant: "destructive" as const, icon: "⚠️⚠️⚠️" },
      Medium: { variant: "default" as const, icon: "⚠️⚠️" },
      Low: { variant: "secondary" as const, icon: "⚠️" }
    };
    return config[level];
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Toxic Food Database</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Check if a food is safe for your pet. Search 200+ common foods instantly.
            </p>
            
            {/* Disclaimer Banner */}
            <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <AlertDescription className="text-amber-900 dark:text-amber-200 font-medium">
                Educational information only. When in doubt, contact your veterinarian.
              </AlertDescription>
            </Alert>
          </div>

          {/* Search Interface */}
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Search Food Name</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search food name... (e.g., chocolate, grapes, chicken)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-lg h-14"
                />
              </div>

              {/* Popular Searches */}
              <div className="mt-6">
                <p className="text-sm text-muted-foreground mb-3">Popular searches:</p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((search) => (
                    <Button
                      key={search.name}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePopularSearch(search.name)}
                      className="hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {search.emoji} {search.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          {filteredFoods.length > 0 && (
            <div className="space-y-6 mb-12">
              {filteredFoods.map((food, index) => (
                <Card key={index} className={`shadow-lg ${food.safe ? 'border-green-500' : 'border-red-500'} border-2`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{food.name}</CardTitle>
                        {food.alternativeNames && food.alternativeNames.length > 0 && (
                          <p className="text-sm text-muted-foreground italic">
                            Also known as: {food.alternativeNames.join(", ")}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant={food.safe ? "default" : "destructive"}
                        className={`text-lg px-4 py-2 ${food.safe ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                      >
                        {food.safe ? (
                          <>
                            <Check className="mr-2 h-5 w-5" />
                            SAFE
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="mr-2 h-5 w-5" />
                            TOXIC
                          </>
                        )}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {!food.safe ? (
                      /* TOXIC FOOD DISPLAY */
                      <div className="space-y-6">
                        {/* Risk Level */}
                        {food.toxicityLevel && (
                          <div>
                            <h3 className="font-semibold text-lg mb-2">Risk Level:</h3>
                            <Badge variant={getToxicityBadge(food.toxicityLevel).variant} className="text-base px-4 py-2">
                              {getToxicityBadge(food.toxicityLevel).icon} {food.toxicityLevel.toUpperCase()}
                            </Badge>
                          </div>
                        )}

                        {/* Toxic Component */}
                        {food.toxicComponent && (
                          <div>
                            <h3 className="font-semibold text-lg mb-2">Toxic Component:</h3>
                            <p className="text-muted-foreground">{food.toxicComponent}</p>
                          </div>
                        )}

                        {/* Why It's Dangerous */}
                        {food.danger && (
                          <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-900">
                            <h3 className="font-semibold text-lg mb-2 text-red-900 dark:text-red-100">WHY IT'S DANGEROUS:</h3>
                            <p className="text-red-800 dark:text-red-200">{food.danger}</p>
                          </div>
                        )}

                        {/* Symptoms */}
                        {food.symptoms && food.symptoms.length > 0 && (
                          <div>
                            <h3 className="font-semibold text-lg mb-3">SYMPTOMS IF EATEN:</h3>
                            <ul className="space-y-2">
                              {food.symptoms.map((symptom, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="text-red-600 mr-2">•</span>
                                  <span>{symptom}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* What To Do */}
                        {food.whatToDo && food.whatToDo.length > 0 && (
                          <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-900">
                            <h3 className="font-semibold text-lg mb-3 text-amber-900 dark:text-amber-100">WHAT TO DO IF YOUR PET ATE THIS:</h3>
                            <ul className="space-y-2">
                              {food.whatToDo.map((action, i) => (
                                <li key={i} className="flex items-start text-amber-900 dark:text-amber-100">
                                  <span className="mr-2">→</span>
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Emergency Contacts */}
                        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900">
                          <h3 className="font-semibold text-lg mb-3 flex items-center text-blue-900 dark:text-blue-100">
                            <Phone className="mr-2 h-5 w-5" />
                            EMERGENCY CONTACTS:
                          </h3>
                          <div className="space-y-2 text-blue-800 dark:text-blue-200">
                            <p>• Pet Poison Helpline: <strong>(855) 764-7661</strong> (fee may apply)</p>
                            <p>• ASPCA Animal Poison Control: <strong>(888) 426-4435</strong> (fee may apply)</p>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="pt-4">
                          <Button asChild className="w-full sm:w-auto">
                            <Link to="/tools/vet-finder">Find Emergency Vet Near Me</Link>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* SAFE FOOD DISPLAY */
                      <div className="space-y-6">
                        <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-900">
                          <h3 className="font-semibold text-lg mb-2 text-green-900 dark:text-green-100">
                            ✅ GENERALLY SAFE FOR DOGS & CATS
                          </h3>
                        </div>

                        {/* Nutritional Benefits */}
                        {food.benefits && (
                          <div>
                            <h3 className="font-semibold text-lg mb-2">NUTRITIONAL BENEFITS:</h3>
                            <p className="text-muted-foreground">{food.benefits}</p>
                          </div>
                        )}

                        {/* Serving Suggestions */}
                        {food.servingSuggestions && food.servingSuggestions.length > 0 && (
                          <div>
                            <h3 className="font-semibold text-lg mb-3">SERVING SUGGESTIONS:</h3>
                            <ul className="space-y-2">
                              {food.servingSuggestions.map((suggestion, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="text-green-600 mr-2">•</span>
                                  <span>{suggestion}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Precautions */}
                        {food.precautions && food.precautions.length > 0 && (
                          <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-900">
                            <h3 className="font-semibold text-lg mb-3 text-amber-900 dark:text-amber-100">PRECAUTIONS:</h3>
                            <ul className="space-y-2">
                              {food.precautions.map((precaution, i) => (
                                <li key={i} className="flex items-start text-amber-900 dark:text-amber-100">
                                  <span className="text-amber-600 mr-2">•</span>
                                  <span>{precaution}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Note */}
                        <Alert>
                          <AlertDescription className="text-sm">
                            <strong>Note:</strong> While generally safe, every pet is different. Introduce new foods gradually and watch for reactions.
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No Results */}
          {searchQuery && filteredFoods.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <CardTitle className="mb-2">No results found</CardTitle>
                <CardDescription>
                  We couldn't find "{searchQuery}" in our database. When in doubt, contact your veterinarian.
                </CardDescription>
              </CardContent>
            </Card>
          )}

          {/* Premium Feature Banner */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2 border-blue-200 dark:border-blue-800 mb-8">
            <CardContent className="py-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-lg font-semibold mb-1">
                    💎 Premium: Get personalized alerts based on YOUR pet's breed, age, and health conditions
                  </p>
                </div>
                <Button asChild variant="default" size="lg" className="whitespace-nowrap">
                  <Link to="/premium">Upgrade Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Browse by Category */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Browse by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {CATEGORIES.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleCategoryClick(category.value)}
                  className="h-auto py-6 flex flex-col gap-2 hover:scale-105 transition-transform"
                >
                  <span className="text-3xl">{category.emoji}</span>
                  <span className="text-sm font-medium">{category.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ToxicFoodScanner;