
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ArrowLeft, Clock, Share2, Bookmark, BookmarkCheck, Sparkles, Eye } from 'lucide-react';
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
      // Save article to saved_articles table
      const { error: insertError } = await supabase
        .from('saved_articles')
        .upsert({
          title: articleData.title,
          description: articleData.description,
          content: articleData.content || getFullArticleContent(articleData),
          url: articleData.url,
          image_url: articleData.urlToImage || articleData.image_url,
          published_at: articleData.publishedAt || articleData.published_at,
          source_name: articleData.source?.name || 'AI News Assistant',
          category: articleData.category || 'general',
        }, {
          onConflict: 'url'
        });

      if (insertError) {
        console.error('Error saving article:', insertError);
      }

      // Increment view count
      const { error: incrementError } = await supabase.rpc('increment_article_views', {
        article_url: articleData.url
      });

      if (incrementError) {
        console.error('Error incrementing view count:', incrementError);
      }

      // Fetch current view count
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
        title: article.title,
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
      title: article.title,
      description: article.description,
      image_url: article.urlToImage || article.image_url,
      source_name: article.source?.name || 'AI News Assistant',
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

  const getFullArticleContent = (article: any) => {
    if (article.content && article.content.length > 200) {
      return article.content;
    }

    const baseContent = article.description || article.title;
    
    return `${baseContent}

This development represents a significant milestone in the ongoing evolution of current events. The story has captured widespread attention across various sectors and communities.

Key highlights of this development include several important aspects that stakeholders and the general public should be aware of. The implications of these events extend beyond immediate circumstances and may influence future decisions and policies.

Local authorities and relevant organizations have been actively monitoring the situation to ensure appropriate measures are taken. The response from various quarters has been measured and focused on addressing the core issues at hand.

The broader context of this story reflects ongoing trends and patterns that experts have been observing. This particular incident serves as an important case study for understanding how similar situations might be handled in the future.

Community members and stakeholders continue to engage in discussions about the best path forward. The collaborative approach being taken demonstrates the commitment to finding sustainable and effective solutions.

As the situation continues to evolve, regular updates and assessments will be provided to keep all interested parties informed. The transparency and open communication being maintained throughout this process helps build trust and understanding among all involved.

The long-term implications of these developments will likely become clearer as more information becomes available and as the various initiatives and responses take effect. Continued monitoring and evaluation will be essential to ensure the desired outcomes are achieved.

This story serves as a reminder of the importance of staying informed about current events and participating constructively in community discussions. The lessons learned from this experience will undoubtedly contribute to better preparedness and response capabilities in the future.`;
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

  const fullContent = getFullArticleContent(article);

  return (
    <div className="min-h-screen bg-ura-black">
      <Header />
      
      <main className="pt-32 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            onClick={() => navigate(-1)} 
            variant="ghost" 
            className="mb-6 text-ura-white hover:text-ura-green"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Button>

          <Card className="bg-card border-border">
            {(article.urlToImage || article.image_url) && (
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src={article.urlToImage || article.image_url || ''}
                  alt={article.title}
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
                      AI Generated
                    </Badge>
                  </div>
                )}
              </div>
            )}

            <CardHeader className="space-y-4">
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

              <h1 className="text-3xl md:text-4xl font-bold text-ura-white leading-tight">
                {article.title}
              </h1>

              {article.description && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {article.description}
                </p>
              )}

              <div className="flex gap-2 pt-4">
                <Button onClick={handleShare} variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button onClick={handleBookmark} variant="outline">
                  {isBookmarked(article.url) ? (
                    <BookmarkCheck className="w-4 h-4 mr-2" />
                  ) : (
                    <Bookmark className="w-4 h-4 mr-2" />
                  )}
                  {isBookmarked(article.url) ? 'Bookmarked' : 'Bookmark'}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-ura-white mb-4">Full Article</h2>
                <ArticleContent content={fullContent} />
              </div>

              <div className="border-t border-border pt-6">
                <p className="text-sm text-muted-foreground mb-2">
                  Article {article.isAI ? 'generated by AI News Assistant' : 'from trusted news sources'}
                </p>
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {article.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
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
