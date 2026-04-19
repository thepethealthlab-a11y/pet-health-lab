import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ToolStepProps {
  number: number;
  title: string;
  description?: string;
  children: ReactNode;
  active?: boolean;
  complete?: boolean;
  className?: string;
}

const ToolStep = ({ number, title, description, children, active = true, complete, className }: ToolStepProps) => {
  return (
    <section
      className={cn(
        "relative rounded-2xl border bg-surface-elevated transition-all duration-300",
        active ? "border-border shadow-soft" : "border-hairline opacity-60",
        complete && "border-primary/30",
        className
      )}
      style={{
        backgroundColor: "hsl(var(--surface-elevated))",
        borderColor: active ? "hsl(var(--hairline))" : "hsl(var(--hairline))",
      }}
    >
      <div className="p-6 md:p-8">
        <div className="flex items-start gap-4 mb-5">
          <div
            className={cn(
              "shrink-0 h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
              complete
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground border border-hairline"
            )}
            style={!complete ? { borderColor: "hsl(var(--hairline))" } : undefined}
          >
            {complete ? "✓" : number}
          </div>
          <div className="flex-1 pt-1">
            <h2 className="font-display text-xl md:text-2xl font-normal text-foreground leading-tight">
              {title}
            </h2>
            {description && (
              <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        <div className="pl-0 md:pl-[52px]">{children}</div>
      </div>
    </section>
  );
};

export default ToolStep;
