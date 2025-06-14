
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsFeed from '@/components/NewsFeed';
import SpotlightSection from '@/components/SpotlightSection';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Globe, Filter } from 'lucide-react';
import { NewsArticle, useNews } from '@/hooks/useNews';

const News = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [selectedCountry, setSelectedCountry] = useState('in');
  const { categories } = useNews(selectedCategory, selectedCountry);

  const countries = [
    { code: 'in', name: 'India' },
    { code: 'us', name: 'United States' },
    { code: 'gb', name: 'United Kingdom' },
    { code: 'au', name: 'Australia' },
    { code: 'ca', name: 'Canada' }
  ];

  const handleArticleRead = (article: NewsArticle) => {
    const articleData = encodeURIComponent(JSON.stringify(article));
    navigate(`/article?data=${articleData}`);
  };

  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
  };

  const handleCountryChange = (newCountry: string) => {
    setSelectedCountry(newCountry);
  };

  return (
    <div className="min-h-screen bg-plusee-black">
      <Header />
      <main className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Home */}
          <Button 
            onClick={() => navigate('/')} 
            variant="ghost" 
            className="mb-6 text-plusee-white hover:text-plusee-green"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          {/* Today's Spotlight Section */}
          <SpotlightSection />

          {/* Page Header */}
          <div className="text-center mb-8 mt-16">
            <h1 className="text-3xl md:text-5xl font-bold text-plusee-white mb-4">
              Latest Fresh News
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Stay updated with fresh, unique news powered by our top AI models from trusted sources across various categories
            </p>
          </div>

          {/* Filters */}
          <div className="bg-card/20 backdrop-blur-sm border border-border rounded-lg p-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Filter className="w-5 h-5 text-plusee-green" />
              <h3 className="text-lg font-semibold text-plusee-white">Filter News</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Country Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-plusee-white flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Country
                </label>
                <Select value={selectedCountry} onValueChange={handleCountryChange}>
                  <SelectTrigger className="bg-card border-border text-plusee-white">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-plusee-white">
                  Category
                </label>
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="bg-card border-border text-plusee-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Category Quick Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  className={
                    selectedCategory === category
                      ? "bg-plusee-green text-plusee-black hover:bg-plusee-green-hover"
                      : "border-plusee-green/30 hover:border-plusee-green text-plusee-white"
                  }
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* News Feed */}
          <NewsFeed 
            category={selectedCategory}
            country={selectedCountry}
            onArticleRead={handleArticleRead}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default News;
