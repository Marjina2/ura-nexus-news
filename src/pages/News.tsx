
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsFeed from '@/components/NewsFeed';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { NewsArticle, useNews } from '@/hooks/useNews';

const News = () => {
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
      <main className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Home */}
          <Button 
            onClick={() => navigate('/')} 
            variant="ghost" 
            className="mb-6 text-ura-white hover:text-ura-green"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-ura-white mb-4">
              Latest News
            </h1>
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
      </main>
      <Footer />
    </div>
  );
};

export default News;
