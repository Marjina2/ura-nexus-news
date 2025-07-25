
import React from 'react';

interface ArticleContentProps {
  content: string;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ content }) => {
  const highlightImportantWords = (text: string) => {
    // Words that should be highlighted for engagement
    const importantWords = [
      'breaking', 'urgent', 'exclusive', 'confirmed', 'official', 'announcement',
      'record', 'first', 'largest', 'significant', 'major', 'important', 'critical',
      'government', 'minister', 'president', 'CEO', 'director', 'prime minister',
      'increase', 'decrease', 'rise', 'fall', 'growth', 'decline', 'surge', 'drop',
      'agreement', 'deal', 'contract', 'partnership', 'merger', 'acquisition',
      'investigation', 'arrest', 'court', 'verdict', 'ruling', 'judgment',
      'launch', 'release', 'unveil', 'introduce', 'debut', 'announce',
      'crisis', 'emergency', 'disaster', 'tragedy', 'accident', 'incident',
      'success', 'achievement', 'victory', 'win', 'breakthrough', 'milestone',
      'billion', 'million', 'thousand', 'crore', 'lakh', '$', '₹', '%'
    ];

    let highlightedText = text;
    
    importantWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, `<mark class="bg-ura-green/20 text-ura-green font-semibold px-1 rounded">$&</mark>`);
    });

    return highlightedText;
  };

  const formatContent = (content: string) => {
    if (!content || content.trim().length === 0) {
      return <p className="text-muted-foreground">This article content is not available at the moment.</p>;
    }
    
    // Clean up common GNews content issues
    let cleanedContent = content
      .replace(/\[+\d+ chars\]+/g, '') // Remove [+123 chars] indicators
      .replace(/Read more\.\.\./g, '')
      .replace(/Continue reading\.\.\./g, '')
      .trim();
    
    // If content is still too short, show a message
    if (cleanedContent.length < 100) {
      return (
        <div>
          <p className="text-muted-foreground mb-4">{cleanedContent}</p>
          <p className="text-sm text-muted-foreground italic">
            Full article content will be available soon. Our system is continuously improving article retrieval.
          </p>
        </div>
      );
    }
    
    // Split content into paragraphs and process each one
    const paragraphs = cleanedContent.split(/\n\s*\n|\r\n\s*\r\n/).filter(p => p.trim());
    
    if (paragraphs.length === 0) {
      paragraphs.push(cleanedContent);
    }
    
    return paragraphs.map((paragraph, index) => {
      const trimmedParagraph = paragraph.trim();
      
      if (!trimmedParagraph) return null;
      
      // Check if this looks like a heading
      if (trimmedParagraph.length < 100 && (
        trimmedParagraph.endsWith(':') || 
        trimmedParagraph.match(/^[A-Z][^.!?]*$/) ||
        index === 0 ||
        trimmedParagraph.includes('Key') ||
        trimmedParagraph.includes('Important') ||
        trimmedParagraph.includes('Breaking') ||
        trimmedParagraph.includes('Update')
      )) {
        return (
          <h3 
            key={index} 
            className="text-xl font-bold text-ura-green mb-3 mt-6 first:mt-0"
          >
            {trimmedParagraph}
          </h3>
        );
      }
      
      // Regular paragraph with highlighting
      const highlightedParagraph = highlightImportantWords(trimmedParagraph);
      
      return (
        <p 
          key={index} 
          className="mb-4 text-muted-foreground leading-relaxed text-base"
          dangerouslySetInnerHTML={{ __html: highlightedParagraph }}
        />
      );
    }).filter(Boolean);
  };

  const processQuotes = (content: string) => {
    // Highlight quoted text
    return content.replace(/"([^"]+)"/g, '<blockquote class="border-l-4 border-ura-green pl-4 my-4 italic text-ura-white bg-ura-green/5 py-2 rounded-r">"$1"</blockquote>');
  };

  const processedContent = processQuotes(content || '');

  return (
    <div className="prose prose-invert max-w-none">
      <div className="space-y-2">
        {formatContent(processedContent)}
      </div>
    </div>
  );
};

export default ArticleContent;
