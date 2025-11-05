import { useState, useMemo } from "react";
import { Search, AlertTriangle, Phone, Clock, Upload, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useSEO } from "@/hooks/useSEO";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ToxicFood {
  name: string;
  toxicityLevel: "High" | "Medium" | "Low";
  symptoms: string[];
  immediateActions: string[];
  alternativeNames?: string[];
}

const TOXIC_FOODS: ToxicFood[] = [
  {
    name: "Chocolate",
    toxicityLevel: "High",
    symptoms: ["Vomiting", "Diarrhea", "Rapid breathing", "Increased heart rate", "Seizures"],
    immediateActions: ["Contact veterinarian immediately", "Do not induce vomiting", "Keep pet calm and quiet"],
    alternativeNames: ["cocoa", "cacao"]
  },
  {
    name: "Grapes",
    toxicityLevel: "High",
    symptoms: ["Vomiting", "Lethargy", "Loss of appetite", "Kidney failure"],
    immediateActions: ["Contact emergency vet immediately", "Note amount consumed", "Monitor for symptoms"],
    alternativeNames: ["raisins", "currants"]
  },
  {
    name: "Onions",
    toxicityLevel: "High",
    symptoms: ["Weakness", "Pale gums", "Orange/dark urine", "Vomiting"],
    immediateActions: ["Contact veterinarian", "Note quantity consumed", "Monitor breathing"],
    alternativeNames: ["garlic", "leeks", "chives", "shallots"]
  },
  {
    name: "Xylitol",
    toxicityLevel: "High",
    symptoms: ["Vomiting", "Loss of coordination", "Seizures", "Liver failure"],
    immediateActions: ["Emergency vet visit immediately", "Bring product packaging", "Time is critical"],
    alternativeNames: ["artificial sweetener", "sugar-free"]
  },
  {
    name: "Avocado",
    toxicityLevel: "Medium",
    symptoms: ["Vomiting", "Diarrhea", "Difficulty breathing"],
    immediateActions: ["Contact veterinarian", "Monitor symptoms", "Remove access to food"],
  },
  {
    name: "Macadamia Nuts",
    toxicityLevel: "Medium",
    symptoms: ["Weakness", "Depression", "Vomiting", "Tremors", "Hyperthermia"],
    immediateActions: ["Contact veterinarian", "Note amount consumed", "Keep pet cool and calm"],
  },
  {
    name: "Coffee",
    toxicityLevel: "High",
    symptoms: ["Restlessness", "Rapid breathing", "Heart palpitations", "Muscle tremors"],
    immediateActions: ["Contact emergency vet", "Note caffeine amount", "Monitor heart rate"],
    alternativeNames: ["caffeine", "tea", "energy drinks"]
  },
  {
    name: "Alcohol",
    toxicityLevel: "High",
    symptoms: ["Vomiting", "Disorientation", "Difficulty breathing", "Coma"],
    immediateActions: ["Emergency vet immediately", "Note type and amount", "Do not induce vomiting"],
    alternativeNames: ["beer", "wine", "spirits", "ethanol"]
  },
  {
    name: "Raw Yeast Dough",
    toxicityLevel: "High",
    symptoms: ["Bloating", "Abdominal pain", "Alcohol toxicity", "Vomiting"],
    immediateActions: ["Emergency vet visit", "Note time of consumption", "Monitor for bloating"],
    alternativeNames: ["bread dough", "pizza dough"]
  },
  {
    name: "Rhubarb",
    toxicityLevel: "Medium",
    symptoms: ["Drooling", "Vomiting", "Diarrhea", "Tremors"],
    immediateActions: ["Contact veterinarian", "Note amount consumed", "Monitor symptoms"],
  },
  {
    name: "Apple Seeds",
    toxicityLevel: "Low",
    symptoms: ["Difficulty breathing", "Seizures", "Shock"],
    immediateActions: ["Contact vet if large amount consumed", "Monitor symptoms", "Remove access"],
    alternativeNames: ["apple cores", "cherry pits", "peach pits"]
  },
  {
    name: "Mushrooms",
    toxicityLevel: "High",
    symptoms: ["Vomiting", "Diarrhea", "Abdominal pain", "Liver failure", "Seizures"],
    immediateActions: ["Emergency vet immediately", "Bring mushroom sample if possible", "Time is critical"],
    alternativeNames: ["wild mushrooms", "toadstools"]
  },
  {
    name: "Raw Eggs",
    toxicityLevel: "Low",
    symptoms: ["Vomiting", "Diarrhea", "Skin inflammation"],
    immediateActions: ["Monitor symptoms", "Contact vet if persistent", "Ensure proper hydration"],
  },
  {
    name: "Raw Meat",
    toxicityLevel: "Low",
    symptoms: ["Vomiting", "Diarrhea", "Bacterial infection"],
    immediateActions: ["Monitor symptoms", "Contact vet if severe", "Maintain hydration"],
  },
  {
    name: "Salt",
    toxicityLevel: "Medium",
    symptoms: ["Excessive thirst", "Vomiting", "Diarrhea", "Tremors", "Seizures"],
    immediateActions: ["Contact veterinarian", "Provide fresh water", "Note amount consumed"],
    alternativeNames: ["sodium", "salty snacks"]
  },
  {
    name: "Nutmeg",
    toxicityLevel: "Medium",
    symptoms: ["Disorientation", "Increased heart rate", "Seizures", "Hallucinations"],
    immediateActions: ["Contact veterinarian", "Monitor vital signs", "Keep calm environment"],
  },
  {
    name: "Cinnamon",
    toxicityLevel: "Low",
    symptoms: ["Mouth irritation", "Low blood sugar", "Vomiting"],
    immediateActions: ["Monitor symptoms", "Provide water", "Contact vet if severe"],
  },
  {
    name: "Ice Cream",
    toxicityLevel: "Low",
    symptoms: ["Diarrhea", "Vomiting", "Abdominal pain", "Gas"],
    immediateActions: ["Monitor symptoms", "Ensure hydration", "Contact vet if persistent"],
    alternativeNames: ["dairy products", "milk", "cheese"]
  },
  {
    name: "Bacon",
    toxicityLevel: "Medium",
    symptoms: ["Pancreatitis", "Vomiting", "Diarrhea", "Abdominal pain"],
    immediateActions: ["Contact veterinarian if severe", "Monitor symptoms", "Restrict fatty foods"],
    alternativeNames: ["fatty meats", "pork products"]
  },
  {
    name: "Corn on the Cob",
    toxicityLevel: "Medium",
    symptoms: ["Intestinal blockage", "Vomiting", "Loss of appetite", "Lethargy"],
    immediateActions: ["Emergency vet if cob consumed", "Do not induce vomiting", "X-ray may be needed"],
  },
  {
    name: "Cooked Bones",
    toxicityLevel: "High",
    symptoms: ["Choking", "Intestinal perforation", "Constipation", "Bleeding"],
    immediateActions: ["Emergency vet immediately", "Do not induce vomiting", "Monitor for distress"],
    alternativeNames: ["chicken bones", "turkey bones", "rib bones"]
  },
  {
    name: "Peaches",
    toxicityLevel: "Medium",
    symptoms: ["Difficulty breathing", "Dilated pupils", "Red mucous membranes"],
    immediateActions: ["Contact veterinarian", "Note if pit was consumed", "Monitor breathing"],
    alternativeNames: ["plums", "apricots", "cherries with pits"]
  },
  {
    name: "Tomato Plants",
    toxicityLevel: "Medium",
    symptoms: ["Drooling", "Loss of appetite", "Diarrhea", "Weakness"],
    immediateActions: ["Contact veterinarian", "Note plant parts consumed", "Monitor symptoms"],
    alternativeNames: ["green tomatoes", "tomato stems"]
  },
  {
    name: "Raw Potatoes",
    toxicityLevel: "Medium",
    symptoms: ["Vomiting", "Diarrhea", "Cardiac abnormalities", "Hallucinations"],
    immediateActions: ["Contact veterinarian", "Monitor heart rate", "Note amount consumed"],
    alternativeNames: ["potato skins", "green potatoes"]
  },
  {
    name: "Moldy Food",
    toxicityLevel: "High",
    symptoms: ["Tremors", "Seizures", "Vomiting", "Hyperthermia"],
    immediateActions: ["Emergency vet immediately", "Bring sample if possible", "Monitor temperature"],
  },
  {
    name: "Hops",
    toxicityLevel: "High",
    symptoms: ["Rapid breathing", "Increased heart rate", "Hyperthermia", "Seizures"],
    immediateActions: ["Emergency vet immediately", "Cool pet down", "Monitor temperature"],
  },
  {
    name: "Persimmons",
    toxicityLevel: "Low",
    symptoms: ["Intestinal blockage", "Diarrhea", "Inflammation"],
    immediateActions: ["Contact vet if seeds consumed", "Monitor digestion", "Provide water"],
  },
  {
    name: "Citrus Fruits",
    toxicityLevel: "Low",
    symptoms: ["Vomiting", "Diarrhea", "Depression", "Central nervous system issues"],
    immediateActions: ["Monitor symptoms", "Contact vet if severe", "Limit exposure"],
    alternativeNames: ["lemons", "limes", "oranges", "grapefruit"]
  },
  {
    name: "Coconut Products",
    toxicityLevel: "Low",
    symptoms: ["Upset stomach", "Diarrhea", "Loose stools"],
    immediateActions: ["Monitor symptoms", "Ensure hydration", "Contact vet if persistent"],
    alternativeNames: ["coconut oil", "coconut water", "coconut flesh"]
  },
  {
    name: "Almonds",
    toxicityLevel: "Low",
    symptoms: ["Upset stomach", "Pancreatitis", "Water retention"],
    immediateActions: ["Monitor symptoms", "Ensure fresh water", "Contact vet if severe"],
  },
  {
    name: "Pecans",
    toxicityLevel: "Medium",
    symptoms: ["Vomiting", "Diarrhea", "Tremors", "Seizures"],
    immediateActions: ["Contact veterinarian", "Monitor neurological signs", "Note amount consumed"],
  },
  {
    name: "Walnuts",
    toxicityLevel: "Medium",
    symptoms: ["Vomiting", "Tremors", "Seizures"],
    immediateActions: ["Contact veterinarian", "Monitor for seizures", "Note amount consumed"],
    alternativeNames: ["black walnuts", "english walnuts"]
  },
  {
    name: "Cashews",
    toxicityLevel: "Low",
    symptoms: ["Weight gain", "Pancreatitis", "Digestive upset"],
    immediateActions: ["Monitor symptoms", "Limit fatty foods", "Contact vet if severe"],
  },
  {
    name: "Pistachios",
    toxicityLevel: "Low",
    symptoms: ["Pancreatitis", "Upset stomach", "Obesity"],
    immediateActions: ["Monitor symptoms", "Ensure hydration", "Contact vet if severe"],
  },
  {
    name: "Star Fruit",
    toxicityLevel: "Medium",
    symptoms: ["Kidney damage", "Vomiting", "Abdominal pain"],
    immediateActions: ["Contact veterinarian", "Monitor urination", "Note amount consumed"],
  },
  {
    name: "Chewing Gum",
    toxicityLevel: "High",
    symptoms: ["Vomiting", "Loss of coordination", "Seizures", "Liver failure"],
    immediateActions: ["Emergency vet immediately", "Check for xylitol", "Bring packaging"],
    alternativeNames: ["sugar-free gum", "breath mints"]
  },
  {
    name: "Candy",
    toxicityLevel: "Medium",
    symptoms: ["Vomiting", "Diarrhea", "Increased thirst", "Obesity"],
    immediateActions: ["Check for xylitol", "Contact vet if xylitol present", "Monitor symptoms"],
    alternativeNames: ["sweets", "lollipops", "hard candy"]
  },
  {
    name: "Baked Goods",
    toxicityLevel: "Medium",
    symptoms: ["Upset stomach", "Pancreatitis", "Alcohol toxicity"],
    immediateActions: ["Check for xylitol/chocolate", "Contact vet if toxic ingredients", "Monitor symptoms"],
    alternativeNames: ["cookies", "cakes", "pastries"]
  },
  {
    name: "Baby Food",
    toxicityLevel: "Low",
    symptoms: ["Anemia", "Digestive upset"],
    immediateActions: ["Check for onion/garlic powder", "Contact vet if containing toxic ingredients", "Monitor symptoms"],
  },
  {
    name: "Nutella",
    toxicityLevel: "Medium",
    symptoms: ["Vomiting", "Diarrhea", "Increased heart rate", "Seizures"],
    immediateActions: ["Contact veterinarian", "Check chocolate content", "Monitor symptoms"],
    alternativeNames: ["chocolate spread", "hazelnut spread"]
  },
  {
    name: "Peanut Butter",
    toxicityLevel: "Low",
    symptoms: ["Pancreatitis", "Obesity", "Allergic reactions"],
    immediateActions: ["Check for xylitol", "Emergency vet if xylitol present", "Monitor symptoms"],
    alternativeNames: ["nut butters", "almond butter"]
  },
  {
    name: "Spicy Foods",
    toxicityLevel: "Low",
    symptoms: ["Mouth irritation", "Vomiting", "Diarrhea", "Gas"],
    immediateActions: ["Provide water", "Monitor symptoms", "Contact vet if severe"],
    alternativeNames: ["hot sauce", "chili peppers", "curry"]
  },
  {
    name: "Soy Products",
    toxicityLevel: "Low",
    symptoms: ["Digestive upset", "Bloating", "Allergic reactions"],
    immediateActions: ["Monitor symptoms", "Contact vet if allergic reaction", "Limit exposure"],
    alternativeNames: ["tofu", "soy sauce", "edamame"]
  },
  {
    name: "Liver",
    toxicityLevel: "Low",
    symptoms: ["Vitamin A toxicity", "Bone problems", "Weight loss"],
    immediateActions: ["Limit consumption", "Contact vet if excessive intake", "Monitor symptoms"],
  },
  {
    name: "Tuna",
    toxicityLevel: "Low",
    symptoms: ["Mercury poisoning", "Thiamine deficiency", "Digestive upset"],
    immediateActions: ["Limit consumption", "Provide balanced diet", "Contact vet if excessive"],
  },
  {
    name: "Broccoli",
    toxicityLevel: "Low",
    symptoms: ["Gastric irritation", "Upset stomach"],
    immediateActions: ["Monitor symptoms", "Limit large amounts", "Contact vet if persistent"],
  },
  {
    name: "Spinach",
    toxicityLevel: "Low",
    symptoms: ["Kidney damage", "Digestive upset"],
    immediateActions: ["Limit consumption", "Monitor urination", "Contact vet if excessive"],
  },
  {
    name: "Mushroom Compost",
    toxicityLevel: "High",
    symptoms: ["Vomiting", "Diarrhea", "Tremors", "Seizures"],
    immediateActions: ["Emergency vet immediately", "Note time of exposure", "Bring sample if possible"],
  },
  {
    name: "Fertilizer",
    toxicityLevel: "High",
    symptoms: ["Vomiting", "Diarrhea", "Tremors", "Difficulty breathing"],
    immediateActions: ["Emergency vet immediately", "Bring product label", "Do not induce vomiting"],
  },
  {
    name: "Fruit Pits",
    toxicityLevel: "Medium",
    symptoms: ["Difficulty breathing", "Dilated pupils", "Red gums"],
    immediateActions: ["Contact veterinarian", "Note type and amount", "Monitor breathing"],
    alternativeNames: ["cherry pits", "plum pits", "peach pits"]
  },
  {
    name: "Human Vitamins",
    toxicityLevel: "High",
    symptoms: ["Vomiting", "Organ damage", "Seizures"],
    immediateActions: ["Emergency vet immediately", "Bring vitamin bottle", "Note time of ingestion"],
    alternativeNames: ["supplements", "iron pills", "multivitamins"]
  },
];

