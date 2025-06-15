
import React from 'react';
import { Button } from '@/components/ui/button';

interface NewsErrorStateProps {
  error: Error;
  onRetry: () => void;
}

const NewsErrorState: React.FC<NewsErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="text-center py-12">
      <p className="text-red-500 mb-4">Error loading news articles: {error.message}</p>
      <Button onClick={onRetry}>Try Again</Button>
    </div>
  );
};

export default NewsErrorState;
