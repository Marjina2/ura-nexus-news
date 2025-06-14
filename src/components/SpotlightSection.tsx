
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import SpotlightLoading from '@/components/spotlight/SpotlightLoading';
import SpotlightHeader from '@/components/spotlight/SpotlightHeader';
import SpotlightCard from '@/components/spotlight/SpotlightCard';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface SpotlightArticle {
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
  created_at: string;
  updated_at: string;
}

const SpotlightSection = () => {
  const navigate = useNavigate();
  const [liveUpdateCount, setLiveUpdateCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  useScrollAnimation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const { data: spotlightArticles, isLoading, refetch, error } = useQuery({
    queryKey: ['spotlight-articles'],
    queryFn: async () => {
      console.log('Fetching spotlight articles...');
      const { data, error } = await supabase
        .from('spotlight_articles')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching spotlight articles:', error);
        throw error;
      }
      
      console.log('Spotlight articles fetched:', data);
      return data as SpotlightArticle[];
    },
    staleTime: 1 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });

  useEffect(() => {
    const channel = supabase
      .channel('spotlight-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'spotlight_articles'
        },
        () => {
          console.log('Spotlight article updated via realtime');
          refetch();
          setLiveUpdateCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const handleUpdateSpotlight = async () => {
    setIsUpdating(true);
    setUpdateProgress(0);
    
    try {
      const progressInterval = setInterval(() => {
        setUpdateProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 20;
        });
      }, 500);

      console.log('Invoking update-spotlight function...');
      const { data, error } = await supabase.functions.invoke('update-spotlight');
      
      clearInterval(progressInterval);
      setUpdateProgress(100);
      
      if (error) {
        console.error('Error from update-spotlight function:', error);
        throw error;
      }
      
      console.log('Spotlight update response:', data);
      await refetch();
      
      setTimeout(() => {
        setIsUpdating(false);
        setUpdateProgress(0);
      }, 1000);
    } catch (error) {
      console.error('Error updating spotlight:', error);
      setIsUpdating(false);
      setUpdateProgress(0);
    }
  };

  const handleReadSpotlight = (article: SpotlightArticle) => {
    const spotlightData = encodeURIComponent(JSON.stringify({
      ...article,
      isSpotlight: true,
      publishedAt: article.created_at,
      source: { name: 'Pulsee News Live' }
    }));
    navigate(`/article?data=${spotlightData}`);
  };

  if (isLoading || isUpdating) {
    return <SpotlightLoading progress={isUpdating ? updateProgress : 0} />;
  }

  if (error) {
    console.error('Spotlight section error:', error);
    return (
      <section className="scroll-fade-in relative py-8 bg-gradient-to-br from-red-900/30 via-orange-900/20 to-yellow-900/10 border border-red-500/20 rounded-2xl mb-8 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SpotlightHeader currentTime={currentTime} liveUpdateCount={liveUpdateCount} />
          <p className="text-red-400 mb-4">Failed to load spotlight content</p>
          <Button
            onClick={handleUpdateSpotlight}
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </section>
    );
  }

  if (!spotlightArticles || spotlightArticles.length === 0) {
    return (
      <section className="scroll-fade-in relative py-8 bg-gradient-to-br from-red-900/30 via-orange-900/20 to-yellow-900/10 border border-red-500/20 rounded-2xl mb-8 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SpotlightHeader currentTime={currentTime} liveUpdateCount={liveUpdateCount} />
          <p className="text-muted-foreground mb-6">No spotlight content available. Generate fresh breaking news now!</p>
          <Button
            onClick={handleUpdateSpotlight}
            disabled={isUpdating}
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600"
          >
            {isUpdating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate Spotlight
              </>
            )}
          </Button>
        </div>
      </section>
    );
  }

  const mainArticle = spotlightArticles[0];

  return (
    <section className="scroll-fade-in relative py-8 bg-gradient-to-br from-red-900/30 via-orange-900/20 to-yellow-900/10 border border-red-500/20 rounded-2xl mb-8 overflow-hidden">
      <div className="absolute inset-0 opacity-10 animate-pulse bg-grid" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <SpotlightHeader currentTime={currentTime} liveUpdateCount={liveUpdateCount} />
          
          <Button
            onClick={handleUpdateSpotlight}
            disabled={isUpdating}
            variant="outline"
            size="sm"
            className="border-red-500/30 hover:border-red-500 text-red-400 hover:bg-red-500/10"
          >
            {isUpdating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </>
            )}
          </Button>
        </div>

        <SpotlightCard 
          article={mainArticle} 
          onRead={handleReadSpotlight} 
        />
      </div>
    </section>
  );
};

export default SpotlightSection;
