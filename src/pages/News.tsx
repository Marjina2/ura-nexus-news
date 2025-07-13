
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
import { useNewsOperations } from '@/hooks/useNewsOperations';

const News = () => {
  const { isSignedIn, isLoaded } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const {
    articles,
    loading,
    error,
    totalPages,
    refreshNews,
    handleCategoryChange,
    handleSearch
  } = useNewsOperations({
    category: selectedCategory,
    page: currentPage,
    searchQuery
  });

  useEffect(() => {
    handleCategoryChange(selectedCategory);
  }, [selectedCategory, handleCategoryChange]);

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  }, [searchQuery, handleSearch]);

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-ura-black">
      <Header />
      
      <main className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsHeader onBack={handleBack} />
          
          <NewsFilters
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onRefresh={refreshNews}
          />

          {loading && <NewsLoadingGrid />}
          
          {error && (
            <NewsErrorState 
              error={error} 
              onRetry={refreshNews} 
            />
          )}
          
          {!loading && !error && articles.length === 0 && (
            <NewsEmptyState 
              searchQuery={searchQuery}
              category={selectedCategory}
            />
          )}
          
          {!loading && !error && articles.length > 0 && (
            <NewsGrid
              articles={articles}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default News;
