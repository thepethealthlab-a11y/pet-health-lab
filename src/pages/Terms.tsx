import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 bg-primary/10 rounded-lg mb-4">
                <FileText className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Terms of Service
              </h1>
              <p className="text-xl text-muted-foreground">
                Last Updated: October 2025
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>1. Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  By accessing and using ThePetHealthLab ("Service", "Platform", "we", "us", or "our"), 
                  you accept and agree to be bound by the terms and provision of this agreement.
                </p>
                <p>
                  If you do not agree to abide by these Terms of Service, please do not use this Service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Service Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  ThePetHealthLab provides:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Educational pet health tools and resources</li>
                  <li>Health tracking and monitoring features</li>
                  <li>AI-powered insights for educational purposes only</li>
                  <li>Community forums for pet parents</li>
                  <li>Premium features through paid subscriptions</li>
                </ul>
                <p className="font-semibold">
                  Our Service is for educational purposes only and does NOT provide medical advice, 
                  diagnosis, or treatment. Always consult a licensed veterinarian for medical concerns.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. User Accounts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  <strong>Account Creation:</strong> You must create an account to access certain features. 
                  You agree to provide accurate, current, and complete information.
                </p>
                <p>
                  <strong>Account Security:</strong> You are responsible for maintaining the confidentiality 
                  of your account credentials and for all activities under your account.
                </p>
                <p>
                  <strong>Account Termination:</strong> We reserve the right to suspend or terminate your 
                  account if you violate these terms or engage in fraudulent or illegal activities.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Payment Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  <strong>Subscription Plans:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Free Plan:</strong> Access to 8 educational tools, basic community access, and standard support</li>
                  <li><strong>Premium Plan ($8.99/month):</strong> All 14 tools unlimited, advanced features, priority support, 5 pet profiles</li>
                  <li><strong>Family Plan ($15.99/month):</strong> Everything in Premium plus unlimited pet profiles and family member sharing</li>
                </ul>
                <p>
                  <strong>Billing:</strong> Subscriptions are billed monthly. You authorize us to charge your 
                  payment method on a recurring basis until you cancel.
                </p>
                <p>
                  <strong>Refunds:</strong> We offer a 14-day money-back guarantee for new subscriptions. 
                  After 14 days, subscriptions are non-refundable.
                </p>
                <p>
                  <strong>Cancellation:</strong> You may cancel your subscription at any time. Cancellations 
                  take effect at the end of the current billing period.
                </p>
                <p>
                  <strong>Price Changes:</strong> We reserve the right to modify subscription prices with 
                  30 days advance notice to active subscribers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. User Conduct</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>You agree NOT to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use the Service for any illegal purpose or in violation of any laws</li>
                  <li>Post harmful, threatening, abusive, or offensive content</li>
                  <li>Impersonate any person or entity</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                  <li>Attempt to gain unauthorized access to any part of the Service</li>
                  <li>Use automated systems (bots, scrapers) without permission</li>
                  <li>Share copyrighted material without proper authorization</li>
                  <li>Provide false or misleading information</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  All content, features, and functionality of ThePetHealthLab are owned by us and 
                  protected by copyright, trademark, and other intellectual property laws.
                </p>
                <p>
                  <strong>User Content:</strong> You retain ownership of content you submit but grant 
                  us a license to use, display, and distribute it as necessary to provide the Service.
                </p>
                <p>
                  <strong>Restrictions:</strong> You may not copy, modify, distribute, sell, or lease 
                  any part of our Service without explicit written permission.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Disclaimer of Warranties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
                  EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Accuracy, reliability, or completeness of information</li>
                  <li>Uninterrupted or error-free service</li>
                  <li>Fitness for a particular purpose</li>
                  <li>Non-infringement of third-party rights</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, THEPETHEALTHLAB SHALL NOT BE LIABLE FOR:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Any indirect, incidental, special, or consequential damages</li>
                  <li>Loss of profits, data, or use of the Service</li>
                  <li>Any damages resulting from use of or inability to use the Service</li>
                  <li>Medical decisions made based on information from the Service</li>
                </ul>
                <p>
                  Our total liability shall not exceed the amount you paid us in the 12 months 
                  preceding the claim.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Indemnification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  You agree to indemnify and hold harmless ThePetHealthLab, its affiliates, and their 
                  respective officers, directors, employees, and agents from any claims, damages, losses, 
                  or expenses arising from:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your use of the Service</li>
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any rights of another person or entity</li>
                  <li>Content you submit to the Service</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  Your use of the Service is also governed by our Privacy Policy. Please review our 
                  Privacy Policy to understand our data collection and use practices.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>11. Modifications to Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  We reserve the right to modify these Terms at any time. We will notify users of 
                  significant changes via email or through the Service. Continued use after changes 
                  constitutes acceptance of the modified Terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>12. Governing Law</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the 
                  jurisdiction in which we operate, without regard to its conflict of law provisions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>13. Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  For questions about these Terms of Service, please contact us at:
                </p>
                <p className="font-semibold">
                  Email: legal@thepethealthlab.com<br />
                  Address: [Your Business Address]
                </p>
              </CardContent>
            </Card>

            <Card className="bg-muted/30">
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  By using ThePetHealthLab, you acknowledge that you have read, understood, and agree 
                  to be bound by these Terms of Service.
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

export default Terms;
