
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MapPin, Clock, Eye, ExternalLink, TrendingUp } from 'lucide-react';
import SpotlightStats from './SpotlightStats';

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

interface SpotlightCardProps {
  article: SpotlightArticle;
  index: number;
  onRead: (article: SpotlightArticle) => void;
}

const SpotlightCard = ({ article, index, onRead }: SpotlightCardProps) => {
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

  return (
    <Card 
      className={`group bg-card/40 backdrop-blur-sm border-2 border-border/50 hover:border-red-500/50 
        transition-all duration-500 hover:scale-105 cursor-pointer overflow-hidden relative
        hover:shadow-2xl hover:shadow-red-500/25 ${
        index === 0 ? 'md:col-span-2 md:row-span-2' : ''
      }`}
      onClick={() => onRead(article)}
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

        <SpotlightStats 
          liveUpdates={article.live_updates}
          videoUrls={article.video_urls}
          casualtiesCount={article.casualties_count}
          emergencyContacts={article.emergency_contacts}
        />

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
  );
};

export default SpotlightCard;
