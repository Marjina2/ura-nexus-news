
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TopStories from '@/components/TopStories';
import CreatorCTA from '@/components/CreatorCTA';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-pulsee-black">
      <Header />
      <main>
        <Hero />
        <TopStories />
        <CreatorCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