const ToxicFoodScanner = () => {
  useSEO({
    title: "Toxic Food Scanner - ThePetHealthLab",
    description: "Search our database of 50+ toxic foods for pets. Learn about toxicity levels, symptoms, and immediate actions to take if your pet ingests dangerous foods.",
    keywords: "toxic foods for pets, pet poison foods, dangerous foods for dogs, dangerous foods for cats, pet food toxicity",
    canonical: "https://thepethealthlab.com/tools/toxic-food-scanner",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Toxic Food Scanner",
      "applicationCategory": "HealthApplication",
      "description": "Interactive tool to check if foods are toxic to pets",
    },
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [ingredientsText, setIngredientsText] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [analyzedIngredients, setAnalyzedIngredients] = useState<string[]>([]);
  const [imageAnalysis, setImageAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const filteredFoods = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return TOXIC_FOODS.filter((food) => {
      const nameMatch = food.name.toLowerCase().includes(query);
      const alternativeMatch = food.alternativeNames?.some((alt) =>
        alt.toLowerCase().includes(query)
      );
      return nameMatch || alternativeMatch;
    }).sort((a, b) => {
      // Sort by toxicity level
      const toxicityOrder = { High: 0, Medium: 1, Low: 2 };
      return toxicityOrder[a.toxicityLevel] - toxicityOrder[b.toxicityLevel];
    });
  }, [searchQuery]);

  const getToxicityColor = (level: string) => {
    switch (level) {
      case "High":
        return "destructive";
      case "Medium":
        return "default";
      case "Low":
        return "secondary";
      default:
        return "default";
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast({
        title: "Image uploaded",
        description: "Image uploaded successfully. Note: AI analysis coming soon!",
      });
    }
  };

  const analyzeIngredients = () => {
    if (!ingredientsText.trim()) {
      toast({
        title: "No ingredients",
        description: "Please enter some ingredients to analyze",
        variant: "destructive",
      });
      return;
    }
    
    const ingredients = ingredientsText
      .toLowerCase()
      .split(/[,\n]/)
      .map(i => i.trim())
      .filter(i => i.length > 0);
    
    setAnalyzedIngredients(ingredients);
    toast({
      title: "Analysis complete",
      description: `Found ${ingredients.length} ingredients to check`,
    });
  };

  const analyzeImage = async () => {
    if (!imagePreview) {
      toast({
        title: "No image",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setImageAnalysis("");

    try {
      const { data, error } = await supabase.functions.invoke('analyze-food-image', {
        body: { imageData: imagePreview }
      });

      if (error) throw error;

      if (data?.analysis) {
        setImageAnalysis(data.analysis);
        toast({
          title: "Analysis complete",
          description: "AI has analyzed the image for toxic ingredients",
        });
      }
    } catch (error: any) {
      console.error("Error analyzing image:", error);
      toast({
        title: "Analysis failed",
        description: error.message || "Failed to analyze image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const ingredientMatches = useMemo(() => {
    if (analyzedIngredients.length === 0) return [];
    
    return TOXIC_FOODS.filter((food) => {
      return analyzedIngredients.some(ingredient => {
        const nameMatch = food.name.toLowerCase().includes(ingredient);
        const alternativeMatch = food.alternativeNames?.some((alt) =>
          alt.toLowerCase().includes(ingredient) || ingredient.includes(alt.toLowerCase())
        );
        return nameMatch || alternativeMatch;
      });
    }).sort((a, b) => {
      const toxicityOrder = { High: 0, Medium: 1, Low: 2 };
      return toxicityOrder[a.toxicityLevel] - toxicityOrder[b.toxicityLevel];
    });
  }, [analyzedIngredients]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-primary">
            Toxic Food Scanner
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Search our database of 50+ common foods to check their toxicity level for pets
          </p>
        </header>

        <Alert className="mb-8 border-destructive bg-destructive/10">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <AlertDescription className="text-sm md:text-base">
            <strong className="font-semibold">Important Disclaimer:</strong> This tool is for educational purposes only. 
            Always contact your veterinarian immediately for actual poisoning cases or emergencies. 
            Call the Pet Poison Helpline at 855-764-7661 for immediate assistance.
          </AlertDescription>
        </Alert>

        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Check Food Safety</CardTitle>
              <CardDescription>
                Search by name, upload an image, or enter ingredients list
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="search" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="search">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </TabsTrigger>
                  <TabsTrigger value="image">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </TabsTrigger>
                  <TabsTrigger value="ingredients">
                    <FileText className="h-4 w-4 mr-2" />
                    Ingredients List
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="search" className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                      type="text"
                      placeholder="Search for foods (e.g., chocolate, grapes, onions)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 text-base md:text-lg h-12"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="image" className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Click to upload an image of the food or product label
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Max file size: 10MB
                      </p>
                    </label>
                  </div>
                  
                  {imagePreview && (
                    <div className="space-y-4">
                      <img 
                        src={imagePreview} 
                        alt="Uploaded food" 
                        className="max-h-64 mx-auto rounded-lg"
                      />
                      <Button 
                        onClick={analyzeImage} 
                        disabled={isAnalyzing}
                        className="w-full"
                      >
                        {isAnalyzing ? "Analyzing..." : "Analyze Image with AI"}
                      </Button>
                      
                      {imageAnalysis && (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>AI Analysis Results:</strong>
                            <div className="mt-3 space-y-2">
                              {(() => {
                                try {
                                  // Remove markdown code blocks if present
                                  const cleanJson = imageAnalysis.replace(/```json\n?|\n?```/g, '').trim();
                                  const results = JSON.parse(cleanJson);
                                  
                                  const toxicItems = results.filter((item: any) => item.isToxic);
                                  const safeItems = results.filter((item: any) => !item.isToxic);
                                  
                                  return (
                                    <>
                                      {toxicItems.length > 0 && (
                                        <div className="p-3 bg-destructive/10 rounded-md">
                                          <p className="font-semibold text-destructive mb-2">⚠️ Toxic Items Detected:</p>
                                          {toxicItems.map((item: any, idx: number) => (
                                            <div key={idx} className="ml-4 mb-2">
                                              <p className="font-medium">{item.ingredient}</p>
                                              {item.toxicityLevel && (
                                                <Badge variant="destructive" className="mt-1">
                                                  {item.toxicityLevel} Toxicity
                                                </Badge>
                                              )}
                                              {item.reason && (
                                                <p className="text-sm mt-1">{item.reason}</p>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                      
                                      {safeItems.length > 0 && (
                                        <div className="p-3 bg-secondary/50 rounded-md">
                                          <p className="font-semibold mb-2">✓ Safe Items:</p>
                                          <ul className="ml-4 list-disc">
                                            {safeItems.map((item: any, idx: number) => (
                                              <li key={idx}>{item.ingredient}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                      
                                      {toxicItems.length === 0 && (
                                        <p className="text-green-600 font-medium">
                                          ✓ No toxic ingredients detected in this image!
                                        </p>
                                      )}
                                    </>
                                  );
                                } catch (e) {
                                  return <p className="text-sm">{imageAnalysis}</p>;
                                }
                              })()}
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="ingredients" className="space-y-4">
                  <Textarea
                    placeholder="Enter ingredients separated by commas or new lines&#10;Example:&#10;chicken, rice, carrots, peas&#10;or&#10;chocolate&#10;grapes&#10;onions"
                    value={ingredientsText}
                    onChange={(e) => setIngredientsText(e.target.value)}
                    className="min-h-32 text-base"
                  />
                  <Button onClick={analyzeIngredients} className="w-full">
                    Analyze Ingredients
                  </Button>
                </TabsContent>
              </Tabs>

              {searchQuery && filteredFoods.length === 0 && (
                <p className="text-center text-muted-foreground mt-6">
                  No results found. Try searching for common foods like chocolate, grapes, or onions.
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        {filteredFoods.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">
              Search Results ({filteredFoods.length})
            </h2>

            {filteredFoods.map((food) => (
              <Card key={food.name} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl md:text-2xl">{food.name}</CardTitle>
                      {food.alternativeNames && (
                        <CardDescription className="mt-1">
                          Also known as: {food.alternativeNames.join(", ")}
                        </CardDescription>
                      )}
                    </div>
                    <Badge
                      variant={getToxicityColor(food.toxicityLevel)}
                      className="text-sm md:text-base px-3 py-1 whitespace-nowrap"
                    >
                      {food.toxicityLevel} Risk
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Possible Symptoms
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {food.symptoms.map((symptom, index) => (
                        <li key={index}>{symptom}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-primary/5 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Immediate Actions
                    </h3>
                    <ol className="list-decimal list-inside space-y-1">
                      {food.immediateActions.map((action, index) => (
                        <li key={index} className="text-foreground">{action}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="bg-destructive/10 rounded-lg p-4 border border-destructive/20">
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <Phone className="h-5 w-5 text-destructive" />
                      Emergency Contacts
                    </h3>
                    <ul className="space-y-2">
                      <li>
                        <strong>Pet Poison Helpline:</strong>{" "}
                        <a href="tel:855-764-7661" className="text-primary hover:underline">
                          855-764-7661
                        </a>
                      </li>
                      <li>
                        <strong>ASPCA Poison Control:</strong>{" "}
                        <a href="tel:888-426-4435" className="text-primary hover:underline">
                          888-426-4435
                        </a>
                      </li>
                      <li>
                        <strong>Your Veterinarian:</strong> Contact immediately for emergency care
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        )}

        {ingredientMatches.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">
              Ingredient Analysis Results ({ingredientMatches.length} toxic ingredients found)
            </h2>

            {ingredientMatches.map((food) => (
              <Card key={food.name} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl md:text-2xl">{food.name}</CardTitle>
                      {food.alternativeNames && (
                        <CardDescription className="mt-1">
                          Also known as: {food.alternativeNames.join(", ")}
                        </CardDescription>
                      )}
                    </div>
                    <Badge
                      variant={getToxicityColor(food.toxicityLevel)}
                      className="text-sm md:text-base px-3 py-1 whitespace-nowrap"
                    >
                      {food.toxicityLevel} Risk
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Possible Symptoms
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {food.symptoms.map((symptom, index) => (
                        <li key={index}>{symptom}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-primary/5 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Immediate Actions
                    </h3>
                    <ol className="list-decimal list-inside space-y-1">
                      {food.immediateActions.map((action, index) => (
                        <li key={index} className="text-foreground">{action}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="bg-destructive/10 rounded-lg p-4 border border-destructive/20">
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <Phone className="h-5 w-5 text-destructive" />
                      Emergency Contacts
                    </h3>
                    <ul className="space-y-2">
                      <li>
                        <strong>Pet Poison Helpline:</strong>{" "}
                        <a href="tel:855-764-7661" className="text-primary hover:underline">
                          855-764-7661
                        </a>
                      </li>
                      <li>
                        <strong>ASPCA Poison Control:</strong>{" "}
                        <a href="tel:888-426-4435" className="text-primary hover:underline">
                          888-426-4435
                        </a>
                      </li>
                      <li>
                        <strong>Your Veterinarian:</strong> Contact immediately for emergency care
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        )}

        {!searchQuery && ingredientMatches.length === 0 && (
          <section className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>How to Use This Tool</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Enter the name of a food item in the search box above</li>
                  <li>Review the toxicity level and possible symptoms</li>
                  <li>Follow the immediate actions if your pet has ingested the food</li>
                  <li>Contact your veterinarian or emergency vet immediately if needed</li>
                </ol>

                <Alert>
                  <AlertDescription>
                    Our database includes 50+ common toxic foods including chocolate, grapes, onions, 
                    xylitol, avocados, macadamia nuts, and many more. Start typing to see results instantly.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ToxicFoodScanner;