import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useBookmarks } from '@/hooks/useBookmarks';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedArticle } from '@/hooks/useNews';

export const useArticleOperations = () => {
  const { user } = useAuth();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const [viewCount, setViewCount] = useState(0);

  const cleanTitle = (title: string) => {
    if (!title) return '';
    return title
      .replace(/^\d+\.\s*/, '')
      .replace(/\[\d+\]/g, '')
      .replace(/\(\d+\)/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const saveArticleAndIncrementViews = async (articleData: any) => {
    try {
      const { error: insertError } = await supabase
        .from('saved_articles')
        .upsert({
          title: cleanTitle(articleData.original_title || articleData.title || ''),
          description: articleData.summary || articleData.description || '',
          content: articleData.content || getComprehensiveArticleContent(articleData),
          url: articleData.source_url || articleData.url || '',
          image_url: articleData.image_url || articleData.urlToImage || '',
          published_at: articleData.created_at || articleData.publishedAt || articleData.published_at || new Date().toISOString(),
          source_name: 'URA News',
          category: articleData.category || 'general',
        }, {
          onConflict: 'url'
        });

      if (insertError) {
        console.error('Error saving article:', insertError);
      }

      const articleUrl = articleData.source_url || articleData.url || '';
      if (articleUrl) {
        const { error: incrementError } = await supabase.rpc('increment_article_views', {
          article_url: articleUrl
        });

        if (incrementError) {
          console.error('Error incrementing view count:', incrementError);
        }

        const { data: viewData } = await supabase
          .from('saved_articles')
          .select('view_count')
          .eq('url', articleUrl)
          .single();

        if (viewData) {
          setViewCount(viewData.view_count);
        }
      }
    } catch (error) {
      console.error('Error in saveArticleAndIncrementViews:', error);
    }
  };

  const handleShare = (article: EnhancedArticle) => {
    if (navigator.share && article) {
      navigator.share({
        title: cleanTitle(article.original_title || article.title || ''),
        text: article.summary || article.description || '',
        url: window.location.href
      });
    } else if (article) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Article link copied to clipboard!');
    }
  };

  const handleBookmark = async (article: EnhancedArticle) => {
    if (!user) {
      toast.error('Please sign in to bookmark articles');
      return;
    }

    if (!article) return;

    const articleUrl = article.source_url || article.url || '';
    const bookmarkData = {
      url: articleUrl,
      title: cleanTitle(article.original_title || article.title || ''),
      description: article.summary || article.description || '',
      image_url: article.image_url || article.urlToImage || '',
      source_name: 'URA News',
    };

    if (isBookmarked(articleUrl)) {
      const success = await removeBookmark(articleUrl);
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

  const handleViewSource = (article: EnhancedArticle) => {
    const sourceUrl = article?.source_url || article?.url;
    if (sourceUrl) {
      window.open(sourceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const getComprehensiveArticleContent = (article: EnhancedArticle): string => {
    // Priority order: full_content > enhanced content > original content > summary
    if (article.full_content && article.full_content.length > 100) {
      return article.full_content;
    }
    
    if (article.content && article.content.length > 100) {
      return article.content;
    }
    
    if (article.summary && article.summary.length > 50) {
      return article.summary;
    }
    
    if (article.description && article.description.length > 50) {
      return article.description;
    }
    
    return "Full article content is not available at the moment. Please visit the source link to read the complete article.";
  };

  return {
    viewCount,
    cleanTitle,
    formatDate,
    saveArticleAndIncrementViews,
    handleShare,
    handleBookmark,
    handleViewSource,
    getComprehensiveArticleContent,
    isBookmarked
  };
};
