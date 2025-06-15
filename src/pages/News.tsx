
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Clock, TrendingUp, Sparkles, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import LoginPromptModal from '@/components/auth/LoginPromptModal';
import { useToast } from '@/hooks/use-toast';

const News = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch spotlight news
  const { data: spotlight, isLoading: spotlightLoading, error: spotlightError } = useQuery({
    queryKey: ['spotlight-news'],
    queryFn: async () => {
      console.log('Fetching spotlight news...');
      const today = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from('spotlight_news')
        .select('*')
        .eq('date', today)
        .maybeSingle();
      
      if (error) {
        console.error('Spotlight error:', error);
        throw error;
      }
      console.log('Spotlight data:', data);
      return data;
    },
  });

  // Fetch rephrased news articles
  const { data: articles = [], isLoading: articlesLoading, error: articlesError, refetch } = useQuery({
    queryKey: ['news-articles', selectedCategory],
    queryFn: async () => {
      console.log('Fetching news articles...');
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Articles error:', error);
        throw error;
      }
      console.log('Articles data:', data);
      return data;
    },
  });

  const categories = ['general', 'business', 'technology', 'sports', 'health', 'entertainment'];

  const handleArticleClick = (article: any) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    if (article.source_url) {
      window.open(article.source_url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleGenerateNews = async () => {
    setIsGenerating(true);
    try {
      console.log('Calling auto-publish-gnews function...');
      const { data, error } = await supabase.functions.invoke('auto-publish-gnews');
      
      if (error) {
        console.error('Function error:', error);
        throw error;
      }
      
      console.log('Function response:', data);
      toast({
        title: "News Generated!",
        description: `Successfully generated ${data?.saved || 0} new articles`,
      });
      
      // Refetch the articles
      refetch();
    } catch (error) {
      console.error('Error generating news:', error);
      toast({
        title: "Error",
        description: "Failed to generate news. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
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

  const isLoading = spotlightLoading || articlesLoading;

  return (
    <div className="min-h-screen bg-pulsee-black">
      <Header />
      <main className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Home */}
          <Button 
            onClick={() => navigate('/')} 
            variant="ghost" 
            className="mb-6 text-pulsee-white hover:text-pulsee-green"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-pulsee-white mb-4">
              Latest Fresh News
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Stay updated with fresh, unique news powered by AI from trusted sources
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-pulsee-green text-pulsee-black" : ""}
                size="sm"
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>

          {/* Error States */}
          {(spotlightError || articlesError) && (
            <div className="mb-8 p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span>Error loading news: {spotlightError?.message || articlesError?.message}</span>
              </div>
            </div>
          )}

          {/* Spotlight Section */}
          {spotlight && (
            <div className="relative py-8 bg-gradient-to-br from-red-900/30 via-orange-900/20 to-yellow-900/10 border border-red-500/20 rounded-2xl mb-8 overflow-hidden">
              <div className="absolute inset-0 opacity-10 animate-pulse bg-grid" />
              <div className="relative max-w-3xl mx-auto flex flex-col items-center gap-6 px-4">
                <span className="inline-block mb-2 text-lg text-red-400 uppercase font-bold tracking-widest">
                  Today's Spotlight
                </span>
                <div className="w-full max-w-lg h-56 rounded-xl overflow-hidden border border-red-500/30 bg-black/20 mx-auto shrink-0 mb-4">
                  <img 
                    src={spotlight.image_url || "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop"} 
                    alt={spotlight.seo_title} 
                    className="object-cover w-full h-full" 
                  />
                </div>
                <div className="text-center">
                  <h2 className="text-3xl md:text-4xl font-bold text-pulsee-white mb-4">
                    {spotlight.seo_title || spotlight.gemini_topic}
                  </h2>
                  <p className="mb-6 text-muted-foreground">{spotlight.summary}</p>
                  <Button
                    onClick={() => navigate(`/spotlight/${spotlight.date}`)}
                    className="bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 px-6 py-3 text-lg font-semibold rounded-full"
                  >
                    Read Full Coverage <ExternalLink className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* AI-Rephrased News Section */}
          <div className="mb-12">
            <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-ura-green mb-2 flex items-center gap-2">
                  <Sparkles /> AI-Rephrased Fresh News
                </h2>
                <div className="max-w-2xl text-muted-foreground mb-4">
                  Handpicked latest news from trusted sources, AI-reworded for clarity & neutrality.
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => refetch()}
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  onClick={handleGenerateNews}
                  className="bg-pulsee-green text-pulsee-black hover:bg-pulsee-green-hover"
                  size="sm"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate News
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-pulsee-green" />
                <p className="text-muted-foreground">Loading latest news...</p>
              </div>
            )}

            {/* Articles Grid */}
            {!isLoading && articles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.slice(0, 10).map((article) => (
                  <Card 
                    key={article.id} 
                    className="bg-card/60 border hover:shadow-lg hover:border-ura-green/30 h-full flex flex-col cursor-pointer transition-all duration-200 group"
                    onClick={() => handleArticleClick(article)}
                  >
                    <div className="relative">
                      <img
                        src={article.image_url || "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop"}
                        alt={article.rephrased_title || article.original_title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop";
                        }}
                      />
                      {!user && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="bg-ura-green text-ura-black px-3 py-1 rounded-full text-sm font-semibold">
                            Login to Read
                          </div>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-ura-green/90 text-ura-black font-medium">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Fresh
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-5 flex flex-col h-full">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Clock className="w-4 h-4" />
                        {formatDate(article.created_at)}
                      </div>
                      
                      <h3 className="text-lg font-bold mb-2 text-pulsee-white group-hover:text-ura-green transition-colors leading-tight">
                        {article.rephrased_title || article.original_title}
                      </h3>
                      
                      <p className="text-sm mb-4 text-muted-foreground line-clamp-3 flex-1">
                        {article.summary}
                      </p>
                      
                      <div className="mt-auto">
                        {user ? (
                          <span className="inline-flex items-center gap-1 text-ura-green font-semibold hover:underline">
                            Read Source
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-muted-foreground font-semibold">
                            Login Required
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* No Articles State */}
            {!isLoading && articles.length === 0 && (
              <div className="text-center py-12">
                <div className="mb-6">
                  <Sparkles className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold text-pulsee-white mb-2">No Articles Found</h3>
                  <p className="text-muted-foreground mb-6">
                    It looks like there are no articles in the database yet. Generate some fresh news to get started!
                  </p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handleGenerateNews}
                    className="bg-pulsee-green text-pulsee-black hover:bg-pulsee-green-hover"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Generating News...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Fresh News
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => refetch()}
                    variant="outline"
                    disabled={isLoading}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      <LoginPromptModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        redirectPath="/news"
      />
    </div>
  );
};

export default News;
