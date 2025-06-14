
import React from 'react';
import { Check } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  current: boolean;
  buttonText: string;
  popular: boolean;
  comingSoon?: boolean;
}

interface PricingCardProps {
  plan: PricingPlan;
}

const PricingCard = ({ plan }: PricingCardProps) => {
  return (
    <Card className={`relative ${plan.popular ? 'border-ura-green shadow-2xl scale-105' : 'border-border'} hover-lift`}>
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
        <SignedOut>
          <SignInButton mode="modal">
            <Button 
              className={`w-full ${plan.popular ? 'bg-ura-green text-ura-black hover:bg-ura-green-hover' : ''}`}
              variant={plan.popular ? 'default' : 'outline'}
              disabled={plan.comingSoon}
            >
              {plan.comingSoon ? plan.buttonText : 'Get Started'}
            </Button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <Button 
            className={`w-full ${plan.popular ? 'bg-ura-green text-ura-black hover:bg-ura-green-hover' : ''}`}
            variant={plan.current ? 'secondary' : plan.popular ? 'default' : 'outline'}
            disabled={plan.current || plan.comingSoon}
          >
            {plan.buttonText}
          </Button>
        </SignedIn>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
