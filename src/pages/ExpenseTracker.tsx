import { useState, useEffect, useMemo } from "react";
import { Plus, DollarSign, Edit2, Trash2, Lock, Download, Calendar as CalendarIcon, PieChart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { useSEO } from "@/hooks/useSEO";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear } from "date-fns";
import { cn } from "@/lib/utils";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import ToolShell from "@/components/tools/ToolShell";
import AuthGate from "@/components/tools/AuthGate";
import ResultCard from "@/components/tools/ResultCard";

const CATEGORIES = [
  { value: "food", label: "Food", icon: "🍖", color: "hsl(25, 95%, 53%)" },
  { value: "vet", label: "Veterinary", icon: "🏥", color: "hsl(0, 84%, 60%)" },
  { value: "grooming", label: "Grooming", icon: "✂️", color: "hsl(280, 65%, 60%)" },
  { value: "toys", label: "Toys", icon: "🎾", color: "hsl(142, 76%, 45%)" },
  { value: "medication", label: "Medication", icon: "💊", color: "hsl(214, 95%, 55%)" },
  { value: "supplies", label: "Supplies", icon: "🏠", color: "hsl(45, 93%, 47%)" },
  { value: "training", label: "Training", icon: "🎓", color: "hsl(320, 70%, 55%)" },
  { value: "other", label: "Other", icon: "📋", color: "hsl(200, 15%, 50%)" },
];

interface Expense { id: string; amount: number; category: string; description: string | null; date: string; pet_id: string | null; currency: string; receipt_url: string | null; }
interface Pet { id: string; name: string; type: string; }

const ExpenseTracker = () => {
  useSEO({
    title: "Pet Expense Tracker | ThePetHealthLab",
    description: "Track all your pet expenses in one place — see spending by category and export to CSV.",
    canonical: "https://thepethealthlab.com/tools/expense-tracker",
  });

  return (
    <ToolShell
      eyebrow="Finances"
      title="Pet Expense Tracker"
      subtitle="Log every penny — see where your pet money really goes."
    >
      <AuthGate toolName="the Expense Tracker" reason="Sign in to keep your pet finances private and synced across devices.">
        <ExpensesUI />
      </AuthGate>
    </ToolShell>
  );
};

