
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { NewsArticleData } from '@/types/news';

export const useNewsData = (selectedCategory: string, enabled: boolean) => {
  const fetchNewsArticles = async () => {
    console.log('Fetching news articles...');
    
    const baseQuery = supabase
      .from('news_articles')
      .select('id, original_title, rephrased_title, summary, image_url, source_url, created_at')
      .order('created_at', { ascending: false })
      .limit(20);
    
    const query = selectedCategory !== 'all' 
      ? baseQuery.eq('category', selectedCategory)
      : baseQuery;
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Articles error:', error);
      throw error;
    }
    
    console.log('Articles data:', data);
    return (data || []) as NewsArticleData[];
  };

  return useQuery({
    queryKey: ['news-articles', selectedCategory],
    queryFn: fetchNewsArticles,
    enabled,
  });
};
