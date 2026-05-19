import { Link } from "react-router-dom";
import { Sparkles, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpgradePromptProps {
  toolName: string;
  limit: number;
  /** Optional headline override */
  title?: string;
}

const UpgradePrompt = ({ toolName, limit, title }: UpgradePromptProps) => {
  return (
    <div
      className="rounded-2xl border p-8 md:p-12 text-center shadow-soft"
      style={{ backgroundColor: "hsl(var(--surface-elevated))", borderColor: "hsl(var(--hairline))" }}
    >
      <div
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-premium border mb-6"
        style={{ borderColor: "hsl(var(--hairline))" }}
      >
        <Lock className="h-6 w-6 text-primary" />
      </div>
      <h2 className="font-display text-2xl md:text-3xl font-light text-foreground mb-3">
        {title ?? `You've reached your free monthly limit`}
      </h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        Your free plan includes <strong>{limit}</strong> {limit === 1 ? "use" : "uses"} of {toolName} per month.
        Upgrade to Premium for unlimited access and advanced features.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild size="lg" className="shadow-glow">
          <Link to="/pricing">
            <Sparkles className="h-4 w-4 mr-2" />
            Subscribe to Premium
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/tools">Explore other tools</Link>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-6">
        Your monthly limit resets on the 1st of each month.
      </p>
    </div>
  );
};

export default UpgradePrompt;
