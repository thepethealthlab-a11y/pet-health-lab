import { useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Upload, Camera, MapPin, Phone, Mail, Calendar as CalendarIcon, Clock,
  Share2, Copy, ChevronRight, ChevronLeft, Printer, FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolShell from "@/components/tools/ToolShell";
import ToolStep from "@/components/tools/ToolStep";
import { useSEO } from "@/hooks/useSEO";

const LostPetGenerator = () => {
  useSEO({
    title: "Lost Pet Poster Generator | ThePetHealthLab",
    description: "Create instant printable lost pet posters and share alerts with your community.",
    canonical: "https://thepethealthlab.com/tools/lost-pet-generator",
  });

  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(1);
  const [generated, setGenerated] = useState(false);

  const [petPhoto, setPetPhoto] = useState<string | null>(null);
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("");
  const [breed, setBreed] = useState("");
  const [colorMarkings, setColorMarkings] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [hasMicrochip, setHasMicrochip] = useState(false);
  const [microchipId, setMicrochipId] = useState("");

  const [lastSeenLocation, setLastSeenLocation] = useState("");
  const [dateLost, setDateLost] = useState<Date | undefined>();
  const [timeLost, setTimeLost] = useState("");
  const [details, setDetails] = useState("");

  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [email, setEmail] = useState("");
  const [hasReward, setHasReward] = useState(false);
  const [rewardAmount, setRewardAmount] = useState("");

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return toast({ title: "File too large", description: "Max 10MB", variant: "destructive" });
    const r = new FileReader();
    r.onload = (ev) => setPetPhoto(ev.target?.result as string);
    r.readAsDataURL(file);
  };

  const fmtPhone = (v: string) => {
    const c = v.replace(/\D/g, "");
    const m = c.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!m) return v;
    const p = [m[1], m[2], m[3]].filter(Boolean);
    if (!p.length) return "";
    if (p.length === 1) return `(${p[0]}`;
    if (p.length === 2) return `(${p[0]}) ${p[1]}`;
    return `(${p[0]}) ${p[1]}-${p[2]}`;
  };

  const ok1 = !!petPhoto;
  const ok2 = !!(petName && petType && colorMarkings);
  const ok3 = !!(lastSeenLocation && dateLost);
  const ok4 = !!(contactName && phone);

  const generate = () => { if (!ok4) return toast({ title: "Missing info", variant: "destructive" }); setGenerated(true); };

  const printPoster = () => window.print();

  const shareText = useMemo(() => `🚨 LOST ${petType || "PET"}: ${petName}
${colorMarkings}${breed ? ` · ${breed}` : ""}${age ? ` · ${age} yrs` : ""}
Last seen: ${lastSeenLocation}${dateLost ? ` on ${format(dateLost, "MMM d, yyyy")}` : ""}
Contact ${contactName}: ${phone}${hasReward && rewardAmount ? `\n💰 $${rewardAmount} reward` : ""}`, [petType, petName, colorMarkings, breed, age, lastSeenLocation, dateLost, contactName, phone, hasReward, rewardAmount]);

  const copyShare = async () => { await navigator.clipboard.writeText(shareText); toast({ title: "Copied to clipboard" }); };

  return (
    <ToolShell
      eyebrow="Pet Recovery"
      title="Lost Pet Poster"
      subtitle="Generate a clear, printable alert in under a minute and share it with your neighbourhood."
    >
      {!generated ? (
        <div className="space-y-6">
          <ToolStep number={1} title="Pet photo" complete={ok1} active={step >= 1}>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handlePhoto} />
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors",
                petPhoto ? "border-primary/40 bg-primary/[0.02]" : "border-hairline hover:bg-muted/30"
              )}
              style={!petPhoto ? { borderColor: "hsl(var(--hairline))" } : undefined}
            >
              {petPhoto ? (
                <div className="space-y-3">
                  <img src={petPhoto} alt="Pet" className="max-h-64 mx-auto rounded-xl object-cover" />
                  <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setPetPhoto(null); }}>Change photo</Button>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm font-medium mb-1">Click to upload a clear photo</p>
                  <p className="text-xs text-muted-foreground">JPG or PNG · max 10MB</p>
                </>
              )}
            </div>
          </ToolStep>

          <ToolStep number={2} title="Pet details" complete={ok2} active={ok1}>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name *" value={petName} onChange={setPetName} placeholder="e.g. Bella" />
              <div>
                <Label className="text-sm">Type *</Label>
                <Select value={petType} onValueChange={setPetType}>
                  <SelectTrigger className="mt-2"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dog">Dog</SelectItem>
                    <SelectItem value="Cat">Cat</SelectItem>
                    <SelectItem value="Bird">Bird</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Field label="Breed" value={breed} onChange={setBreed} placeholder="e.g. Golden Retriever" />
              <Field label="Color & markings *" value={colorMarkings} onChange={setColorMarkings} placeholder="e.g. Brown with white chest" />
              <Field label="Age" value={age} onChange={setAge} placeholder="Years" type="number" />
              <div>
                <Label className="text-sm">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="mt-2"><SelectValue placeholder="—" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl border p-3" style={{ borderColor: "hsl(var(--hairline))" }}>
              <Label className="text-sm">Microchipped</Label>
              <Switch checked={hasMicrochip} onCheckedChange={setHasMicrochip} />
            </div>
            {hasMicrochip && <div className="mt-3"><Field label="Microchip ID" value={microchipId} onChange={setMicrochipId} /></div>}
          </ToolStep>

          <ToolStep number={3} title="Where & when" complete={ok3} active={ok2}>
            <div className="space-y-4">
              <div>
                <Label className="text-sm">Last seen location *</Label>
                <div className="relative mt-2">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-9 bg-background" value={lastSeenLocation} onChange={(e) => setLastSeenLocation(e.target.value)} placeholder="123 Main St, City" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Date lost *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("mt-2 w-full justify-start", !dateLost && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />{dateLost ? format(dateLost, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={dateLost} onSelect={setDateLost} initialFocus className="pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="text-sm">Time lost</Label>
                  <div className="relative mt-2">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="time" className="pl-9 bg-background" value={timeLost} onChange={(e) => setTimeLost(e.target.value)} />
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-sm">Additional details</Label>
                <Textarea className="mt-2 bg-background" rows={3} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Wearing collar, friendly, responds to name..." />
              </div>
            </div>
          </ToolStep>

          <ToolStep number={4} title="Contact info" complete={ok4} active={ok3}>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Your name *" value={contactName} onChange={setContactName} />
              <div>
                <Label className="text-sm">Phone *</Label>
                <div className="relative mt-2">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-9 bg-background" type="tel" value={phone} onChange={(e) => setPhone(fmtPhone(e.target.value))} placeholder="(555) 123-4567" />
                </div>
              </div>
              <div>
                <Label className="text-sm">Alternate phone</Label>
                <div className="relative mt-2">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-9 bg-background" type="tel" value={altPhone} onChange={(e) => setAltPhone(fmtPhone(e.target.value))} placeholder="(555) 123-4567" />
                </div>
              </div>
              <div>
                <Label className="text-sm">Email</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-9 bg-background" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl border p-3" style={{ borderColor: "hsl(var(--hairline))" }}>
              <Label className="text-sm">Reward offered</Label>
              <Switch checked={hasReward} onCheckedChange={setHasReward} />
            </div>
            {hasReward && (
              <div className="mt-3">
                <Label className="text-sm">Reward amount</Label>
                <div className="relative mt-2">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input type="number" className="pl-7 bg-background" value={rewardAmount} onChange={(e) => setRewardAmount(e.target.value)} placeholder="500" />
                </div>
              </div>
            )}
          </ToolStep>

          {/* Live preview */}
          {ok2 && (
            <div className="rounded-2xl border bg-[hsl(var(--surface-elevated))] p-4" style={{ borderColor: "hsl(var(--hairline))" }}>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Live preview</p>
              <PosterPreview
                petPhoto={petPhoto} petName={petName} petType={petType} breed={breed} colorMarkings={colorMarkings}
                age={age} lastSeenLocation={lastSeenLocation} dateLost={dateLost} timeLost={timeLost} details={details}
                contactName={contactName} phone={phone} altPhone={altPhone} email={email}
                hasReward={hasReward} rewardAmount={rewardAmount} hasMicrochip={hasMicrochip}
                compact
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <Button variant="outline" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            {step < 4 ? (
              <Button onClick={() => setStep(step + 1)} disabled={(step === 1 && !ok1) || (step === 2 && !ok2) || (step === 3 && !ok3)}>
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={generate} disabled={!ok4}>
                <FileText className="mr-2 h-4 w-4" /> Generate poster
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div ref={posterRef} className="print:m-0" id="lost-pet-poster">
            <PosterPreview
              petPhoto={petPhoto} petName={petName} petType={petType} breed={breed} colorMarkings={colorMarkings}
              age={age} lastSeenLocation={lastSeenLocation} dateLost={dateLost} timeLost={timeLost} details={details}
              contactName={contactName} phone={phone} altPhone={altPhone} email={email}
              hasReward={hasReward} rewardAmount={rewardAmount} hasMicrochip={hasMicrochip}
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-3 print:hidden">
            <Button onClick={printPoster} size="lg"><Printer className="mr-2 h-4 w-4" /> Print / Save PDF</Button>
            <Button onClick={copyShare} variant="outline" size="lg"><Copy className="mr-2 h-4 w-4" /> Copy alert text</Button>
            <Button
              onClick={() => {
                if (navigator.share) navigator.share({ title: `Lost: ${petName}`, text: shareText });
                else copyShare();
              }}
              variant="outline" size="lg"
            ><Share2 className="mr-2 h-4 w-4" /> Share</Button>
          </div>

          <div className="flex justify-center print:hidden">
            <Button variant="ghost" onClick={() => setGenerated(false)}>Edit details</Button>
          </div>

          <style>{`
            @media print {
              body * { visibility: hidden; }
              #lost-pet-poster, #lost-pet-poster * { visibility: visible; }
              #lost-pet-poster { position: absolute; left: 0; top: 0; width: 100%; }
            }
          `}</style>
        </div>
      )}
    </ToolShell>
  );
};