const ExpensesUI = () => {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);

  const [date, setDate] = useState<Date>(new Date());
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [petId, setPetId] = useState("");

  const [timeFilter, setTimeFilter] = useState("this_month");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [petFilter, setPetFilter] = useState("all");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => data.user && setUser({ id: data.user.id }));
  }, []);
  useEffect(() => { if (user) { fetchExpenses(); fetchPets(); } }, [user, timeFilter, categoryFilter, petFilter]);

  const range = () => {
    const now = new Date();
    if (timeFilter === "this_month") return { start: startOfMonth(now), end: endOfMonth(now) };
    if (timeFilter === "last_month") { const lm = subMonths(now, 1); return { start: startOfMonth(lm), end: endOfMonth(lm) }; }
    if (timeFilter === "this_year") return { start: startOfYear(now), end: endOfYear(now) };
    return { start: new Date(2020, 0, 1), end: now };
  };

  const fetchExpenses = async () => {
    if (!user) return;
    const { start, end } = range();
    let q = supabase.from("expenses").select("*").eq("user_id", user.id).gte("date", format(start, "yyyy-MM-dd")).lte("date", format(end, "yyyy-MM-dd")).order("date", { ascending: false });
    if (categoryFilter !== "all") q = q.eq("category", categoryFilter);
    if (petFilter !== "all") q = q.eq("pet_id", petFilter);
    const { data } = await q;
    setExpenses((data as Expense[]) || []);
  };

  const fetchPets = async () => {
    if (!user) return;
    const { data } = await supabase.from("pets").select("id, name, type").eq("user_id", user.id);
    setPets((data as Pet[]) || []);
  };

  const reset = () => { setDate(new Date()); setAmount(""); setCategory(""); setDescription(""); setPetId(""); };

  const save = async () => {
    if (!user || !amount || !category) return toast({ title: "Missing info", description: "Fill amount and category", variant: "destructive" });
    const payload = { amount: parseFloat(amount), category, description: description || null, date: format(date, "yyyy-MM-dd"), pet_id: petId || null };
    const { error } = editing
      ? await supabase.from("expenses").update(payload).eq("id", editing.id)
      : await supabase.from("expenses").insert({ ...payload, user_id: user.id, currency: "USD" });
    if (error) return toast({ title: "Error", description: "Save failed", variant: "destructive" });
    toast({ title: editing ? "Expense updated" : "Expense added" });
    reset(); setIsAddOpen(false); setEditing(null); fetchExpenses();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) return toast({ title: "Error", variant: "destructive" });
    toast({ title: "Deleted" });
    fetchExpenses();
  };

  const openEdit = (e: Expense) => {
    setEditing(e);
    setDate(new Date(e.date)); setAmount(String(e.amount)); setCategory(e.category);
    setDescription(e.description || ""); setPetId(e.pet_id || "");
    setIsAddOpen(true);
  };

  const stats = useMemo(() => {
    const now = new Date();
    const tm = expenses.filter((e) => new Date(e.date) >= startOfMonth(now) && new Date(e.date) <= endOfMonth(now)).reduce((s, e) => s + e.amount, 0);
    const lm = expenses.filter((e) => new Date(e.date) >= startOfMonth(subMonths(now, 1)) && new Date(e.date) <= endOfMonth(subMonths(now, 1))).reduce((s, e) => s + e.amount, 0);
    const yr = expenses.filter((e) => new Date(e.date) >= startOfYear(now)).reduce((s, e) => s + e.amount, 0);
    const months = new Set(expenses.filter((e) => new Date(e.date) >= startOfYear(now)).map((e) => format(new Date(e.date), "yyyy-MM"))).size || 1;
    return { thisMonth: tm, lastMonth: lm, thisYear: yr, avgMonth: yr / months };
  }, [expenses]);

  const chart = useMemo(() => {
    const totals: Record<string, number> = {};
    expenses.forEach((e) => totals[e.category] = (totals[e.category] || 0) + e.amount);
    return Object.entries(totals).map(([cat, val]) => {
      const ci = CATEGORIES.find((c) => c.value === cat);
      return { name: ci?.label || cat, value: val, color: ci?.color || "hsl(200, 15%, 50%)" };
    });
  }, [expenses]);

  const catInfo = (v: string) => CATEGORIES.find((c) => c.value === v) || CATEGORIES[7];
  const petName = (id: string | null) => id ? pets.find((p) => p.id === id)?.name || null : null;

  const exportCSV = () => {
    const headers = ["Date", "Category", "Amount", "Description", "Pet"];
    const rows = expenses.map((e) => [e.date, catInfo(e.category).label, e.amount.toFixed(2), e.description || "", petName(e.pet_id) || ""]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `pet-expenses-${format(new Date(), "yyyy-MM-dd")}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="This month" value={`$${stats.thisMonth.toFixed(0)}`} accent />
        <Stat label="Last month" value={`$${stats.lastMonth.toFixed(0)}`} />
        <Stat label="This year" value={`$${stats.thisYear.toFixed(0)}`} />
        <Stat label="Avg / month" value={`$${stats.avgMonth.toFixed(0)}`} />
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="this_month">This month</SelectItem>
              <SelectItem value="last_month">Last month</SelectItem>
              <SelectItem value="this_year">This year</SelectItem>
              <SelectItem value="all_time">All time</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.icon} {c.label}</SelectItem>)}
            </SelectContent>
          </Select>
          {pets.length > 0 && (
            <Select value={petFilter} onValueChange={setPetFilter}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Pet" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All pets</SelectItem>
                {pets.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV}><Download className="mr-2 h-4 w-4" /> CSV</Button>
          <Dialog open={isAddOpen} onOpenChange={(o) => { setIsAddOpen(o); if (!o) { reset(); setEditing(null); } }}>
            <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Add expense</Button></DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editing ? "Edit expense" : "Add expense"}</DialogTitle>
                <DialogDescription>Track a pet-related cost.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div>
                  <Label>Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start", !date && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />{date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus className="pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Amount *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input type="number" step="0.01" min="0" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="pl-7" />
                  </div>
                </div>
                <div>
                  <Label>Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.icon} {c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" rows={2} />
                </div>
                {pets.length > 0 && (
                  <div>
                    <Label>Pet</Label>
                    <Select value={petId} onValueChange={setPetId}>
                      <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
                      <SelectContent>
                        {pets.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setIsAddOpen(false); reset(); setEditing(null); }}>Cancel</Button>
                <Button onClick={save}>{editing ? "Update" : "Save"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* List + Chart */}
      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-3">
          {expenses.length === 0 ? (
            <ResultCard tone="info">
              <div className="text-center py-6">
                <DollarSign className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="font-display text-lg mb-1">No expenses yet</p>
                <p className="text-sm text-muted-foreground mb-4">Add your first expense to start tracking.</p>
                <Button onClick={() => setIsAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add expense</Button>
              </div>
            </ResultCard>
          ) : (
            expenses.map((e) => {
              const c = catInfo(e.category);
              const pn = petName(e.pet_id);
              return (
                <div key={e.id} className="rounded-2xl border p-4 flex items-center justify-between gap-3 shadow-soft hover:bg-muted/30 transition-colors" style={{ backgroundColor: "hsl(var(--surface-elevated))", borderColor: "hsl(var(--hairline))" }}>
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl shrink-0">{c.icon}</span>
                    <div className="min-w-0">
                      <p className="font-medium text-sm">{c.label}{e.description && ` · `}<span className="text-muted-foreground">{e.description}</span></p>
                      <p className="text-xs text-muted-foreground">{format(new Date(e.date), "MMM d, yyyy")}{pn && ` · ${pn}`}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-display text-lg">${e.amount.toFixed(2)}</span>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(e)}><Edit2 className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => remove(e.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <aside className="space-y-4">
          <ResultCard title="By category" icon={<PieChart className="h-5 w-5" />}>
            {chart.length > 0 ? (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie data={chart} cx="50%" cy="50%" innerRadius={40} outerRadius={75} paddingAngle={2} dataKey="value">
                      {chart.map((c, i) => <Cell key={i} fill={c.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => `$${v.toFixed(2)}`} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">Add expenses to see breakdown</p>
            )}
          </ResultCard>

          <div className="rounded-2xl bg-gradient-ink text-background p-5">
            <p className="font-display text-base mb-1">Premium analytics</p>
            <p className="text-xs text-background/70 mb-3">Trends, budgets, per-pet breakdowns and PDF reports.</p>
            <Button asChild variant="secondary" size="sm" className="w-full"><a href="/premium"><Lock className="h-3 w-3 mr-2" /> Upgrade</a></Button>
          </div>
        </aside>
      </div>
    </div>
  );
};

const Stat = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <div className="rounded-2xl border p-4 shadow-soft" style={{ backgroundColor: "hsl(var(--surface-elevated))", borderColor: "hsl(var(--hairline))" }}>
    <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
    <p className={cn("font-display text-2xl mt-1", accent && "text-primary")}>{value}</p>
  </div>
);

export default ExpenseTracker;
