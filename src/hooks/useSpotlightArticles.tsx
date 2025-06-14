
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SpotlightArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  event_type: string;
  priority: number;
  image_url: string;
  video_urls: string[];
  tags: string[];
  location: string;
  casualties_count: number;
  emergency_contacts: any;
  live_updates: any[];
  sources: any[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  expires_at: string;
}

export const useSpotlightArticles = () => {
  return useQuery({
    queryKey: ['spotlight-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spotlight_articles')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SpotlightArticle[];
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
};

export const useUpdateSpotlightArticle = () => {
  const updateArticle = async (id: string, updates: Partial<SpotlightArticle>) => {
    const { data, error } = await supabase
      .from('spotlight_articles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  return { updateArticle };
};
