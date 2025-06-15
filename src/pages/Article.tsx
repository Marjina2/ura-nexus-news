import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ArrowLeft, Clock, Share2, Bookmark, BookmarkCheck, Sparkles, Eye, ExternalLink } from 'lucide-react';
import { useEnhanceArticle, EnhancedArticle } from '@/hooks/useNews';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleContent from '@/components/ArticleContent';

const Article = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const [article, setArticle] = useState<EnhancedArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    const articleData = searchParams.get('data');
    if (articleData) {
      try {
        const parsedArticle = JSON.parse(decodeURIComponent(articleData));
        setArticle(parsedArticle);
        saveArticleAndIncrementViews(parsedArticle);
        setIsLoading(false);
        setError(null);
      } catch (error) {
        console.error('Error parsing article data:', error);
        setError('Failed to load article');
        setIsLoading(false);
      }
    } else {
      setError('No article data found');
      setIsLoading(false);
    }
  }, [searchParams]);

  const saveArticleAndIncrementViews = async (articleData: any) => {
    try {
      const { error: insertError } = await supabase
        .from('saved_articles')
        .upsert({
          title: cleanTitle(articleData.title),
          description: articleData.description,
          content: articleData.content || getEngagingArticleContent(articleData),
          url: articleData.url,
          image_url: articleData.urlToImage || articleData.image_url,
          published_at: articleData.publishedAt || articleData.published_at,
          source_name: 'URA News',
          category: articleData.category || 'general',
        }, {
          onConflict: 'url'
        });

      if (insertError) {
        console.error('Error saving article:', insertError);
      }

      const { error: incrementError } = await supabase.rpc('increment_article_views', {
        article_url: articleData.url
      });

      if (incrementError) {
        console.error('Error incrementing view count:', incrementError);
      }

      const { data: viewData } = await supabase
        .from('saved_articles')
        .select('view_count')
        .eq('url', articleData.url)
        .single();

      if (viewData) {
        setViewCount(viewData.view_count);
      }
    } catch (error) {
      console.error('Error in saveArticleAndIncrementViews:', error);
    }
  };

  const cleanTitle = (title: string) => {
    return title
      .replace(/^\d+\.\s*/, '')
      .replace(/\[\d+\]/g, '')
      .replace(/\(\d+\)/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

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
        title: cleanTitle(article.title),
        text: article.description,
        url: window.location.href
      });
    } else if (article) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Article link copied to clipboard!');
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.error('Please sign in to bookmark articles');
      return;
    }

    if (!article) return;

    const bookmarkData = {
      url: article.url,
      title: cleanTitle(article.title),
      description: article.description,
      image_url: article.urlToImage || article.image_url,
      source_name: 'URA News',
    };

    if (isBookmarked(article.url)) {
      const success = await removeBookmark(article.url);
      if (success) {
        toast.success('Bookmark removed');
      } else {
        toast.error('Failed to remove bookmark');
      }
    } else {
      const success = await addBookmark(bookmarkData);
      if (success) {
        toast.success('Article bookmarked!');
      } else {
        toast.error('Failed to bookmark article');
      }
    }
  };

  const handleViewSource = () => {
    if (article?.url) {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };

  const getEngagingArticleContent = (article: any) => {
    if (article.content && article.content.length > 200) {
      return article.content;
    }

    const baseContent = article.description || cleanTitle(article.title);
    const cleanedTitle = cleanTitle(article.title);
    
    return `${baseContent}

Understanding the Context

This story represents a significant development in today's rapidly evolving news landscape. The implications extend beyond the immediate scope, potentially influencing policy decisions, market dynamics, and public discourse in meaningful ways.

Key Developments and Analysis

Recent reports indicate that the core issues involve complex decision-making processes requiring careful balance between competing interests. Sources suggest that behind-the-scenes discussions have been ongoing, with participants working toward comprehensive solutions.

The response from stakeholders has been notably engaged, with various groups expressing viewpoints through official channels and public forums. This level of participation demonstrates the importance people place on staying informed about developments affecting their communities.

Industry experts note that similar situations have historically led to innovative approaches and collaborative solutions. The current scenario appears to follow a comparable trajectory, though with unique characteristics that distinguish it from previous cases.

Looking Ahead: Implications and Expectations

As events continue to unfold, stakeholders are preparing for various scenarios while maintaining flexibility in their approach. The adaptive strategies reflect lessons learned from past experiences and commitment to responsive decision-making.

Market analysts suggest the outcomes could influence broader trends across multiple sectors, making this a story worth following for anyone interested in understanding how current events shape future developments.

Community Impact and Participation

Local communities have shown remarkable engagement, organizing discussion forums and information sessions to ensure residents stay well-informed. This grassroots involvement demonstrates democratic processes at work and highlights the importance of public participation.

The collaborative spirit evident in these efforts serves as a model for constructive engagement with complex issues. Professional organizations have also contributed valuable insights, drawing upon expertise to provide analysis and recommendations.

Moving Forward Together

This ongoing story serves as a reminder of the importance of staying informed, participating in civic processes, and working together toward solutions that benefit all stakeholders involved.`;
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

  if (error || !article) {
    return (
      <div className="min-h-screen bg-ura-black">
        <Header />
        <main className="pt-32 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold text-ura-white mb-4">
              {error || 'Article not found'}
            </h1>
            <Button onClick={() => navigate('/news')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const fullContent = getEngagingArticleContent(article);
  const cleanedTitle = cleanTitle(article.title);

  return (
    <div className="min-h-screen bg-ura-black">
      <Header />
      
      <main className="pt-32 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            onClick={() => navigate('/news')} 
            variant="ghost" 
            className="mb-6 text-ura-white hover:text-ura-green"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Button>

          <Card className="bg-card border-border overflow-hidden">
            {(article.urlToImage || article.image_url) && (
              <div className="relative overflow-hidden">
                <img 
                  src={article.urlToImage || article.image_url || ''}
                  alt={cleanedTitle}
                  className="w-full h-64 md:h-96 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop';
                  }}
                />
                {article.isAI && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-ura-green to-blue-500 text-white">
                      <Sparkles className="w-4 h-4 mr-1" />
                      AI Enhanced
                    </Badge>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            )}

            <CardHeader className="space-y-6 relative">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {formatDate(article.publishedAt || article.published_at || '')}
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

              {article.description && (
                <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                  {article.description}
                </p>
              )}

              <div className="flex gap-2 pt-4">
                <Button onClick={handleShare} variant="outline" className="flex-1 sm:flex-none">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button onClick={handleBookmark} variant="outline" className="flex-1 sm:flex-none">
                  {isBookmarked(article.url) ? (
                    <BookmarkCheck className="w-4 h-4 mr-2" />
                  ) : (
                    <Bookmark className="w-4 h-4 mr-2" />
                  )}
                  {isBookmarked(article.url) ? 'Saved' : 'Save'}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-8 px-6 pb-8">
              <div className="prose prose-lg prose-invert max-w-none">
                <ArticleContent content={fullContent} />
              </div>

              <div className="border-t border-border pt-8">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Article enhanced by URA News AI for better readability
                    </p>
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {article.url && (
                    <Button 
                      onClick={handleViewSource}
                      className="bg-ura-green text-ura-black hover:bg-ura-green-hover"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Source
                    </Button>
                  )}
                </div>
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
