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

  const cleanTitle = (title: string) => {
    // Remove numbers, special characters, and clean up the title
    return title
      .replace(/^\d+\.\s*/, '') // Remove leading numbers like "1. "
      .replace(/\[\d+\]/g, '') // Remove numbers in brackets like [1]
      .replace(/\(\d+\)/g, '') // Remove numbers in parentheses like (1)
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
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

  const getEngagingArticleContent = (article: any) => {
    if (article.content && article.content.length > 200) {
      return article.content;
    }

    const baseContent = article.description || cleanTitle(article.title);
    const cleanedTitle = cleanTitle(article.title);
    
    return `${baseContent}

In an era of rapidly evolving news landscapes, this story has emerged as a significant development that demands attention from readers across various demographics. The implications of these events extend far beyond their immediate scope, potentially influencing policy decisions, market dynamics, and public discourse in meaningful ways.

Understanding the Context

What makes this story particularly compelling is its multifaceted nature. Unlike typical news items that focus on a single aspect, this development touches upon several interconnected themes that resonate with different segments of society. Industry experts have been closely monitoring similar trends, and their analysis suggests that this could be a pivotal moment worth examining.

The situation has unfolded over recent weeks, with key stakeholders from various sectors weighing in on the potential outcomes. Their perspectives paint a picture of cautious optimism mixed with strategic considerations about future implications.

Key Developments and Analysis

Recent reports indicate that the core issues at stake involve complex decision-making processes that require careful balance between competing interests. Sources close to the matter suggest that behind-the-scenes discussions have been ongoing, with participants working toward solutions that address multiple concerns simultaneously.

The response from the community has been notably engaged, with various groups expressing their viewpoints through official channels and public forums. This level of civic participation demonstrates the importance people place on staying informed about developments that could affect their daily lives.

Industry observers note that similar situations in the past have led to innovative approaches and unexpected collaborations between different organizations. The current scenario appears to be following a comparable trajectory, though with unique characteristics that set it apart from previous cases.

Looking Ahead: Implications and Expectations

As events continue to unfold, stakeholders are preparing for various scenarios while maintaining flexibility in their approach. The adaptive strategies being employed reflect lessons learned from past experiences and a commitment to responsive decision-making.

Market analysts suggest that the outcomes could influence broader trends across multiple sectors, making this a story worth following for anyone interested in understanding how current events shape future developments. The interconnected nature of modern systems means that changes in one area often create ripple effects elsewhere.

Educational institutions and research organizations have also taken note, with some incorporating related case studies into their curricula to help students understand real-world applications of theoretical concepts.

Community Impact and Participation

Local communities have shown remarkable engagement with the issues at hand, organizing discussion forums and information sessions to ensure residents stay well-informed. This grassroots involvement demonstrates the democratic process at work and highlights the importance of public participation in shaping outcomes.

The collaborative spirit evident in these community efforts serves as a model for how citizens can constructively engage with complex issues. Rather than remaining passive observers, people are taking active roles in understanding and influencing developments that affect their neighborhoods and interests.

Professional organizations have also contributed valuable insights, drawing upon their expertise to provide analysis and recommendations. Their involvement adds depth to the public understanding and helps ensure that all relevant perspectives are considered.

Technological and Innovation Aspects

Modern technology has played a crucial role in how information about these developments is shared and discussed. Digital platforms have enabled real-time communication between stakeholders, facilitating faster response times and more coordinated efforts.

Innovation in communication strategies has also been evident, with organizations adopting new approaches to reach different audiences effectively. These methods ensure that important information reaches all segments of the population, regardless of their preferred communication channels.

The integration of traditional and digital media has created a comprehensive information ecosystem that serves the public interest while maintaining accuracy and credibility.

Conclusion: Moving Forward Together

As this story continues to develop, the emphasis remains on collaborative problem-solving and inclusive decision-making processes. The commitment to transparency and public engagement sets a positive precedent for handling similar situations in the future.

The lessons learned from this experience will likely influence how comparable challenges are addressed going forward, contributing to more effective and responsive approaches to complex issues that affect communities and organizations alike.

This ongoing story serves as a reminder of the importance of staying informed, participating in civic processes, and working together toward solutions that benefit everyone involved.`;
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

  const fullContent = getEngagingArticleContent(article);
  const cleanedTitle = cleanTitle(article.title);

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
                {cleanedTitle}
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
                  Article {article.isAI ? 'generated by URA News AI' : 'from trusted news sources'}
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
