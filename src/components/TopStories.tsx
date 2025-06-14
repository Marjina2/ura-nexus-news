
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Star, BookOpen, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNews } from '@/hooks/useNews';
import { useCachedArticles } from '@/hooks/useNews';

const TopStories = () => {
  const navigate = useNavigate();
  const { articles, isLoading, error } = useNews('general', 'in');
  const { data: cachedArticles } = useCachedArticles();

  const handleArticleRead = (article: any) => {
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
      <section className="py-16 bg-plusee-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Star className="w-6 h-6 text-plusee-green" />
              <h2 className="text-3xl font-bold text-plusee-white">Top Stories from India</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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
    console.error('TopStories error:', error);
  }

  // Combine and prioritize articles: cached articles first, then fresh articles
  const allAvailableArticles = [
    ...(cachedArticles || []).map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.url_to_image,
      publishedAt: article.published_at,
      source: { name: article.source_name },
      content: article.content,
      isPriority: true // Mark cached articles as priority
    })),
    ...(articles || []).slice(0, 8).map(article => ({
      ...article,
      isPriority: false
    }))
  ].slice(0, 6); // Show top 6 stories

  return (
    <section className="py-16 bg-plusee-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Star className="w-6 h-6 text-plusee-green" />
            <h2 className="text-3xl font-bold text-plusee-white">Top Stories from India</h2>
            <Badge variant="secondary" className="bg-plusee-green text-plusee-black">
              <MapPin className="w-3 h-3 mr-1" />
              Live Updates
            </Badge>
          </div>
          <Button 
            onClick={() => navigate('/news')}
            variant="outline"
            className="border-plusee-green text-plusee-green hover:bg-plusee-green hover:text-plusee-black transition-colors"
          >
            View All News
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allAvailableArticles.map((article, index) => (
            <Card 
              key={`${article.url}-${index}`}
              className="group bg-card border-border hover-lift overflow-hidden relative"
            >
              {article.isPriority && (
                <div className="absolute top-2 left-2 z-10">
                  <Badge className="bg-plusee-green text-plusee-black text-xs">
                    Priority
                  </Badge>
                </div>
              )}
              
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
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-plusee-black/80 text-plusee-white backdrop-blur-sm">
                    {article.source.name}
                  </Badge>
                </div>
                <div className="absolute bottom-3 right-3">
                  <Button
                    onClick={() => handleArticleRead(article)}
                    className="bg-plusee-green text-plusee-black hover:bg-plusee-green-hover"
                    size="sm"
                  >
                    <BookOpen className="w-3 h-3 mr-1" />
                    Read
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-plusee-white mb-2 line-clamp-2 hover:text-plusee-green transition-colors cursor-pointer" 
                    onClick={() => handleArticleRead(article)}>
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {article.description || 'Latest news update from India...'}
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

        {allAvailableArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Star className="w-12 h-12 mx-auto mb-2 text-plusee-green/50" />
              <p>Loading the latest Indian news stories...</p>
            </div>
            <Button 
              onClick={() => navigate('/news')}
              className="bg-plusee-green text-plusee-black hover:bg-plusee-green-hover"
            >
              Browse All News
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TopStories;
