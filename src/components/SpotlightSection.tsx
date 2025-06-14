
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { useSpotlightNews } from '@/hooks/useSpotlightNews';
import SpotlightLoading from '@/components/spotlight/SpotlightLoading';

const isToday = (dateString: string) => {
  const today = new Date().toISOString().slice(0, 10);
  return dateString === today;
};

const formatDateReadable = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric"
  });
};

const SpotlightSection = () => {
  const navigate = useNavigate();
  const { data: spotlight, isLoading, error, refetch } = useSpotlightNews();

  const handleReadFullReport = () => {
    if (!spotlight) return;
    navigate(`/spotlight/${spotlight.date}`);
  };

  if (isLoading) {
    return (
      <section className="scroll-fade-in relative py-8 bg-gradient-to-br from-red-900/30 via-orange-900/20 to-yellow-900/10 border border-red-500/20 rounded-2xl mb-8 overflow-hidden">
        <SpotlightLoading progress={50} />
      </section>
    );
  }

  if (error || !spotlight) {
    return (
      <section className="scroll-fade-in relative py-8 bg-gradient-to-br from-red-900/30 via-orange-900/20 to-yellow-900/10 border border-red-500/20 rounded-2xl mb-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 animate-pulse bg-grid" />
        <div className="relative max-w-2xl mx-auto px-4 text-center py-10">
          <h3 className="text-2xl font-bold text-pulsee-white mb-4">
            No Spotlight Available
          </h3>
          <p className="text-muted-foreground mb-6">
            No AI Spotlight available yet. Please check back soon!
          </p>
          <Button onClick={() => refetch?.()} className="bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </section>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const isSpotlightToday = isToday(spotlight.date);

  return (
    <section className="scroll-fade-in relative py-8 bg-gradient-to-br from-red-900/30 via-orange-900/20 to-yellow-900/10 border border-red-500/20 rounded-2xl mb-8 overflow-hidden">
      <div className="absolute inset-0 opacity-10 animate-pulse bg-grid" />
      <div className="relative max-w-3xl mx-auto flex flex-col lg:flex-row items-center gap-8 px-4">
        {/* Image */}
        <div className="w-full max-w-lg h-56 rounded-xl overflow-hidden border border-red-500/30 bg-black/20 mx-auto shrink-0">
          <img src={spotlight.image_url} alt={spotlight.seo_title} className="object-cover w-full h-full" />
        </div>
        {/* Content */}
        <div className="flex-1">
          <span className="inline-block mb-2 text-sm text-red-400 uppercase font-bold tracking-widest">
            {isSpotlightToday ? "Today's Spotlight" : `Spotlight from ${formatDateReadable(spotlight.date)}`}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-pulsee-white mb-4">{spotlight.seo_title}</h2>
          <p className="mb-6 text-muted-foreground">{spotlight.summary}</p>
          <Button
            onClick={handleReadFullReport}
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 px-6 py-3 text-lg font-semibold rounded-full"
          >
            See Full Coverage <ExternalLink className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SpotlightSection;
