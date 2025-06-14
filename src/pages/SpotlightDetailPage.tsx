
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft } from 'lucide-react';
import SimpleLoading from '@/components/ui/simple-loading';

const SpotlightDetailPage = () => {
  const { date = '' } = useParams<{ date: string }>();
  const navigate = useNavigate();

  const { data: spotlight, isLoading, error } = useQuery({
    queryKey: ['spotlight-news-detail', date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spotlight_news')
        .select('*')
        .eq('date', date)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!date,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return <SimpleLoading text="Loading Spotlight..." />;
  }

  if (!spotlight || error) {
    return (
      <div className="max-w-3xl mx-auto py-24 flex flex-col items-center text-center">
        <h2 className="text-2xl font-semibold mb-4 text-pulsee-white">Spotlight not found</h2>
        <Button variant="outline" onClick={() => navigate('/news')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to News
        </Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black/90">
      <div className="max-w-3xl mx-auto py-16 px-4">
        <Button variant="ghost" onClick={() => navigate('/news')} className="mb-6 text-pulsee-white hover:text-pulsee-green">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to News
        </Button>
        <div className="rounded-xl border border-red-500/20 overflow-hidden mb-8">
          <img src={spotlight.image_url} alt={spotlight.seo_title} className="w-full h-64 object-cover" />
        </div>
        <span className="inline-block mb-2 text-sm text-red-400 uppercase font-bold tracking-widest">Spotlight for {spotlight.date}</span>
        <h1 className="text-3xl font-bold text-pulsee-white mb-4">{spotlight.seo_title}</h1>
        <p className="mb-6 text-muted-foreground text-lg">{spotlight.summary}</p>
        <article className="prose prose-invert prose-lg max-w-none mb-10 whitespace-pre-line">{spotlight.full_report}</article>
      </div>
    </main>
  );
};

export default SpotlightDetailPage;
