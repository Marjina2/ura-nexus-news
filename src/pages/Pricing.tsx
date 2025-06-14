
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PricingHero from '@/components/pricing/PricingHero';
import PricingPlans from '@/components/pricing/PricingPlans';
import PricingFAQ from '@/components/pricing/PricingFAQ';
import PricingCTA from '@/components/pricing/PricingCTA';

const Pricing = () => {
  return (
    <div className="min-h-screen bg-ura-black">
      <Header />
      
      <main className="pt-24">
        <PricingHero />
        <PricingPlans />
        <PricingFAQ />
        <PricingCTA />
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
