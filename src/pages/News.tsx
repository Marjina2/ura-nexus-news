
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsHeader from '@/components/news/NewsHeader';
import NewsFilters from '@/components/news/NewsFilters';
import NewsGrid from '@/components/news/NewsGrid';
import NewsLoadingGrid from '@/components/news/NewsLoadingGrid';
import NewsErrorState from '@/components/news/NewsErrorState';
import NewsEmptyState from '@/components/news/NewsEmptyState';
import { useNewsData } from '@/hooks/useNewsData';
import NewsPagination from '@/components/news/NewsPagination';
import { formatDistanceToNow, format } from 'date-fns';
import { storeArticle } from '@/utils/articleStorage';

const News = () => {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const {
    articles,
    isLoading,
    error,
    currentPage,
    totalCount,
    totalPages,
    hasMore,
    hasPrevious,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    refetch
  } = useNewsData({ category: selectedCategory });

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
    try {
      const shortId = storeArticle(article);
      navigate(`/article/${shortId}`);
    } catch (error) {
      console.error('Failed to store article:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const timeAgo = formatDistanceToNow(date, { addSuffix: true });
    const fullDate = format(date, 'MMM dd, yyyy • h:mm a');
    return { timeAgo, fullDate };
  };

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
              error={error instanceof Error ? error.message : 'An error occurred'} 
              onRetry={() => refetch()} 
            />
          )}
          
          {!isLoading && !error && articles.length === 0 && (
            <NewsEmptyState 
              message={`No news articles found for ${selectedCategory === 'all' ? 'all categories' : selectedCategory}.`}
            />
          )}
          
          {!isLoading && !error && articles.length > 0 && (
            <>
              <NewsGrid
                articles={articles}
                onArticleClick={handleArticleClick}
                formatDate={formatDate}
              />
              
              <NewsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                hasMore={hasMore}
                onPreviousPage={goToPreviousPage}
                onNextPage={goToNextPage}
                onGoToPage={goToPage}
              />
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default News;
