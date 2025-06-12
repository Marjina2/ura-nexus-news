
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-ura-black via-ura-black to-green-900/10" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-ura-green/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-card/50 backdrop-blur-sm border border-ura-green/20 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-ura-green" />
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
            for content creators. Stay informed with premium, rewritten content.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <Button 
              size="lg" 
              className="bg-ura-green text-ura-black hover:bg-ura-green-hover text-lg px-8 py-4 animate-glow"
              onClick={() => navigate('/news')}
            >
              Start Reading Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-ura-green text-ura-green hover:bg-ura-green hover:text-ura-black text-lg px-8 py-4"
              onClick={() => navigate('/pricing')}
            >
              For Content Creators
              <Zap className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-ura-green mb-2">50K+</div>
              <div className="text-muted-foreground">Articles Rewritten</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-ura-green mb-2">10K+</div>
              <div className="text-muted-foreground">Active Readers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-ura-green mb-2">500+</div>
              <div className="text-muted-foreground">Content Creators</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
