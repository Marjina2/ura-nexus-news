
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, RefreshCw, Calendar, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  image_url: string;
  created_at: string;
  tags: string[];
}

const categories = ['all', 'general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];

const News: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const articlesPerPage = 10;

  const { data: articles = [], isLoading, error, refetch } = useQuery({
    queryKey: ['ai-articles', selectedCategory],
    queryFn: async () => {
      console.log('Fetching articles for category:', selectedCategory);
      let query = supabase
        .from('ai_generated_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching articles:', error);
        throw error;
      }
      
      console.log('Fetched articles:', data?.length);
      return data || [];
    },
  });

  const generateArticles = async () => {
    setIsGenerating(true);
    try {
      console.log('Starting article generation...');
      const category = selectedCategory === 'all' ? 'general' : selectedCategory;
      
      const { data, error } = await supabase.functions.invoke('generate-ai-news', {
        body: { 
          category: category,
          count: 10 
        }
      });

      if (error) {
        console.error('Function error:', error);
        throw error;
      }

      console.log('Generation response:', data);
      const articlesCount = data?.articles?.length || 0;
      toast.success(`Generated ${articlesCount} new articles!`);
      
      // Invalidate and refetch articles
      await queryClient.invalidateQueries({ queryKey: ['ai-articles'] });
      await refetch();
      
    } catch (error) {
      console.error('Error generating articles:', error);
      toast.error('Failed to generate articles. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleArticleClick = (article: NewsArticle) => {
    if (!user) {
      navigate('/auth?redirect=' + encodeURIComponent(`/article?data=${encodeURIComponent(JSON.stringify({
        ...article,
        url: '#',
        source: { name: 'URA News AI' }
      }))}`));
      return;
    }
    
    const articleData = encodeURIComponent(JSON.stringify({
      ...article,
      url: '#',
      source: { name: 'URA News AI' }
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

  // Pagination
  const totalPages = Math.ceil(articles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = articles.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-ura-black flex flex-col">
      <Header />
      <main className="pt-28 pb-12 flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <Button 
            onClick={() => navigate('/')} 
            variant="ghost" 
            className="mb-6 text-ura-white hover:text-ura-green"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-ura-white mb-4">
              AI Generated News
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Fresh AI-generated news articles powered by advanced language models
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className={selectedCategory === category ? "bg-ura-green text-ura-black" : ""}
                size="sm"
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>

          {/* Stats and Generate Button */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages || 1} • {articles.length} articles
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => refetch()}
                variant="outline"
                size="sm"
                className="border-ura-green/40 hover:border-ura-green text-ura-white"
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={generateArticles}
                disabled={isGenerating}
                className="bg-ura-green text-ura-black hover:bg-ura-green-hover"
                size="sm"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate Articles'}
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
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
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">Error loading articles: {error.message}</p>
              <Button onClick={() => refetch()}>Try Again</Button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && articles.length === 0 && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <Sparkles className="w-16 h-16 mx-auto text-ura-green mb-4" />
                  <h3 className="text-xl font-semibold text-ura-white mb-2">No Articles Yet</h3>
                  <p className="text-muted-foreground">
                    No articles found for this category. Generate some fresh AI articles to get started!
                  </p>
                </div>
                <Button
                  onClick={generateArticles}
                  disabled={isGenerating}
                  className="bg-ura-green text-ura-black hover:bg-ura-green-hover"
                  size="lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {isGenerating ? 'Generating Articles...' : 'Generate 10 Articles'}
                </Button>
              </div>
            </div>
          )}

          {/* Articles Grid */}
          {!isLoading && !error && currentArticles.length > 0 && (
            <>
              {!user && (
                <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-blue-400 text-center">
                    📰 Browse news freely! Sign in to read full articles.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {currentArticles.map((article) => (
                  <Card 
                    key={article.id}
                    className="bg-card border-border overflow-hidden hover:border-ura-green/50 transition-all duration-200 cursor-pointer group"
                    onClick={() => handleArticleClick(article)}
                  >
                    {article.image_url && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            // Fallback to a placeholder if image fails to load
                            e.currentTarget.src = `https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&h=600&fit=crop&auto=format`;
                          }}
                        />
                        <div className="absolute top-3 left-3">
                          <Badge variant="secondary" className="bg-ura-green/90 text-ura-black font-medium">
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI
                          </Badge>
                        </div>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-ura-white mb-2 line-clamp-2 group-hover:text-ura-green transition-colors">
                        {article.title}
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
                        
                        <Badge variant="outline" className="text-xs">
                          {article.category}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <Button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                    className="border-ura-green/40 hover:border-ura-green text-ura-white disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex gap-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNumber = Math.max(1, currentPage - 2) + i;
                      if (pageNumber > totalPages) return null;
                      return (
                        <Button
                          key={pageNumber}
                          onClick={() => goToPage(pageNumber)}
                          variant={currentPage === pageNumber ? "default" : "outline"}
                          size="sm"
                          className={currentPage === pageNumber 
                            ? "bg-ura-green text-ura-black" 
                            : "border-ura-green/40 hover:border-ura-green text-ura-white"
                          }
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                    className="border-ura-green/40 hover:border-ura-green text-ura-white disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default News;
