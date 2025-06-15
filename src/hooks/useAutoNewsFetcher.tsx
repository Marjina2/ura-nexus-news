
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaginatedArticlesResult {
  articles: any[];
  totalCount: number;
  hasMore: boolean;
}

export const useAutoNewsFetcher = (selectedCategory: string = 'all') => {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const articlesPerPage = 10;
  const [lastCategory, setLastCategory] = useState(selectedCategory);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['paginated-news', currentPage, selectedCategory],
    queryFn: async (): Promise<PaginatedArticlesResult> => {
      if (selectedCategory !== lastCategory) setCurrentPage(1);
      // Backend now fetches per category every time, but we filter client side as well
      const offset = (currentPage - 1) * articlesPerPage;

      let builder = supabase
        .from('news_articles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (selectedCategory && selectedCategory !== 'all') {
        builder = builder.eq('category', selectedCategory);
      }

      const { data, error, count } = await builder.range(offset, offset + articlesPerPage - 1);

      if (error) throw error;

      // Deduplicate by source_url
      const uniqueArticles: any[] = [];
      const seen = new Set();
      (data || []).forEach((art) => {
        const url = art.source_url || art.url;
        if (url && !seen.has(url)) {
          seen.add(url);
          uniqueArticles.push(art);
        }
      });

      return {
        articles: uniqueArticles,
        totalCount: count || 0,
        hasMore: (count || 0) > offset + articlesPerPage,
      };
    },
    staleTime: 5 * 60 * 1000,
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
      queryClient.invalidateQueries({ queryKey: ['paginated-news'] });

      if (currentPage !== 1) setCurrentPage(1);

      if (data?.saved > 0) {
        toast.success(`${data.saved} new articles loaded!`);
      }
    } catch (error) {
      console.error('Error in auto-fetch:', error);
    }
  }, [queryClient, currentPage]);

  useEffect(() => {
    fetchNewArticles();
    const interval = setInterval(fetchNewArticles, 20 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchNewArticles]);

  const goToPage = (page: number) => setCurrentPage(page);
  const goToNextPage = () => { if (data?.hasMore) setCurrentPage(prev => prev + 1); };
  const goToPreviousPage = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1); };

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
    fetchNewArticles,
    refetch,
  };
};
