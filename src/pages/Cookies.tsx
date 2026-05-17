import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie } from "lucide-react";

const Cookies = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 bg-primary/10 rounded-lg mb-4">
                <Cookie className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Cookie Policy
              </h1>
              <p className="text-xl text-muted-foreground">
                Last Updated: October 2025
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>What Are Cookies?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                  They are widely used to make websites work more efficiently and provide information to website owners.
                </p>
                <p>
                  ThePetHealthLab uses cookies to enhance your experience, analyze site traffic, and personalize content.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Types of Cookies We Use</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">1. Essential Cookies</h4>
                    <p>
                      These cookies are necessary for the website to function properly. They enable core functionality 
                      such as security, network management, and accessibility.
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Authentication cookies (to keep you logged in)</li>
                      <li>Security cookies (to prevent fraud)</li>
                      <li>Session cookies (to remember your preferences during a visit)</li>
                    </ul>
                    <p className="mt-2 text-sm text-muted-foreground">
                      <strong>Retention:</strong> Session or up to 1 year
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">2. Analytics Cookies</h4>
                    <p>
                      We use analytics cookies to understand how visitors interact with our website, helping us 
                      improve user experience.
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Google Analytics (traffic analysis)</li>
                      <li>Page view tracking</li>
                      <li>User behavior patterns</li>
                      <li>Performance monitoring</li>
                    </ul>
                    <p className="mt-2 text-sm text-muted-foreground">
                      <strong>Retention:</strong> Up to 2 years
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">3. Functionality Cookies</h4>
                    <p>
                      These cookies allow us to remember choices you make and provide enhanced, personalized features.
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Language preferences</li>
                      <li>Theme settings (dark/light mode)</li>
                      <li>Pet profile settings</li>
                      <li>Dashboard customizations</li>
                    </ul>
                    <p className="mt-2 text-sm text-muted-foreground">
                      <strong>Retention:</strong> Up to 1 year
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">4. Marketing Cookies</h4>
                    <p>
                      With your consent, we use marketing cookies to show you relevant advertisements and measure 
                      campaign effectiveness.
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Advertising platform cookies</li>
                      <li>Social media integration</li>
                      <li>Retargeting pixels</li>
                      <li>Conversion tracking</li>
                    </ul>
                    <p className="mt-2 text-sm text-muted-foreground">
                      <strong>Retention:</strong> Up to 1 year
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Third-Party Cookies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  We may use third-party services that set cookies on our behalf. These include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Google Analytics:</strong> For website traffic analysis</li>
                  <li><strong>Stripe:</strong> For secure payment processing</li>
                  <li><strong>Social Media Platforms:</strong> For social sharing features</li>
                  <li><strong>Customer Support Tools:</strong> For live chat functionality</li>
                </ul>
                <p>
                  These third-party services have their own privacy policies and cookie policies that govern 
                  their use of cookies.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Managing Your Cookie Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  You have several options to manage or disable cookies:
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Cookie Banner</h4>
                    <p>
                      When you first visit ThePetHealthLab, you'll see a cookie consent banner where you can 
                      accept or customize your cookie preferences.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Browser Settings</h4>
                    <p>
                      Most web browsers allow you to control cookies through their settings:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies</li>
                      <li><strong>Firefox:</strong> Preferences → Privacy & Security → Cookies</li>
                      <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                      <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Opt-Out Links</h4>
                    <p>
                      You can opt out of certain analytics cookies:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Opt-out browser add-on</a></li>
                    </ul>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg">
                  <strong>Note:</strong> Disabling certain cookies may limit your ability to use some features 
                  of ThePetHealthLab. Essential cookies cannot be disabled as they are necessary for the website to function.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cookie Data We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  Through cookies, we may collect:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Pages visited and time spent</li>
                  <li>Referring website</li>
                  <li>Click patterns and navigation paths</li>
                  <li>Geographic location (country/city level)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Updates to Cookie Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for 
                  legal, operational, or regulatory reasons. We will notify you of significant changes by posting 
                  a notice on our website.
                </p>
                <p>
                  We encourage you to review this policy periodically to stay informed about our use of cookies.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                  If you have questions about our use of cookies or this Cookie Policy, please contact us:
                </p>
                <p className="font-semibold">
                  Email: privacy@pet-health-lab.lovable.app<br />
                  Address: [Your Business Address]
                </p>
              </CardContent>
            </Card>

            <Card className="bg-muted/30">
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  By continuing to use ThePetHealthLab, you consent to our use of cookies as described in this policy.
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

export default Cookies;
