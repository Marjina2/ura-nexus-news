
import React from 'react';
import { useUser } from '@clerk/clerk-react';
import PricingCard from './PricingCard';

const PricingPlans = () => {
  const { isSignedIn } = useUser();

  const plans = [
    {
      title: "Free",
      price: "$0",
      period: "month",
      description: "Perfect for getting started",
      features: [
        "Access to basic news feed",
        "Up to 10 bookmarks",
        "Basic search functionality",
        "Mobile app access"
      ],
      buttonText: isSignedIn ? "Current Plan" : "Get Started",
      buttonVariant: "outline" as const
    },
    {
      title: "Pro",
      price: "$9.99",
      period: "month",
      description: "Best for regular news consumers",
      features: [
        "Unlimited news access",
        "AI-powered personalization",
        "Unlimited bookmarks",
        "Advanced search & filters",
        "Priority customer support",
        "Export articles",
        "Dark mode"
      ],
      popular: true,
      buttonText: "Upgrade to Pro",
      buttonVariant: "default" as const
    },
    {
      title: "Enterprise",
      price: "$29.99",
      period: "month",
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Team collaboration tools",
        "API access",
        "Custom integrations",
        "Advanced analytics",
        "Dedicated account manager",
        "SSO support"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const
    }
  ];

  return (
    <section className="py-16 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan for your news consumption needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
