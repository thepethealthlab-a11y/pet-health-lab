import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSEO } from "@/hooks/useSEO";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Loader2,
  Lightbulb,
  Stethoscope,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";
import ToolShell from "@/components/tools/ToolShell";
import ToolStep from "@/components/tools/ToolStep";
import ResultCard from "@/components/tools/ResultCard";
import AuthGate from "@/components/tools/AuthGate";
import { cn } from "@/lib/utils";

interface BehaviorResult {
  diagnosisSummary: string;
  solutions: string[];
  vetAdvice: string;
}

const PET_TYPES = [
  { value: "dog", label: "Dog", icon: "🐕" },
  { value: "cat", label: "Cat", icon: "🐈" },
  { value: "bird", label: "Bird", icon: "🦜" },
  { value: "rabbit", label: "Rabbit", icon: "🐰" },
  { value: "other", label: "Other", icon: "🐾" },
];

const PetBehaviorSolver = () => {
  useSEO({
    title: "Pet Behavior Problem Solver | The Pet Health Lab",
    description:
      "Understand and resolve common pet behavior issues with structured AI-powered guidance.",
    keywords: "pet behavior, dog behavior, cat behavior, pet training",
    canonical: "https://thepethealthlab.com/tools/pet-behavior-problem-solver",
  });

  const [petType, setPetType] = useState("");
  const [petAge, setPetAge] = useState("");
  const [behaviorIssue, setBehaviorIssue] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<BehaviorResult | null>(null);
  const [copied, setCopied] = useState(false);

  const analyze = async () => {
    if (!petType || !petAge || !behaviorIssue.trim()) {
      toast.error("Please complete all three steps.");
      return;
    }
    setIsAnalyzing(true);
    setResults(null);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-pet-behavior", {
        body: { petType, petAge, behaviorIssue },
      });
      if (error) throw error;
      if (data?.analysis) {
        const cleaned = data.analysis.replace(/```json\n?|\n?```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        setResults(parsed);
        toast.success("Analysis complete");
        setTimeout(() => {
          document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to analyse behaviour. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setPetType("");
    setPetAge("");
    setBehaviorIssue("");
    setResults(null);
  };

  const handleCopy = async () => {
    if (!results) return;
    const text = `Diagnosis: ${results.diagnosisSummary}\n\nSolutions:\n${results.solutions.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\nWhen to consult a professional:\n${results.vetAdvice}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolShell
      eyebrow="AI · Behaviour"
      title="Pet Behaviour Problem Solver"
      subtitle="Tell us what your pet is doing — get a structured cause, three actionable solutions, and a clear escalation signal."
      disclaimer="Educational guidance only. Consult a certified animal behaviourist for persistent or aggressive behaviour."
    >
      <AuthGate
        toolName="the Behaviour Solver"
        reason="Sign in so we can keep a private log of your pet's behaviour history."
      >
        {!results ? (
          <div className="space-y-5">
            <ToolStep number={1} title="Which pet?" complete={!!petType}>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {PET_TYPES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPetType(p.value)}
                    className={cn(
                      "rounded-xl border p-4 text-center transition-all",
                      petType === p.value
                        ? "border-primary bg-primary/5 shadow-glow"
                        : "border-hairline hover:border-foreground/30 hover:-translate-y-0.5"
                    )}
                    style={petType !== p.value ? { borderColor: "hsl(var(--hairline))" } : undefined}
                  >
                    <div className="text-2xl mb-1.5">{p.icon}</div>
                    <div className="text-xs font-medium text-foreground">{p.label}</div>
                  </button>
                ))}
              </div>
            </ToolStep>

            <ToolStep number={2} title="Life stage" complete={!!petAge}>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Age group</Label>
                <Select value={petAge} onValueChange={setPetAge}>
                  <SelectTrigger><SelectValue placeholder="Select age group" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="puppy-kitten">Puppy/Kitten (0–1 yr)</SelectItem>
                    <SelectItem value="young-adult">Young Adult (1–3 yrs)</SelectItem>
                    <SelectItem value="adult">Adult (3–7 yrs)</SelectItem>
                    <SelectItem value="senior">Senior (7+ yrs)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </ToolStep>

            <ToolStep
              number={3}
              title="Describe the behaviour"
              description="When does it happen? How often? Any triggers you've noticed?"
              complete={behaviorIssue.trim().length > 10}
            >
              <Textarea
                placeholder="e.g. My cat has started scratching the sofa, mostly in the evening when we're not home."
                value={behaviorIssue}
                onChange={(e) => setBehaviorIssue(e.target.value)}
                rows={5}
                className="resize-none border-hairline"
                style={{ borderColor: "hsl(var(--hairline))" }}
              />
            </ToolStep>

            <Button
              onClick={analyze}
              disabled={isAnalyzing}
              size="lg"
              className="w-full h-14 text-base shadow-glow"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Analysing behaviour…
                </>
              ) : (
                <>
                  Solve this behaviour
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        ) : (
          <div id="results" className="space-y-5 animate-fade-in">
            <ResultCard title="What's likely going on" icon={<Lightbulb className="h-5 w-5" />}>
              <p>{results.diagnosisSummary}</p>
            </ResultCard>

            <ResultCard title="Three actionable solutions" tone="info">
              <ol className="space-y-4">
                {results.solutions.map((s, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center">
                      {i + 1}
                    </span>
                    <p className="pt-1">{s}</p>
                  </li>
                ))}
              </ol>
            </ResultCard>

            <ResultCard
              title="When to escalate"
              icon={<Stethoscope className="h-5 w-5" />}
              tone="warning"
            >
              <p>{results.vetAdvice}</p>
            </ResultCard>

            <div
              className="rounded-2xl border p-5 flex items-start gap-3 text-sm"
              style={{ backgroundColor: "hsl(var(--surface-elevated))", borderColor: "hsl(var(--hairline))" }}
            >
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-muted-foreground">
                These tips are guidance only. For aggression, persistent issues, or sudden changes,
                consult a vet or certified animal behaviourist.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button onClick={handleReset} size="lg" variant="outline" className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                New analysis
              </Button>
              <Button onClick={handleCopy} size="lg" className="flex-1">
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? "Copied" : "Copy result"}
              </Button>
            </div>
          </div>
        )}
      </AuthGate>
    </ToolShell>
  );
};

export default PetBehaviorSolver;
