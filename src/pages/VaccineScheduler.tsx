import { useState, useEffect } from "react";
import { format, differenceInDays, parseISO } from "date-fns";
import { Calendar as CalendarIcon, Plus, Check, Clock, Syringe, Mail, Phone, Lock, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useSEO } from "@/hooks/useSEO";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import ToolShell from "@/components/tools/ToolShell";
import AuthGate from "@/components/tools/AuthGate";
import ResultCard from "@/components/tools/ResultCard";

interface Pet { id: string; name: string; type: string; breed: string | null; birth_date: string | null; weight: number | null; }
interface Vaccine { id: string; pet_id: string; vaccine_name: string; due_date: string; completed_date: string | null; vet_clinic: string | null; notes: string | null; }

const VaccineScheduler = () => {
  useSEO({
    title: "Vaccination Schedule Tracker | ThePetHealthLab",
    description: "Never miss important vaccinations with smart reminders. Track your pet's vaccine schedule easily.",
    canonical: "https://pet-health-lab.lovable.app/tools/vaccine-tracker",
  });

  return (
    <ToolShell
      eyebrow="Pet Health"
      title="Vaccine Tracker"
      subtitle="Stay on top of every shot — track due dates, mark completions, and export the schedule."
    >
      <AuthGate toolName="the Vaccine Tracker" reason="Your pet's vaccine history is private — sign in to keep it safe and synced.">
        <VaccineDashboard />
      </AuthGate>
    </ToolShell>
  );
};

