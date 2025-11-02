import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Syringe, Calendar as CalendarIcon, Bell, Download, Mail, Shield, AlertTriangle } from "lucide-react";
import { format, addWeeks, addMonths, addYears, differenceInWeeks, differenceInMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { useSEO } from "@/hooks/useSEO";
import jsPDF from "jspdf";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VaccineEvent {
  name: string;
  dueDate: Date;
  description: string;
  type: "vaccine" | "checkup" | "treatment";
  urgent?: boolean;
}

const VaccineScheduler = () => {
  useSEO({
    title: "Pet Vaccine Schedule & Reminder | Free Vaccination Tracker | ThePetHealthLab",
    description: "Create your pet's personalized vaccine and health reminder plan. Track shots, boosters, and checkups easily with our free online vaccine scheduler.",
    keywords: "dog vaccine schedule, cat vaccination chart, pet vaccine tracker, pet reminder tool, puppy shots schedule, kitten vaccination, pet health reminders",
    canonical: "https://thepethealthlab.com/tools/vaccine-scheduler",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Pet Vaccine & Health Reminder Planner",
      "description": "Personalized vaccination and health checkup schedule tracker for pets",
      "url": "https://thepethealthlab.com/tools/vaccine-scheduler",
      "applicationCategory": "HealthApplication",
    },
  });

  const [petType, setPetType] = useState<string>("");
  const [breed, setBreed] = useState<string>("");
  const [birthDate, setBirthDate] = useState<Date>();
  const [country, setCountry] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [schedule, setSchedule] = useState<VaccineEvent[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);

  const countries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Spain",
    "Italy",
    "Netherlands",
    "Other"
  ];

  const generateDogSchedule = (birthDate: Date): VaccineEvent[] => {
    const events: VaccineEvent[] = [];
    
    // 6-8 weeks
    events.push({
      name: "DHPP - First Dose",
      dueDate: addWeeks(birthDate, 7),
      description: "Distemper, Hepatitis, Parvovirus, Parainfluenza combination vaccine",
      type: "vaccine",
    });
    
    events.push({
      name: "Bordetella",
      dueDate: addWeeks(birthDate, 7),
      description: "Kennel cough vaccine (especially if boarding or socializing)",
      type: "vaccine",
    });

    // 10-12 weeks
    events.push({
      name: "DHPP - Second Dose",
      dueDate: addWeeks(birthDate, 11),
      description: "Second combination vaccine booster",
      type: "vaccine",
    });

    events.push({
      name: "Leptospirosis",
      dueDate: addWeeks(birthDate, 11),
      description: "Bacterial disease vaccine (recommended in high-risk areas)",
      type: "vaccine",
    });

    // 14-16 weeks
    events.push({
      name: "DHPP - Third Dose",
      dueDate: addWeeks(birthDate, 15),
      description: "Final puppy combination vaccine",
      type: "vaccine",
    });

    events.push({
      name: "Rabies - First Dose",
      dueDate: addWeeks(birthDate, 15),
      description: "Required by law in most regions",
      type: "vaccine",
      urgent: true,
    });

    // 6 months
    events.push({
      name: "Spay/Neuter Checkup",
      dueDate: addMonths(birthDate, 6),
      description: "Consult with vet about spaying/neutering timing",
      type: "checkup",
    });

    // 1 year
    events.push({
      name: "DHPP - Annual Booster",
      dueDate: addYears(birthDate, 1),
      description: "First annual booster shot",
      type: "vaccine",
    });

    events.push({
      name: "Rabies - Booster",
      dueDate: addYears(birthDate, 1),
      description: "Annual or 3-year rabies booster (check local requirements)",
      type: "vaccine",
      urgent: true,
    });

    events.push({
      name: "Annual Wellness Exam",
      dueDate: addYears(birthDate, 1),
      description: "Complete physical examination and health screening",
      type: "checkup",
    });

    // Ongoing treatments
    events.push({
      name: "Deworming Treatment",
      dueDate: addWeeks(birthDate, 8),
      description: "Start regular deworming schedule (every 3 months)",
      type: "treatment",
    });

    events.push({
      name: "Flea & Tick Prevention",
      dueDate: addWeeks(birthDate, 12),
      description: "Begin monthly flea and tick prevention",
      type: "treatment",
    });

    return events.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  };

  const generateCatSchedule = (birthDate: Date): VaccineEvent[] => {
    const events: VaccineEvent[] = [];
    
    // 6-8 weeks
    events.push({
      name: "FVRCP - First Dose",
      dueDate: addWeeks(birthDate, 7),
      description: "Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia combination",
      type: "vaccine",
    });

    // 10-12 weeks
    events.push({
      name: "FVRCP - Second Dose",
      dueDate: addWeeks(birthDate, 11),
      description: "Second combination vaccine booster",
      type: "vaccine",
    });

    events.push({
      name: "FeLV - First Dose",
      dueDate: addWeeks(birthDate, 11),
      description: "Feline Leukemia Virus vaccine (for outdoor or multi-cat households)",
      type: "vaccine",
    });

    // 14-16 weeks
    events.push({
      name: "FVRCP - Third Dose",
      dueDate: addWeeks(birthDate, 15),
      description: "Final kitten combination vaccine",
      type: "vaccine",
    });

    events.push({
      name: "FeLV - Second Dose",
      dueDate: addWeeks(birthDate, 15),
      description: "FeLV booster shot",
      type: "vaccine",
    });

    events.push({
      name: "Rabies - First Dose",
      dueDate: addWeeks(birthDate, 15),
      description: "Required by law in most regions",
      type: "vaccine",
      urgent: true,
    });

    // 6 months
    events.push({
      name: "Spay/Neuter Checkup",
      dueDate: addMonths(birthDate, 6),
      description: "Consult with vet about spaying/neutering timing",
      type: "checkup",
    });

    // 1 year
    events.push({
      name: "FVRCP - Annual Booster",
      dueDate: addYears(birthDate, 1),
      description: "First annual booster shot",
      type: "vaccine",
    });

    events.push({
      name: "Rabies - Booster",
      dueDate: addYears(birthDate, 1),
      description: "Annual or 3-year rabies booster (check local requirements)",
      type: "vaccine",
      urgent: true,
    });

    events.push({
      name: "Annual Wellness Exam",
      dueDate: addYears(birthDate, 1),
      description: "Complete physical examination and health screening",
      type: "checkup",
    });

    // Ongoing treatments
    events.push({
      name: "Deworming Treatment",
      dueDate: addWeeks(birthDate, 8),
      description: "Start regular deworming schedule (every 3 months)",
      type: "treatment",
    });

    events.push({
      name: "Flea Prevention",
      dueDate: addWeeks(birthDate, 12),
      description: "Begin monthly flea prevention (especially for outdoor cats)",
      type: "treatment",
    });

    return events.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  };

  const generateSchedule = () => {
    if (!petType || !birthDate) return;

    let events: VaccineEvent[] = [];
    
    if (petType === "Dog") {
      events = generateDogSchedule(birthDate);
    } else if (petType === "Cat") {
      events = generateCatSchedule(birthDate);
    } else {
      // Generic schedule for other pets
      events = [
        {
          name: "Initial Vet Checkup",
          dueDate: addWeeks(birthDate, 8),
          description: "First veterinary examination",
          type: "checkup",
        },
        {
          name: "Follow-up Checkup",
          dueDate: addMonths(birthDate, 6),
          description: "6-month health check",
          type: "checkup",
        },
        {
          name: "Annual Wellness Exam",
          dueDate: addYears(birthDate, 1),
          description: "Yearly health screening",
          type: "checkup",
        },
      ];
    }

    setSchedule(events);
    setShowResults(true);
  };

  const resetForm = () => {
    setPetType("");
    setBreed("");
    setBirthDate(undefined);
    setCountry("");
    setEmail("");
    setSchedule([]);
    setShowResults(false);
  };

  const downloadSchedule = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Pet Vaccine & Health Schedule", pageWidth / 2, 20, { align: "center" });
    
    // Pet Info
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Pet: ${breed || petType}`, 20, 35);
    doc.text(`Birth Date: ${birthDate ? format(birthDate, "PPP") : "N/A"}`, 20, 42);
    doc.text(`Country: ${country}`, 20, 49);
    
    // Schedule
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Vaccination & Health Timeline", 20, 60);
    
    let yPos = 70;
    schedule.forEach((event, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      const dateText = `${format(event.dueDate, "MMM d, yyyy")} - ${getTimeFromBirth(event.dueDate)}`;
      doc.text(dateText, 20, yPos);
      
      doc.setFont("helvetica", "bold");
      yPos += 6;
      doc.text(event.name + (event.urgent ? " (REQUIRED)" : ""), 20, yPos);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      yPos += 5;
      const lines = doc.splitTextToSize(event.description, pageWidth - 40);
      doc.text(lines, 20, yPos);
      
      yPos += (lines.length * 5) + 8;
    });
    
    // Footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("Generated by The Pet Health Lab - thepethealthlab.com", pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });
    
    doc.save(`${breed || petType}_vaccine_schedule.pdf`);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "vaccine":
        return <Syringe className="h-5 w-5" />;
      case "checkup":
        return <Shield className="h-5 w-5" />;
      case "treatment":
        return <Bell className="h-5 w-5" />;
      default:
        return <CalendarIcon className="h-5 w-5" />;
    }
  };

  const getEventColor = (type: string, urgent?: boolean) => {
    if (urgent) return "border-destructive bg-destructive/5";
    switch (type) {
      case "vaccine":
        return "border-primary bg-primary/5";
      case "checkup":
        return "border-secondary bg-secondary/5";
      case "treatment":
        return "border-accent bg-accent/5";
      default:
        return "border-border bg-muted/20";
    }
  };

  const getTimeFromBirth = (eventDate: Date) => {
    if (!birthDate) return "";
    const weeks = differenceInWeeks(eventDate, birthDate);
    const months = differenceInMonths(eventDate, birthDate);
    
    if (weeks < 8) return `${weeks} weeks old`;
    if (months < 12) return `${months} months old`;
    return `${Math.floor(months / 12)} year${Math.floor(months / 12) > 1 ? "s" : ""} old`;
  };

  const sendEmailSchedule = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsEmailSending(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-vaccine-schedule', {
        body: {
          email,
          petType,
          breed,
          birthDate: birthDate?.toISOString(),
          country,
          schedule: schedule.map(event => ({
            ...event,
            dueDate: event.dueDate.toISOString(),
          })),
        },
      });

      if (error) throw error;

      toast.success("Schedule sent! Check your email inbox.");
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email. Please try again.");
    } finally {
      setIsEmailSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <header className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Pet Vaccine & Health Reminder Planner
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Create a personalized vaccination and health checkup schedule for your pet
            </p>
            <Alert className="mt-4 border-primary bg-primary/5">
              <Shield className="h-4 w-4 text-primary" />
              <AlertDescription className="text-sm">
                <strong>Important:</strong> Vaccine schedules may vary by region and individual pet needs. Always consult your veterinarian for personalized medical advice.
              </AlertDescription>
            </Alert>
          </header>

          {!showResults ? (
            <section className="space-y-6 animate-fade-in" aria-label="Pet vaccine scheduler form">
              <Card>
                <CardHeader>
                  <CardTitle>Pet Information</CardTitle>
                  <CardDescription>
                    Tell us about your pet to create their health schedule
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="petType">Pet Type</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <Button
                        type="button"
                        variant={petType === "Dog" ? "default" : "outline"}
                        onClick={() => setPetType("Dog")}
                        className="w-full"
                      >
                        Dog
                      </Button>
                      <Button
                        type="button"
                        variant={petType === "Cat" ? "default" : "outline"}
                        onClick={() => setPetType("Cat")}
                        className="w-full"
                      >
                        Cat
                      </Button>
                      <Button
                        type="button"
                        variant={petType === "Other" ? "default" : "outline"}
                        onClick={() => setPetType("Other")}
                        className="w-full"
                      >
                        Other
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="breed">Breed (Optional)</Label>
                    <Input
                      id="breed"
                      type="text"
                      placeholder="e.g., Golden Retriever, Persian Cat"
                      value={breed}
                      onChange={(e) => setBreed(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Date of Birth</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !birthDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {birthDate ? format(birthDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={birthDate}
                          onSelect={setBirthDate}
                          disabled={(date) => date > new Date() || date < new Date("1990-01-01")}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country / Region</Label>
                    <select
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select country</option>
                      {countries.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional - for reminders)</Label>
                    <div className="flex gap-2">
                      <Mail className="h-10 w-10 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Get your free personalized vaccine schedule PDF via email
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={generateSchedule}
                disabled={!petType || !birthDate || !country}
                className="w-full"
                size="lg"
              >
                Generate Vaccine Schedule
              </Button>
            </section>
          ) : (
            <section className="space-y-6 animate-fade-in" aria-label="Vaccine schedule results">
              <Alert className="border-secondary bg-secondary/10">
                <Shield className="h-4 w-4 text-secondary" />
                <AlertDescription className="text-base font-medium">
                  Success! Here's {breed || petType}'s personalized vaccine and health schedule with{" "}
                  <strong>{schedule.length} important events</strong>.
                </AlertDescription>
              </Alert>

              <div className="flex gap-4">
                <Button onClick={downloadSchedule} variant="outline" className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Download Schedule
                </Button>
                {email && (
                  <Button 
                    variant="default" 
                    className="flex-1"
                    onClick={sendEmailSchedule}
                    disabled={isEmailSending}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    {isEmailSending ? "Sending..." : "Email Me Schedule"}
                  </Button>
                )}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Your Pet's Vaccine Timeline</CardTitle>
                  <CardDescription>
                    Follow this schedule to keep {breed || `your ${petType.toLowerCase()}`} healthy and protected
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {schedule.map((event, index) => (
                    <div
                      key={index}
                      className={cn(
                        "relative p-4 rounded-lg border-2 transition-all hover:shadow-md",
                        getEventColor(event.type, event.urgent)
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "p-2 rounded-lg",
                          event.urgent ? "bg-destructive/10 text-destructive" :
                          event.type === "vaccine" ? "bg-primary/10 text-primary" :
                          event.type === "checkup" ? "bg-secondary/10 text-secondary" :
                          "bg-accent/10 text-accent"
                        )}>
                          {getEventIcon(event.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {event.name}
                                {event.urgent && (
                                  <span className="ml-2 text-xs bg-destructive text-destructive-foreground px-2 py-0.5 rounded">
                                    Required
                                  </span>
                                )}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {getTimeFromBirth(event.dueDate)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-sm">
                                {format(event.dueDate, "MMM d, yyyy")}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {event.dueDate < new Date() ? "Overdue" : "Upcoming"}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-foreground/90">{event.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-900/20">
                <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <AlertDescription>
                  <strong>Regional Note:</strong> Vaccine requirements vary by country and state. Some regions may require additional vaccines or have different schedules. Contact your local veterinarian for specific requirements in {country}.
                </AlertDescription>
              </Alert>

              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle>Recommended Pet Health Products</CardTitle>
                  <CardDescription>
                    Keep your pet protected with these trusted brands
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-4">
                  <a
                    href="https://www.chewy.com/b/flea-tick-2561"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-background rounded-lg border border-border hover:border-primary hover:shadow-md transition-all"
                  >
                    <h3 className="font-semibold text-lg mb-2">Flea & Tick Prevention</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Monthly protection from parasites
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Shop Now
                    </Button>
                  </a>
                  <a
                    href="https://www.chewy.com/b/dewormers-2560"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-background rounded-lg border border-border hover:border-primary hover:shadow-md transition-all"
                  >
                    <h3 className="font-semibold text-lg mb-2">Deworming Treatments</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Keep your pet parasite-free
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Shop Now
                    </Button>
                  </a>
                  <a
                    href="https://www.chewy.com/b/health-wellness-325"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-background rounded-lg border border-border hover:border-primary hover:shadow-md transition-all"
                  >
                    <h3 className="font-semibold text-lg mb-2">Pet Health Insurance</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Protect against unexpected vet bills
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Learn More
                    </Button>
                  </a>
                </CardContent>
              </Card>

              <Button onClick={resetForm} variant="outline" className="w-full" size="lg">
                Create Schedule for Another Pet
              </Button>
            </section>
          )}

          <section className="mt-16 animate-fade-in">
            <h2 className="text-3xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  What vaccines are required by law for pets?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Rabies vaccination is legally required in most countries and states for both dogs and cats. The schedule varies (annual vs. 3-year boosters) depending on local laws. Always check your specific region's requirements with your veterinarian or local animal control.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  Can I delay or skip some vaccines?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Core vaccines (Rabies, DHPP for dogs, FVRCP for cats) are essential and should not be skipped. Some non-core vaccines may be optional based on lifestyle and risk factors. Never delay or skip vaccines without consulting your veterinarian, as this puts your pet at serious health risk.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  What's the difference between core and non-core vaccines?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Core vaccines protect against serious, life-threatening diseases and are recommended for all pets (e.g., Rabies, DHPP, FVRCP). Non-core vaccines are optional and given based on lifestyle, location, and risk factors (e.g., Bordetella for dogs in daycare, FeLV for outdoor cats).
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">
                  How much do pet vaccines typically cost?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Vaccine costs vary by region and clinic. Generally, expect $20-50 per vaccine dose in the US. Initial puppy/kitten vaccine series (3-4 visits) typically costs $75-200 total. Annual boosters cost $50-150. Many clinics offer wellness packages that include vaccines at a discount. Pet insurance may cover preventive care.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">
                  Are there any side effects from pet vaccines?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Most pets experience no side effects. Mild reactions may include temporary soreness at injection site, low-grade fever, or decreased appetite for 24-48 hours. Serious allergic reactions are rare (less than 1 in 10,000). Contact your vet immediately if your pet shows severe lethargy, vomiting, facial swelling, or difficulty breathing after vaccination.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left">
                  Do indoor pets need vaccines?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes! Even indoor-only pets need core vaccines, especially Rabies (legally required in most areas). Diseases like Parvovirus can be tracked indoors on shoes and clothing. Indoor pets may also need emergency vet visits or boarding, where proof of vaccination is required. Consult your vet about which non-core vaccines indoor pets may skip.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VaccineScheduler;
