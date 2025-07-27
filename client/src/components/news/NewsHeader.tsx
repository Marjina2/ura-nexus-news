
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface NewsHeaderProps {
  onBack: () => void;
}

const NewsHeader: React.FC<NewsHeaderProps> = ({ onBack }) => {
  return (
    <>
      <Button 
        onClick={onBack} 
        variant="ghost" 
        className="mb-6 text-ura-white hover:text-ura-green"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>

      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-ura-white mb-4">
          Latest Fresh News
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Stay updated with fresh, unique news powered by AI from trusted sources
        </p>
      </div>
    </>
  );
};

export default NewsHeader;
