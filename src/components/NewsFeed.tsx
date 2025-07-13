
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ExternalLink, Bookmark, Share2 } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { useNews } from '@/hooks/useNews';
import { formatDistanceToNow } from 'date-fns';

const NewsFeed = () => {
  const { isSignedIn } = useUser();
  const { articles, loading, error, fetchNews } = useNews();
  const [bookmarkedArticles, setBookmarkedArticles] = useState<string[]>([]);

  useEffect(() => {
    if (isSignedIn) {
      fetchNews();
    }
  }, [isSignedIn, fetchNews]);

  const handleBookmark = (articleUrl: string) => {
    setBookmarkedArticles(prev => 
      prev.includes(articleUrl) 
        ? prev.filter(url => url !== articleUrl)
        : [...prev, articleUrl]
    );
  };

  const handleShare = (article: any) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: article.url,
      });
    } else {
      navigator.clipboard.writeText(article.url);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Sign in to access your personalized news feed
        </h3>
        <p className="text-muted-foreground">
          Get AI-curated news tailored to your interests
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-destructive mb-4">
          Error Loading News
        </h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchNews}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {articles.map((article, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <CardTitle className="text-lg line-clamp-2">
                {article.title}
              </CardTitle>
              {article.source?.name && (
                <Badge variant="secondary" className="shrink-0">
                  {article.source.name}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
            </div>
          </CardHeader>
          <CardContent>
            {article.urlToImage && (
              <img 
                src={article.urlToImage} 
                alt={article.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <p className="text-muted-foreground mb-4 line-clamp-3">
              {article.description}
            </p>
            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm" asChild>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Read More
                </a>
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBookmark(article.url)}
                  className={bookmarkedArticles.includes(article.url) ? 'text-primary' : ''}
                >
                  <Bookmark className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare(article)}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NewsFeed;
