import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  title?: string;
  icon?: ReactNode;
  tone?: "default" | "danger" | "warning" | "success" | "info";
  children: ReactNode;
  className?: string;
}

const toneStyles: Record<string, string> = {
  default: "border-hairline",
  danger: "border-destructive/30 bg-destructive/[0.03]",
  warning: "border-amber-300/40 bg-amber-50/40 dark:bg-amber-950/10",
  success: "border-secondary/30 bg-secondary/[0.04]",
  info: "border-primary/20 bg-primary/[0.03]",
};

const ResultCard = ({ title, icon, tone = "default", children, className }: ResultCardProps) => {
  return (
    <div
      className={cn(
        "rounded-2xl border p-6 md:p-7 shadow-soft animate-fade-in",
        toneStyles[tone],
        className
      )}
      style={tone === "default" ? { backgroundColor: "hsl(var(--surface-elevated))", borderColor: "hsl(var(--hairline))" } : undefined}
    >
      {title && (
        <div className="flex items-center gap-2.5 mb-4">
          {icon && <span className="shrink-0 text-foreground/70">{icon}</span>}
          <h3 className="font-display text-lg md:text-xl font-normal text-foreground">{title}</h3>
        </div>
      )}
      <div className="text-foreground/85 leading-relaxed">{children}</div>
    </div>
  );
};

export default ResultCard;
