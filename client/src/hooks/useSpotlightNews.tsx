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
    queryKey: ['spotlight-news-rotating'],
    queryFn: async () => {
      const now = new Date();
      const todayStr = now.toISOString().slice(0, 10);

      // Fetch today's spotlight
      let { data: todayData, error: todayError } = await supabase
        .from('spotlight_news')
        .select('*')
        .eq('date', todayStr)
        .maybeSingle();
      if (todayError) throw todayError;

      // If before noon and today's exists, show today's
      if (now.getHours() < 12 && todayData) {
        return todayData as SpotlightNews;
      }

      // Otherwise, fetch latest available up to yesterday (<= today, but not future)
      // We'll order by date desc, limit 1. If after noon, fetch <= today, so today's or yesterday's.
      // But if after noon and today's doesn't exist, get the last before today (yesterday etc)
      const { data: previousList, error: prevError } = await supabase
        .from('spotlight_news')
        .select('*')
        .lt('date', todayStr)
        .order('date', { ascending: false })
        .limit(1);

      if (prevError) throw prevError;

      // after noon: prefer today's spotlight if exists, otherwise yesterday
      if (now.getHours() >= 12) {
        if (todayData) return todayData as SpotlightNews;
        if (previousList && previousList.length > 0) return previousList[0] as SpotlightNews;
        return null;
      }

      // before noon: only show today's, otherwise fall back to yesterday if no today
      if (!todayData && previousList && previousList.length > 0) {
        return previousList[0] as SpotlightNews;
      }

      // If we still have nothing, return null so the UI shows "No Spotlight"
      return todayData as SpotlightNews ?? null;
    },
    refetchInterval: 15 * 60 * 1000, // every 15min auto refresh
    staleTime: 10 * 60 * 1000,
  });
};
