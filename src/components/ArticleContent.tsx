
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

  // Clean the content to remove any filler/placeholder text
  const cleanContent = (rawContent: string) => {
    if (!rawContent) return "This article content is not available at the moment.";
    
    // Remove common filler phrases that indicate placeholder content
    const fillerPatterns = [
      /Breaking Down the Story[\s\S]*/i,
      /This development represents a significant moment[\s\S]*/i,
      /Our comprehensive analysis reveals[\s\S]*/i,
      /Key Developments and Timeline[\s\S]*/i,
      /Expert Analysis and Commentary[\s\S]*/i,
      /Looking Forward: Implications[\s\S]*/i,
      /Long-term Strategic Considerations[\s\S]*/i,
      /Environmental and Sustainability Factors[\s\S]*/i,
      /Innovation and Technological Solutions[\s\S]*/i,
      /Regional and Global Context[\s\S]*/i,
      /Conclusion and Ongoing Monitoring[\s\S]*/i
    ];

    let cleanedContent = rawContent;
    
    // Remove filler content patterns
    fillerPatterns.forEach(pattern => {
      cleanedContent = cleanedContent.replace(pattern, '');
    });

    // Clean up any remaining placeholder text
    cleanedContent = cleanedContent
      .replace(/This situation has emerged from a confluence of factors[\s\S]*?involved\./gi, '')
      .replace(/According to industry experts[\s\S]*?instances\./gi, '')
      .replace(/The involvement of various stakeholders[\s\S]*?outcomes\./gi, '')
      .trim();

    // If content is too short or empty after cleaning, return a message
    if (cleanedContent.length < 100) {
      return rawContent.length > 100 ? rawContent.substring(0, 500) + "..." : "This article content is not available in full at the moment.";
    }

    return cleanedContent;
  };

  const formatContent = (content: string) => {
    // Clean the content first
    const cleanedContent = cleanContent(content);
    
    // Split content into paragraphs and process each one
    const paragraphs = cleanedContent.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      const trimmedParagraph = paragraph.trim();
      
      // Check if this looks like a heading (short line, often at start or after empty line)
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
    });
  };

  const processQuotes = (content: string) => {
    // Highlight quoted text
    return content.replace(/"([^"]+)"/g, '<blockquote class="border-l-4 border-ura-green pl-4 my-4 italic text-ura-white bg-ura-green/5 py-2 rounded-r">"$1"</blockquote>');
  };

  const processedContent = processQuotes(content);

  return (
    <div className="prose prose-invert max-w-none">
      <div className="space-y-2">
        {formatContent(processedContent)}
      </div>
    </div>
  );
};

export default ArticleContent;
