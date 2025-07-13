
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsHeader from '@/components/news/NewsHeader';
import NewsFilters from '@/components/news/NewsFilters';
import NewsGrid from '@/components/news/NewsGrid';
import NewsLoadingGrid from '@/components/news/NewsLoadingGrid';
import NewsErrorState from '@/components/news/NewsErrorState';
import NewsEmptyState from '@/components/news/NewsEmptyState';
import { useAutoNewsFetcher } from '@/hooks/useAutoNewsFetcher';
import { formatDistanceToNow } from 'date-fns';

const News = () => {
  const { isSignedIn, isLoaded } = useUser();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const {
    articles,
    isLoading,
    error,
    currentPage,
    totalCount,
    hasMore,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    fetchNewArticles,
    refetch
  } = useAutoNewsFetcher(selectedCategory);

  const categories = ['all', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];

  useEffect(() => {
    // Auto-refetch when category changes
    if (selectedCategory) {
      refetch();
    }
  }, [selectedCategory, refetch]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-ura-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ura-green mx-auto mb-4"></div>
        <div className="text-ura-white">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/auth?redirect=/news" replace />;
  }

  const handleBack = () => {
    window.history.back();
  };

  const handleArticleClick = (article: any) => {
    const articleData = encodeURIComponent(JSON.stringify(article));
    window.location.href = `/article?data=${articleData}`;
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const totalPages = Math.ceil(totalCount / 10);

  return (
    <div className="min-h-screen bg-ura-black">
      <Header />
      
      <main className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsHeader onBack={handleBack} />
          
          <NewsFilters
            selectedCategory={selectedCategory}
            categories={categories}
            onCategoryChange={setSelectedCategory}
          />

          {isLoading && <NewsLoadingGrid />}
          
          {error && (
            <NewsErrorState 
              error={error.message || 'An error occurred'} 
              onRetry={fetchNewArticles} 
            />
          )}
          
          {!isLoading && !error && articles.length === 0 && (
            <NewsEmptyState 
              category={selectedCategory}
            />
          )}
          
          {!isLoading && !error && articles.length > 0 && (
            <NewsGrid
              articles={articles}
              onArticleClick={handleArticleClick}
              formatDate={formatDate}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default News;
