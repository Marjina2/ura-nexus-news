
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AINewsSectionProps {
  category: string;
  country: string;
}

const AINewsSection = ({ category, country }: AINewsSectionProps) => {
  const { user } = useAuth();
  const isPremiumUser = !!user;

  const handleGenerateAINews = () => {
    if (!isPremiumUser) {
      window.location.href = '/pricing';
      return;
    }

    // Generate AI news functionality
    console.log('Generating AI news for category:', category, 'country:', country);
  };

  return (
    <div className="bg-gradient-to-r from-ura-green/10 to-blue-500/10 border border-ura-green/20 rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-ura-green" />
          <h2 className="text-xl font-bold text-ura-white">Fresh News from Our Top AI Models</h2>
          <Badge className="bg-ura-green text-ura-black font-semibold">
            {category.charAt(0).toUpperCase() + category.slice(1)} • {country.toUpperCase()}
          </Badge>
        </div>
      </div>

      <p className="text-muted-foreground mb-4">
        {isPremiumUser 
          ? `AI-generated fresh news articles about ${category} from ${country === 'in' ? 'India' : 'your region'} powered by our advanced AI models`
          : 'Upgrade to premium to access AI-generated fresh news articles powered by our advanced AI models'
        }
      </p>

      <Button
        onClick={handleGenerateAINews}
        disabled={!isPremiumUser}
        className={`w-full ${
          isPremiumUser 
            ? 'bg-gradient-to-r from-ura-green to-blue-500 text-white hover:from-ura-green-hover hover:to-blue-600' 
            : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800'
        }`}
      >
        {!isPremiumUser && <Crown className="w-4 h-4 mr-2" />}
        <Sparkles className="w-4 h-4 mr-2" />
        {isPremiumUser ? 'Generate Fresh News with AI' : 'Premium Feature - Upgrade Now'}
      </Button>
    </div>
  );
};

export default AINewsSection;
