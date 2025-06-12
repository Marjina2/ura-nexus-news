
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ExternalLink, Clock, Share2, Bookmark } from 'lucide-react';
import { useEnhanceArticle, EnhancedArticle } from '@/hooks/useNews';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Article = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { enhanceArticle } = useEnhanceArticle();
  const [article, setArticle] = useState<EnhancedArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const articleData = searchParams.get('data');
    if (articleData) {
      try {
        const parsedArticle = JSON.parse(decodeURIComponent(articleData));
        setIsLoading(true);
        
        // Enhance the article with Gemini
        enhanceArticle(parsedArticle).then((enhanced) => {
          setArticle(enhanced);
          setIsLoading(false);
        }).catch(() => {
          setArticle(parsedArticle);
          setIsLoading(false);
        });
      } catch (error) {
        console.error('Error parsing article data:', error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [searchParams, navigate, enhanceArticle]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleShare = () => {
    if (navigator.share && article) {
      navigator.share({
        title: article.enhancedTitle || article.title,
        text: article.summary || article.description,
        url: window.location.href
      });
    } else if (article) {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ura-black">
        <Header />
        <main className="pt-32 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-8 w-24 mb-6" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-6" />
            <Skeleton className="h-64 w-full mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-ura-black">
        <Header />
        <main className="pt-32 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold text-ura-white mb-4">Article not found</h1>
            <Button onClick={() => navigate('/')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ura-black">
      <Header />
      
      <main className="pt-32 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <Button 
            onClick={() => navigate('/')} 
            variant="ghost" 
            className="mb-6 text-ura-white hover:text-ura-green"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Button>

          <Card className="bg-card border-border">
            {/* Article Image */}
            {article.urlToImage && (
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-64 md:h-96 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
              </div>
            )}

            <CardHeader className="space-y-4">
              {/* Source and Date */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Badge variant="secondary" className="bg-ura-green text-ura-black">
                  {article.source.name}
                </Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {formatDate(article.publishedAt)}
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-ura-white leading-tight">
                {article.enhancedTitle || article.title}
              </h1>

              {/* Summary */}
              {article.summary && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {article.summary}
                </p>
              )}

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="border-ura-green/30">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={() => window.open(article.url, '_blank')}
                  className="bg-ura-green text-ura-black hover:bg-ura-green-hover"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Read Original
                </Button>
                <Button onClick={handleShare} variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Bookmark
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Key Points */}
              {article.keyPoints && article.keyPoints.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-ura-white mb-3">Key Points</h2>
                  <ul className="space-y-2">
                    {article.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-ura-green rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Enhanced Content */}
              <div>
                <h2 className="text-xl font-semibold text-ura-white mb-3">Article Content</h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {article.enhancedContent || article.content || article.description}
                  </p>
                </div>
              </div>

              {/* Original Source Link */}
              <div className="border-t border-border pt-6">
                <p className="text-sm text-muted-foreground mb-2">
                  This article was originally published by {article.source.name}
                </p>
                <Button 
                  onClick={() => window.open(article.url, '_blank')}
                  variant="outline"
                  size="sm"
                >
                  Read full article on {article.source.name}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Article;
