
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TrendingCarousel from '@/components/TrendingCarousel';
import TopStories from '@/components/TopStories';
import AIPicksSection from '@/components/AIPicksSection';
import CreatorCTA from '@/components/CreatorCTA';
import Footer from '@/components/Footer';
import NewsFeed from '@/components/NewsFeed';
import { Button } from '@/components/ui/button';
import { NewsArticle, useNews } from '@/hooks/useNews';

const Index = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('general');
  const { categories } = useNews();

  const handleArticleRead = (article: NewsArticle) => {
    const articleData = encodeURIComponent(JSON.stringify(article));
    navigate(`/article?data=${articleData}`);
  };

  return (
    <div className="min-h-screen bg-ura-black">
      <Header />
      <main>
        <Hero />
        <TrendingCarousel />
        
        {/* News Categories Section */}
        <section className="py-16 bg-ura-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-ura-white mb-4">
                Latest News
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Stay updated with AI-enhanced news from trusted sources across various categories
              </p>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={
                    selectedCategory === category
                      ? "bg-ura-green text-ura-black hover:bg-ura-green-hover"
                      : "border-ura-green/30 hover:border-ura-green text-ura-white"
                  }
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>

            {/* News Feed */}
            <NewsFeed 
              category={selectedCategory}
              onArticleRead={handleArticleRead}
            />
          </div>
        </section>

        <TopStories />
        <AIPicksSection />
        <CreatorCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
