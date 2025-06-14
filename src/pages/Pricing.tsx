
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PricingHero from '@/components/pricing/PricingHero';
import PricingPlans from '@/components/pricing/PricingPlans';
import PricingFAQ from '@/components/pricing/PricingFAQ';
import PricingCTA from '@/components/pricing/PricingCTA';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Pricing = () => {
  useScrollAnimation();

  return (
    <div className="min-h-screen bg-pulsee-black">
      <Header />
      <main className="pt-20">
        <div className="scroll-scale-in">
          <PricingHero />
        </div>
        <div className="scroll-fade-in">
          <PricingPlans />
        </div>
        <div className="scroll-slide-left">
          <PricingFAQ />
        </div>
        <div className="scroll-slide-right">
          <PricingCTA />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
