
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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
  }, [offset, articlesPerPage, category]);

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
