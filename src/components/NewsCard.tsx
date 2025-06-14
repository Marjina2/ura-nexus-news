
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ExternalLink } from 'lucide-react';
import { NewsArticle } from '@/hooks/useNews';

interface NewsCardProps {
  article: NewsArticle;
  onRead: (article: NewsArticle) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, onRead }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getImageUrl = (url: string | null) => {
    if (!url) return 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop';
    // Handle relative URLs
    if (url.startsWith('//')) return `https:${url}`;
    if (url.startsWith('/')) return `https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop`;
    return url;
  };

  return (
    <Card className="bg-card border-border hover:border-ura-green/30 transition-all duration-300 group">
      <div className="relative overflow-hidden rounded-t-lg">
        <img 
          src={getImageUrl(article.urlToImage || article.image_url)}
          alt={article.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop';
          }}
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-ura-green text-ura-black">
            {article.source.name}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Clock className="w-4 h-4" />
          {formatDate(article.publishedAt || article.published_at || '')}
        </div>
        
        <h3 className="text-lg font-semibold text-ura-white mb-2 line-clamp-2 group-hover:text-ura-green transition-colors">
          {article.title}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {article.description}
        </p>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => onRead(article)}
            className="flex-1 bg-ura-green text-ura-black hover:bg-ura-green-hover"
          >
            Read Article
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => window.open(article.url, '_blank')}
            className="border-ura-green/30 hover:border-ura-green"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
