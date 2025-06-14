
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MapPin, Clock, Phone, Users, Eye, ExternalLink } from 'lucide-react';
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

  const { data: spotlightArticles, isLoading, refetch } = useQuery({
    queryKey: ['spotlight-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spotlight_articles')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data as SpotlightArticle[];
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes for real-time updates
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
      default: return <Eye className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <section className="py-8 bg-gradient-to-r from-red-900/20 to-orange-900/20 border-l-4 border-red-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4 w-1/3" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-card rounded-lg" />
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
    <section className="py-8 bg-gradient-to-r from-red-900/20 to-orange-900/20 border-l-4 border-red-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-ura-white">Today's Spotlight</h2>
              <p className="text-sm text-muted-foreground">Live updates every 10 minutes</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="destructive" className="animate-pulse">
              LIVE
            </Badge>
            {liveUpdateCount > 0 && (
              <Badge variant="secondary">
                {liveUpdateCount} updates
              </Badge>
            )}
          </div>
        </div>

        {/* Spotlight Articles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {spotlightArticles.map((article, index) => (
            <Card 
              key={article.id}
              className={`group bg-card border-2 hover-lift cursor-pointer overflow-hidden relative ${
                index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
              }`}
              onClick={() => handleReadSpotlight(article)}
            >
              {/* Priority Badge */}
              <div className="absolute top-4 left-4 z-10">
                <Badge className={`${getPriorityColor(article.priority)} text-white`}>
                  {getEventTypeIcon(article.event_type)}
                  <span className="ml-1 capitalize">{article.event_type}</span>
                </Badge>
              </div>

              {/* Live Indicator */}
              <div className="absolute top-4 right-4 z-10">
                <div className="flex items-center space-x-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span>LIVE</span>
                </div>
              </div>

              <div className="relative">
                <img
                  src={article.image_url || 'https://images.unsplash.com/photo-1544963813-d0c8aed83b37?w=800&h=600&fit=crop'}
                  alt={article.title}
                  className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                    index === 0 ? 'h-64' : 'h-48'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{formatTimeAgo(article.updated_at)}</span>
                  </div>
                  {article.location && (
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{article.location}</span>
                    </div>
                  )}
                </div>

                <h3 className={`font-bold text-ura-white mb-3 group-hover:text-red-400 transition-colors ${
                  index === 0 ? 'text-xl line-clamp-3' : 'text-lg line-clamp-2'
                }`}>
                  {article.title}
                </h3>

                <p className={`text-muted-foreground mb-4 leading-relaxed ${
                  index === 0 ? 'line-clamp-4' : 'line-clamp-3'
                }`}>
                  {article.summary}
                </p>

                {/* Quick Stats */}
                <div className="flex items-center justify-between mb-4">
                  {article.live_updates && article.live_updates.length > 0 && (
                    <div className="flex items-center space-x-1 text-xs text-blue-400">
                      <Eye className="w-3 h-3" />
                      <span>{article.live_updates.length} live updates</span>
                    </div>
                  )}
                  {article.video_urls && article.video_urls.length > 0 && (
                    <div className="flex items-center space-x-1 text-xs text-green-400">
                      <ExternalLink className="w-3 h-3" />
                      <span>{article.video_urls.length} videos</span>
                    </div>
                  )}
                  {article.casualties_count !== null && article.casualties_count > 0 && (
                    <div className="flex items-center space-x-1 text-xs text-red-400">
                      <Users className="w-3 h-3" />
                      <span>{article.casualties_count} affected</span>
                    </div>
                  )}
                </div>

                {/* Emergency Contacts */}
                {article.emergency_contacts && Object.keys(article.emergency_contacts).length > 0 && (
                  <div className="flex items-center space-x-1 text-xs text-yellow-400 mb-4">
                    <Phone className="w-3 h-3" />
                    <span>Emergency contacts available</span>
                  </div>
                )}

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {article.tags.slice(0, 3).map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs border-red-500/30 text-red-400">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <Button
                  className="w-full bg-red-500 text-white hover:bg-red-600"
                  size="sm"
                >
                  Read Full Coverage
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Live Update Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Updates automatically refresh every 10 minutes • Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </section>
  );
};

export default SpotlightSection;
