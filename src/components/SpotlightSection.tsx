
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, MapPin, Clock, ExternalLink, AlertTriangle, TrendingUp, Eye } from 'lucide-react';
import { useSerpApi } from '@/hooks/useSerpApi';

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
  const [serpImage, setSerpImage] = useState<string | null>(null);
  const { searchImages } = useSerpApi();

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const { data: spotlightArticles, isLoading, refetch } = useQuery({
    queryKey: ['spotlight-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spotlight_articles')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      return data as SpotlightArticle[];
    },
    staleTime: 1 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });

  // Fetch SERP image when spotlight article changes
  useEffect(() => {
    const fetchSerpImage = async () => {
      if (spotlightArticles && spotlightArticles.length > 0) {
        const article = spotlightArticles[0];
        const serpApiKey = localStorage.getItem('serpApiKey');
        
        if (serpApiKey) {
          try {
            const images = await searchImages(article.title, serpApiKey);
            if (images.length > 0) {
              setSerpImage(images[0].original);
            }
          } catch (error) {
            console.error('Error fetching SERP image:', error);
          }
        }
      }
    };

    fetchSerpImage();
  }, [spotlightArticles, searchImages]);

  // Set up real-time updates
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
          refetch();
          setLiveUpdateCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const handleReadSpotlight = (article: SpotlightArticle) => {
    const spotlightData = encodeURIComponent(JSON.stringify({
      ...article,
      isSpotlight: true,
      publishedAt: article.created_at,
      source: { name: 'URA News Live' }
    }));
    navigate(`/article?data=${spotlightData}`);
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const published = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - published.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'breaking': return <AlertTriangle className="w-4 h-4" />;
      case 'urgent': return <Clock className="w-4 h-4" />;
      case 'trending': return <TrendingUp className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <section className="relative py-8 bg-gradient-to-br from-red-900/30 via-orange-900/20 to-yellow-900/10 border border-red-500/20 rounded-2xl mb-8 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse flex gap-6">
            <div className="w-80 h-48 bg-red-500/20 rounded-xl" />
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-red-500/20 rounded w-3/4" />
              <div className="h-4 bg-red-500/20 rounded w-full" />
              <div className="h-4 bg-red-500/20 rounded w-2/3" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!spotlightArticles || spotlightArticles.length === 0) {
    return null;
  }

  const mainArticle = spotlightArticles[0];
  const imageUrl = serpImage || mainArticle.image_url || 'https://images.unsplash.com/photo-1544963813-d0c8aed83b37?w=800&h=600&fit=crop';

  return (
    <section className="relative py-8 bg-gradient-to-br from-red-900/30 via-orange-900/20 to-yellow-900/10 border border-red-500/20 rounded-2xl mb-8 overflow-hidden">
      <div className="absolute inset-0 opacity-10 animate-pulse bg-grid" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-red-500/30">
                <Zap className="w-6 h-6 text-red-400 animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-ura-white flex items-center gap-3">
                Breaking Spotlight
                <Badge className="bg-red-500 text-white animate-pulse text-xs">
                  LIVE
                </Badge>
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Real-time updates • Last synced: {currentTime.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Main Spotlight Article - Horizontal Layout */}
        <div className="flex flex-col lg:flex-row gap-6 bg-card/20 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden hover:border-red-500/50 transition-all duration-300 cursor-pointer group" onClick={() => handleReadSpotlight(mainArticle)}>
          {/* Left Side - Image */}
          <div className="relative lg:w-80 h-48 lg:h-auto overflow-hidden">
            <img
              src={imageUrl}
              alt={mainArticle.title}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
            
            {/* Badges on image */}
            <div className="absolute top-4 left-4">
              <Badge className={`${getPriorityColor(mainArticle.priority)} text-white shadow-lg border-0`}>
                {getEventTypeIcon(mainArticle.event_type)}
                <span className="ml-1 capitalize font-medium">{mainArticle.event_type}</span>
              </Badge>
            </div>
            
            <div className="absolute top-4 right-4">
              <div className="flex items-center space-x-1 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span>LIVE</span>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4 text-sm text-white/80">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTimeAgo(mainArticle.updated_at)}</span>
                </div>
                {mainArticle.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{mainArticle.location}</span>
                  </div>
                )}
              </div>
            </div>

            <h3 className="text-2xl font-bold text-ura-white mb-4 group-hover:text-red-400 transition-colors duration-300 line-clamp-2">
              {mainArticle.title}
            </h3>

            <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">
              {mainArticle.summary}
            </p>

            {/* Tags */}
            {mainArticle.tags && mainArticle.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {mainArticle.tags.slice(0, 4).map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-xs border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            <Button
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              Read Full Coverage
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Auto-refresh indicator */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-card/20 backdrop-blur-sm border border-border/50 rounded-full px-6 py-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-sm text-muted-foreground">
              Auto-refresh every 10 minutes • Enhanced with SERP API images
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpotlightSection;
