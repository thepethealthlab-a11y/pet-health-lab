import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 bg-destructive/10 rounded-lg mb-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Medical Disclaimer
              </h1>
              <p className="text-xl text-muted-foreground">
                Important information about using ThePetHealthLab
              </p>
            </div>

            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Not a Substitute for Professional Veterinary Care
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  <strong>ThePetHealthLab</strong> provides educational information and tools for pet health tracking 
                  purposes only. Our platform is NOT a substitute for professional veterinary advice, diagnosis, or treatment.
                </p>
                <p>
                  <strong>Always seek the advice of your veterinarian</strong> or other qualified animal health provider 
                  with any questions you may have regarding your pet's medical condition. Never disregard professional 
                  veterinary advice or delay in seeking it because of something you have read on ThePetHealthLab.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Educational Purpose Only</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  All content, tools, and features provided on ThePetHealthLab are for <strong>educational and 
                  informational purposes only</strong>. They are designed to help you:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Track and organize your pet's health information</li>
                  <li>Learn about common pet health topics</li>
                  <li>Prepare for veterinary appointments</li>
                  <li>Understand research-backed pet care practices</li>
                  <li>Connect with other pet parents for support</li>
                </ul>
                <p>
                  Our tools do <strong>NOT</strong> provide medical diagnoses, treatment plans, or medical advice 
                  of any kind.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Technology Limitations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  ThePetHealthLab uses artificial intelligence technology to provide educational insights and information. 
                  However, you should be aware that:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>AI systems can make errors or provide incomplete information</li>
                  <li>AI analysis is not equivalent to professional veterinary examination</li>
                  <li>Every pet is unique, and generalized information may not apply to your specific situation</li>
                  <li>AI tools cannot replace the expertise, judgment, and personal care provided by veterinarians</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Situations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  If you believe your pet is experiencing a medical emergency, <strong>do NOT</strong> use 
                  ThePetHealthLab to seek advice. Instead:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Contact your veterinarian immediately</li>
                  <li>Visit the nearest emergency veterinary clinic</li>
                  <li>Call a veterinary poison control hotline if poisoning is suspected</li>
                </ul>
                <p className="font-semibold text-destructive">
                  Time is critical in emergency situations. Do not delay seeking professional help.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>No Veterinary Relationship</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  Using ThePetHealthLab does <strong>NOT</strong> create a veterinarian-client-patient relationship. 
                  Any information provided through our platform should not be considered a professional veterinary opinion 
                  or recommendation for your specific pet.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accuracy of Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  While we strive to provide accurate and up-to-date information based on current research and 
                  veterinary science, ThePetHealthLab makes no representations or warranties about:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The accuracy, reliability, or completeness of any content</li>
                  <li>The suitability of information for your specific pet or situation</li>
                  <li>The currency of medical information, which may change as new research emerges</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Responsibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  By using ThePetHealthLab, you acknowledge and agree that:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You are solely responsible for your pet's healthcare decisions</li>
                  <li>You will consult with qualified veterinary professionals for all medical matters</li>
                  <li>You will not rely solely on information from ThePetHealthLab for medical decisions</li>
                  <li>You understand the limitations of our educational tools and AI technology</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-muted/30">
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  <strong>Last Updated:</strong> March 2024
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  If you have questions about this disclaimer, please contact our support team.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Disclaimer;
