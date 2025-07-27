import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

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
  full_content?: string;
}

export const useNews = (category: string = 'general', country: string = 'in') => {
  const categories = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];
  
  const { data: articles, isLoading, error, refetch } = useQuery({
    queryKey: ['news', category, country],
    queryFn: async () => {
      console.log('Fetching news for category:', category, 'country:', country);
      
      try {
        const data = await apiClient.getNewsArticles(50, category === 'all' ? undefined : category);
        console.log('News data received:', data);
        return data || [];
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
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
      try {
        return await apiClient.getCachedArticles(20);
      } catch (error) {
        console.error('Error fetching cached articles:', error);
        return [];
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useEnhanceArticle = () => {
  const [isLoading, setIsLoading] = useState(false);

  const enhanceArticle = async (article: any): Promise<EnhancedArticle> => {
    setIsLoading(true);
    try {
      // For now, return the article as enhanced without external API
      return {
        ...article,
        enhanced: true,
        aiSummary: article.description || article.summary
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
      const result = await apiClient.generateAiNews(category, country);
      setAiArticles([result.article]);
    } catch (error) {
      console.error('Error generating AI articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const { data: existingArticles } = useQuery({
    queryKey: ['ai-articles', category, country],
    queryFn: async () => {
      try {
        return await apiClient.getAiArticles(10, category, country);
      } catch (error) {
        console.error('Error fetching AI articles:', error);
        return [];
      }
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
