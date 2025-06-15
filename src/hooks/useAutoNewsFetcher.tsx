
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaginatedArticlesResult {
  articles: any[];
  totalCount: number;
  hasMore: boolean;
}

export const useAutoNewsFetcher = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const articlesPerPage = 10;

  // Fetch articles with pagination
  const { data, isLoading, error } = useQuery({
    queryKey: ['paginated-news', currentPage],
    queryFn: async (): Promise<PaginatedArticlesResult> => {
      const offset = (currentPage - 1) * articlesPerPage;
      
      const { data, error, count } = await supabase
        .from('news_articles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + articlesPerPage - 1);

      if (error) throw error;
      
      return {
        articles: data || [],
        totalCount: count || 0,
        hasMore: (count || 0) > offset + articlesPerPage
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Auto-fetch new articles every 20 minutes
  const fetchNewArticles = useCallback(async () => {
    try {
      console.log('Auto-fetching new articles...');
      
      const { data, error } = await supabase.functions.invoke('auto-publish-gnews');
      
      if (error) {
        console.error('Error auto-fetching articles:', error);
        return;
      }

      console.log('New articles fetched:', data);
      
      // Invalidate and refetch the current query to show new articles
      queryClient.invalidateQueries({ queryKey: ['paginated-news'] });
      
      // Reset to first page if not already there to show new articles
      if (currentPage !== 1) {
        setCurrentPage(1);
      }
      
      if (data?.saved > 0) {
        toast.success(`${data.saved} new articles loaded!`);
      }
    } catch (error) {
      console.error('Error in auto-fetch:', error);
    }
  }, [queryClient, currentPage]);

  // Set up auto-fetch interval (20 minutes)
  useEffect(() => {
    // Initial fetch on mount
    fetchNewArticles();
    
    // Set up interval for every 20 minutes
    const interval = setInterval(fetchNewArticles, 20 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchNewArticles]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (data?.hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return {
    articles: data?.articles || [],
    totalCount: data?.totalCount || 0,
    hasMore: data?.hasMore || false,
    currentPage,
    articlesPerPage,
    isLoading,
    error,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    fetchNewArticles
  };
};
