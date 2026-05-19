import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface UsageLimitState {
  loading: boolean;
  isPremium: boolean;
  used: number;
  limit: number;
  atLimit: boolean;
  remaining: number;
  refresh: () => Promise<void>;
  increment: () => Promise<number | null>;
}

const PREMIUM_STATUSES = new Set(["premium", "family", "active", "trialing"]);

/**
 * Tracks per-feature monthly usage against a free-tier limit.
 * Premium users are always allowed (atLimit=false).
 */
export function useUsageLimit(feature: string, freeLimit: number): UsageLimitState {
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [used, setUsed] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: session } = await supabase.auth.getSession();
    const uid = session.session?.user?.id;
    if (!uid) {
      setIsPremium(false);
      setUsed(0);
      setLoading(false);
      return;
    }
    const month = new Date().toISOString().slice(0, 7); // YYYY-MM

    const [{ data: userRow }, { data: usageRow }] = await Promise.all([
      supabase.from("users").select("subscription_status").eq("id", uid).maybeSingle(),
      supabase
        .from("usage_tracking")
        .select("count")
        .eq("user_id", uid)
        .eq("feature", feature)
        .eq("month", month)
        .maybeSingle(),
    ]);

    setIsPremium(PREMIUM_STATUSES.has((userRow?.subscription_status || "free").toLowerCase()));
    setUsed(usageRow?.count ?? 0);
    setLoading(false);
  }, [feature]);

  useEffect(() => {
    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => sub.subscription.unsubscribe();
  }, [load]);

  const increment = useCallback(async () => {
    const { data, error } = await supabase.rpc("increment_usage", { p_feature: feature });
    if (error) {
      console.error("increment_usage failed", error);
      return null;
    }
    if (typeof data === "number") setUsed(data);
    return (data as number) ?? null;
  }, [feature]);

  const atLimit = !isPremium && used >= freeLimit;
  return {
    loading,
    isPremium,
    used,
    limit: freeLimit,
    atLimit,
    remaining: Math.max(0, freeLimit - used),
    refresh: load,
    increment,
  };
}
