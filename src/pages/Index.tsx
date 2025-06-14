
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CreatorCTA from '@/components/CreatorCTA';
import PricingHero from '@/components/pricing/PricingHero';
import TopStories from '@/components/TopStories';
import AIPicksSection from '@/components/AIPicksSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-ura-black">
      <Header />
      <main>
        <Hero />
        <CreatorCTA />
        <PricingHero />
        <TopStories />
        <AIPicksSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
