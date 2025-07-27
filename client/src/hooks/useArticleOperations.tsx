
import { useArticleContent } from '@/hooks/useArticleContent';
import { useArticleDatabase } from '@/hooks/useArticleDatabase';
import { useArticleInteractions } from '@/hooks/useArticleInteractions';

export const useArticleOperations = () => {
  const { cleanTitle, formatDate, getComprehensiveArticleContent } = useArticleContent();
  const { viewCount, saveArticleAndIncrementViews } = useArticleDatabase();
  const { handleShare, handleBookmark, handleViewSource, isBookmarked } = useArticleInteractions();

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
