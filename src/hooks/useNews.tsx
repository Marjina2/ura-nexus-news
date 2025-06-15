
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

export interface EnhancedArticle extends NewsArticle {
  enhanced?: boolean;
  aiSummary?: string;
  original_title?: string;
  rephrased_title?: string;
  summary?: string;
  source_url?: string;
  created_at?: string;
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

export const useCachedArticles = () => {
  return useQuery({
    queryKey: ['cached-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cached_articles')
        .select('*')
        .order('cached_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useEnhanceArticle = () => {
  const [isLoading, setIsLoading] = useState(false);

  const enhanceArticle = async (article: NewsArticle): Promise<EnhancedArticle> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('enhance-article', {
        body: { article }
      });

      if (error) throw error;

      return {
        ...article,
        enhanced: true,
        aiSummary: data?.summary
      };
    } catch (error) {
      console.error('Error enhancing article:', error);
      return article;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    enhanceArticle,
    isLoading
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

  const { data: existingArticles } = useQuery({
    queryKey: ['ai-articles', category, country],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_generated_articles')
        .select(`
          id,
          title,
          content,
          summary,
          category,
          country,
          image_url,
          published_at,
          tags,
          created_at
        `)
        .eq('category', category)
        .eq('country', country)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      const mappedArticles = data?.map(article => {
        const mappedArticle: AIGeneratedArticle = {
          id: article.id,
          title: article.title,
          content: article.content,
          summary: article.summary || '',
          category: article.category,
          country: article.country,
          image_url: article.image_url || '',
          published_at: article.published_at || article.created_at,
          tags: article.tags || [],
          is_active: true,
          created_at: article.created_at
        };
        return mappedArticle;
      }) || [];

      return mappedArticles;
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
