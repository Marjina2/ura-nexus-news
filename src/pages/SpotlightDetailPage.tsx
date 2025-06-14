import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft } from 'lucide-react';
import SimpleLoading from '@/components/ui/simple-loading';
import SpotlightDetailStats from '@/components/spotlight/SpotlightDetailStats';

const SpotlightDetailPage = () => {
  const { date = '' } = useParams<{ date: string }>();
  const navigate = useNavigate();

  // Fetch both spotlight_news (headline) and maybe a matching spotlight_articles (details) for today
  const { data, isLoading, error } = useQuery({
    queryKey: ['spotlight-news-and-details', date],
    queryFn: async () => {
      // Get spotlight_news by date
      const { data: news, error: newsError } = await supabase
        .from('spotlight_news')
        .select('*')
        .eq('date', date)
        .maybeSingle();
      if (newsError) throw newsError;

      // Try to find matching spotlight_articles with similar topic/keyword (use priority article for that date)
      const { data: articles, error: articleError } = await supabase
        .from('spotlight_articles')
        .select('*')
        .order('priority', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(3);
      // Note: Could be filtered more tightly, e.g. by topic/title using full text, but keep simple

      let matchedArticle = undefined;
      if (articles && news && news.gemini_topic) {
        matchedArticle = articles.find((a) =>
          (a.title && news.gemini_topic && a.title.toLowerCase().includes(news.gemini_topic.toLowerCase()))
        );
      }

      return { news, matchedArticle };
    },
    enabled: !!date,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return <SimpleLoading text="Loading Spotlight..." />;
  }

  if (!data?.news || error) {
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

  const { news, matchedArticle } = data;

  // Prefer info from article if available, fallback to spotlight_news
  const casualtiesCount = matchedArticle?.casualties_count ?? null;
  // Try to infer survivors from known info (not in schema, so fallback)
  const survivorsCount = null;
  const location = matchedArticle?.location ?? null;
  // No direct schema for black box found, fake logic: tag present or content mentions it
  let blackBoxFound = null;
  if (matchedArticle?.tags?.some((t: string) => t.toLowerCase().includes("black box"))) {
    blackBoxFound = true;
  }
  if ((matchedArticle?.content || "").toLowerCase().includes("black box not found")) {
    blackBoxFound = false;
  }
  const emergencyContacts = matchedArticle?.emergency_contacts ?? null;

  return (
    <main className="min-h-screen bg-black/90">
      <div className="max-w-3xl mx-auto py-16 px-4">
        <Button variant="ghost" onClick={() => navigate('/news')} className="mb-6 text-pulsee-white hover:text-pulsee-green">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to News
        </Button>
        <div className="rounded-xl border border-red-500/20 overflow-hidden mb-8">
          <img
            src={news.image_url}
            alt={news.seo_title}
            className="w-full h-64 object-cover"
          />
        </div>
        <span className="inline-block mb-2 text-sm text-red-400 uppercase font-bold tracking-widest">
          Spotlight for {news.date}
        </span>
        <h1 className="text-3xl font-bold text-pulsee-white mb-4">
          {news.seo_title}
        </h1>
        <p className="mb-6 text-muted-foreground text-lg">{news.summary}</p>
        <SpotlightDetailStats
          casualtiesCount={casualtiesCount}
          survivorsCount={survivorsCount}
          location={location}
          blackBoxFound={blackBoxFound}
          emergencyContacts={emergencyContacts}
        />
        <article className="prose prose-invert prose-lg max-w-none mb-10 whitespace-pre-line">
          {news.full_report}
        </article>
      </div>
    </main>
  );
};

export default SpotlightDetailPage;
