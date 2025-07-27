
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { NewsArticleData } from '@/types/news';

interface PaginatedArticlesResult {
  articles: NewsArticleData[];
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
      if (selectedCategory !== lastCategory) {
        setCurrentPage(1);
        setLastCategory(selectedCategory);
      }

      // Fetch more articles than needed to account for duplicates
      const fetchSize = articlesPerPage * 3; // Fetch 3x to ensure we have enough unique articles
      const offset = (currentPage - 1) * articlesPerPage;

      // First, get total count for pagination
      let countBuilder = supabase
        .from('news_articles')
        .select('*', { count: 'exact', head: true });

      if (selectedCategory && selectedCategory !== 'all') {
        // Note: we'll need to add category column to news_articles table for this to work
        console.log('Category filtering not yet implemented in database schema');
      }

      const { count: totalCount } = await countBuilder;

      // Now fetch articles with larger batch to handle deduplication
      let builder = supabase
        .from('news_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedCategory && selectedCategory !== 'all') {
        console.log('Category filtering not yet implemented in database schema');
      }

      // Fetch from the beginning up to current position + extra for deduplication
      const maxFetch = offset + fetchSize;
      const { data: articles, error } = await builder.range(0, maxFetch - 1);

      if (error) throw error;

      // Global deduplication by source_url and title
      const uniqueArticles: NewsArticleData[] = [];
      const seenUrls = new Set<string>();
      const seenTitles = new Set<string>();
      
      (articles || []).forEach((article) => {
        const url = article.source_url;
        const title = (article.rephrased_title || article.original_title || '').toLowerCase().trim();
        
        // Skip if we've seen this URL or title before
        if (url && seenUrls.has(url)) return;
        if (title && seenTitles.has(title)) return;
        
        // Add to seen sets
        if (url) seenUrls.add(url);
        if (title) seenTitles.add(title);
        
        uniqueArticles.push(article);
      });

      // Now paginate the unique articles
      const startIndex = offset;
      const endIndex = startIndex + articlesPerPage;
      const paginatedArticles = uniqueArticles.slice(startIndex, endIndex);

      return {
        articles: paginatedArticles,
        totalCount: totalCount || 0,
        hasMore: endIndex < uniqueArticles.length || uniqueArticles.length === maxFetch,
      };
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Auto-fetch new articles every 20 minutes
  const fetchNewArticles = useCallback(async () => {
    try {
      console.log('Auto-fetching new articles...');
      const { data: result, error } = await supabase.functions.invoke('auto-publish-gnews');

      if (error) {
        console.error('Error auto-fetching articles:', error);
        return;
      }

      console.log('New articles fetched:', result);
      queryClient.invalidateQueries({ queryKey: ['paginated-news'] });

      if (currentPage !== 1) setCurrentPage(1);

      if (result?.saved > 0) {
        toast.success(`${result.saved} new articles loaded!`);
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
