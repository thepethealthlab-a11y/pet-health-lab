import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 bg-primary/10 rounded-lg mb-4">
                <Shield className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Privacy Policy
              </h1>
              <p className="text-xl text-muted-foreground">
                Last Updated: October 2025
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Our Commitment to Your Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  At ThePetHealthLab, we take your privacy seriously. This Privacy Policy explains how 
                  we collect, use, disclose, and safeguard your information when you use our Service.
                </p>
                <p>
                  Please read this policy carefully. If you do not agree with the terms of this Privacy 
                  Policy, please do not access the Service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>1. Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p><strong>Personal Information You Provide:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Information:</strong> Name, email address, password, display name</li>
                  <li><strong>Payment Information:</strong> Credit card details, billing address (processed securely through third-party payment processors)</li>
                  <li><strong>Pet Information:</strong> Pet names, species, breeds, ages, health records, symptoms, medical history</li>
                  <li><strong>Profile Information:</strong> Profile pictures, bio, preferences</li>
                  <li><strong>Communication Data:</strong> Messages, forum posts, support inquiries</li>
                </ul>

                <p><strong>Information Automatically Collected:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Device Information:</strong> IP address, browser type, device type, operating system</li>
                  <li><strong>Usage Data:</strong> Pages viewed, features used, time spent, click patterns</li>
                  <li><strong>Location Data:</strong> Approximate location based on IP address</li>
                  <li><strong>Cookies and Tracking:</strong> Analytics cookies, preference cookies, session data</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>We use collected information for the following purposes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Service Delivery:</strong> To provide, maintain, and improve our Service features</li>
                  <li><strong>Account Management:</strong> To create and manage your user account</li>
                  <li><strong>Personalization:</strong> To customize content and recommendations based on your pets</li>
                  <li><strong>Communication:</strong> To send service updates, newsletters, and promotional materials (with your consent)</li>
                  <li><strong>Customer Support:</strong> To respond to inquiries and provide assistance</li>
                  <li><strong>Analytics:</strong> To analyze usage patterns and improve our Service</li>
                  <li><strong>Security:</strong> To detect and prevent fraud, abuse, and security issues</li>
                  <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our Terms</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Cookie Usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>We use cookies and similar tracking technologies to enhance your experience:</p>
                
                <p><strong>Essential Cookies:</strong> Required for basic Service functionality (login, security)</p>
                
                <p><strong>Analytics Cookies:</strong> Help us understand how you use the Service (Google Analytics, etc.)</p>
                
                <p><strong>Preference Cookies:</strong> Remember your settings and preferences</p>
                
                <p><strong>Marketing Cookies:</strong> Track your activity for advertising purposes (with consent)</p>

                <p className="font-semibold mt-4">
                  You can control cookie settings through your browser. However, disabling certain 
                  cookies may limit Service functionality.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Information Sharing and Disclosure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>We may share your information in the following circumstances:</p>
                
                <p><strong>Service Providers:</strong> With third-party vendors who help us operate the Service 
                (hosting, payment processing, email delivery, analytics)</p>
                
                <p><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or sale of assets</p>
                
                <p><strong>Legal Requirements:</strong> When required by law, court order, or government request</p>
                
                <p><strong>Protection of Rights:</strong> To protect our rights, property, safety, or that of our users</p>
                
                <p><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</p>

                <p className="font-semibold">
                  We DO NOT sell your personal information to third parties for their marketing purposes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Data Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>We implement security measures to protect your information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Encryption of data in transit (SSL/TLS)</li>
                  <li>Encryption of sensitive data at rest</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and authentication</li>
                  <li>Secure payment processing (PCI DSS compliant)</li>
                </ul>
                <p className="font-semibold">
                  However, no method of transmission or storage is 100% secure. We cannot guarantee 
                  absolute security of your information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Your Privacy Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>Depending on your location, you may have the following rights:</p>
                
                <p><strong>Access:</strong> Request a copy of the personal information we hold about you</p>
                
                <p><strong>Correction:</strong> Request correction of inaccurate or incomplete information</p>
                
                <p><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</p>
                
                <p><strong>Portability:</strong> Request a copy of your data in a portable format</p>
                
                <p><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</p>
                
                <p><strong>Objection:</strong> Object to processing of your information for certain purposes</p>
                
                <p><strong>Restriction:</strong> Request limitation on how we use your information</p>

                <p className="mt-4">
                  To exercise these rights, contact us at <strong>privacy@thepethealthlab.com</strong>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Data Retention</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  We retain your information only as long as necessary to provide the Service and fulfill 
                  the purposes outlined in this Privacy Policy, unless a longer retention period is 
                  required by law.
                </p>
                <p>
                  When you delete your account, we will delete or anonymize your personal information 
                  within 30 days, except where we must retain it for legal or regulatory purposes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  Our Service is not intended for children under 13 years of age. We do not knowingly 
                  collect personal information from children under 13.
                </p>
                <p>
                  If you are a parent or guardian and believe your child has provided us with personal 
                  information, please contact us immediately so we can delete it.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. International Data Transfers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  Your information may be transferred to and maintained on servers located outside your 
                  jurisdiction, where privacy laws may differ from those in your country.
                </p>
                <p>
                  By using the Service, you consent to the transfer of your information to our facilities 
                  and third-party service providers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Third-Party Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  Our Service may contain links to third-party websites. We are not responsible for the 
                  privacy practices of these sites. We encourage you to review their privacy policies.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>11. California Privacy Rights (CCPA)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>If you are a California resident, you have additional rights under the CCPA:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Right to know what personal information is collected</li>
                  <li>Right to know if personal information is sold or disclosed</li>
                  <li>Right to opt-out of the sale of personal information</li>
                  <li>Right to deletion of personal information</li>
                  <li>Right to non-discrimination for exercising your rights</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>12. European Privacy Rights (GDPR)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>If you are in the European Economic Area, you have rights under GDPR including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Right to access your personal data</li>
                  <li>Right to rectification of inaccurate data</li>
                  <li>Right to erasure ("right to be forgotten")</li>
                  <li>Right to restrict processing</li>
                  <li>Right to data portability</li>
                  <li>Right to object to processing</li>
                  <li>Right to withdraw consent</li>
                  <li>Right to lodge a complaint with a supervisory authority</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>13. Changes to This Privacy Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of significant 
                  changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                </p>
                <p>
                  We encourage you to review this Privacy Policy periodically for any changes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>14. Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  If you have questions or concerns about this Privacy Policy or our data practices, 
                  please contact us at:
                </p>
                <p className="font-semibold">
                  Email: privacy@thepethealthlab.com<br />
                  Address: [Your Business Address]<br />
                  Data Protection Officer: [DPO Contact]
                </p>
              </CardContent>
            </Card>

            <Card className="bg-muted/30">
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  By using ThePetHealthLab, you acknowledge that you have read and understood this 
                  Privacy Policy and agree to its terms.
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

export default Privacy;
