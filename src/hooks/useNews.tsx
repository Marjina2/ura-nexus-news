
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
  content?: string;
}

export interface EnhancedArticle extends NewsArticle {
  enhancedTitle?: string;
  summary?: string;
  keyPoints?: string[];
  enhancedContent?: string;
  tags?: string[];
}

const NEWS_CATEGORIES = [
  'general',
  'business', 
  'entertainment',
  'health',
  'science',
  'sports',
  'technology'
];

export const useNews = (category: string = 'general') => {
  const [page, setPage] = useState(1);
  const [allArticles, setAllArticles] = useState<NewsArticle[]>([]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['news', category, page],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('fetch-news', {
        body: { category, page }
      });

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (data?.articles) {
      if (page === 1) {
        setAllArticles(data.articles);
      } else {
        setAllArticles(prev => [...prev, ...data.articles]);
      }
    }
  }, [data, page]);

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  const resetAndRefetch = () => {
    setPage(1);
    setAllArticles([]);
    refetch();
  };

  return {
    articles: allArticles,
    isLoading,
    error,
    loadMore,
    hasMore: data?.totalResults ? allArticles.length < data.totalResults : false,
    resetAndRefetch,
    categories: NEWS_CATEGORIES
  };
};

export const useEnhanceArticle = () => {
  const enhanceArticle = async (article: NewsArticle): Promise<EnhancedArticle> => {
    try {
      const { data, error } = await supabase.functions.invoke('enhance-article', {
        body: {
          title: article.title,
          description: article.description,
          content: article.content,
          url: article.url
        }
      });

      if (error) throw error;

      return { ...article, ...data };
    } catch (error) {
      console.error('Error enhancing article:', error);
      return article;
    }
  };

  return { enhanceArticle };
};
