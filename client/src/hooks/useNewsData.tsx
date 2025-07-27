
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useState, useEffect, useMemo, useCallback } from 'react';

interface UseNewsDataProps {
  page?: number;
  category?: string;
}

export const useNewsData = ({ page = 1, category = 'all' }: UseNewsDataProps = {}) => {
  const [currentPage, setCurrentPage] = useState(page);
  const articlesPerPage = 21;
  const offset = (currentPage - 1) * articlesPerPage;

  const queryFn = useCallback(async () => {
    try {
      const articles = await apiClient.getNewsArticles(
        articlesPerPage,
        category === 'all' ? undefined : category
      );
      
      // For pagination, we'll approximate total count based on what we get
      const totalCount = articles.length === articlesPerPage ? 
        (currentPage * articlesPerPage) + 1 : 
        (currentPage - 1) * articlesPerPage + articles.length;
        
      return { articles: articles || [], totalCount };
    } catch (error) {
      console.error('Error fetching news data:', error);
      return { articles: [], totalCount: 0 };
    }
  }, [offset, articlesPerPage, category, currentPage]);

  const query = useQuery({
    queryKey: ['news-articles', currentPage, category],
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false,
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  });

  const totalPages = useMemo(() => 
    Math.ceil((query.data?.totalCount || 0) / articlesPerPage), 
    [query.data?.totalCount, articlesPerPage]
  );
  
  const hasMore = useMemo(() => currentPage < totalPages, [currentPage, totalPages]);
  const hasPrevious = useMemo(() => currentPage > 1, [currentPage]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const goToNextPage = useCallback(() => {
    if (hasMore) setCurrentPage(prev => prev + 1);
  }, [hasMore]);

  const goToPreviousPage = useCallback(() => {
    if (hasPrevious) setCurrentPage(prev => prev - 1);
  }, [hasPrevious]);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  return useMemo(() => ({
    articles: query.data?.articles || [],
    totalCount: query.data?.totalCount || 0,
    currentPage,
    totalPages,
    hasMore,
    hasPrevious,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  }), [
    query.data?.articles,
    query.data?.totalCount,
    currentPage,
    totalPages,
    hasMore,
    hasPrevious,
    query.isLoading,
    query.error,
    query.refetch,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  ]);
};
