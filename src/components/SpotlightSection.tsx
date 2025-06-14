
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MapPin, Clock, Phone, Users, Eye, ExternalLink, Zap, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

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
        .limit(4);

      if (error) throw error;
      return data as SpotlightArticle[];
    },
    staleTime: 1 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });

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
      <section className="relative py-12 bg-gradient-to-br from-red-900/30 via-orange-900/20 to-yellow-900/10 border border-red-500/20 rounded-2xl mb-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='%23ffffff05' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)' /%3E%3C/svg%3E")`
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-red-500/20 rounded mb-6 w-1/3" />
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 bg-card/20 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!spotlightArticles || spotlightArticles.length === 0) {
    return null;
  }

  return (
    <section className="relative py-12 bg-gradient-to-br from-red-900/30 via-orange-900/20 to-yellow-900/10 border border-red-500/20 rounded-2xl mb-8 overflow-hidden">
      <div className="absolute inset-0 opacity-10 animate-pulse" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='%23ffffff05' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)' /%3E%3C/svg%3E")`
      }} />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-red-500/30">
                <Zap className="w-6 h-6 text-red-400 animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-ura-white flex items-center gap-3">
                Breaking Spotlight
                <Badge className="bg-red-500 text-white animate-pulse text-xs">
                  LIVE
                </Badge>
              </h2>
              <p className="text-muted-foreground mt-1">
                Real-time updates • Last synced: {currentTime.toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Updates today</div>
              <div className="text-2xl font-bold text-ura-green">{liveUpdateCount}</div>
            </div>
            {liveUpdateCount > 0 && (
              <Badge variant="secondary" className="bg-ura-green/20 text-ura-green animate-bounce">
                +{liveUpdateCount} new
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {spotlightArticles.map((article, index) => (
            <Card 
              key={article.id}
              className={`group bg-card/40 backdrop-blur-sm border-2 border-border/50 hover:border-red-500/50 
                transition-all duration-500 hover:scale-105 cursor-pointer overflow-hidden relative
                hover:shadow-2xl hover:shadow-red-500/25 ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
              onClick={() => handleReadSpotlight(article)}
            >
              <div className="absolute top-4 left-4 z-10">
                <Badge className={`${getPriorityColor(article.priority)} text-white shadow-lg border-0`}>
                  {getEventTypeIcon(article.event_type)}
                  <span className="ml-1 capitalize font-medium">{article.event_type}</span>
                </Badge>
              </div>

              <div className="absolute top-4 right-4 z-10">
                <div className="flex items-center space-x-1 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span>LIVE</span>
                </div>
              </div>

              <div className="relative">
                <img
                  src={article.image_url || 'https://images.unsplash.com/photo-1544963813-d0c8aed83b37?w=800&h=600&fit=crop'}
                  alt={article.title}
                  className={`w-full object-cover transition-all duration-500 group-hover:scale-110 ${
                    index === 0 ? 'h-80' : 'h-56'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/95 transition-all duration-300" />
                
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2 text-sm text-white/80">
                      <Clock className="w-4 h-4" />
                      <span>{formatTimeAgo(article.updated_at)}</span>
                    </div>
                    {article.location && (
                      <div className="flex items-center space-x-1 text-sm text-white/80">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate max-w-20">{article.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className={`font-bold text-ura-white mb-3 group-hover:text-red-400 transition-colors duration-300 ${
                  index === 0 ? 'text-2xl line-clamp-2' : 'text-lg line-clamp-2'
                }`}>
                  {article.title}
                </h3>

                <p className={`text-muted-foreground mb-4 leading-relaxed ${
                  index === 0 ? 'line-clamp-3' : 'line-clamp-2'
                }`}>
                  {article.summary}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {article.live_updates && article.live_updates.length > 0 && (
                    <div className="flex items-center space-x-1 text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-lg">
                      <Eye className="w-3 h-3" />
                      <span>{article.live_updates.length} updates</span>
                    </div>
                  )}
                  {article.video_urls && article.video_urls.length > 0 && (
                    <div className="flex items-center space-x-1 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-lg">
                      <ExternalLink className="w-3 h-3" />
                      <span>{article.video_urls.length} videos</span>
                    </div>
                  )}
                  {article.casualties_count !== null && article.casualties_count > 0 && (
                    <div className="flex items-center space-x-1 text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-lg">
                      <Users className="w-3 h-3" />
                      <span>{article.casualties_count} affected</span>
                    </div>
                  )}
                  {article.emergency_contacts && Object.keys(article.emergency_contacts).length > 0 && (
                    <div className="flex items-center space-x-1 text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-lg">
                      <Phone className="w-3 h-3" />
                      <span>Emergency</span>
                    </div>
                  )}
                </div>

                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {article.tags.slice(0, 3).map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <Button
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  size="sm"
                >
                  Read Full Coverage
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-card/20 backdrop-blur-sm border border-border/50 rounded-full px-6 py-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-sm text-muted-foreground">
              Auto-refresh every 10 minutes • Next update in {Math.ceil((10 - (new Date().getMinutes() % 10))))} min
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpotlightSection;
