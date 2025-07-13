
import { toast } from 'sonner';
import { useUser } from '@clerk/clerk-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { EnhancedArticle } from '@/hooks/useNews';
import { useArticleContent } from '@/hooks/useArticleContent';

export const useArticleInteractions = () => {
  const { user } = useUser();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const { cleanTitle } = useArticleContent();

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

  return {
    handleShare,
    handleBookmark,
    handleViewSource,
    isBookmarked
  };
};
