
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedArticle } from '@/hooks/useNews';
import { useArticleContent } from '@/hooks/useArticleContent';

export const useArticleDatabase = () => {
  const [viewCount, setViewCount] = useState(0);
  const { cleanTitle, getComprehensiveArticleContent } = useArticleContent();

  const saveArticleAndIncrementViews = async (articleData: any) => {
    try {
      const { error: insertError } = await supabase
        .from('saved_articles')
        .upsert({
          title: cleanTitle(articleData.original_title || articleData.title || ''),
          description: articleData.summary || articleData.description || '',
          content: articleData.full_content || articleData.content || getComprehensiveArticleContent(articleData),
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

  return {
    viewCount,
    saveArticleAndIncrementViews
  };
};
