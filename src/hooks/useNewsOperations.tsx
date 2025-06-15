import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useNewsOperations = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateNews = async () => {
    setIsGenerating(true);
    try {
      console.log('Calling auto-publish-gnews function...');
      const { data, error } = await supabase.functions.invoke('auto-publish-gnews');
      
      if (error) {
        console.error('Function error:', error);
        throw error;
      }
      
      console.log('Function response:', data);
      toast.success(`Successfully generated ${data?.saved || 0} new articles`);
      
      return data;
    } catch (error) {
      console.error('Error generating news:', error);
      toast.error("Failed to generate news. Please try again.");
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return {
    isGenerating,
    generateNews,
    formatDate
  };
};

export const useSpotlightNews = () => {
  return useQuery({
    queryKey: ['spotlight-news'],
    queryFn: async () => {
      console.log('Fetching spotlight news...');
      const today = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from('spotlight_news')
        .select('*')
        .eq('date', today)
        .maybeSingle();
      
      if (error) {
        console.error('Spotlight error:', error);
        throw error;
      }
      console.log('Spotlight data:', data);
      return data;
    },
  });
};

export const useNewsArticles = (selectedCategory: string) => {
  return useQuery({
    queryKey: ['news-articles', selectedCategory],
    queryFn: async () => {
      console.log('Fetching news articles...');
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Articles error:', error);
        throw error;
      }
      console.log('Articles data:', data);
      return data;
    },
  });
};
