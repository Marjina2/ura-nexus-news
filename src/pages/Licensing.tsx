
import React from 'react';
import { FileText, Shield, Download, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Licensing = () => {
  const licenses = [
    {
      name: 'Attribution License',
      description: 'Use our content with proper attribution',
      icon: <FileText className="w-8 h-8 text-ura-green" />,
      features: ['Require attribution', 'Commercial use allowed', 'Modification allowed', 'Distribution allowed']
    },
    {
      name: 'Commercial License',
      description: 'Full commercial rights without attribution',
      icon: <Shield className="w-8 h-8 text-ura-green" />,
      features: ['No attribution required', 'Commercial use allowed', 'Modification allowed', 'Exclusive usage rights']
    },
    {
      name: 'Educational License',
      description: 'Special rates for educational institutions',
      icon: <Users className="w-8 h-8 text-ura-green" />,
      features: ['Educational use only', 'Bulk licensing available', 'Special pricing', 'Curriculum integration']
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
              Content Licensing
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Flexible licensing options for creators, businesses, and educators
            </p>
          </div>
        </section>

        {/* Licensing Options */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {licenses.map((license, index) => (
                <Card key={index} className="hover-lift">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4">
                      {license.icon}
                    </div>
                    <CardTitle className="text-xl">{license.name}</CardTitle>
                    <CardDescription>{license.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {license.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-ura-green rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full bg-ura-green text-ura-black hover:bg-ura-green-hover">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4 bg-card/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">How Licensing Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-ura-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-ura-green">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Choose License</h3>
                <p className="text-muted-foreground">Select the licensing option that fits your needs</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-ura-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-ura-green">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Purchase License</h3>
                <p className="text-muted-foreground">Complete the licensing agreement and payment</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-ura-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-ura-green">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Use Content</h3>
                <p className="text-muted-foreground">Download and use the content according to your license</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
              Ready to License Our Content?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Get started with flexible licensing options that work for your business
            </p>
            <Button className="bg-ura-green text-ura-black hover:bg-ura-green-hover px-8 py-3 text-lg">
              Contact Sales
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Licensing;
