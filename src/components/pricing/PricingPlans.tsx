
import React from 'react';
import { Crown, Star, Building } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import PricingCard from './PricingCard';

const PricingPlans = () => {
  const { user } = useUser();
  const isPro = user?.publicMetadata?.subscription === 'pro';

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

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
