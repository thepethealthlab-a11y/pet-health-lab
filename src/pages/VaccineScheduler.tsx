import { useState, useEffect } from "react";
import { format, differenceInDays, parseISO } from "date-fns";
import { Calendar as CalendarIcon, Plus, Edit, Check, Clock, AlertTriangle, Mail, MessageSquare, Phone, Lock, FileDown, ChevronDown } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useSEO } from "@/hooks/useSEO";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string | null;
  birth_date: string | null;
  weight: number | null;
}

interface Vaccine {
  id: string;
  pet_id: string;
  vaccine_name: string;
  due_date: string;
  completed_date: string | null;
  vet_clinic: string | null;
  notes: string | null;
}

const VaccineScheduler = () => {
  useSEO({
    title: "Vaccination Schedule Tracker - ThePetHealthLab",
    description: "Never miss important vaccinations with smart reminders. Track your pet's vaccine schedule easily.",
    keywords: "pet vaccine tracker, vaccination schedule, pet health reminders, vaccine tracker",
    canonical: "https://thepethealthlab.com/tools/vaccine-tracker",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Vaccination Schedule Tracker",
      "applicationCategory": "HealthApplication",
      "description": "Track pet vaccinations and set smart reminders",
    },
  });

  const [user, setUser] = useState<any>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);
  const [isAddVaccineOpen, setIsAddVaccineOpen] = useState(false);
  const [emailReminders, setEmailReminders] = useState(true);

  // Add Pet Form State
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("");
  const [petBreed, setPetBreed] = useState("");
  const [petBirthDate, setPetBirthDate] = useState<Date | undefined>();
  const [petWeight, setPetWeight] = useState("");

  // Add Vaccine Form State
  const [vaccineName, setVaccineName] = useState("");
  const [vaccineDueDate, setVaccineDueDate] = useState<Date | undefined>();
  const [vaccineVetClinic, setVaccineVetClinic] = useState("");
  const [vaccineNotes, setVaccineNotes] = useState("");

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchPets();
    }
  }, [user]);

  useEffect(() => {
    if (selectedPet) {
      fetchVaccines(selectedPet.id);
    }
  }, [selectedPet]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
    setLoading(false);
  };

  const fetchPets = async () => {
    const { data, error } = await supabase
      .from("pets")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching pets:", error);
      toast.error("Failed to load pets");
      return;
    }

    setPets(data || []);
    if (data && data.length > 0 && !selectedPet) {
      setSelectedPet(data[0]);
    }
  };

  const fetchVaccines = async (petId: string) => {
    const { data, error } = await supabase
      .from("vaccines")
      .select("*")
      .eq("pet_id", petId)
      .order("due_date", { ascending: true });

    if (error) {
      console.error("Error fetching vaccines:", error);
      toast.error("Failed to load vaccines");
      return;
    }

    setVaccines(data || []);
  };

  const handleAddPet = async () => {
    if (!petName || !petType || !petBirthDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Free users can only have 1 pet
    if (pets.length >= 1) {
      toast.error("Upgrade to Premium to add more pets", {
        action: {
          label: "Upgrade",
          onClick: () => window.location.href = "/premium",
        },
      });
      return;
    }

    const { data, error } = await supabase
      .from("pets")
      .insert({
        name: petName,
        type: petType,
        breed: petBreed || null,
        birth_date: format(petBirthDate, "yyyy-MM-dd"),
        weight: petWeight ? parseFloat(petWeight) : null,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding pet:", error);
      toast.error("Failed to add pet");
      return;
    }

    toast.success(`${petName} added successfully!`);
    setPets([...pets, data]);
    setSelectedPet(data);
    setIsAddPetOpen(false);
    resetPetForm();
  };

  const handleAddVaccine = async () => {
    if (!vaccineName || !vaccineDueDate || !selectedPet) {
      toast.error("Please fill in all required fields");
      return;
    }

    const { data, error } = await supabase
      .from("vaccines")
      .insert({
        pet_id: selectedPet.id,
        vaccine_name: vaccineName,
        due_date: format(vaccineDueDate, "yyyy-MM-dd"),
        vet_clinic: vaccineVetClinic || null,
        notes: vaccineNotes || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding vaccine:", error);
      toast.error("Failed to add vaccine");
      return;
    }

    toast.success("Vaccine added successfully!");
    setVaccines([...vaccines, data]);
    setIsAddVaccineOpen(false);
    resetVaccineForm();
  };

  const handleMarkAsComplete = async (vaccineId: string) => {
    const { error } = await supabase
      .from("vaccines")
      .update({ completed_date: format(new Date(), "yyyy-MM-dd") })
      .eq("id", vaccineId);

    if (error) {
      console.error("Error marking vaccine as complete:", error);
      toast.error("Failed to mark vaccine as complete");
      return;
    }

    toast.success("Vaccine marked as completed!");
    if (selectedPet) {
      fetchVaccines(selectedPet.id);
    }
  };

  const resetPetForm = () => {
    setPetName("");
    setPetType("");
    setPetBreed("");
    setPetBirthDate(undefined);
    setPetWeight("");
  };

  const resetVaccineForm = () => {
    setVaccineName("");
    setVaccineDueDate(undefined);
    setVaccineVetClinic("");
    setVaccineNotes("");
  };

  const getVaccineStatus = (vaccine: Vaccine) => {
    if (vaccine.completed_date) {
      return "completed";
    }

    const daysUntilDue = differenceInDays(parseISO(vaccine.due_date), new Date());

    if (daysUntilDue < 0) {
      return "overdue";
    } else if (daysUntilDue <= 30) {
      return "due-soon";
    } else {
      return "scheduled";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "overdue":
        return <Badge variant="destructive" className="text-sm">⚠️ OVERDUE</Badge>;
      case "due-soon":
        return <Badge className="text-sm bg-amber-500 hover:bg-amber-600">⏰ DUE SOON</Badge>;
      case "scheduled":
        return <Badge variant="secondary" className="text-sm">📅 SCHEDULED</Badge>;
      case "completed":
        return <Badge className="text-sm bg-green-600 hover:bg-green-700">✅ COMPLETED</Badge>;
      default:
        return null;
    }
  };

  const getStatusMessage = (vaccine: Vaccine, status: string) => {
    if (status === "completed") {
      return `Completed: ${format(parseISO(vaccine.completed_date!), "MMM d, yyyy")}`;
    }

    const daysUntilDue = differenceInDays(parseISO(vaccine.due_date), new Date());

    if (daysUntilDue < 0) {
      return `Due: ${format(parseISO(vaccine.due_date), "MMM d, yyyy")} (${Math.abs(daysUntilDue)} days overdue)`;
    } else if (daysUntilDue <= 30) {
      return `Due: ${format(parseISO(vaccine.due_date), "MMM d, yyyy")} (in ${daysUntilDue} days)`;
    } else {
      const months = Math.floor(daysUntilDue / 30);
      return `Due: ${format(parseISO(vaccine.due_date), "MMM d, yyyy")} (in ${months} month${months > 1 ? 's' : ''})`;
    }
  };

  const getAge = (birthDate: string | null) => {
    if (!birthDate) return "Unknown age";
    const ageInMonths = differenceInDays(new Date(), parseISO(birthDate)) / 30;
    const years = Math.floor(ageInMonths / 12);
    const months = Math.floor(ageInMonths % 12);

    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''} old`;
    }
    return `${months} month${months > 1 ? 's' : ''} old`;
  };

  const upcomingVaccines = vaccines.filter(v => !v.completed_date).sort((a, b) => {
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });

  const completedVaccines = vaccines.filter(v => v.completed_date).sort((a, b) => {
    return new Date(b.completed_date!).getTime() - new Date(a.completed_date!).getTime();
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 py-16 px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="text-6xl mb-4">💉</div>
            <h1 className="text-3xl font-bold">Vaccination Schedule Tracker</h1>
            <p className="text-xl text-muted-foreground">
              Track your pet's vaccinations and never miss important reminders
            </p>
            <Card className="border-2 border-primary">
              <CardContent className="pt-6">
                <p className="mb-4">Please log in to access the vaccine tracker</p>
                <Button asChild size="lg">
                  <Link to="/login">Log In</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // No pets added yet - Welcome screen
  if (pets.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 py-16 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Vaccination Schedule Tracker</h1>
              <p className="text-xl text-muted-foreground">
                Never miss important vaccinations with smart reminders
              </p>
            </div>

            <Card className="text-center shadow-lg">
              <CardContent className="py-12 space-y-6">
                <div className="text-8xl">💉</div>
                <h2 className="text-2xl font-bold">Start Tracking Vaccinations</h2>
                <p className="text-muted-foreground">
                  Add your first pet to get started with automated vaccine schedules and reminders.
                </p>

                <Dialog open={isAddPetOpen} onOpenChange={setIsAddPetOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="mt-4">
                      <Plus className="mr-2 h-5 w-5" />
                      Add Your First Pet
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Your Pet</DialogTitle>
                      <DialogDescription>
                        Tell us about your pet to start tracking vaccinations
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="pet-name">Pet Name *</Label>
                        <Input
                          id="pet-name"
                          value={petName}
                          onChange={(e) => setPetName(e.target.value)}
                          placeholder="e.g., Max"
                        />
                      </div>

                      <div>
                        <Label htmlFor="pet-type">Pet Type *</Label>
                        <Select value={petType} onValueChange={setPetType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select pet type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Dog">Dog</SelectItem>
                            <SelectItem value="Cat">Cat</SelectItem>
                            <SelectItem value="Rabbit">Rabbit</SelectItem>
                            <SelectItem value="Bird">Bird</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="pet-breed">Breed (optional)</Label>
                        <Input
                          id="pet-breed"
                          value={petBreed}
                          onChange={(e) => setPetBreed(e.target.value)}
                          placeholder="e.g., Golden Retriever"
                        />
                      </div>

                      <div>
                        <Label htmlFor="pet-birth-date">Birth Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !petBirthDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {petBirthDate ? format(petBirthDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={petBirthDate}
                              onSelect={setPetBirthDate}
                              disabled={(date) => date > new Date()}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label htmlFor="pet-weight">Weight (optional)</Label>
                        <Input
                          id="pet-weight"
                          type="number"
                          value={petWeight}
                          onChange={(e) => setPetWeight(e.target.value)}
                          placeholder="e.g., 25 lbs"
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddPetOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddPet}>Save Pet</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Main view with pets
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 py-16 px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Vaccination Schedule Tracker</h1>
            <p className="text-xl text-muted-foreground">
              Never miss important vaccinations with smart reminders
            </p>
          </div>

          {/* Pet Selector */}
          {pets.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Select Pet</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedPet?.id} onValueChange={(id) => {
                  const pet = pets.find(p => p.id === id);
                  if (pet) setSelectedPet(pet);
                }}>
                  <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${pets.length}, 1fr)` }}>
                    {pets.map(pet => (
                      <TabsTrigger key={pet.id} value={pet.id}>
                        {pet.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Current Pet Card */}
          {selectedPet && (
            <Card className="border-2 border-primary">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      {selectedPet.type === "Dog" ? "🐕" : selectedPet.type === "Cat" ? "🐈" : "🐾"} {selectedPet.name}
                    </h2>
                    <p className="text-muted-foreground">
                      {selectedPet.breed && `${selectedPet.breed} | `}
                      {getAge(selectedPet.birth_date)}
                    </p>
                  </div>
                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Vaccine Schedule */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Vaccine Schedule</h2>
              <Dialog open={isAddVaccineOpen} onOpenChange={setIsAddVaccineOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Vaccine
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Custom Vaccine/Medication</DialogTitle>
                    <DialogDescription>
                      Add a vaccine or medication reminder for {selectedPet?.name}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="vaccine-name">Vaccine/Medication Name *</Label>
                      <Input
                        id="vaccine-name"
                        value={vaccineName}
                        onChange={(e) => setVaccineName(e.target.value)}
                        placeholder="e.g., Rabies Vaccine, Heartworm Medication"
                      />
                    </div>

                    <div>
                      <Label htmlFor="vaccine-due-date">Due Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !vaccineDueDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {vaccineDueDate ? format(vaccineDueDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={vaccineDueDate}
                            onSelect={setVaccineDueDate}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label htmlFor="vet-clinic">Vet Clinic (optional)</Label>
                      <Input
                        id="vet-clinic"
                        value={vaccineVetClinic}
                        onChange={(e) => setVaccineVetClinic(e.target.value)}
                        placeholder="e.g., Happy Paws Veterinary"
                      />
                    </div>

                    <div>
                      <Label htmlFor="vaccine-notes">Notes (optional)</Label>
                      <Textarea
                        id="vaccine-notes"
                        value={vaccineNotes}
                        onChange={(e) => setVaccineNotes(e.target.value)}
                        placeholder="Any additional notes..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddVaccineOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddVaccine}>Add Vaccine</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Upcoming Vaccinations */}
            {upcomingVaccines.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Upcoming Vaccinations</h3>
                {upcomingVaccines.map(vaccine => {
                  const status = getVaccineStatus(vaccine);
                  return (
                    <Card
                      key={vaccine.id}
                      className={cn(
                        "border-2",
                        status === "overdue" && "border-red-500 bg-red-50 dark:bg-red-950/20",
                        status === "due-soon" && "border-amber-500 bg-amber-50 dark:bg-amber-950/20",
                        status === "scheduled" && "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                      )}
                    >
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              {getStatusBadge(status)}
                              <h4 className="text-lg font-semibold mt-2">{vaccine.vaccine_name}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {getStatusMessage(vaccine, status)}
                              </p>
                              {vaccine.vet_clinic && (
                                <p className="text-sm text-muted-foreground">
                                  Vet: {vaccine.vet_clinic}
                                </p>
                              )}
                              {vaccine.notes && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  Notes: {vaccine.notes}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleMarkAsComplete(vaccine.id)}
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Mark as Done
                            </Button>
                            <Button size="sm" variant="outline">
                              <Clock className="mr-2 h-4 w-4" />
                              Postpone
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Completed Vaccinations */}
            {completedVaccines.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Completed Vaccinations</h3>
                {completedVaccines.map(vaccine => (
                  <Card key={vaccine.id} className="border-2 border-green-500 bg-green-50 dark:bg-green-950/20">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {getStatusBadge("completed")}
                          <h4 className="text-lg font-semibold mt-2">{vaccine.vaccine_name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {getStatusMessage(vaccine, "completed")}
                          </p>
                          {vaccine.vet_clinic && (
                            <p className="text-sm text-muted-foreground">
                              Vet: {vaccine.vet_clinic}
                            </p>
                          )}
                        </div>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {vaccines.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">No vaccines tracked yet</p>
                  <Button onClick={() => setIsAddVaccineOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Vaccine
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Reminder Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔔 Reminder Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      {emailReminders ? "✓ Enabled" : "Disabled"}
                    </p>
                    <p className="text-xs text-muted-foreground">Send 30 days before due date</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      SMS
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </p>
                    <p className="text-sm text-muted-foreground">🔒 Premium Only</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/premium">Upgrade to enable</Link>
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      WhatsApp
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </p>
                    <p className="text-sm text-muted-foreground">🔒 Premium Only</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/premium">Upgrade to enable</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Dialog open={isAddPetOpen} onOpenChange={setIsAddPetOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Pet
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Another Pet</DialogTitle>
                  <DialogDescription>
                    Tell us about your pet to start tracking vaccinations
                  </DialogDescription>
                </DialogHeader>

                <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-900 dark:text-amber-200">
                    Free plan allows 1 pet. Upgrade to Premium for up to 5 pets.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pet-name-2">Pet Name *</Label>
                    <Input
                      id="pet-name-2"
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      placeholder="e.g., Max"
                    />
                  </div>

                  <div>
                    <Label htmlFor="pet-type-2">Pet Type *</Label>
                    <Select value={petType} onValueChange={setPetType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pet type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dog">Dog</SelectItem>
                        <SelectItem value="Cat">Cat</SelectItem>
                        <SelectItem value="Rabbit">Rabbit</SelectItem>
                        <SelectItem value="Bird">Bird</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="pet-breed-2">Breed (optional)</Label>
                    <Input
                      id="pet-breed-2"
                      value={petBreed}
                      onChange={(e) => setPetBreed(e.target.value)}
                      placeholder="e.g., Golden Retriever"
                    />
                  </div>

                  <div>
                    <Label htmlFor="pet-birth-date-2">Birth Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !petBirthDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {petBirthDate ? format(petBirthDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={petBirthDate}
                          onSelect={setPetBirthDate}
                          disabled={(date) => date > new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label htmlFor="pet-weight-2">Weight (optional)</Label>
                    <Input
                      id="pet-weight-2"
                      type="number"
                      value={petWeight}
                      onChange={(e) => setPetWeight(e.target.value)}
                      placeholder="e.g., 25 lbs"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddPetOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddPet}>Save Pet</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline" disabled>
              <FileDown className="mr-2 h-4 w-4" />
              Export Schedule
              <Lock className="ml-2 h-3 w-3" />
            </Button>
          </div>

          {/* Premium Upsell */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2 border-blue-200 dark:border-blue-800">
            <CardContent className="py-8">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold">💎 Upgrade to Premium</h3>
                <div className="grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Up to 5 pets</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>SMS & WhatsApp reminders</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Custom medication reminders</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Full health timeline</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Export PDF reports</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Priority support</span>
                  </div>
                </div>
                <Button size="lg" asChild className="mt-4">
                  <Link to="/premium">Upgrade Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VaccineScheduler;