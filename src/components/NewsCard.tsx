
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp } from 'lucide-react';
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

  const cleanTitle = (title: string) => {
    // Remove numbers, special characters, and clean up the title
    return title
      .replace(/^\d+\.\s*/, '') // Remove leading numbers like "1. "
      .replace(/\[\d+\]/g, '') // Remove numbers in brackets like [1]
      .replace(/\(\d+\)/g, '') // Remove numbers in parentheses like (1)
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
  };

  const getImageUrl = (url: string | null, title: string) => {
    if (!url) return generateImageUrl(title);
    // Handle relative URLs
    if (url.startsWith('//')) return `https:${url}`;
    if (url.startsWith('/')) return generateImageUrl(title);
    return url;
  };

  const generateImageUrl = (title: string) => {
    // Generate appropriate images based on article content
    const keywords = title.toLowerCase();
    
    if (keywords.includes('technology') || keywords.includes('tech') || keywords.includes('ai') || keywords.includes('software')) {
      return 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop';
    }
    if (keywords.includes('business') || keywords.includes('finance') || keywords.includes('economy') || keywords.includes('market')) {
      return 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop';
    }
    if (keywords.includes('health') || keywords.includes('medical') || keywords.includes('healthcare')) {
      return 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop';
    }
    if (keywords.includes('sports') || keywords.includes('cricket') || keywords.includes('football')) {
      return 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop';
    }
    if (keywords.includes('politics') || keywords.includes('government') || keywords.includes('election')) {
      return 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=600&fit=crop';
    }
    if (keywords.includes('entertainment') || keywords.includes('movie') || keywords.includes('bollywood')) {
      return 'https://images.unsplash.com/photo-1489599687945-e138957ad296?w=800&h=600&fit=crop';
    }
    if (keywords.includes('science') || keywords.includes('research') || keywords.includes('study')) {
      return 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop';
    }
    
    // Default news image
    return 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop';
  };

  const cleanedTitle = cleanTitle(article.title);

  const handleReadClick = () => {
    console.log('NewsCard: Read button clicked for article:', cleanedTitle);
    onRead(article);
  };

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-border/50 hover:border-ura-green/50 transition-all duration-300 group hover:shadow-lg hover:shadow-ura-green/10">
      <div className="relative overflow-hidden rounded-t-lg">
        <img 
          src={getImageUrl(article.urlToImage || article.image_url, cleanedTitle)}
          alt={cleanedTitle}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = generateImageUrl(cleanedTitle);
          }}
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-ura-green/90 text-ura-black font-medium">
            <TrendingUp className="w-3 h-3 mr-1" />
            Fresh
          </Badge>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Clock className="w-4 h-4" />
          {formatDate(article.publishedAt || article.published_at || '')}
        </div>
        
        <h3 className="text-lg font-semibold text-ura-white mb-3 line-clamp-2 group-hover:text-ura-green transition-colors leading-tight">
          {cleanedTitle}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
          {article.description}
        </p>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleReadClick}
            className="flex-1 bg-gradient-to-r from-ura-green to-ura-green-hover text-ura-black hover:from-ura-green-hover hover:to-ura-green font-medium transition-all duration-300 hover:shadow-lg hover:shadow-ura-green/25"
          >
            Read Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
