import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface UsageMeterProps {
  loading: boolean;
  isPremium: boolean;
  used: number;
  limit: number;
}

const UsageMeter = ({ loading, isPremium, used, limit }: UsageMeterProps) => {
  if (loading) return null;
  if (isPremium) {
    return (
      <div className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
        <Sparkles className="h-3 w-3" /> Premium — unlimited
      </div>
    );
  }
  const remaining = Math.max(0, limit - used);
  return (
    <div className="flex items-center justify-between gap-3 text-xs px-3 py-2 rounded-full bg-muted/50 border border-hairline" style={{ borderColor: "hsl(var(--hairline))" }}>
      <span className="text-muted-foreground">
        Free plan: <strong className="text-foreground">{remaining}</strong> of {limit} uses left this month
      </span>
      <Link to="/pricing" className="text-primary hover:underline font-medium whitespace-nowrap">
        Upgrade
      </Link>
    </div>
  );
};

export default UsageMeter;