const VaccineDashboard = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);
  const [isAddVacOpen, setIsAddVacOpen] = useState(false);

  // pet form
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("");
  const [petBreed, setPetBreed] = useState("");
  const [petBirthDate, setPetBirthDate] = useState<Date | undefined>();
  const [petWeight, setPetWeight] = useState("");

  // vaccine form
  const [vName, setVName] = useState("");
  const [vDate, setVDate] = useState<Date | undefined>();
  const [vClinic, setVClinic] = useState("");
  const [vNotes, setVNotes] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      if (u) setUser({ id: u.id });
    });
  }, []);
  useEffect(() => { if (user) fetchPets(); }, [user]);
  useEffect(() => { if (selectedPet) fetchVaccines(selectedPet.id); }, [selectedPet]);

  const fetchPets = async () => {
    const { data, error } = await supabase.from("pets").select("*").order("created_at");
    if (error) return toast.error("Failed to load pets");
    setPets((data as Pet[]) || []);
    if (data && data.length > 0 && !selectedPet) setSelectedPet(data[0] as Pet);
  };

  const fetchVaccines = async (petId: string) => {
    const { data, error } = await supabase.from("vaccines").select("*").eq("pet_id", petId).order("due_date");
    if (error) return toast.error("Failed to load vaccines");
    setVaccines((data as Vaccine[]) || []);
  };

  const resetPet = () => { setPetName(""); setPetType(""); setPetBreed(""); setPetBirthDate(undefined); setPetWeight(""); };
  const resetVac = () => { setVName(""); setVDate(undefined); setVClinic(""); setVNotes(""); };

  const addPet = async () => {
    if (!user || !petName || !petType || !petBirthDate) return toast.error("Please fill the required fields");
    if (pets.length >= 1) return toast.error("Upgrade to Premium to add more pets");
    const { data, error } = await supabase.from("pets").insert({
      name: petName, type: petType, breed: petBreed || null,
      birth_date: format(petBirthDate, "yyyy-MM-dd"),
      weight: petWeight ? parseFloat(petWeight) : null, user_id: user.id,
    }).select().single();
    if (error) return toast.error("Failed to add pet");
    toast.success(`${petName} added`);
    setPets([...pets, data as Pet]);
    setSelectedPet(data as Pet);
    setIsAddPetOpen(false); resetPet();
  };

  const addVaccine = async () => {
    if (!selectedPet || !vName || !vDate) return toast.error("Please fill the required fields");
    const { data, error } = await supabase.from("vaccines").insert({
      pet_id: selectedPet.id, vaccine_name: vName,
      due_date: format(vDate, "yyyy-MM-dd"),
      vet_clinic: vClinic || null, notes: vNotes || null,
    }).select().single();
    if (error) return toast.error("Failed to add vaccine");
    toast.success("Vaccine scheduled");
    setVaccines([...vaccines, data as Vaccine]);
    setIsAddVacOpen(false); resetVac();
  };

  const markDone = async (id: string) => {
    const { error } = await supabase.from("vaccines").update({ completed_date: format(new Date(), "yyyy-MM-dd") }).eq("id", id);
    if (error) return toast.error("Failed to update");
    toast.success("Marked as completed");
    if (selectedPet) fetchVaccines(selectedPet.id);
  };

  const statusOf = (v: Vaccine) => {
    if (v.completed_date) return "completed";
    const days = differenceInDays(parseISO(v.due_date), new Date());
    if (days < 0) return "overdue";
    if (days <= 30) return "due-soon";
    return "scheduled";
  };

  const upcoming = vaccines.filter((v) => !v.completed_date).sort((a, b) => +new Date(a.due_date) - +new Date(b.due_date));
  const completed = vaccines.filter((v) => v.completed_date).sort((a, b) => +new Date(b.completed_date!) - +new Date(a.completed_date!));

  // --- Empty state: no pets
  if (pets.length === 0) {
    return (
      <div className="rounded-2xl border p-10 text-center shadow-soft" style={{ backgroundColor: "hsl(var(--surface-elevated))", borderColor: "hsl(var(--hairline))" }}>
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-5">
          <Syringe className="h-6 w-6 text-primary" />
        </div>
        <h2 className="font-display text-2xl mb-2">Add your first pet</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">Create a profile to start tracking vaccines, due dates and reminders.</p>
        <PetDialog open={isAddPetOpen} onOpenChange={setIsAddPetOpen} onSubmit={addPet} title="Add your pet"
          state={{ petName, setPetName, petType, setPetType, petBreed, setPetBreed, petBirthDate, setPetBirthDate, petWeight, setPetWeight }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pet selector */}
      {selectedPet && (
        <div className="rounded-2xl border p-5 flex items-center justify-between flex-wrap gap-4" style={{ backgroundColor: "hsl(var(--surface-elevated))", borderColor: "hsl(var(--hairline))" }}>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Tracking</p>
            <h2 className="font-display text-2xl">{selectedPet.name}</h2>
            <p className="text-sm text-muted-foreground">
              {selectedPet.type}{selectedPet.breed && ` · ${selectedPet.breed}`}
            </p>
          </div>
          <div className="flex gap-2">
            {pets.length > 1 && (
              <Select value={selectedPet.id} onValueChange={(id) => setSelectedPet(pets.find((p) => p.id === id) || null)}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {pets.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
            <Dialog open={isAddVacOpen} onOpenChange={setIsAddVacOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4" /> Add vaccine</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add vaccine</DialogTitle>
                  <DialogDescription>Track a vaccine or medication for {selectedPet.name}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Name *</Label>
                    <Input value={vName} onChange={(e) => setVName(e.target.value)} placeholder="e.g. Rabies, DHPP" />
                  </div>
                  <div>
                    <Label>Due date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start", !vDate && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />{vDate ? format(vDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={vDate} onSelect={setVDate} initialFocus className="pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label>Vet clinic</Label>
                    <Input value={vClinic} onChange={(e) => setVClinic(e.target.value)} placeholder="Optional" />
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Textarea value={vNotes} onChange={(e) => setVNotes(e.target.value)} rows={2} placeholder="Optional" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddVacOpen(false)}>Cancel</Button>
                  <Button onClick={addVaccine}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}

      {/* Upcoming */}
      <section className="space-y-3">
        <h3 className="font-display text-xl">Upcoming</h3>
        {upcoming.length === 0 ? (
          <ResultCard tone="info">No upcoming vaccines. Add one to get started.</ResultCard>
        ) : (
          upcoming.map((v) => {
            const s = statusOf(v);
            const tone = s === "overdue" ? "danger" : s === "due-soon" ? "warning" : "default";
            const days = differenceInDays(parseISO(v.due_date), new Date());
            return (
              <ResultCard key={v.id} tone={tone as "danger" | "warning" | "default"}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {s === "overdue" && <Badge variant="destructive">Overdue</Badge>}
                      {s === "due-soon" && <Badge className="bg-amber-500 text-white hover:bg-amber-500/90">Due soon</Badge>}
                      {s === "scheduled" && <Badge variant="secondary">Scheduled</Badge>}
                    </div>
                    <p className="font-display text-lg">{v.vaccine_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Due {format(parseISO(v.due_date), "MMM d, yyyy")}
                      {days < 0 ? ` · ${Math.abs(days)} days overdue` : ` · in ${days} days`}
                    </p>
                    {v.vet_clinic && <p className="text-sm text-muted-foreground">{v.vet_clinic}</p>}
                  </div>
                  <Button size="sm" onClick={() => markDone(v.id)}>
                    <Check className="mr-2 h-4 w-4" /> Mark done
                  </Button>
                </div>
              </ResultCard>
            );
          })
        )}
      </section>

      {/* Completed */}
      {completed.length > 0 && (
        <section className="space-y-3">
          <h3 className="font-display text-xl">Completed</h3>
          {completed.map((v) => (
            <ResultCard key={v.id} tone="success">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="font-medium">{v.vaccine_name}</p>
                  <p className="text-sm text-muted-foreground">Completed {format(parseISO(v.completed_date!), "MMM d, yyyy")}</p>
                </div>
                <Check className="h-5 w-5 text-secondary" />
              </div>
            </ResultCard>
          ))}
        </section>
      )}

      {/* Reminders */}
      <ResultCard title="Reminder preferences" icon={<Clock className="h-5 w-5" />}>
        <div className="space-y-3">
          <Row icon={<Mail className="h-4 w-4" />} title="Email" desc="Sent 30 days before due date" status="On" />
          <Row icon={<Phone className="h-4 w-4" />} title="SMS" desc="Premium only" premium />
        </div>
      </ResultCard>

      {/* Footer actions */}
      <div className="flex flex-wrap gap-3">
        <PetDialog open={isAddPetOpen} onOpenChange={setIsAddPetOpen} onSubmit={addPet} title="Add another pet"
          state={{ petName, setPetName, petType, setPetType, petBreed, setPetBreed, petBirthDate, setPetBirthDate, petWeight, setPetWeight }} variant="outline" />
        <Button variant="outline" disabled>
          <FileDown className="mr-2 h-4 w-4" /> Export schedule <Lock className="ml-2 h-3 w-3" />
        </Button>
      </div>

      <div className="rounded-2xl bg-gradient-ink text-background p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-display text-lg">SMS & WhatsApp reminders</p>
          <p className="text-sm text-background/70">Premium plans never miss a shot.</p>
        </div>
        <Button asChild variant="secondary"><Link to="/premium">Upgrade</Link></Button>
      </div>
    </div>
  );
};

const Row = ({ icon, title, desc, status, premium }: { icon: React.ReactNode; title: string; desc: string; status?: string; premium?: boolean }) => (
  <div className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: "hsl(var(--hairline))" }}>
    <div className="flex items-center gap-3">
      <span className="text-foreground/60">{icon}</span>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
    {premium ? (
      <Button size="sm" variant="outline" asChild><Link to="/premium">Upgrade</Link></Button>
    ) : (
      <Badge variant="secondary">{status}</Badge>
    )}
  </div>
);

interface PetDialogProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSubmit: () => void;
  title: string;
  variant?: "default" | "outline";
  state: {
    petName: string; setPetName: (v: string) => void;
    petType: string; setPetType: (v: string) => void;
    petBreed: string; setPetBreed: (v: string) => void;
    petBirthDate: Date | undefined; setPetBirthDate: (d: Date | undefined) => void;
    petWeight: string; setPetWeight: (v: string) => void;
  };
}

const PetDialog = ({ open, onOpenChange, onSubmit, title, variant = "default", state }: PetDialogProps) => {
  const { petName, setPetName, petType, setPetType, petBreed, setPetBreed, petBirthDate, setPetBirthDate, petWeight, setPetWeight } = state;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant={variant} size={variant === "default" ? "lg" : "default"}>
          <Plus className="mr-2 h-4 w-4" /> {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Tell us a few details to personalise the schedule.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div><Label>Name *</Label><Input value={petName} onChange={(e) => setPetName(e.target.value)} placeholder="e.g. Max" /></div>
          <div>
            <Label>Type *</Label>
            <Select value={petType} onValueChange={setPetType}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Dog">Dog</SelectItem>
                <SelectItem value="Cat">Cat</SelectItem>
                <SelectItem value="Rabbit">Rabbit</SelectItem>
                <SelectItem value="Bird">Bird</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Breed</Label><Input value={petBreed} onChange={(e) => setPetBreed(e.target.value)} placeholder="Optional" /></div>
          <div>
            <Label>Birth date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start", !petBirthDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />{petBirthDate ? format(petBirthDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={petBirthDate} onSelect={setPetBirthDate} disabled={(d) => d > new Date()} initialFocus className="pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>
          <div><Label>Weight</Label><Input type="number" value={petWeight} onChange={(e) => setPetWeight(e.target.value)} placeholder="Optional" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSubmit}>Save pet</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VaccineScheduler;
