
import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';

const PricingCTA = () => {
  const { isSignedIn } = useUser();

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
          Ready to Get Started?
        </h2>
        <p className="text-xl text-muted-foreground mb-8">
          Join thousands of users who trust Pulsee for their daily news
        </p>
        {!isSignedIn ? (
          <Button 
            className="bg-pulsee-green text-pulsee-black hover:bg-pulsee-green-hover px-8 py-3 text-lg"
            onClick={() => window.location.href = '/auth'}
          >
            Start Your Free Trial
          </Button>
        ) : (
          <Button 
            className="bg-pulsee-green text-pulsee-black hover:bg-pulsee-green-hover px-8 py-3 text-lg"
            onClick={() => window.location.href = '/dashboard'}
          >
            Go to Dashboard
          </Button>
        )}
      </div>
    </section>
  );
};

export default PricingCTA;
