
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsFeed from '@/components/NewsFeed';
import SpotlightSection from '@/components/SpotlightSection';
import AINewsSection from '@/components/AINewsSection';
import NewsFilters from '@/components/news/NewsFilters';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { NewsArticle, useNews } from '@/hooks/useNews';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import RephrasedNewsFeed from '@/components/RephrasedNewsFeed'; // <-- FIXED: Import added

const News = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('general');
  const selectedCountry = 'in'; // Fixed to India
  const { categories } = useNews(selectedCategory, selectedCountry);
  useScrollAnimation();

  const handleArticleRead = (article: NewsArticle) => {
    const articleData = encodeURIComponent(JSON.stringify(article));
    navigate(`/article?data=${articleData}`);
  };

  return (
    <div className="min-h-screen bg-pulsee-black">
      <Header />
      <main className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Home */}
          <Button 
            onClick={() => navigate('/')} 
            variant="ghost" 
            className="scroll-fade-in mb-6 text-pulsee-white hover:text-pulsee-green"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          {/* Page Header */}
          <div className="scroll-scale-in text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-pulsee-white mb-4">
              Latest Fresh News
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Stay updated with fresh, unique news powered by our top AI models from trusted sources across various categories
            </p>
          </div>

          {/* Filters */}
          <NewsFilters
            selectedCategory={selectedCategory}
            categories={categories}
            onCategoryChange={setSelectedCategory}
          />

          {/* AI News Section */}
          <div className="scroll-slide-left">
            <AINewsSection 
              category={selectedCategory}
              country={selectedCountry}
            />
          </div>

          {/* Rephrased News Section */}
          <div className="scroll-slide-right">
            <RephrasedNewsFeed />
          </div>

          {/* Today's Spotlight Section */}
          <div className="scroll-slide-right">
            <SpotlightSection />
          </div>

          {/* News Feed */}
          <div className="scroll-fade-in">
            <NewsFeed 
              category={selectedCategory}
              country={selectedCountry}
              onArticleRead={handleArticleRead}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default News;
