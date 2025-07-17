
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

interface UseNewsDataProps {
  page?: number;
  category?: string;
}

export const useNewsData = ({ page = 1, category = 'all' }: UseNewsDataProps = {}) => {
  const [currentPage, setCurrentPage] = useState(page);
  const articlesPerPage = 20;
  const offset = (currentPage - 1) * articlesPerPage;

  const query = useQuery({
    queryKey: ['news-articles', currentPage, category],
    queryFn: async () => {
      let query = supabase
        .from('news_articles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + articlesPerPage - 1);

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error, count } = await query;

      if (error) throw error;
      return { articles: data || [], totalCount: count || 0 };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  });

  const totalPages = Math.ceil((query.data?.totalCount || 0) / articlesPerPage);
  const hasMore = currentPage < totalPages;
  const hasPrevious = currentPage > 1;

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (hasMore) setCurrentPage(prev => prev + 1);
  };

  const goToPreviousPage = () => {
    if (hasPrevious) setCurrentPage(prev => prev - 1);
  };

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  return {
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
  };
};
