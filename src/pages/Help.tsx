
import React from 'react';
import { HelpCircle, Search, Book, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Help = () => {
  const faqs = [
    {
      question: 'How do I get started with URA?',
      answer: 'Simply sign up for a free account and start exploring our AI-curated news content. You can upgrade to Pro for additional features.'
    },
    {
      question: 'What makes URA different from other news platforms?',
      answer: 'URA uses advanced AI to curate and enhance news content, providing deeper insights and personalized recommendations.'
    },
    {
      question: 'Can I use URA content for commercial purposes?',
      answer: 'Yes, with our Pro plan you get content reuse licenses. For extensive commercial use, consider our Enterprise plan.'
    },
    {
      question: 'How accurate is the AI curation?',
      answer: 'Our AI has a 95%+ accuracy rate and continuously improves based on user feedback and engagement patterns.'
    },
    {
      question: 'Do you offer API access?',
      answer: 'Yes, API access is available with our Enterprise plan. Contact our sales team for more information.'
    }
  ];

  const helpCategories = [
    {
      icon: <Book className="w-8 h-8 text-ura-green" />,
      title: 'Getting Started',
      description: 'Learn the basics of using URA'
    },
    {
      icon: <HelpCircle className="w-8 h-8 text-ura-green" />,
      title: 'Account & Billing',
      description: 'Manage your account and subscription'
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-ura-green" />,
      title: 'API Documentation',
      description: 'Technical documentation for developers'
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
              Help Center
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find answers to your questions and get support
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search for help..."
                    className="pl-10 py-3 bg-background border-border focus:border-ura-green"
                  />
                </div>
                <Button className="bg-ura-green text-ura-black hover:bg-ura-green-hover px-6">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Help Categories */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {helpCategories.map((category, index) => (
                <Card key={index} className="text-center hover-lift cursor-pointer">
                  <CardHeader>
                    <div className="mx-auto mb-4">
                      {category.icon}
                    </div>
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{category.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-card/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-ura-green mb-3">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
              Still Need Help?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Our support team is here to help you with any questions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-ura-green text-ura-black hover:bg-ura-green-hover px-8 py-3 text-lg">
                Contact Support
              </Button>
              <Button variant="outline" className="border-ura-green text-ura-green hover:bg-ura-green hover:text-ura-black px-8 py-3 text-lg">
                Live Chat
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Help;
