import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { 
  Upload, Camera, Dog, Cat, Bird, MapPin, Phone, Mail, 
  Calendar as CalendarIcon, Clock, Download, Share2, Facebook, 
  Copy, Crown, AlertTriangle, CheckCircle, ChevronRight, ChevronLeft,
  Printer, Image as ImageIcon, FileText, Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LostPetGenerator = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [posterGenerated, setPosterGenerated] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  
  // Form state
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
  const [dateLost, setDateLost] = useState<Date | undefined>(undefined);
  const [timeLost, setTimeLost] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  
  const [contactName, setContactName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [alternatePhone, setAlternatePhone] = useState("");
  const [email, setEmail] = useState("");
  const [hasReward, setHasReward] = useState(false);
  const [rewardAmount, setRewardAmount] = useState("");

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 10MB",
          variant: "destructive"
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setPetPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      const parts = [match[1], match[2], match[3]].filter(Boolean);
      if (parts.length === 0) return '';
      if (parts.length === 1) return `(${parts[0]}`;
      if (parts.length === 2) return `(${parts[0]}) ${parts[1]}`;
      return `(${parts[0]}) ${parts[1]}-${parts[2]}`;
    }
    return value;
  };

  const handlePhoneChange = (value: string, setter: (v: string) => void) => {
    setter(formatPhoneNumber(value));
  };

  const canProceedStep1 = petPhoto !== null;
  const canProceedStep2 = petName && petType && colorMarkings;
  const canProceedStep3 = lastSeenLocation && dateLost;
  const canProceedStep4 = contactName && phoneNumber;

  const handleGeneratePoster = () => {
    if (!canProceedStep4) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    setPosterGenerated(true);
    toast({
      title: "Poster Generated!",
      description: "Your lost pet poster is ready to download and share."
    });
  };

  const handleDownload = (type: string) => {
    toast({
      title: `Downloading ${type}`,
      description: "Your file will be ready shortly."
    });
  };

  const handleShare = (platform: string) => {
    toast({
      title: `Sharing to ${platform}`,
      description: "Opening share dialog..."
    });
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors",
              currentStep === step
                ? "bg-primary text-primary-foreground"
                : currentStep > step
                ? "bg-green-500 text-white"
                : "bg-muted text-muted-foreground"
            )}
          >
            {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
          </div>
          {step < 4 && (
            <div className={cn(
              "w-12 h-1 mx-1",
              currentStep > step ? "bg-green-500" : "bg-muted"
            )} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <Card className="border-2 border-dashed border-muted-foreground/30">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Camera className="w-6 h-6 text-primary" />
          Step 1: Pet Photo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "flex flex-col items-center justify-center p-8 rounded-lg cursor-pointer transition-colors",
            petPhoto ? "bg-muted/50" : "bg-muted/30 hover:bg-muted/50"
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          {petPhoto ? (
            <div className="relative">
              <img
                src={petPhoto}
                alt="Pet"
                className="max-w-[300px] max-h-[300px] rounded-lg object-cover"
              />
              <Button
                size="sm"
                variant="secondary"
                className="absolute bottom-2 right-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setPetPhoto(null);
                }}
              >
                Change Photo
              </Button>
            </div>
          ) : (
            <>
              <Upload className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Drag & drop or click to upload</p>
              <p className="text-sm text-muted-foreground mb-4">
                (or use photo from your pet profile)
              </p>
              <p className="text-xs text-muted-foreground">
                Recommended: Clear, recent photo • Max size: 10MB • JPG, PNG
              </p>
            </>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={handlePhotoUpload}
        />
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dog className="w-6 h-6 text-primary" />
          Step 2: Pet Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="petName">Pet Name *</Label>
            <Input
              id="petName"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="Enter pet's name"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Pet Type *</Label>
            <Select value={petType} onValueChange={setPetType}>
              <SelectTrigger>
                <SelectValue placeholder="Select pet type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">🐕 Dog</SelectItem>
                <SelectItem value="cat">🐱 Cat</SelectItem>
                <SelectItem value="bird">🐦 Bird</SelectItem>
                <SelectItem value="other">🐾 Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="breed">Breed</Label>
            <Input
              id="breed"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder="e.g., Golden Retriever"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="colorMarkings">Color/Markings *</Label>
            <Input
              id="colorMarkings"
              value={colorMarkings}
              onChange={(e) => setColorMarkings(e.target.value)}
              placeholder="e.g., Golden fur with white chest, black collar"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Years old"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Label htmlFor="microchip">Microchipped?</Label>
          </div>
          <Switch
            id="microchip"
            checked={hasMicrochip}
            onCheckedChange={setHasMicrochip}
          />
        </div>
        
        {hasMicrochip && (
          <div className="space-y-2">
            <Label htmlFor="microchipId">Microchip ID</Label>
            <Input
              id="microchipId"
              value={microchipId}
              onChange={(e) => setMicrochipId(e.target.value)}
              placeholder="Enter microchip ID number"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-primary" />
          Step 3: Lost Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="lastSeenLocation">Last Seen Location *</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              id="lastSeenLocation"
              value={lastSeenLocation}
              onChange={(e) => setLastSeenLocation(e.target.value)}
              placeholder="123 Main Street, City, State"
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date Lost *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateLost && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateLost ? format(dateLost, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateLost}
                  onSelect={setDateLost}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timeLost">Time Lost (optional)</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="timeLost"
                type="time"
                value={timeLost}
                onChange={(e) => setTimeLost(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="additionalDetails">Additional Details</Label>
          <Textarea
            id="additionalDetails"
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            placeholder="Was scared/friendly, wearing a blue collar, responds to name, any medical conditions..."
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderStep4 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="w-6 h-6 text-primary" />
          Step 4: Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contactName">Your Name *</Label>
            <Input
              id="contactName"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value, setPhoneNumber)}
                placeholder="(555) 123-4567"
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="alternatePhone">Alternate Phone (optional)</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="alternatePhone"
                type="tel"
                value={alternatePhone}
                onChange={(e) => handlePhoneChange(e.target.value, setAlternatePhone)}
                placeholder="(555) 123-4567"
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email (optional)</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="pl-10"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Label htmlFor="reward">Reward Offered?</Label>
          </div>
          <Switch
            id="reward"
            checked={hasReward}
            onCheckedChange={setHasReward}
          />
        </div>
        
        {hasReward && (
          <div className="space-y-2">
            <Label htmlFor="rewardAmount">Reward Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
              <Input
                id="rewardAmount"
                type="number"
                value={rewardAmount}
                onChange={(e) => setRewardAmount(e.target.value)}
                placeholder="500"
                className="pl-8"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderPosterPreview = () => (
    <Card className="overflow-hidden">
      <CardHeader className="bg-destructive text-destructive-foreground">
        <CardTitle className="text-center text-xl">
          🚨 LOST PET - PLEASE HELP 🚨
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {petPhoto && (
          <div className="flex justify-center">
            <img
              src={petPhoto}
              alt={petName}
              className="max-w-[250px] max-h-[250px] rounded-lg object-cover border-4 border-primary"
            />
          </div>
        )}
        
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold uppercase">{petName}</h3>
          {breed && <p className="text-lg"><strong>BREED:</strong> {breed}</p>}
          <p className="text-lg"><strong>COLOR:</strong> {colorMarkings}</p>
          {age && <p><strong>AGE:</strong> {age} years old</p>}
        </div>
        
        <div className="bg-muted p-4 rounded-lg text-center">
          <p className="font-bold text-lg">LAST SEEN:</p>
          <p>{lastSeenLocation}</p>
          {dateLost && <p>{format(dateLost, "MMMM d, yyyy")}</p>}
          {timeLost && <p>Around {timeLost}</p>}
        </div>
        
        {(additionalDetails || hasMicrochip) && (
          <div className="space-y-1">
            {additionalDetails && (
              <p className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                {additionalDetails}
              </p>
            )}
            {hasMicrochip && (
              <p className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Microchipped
              </p>
            )}
          </div>
        )}
        
        <div className="bg-primary/10 p-4 rounded-lg text-center">
          <p className="font-bold text-lg">CONTACT:</p>
          <p className="text-lg">{contactName}</p>
          <p className="text-xl font-bold flex items-center justify-center gap-2">
            <Phone className="w-5 h-5" /> {phoneNumber}
          </p>
          {alternatePhone && <p>Alt: {alternatePhone}</p>}
          {email && <p>{email}</p>}
        </div>
        
        {hasReward && rewardAmount && (
          <div className="bg-amber-100 dark:bg-amber-900/30 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              🎁 ${rewardAmount} REWARD
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderPosterActions = () => (
    <div className="space-y-6">
      {/* Template Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Choose Template</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap">
            {[1, 2, 3].map((template) => (
              <Button
                key={template}
                variant={selectedTemplate === template ? "default" : "outline"}
                onClick={() => template <= 2 && setSelectedTemplate(template)}
                className="relative"
                disabled={template === 3}
              >
                Template {template}
                {template === 3 && (
                  <Lock className="w-3 h-3 ml-1" />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Download Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Download className="w-5 h-5" />
            Download Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            className="w-full justify-start" 
            onClick={() => handleDownload("High-Res Image")}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Download High-Res Image (for printing)
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => handleDownload("Social Media Version")}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Download Social Media Version
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => handleDownload("Flyer PDF")}
          >
            <FileText className="w-4 h-4 mr-2" />
            Download Flyer (Letter Size PDF)
          </Button>
        </CardContent>
      </Card>
      
      {/* Share Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Options
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            onClick={() => handleShare("Facebook")}
            className="justify-start"
          >
            <Facebook className="w-4 h-4 mr-2" />
            Facebook
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleShare("Nextdoor")}
            className="justify-start"
          >
            📱 Nextdoor
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleShare("Email")}
            className="justify-start"
          >
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast({ title: "Link copied!" });
            }}
            className="justify-start"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
        </CardContent>
      </Card>
      
      {/* Premium Features */}
      <Card className="border-primary/50 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Crown className="w-6 h-6 text-primary flex-shrink-0" />
            <div>
              <h4 className="font-bold mb-2">Premium Features:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ 10+ professional templates</li>
                <li>✓ Automatic social media posting</li>
                <li>✓ GPS last-seen location on map</li>
                <li>✓ Alert nearby ThePetHealthLab users</li>
                <li>✓ Reunion success tracker</li>
              </ul>
              <Button className="mt-4" size="sm">
                Upgrade Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTips = () => (
    <Card className="bg-muted/30">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          📝 Tips for Finding Your Lost Pet
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            Post flyers in 1-mile radius of last seen location
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            Check local shelters daily (in person if possible)
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            Post on Nextdoor, Facebook groups, and local apps
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            Search at dawn/dusk when it's quieter
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            Leave familiar items (bed, toys) outside your home
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            Contact local vets, groomers, and pet stores
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            File a report with local animal control
          </li>
        </ul>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Lost Pet Alert Generator
          </h1>
          <p className="text-muted-foreground text-lg">
            Create instant lost pet posters and social media alerts
          </p>
        </div>

        {!posterGenerated ? (
          <>
            {/* Step Indicator */}
            {renderStepIndicator()}

            {/* Form Steps */}
            <div className="max-w-2xl mx-auto space-y-6">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                {currentStep < 4 ? (
                  <Button
                    onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                    disabled={
                      (currentStep === 1 && !canProceedStep1) ||
                      (currentStep === 2 && !canProceedStep2) ||
                      (currentStep === 3 && !canProceedStep3)
                    }
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleGeneratePoster}
                    disabled={!canProceedStep4}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Generate Poster
                  </Button>
                )}
              </div>
            </div>

            {/* Tips Section */}
            <div className="max-w-2xl mx-auto mt-8">
              {renderTips()}
            </div>
          </>
        ) : (
          <>
            {/* Generated Poster View */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-bold mb-4 text-center">Poster Preview</h2>
                {renderPosterPreview()}
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => setPosterGenerated(false)}
                >
                  ← Edit Details
                </Button>
              </div>
              
              <div>
                {renderPosterActions()}
              </div>
            </div>

            {/* Tips at bottom */}
            <div className="mt-8 max-w-2xl mx-auto">
              {renderTips()}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default LostPetGenerator;
