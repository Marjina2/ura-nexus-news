
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TopStories from '@/components/TopStories';
import CreatorCTA from '@/components/CreatorCTA';
import Footer from '@/components/Footer';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Index = () => {
  useScrollAnimation();

  return (
    <div className="min-h-screen bg-pulsee-black">
      <Header />
      <main>
        <Hero />
        <div className="scroll-fade-in">
          <TopStories />
        </div>
        <div className="scroll-slide-left">
          <CreatorCTA />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
