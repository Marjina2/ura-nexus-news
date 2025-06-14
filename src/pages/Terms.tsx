
import React from 'react';
import { FileText, Scale, AlertCircle, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Terms = () => {
  const termsHighlights = [
    {
      icon: <FileText className="w-8 h-8 text-ura-green" />,
      title: 'Service Agreement',
      description: 'Terms governing your use of URA services and platform.'
    },
    {
      icon: <Scale className="w-8 h-8 text-ura-green" />,
      title: 'User Rights',
      description: 'Your rights and responsibilities as a URA user.'
    },
    {
      icon: <AlertCircle className="w-8 h-8 text-ura-green" />,
      title: 'Content Policy',
      description: 'Guidelines for content usage and sharing on our platform.'
    },
    {
      icon: <Users className="w-8 h-8 text-ura-green" />,
      title: 'Community Standards',
      description: 'Rules for interacting with other users and our community.'
    }
  ];

  return (
    <div className="min-h-screen bg-ura-black">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Please read these terms carefully before using our services.
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated: January 15, 2025
            </p>
          </div>
        </section>

        {/* Terms Highlights */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Key Terms Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {termsHighlights.map((term, index) => (
                <Card key={index} className="text-center hover-lift">
                  <CardHeader>
                    <div className="mx-auto mb-4">
                      {term.icon}
                    </div>
                    <CardTitle className="text-xl">{term.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{term.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-16 px-4 bg-card/50">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-bold text-ura-green mb-6">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground mb-6">
                By accessing or using URA's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>

              <h2 className="text-2xl font-bold text-ura-green mb-6">2. Description of Service</h2>
              <p className="text-muted-foreground mb-6">
                URA provides an AI-powered news curation platform that delivers personalized news content, analytics, and creator tools. Our services include:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-8 space-y-2">
                <li>AI-curated news articles and insights</li>
                <li>Content creation and licensing tools</li>
                <li>Analytics and reporting features</li>
                <li>API access for qualified users</li>
              </ul>

              <h2 className="text-2xl font-bold text-ura-green mb-6">3. User Accounts</h2>
              <p className="text-muted-foreground mb-6">
                To access certain features, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-8 space-y-2">
                <li>Maintaining the security of your account</li>
                <li>Providing accurate and current information</li>
                <li>Notifying us of any unauthorized use</li>
                <li>Complying with these terms and applicable laws</li>
              </ul>

              <h2 className="text-2xl font-bold text-ura-green mb-6">4. Content and Intellectual Property</h2>
              <p className="text-muted-foreground mb-6">
                All content on URA is protected by intellectual property laws. Users may:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-8 space-y-2">
                <li>View and read content for personal use</li>
                <li>Share articles using our sharing tools</li>
                <li>Use licensed content according to their subscription plan</li>
                <li>Not reproduce, distribute, or modify content without permission</li>
              </ul>

              <h2 className="text-2xl font-bold text-ura-green mb-6">5. Prohibited Uses</h2>
              <p className="text-muted-foreground mb-6">
                You may not use URA services to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-8 space-y-2">
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Distribute malware or harmful content</li>
                <li>Interfere with the operation of our services</li>
                <li>Attempt to gain unauthorized access to our systems</li>
              </ul>

              <h2 className="text-2xl font-bold text-ura-green mb-6">6. Payment and Subscriptions</h2>
              <p className="text-muted-foreground mb-6">
                Paid subscriptions are billed according to the selected plan. Cancellations take effect at the end of the current billing period. Refunds are provided according to our refund policy.
              </p>

              <h2 className="text-2xl font-bold text-ura-green mb-6">7. Limitation of Liability</h2>
              <p className="text-muted-foreground mb-6">
                URA shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.
              </p>

              <h2 className="text-2xl font-bold text-ura-green mb-6">8. Changes to Terms</h2>
              <p className="text-muted-foreground mb-6">
                We may modify these terms at any time. Continued use of our services after changes constitutes acceptance of the new terms.
              </p>

              <h2 className="text-2xl font-bold text-ura-green mb-6">9. Contact Information</h2>
              <p className="text-muted-foreground">
                For questions about these Terms of Service, contact us at legal@ura.com or through our contact form.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
