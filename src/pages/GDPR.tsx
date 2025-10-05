import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const GDPR = () => {
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
                GDPR Compliance
              </h1>
              <p className="text-xl text-muted-foreground">
                Your data protection rights under the General Data Protection Regulation
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Our Commitment to GDPR</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  ThePetHealthLab is committed to protecting your privacy and complying with the General Data 
                  Protection Regulation (GDPR), the European Union's comprehensive data protection law.
                </p>
                <p>
                  This page outlines your rights under GDPR and explains how we handle your personal data in 
                  accordance with these regulations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your GDPR Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  Under GDPR, you have the following rights regarding your personal data:
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">1. Right to Access</h4>
                    <p>
                      You have the right to request a copy of the personal data we hold about you. We will provide 
                      this information in a commonly used electronic format within 30 days.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">2. Right to Rectification</h4>
                    <p>
                      You can request that we correct any inaccurate or incomplete personal data we hold about you. 
                      You can update most information directly through your account settings.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">3. Right to Erasure ("Right to be Forgotten")</h4>
                    <p>
                      You can request that we delete your personal data when:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>The data is no longer necessary for the purpose it was collected</li>
                      <li>You withdraw your consent and there is no other legal basis for processing</li>
                      <li>You object to processing and there are no overriding legitimate grounds</li>
                      <li>The data has been unlawfully processed</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">4. Right to Restrict Processing</h4>
                    <p>
                      You can request that we limit how we use your personal data in certain circumstances, such as:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>When you contest the accuracy of the data</li>
                      <li>When the processing is unlawful but you don't want the data erased</li>
                      <li>When you need the data for legal claims</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">5. Right to Data Portability</h4>
                    <p>
                      You have the right to receive your personal data in a structured, commonly used, and 
                      machine-readable format. You can also request that we transfer this data directly to 
                      another service provider where technically feasible.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">6. Right to Object</h4>
                    <p>
                      You can object to our processing of your personal data for:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Direct marketing purposes (including profiling)</li>
                      <li>Processing based on legitimate interests</li>
                      <li>Scientific or historical research purposes</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">7. Rights Related to Automated Decision-Making</h4>
                    <p>
                      You have the right not to be subject to decisions based solely on automated processing, 
                      including profiling, which produces legal effects or similarly significantly affects you.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How to Exercise Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  To exercise any of your GDPR rights, you can:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Email us:</strong> privacy@thepethealthlab.com with your request</li>
                  <li><strong>Use your account settings:</strong> Update or delete information directly in your profile</li>
                  <li><strong>Contact our Data Protection Officer:</strong> dpo@thepethealthlab.com</li>
                </ul>
                <p className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg mt-4">
                  <strong>Response Time:</strong> We will respond to your request within 30 days. If we need more 
                  time, we will notify you and explain why.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Legal Basis for Processing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  We process your personal data under the following legal bases:
                </p>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Consent</h4>
                    <p className="text-sm">
                      You have given clear consent for us to process your personal data for specific purposes 
                      (e.g., marketing communications, optional features).
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Contract</h4>
                    <p className="text-sm">
                      Processing is necessary to fulfill our contract with you (e.g., providing the services 
                      you've subscribed to).
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Legal Obligation</h4>
                    <p className="text-sm">
                      Processing is necessary for us to comply with legal obligations (e.g., tax records, 
                      fraud prevention).
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Legitimate Interests</h4>
                    <p className="text-sm">
                      Processing is necessary for our legitimate interests or those of a third party, provided 
                      your rights don't override these interests (e.g., improving our services, security).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Protection Measures</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  We implement appropriate technical and organizational measures to protect your personal data:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Encryption:</strong> Data is encrypted in transit (SSL/TLS) and at rest</li>
                  <li><strong>Access Controls:</strong> Strict access controls limit who can view your data</li>
                  <li><strong>Regular Audits:</strong> Security audits and vulnerability assessments</li>
                  <li><strong>Staff Training:</strong> All staff receive data protection training</li>
                  <li><strong>Data Minimization:</strong> We only collect data necessary for our purposes</li>
                  <li><strong>Pseudonymization:</strong> Where possible, we pseudonymize personal data</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>International Data Transfers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  When we transfer your personal data outside the European Economic Area (EEA), we ensure 
                  appropriate safeguards are in place:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Standard Contractual Clauses approved by the European Commission</li>
                  <li>Adequacy decisions recognizing equivalent data protection standards</li>
                  <li>Binding Corporate Rules for transfers within our organization</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Retention</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  We retain your personal data only for as long as necessary:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Data:</strong> Until you delete your account, plus 30 days</li>
                  <li><strong>Transaction Records:</strong> 7 years (legal requirement)</li>
                  <li><strong>Marketing Data:</strong> Until you unsubscribe, plus 2 years</li>
                  <li><strong>Support Tickets:</strong> 3 years after resolution</li>
                  <li><strong>Analytics Data:</strong> Aggregated data retained indefinitely (anonymized)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Breach Notification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  In the event of a data breach that is likely to result in a high risk to your rights and 
                  freedoms, we will:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Notify the appropriate supervisory authority within 72 hours</li>
                  <li>Notify affected individuals without undue delay</li>
                  <li>Provide information about the nature of the breach and mitigation steps</li>
                  <li>Offer advice on steps you can take to protect yourself</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Right to Lodge a Complaint</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  If you believe we have not handled your personal data in accordance with GDPR, you have the 
                  right to lodge a complaint with a supervisory authority, particularly in the EU member state 
                  where you live, work, or where the alleged infringement occurred.
                </p>
                <p>
                  However, we would appreciate the opportunity to address your concerns first. Please contact 
                  us at privacy@thepethealthlab.com.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Our Data Protection Officer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  For any questions about GDPR compliance or to exercise your rights, contact our Data 
                  Protection Officer:
                </p>
                <p className="font-semibold">
                  Email: dpo@thepethealthlab.com<br />
                  Address: [Your Business Address]<br />
                  Response Time: Within 30 days
                </p>
              </CardContent>
            </Card>

            <Card className="bg-muted/30">
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  <strong>Last Updated:</strong> October 2025
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  This GDPR compliance page is part of our commitment to protecting your privacy and data rights.
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

export default GDPR;
