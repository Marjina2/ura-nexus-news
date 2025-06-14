
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Crown, Settings, Key } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AINewsSectionProps {
  category: string;
  country: string;
}

const AINewsSection = ({ category, country }: AINewsSectionProps) => {
  const { user } = useAuth();
  const [serpApiKey, setSerpApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const isPremiumUser = !!user;

  // Load saved API key on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('serpApiKey');
    if (savedApiKey) {
      setSerpApiKey(savedApiKey);
    } else {
      // Set the provided API key as default
      const defaultApiKey = '18192c65ffa42fc628064e86f1e811100df2950e2ba97dc389701710a93c73c5';
      setSerpApiKey(defaultApiKey);
      localStorage.setItem('serpApiKey', defaultApiKey);
    }
  }, []);

  const handleSaveApiKey = () => {
    localStorage.setItem('serpApiKey', serpApiKey);
    setShowApiKeyInput(false);
  };

  const handleGenerateAINews = () => {
    if (!isPremiumUser) {
      window.location.href = '/pricing';
      return;
    }

    if (!serpApiKey) {
      setShowApiKeyInput(true);
      return;
    }

    // Generate AI news with SERP API
    console.log('Generating AI news with SERP API:', serpApiKey);
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
        
        <Button
          onClick={() => setShowApiKeyInput(!showApiKeyInput)}
          variant="outline"
          size="sm"
          className="border-ura-green/30 text-ura-green hover:bg-ura-green hover:text-ura-black"
        >
          <Settings className="w-4 h-4 mr-2" />
          SERP API
        </Button>
      </div>

      <p className="text-muted-foreground mb-4">
        {isPremiumUser 
          ? `AI-generated fresh news articles about ${category} from ${country === 'in' ? 'India' : 'your region'} powered by SERP API with real-time Google search integration`
          : 'Upgrade to premium to access AI-generated fresh news articles powered by SERP API'
        }
      </p>

      {/* SERP API Key Input */}
      {showApiKeyInput && (
        <div className="bg-card/20 backdrop-blur-sm border border-border rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-4 h-4 text-ura-green" />
            <label className="text-sm font-medium text-ura-white">SERP API Key</label>
          </div>
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Enter your SERP API key"
              value={serpApiKey}
              onChange={(e) => setSerpApiKey(e.target.value)}
              className="bg-card border-border text-ura-white"
            />
            <Button
              onClick={handleSaveApiKey}
              size="sm"
              className="bg-ura-green text-ura-black hover:bg-ura-green-hover"
            >
              Save
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Get your SERP API key from{' '}
            <a 
              href="https://serpapi.com/dashboard" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-ura-green hover:underline"
            >
              serpapi.com/dashboard
            </a>
          </p>
        </div>
      )}

      <Button
        onClick={handleGenerateAINews}
        disabled={!isPremiumUser}
        className={`w-full ${
          isPremiumUser 
            ? 'bg-gradient-to-r from-ura-green to-blue-500 text-white hover:from-ura-green-hover hover:to-blue-600' 
            : 'bg-gray-600 text-gray-300 cursor-not-allowed'
        }`}
      >
        {!isPremiumUser && <Crown className="w-4 h-4 mr-2" />}
        <Sparkles className="w-4 h-4 mr-2" />
        {isPremiumUser ? 'Generate Fresh News with SERP API' : 'Premium Feature - Upgrade Now'}
      </Button>
    </div>
  );
};

export default AINewsSection;
