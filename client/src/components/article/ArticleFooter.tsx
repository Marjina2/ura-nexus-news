
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { EnhancedArticle } from '@/hooks/useNews';

interface ArticleFooterProps {
  article: EnhancedArticle;
  onViewSource: () => void;
}

const ArticleFooter: React.FC<ArticleFooterProps> = ({ article, onViewSource }) => {
  return (
    <div className="border-t border-border pt-8">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Comprehensive content enhanced by URA News AI for complete coverage
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              Complete Coverage
            </Badge>
            <Badge variant="outline" className="text-xs">
              In-depth Analysis
            </Badge>
            <Badge variant="outline" className="text-xs">
              Expert Commentary
            </Badge>
          </div>
        </div>
        
        {(article.source_url || article.url) && (
          <Button 
            onClick={onViewSource}
            variant="outline"
            className="border-ura-green text-ura-green hover:bg-ura-green hover:text-ura-black"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Original Source
          </Button>
        )}
      </div>
    </div>
  );
};

export default ArticleFooter;
