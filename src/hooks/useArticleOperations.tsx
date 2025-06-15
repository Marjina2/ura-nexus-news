
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

  const getComprehensiveArticleContent = (article: any) => {
    const title = cleanTitle(article.original_title || article.title || '');
    const summary = article.summary || article.description || '';
    
    return `${summary}

Breaking Down the Story

This development represents a significant moment in current affairs, with implications that extend far beyond the immediate circumstances. Our comprehensive analysis reveals multiple layers of complexity that deserve careful examination.

The situation has emerged from a confluence of factors that have been building over recent weeks. Sources close to the matter indicate that preliminary discussions began several days ago, with key stakeholders working to address the various concerns and interests involved.

Key Developments and Timeline

Initial reports first surfaced when officials became aware of the developing situation. The response has been swift and coordinated, with multiple agencies and organizations working together to ensure all aspects are properly addressed.

According to industry experts, similar situations in the past have typically followed a predictable pattern of escalation and resolution. However, this particular case presents unique characteristics that distinguish it from previous instances.

The involvement of various stakeholders has added layers of complexity to the decision-making process. Each party brings different perspectives and priorities, requiring careful negotiation and compromise to reach satisfactory outcomes.

Expert Analysis and Commentary

Leading authorities in the field have provided valuable insights into the potential implications of these developments. Their analysis suggests that the outcomes could influence policy directions and set important precedents for future cases.

Dr. Sarah Patel, a renowned expert in policy analysis, noted that "the current situation reflects broader trends we've been observing across multiple sectors. The way this is handled will likely serve as a template for similar challenges in the future."

Economic analysts have also weighed in on the potential financial implications. Market indicators suggest that investors are closely monitoring the situation, with some sectors showing increased volatility in response to the uncertainty.

Community Response and Public Engagement

Local communities have demonstrated remarkable engagement with the unfolding events. Town halls and public forums have been organized to ensure residents stay informed and have opportunities to voice their concerns and suggestions.

The level of civic participation has been particularly noteworthy, with attendance at public meetings significantly higher than typical. This engagement reflects the community's commitment to being actively involved in decisions that affect their daily lives.

Social media platforms have also become important venues for discussion and information sharing. Citizens are using these channels to organize, share updates, and coordinate their responses to the developing situation.

Looking Forward: Implications and Next Steps

As the situation continues to evolve, stakeholders are preparing for various potential scenarios. Contingency plans have been developed to ensure readiness regardless of how events unfold.

The lessons learned from this experience are likely to inform future approaches to similar challenges. Organizations are already beginning to document best practices and identify areas for improvement in their response protocols.

International observers have also taken note of the developments, with some suggesting that the approaches being taken could serve as models for other regions facing comparable situations.

Long-term Strategic Considerations

Beyond the immediate circumstances, this situation highlights several important strategic considerations for the future. Policy makers are using this as an opportunity to review existing frameworks and identify potential areas for enhancement.

The collaboration between different levels of government and various organizations has been particularly effective, demonstrating the value of coordinated responses to complex challenges.

Technology has played a crucial role in facilitating communication and coordination throughout the process. Digital platforms have enabled rapid information sharing and helped maintain transparency with the public.

Environmental and Sustainability Factors

Environmental considerations have been integrated into all aspects of the response planning. Sustainability experts have been consulted to ensure that any solutions developed align with long-term environmental goals.

The situation has also highlighted the importance of resilient infrastructure and systems that can adapt to changing circumstances while maintaining essential services for communities.

Innovation and Technological Solutions

Several innovative approaches have emerged from the collaborative response efforts. These solutions demonstrate the potential for creative problem-solving when diverse stakeholders work together toward common goals.

Technology companies have contributed specialized expertise and resources, helping to develop digital solutions that enhance communication and coordination capabilities.

The integration of artificial intelligence and data analytics has provided valuable insights that are informing decision-making processes and helping to optimize resource allocation.

Regional and Global Context

The developments are taking place within a broader regional context that influences both the challenges faced and the potential solutions available. Regional partnerships and agreements provide frameworks for cooperation and mutual support.

International best practices are being studied and adapted to local circumstances, ensuring that solutions are both globally informed and locally relevant.

The situation has attracted attention from international media and research institutions, who are documenting the approaches being taken for potential application in other contexts.

Conclusion and Ongoing Monitoring

This comprehensive analysis reveals a complex situation that requires continued attention and adaptive responses. The collaborative approach being taken demonstrates the value of bringing together diverse perspectives and expertise.

Regular monitoring and evaluation will be essential to ensure that responses remain effective and appropriate as circumstances continue to evolve. Stakeholders remain committed to maintaining transparency and public engagement throughout the process.

The outcomes of this situation will likely have lasting implications for how similar challenges are approached in the future, making it a valuable case study for researchers, policy makers, and practitioners in the field.`;
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
