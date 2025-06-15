
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EnhancedArticle } from '@/hooks/useNews';
import { useArticleOperations } from '@/hooks/useArticleOperations';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleContent from '@/components/ArticleContent';
import ArticleHeader from '@/components/article/ArticleHeader';
import ArticleFooter from '@/components/article/ArticleFooter';
import EmailVerificationGuard from '@/components/auth/EmailVerificationGuard';

const Article = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [article, setArticle] = useState<EnhancedArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    viewCount,
    cleanTitle,
    formatDate,
    saveArticleAndIncrementViews,
    handleShare,
    handleBookmark,
    handleViewSource,
    getComprehensiveArticleContent,
    isBookmarked
  } = useArticleOperations();

  useEffect(() => {
    const articleData = searchParams.get('data');
    if (articleData) {
      try {
        const parsedArticle = JSON.parse(decodeURIComponent(articleData));
        
        // Ensure we have full content available
        const enhancedArticle = {
          ...parsedArticle,
          // Map the database fields to the expected format
          full_content: parsedArticle.full_content || parsedArticle.content,
          content: parsedArticle.full_content || parsedArticle.content || parsedArticle.summary,
          title: parsedArticle.rephrased_title || parsedArticle.original_title || parsedArticle.title,
          original_title: parsedArticle.original_title || parsedArticle.title,
          summary: parsedArticle.summary || parsedArticle.description,
          source_url: parsedArticle.source_url || parsedArticle.url,
          image_url: parsedArticle.image_url || parsedArticle.urlToImage,
          publishedAt: parsedArticle.created_at || parsedArticle.publishedAt
        };
        
        console.log('Enhanced article data:', enhancedArticle);
        setArticle(enhancedArticle);
        saveArticleAndIncrementViews(enhancedArticle);
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
  }, [searchParams, saveArticleAndIncrementViews]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-ura-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ura-green mx-auto mb-4"></div>
        <div className="text-ura-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth?redirect=/article" replace />;
  }

  if (isLoading) {
    return (
      <EmailVerificationGuard>
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
      </EmailVerificationGuard>
    );
  }

  if (error || !article) {
    return (
      <EmailVerificationGuard>
        <div className="min-h-screen bg-ura-black">
          <Header />
          <main className="pt-32 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-2xl font-bold text-ura-white mb-4">
                {error || 'Article not found'}
              </h1>
            </div>
          </main>
          <Footer />
        </div>
      </EmailVerificationGuard>
    );
  }

  const fullContent = getComprehensiveArticleContent(article);

  return (
    <EmailVerificationGuard>
      <div className="min-h-screen bg-ura-black">
        <Header />
        
        <main className="pt-32 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="bg-card border-border overflow-hidden">
              <CardHeader className="p-0">
                <ArticleHeader
                  article={article}
                  viewCount={viewCount}
                  isBookmarked={isBookmarked(article.source_url || article.url || '')}
                  onBack={() => navigate('/news')}
                  onShare={() => handleShare(article)}
                  onBookmark={() => handleBookmark(article)}
                  formatDate={formatDate}
                  cleanTitle={cleanTitle}
                />
              </CardHeader>

              <CardContent className="space-y-8 px-6 pb-8">
                <div className="prose prose-lg prose-invert max-w-none">
                  <ArticleContent content={fullContent} />
                </div>

                <ArticleFooter
                  article={article}
                  onViewSource={() => handleViewSource(article)}
                />
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </EmailVerificationGuard>
  );
};

export default Article;
