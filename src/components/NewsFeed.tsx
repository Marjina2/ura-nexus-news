
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw, Crown } from 'lucide-react';
import NewsCard from './NewsCard';
import { useNews, NewsArticle, useAIGeneratedArticles } from '@/hooks/useNews';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface NewsFeedProps {
  category: string;
  country?: string;
  onArticleRead: (article: NewsArticle) => void;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ category, country = 'in', onArticleRead }) => {
  const { articles, isLoading, error, loadMore, hasMore } = useNews(category, country);
  const { aiArticles, isLoading: aiLoading, generateArticles } = useAIGeneratedArticles(category, country);
  const { user } = useAuth();

  // Check if user has premium access (for now, we'll assume all authenticated users are premium)
  const isPremiumUser = !!user;

  const generateAINews = async () => {
    if (!isPremiumUser) {
      // Redirect to pricing or show premium modal
      window.location.href = '/pricing';
      return;
    }

    try {
      await generateArticles();
    } catch (error) {
      console.error('Error generating AI news:', error);
    }
  };

  // Convert AI articles to NewsArticle format
  const convertAIToNewsArticle = (aiArticle: any): NewsArticle => ({
    id: aiArticle.id,
    title: aiArticle.title,
    description: aiArticle.summary || aiArticle.content.substring(0, 200) + '...',
    url: `#ai-article-${aiArticle.id}`,
    urlToImage: aiArticle.image_url,
    publishedAt: aiArticle.published_at,
    source: { name: 'URA News AI' },
    content: aiArticle.content,
    isAI: true,
    image_url: aiArticle.image_url,
    published_at: aiArticle.published_at,
    tags: aiArticle.tags
  });

  // Combine regular and AI articles
  const combinedArticles = [
    ...(aiArticles || []).map(convertAIToNewsArticle),
    ...(articles || [])
  ].sort((a, b) => new Date(b.publishedAt || b.published_at || '').getTime() - new Date(a.publishedAt || a.published_at || '').getTime());

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Failed to load news</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI News Generation */}
      <div className="bg-gradient-to-r from-ura-green/10 to-blue-500/10 border border-ura-green/20 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-ura-green" />
            <h3 className="text-lg font-semibold text-ura-white">Fresh News from Our Top AI Models</h3>
            <Badge variant="secondary" className="bg-ura-green text-ura-black">
              {category.charAt(0).toUpperCase() + category.slice(1)} • {country.toUpperCase()}
            </Badge>
          </div>
          <Button
            onClick={generateAINews}
            disabled={aiLoading || !isPremiumUser}
            variant="outline"
            size="sm"
            className={`border-ura-green text-ura-green hover:bg-ura-green hover:text-ura-black ${!isPremiumUser ? 'opacity-50' : ''}`}
          >
            {!isPremiumUser && <Crown className="w-4 h-4 mr-2" />}
            {aiLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            {isPremiumUser ? 'Generate Fresh News' : 'Premium Feature'}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {isPremiumUser 
            ? `Get fresh, unique news articles powered by our advanced AI models about ${category} from ${country === 'in' ? 'India' : 'your region'}`
            : 'Upgrade to premium to access AI-generated fresh news articles'
          }
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {combinedArticles.map((article, index) => (
          <div key={`${article.url || article.id}-${index}-${article.publishedAt}`} className="relative">
            {article.isAI && (
              <div className="absolute top-2 right-2 z-10">
                <Badge className="bg-gradient-to-r from-ura-green to-blue-500 text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Generated
                </Badge>
              </div>
            )}
            <NewsCard
              article={article}
              onRead={() => onArticleRead(article)}
            />
          </div>
        ))}
        
        {/* Loading Skeletons */}
        {(isLoading || aiLoading) && (
          <>
            {[...Array(6)].map((_, i) => (
              <div key={`skeleton-${i}`} className="bg-card rounded-lg border border-border overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Load More Button */}
      {hasMore && !isLoading && combinedArticles.length > 0 && (
        <div className="text-center">
          <Button
            onClick={loadMore}
            variant="outline"
            className="border-ura-green/30 hover:border-ura-green text-ura-white"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load More Fresh Articles'}
          </Button>
        </div>
      )}

      {/* No More Articles */}
      {!hasMore && combinedArticles.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">You've reached the end of fresh articles</p>
          {isPremiumUser && (
            <Button
              onClick={generateAINews}
              className="mt-4 bg-ura-green text-ura-black hover:bg-ura-green-hover"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate More AI News
            </Button>
          )}
        </div>
      )}

      {/* No Articles Found */}
      {!isLoading && !aiLoading && combinedArticles.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No articles found for this category</p>
          {isPremiumUser && (
            <Button
              onClick={generateAINews}
              className="mt-4 bg-ura-green text-ura-black hover:bg-ura-green-hover"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate AI News
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
