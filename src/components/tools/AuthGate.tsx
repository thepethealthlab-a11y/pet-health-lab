import { useEffect, useState, ReactNode } from "react";
import { Link } from "react-router-dom";
import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface AuthGateProps {
  children: ReactNode;
  toolName: string;
  reason?: string;
}

const AuthGate = ({ children, toolName, reason }: AuthGateProps) => {
  const [status, setStatus] = useState<"loading" | "in" | "out">("loading");

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setStatus(data.session ? "in" : "out");
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (mounted) setStatus(session ? "in" : "out");
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (status === "out") {
    return (
      <div
        className="rounded-2xl border p-10 md:p-14 text-center shadow-soft"
        style={{ backgroundColor: "hsl(var(--surface-elevated))", borderColor: "hsl(var(--hairline))" }}
      >
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-premium border border-hairline mb-6" style={{ borderColor: "hsl(var(--hairline))" }}>
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-light text-foreground mb-3">
          Sign in to use {toolName}
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          {reason ?? "This tool uses your account to keep your pet's health data private and personalised."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link to="/login">Sign in</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/signup">
              <Sparkles className="h-4 w-4 mr-2" />
              Create free account
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGate;
