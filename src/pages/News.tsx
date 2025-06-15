
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SpotlightSection from '@/components/SpotlightSection';
import NewsHeader from '@/components/news/NewsHeader';
import CategoryFilters from '@/components/news/CategoryFilters';
import NewsStats from '@/components/news/NewsStats';
import NewsLoadingGrid from '@/components/news/NewsLoadingGrid';
import NewsErrorState from '@/components/news/NewsErrorState';
import NewsEmptyState from '@/components/news/NewsEmptyState';
import LoginPrompt from '@/components/news/LoginPrompt';
import NewsGrid from '@/components/news/NewsGrid';
import NewsPagination from '@/components/news/NewsPagination';
import { useAutoNewsFetcher } from '@/hooks/useAutoNewsFetcher';
import { NewsArticleData } from '@/types/news';
import { useAuth } from '@/contexts/AuthContext';

const categories = ['all', 'general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];

const News: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const {
    articles,
    totalCount,
    hasMore,
    currentPage,
    articlesPerPage,
    isLoading,
    error,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    fetchNewArticles,
  } = useAutoNewsFetcher(selectedCategory);

  const handleArticleClick = (article: NewsArticleData) => {
    if (!user) {
      navigate('/auth?redirect=' + encodeURIComponent(`/article?data=${encodeURIComponent(JSON.stringify({
        ...article,
        url: article.source_url || '#',
        source: { name: 'URA News' }
      }))}`));
      return;
    }
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

  const totalPages = Math.ceil(totalCount / articlesPerPage);

  return (
    <div className="min-h-screen bg-ura-black flex flex-col">
      <Header />
      <main className="pt-28 pb-12 flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsHeader onBack={() => navigate('/')} />
          
          <SpotlightSection />

          <CategoryFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <NewsStats
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            onRefresh={fetchNewArticles}
          />

          {isLoading ? (
            <NewsLoadingGrid />
          ) : error ? (
            <NewsErrorState error={error} onRetry={fetchNewArticles} />
          ) : !articles || articles.length === 0 ? (
            <NewsEmptyState />
          ) : (
            <>
              {!user && <LoginPrompt />}
              
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
