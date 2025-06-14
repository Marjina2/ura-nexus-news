
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNews } from '@/hooks/useNews';

const TrendingCarousel = () => {
  const navigate = useNavigate();
  const { articles, isLoading, error } = useNews('general');

  console.log('TrendingCarousel - articles:', articles?.length, 'isLoading:', isLoading, 'error:', error);

  const handleArticleClick = (article: any) => {
    console.log('Article clicked:', article.title);
    const articleData = encodeURIComponent(JSON.stringify(article));
    navigate(`/article?data=${articleData}`);
  };

  const formatTimeAgo = (publishedAt: string) => {
    const now = new Date();
    const published = new Date(publishedAt);
    const diffInHours = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getImageUrl = (url: string | null) => {
    if (!url) return 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop';
    if (url.startsWith('//')) return `https:${url}`;
    if (url.startsWith('/')) return 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop';
    return url;
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-card/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-6 h-6 text-ura-green" />
              <h2 className="text-3xl font-bold text-ura-white">Trending Now</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg border border-border animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error('TrendingCarousel error:', error);
  }

  const trendingArticles = articles?.slice(0, 4) || [];

  return (
    <section className="py-16 bg-card/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-6 h-6 text-ura-green" />
            <h2 className="text-3xl font-bold text-ura-white">Trending Now</h2>
            <Badge variant="secondary" className="bg-ura-green text-ura-black">
              Latest from India
            </Badge>
          </div>
          <button 
            onClick={() => navigate('/news')}
            className="text-ura-green hover:text-ura-green-hover transition-colors"
          >
            View All
          </button>
        </div>

        {/* Trending Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingArticles.map((article, index) => (
            <Card 
              key={`${article.url}-${index}`}
              className="group bg-card border-border hover-lift cursor-pointer overflow-hidden"
              onClick={() => handleArticleClick(article)}
            >
              <div className="relative">
                <img
                  src={getImageUrl(article.urlToImage)}
                  alt={article.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
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
                <div className="absolute top-3 right-3">
                  <Badge className="bg-red-500 text-white">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Hot
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-ura-white mb-2 line-clamp-2 group-hover:text-ura-green transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {article.description}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>5 min read</span>
                  </div>
                  <span>{formatTimeAgo(article.publishedAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingCarousel;
