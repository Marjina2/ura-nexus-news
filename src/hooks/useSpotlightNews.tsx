
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SpotlightNews {
  id: string;
  date: string;
  gemini_topic: string;
  summary: string;
  seo_title: string;
  image_url: string;
  full_report: string;
  created_at: string;
  updated_at: string;
}

export const useSpotlightNews = () => {
  return useQuery({
    queryKey: ['spotlight-news-today'],
    queryFn: async () => {
      // Get today's date string YYYY-MM-DD
      const today = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from('spotlight_news')
        .select('*')
        .eq('date', today)
        .maybeSingle();

      if (error) throw error;
      return data as SpotlightNews | null;
    },
    refetchInterval: 15 * 60 * 1000, // refresh every 15min
    staleTime: 10 * 60 * 1000,
  });
};
