import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: { name: string };
  content: string;
  isAI?: boolean;
  isSERP?: boolean;
  image_url?: string;
  published_at?: string;
  tags?: string[];
}

export interface AIGeneratedArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  country: string;
  image_url: string;
  published_at: string;
  tags: string[];
  is_active: boolean;
  created_at: string;
}

export const useNews = (category: string = 'general', country: string = 'in') => {
  const categories = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];
  
  const { data: articles, isLoading, error, refetch } = useQuery({
    queryKey: ['news', category, country],
    queryFn: async () => {
      console.log('Fetching news for category:', category, 'country:', country);
      
      const { data, error } = await supabase.functions.invoke('fetch-news', {
        body: { category, country }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('News data received:', data);
      return data?.articles || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });

  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadMore = async () => {
    // Simulate loading more articles
    setPage(prev => prev + 1);
    if (page >= 3) {
      setHasMore(false);
    }
  };

  return {
    articles: articles || [],
    isLoading,
    error,
    loadMore,
    hasMore,
    categories,
    refetch
  };
};

export const useAIGeneratedArticles = (category: string, country: string) => {
  const [aiArticles, setAiArticles] = useState<AIGeneratedArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateArticles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-news', {
        body: { category, country, count: 5 }
      });

      if (error) throw error;

      setAiArticles(data?.articles || []);
    } catch (error) {
      console.error('Error generating AI articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch existing AI articles
  const { data: existingArticles } = useQuery({
    queryKey: ['ai-articles', category, country],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_generated_articles')
        .select('*')
        .eq('category', category)
        .eq('country', country)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as AIGeneratedArticle[];
    },
  });

  useEffect(() => {
    if (existingArticles) {
      setAiArticles(existingArticles);
    }
  }, [existingArticles]);

  return {
    aiArticles,
    isLoading,
    generateArticles
  };
};
