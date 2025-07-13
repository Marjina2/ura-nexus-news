
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react';
import { useRephrasedNews } from '@/hooks/useRephrasedNews';

const RephrasedNewsFeed = () => {
  const { isSignedIn } = useUser();
  const { articles, isLoading, error, refetch } = useRephrasedNews();

  useEffect(() => {
    if (isSignedIn) {
      refetch();
    }
  }, [isSignedIn, refetch]);

  if (!isSignedIn) {
    return (
      <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-blue-400 text-center">
          📰 Browse news freely! Sign in to read full articles.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">{error.message}</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {articles.map((article, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-xl">
              {article.rephrased_title || article.original_title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {article.image_url && (
              <img 
                src={article.image_url} 
                alt={article.rephrased_title || article.original_title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            {article.summary && (
              <p className="text-muted-foreground mb-4">{article.summary}</p>
            )}
            {article.source_url && (
              <Button variant="outline" asChild>
                <a href={article.source_url} target="_blank" rel="noopener noreferrer">
                  Read Original
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RephrasedNewsFeed;
