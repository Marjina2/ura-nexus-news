
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsHeader from '@/components/news/NewsHeader';
import CategoryFilters from '@/components/news/CategoryFilters';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Calendar, ExternalLink } from 'lucide-react';
import EmailVerificationGuard from '@/components/auth/EmailVerificationGuard';

const categories = ['all', 'general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];

// Define a simple interface for the news article data
interface NewsArticleData {
  id: string;
  original_title: string;
  rephrased_title: string | null;
  summary: string | null;
  image_url: string | null;
  source_url: string | null;
  created_at: string;
}

const News = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Extract the query function to avoid complex type inference
  const fetchNewsArticles = async () => {
    console.log('Fetching news articles...');
    let query = supabase
      .from('news_articles')
      .select('id, original_title, rephrased_title, summary, image_url, source_url, created_at')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (selectedCategory !== 'all') {
      query = query.eq('category', selectedCategory);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Articles error:', error);
      throw error;
    }
    console.log('Articles data:', data);
    return (data || []) as NewsArticleData[];
  };

  const { data: newsArticles, isLoading, error } = useQuery({
    queryKey: ['news-articles', selectedCategory],
    queryFn: fetchNewsArticles,
    enabled: !!user,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-ura-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ura-green mx-auto mb-4"></div>
        <div className="text-ura-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth?redirect=/news" replace />;
  }

  const handleBack = () => {
    navigate('/');
  };

  const handleArticleClick = (article: NewsArticleData) => {
    const articleData = encodeURIComponent(JSON.stringify({
      ...article,
      url: article.source_url || '#',
      source: { name: 'URA News' }
    }));
    navigate(`/article?data=${articleData}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <EmailVerificationGuard>
      <div className="min-h-screen bg-ura-black">
        <Header />
        
        <main className="pt-32 pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <NewsHeader onBack={handleBack} />
            
            <CategoryFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="bg-card border-border overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">Error loading news articles</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </div>
            ) : !newsArticles || newsArticles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No news articles found for this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsArticles.map((article) => (
                  <Card 
                    key={article.id}
                    className="bg-card border-border overflow-hidden hover:border-ura-green/50 transition-all duration-200 cursor-pointer group"
                    onClick={() => handleArticleClick(article)}
                  >
                    {article.image_url && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={article.image_url}
                          alt={article.rephrased_title || article.original_title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-ura-white mb-2 line-clamp-2 group-hover:text-ura-green transition-colors">
                        {article.rephrased_title || article.original_title}
                      </h3>
                      
                      {article.summary && (
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                          {article.summary}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(article.created_at)}</span>
                        </div>
                        
                        {article.source_url && (
                          <div className="flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                            <span>Source</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </EmailVerificationGuard>
  );
};

export default News;
