
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Eye, Share2, Bookmark, BookmarkCheck, Sparkles } from 'lucide-react';
import { EnhancedArticle } from '@/hooks/useNews';

interface ArticleHeaderProps {
  article: EnhancedArticle;
  viewCount: number;
  isBookmarked: boolean;
  onBack: () => void;
  onShare: () => void;
  onBookmark: () => void;
  formatDate: (dateString: string) => string;
  cleanTitle: (title: string) => string;
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({
  article,
  viewCount,
  isBookmarked,
  onBack,
  onShare,
  onBookmark,
  formatDate,
  cleanTitle
}) => {
  const cleanedTitle = cleanTitle(article.original_title || article.title || '');

  return (
    <>
      <Button 
        onClick={onBack} 
        variant="ghost" 
        className="mb-6 text-ura-white hover:text-ura-green"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to News
      </Button>

      {(article.image_url || article.urlToImage) && (
        <div className="relative overflow-hidden">
          <img 
            src={article.image_url || article.urlToImage || ''}
            alt={cleanedTitle}
            className="w-full h-64 md:h-96 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop';
            }}
          />
          <Badge className="absolute top-4 right-4 bg-gradient-to-r from-ura-green to-blue-500 text-white">
            <Sparkles className="w-4 h-4 mr-1" />
            Enhanced Content
          </Badge>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      )}

      <div className="space-y-6 relative p-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {formatDate(article.created_at || article.publishedAt || new Date().toISOString())}
          </div>
          {viewCount > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Eye className="w-4 h-4" />
              {viewCount} views
            </div>
          )}
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-ura-white leading-tight">
          {cleanedTitle}
        </h1>

        {(article.summary || article.description) && (
          <p className="text-xl text-muted-foreground leading-relaxed font-medium">
            {article.summary || article.description}
          </p>
        )}

        <div className="flex gap-2 pt-4">
          <Button onClick={onShare} variant="outline" className="flex-1 sm:flex-none">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button onClick={onBookmark} variant="outline" className="flex-1 sm:flex-none">
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 mr-2" />
            ) : (
              <Bookmark className="w-4 h-4 mr-2" />
            )}
            {isBookmarked ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ArticleHeader;
