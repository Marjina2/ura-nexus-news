
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CreatorCTA from '@/components/CreatorCTA';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-ura-black">
      <Header />
      <main>
        <Hero />
        <CreatorCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
