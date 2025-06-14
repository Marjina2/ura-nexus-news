
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw } from 'lucide-react';
import NewsCard from './NewsCard';
import { useNews, NewsArticle, useAIGeneratedArticles } from '@/hooks/useNews';
import { supabase } from '@/integrations/supabase/client';

interface NewsFeedProps {
  category: string;
  country?: string;
  onArticleRead: (article: NewsArticle) => void;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ category, country = 'in', onArticleRead }) => {
  const { articles, isLoading, error, loadMore, hasMore } = useNews(category);
  const { aiArticles, isLoading: aiLoading, generateArticles } = useAIGeneratedArticles(category, country);

  const generateAINews = async () => {
    try {
      await generateArticles();
    } catch (error) {
      console.error('Error generating AI news:', error);
    }
  };

  // Combine regular and AI articles
  const combinedArticles = [
    ...(aiArticles || []).map(article => ({
      ...article,
      source: { name: 'AI News Assistant' },
      urlToImage: article.image_url,
      publishedAt: article.published_at,
      isAI: true
    })),
    ...(articles || [])
  ].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

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
            <h3 className="text-lg font-semibold text-ura-white">AI-Generated News</h3>
            <Badge variant="secondary" className="bg-ura-green text-ura-black">
              {category.charAt(0).toUpperCase() + category.slice(1)} • {country.toUpperCase()}
            </Badge>
          </div>
          <Button
            onClick={generateAINews}
            disabled={aiLoading}
            variant="outline"
            size="sm"
            className="border-ura-green text-ura-green hover:bg-ura-green hover:text-ura-black"
          >
            {aiLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            Generate Fresh News
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Get AI-generated news articles about current events, politics, accidents, and more from India
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {combinedArticles.map((article, index) => (
          <div key={`${article.url || article.id}-${index}`} className="relative">
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
              <div key={i} className="bg-card rounded-lg border border-border overflow-hidden">
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
      {hasMore && !isLoading && (
        <div className="text-center">
          <Button
            onClick={loadMore}
            variant="outline"
            className="border-ura-green/30 hover:border-ura-green text-ura-white"
          >
            Load More Articles
          </Button>
        </div>
      )}

      {/* No More Articles */}
      {!hasMore && combinedArticles.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No more articles to load</p>
        </div>
      )}

      {/* No Articles Found */}
      {!isLoading && !aiLoading && combinedArticles.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No articles found for this category</p>
          <Button
            onClick={generateAINews}
            className="mt-4 bg-ura-green text-ura-black hover:bg-ura-green-hover"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate AI News
          </Button>
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
