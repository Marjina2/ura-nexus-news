
import React from 'react';
import { Shield, Eye, Lock, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Privacy = () => {
  const privacyPrinciples = [
    {
      icon: <Shield className="w-8 h-8 text-ura-green" />,
      title: 'Data Protection',
      description: 'We use industry-standard encryption to protect your personal information.'
    },
    {
      icon: <Eye className="w-8 h-8 text-ura-green" />,
      title: 'Transparency',
      description: 'We are clear about what data we collect and how we use it.'
    },
    {
      icon: <Lock className="w-8 h-8 text-ura-green" />,
      title: 'Security First',
      description: 'Your data is stored securely and accessed only when necessary.'
    },
    {
      icon: <Users className="w-8 h-8 text-ura-green" />,
      title: 'User Control',
      description: 'You have full control over your data and privacy settings.'
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
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Your privacy is important to us. Learn how we protect and handle your data.
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated: January 15, 2025
            </p>
          </div>
        </section>

        {/* Privacy Principles */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Privacy Principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {privacyPrinciples.map((principle, index) => (
                <Card key={index} className="text-center hover-lift">
                  <CardHeader>
                    <div className="mx-auto mb-4">
                      {principle.icon}
                    </div>
                    <CardTitle className="text-xl">{principle.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{principle.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <section className="py-16 px-4 bg-card/50">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-bold text-ura-green mb-6">Information We Collect</h2>
              <p className="text-muted-foreground mb-6">
                We collect information to provide better services to our users. The types of information we collect include:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-8 space-y-2">
                <li>Account information (email, name, preferences)</li>
                <li>Usage data (articles read, time spent, interactions)</li>
                <li>Device information (browser type, IP address, location)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h2 className="text-2xl font-bold text-ura-green mb-6">How We Use Your Information</h2>
              <p className="text-muted-foreground mb-6">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-8 space-y-2">
                <li>Provide and improve our services</li>
                <li>Personalize your news experience</li>
                <li>Send you relevant updates and notifications</li>
                <li>Analyze usage patterns to enhance our AI algorithms</li>
                <li>Ensure security and prevent fraud</li>
              </ul>

              <h2 className="text-2xl font-bold text-ura-green mb-6">Data Sharing and Disclosure</h2>
              <p className="text-muted-foreground mb-6">
                We do not sell your personal information. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-8 space-y-2">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
                <li>With trusted service providers who assist us</li>
              </ul>

              <h2 className="text-2xl font-bold text-ura-green mb-6">Your Rights and Choices</h2>
              <p className="text-muted-foreground mb-6">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-8 space-y-2">
                <li>Access and update your personal information</li>
                <li>Delete your account and associated data</li>
                <li>Opt out of marketing communications</li>
                <li>Control cookie preferences</li>
                <li>Request a copy of your data</li>
              </ul>

              <h2 className="text-2xl font-bold text-ura-green mb-6">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at privacy@ura.com or through our contact form.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