const Field = ({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) => (
  <div>
    <Label className="text-sm">{label}</Label>
    <Input type={type} className="mt-2 bg-background" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
  </div>
);

interface PosterProps {
  petPhoto: string | null; petName: string; petType: string; breed: string; colorMarkings: string;
  age: string; lastSeenLocation: string; dateLost: Date | undefined; timeLost: string; details: string;
  contactName: string; phone: string; altPhone: string; email: string;
  hasReward: boolean; rewardAmount: string; hasMicrochip: boolean; compact?: boolean;
}

const PosterPreview = (p: PosterProps) => (
  <div className={cn("rounded-2xl overflow-hidden border-2 border-foreground bg-background", p.compact ? "max-w-md mx-auto" : "max-w-xl mx-auto")}>
    <div className="bg-destructive text-destructive-foreground text-center py-3 font-display tracking-wide">
      🚨 LOST {p.petType ? p.petType.toUpperCase() : "PET"} · PLEASE HELP
    </div>
    <div className={cn("p-6 space-y-4", p.compact && "p-4 space-y-3")}>
      {p.petPhoto && (
        <div className="flex justify-center">
          <img src={p.petPhoto} alt={p.petName} className={cn("rounded-lg object-cover border-2 border-foreground", p.compact ? "max-h-40" : "max-h-64")} />
        </div>
      )}
      <div className="text-center">
        <h3 className={cn("font-display uppercase tracking-tight", p.compact ? "text-2xl" : "text-4xl")}>{p.petName || "Pet name"}</h3>
        {p.breed && <p className="text-sm">{p.breed}</p>}
      </div>
      <div className="rounded-lg bg-muted p-3 text-sm space-y-1 text-center">
        <p><strong>Color:</strong> {p.colorMarkings || "—"}</p>
        {p.age && <p><strong>Age:</strong> {p.age} yrs</p>}
        {p.hasMicrochip && <p>✓ Microchipped</p>}
      </div>
      <div className="rounded-lg bg-muted p-3 text-sm text-center">
        <p className="font-bold">LAST SEEN</p>
        <p>{p.lastSeenLocation || "—"}</p>
        {p.dateLost && <p>{format(p.dateLost, "MMM d, yyyy")}{p.timeLost && ` · ${p.timeLost}`}</p>}
      </div>
      {p.details && <p className="text-sm text-center italic">"{p.details}"</p>}
      <div className="rounded-lg bg-primary/10 border border-primary/20 p-3 text-center">
        <p className="text-xs uppercase tracking-wider font-bold mb-1">Contact</p>
        <p className="font-medium">{p.contactName || "—"}</p>
        <p className={cn("font-bold flex items-center justify-center gap-1", p.compact ? "text-lg" : "text-2xl")}>
          <Phone className={p.compact ? "h-4 w-4" : "h-5 w-5"} /> {p.phone || "—"}
        </p>
        {p.altPhone && <p className="text-sm">Alt: {p.altPhone}</p>}
        {p.email && <p className="text-sm">{p.email}</p>}
      </div>
      {p.hasReward && p.rewardAmount && (
        <div className="rounded-lg bg-amber-100 dark:bg-amber-900/30 p-3 text-center">
          <p className={cn("font-bold text-amber-700 dark:text-amber-300", p.compact ? "text-lg" : "text-2xl")}>
            🎁 ${p.rewardAmount} REWARD
          </p>
        </div>
      )}
    </div>
  </div>
);

export default LostPetGenerator;
