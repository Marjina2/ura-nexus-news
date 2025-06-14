
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, ExternalLink, AlertTriangle, TrendingUp, Eye } from 'lucide-react';

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
  onRead: (article: SpotlightArticle) => void;
}

const SpotlightCard = ({ article, onRead }: SpotlightCardProps) => {
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
    <div 
      className="flex flex-col lg:flex-row gap-6 bg-card/20 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden hover:border-red-500/50 transition-all duration-300 cursor-pointer group hover-lift" 
      onClick={() => onRead(article)}
    >
      {/* Left Side - Image */}
      <div className="relative lg:w-80 h-48 lg:h-auto overflow-hidden">
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        
        {/* Badges on image */}
        <div className="absolute top-4 left-4">
          <Badge className={`${getPriorityColor(article.priority)} text-white shadow-lg border-0`}>
            {getEventTypeIcon(article.event_type)}
            <span className="ml-1 capitalize font-medium">{article.event_type}</span>
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
              <span>{formatTimeAgo(article.updated_at)}</span>
            </div>
            {article.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{article.location}</span>
              </div>
            )}
          </div>
        </div>

        <h3 className="text-2xl font-bold text-ura-white mb-4 group-hover:text-red-400 transition-colors duration-300 line-clamp-2">
          {article.title}
        </h3>

        <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">
          {article.summary}
        </p>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags.slice(0, 4).map((tag, i) => (
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
  );
};

export default SpotlightCard;
