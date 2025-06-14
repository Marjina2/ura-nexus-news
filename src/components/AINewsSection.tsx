
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Crown, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AINewsSectionProps {
  category: string;
  country: string;
}

const AINewsSection = ({ category, country }: AINewsSectionProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isPremiumUser = !!user && false; // Set to false for now since we don't have subscription logic

  const handleGenerateAINews = () => {
    if (!isPremiumUser) {
      navigate('/pricing');
      return;
    }

    // Generate AI news functionality for premium users
    console.log('Generating AI news for category:', category, 'country:', country);
  };

  return (
    <div className="bg-gradient-to-r from-pulsee-green/10 to-blue-500/10 border border-pulsee-green/20 rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-pulsee-green" />
          <h2 className="text-xl font-bold text-pulsee-white">Fresh News from Our Top AI Models</h2>
          <Badge className="bg-pulsee-green text-pulsee-black font-semibold">
            {category.charAt(0).toUpperCase() + category.slice(1)} • {country.toUpperCase()}
          </Badge>
        </div>
        {!isPremiumUser && (
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            <Badge variant="outline" className="border-yellow-500/50 text-yellow-500">
              Premium Only
            </Badge>
          </div>
        )}
      </div>

      <p className="text-muted-foreground mb-4">
        {isPremiumUser 
          ? `AI-generated fresh news articles about ${category} from ${country === 'in' ? 'India' : 'your region'} powered by our advanced AI models`
          : 'Unlock AI-generated fresh news articles powered by our advanced AI models. Get unique, personalized content that you won\'t find anywhere else.'
        }
      </p>

      {!isPremiumUser && (
        <div className="bg-card/30 rounded-lg p-4 mb-4 border border-border/50">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <h4 className="font-semibold text-pulsee-white mb-2">Premium Features Include:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• AI-generated articles tailored to your interests</li>
                <li>• Real-time news synthesis from multiple sources</li>
                <li>• Unique content not available elsewhere</li>
                <li>• Advanced filtering and personalization</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <Button
        onClick={handleGenerateAINews}
        className={`w-full ${
          isPremiumUser 
            ? 'bg-gradient-to-r from-pulsee-green to-blue-500 text-white hover:from-pulsee-green-hover hover:to-blue-600' 
            : 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white hover:from-yellow-700 hover:to-orange-700'
        }`}
      >
        {!isPremiumUser && <Crown className="w-4 h-4 mr-2" />}
        <Sparkles className="w-4 h-4 mr-2" />
        {isPremiumUser ? 'Generate Fresh News with AI' : 'Upgrade to Premium - Get AI News'}
      </Button>
    </div>
  );
};

export default AINewsSection;
