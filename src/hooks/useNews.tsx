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
  id?: string;
  isAI?: boolean;
  image_url?: string;
  published_at?: string;
  tags?: string[];
}

export interface EnhancedArticle extends NewsArticle {
  enhancedTitle?: string;
  summary?: string;
  keyPoints?: string[];
  enhancedContent?: string;
  tags?: string[];
  image_url?: string;
  published_at?: string;
}

export interface AIGeneratedArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  country: string;
  author: string;
  tags: string[];
  image_url: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string[];
  published_at: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  is_featured: boolean;
}

const NEWS_CATEGORIES = [
  'general',
  'business', 
  'entertainment',
  'health',
  'science',
  'sports',
  'technology',
  'politics'
];

export const useNews = (category: string = 'general', country: string = 'in') => {
  const [page, setPage] = useState(1);
  const [allArticles, setAllArticles] = useState<NewsArticle[]>([]);
  const [seenUrls, setSeenUrls] = useState<Set<string>>(new Set());

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['news', category, country, page],
    queryFn: async () => {
      console.log('Fetching news for category:', category, 'country:', country, 'page:', page);
      const { data, error } = await supabase.functions.invoke('fetch-fresh-news', {
        body: { category, page, country }
      });

      if (error) {
        console.error('Error from fetch-fresh-news function:', error);
        throw error;
      }
      console.log('Received news data:', data);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 60 * 1000, // Refetch every 30 minutes
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (data?.articles) {
      console.log('Processing articles:', data.articles.length);
      // Filter out articles we've already seen
      const newArticles = data.articles.filter((article: NewsArticle) => {
        const articleUrl = article.url || article.id || '';
        if (seenUrls.has(articleUrl)) {
          return false;
        }
        setSeenUrls(prev => new Set([...prev, articleUrl]));
        return true;
      });

      console.log('New unique articles:', newArticles.length);
      
      if (page === 1) {
        setAllArticles(newArticles);
      } else {
        setAllArticles(prev => [...prev, ...newArticles]);
      }
    }
  }, [data, page]);

  const loadMore = () => {
    console.log('Loading more articles, current page:', page);
    setPage(prev => prev + 1);
  };

  const resetAndRefetch = () => {
    console.log('Resetting and refetching');
    setPage(1);
    setAllArticles([]);
    setSeenUrls(new Set());
    refetch();
  };

  return {
    articles: allArticles,
    isLoading,
    error,
    loadMore,
    hasMore: page < 5, // Limit to 5 pages to prevent infinite loading
    resetAndRefetch,
    categories: NEWS_CATEGORIES
  };
};

export const useAIGeneratedArticles = (category: string, country: string = 'in') => {
  const { data: aiArticles, isLoading, error, refetch } = useQuery({
    queryKey: ['ai-articles', category, country],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_generated_articles')
        .select('*')
        .eq('category', category)
        .eq('country', country)
        .order('published_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as AIGeneratedArticle[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const generateArticles = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-news', {
        body: { category, country, count: 3 }
      });

      if (error) throw error;
      
      // Refetch to get the new articles
      refetch();
      
      return data;
    } catch (error) {
      console.error('Error generating AI articles:', error);
      throw error;
    }
  };

  return {
    aiArticles,
    isLoading,
    error,
    generateArticles,
    refetch
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
