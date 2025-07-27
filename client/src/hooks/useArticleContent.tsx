
import { EnhancedArticle } from '@/hooks/useNews';

export const useArticleContent = () => {
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

  return {
    getComprehensiveArticleContent,
    cleanTitle,
    formatDate
  };
};
