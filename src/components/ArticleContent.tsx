
import React from 'react';

interface ArticleContentProps {
  content: string;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ content }) => {
  const highlightImportantWords = (text: string) => {
    // Words that should be highlighted for engagement
    const importantWords = [
      'breaking', 'urgent', 'exclusive', 'confirmed', 'official', 'announcement',
      'record', 'first', 'largest', 'significant', 'major', 'important',
      'government', 'minister', 'president', 'CEO', 'director',
      'increase', 'decrease', 'rise', 'fall', 'growth', 'decline',
      'agreement', 'deal', 'contract', 'partnership', 'merger',
      'investigation', 'arrest', 'court', 'verdict', 'ruling',
      'launch', 'release', 'unveil', 'introduce', 'debut',
      'crisis', 'emergency', 'disaster', 'tragedy', 'accident',
      'success', 'achievement', 'victory', 'win', 'breakthrough'
    ];

    let highlightedText = text;
    
    importantWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, `<mark class="bg-ura-green/20 text-ura-green font-medium px-1 rounded">$&</mark>`);
    });

    return highlightedText;
  };

  const formatContent = (content: string) => {
    // Split content into paragraphs and highlight important words
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      const highlightedParagraph = highlightImportantWords(paragraph.trim());
      
      return (
        <p 
          key={index} 
          className="mb-4 text-muted-foreground leading-relaxed"
          dangerouslySetInnerHTML={{ __html: highlightedParagraph }}
        />
      );
    });
  };

  return (
    <div className="prose prose-invert max-w-none">
      <div className="space-y-4">
        {formatContent(content)}
      </div>
    </div>
  );
};

export default ArticleContent;
