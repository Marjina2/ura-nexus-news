
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EnhancedArticle } from '@/hooks/useNews';
import { useArticleOperations } from '@/hooks/useArticleOperations';
import { useUser } from '@clerk/clerk-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleContent from '@/components/ArticleContent';
import ArticleHeader from '@/components/article/ArticleHeader';
import ArticleFooter from '@/components/article/ArticleFooter';
import { getArticle, cleanupExpiredArticles } from '@/utils/articleStorage';

const Article = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isSignedIn, isLoaded } = useUser();
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
    // Clean up expired articles on component mount
    cleanupExpiredArticles();
    
    if (!id) {
      setError('No article ID provided');
      setIsLoading(false);
      return;
    }

    try {
      const articleData = getArticle(id);
      
      if (!articleData) {
        setError('Article not found or has expired');
        setIsLoading(false);
        return;
      }
      
      // Ensure we have full content available
      const enhancedArticle = {
        ...articleData,
        // Map the database fields to the expected format
        full_content: articleData.full_content || articleData.content,
        content: articleData.full_content || articleData.content || articleData.summary,
        title: articleData.rephrased_title || articleData.original_title || articleData.title,
        original_title: articleData.original_title || articleData.title,
        summary: articleData.summary || articleData.description,
        source_url: articleData.source_url || articleData.url,
        image_url: articleData.image_url || articleData.urlToImage,
        publishedAt: articleData.created_at || articleData.publishedAt
      };
      
      console.log('Enhanced article data:', enhancedArticle);
      setArticle(enhancedArticle);
      saveArticleAndIncrementViews(enhancedArticle);
      setIsLoading(false);
      setError(null);
    } catch (error) {
      console.error('Error loading article:', error);
      setError('Failed to load article');
      setIsLoading(false);
    }
  }, [id, saveArticleAndIncrementViews]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-ura-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ura-green mx-auto mb-4"></div>
        <div className="text-ura-white">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/auth?redirect=/article" replace />;
  }

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
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const fullContent = getComprehensiveArticleContent(article);

  return (
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
  );
};

export default Article;
