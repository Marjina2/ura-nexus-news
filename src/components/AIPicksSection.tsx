
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Brain, ArrowRight, Clock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNews } from '@/hooks/useNews';

const AIPicksSection = () => {
  const navigate = useNavigate();
  const { articles, isLoading } = useNews('technology');

  const handleArticleClick = (article: any) => {
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
    if (!url) return '/placeholder.svg';
    if (url.startsWith('//')) return `https:${url}`;
    if (url.startsWith('/')) return '/placeholder.svg';
    return url;
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-ura-black to-purple-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-ura-white mb-4">
              Latest News - <span className="gradient-text">AI Powered</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg border border-border animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg" />
                <div className="p-6 space-y-4">
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

  const latestNews = articles.slice(0, 3).map((article, index) => ({
    ...article,
    aiFeature: ['Real-time Analysis', 'Breaking News Alert', 'Trending Topic'][index],
    priority: ['High', 'Medium', 'High'][index]
  }));

  return (
    <section className="py-16 bg-gradient-to-br from-ura-black to-purple-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-card/50 backdrop-blur-sm border border-ura-green/20 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-ura-green" />
            <span className="text-sm text-ura-white">Latest News Updates</span>
          </div>
          
          <h2 className="text-4xl font-bold text-ura-white mb-4">
            Latest News - <span className="gradient-text">AI Powered</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay ahead with real-time news updates powered by AI. Get the latest stories 
            as they happen, with intelligent analysis and context.
          </p>
        </div>

        {/* Latest News Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {latestNews.map((story, index) => (
            <Card 
              key={`${story.url}-${index}`}
              className="group bg-card border-border hover-lift cursor-pointer overflow-hidden relative"
              onClick={() => handleArticleClick(story)}
            >
              {/* Priority Badge */}
              <div className="absolute top-4 left-4 z-10">
                <Badge className={`${story.priority === 'High' ? 'bg-red-500' : 'bg-orange-500'} text-white`}>
                  <Zap className="w-3 h-3 mr-1" />
                  {story.priority} Priority
                </Badge>
              </div>

              {/* AI Feature Badge */}
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white">
                  {story.aiFeature}
                </div>
              </div>

              <div className="relative">
                <img
                  src={getImageUrl(story.urlToImage)}
                  alt={story.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                    {story.source.name}
                  </Badge>
                  <Badge variant="outline" className="border-ura-green/30 text-ura-green text-xs">
                    Live Update
                  </Badge>
                </div>
                
                <h3 className="font-bold text-ura-white mb-2 group-hover:text-ura-green transition-colors line-clamp-2">
                  {story.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                  {story.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>4 min read</span>
                  </div>
                  <span>Updated {formatTimeAgo(story.publishedAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-ura-green/10 to-blue-500/10 border-ura-green/20 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Brain className="w-6 h-6 text-ura-green" />
                <h3 className="text-2xl font-bold text-ura-white">Never Miss Breaking News</h3>
              </div>
              
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Get real-time notifications for breaking news, AI-powered summaries, and 
                personalized news feeds tailored to your interests.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  size="lg" 
                  className="bg-ura-green text-ura-black hover:bg-ura-green-hover"
                  onClick={() => navigate('/news')}
                >
                  View All Latest News
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-ura-green text-ura-green hover:bg-ura-green hover:text-ura-black"
                  onClick={() => navigate('/auth')}
                >
                  Subscribe for Alerts
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AIPicksSection;
