
import React from 'react';
import { Check, X, Crown, Shield, Zap } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Pricing = () => {
  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: '/month',
      description: 'Basic access for readers',
      icon: <Shield className="w-6 h-6 text-ura-green" />,
      popular: false,
      features: [
        { text: 'Read up to 5 AI-enhanced articles/day', included: true },
        { text: 'Bookmark up to 20 articles', included: true },
        { text: 'Basic email newsletter', included: true },
        { text: 'PDF export', included: false },
        { text: 'Content reuse rights', included: false },
        { text: 'API access', included: false },
        { text: 'Ad-free experience', included: false },
      ],
      cta: 'Get Started Free',
      ctaVariant: 'outline' as const,
    },
    {
      name: 'Pro',
      price: '₹299',
      period: '/month',
      description: 'For content creators and professionals',
      icon: <Crown className="w-6 h-6 text-ura-green" />,
      popular: true,
      features: [
        { text: 'Unlimited article access', included: true },
        { text: 'PDF export and text download', included: true },
        { text: 'Content reuse license', included: true },
        { text: 'Watermark-free images', included: true },
        { text: 'Ad-free experience', included: true },
        { text: 'Creator tools dashboard', included: true },
        { text: 'Embed tool (simple version)', included: true },
        { text: 'Email support', included: true },
      ],
      cta: 'Upgrade to Pro',
      ctaVariant: 'default' as const,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For agencies, media companies, large-scale use',
      icon: <Zap className="w-6 h-6 text-ura-green" />,
      popular: false,
      comingSoon: true,
      features: [
        { text: 'Higher content usage limits', included: true },
        { text: 'API access for automated workflows', included: true },
        { text: 'Real-time embeds', included: true },
        { text: 'Multi-user support', included: true },
        { text: 'Custom licensing agreements', included: true },
        { text: 'Dedicated support', included: true },
      ],
      cta: 'Contact Sales',
      ctaVariant: 'outline' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-ura-black">
      <Header />
      
      <main className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Choose Your <span className="gradient-text">URA</span> Plan
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Unlock the power of AI-enhanced news with our flexible pricing plans designed for readers, creators, and enterprises.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-ura-green mr-2" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-ura-green mr-2" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-ura-green mr-2" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative glass-morphism border ${plan.popular ? 'border-ura-green' : 'border-border'} hover-lift`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-ura-green text-ura-black px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                {plan.comingSoon && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge variant="secondary" className="px-4 py-1">
                      Coming Soon
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className="flex justify-center mb-4">
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold text-ura-white">
                    {plan.name}
                  </CardTitle>
                  <div className="text-4xl font-bold text-ura-white mb-2">
                    {plan.price}
                    <span className="text-lg text-muted-foreground font-normal">
                      {plan.period}
                    </span>
                  </div>
                  <CardDescription className="text-muted-foreground">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-ura-green mr-3 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground mr-3 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${feature.included ? 'text-ura-white' : 'text-muted-foreground'}`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </CardContent>

                <CardFooter>
                  <SignedOut>
                    <SignInButton mode="modal">
                      <Button 
                        className="w-full" 
                        variant={plan.ctaVariant}
                        disabled={plan.comingSoon}
                      >
                        {plan.cta}
                      </Button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <Button 
                      className="w-full" 
                      variant={plan.ctaVariant}
                      disabled={plan.comingSoon}
                      onClick={() => {
                        if (plan.name === 'Enterprise') {
                          window.location.href = 'mailto:sales@ura.news';
                        } else if (plan.name === 'Pro') {
                          window.location.href = '/dashboard?upgrade=pro';
                        } else {
                          window.location.href = '/dashboard';
                        }
                      }}
                    >
                      {plan.cta}
                    </Button>
                  </SignedIn>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-ura-white">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-ura-white mb-2">
                    Can I cancel my subscription anytime?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-ura-white mb-2">
                    What payment methods do you accept?
                  </h3>
                  <p className="text-muted-foreground">
                    We accept all major credit cards, debit cards, and UPI payments through our secure payment processor.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-ura-white mb-2">
                    Is there a free trial for Pro plan?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes, we offer a 14-day free trial for the Pro plan. No credit card required to start.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-ura-white mb-2">
                    How does content licensing work?
                  </h3>
                  <p className="text-muted-foreground">
                    Pro users get rights to reuse our AI-enhanced content in their own publications with proper attribution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
