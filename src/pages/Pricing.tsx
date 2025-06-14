
import React from 'react';
import { Crown, Star, Building, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

const Pricing = () => {
  const { user } = useAuth();
  const isPro = false; // For now, set to false since we don't have subscription logic

  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: '/month',
      description: 'Basic access for readers',
      icon: <Star className="w-6 h-6" />,
      features: [
        'Read up to 5 AI-enhanced articles/day',
        'Bookmark up to 20 articles',
        'Basic email newsletter',
        'Ads shown',
        'No PDF export',
        'No reuse rights',
        'No API access'
      ],
      current: !isPro,
      buttonText: 'Current Plan',
      popular: false
    },
    {
      name: 'Pro',
      price: '₹299',
      period: '/month',
      description: 'For content creators and professionals',
      icon: <Crown className="w-6 h-6" />,
      features: [
        'Unlimited article access',
        'PDF export and text download',
        'Content reuse license',
        'Watermark-free images',
        'No ads',
        'Creator tools dashboard',
        'Embed tool (simple version)',
        'Email support'
      ],
      current: isPro,
      buttonText: isPro ? 'Current Plan' : 'Upgrade to Pro',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For agencies, media companies, large-scale use',
      icon: <Building className="w-6 h-6" />,
      features: [
        'Higher content usage limits',
        'API access for automated workflows',
        'Real-time embeds',
        'Multi-user support',
        'Custom licensing agreements',
        'Dedicated support'
      ],
      current: false,
      buttonText: 'Coming Soon',
      popular: false,
      comingSoon: true
    }
  ];

  const faqs = [
    {
      question: 'Can I change my plan anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, UPI, and net banking for Indian customers.'
    },
    {
      question: 'Is there a free trial for Pro?',
      answer: 'Yes, new users get a 7-day free trial of Pro features when they sign up.'
    },
    {
      question: 'What happens if I exceed my article limit?',
      answer: 'Free users will see a prompt to upgrade. Pro users have unlimited access.'
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
              Choose Your Plan
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Select the perfect plan for your news consumption and content creation needs
            </p>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <Card key={plan.name} className={`relative ${plan.popular ? 'border-ura-green shadow-2xl scale-105' : 'border-border'} hover-lift`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-ura-green text-ura-black px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-card rounded-full w-fit">
                      {plan.icon}
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold">
                      {plan.price}
                      <span className="text-lg text-muted-foreground">{plan.period}</span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-ura-green mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter>
                    {!user ? (
                      <Button 
                        className={`w-full ${plan.popular ? 'bg-ura-green text-ura-black hover:bg-ura-green-hover' : ''}`}
                        variant={plan.popular ? 'default' : 'outline'}
                        disabled={plan.comingSoon}
                        onClick={() => window.location.href = '/auth'}
                      >
                        {plan.comingSoon ? plan.buttonText : 'Get Started'}
                      </Button>
                    ) : (
                      <Button 
                        className={`w-full ${plan.popular ? 'bg-ura-green text-ura-black hover:bg-ura-green-hover' : ''}`}
                        variant={plan.current ? 'secondary' : plan.popular ? 'default' : 'outline'}
                        disabled={plan.current || plan.comingSoon}
                      >
                        {plan.buttonText}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-card/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="text-lg font-semibold text-ura-green">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of users who trust URA for their daily news
            </p>
            {!user ? (
              <Button 
                className="bg-ura-green text-ura-black hover:bg-ura-green-hover px-8 py-3 text-lg"
                onClick={() => window.location.href = '/auth'}
              >
                Start Your Free Trial
              </Button>
            ) : (
              <Button 
                className="bg-ura-green text-ura-black hover:bg-ura-green-hover px-8 py-3 text-lg"
                onClick={() => window.location.href = '/dashboard'}
              >
                Go to Dashboard
              </Button>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
