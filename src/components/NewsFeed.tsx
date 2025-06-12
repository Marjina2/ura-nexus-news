
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import NewsCard from './NewsCard';
import { useNews, NewsArticle } from '@/hooks/useNews';

interface NewsFeedProps {
  category: string;
  onArticleRead: (article: NewsArticle) => void;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ category, onArticleRead }) => {
  const { articles, isLoading, error, loadMore, hasMore } = useNews(category);
  const navigate = useNavigate();

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
      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <NewsCard
            key={`${article.url}-${index}`}
            article={article}
            onRead={() => onArticleRead(article)}
          />
        ))}
        
        {/* Loading Skeletons */}
        {isLoading && (
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
      {!hasMore && articles.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No more articles to load</p>
        </div>
      )}

      {/* No Articles Found */}
      {!isLoading && articles.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No articles found for this category</p>
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
