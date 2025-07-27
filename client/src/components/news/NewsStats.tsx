
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface NewsStatsProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onRefresh: () => void;
}

const NewsStats: React.FC<NewsStatsProps> = ({
  currentPage,
  totalPages,
  totalCount,
  onRefresh
}) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages || 1} • {totalCount} articles
      </div>
      <Button
        onClick={onRefresh}
        variant="outline"
        size="sm"
        className="border-ura-green/40 hover:border-ura-green text-ura-white"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh
      </Button>
    </div>
  );
};

export default NewsStats;
