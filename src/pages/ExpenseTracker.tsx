import { useState, useEffect, useMemo } from "react";
import { 
  Plus, DollarSign, TrendingUp, Calendar, Edit2, Trash2, 
  Lock, Receipt, Camera, Download, Filter, PieChart
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useSEO } from "@/hooks/useSEO";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear } from "date-fns";
import { cn } from "@/lib/utils";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

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

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  date: string;
  pet_id: string | null;
  currency: string;
  receipt_url: string | null;
}

interface Pet {
  id: string;
  name: string;
  type: string;
}

const ExpenseTracker = () => {
  useSEO({
    title: "Pet Expense Tracker - Track Pet Spending | ThePetHealthLab",
    description: "Track all your pet expenses in one place. See spending by category, set budgets, and manage your pet care costs effectively.",
    keywords: "pet expense tracker, pet spending, pet budget, track pet costs, pet financial management",
    canonical: "https://thepethealthlab.com/tools/expense-tracker",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Pet Expense Tracker",
      "applicationCategory": "FinanceApplication",
      "description": "Track and manage pet expenses",
    },
  });

  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [user, setUser] = useState<any>(null);

  // Form state
  const [expenseDate, setExpenseDate] = useState<Date>(new Date());
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPetId, setSelectedPetId] = useState("");

  // Filter state
  const [timeFilter, setTimeFilter] = useState("this_month");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [petFilter, setPetFilter] = useState("all");

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchExpenses();
      fetchPets();
    }
  }, [user, timeFilter, categoryFilter, petFilter]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setLoading(false);
  };

  const getDateRange = () => {
    const now = new Date();
    switch (timeFilter) {
      case "this_month":
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case "last_month":
        const lastMonth = subMonths(now, 1);
        return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
      case "this_year":
        return { start: startOfYear(now), end: endOfYear(now) };
      default:
        return { start: new Date(2020, 0, 1), end: now };
    }
  };

  const fetchExpenses = async () => {
    if (!user) return;

    const { start, end } = getDateRange();
    
    let query = supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", format(start, "yyyy-MM-dd"))
      .lte("date", format(end, "yyyy-MM-dd"))
      .order("date", { ascending: false });

    if (categoryFilter !== "all") {
      query = query.eq("category", categoryFilter);
    }

    if (petFilter !== "all") {
      query = query.eq("pet_id", petFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching expenses:", error);
    } else {
      setExpenses(data || []);
    }
  };

  const fetchPets = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("pets")
      .select("id, name, type")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching pets:", error);
    } else {
      setPets(data || []);
    }
  };

  const handleAddExpense = async () => {
    if (!user || !amount || !category) {
      toast({
        title: "Missing Information",
        description: "Please fill in required fields",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("expenses").insert({
      user_id: user.id,
      amount: parseFloat(amount),
      category,
      description: description || null,
      date: format(expenseDate, "yyyy-MM-dd"),
      pet_id: selectedPetId || null,
      currency: "USD",
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Expense added successfully",
      });
      resetForm();
      setIsAddModalOpen(false);
      fetchExpenses();
    }
  };

  const handleEditExpense = async () => {
    if (!editingExpense || !amount || !category) return;

    const { error } = await supabase
      .from("expenses")
      .update({
        amount: parseFloat(amount),
        category,
        description: description || null,
        date: format(expenseDate, "yyyy-MM-dd"),
        pet_id: selectedPetId || null,
      })
      .eq("id", editingExpense.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update expense",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Expense updated successfully",
      });
      resetForm();
      setIsEditModalOpen(false);
      setEditingExpense(null);
      fetchExpenses();
    }
  };

  const handleDeleteExpense = async (id: string) => {
    const { error } = await supabase.from("expenses").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Expense deleted successfully",
      });
      fetchExpenses();
    }
  };

  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setExpenseDate(new Date(expense.date));
    setAmount(expense.amount.toString());
    setCategory(expense.category);
    setDescription(expense.description || "");
    setSelectedPetId(expense.pet_id || "");
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setExpenseDate(new Date());
    setAmount("");
    setCategory("");
    setDescription("");
    setSelectedPetId("");
  };

  // Calculate stats
  const stats = useMemo(() => {
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));
    const yearStart = startOfYear(now);
    const yearEnd = endOfYear(now);

    const thisMonthTotal = expenses
      .filter(e => new Date(e.date) >= thisMonthStart && new Date(e.date) <= thisMonthEnd)
      .reduce((sum, e) => sum + e.amount, 0);

    const lastMonthTotal = expenses
      .filter(e => new Date(e.date) >= lastMonthStart && new Date(e.date) <= lastMonthEnd)
      .reduce((sum, e) => sum + e.amount, 0);

    const yearTotal = expenses
      .filter(e => new Date(e.date) >= yearStart && new Date(e.date) <= yearEnd)
      .reduce((sum, e) => sum + e.amount, 0);

    const monthsWithData = new Set(
      expenses
        .filter(e => new Date(e.date) >= yearStart)
        .map(e => format(new Date(e.date), "yyyy-MM"))
    ).size || 1;

    return {
      thisMonth: thisMonthTotal,
      lastMonth: lastMonthTotal,
      thisYear: yearTotal,
      avgMonth: yearTotal / monthsWithData,
    };
  }, [expenses]);

  // Chart data
  const chartData = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    return Object.entries(categoryTotals).map(([cat, total]) => {
      const categoryInfo = CATEGORIES.find(c => c.value === cat);
      return {
        name: categoryInfo?.label || cat,
        value: total,
        color: categoryInfo?.color || "hsl(200, 15%, 50%)",
      };
    });
  }, [expenses]);

  const getCategoryInfo = (categoryValue: string) => {
    return CATEGORIES.find(c => c.value === categoryValue) || CATEGORIES[7];
  };

  const getPetName = (petId: string | null) => {
    if (!petId) return null;
    const pet = pets.find(p => p.id === petId);
    return pet?.name || null;
  };

  const exportCSV = () => {
    const headers = ["Date", "Category", "Amount", "Description", "Pet"];
    const rows = expenses.map(e => [
      e.date,
      getCategoryInfo(e.category).label,
      e.amount.toFixed(2),
      e.description || "",
      getPetName(e.pet_id) || "",
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pet-expenses-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-md mx-auto text-center">
            <DollarSign className="h-16 w-16 mx-auto text-primary mb-4" />
            <h1 className="text-2xl font-bold mb-2">Sign In Required</h1>
            <p className="text-muted-foreground mb-6">
              Please sign in to track your pet expenses
            </p>
            <Button asChild>
              <a href="/login">Sign In</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              Pet Expense Tracker
            </h1>
            <p className="text-muted-foreground mt-1">
              Track all pet spending in one place. See where your money goes.
            </p>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Expense</DialogTitle>
                <DialogDescription>
                  Track a new pet expense
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !expenseDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {expenseDate ? format(expenseDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={expenseDate}
                        onSelect={(date) => date && setExpenseDate(date)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-7"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <span className="flex items-center gap-2">
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="What was this expense for?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {pets.length > 0 && (
                  <div className="space-y-2">
                    <Label>Pet (optional)</Label>
                    <Select value={selectedPetId} onValueChange={setSelectedPetId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pet" />
                      </SelectTrigger>
                      <SelectContent>
                        {pets.map((pet) => (
                          <SelectItem key={pet.id} value={pet.id}>
                            {pet.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2 opacity-50">
                  <Label className="flex items-center gap-2">
                    Receipt Photo
                    <Badge variant="outline" className="gap-1">
                      <Lock className="h-3 w-3" />
                      Premium
                    </Badge>
                  </Label>
                  <Button variant="outline" className="w-full" disabled>
                    <Camera className="h-4 w-4 mr-2" />
                    Upload Receipt
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { resetForm(); setIsAddModalOpen(false); }}>
                  Cancel
                </Button>
                <Button onClick={handleAddExpense}>Save Expense</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </header>

        {/* Stats Bar */}
        <Card className="mb-8">
          <CardContent className="py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-primary">${stats.thisMonth.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Month</p>
                <p className="text-2xl font-bold">${stats.lastMonth.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Year</p>
                <p className="text-2xl font-bold">${stats.thisYear.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg/Month</p>
                <p className="text-2xl font-bold">${stats.avgMonth.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_time">All Time</SelectItem>
                  <SelectItem value="this_month">This Month</SelectItem>
                  <SelectItem value="last_month">Last Month</SelectItem>
                  <SelectItem value="this_year">This Year</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {pets.length > 0 && (
                <Select value={petFilter} onValueChange={setPetFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Pets" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Pets</SelectItem>
                    {pets.map((pet) => (
                      <SelectItem key={pet.id} value={pet.id}>
                        {pet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Expense List */}
            <div className="space-y-3">
              {expenses.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No expenses yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start tracking your pet expenses
                    </p>
                    <Button onClick={() => setIsAddModalOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Expense
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                expenses.map((expense) => {
                  const catInfo = getCategoryInfo(expense.category);
                  const petName = getPetName(expense.pet_id);
                  return (
                    <Card key={expense.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{catInfo.icon}</span>
                            <div>
                              <p className="font-semibold">{catInfo.label}</p>
                              {expense.description && (
                                <p className="text-sm text-muted-foreground">{expense.description}</p>
                              )}
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(expense.date), "MMM d, yyyy")}
                                {petName && ` • ${petName}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold">${expense.amount.toFixed(2)}</span>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditModal(expense)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteExpense(expense.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>

            {/* Export Options */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={exportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" disabled className="opacity-50">
                <Download className="h-4 w-4 mr-2" />
                Export PDF Report
                <Lock className="h-3 w-3 ml-2" />
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Spending by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Add expenses to see chart
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Premium Charts Upsell */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lock className="h-4 w-4" />
                  Premium Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Monthly trends (line graphs)
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Year-over-year comparison
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Per-pet breakdown
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Budget alerts
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Predictive spending
                  </li>
                </ul>
                <Button className="w-full" asChild>
                  <a href="/premium">Upgrade to Premium</a>
                </Button>
              </CardContent>
            </Card>

            {/* Budget Tracker */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  💰 Monthly Budget
                  <Badge variant="outline" className="gap-1 ml-auto">
                    <Lock className="h-3 w-3" />
                    Premium
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 opacity-60">
                <div className="space-y-2">
                  <Label>Set budget: $___/month</Label>
                  <div className="flex justify-between text-sm">
                    <span>Current spending: $342.50 / $400.00</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <p className="text-sm text-muted-foreground">Remaining: $57.50</p>
                </div>
                <Button className="w-full" asChild>
                  <a href="/premium">Upgrade</a>
                </Button>
              </CardContent>
            </Card>

            {/* Receipt Scanner */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  📸 Receipt Scanner
                  <Badge variant="outline" className="gap-1 ml-auto">
                    <Lock className="h-3 w-3" />
                    Premium
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="opacity-60">
                <p className="text-sm text-muted-foreground mb-4">
                  Take a photo, we'll extract the details automatically with AI (OCR)
                </p>
                <Button className="w-full" asChild>
                  <a href="/premium">Upgrade</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogDescription>Update expense details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !expenseDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {expenseDate ? format(expenseDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={expenseDate}
                    onSelect={(date) => date && setExpenseDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-amount">Amount *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="edit-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <span className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (optional)</Label>
              <Textarea
                id="edit-description"
                placeholder="What was this expense for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {pets.length > 0 && (
              <div className="space-y-2">
                <Label>Pet (optional)</Label>
                <Select value={selectedPetId} onValueChange={setSelectedPetId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pet" />
                  </SelectTrigger>
                  <SelectContent>
                    {pets.map((pet) => (
                      <SelectItem key={pet.id} value={pet.id}>
                        {pet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { resetForm(); setIsEditModalOpen(false); setEditingExpense(null); }}>
              Cancel
            </Button>
            <Button onClick={handleEditExpense}>Update Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ExpenseTracker;
