
import React from 'react';

interface NewsEmptyStateProps {
  message?: string;
}

const NewsEmptyState: React.FC<NewsEmptyStateProps> = ({ 
  message = "No news articles found for this category." 
}) => {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};

export default NewsEmptyState;
