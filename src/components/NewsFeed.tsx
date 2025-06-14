
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw, Crown, Zap } from 'lucide-react';
import NewsCard from './NewsCard';
import { useNews, NewsArticle, useAIGeneratedArticles } from '@/hooks/useNews';
import { useAuth } from '@/contexts/AuthContext';
import { useSerpApi } from '@/hooks/useSerpApi';

interface NewsFeedProps {
  category: string;
  country?: string;
  onArticleRead: (article: NewsArticle) => void;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ category, country = 'in', onArticleRead }) => {
  const { articles, isLoading, error, loadMore, hasMore } = useNews(category, country);
  const { aiArticles, isLoading: aiLoading, generateArticles } = useAIGeneratedArticles(category, country);
  const { user } = useAuth();
  const { searchNews, isLoading: serpLoading } = useSerpApi();
  const [serpArticles, setSerpArticles] = useState<NewsArticle[]>([]);

  // Check if user has premium access
  const isPremiumUser = !!user;

  const generateAINews = async () => {
    if (!isPremiumUser) {
      window.location.href = '/pricing';
      return;
    }

    try {
      await generateArticles();
    } catch (error) {
      console.error('Error generating AI news:', error);
    }
  };

  // Fetch SERP news with priority
  useEffect(() => {
    const fetchSerpNews = async () => {
      const serpApiKey = localStorage.getItem('serpApiKey');
      if (serpApiKey && isPremiumUser) {
        try {
          const query = `${category} news ${country === 'in' ? 'India' : country}`;
          const serpResults = await searchNews(query, serpApiKey);
          
          const convertedArticles = serpResults.map((result, index) => ({
            id: `serp-${index}`,
            title: result.title,
            description: result.snippet,
            url: result.link,
            urlToImage: result.thumbnail || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop',
            publishedAt: result.date,
            source: { name: result.source },
            content: result.snippet,
            isSERP: true
          }));

          setSerpArticles(convertedArticles);
        } catch (error) {
          console.error('Error fetching SERP news:', error);
        }
      }
    };

    fetchSerpNews();
  }, [category, country, isPremiumUser, searchNews]);

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

  // Combine and prioritize articles: SERP > AI > Regular
  const combinedArticles = [
    ...serpArticles,
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
      {/* SERP Priority Notice */}
      {serpArticles.length > 0 && (
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-ura-white">Premium SERP API Results</h3>
            <Badge className="bg-blue-500 text-white">
              {serpArticles.length} articles
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Showing latest news from SERP API with highest priority
          </p>
        </div>
      )}

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {combinedArticles.map((article, index) => (
          <div key={`${article.url || article.id}-${index}-${article.publishedAt}`} className="relative">
            {article.isSERP && (
              <div className="absolute top-2 left-2 z-10">
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  <Zap className="w-3 h-3 mr-1" />
                  SERP API
                </Badge>
              </div>
            )}
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
        {(isLoading || aiLoading || serpLoading) && (
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

      {/* Generate More Options */}
      {!hasMore && combinedArticles.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">You've reached the end of fresh articles</p>
          {isPremiumUser && (
            <div className="flex gap-2 justify-center">
              <Button
                onClick={generateAINews}
                className="bg-ura-green text-ura-black hover:bg-ura-green-hover"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate More AI News
              </Button>
            </div>
          )}
        </div>
      )}

      {/* No Articles Found */}
      {!isLoading && !aiLoading && !serpLoading && combinedArticles.length === 0 && (
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
