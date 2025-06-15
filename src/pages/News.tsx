
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsHeader from '@/components/news/NewsHeader';
import CategoryFilters from '@/components/news/CategoryFilters';
import NewsGrid from '@/components/news/NewsGrid';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useNewsData } from '@/hooks/useNewsData';
import { NewsArticleData } from '@/types/news';

const categories = ['all', 'general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];

const News = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: newsArticles, isLoading, error } = useNewsData();

  const handleBack = () => {
    navigate('/');
  };

  const handleArticleClick = (article: NewsArticleData) => {
    const articleData = encodeURIComponent(JSON.stringify({
      ...article,
      url: article.source_url || '#',
      source: { name: 'URA News' }
    }));
    navigate(`/article?data=${articleData}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ProtectedRoute requireVerification={true}>
      <div className="min-h-screen bg-ura-black">
        <Header />
        
        <main className="pt-32 pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <NewsHeader onBack={handleBack} />
            
            <CategoryFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="bg-card border-border overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">Error loading news articles: {error.message}</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </div>
            ) : !newsArticles || newsArticles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No news articles found for this category.</p>
              </div>
            ) : (
              <NewsGrid
                articles={newsArticles}
                onArticleClick={handleArticleClick}
                formatDate={formatDate}
              />
            )}
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default News;
