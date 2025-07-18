
import React, { memo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { NewsArticleData } from '@/types/news';

interface NewsGridProps {
  articles: NewsArticleData[];
  onArticleClick: (article: NewsArticleData) => void;
  formatDate: (dateString: string) => { timeAgo: string; fullDate: string };
}

const NewsGrid: React.FC<NewsGridProps> = memo(({ articles, onArticleClick, formatDate }) => {
  const handleArticleClick = useCallback((article: NewsArticleData) => {
    onArticleClick(article);
  }, [onArticleClick]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {articles.map((article) => (
        <MemoizedNewsCard
          key={article.id}
          article={article}
          onArticleClick={handleArticleClick}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
});

const MemoizedNewsCard = memo(({ article, onArticleClick, formatDate }: {
  article: NewsArticleData;
  onArticleClick: (article: NewsArticleData) => void;
  formatDate: (dateString: string) => { timeAgo: string; fullDate: string };
}) => {
  const handleClick = useCallback(() => {
    onArticleClick(article);
  }, [article, onArticleClick]);

  return (
    <Card 
      className="bg-card border-border overflow-hidden cursor-pointer hover:border-primary/20 transition-colors"
      onClick={handleClick}
    >
      {article.image_url && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.image_url}
            alt={article.rephrased_title || article.original_title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
            loading="lazy"
          />
        </div>
      )}
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
          {article.rephrased_title || article.original_title}
        </h3>
        
        {article.summary && (
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
            {article.summary}
          </p>
        )}

        <div className="flex flex-col gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <div className="flex flex-col">
              <span>{formatDate(article.created_at).timeAgo}</span>
              <span className="text-[10px] opacity-75">{formatDate(article.created_at).fullDate}</span>
            </div>
          </div>
          
          {article.source_name && (
            <div className="flex items-center">
              <span>{article.source_name}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

MemoizedNewsCard.displayName = 'MemoizedNewsCard';
NewsGrid.displayName = 'NewsGrid';

export default NewsGrid;
