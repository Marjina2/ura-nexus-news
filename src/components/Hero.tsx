
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Hero = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [readerCount, setReaderCount] = useState(346);

  useEffect(() => {
    const targetCount = 678;
    const startCount = 346;
    const totalIncrements = targetCount - startCount;
    let currentIncrement = 0;

    const incrementReader = () => {
      if (currentIncrement < totalIncrements) {
        setReaderCount(prev => prev + 1);
        currentIncrement++;
        
        // Random interval between 2-8 seconds
        const randomDelay = Math.random() * 6000 + 2000;
        setTimeout(incrementReader, randomDelay);
      }
    };

    // Start the animation after initial load
    const initialDelay = Math.random() * 3000 + 1000;
    setTimeout(incrementReader, initialDelay);
  }, []);

  const handleReadNewsClick = () => {
    if (user) {
      navigate('/news');
    } else {
      navigate('/auth');
    }
  };

  const handleGetLicenseClick = () => {
    navigate('/pricing');
  };

  const handleUpgradeToProClick = () => {
    navigate('/pricing');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-ura-black via-ura-black to-green-900/10" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-ura-green/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-1/5 w-32 h-32 bg-purple-500/8 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-1/5 left-1/3 w-40 h-40 bg-ura-green/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute top-2/3 left-1/6 w-24 h-24 bg-blue-400/8 rounded-full blur-2xl animate-float" style={{ animationDelay: '2.5s' }} />
        <div className="absolute bottom-1/2 right-1/6 w-28 h-28 bg-green-400/8 rounded-full blur-2xl animate-float" style={{ animationDelay: '5s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-card/50 backdrop-blur-sm border border-ura-green/20 rounded-full px-4 py-2 mb-8">
            <div className="w-4 h-4 bg-gradient-to-r from-ura-green to-blue-500 rounded-full animate-pulse" />
            <span className="text-sm text-ura-white">AI-Enhanced News Platform</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-ura-white">Smart, </span>
            <span className="gradient-text">AI-curated</span>
            <br />
            <span className="text-ura-white">news for </span>
            <span className="text-ura-green">modern readers</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Get personalized news summaries, AI-enhanced articles, and licensing opportunities 
            for content creators. Stay informed with premium content from India and around the world.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <Button 
              size="lg" 
              className="bg-ura-green text-ura-black hover:bg-ura-green-hover text-lg px-8 py-4 animate-glow"
              onClick={handleReadNewsClick}
            >
              {user ? 'Read News Now' : 'Sign Up & Read News'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            <Button 
              variant="outline" 
              size="lg" 
              className="border-ura-green text-ura-green hover:bg-ura-green hover:text-ura-black text-lg px-8 py-4"
              onClick={handleGetLicenseClick}
            >
              Get Content License
              <FileText className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Upgrade to Pro Button for users without pro subscription */}
          {user && profile && !profile.subscription && (
            <div className="mb-8">
              <Button 
                size="lg" 
                variant="outline"
                className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white text-lg px-8 py-4"
                onClick={handleUpgradeToProClick}
              >
                Upgrade to Pro
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-ura-green mb-2 transition-all duration-500">
                {readerCount}
              </div>
              <div className="text-muted-foreground">Active Readers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-ura-green mb-2 flex items-center justify-center gap-2">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Trusted by Google
              </div>
              <div className="text-muted-foreground">Technology Partner</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
