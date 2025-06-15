
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, ExternalLink } from 'lucide-react';
import { NewsArticleData } from '@/types/news';

interface NewsGridProps {
  articles: NewsArticleData[];
  onArticleClick: (article: NewsArticleData) => void;
  formatDate: (dateString: string) => string;
}

const NewsGrid: React.FC<NewsGridProps> = ({ articles, onArticleClick, formatDate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <Card 
          key={article.id}
          className="bg-card border-border overflow-hidden hover:border-ura-green/50 transition-all duration-200 cursor-pointer group"
          onClick={() => onArticleClick(article)}
        >
          {article.image_url && (
            <div className="relative h-48 overflow-hidden">
              <img
                src={article.image_url}
                alt={article.rephrased_title || article.original_title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          )}
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-ura-white mb-2 line-clamp-2 group-hover:text-ura-green transition-colors">
              {article.rephrased_title || article.original_title}
            </h3>
            
            {article.summary && (
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {article.summary}
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.created_at)}</span>
              </div>
              
              {article.source_url && (
                <div className="flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  <span>Source</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NewsGrid;
