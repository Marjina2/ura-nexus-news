
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Bookmark, Share2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useNews } from '@/hooks/useNews';

const TopStories = () => {
  const navigate = useNavigate();
  const { articles, isLoading, error } = useNews('general');

  console.log('TopStories - articles:', articles?.length, 'isLoading:', isLoading, 'error:', error);

  const handleArticleClick = (article: any) => {
    console.log('TopStory article clicked:', article.title);
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
    if (!url) return 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop';
    if (url.startsWith('//')) return `https:${url}`;
    if (url.startsWith('/')) return 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop';
    return url;
  };

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-ura-white">Top Stories</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg border border-border animate-pulse">
                <div className="h-80 bg-muted rounded-t-lg" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-card rounded-lg border border-border animate-pulse">
                  <div className="flex">
                    <div className="w-24 h-24 bg-muted" />
                    <div className="p-4 flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-3 bg-muted rounded w-3/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error('TopStories error:', error);
  }

  const topStoriesData = articles || [];
  const featuredStory = topStoriesData[0];
  const regularStories = topStoriesData.slice(1, 4);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <h2 className="text-3xl font-bold text-ura-white">Top Stories</h2>
            <Badge variant="secondary" className="bg-ura-green text-ura-black">
              Latest from India
            </Badge>
          </div>
          <Button 
            variant="outline" 
            className="border-ura-green text-ura-green hover:bg-ura-green hover:text-ura-black"
            onClick={() => navigate('/news')}
          >
            View All Stories
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Story */}
          {featuredStory && (
            <div className="lg:col-span-2">
              <Card 
                className="group bg-card border-border hover-lift cursor-pointer overflow-hidden h-full"
                onClick={() => handleArticleClick(featuredStory)}
              >
                <div className="relative">
                  <img
                    src={getImageUrl(featuredStory.urlToImage)}
                    alt={featuredStory.title}
                    className="w-full h-64 lg:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-ura-green text-ura-black">
                      Featured
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button size="sm" variant="secondary" className="bg-black/50 backdrop-blur-sm">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="bg-black/50 backdrop-blur-sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                      India
                    </Badge>
                    <span className="text-sm text-muted-foreground">from {featuredStory.source.name}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-ura-white mb-3 group-hover:text-ura-green transition-colors">
                    {featuredStory.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {featuredStory.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>5 min read</span>
                      </div>
                      <span>{formatTimeAgo(featuredStory.publishedAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Regular Stories */}
          <div className="space-y-6">
            {regularStories.map((story, index) => (
              <Card 
                key={`${story.url}-${index}`}
                className="group bg-card border-border hover-lift cursor-pointer overflow-hidden"
                onClick={() => handleArticleClick(story)}
              >
                <div className="flex">
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={getImageUrl(story.urlToImage)}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=600&fit=crop';
                      }}
                    />
                  </div>
                  
                  <CardContent className="p-4 flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 text-xs">
                        India
                      </Badge>
                    </div>
                    
                    <h4 className="font-semibold text-ura-white mb-2 line-clamp-2 group-hover:text-ura-green transition-colors text-sm">
                      {story.title}
                    </h4>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>3 min read</span>
                      </div>
                      <span>{formatTimeAgo(story.publishedAt)}</span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}

            {/* Show More Button */}
            <Card className="bg-gradient-to-r from-ura-green/10 to-blue-500/10 border-ura-green/20 cursor-pointer hover-lift">
              <CardContent className="p-6 text-center">
                <h4 className="font-semibold text-ura-white mb-2">More Top Stories</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Discover additional breaking news and trending stories from India
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-ura-green text-ura-green hover:bg-ura-green hover:text-ura-black"
                  onClick={() => navigate('/news')}
                >
                  View All
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopStories;
