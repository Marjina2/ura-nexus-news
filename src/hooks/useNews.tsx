
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
      console.log('Fetching news for category:', category, 'page:', page);
      const { data, error } = await supabase.functions.invoke('fetch-news', {
        body: { category, page, country: 'in' }
      });

      if (error) {
        console.error('Error from fetch-news function:', error);
        throw error;
      }
      console.log('Received news data:', data);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60 * 60 * 1000, // Refetch every hour
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (data?.articles) {
      console.log('Setting articles:', data.articles.length);
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
      // First try to get from cached articles
      const { data: cachedArticle } = await supabase
        .from('cached_articles')
        .select('*')
        .eq('url', article.url)
        .single();

      if (cachedArticle) {
        return {
          ...article,
          enhancedTitle: cachedArticle.enhanced_title,
          summary: cachedArticle.summary,
          keyPoints: cachedArticle.key_points,
          enhancedContent: cachedArticle.enhanced_content,
          tags: cachedArticle.tags
        };
      }

      // Fallback to real-time enhancement
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

export const useCachedArticles = (category?: string) => {
  return useQuery({
    queryKey: ['cached-articles', category],
    queryFn: async () => {
      let query = supabase
        .from('cached_articles')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(10);

      if (category && category !== 'general') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
