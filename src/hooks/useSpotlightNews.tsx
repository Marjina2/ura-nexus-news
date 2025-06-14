
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
    queryKey: ['spotlight-news-latest'],
    queryFn: async () => {
      const today = new Date().toISOString().slice(0, 10);

      // Try to fetch today's spotlight
      let { data, error } = await supabase
        .from('spotlight_news')
        .select('*')
        .eq('date', today)
        .maybeSingle();

      if (error) throw error;

      // If not found, get the latest available (by date desc)
      if (!data) {
        const { data: latestList, error: error2 } = await supabase
          .from('spotlight_news')
          .select('*')
          .order('date', { ascending: false })
          .limit(1);

        if (error2) throw error2;
        data = latestList?.[0] ?? null;
      }

      return data as SpotlightNews | null;
    },
    refetchInterval: 15 * 60 * 1000,
    staleTime: 10 * 60 * 1000,
  });
};
