import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Loader2,
  RefreshCw,
  Stethoscope,
  ShieldAlert,
  HeartPulse,
  ClipboardList,
  ArrowRight,
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ToolShell from "@/components/tools/ToolShell";
import ToolStep from "@/components/tools/ToolStep";
import ResultCard from "@/components/tools/ResultCard";
import AuthGate from "@/components/tools/AuthGate";
import UpgradePrompt from "@/components/tools/UpgradePrompt";
import UsageMeter from "@/components/tools/UsageMeter";
import { useUsageLimit } from "@/hooks/useUsageLimit";
import { cn } from "@/lib/utils";

const FREE_LIMIT = 3;

interface AnalysisResult {
  urgency: "HIGH" | "MEDIUM" | "LOW";
  urgencyMessage: string;
  possibleCauses: string[];
  generalInfo: string;
  warningSignsImmediate: string[];
  homeMonitoringTips: string[];
}

const PET_TYPES = [
  { value: "dog", label: "Dog", icon: "🐕" },
  { value: "cat", label: "Cat", icon: "🐈" },
  { value: "other", label: "Other", icon: "🐾" },
];

const SymptomChecker = () => {
  useSEO({
    title: "Pet Symptom Information Guide | The Pet Health Lab",
    description:
      "Premium educational tool to understand pet symptoms and learn when to consult your veterinarian.",
    keywords: "pet symptoms, dog symptoms, cat symptoms, pet health information",
    canonical: "https://pet-health-lab.lovable.app/tools/symptom-checker",
  });

  const [petType, setPetType] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [breed, setBreed] = useState("");
  const [duration, setDuration] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const usage = useUsageLimit("symptom_checker", FREE_LIMIT);

  const maxCharacters = 500;

  const handleAnalyze = async () => {
    if (!petType || !symptoms.trim()) {
      toast.error("Please choose a pet and describe the symptoms.");
      return;
    }
    if (usage.atLimit) {
      toast.error("Free monthly limit reached. Upgrade for unlimited checks.");
      return;
    }
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-symptom", {
        body: {
          petType,
          symptoms,
          age: age || undefined,
          breed: breed || undefined,
          duration: duration || undefined,
        },
      });
      if (error) {
        if (error.message?.includes("429")) toast.error("Too many requests. Try again shortly.");
        else if (error.message?.includes("402")) toast.error("Service temporarily unavailable.");
        else toast.error("Failed to analyze symptoms. Please try again.");
        return;
      }
      setResults(data);
      toast.success("Analysis complete");
      usage.increment();
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    } catch (e) {
      console.error(e);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setPetType("");
    setSymptoms("");
    setAge("");
    setBreed("");
    setDuration("");
    setResults(null);
  };

  const urgencyMeta = {
    HIGH: {
      label: "Seek urgent veterinary care",
      tone: "danger" as const,
      dot: "bg-destructive",
      ring: "ring-destructive/20",
    },
    MEDIUM: {
      label: "Schedule a vet visit soon",
      tone: "warning" as const,
      dot: "bg-amber-500",
      ring: "ring-amber-500/20",
    },
    LOW: {
      label: "Monitor at home",
      tone: "success" as const,
      dot: "bg-secondary",
      ring: "ring-secondary/20",
    },
  };

  return (
    <ToolShell
      eyebrow="AI · Educational"
      title="Symptom Information Guide"
      subtitle="Describe what you're observing — we'll surface educational context, possible causes, and clear next steps."
      disclaimer="This is not a medical diagnosis. Always consult a licensed veterinarian for treatment."
    >
      <AuthGate toolName="the Symptom Guide" reason="Sign in so we can save your checks and personalise results.">
        {!results ? (
          <div className="space-y-5">
            <ToolStep
              number={1}
              title="Which pet are we talking about?"
              complete={!!petType}
            >
              <div className="grid grid-cols-3 gap-3">
                {PET_TYPES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPetType(p.value)}
                    className={cn(
                      "group relative rounded-xl border p-5 text-center transition-all",
                      petType === p.value
                        ? "border-primary bg-primary/5 shadow-glow"
                        : "border-hairline hover:border-foreground/30 hover:-translate-y-0.5"
                    )}
                    style={petType !== p.value ? { borderColor: "hsl(var(--hairline))" } : undefined}
                  >
                    <div className="text-3xl mb-2">{p.icon}</div>
                    <div className="text-sm font-medium text-foreground">{p.label}</div>
                  </button>
                ))}
              </div>
            </ToolStep>

            <ToolStep
              number={2}
              title="Describe what you're seeing"
              description="Be specific — duration, frequency, appetite changes, energy levels."
              complete={symptoms.trim().length > 10}
            >
              <Textarea
                placeholder="e.g. My dog has been vomiting since yesterday, seems lethargic, and won't eat."
                value={symptoms}
                onChange={(e) =>
                  e.target.value.length <= maxCharacters && setSymptoms(e.target.value)
                }
                rows={5}
                className="resize-none border-hairline focus-visible:ring-primary/40"
                style={{ borderColor: "hsl(var(--hairline))" }}
              />
              <div className="mt-2 text-xs text-muted-foreground text-right">
                {symptoms.length}/{maxCharacters}
              </div>
            </ToolStep>

            <ToolStep
              number={3}
              title="Add context (optional)"
              description="Helps refine the educational context."
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">Age</Label>
                  <Select value={age} onValueChange={setAge}>
                    <SelectTrigger><SelectValue placeholder="Select age" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="puppy-kitten">Puppy/Kitten (0–1 yr)</SelectItem>
                      <SelectItem value="young">Young Adult (1–3 yrs)</SelectItem>
                      <SelectItem value="adult">Adult (3–7 yrs)</SelectItem>
                      <SelectItem value="senior">Senior (7+ yrs)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">Duration</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger><SelectValue placeholder="Select duration" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less-24h">Less than 24 hours</SelectItem>
                      <SelectItem value="1-3-days">1–3 days</SelectItem>
                      <SelectItem value="more-3-days">More than 3 days</SelectItem>
                      <SelectItem value="weeks">Weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">Breed</Label>
                  <Input
                    placeholder="e.g. Golden Retriever"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    className="border-hairline"
                    style={{ borderColor: "hsl(var(--hairline))" }}
                  />
                </div>
              </div>
            </ToolStep>

            <div className="pt-2">
              <Button
                onClick={handleAnalyze}
                disabled={!petType || !symptoms.trim() || isAnalyzing}
                size="lg"
                className="w-full h-14 text-base shadow-glow"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Analysing…
                  </>
                ) : (
                  <>
                    Get educational insight
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div id="results" className="space-y-5 animate-fade-in">
            {/* Urgency hero */}
            <ResultCard tone={urgencyMeta[results.urgency].tone}>
              <div className="flex items-start gap-4">
                <div className={cn("mt-1.5 h-3 w-3 rounded-full ring-8", urgencyMeta[results.urgency].dot, urgencyMeta[results.urgency].ring)} />
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Urgency · {results.urgency}
                  </div>
                  <div className="font-display text-2xl md:text-3xl font-light text-foreground leading-snug">
                    {urgencyMeta[results.urgency].label}
                  </div>
                  <p className="mt-3 text-foreground/80">{results.urgencyMessage}</p>
                </div>
              </div>
            </ResultCard>

            <ResultCard title="Possible educational causes" icon={<ClipboardList className="h-5 w-5" />}>
              <ol className="space-y-3">
                {results.possibleCauses.map((c, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 h-6 w-6 rounded-full bg-muted text-xs font-medium flex items-center justify-center text-foreground/70">
                      {i + 1}
                    </span>
                    <span>{c}</span>
                  </li>
                ))}
              </ol>
            </ResultCard>

            <ResultCard title="General information" icon={<Stethoscope className="h-5 w-5" />}>
              <p>{results.generalInfo}</p>
            </ResultCard>

            <ResultCard title="When to seek immediate help" icon={<ShieldAlert className="h-5 w-5" />} tone="danger">
              <ul className="space-y-2 list-disc pl-5">
                {results.warningSignsImmediate.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </ResultCard>

            <ResultCard title="Home monitoring tips" icon={<HeartPulse className="h-5 w-5" />} tone="info">
              <ul className="space-y-2 list-disc pl-5">
                {results.homeMonitoringTips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </ResultCard>

            <div
              className="rounded-2xl border p-5 flex items-start gap-3 text-sm"
              style={{ backgroundColor: "hsl(var(--surface-elevated))", borderColor: "hsl(var(--hairline))" }}
            >
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-muted-foreground">
                Educational information only — not a diagnosis. Contact your veterinarian for medical advice.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button onClick={handleReset} size="lg" variant="outline" className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                New check
              </Button>
              <Button asChild size="lg" className="flex-1">
                <Link to="/dashboard">Save to dashboard</Link>
              </Button>
            </div>
          </div>
        )}
      </AuthGate>
    </ToolShell>
  );
};

export default SymptomChecker;
