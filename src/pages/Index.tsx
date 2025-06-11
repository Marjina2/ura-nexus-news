
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TrendingCarousel from '@/components/TrendingCarousel';
import TopStories from '@/components/TopStories';
import AIPicksSection from '@/components/AIPicksSection';
import CreatorCTA from '@/components/CreatorCTA';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-ura-black">
      <Header />
      <main>
        <Hero />
        <TrendingCarousel />
        <TopStories />
        <AIPicksSection />
        <CreatorCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
