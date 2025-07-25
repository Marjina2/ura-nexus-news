
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Zap, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Hero = () => {
  const navigate = useNavigate();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const words = ['News', 'Insights', 'Stories', 'Analysis', 'Updates'];
  useScrollAnimation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pulsee-black via-pulsee-black to-purple-900/20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pulsee-green/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(64,224,208,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(64,224,208,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Badge */}
          <div className="scroll-fade-in inline-flex items-center space-x-2 bg-pulsee-green/10 backdrop-blur-sm border border-pulsee-green/20 rounded-full px-4 py-2">
            <Sparkles className="w-4 h-4 text-pulsee-green" />
            <span className="text-sm text-pulsee-white">AI-Powered News Platform</span>
          </div>

          {/* Main Heading with Animated Text */}
          <div className="space-y-6 py-4">
            <h1 className="scroll-scale-in text-4xl md:text-6xl lg:text-7xl font-bold text-pulsee-white leading-[1.15] pb-2">
              <span 
                key={currentWordIndex}
                className="inline-block gradient-text bg-gradient-to-r from-pulsee-green to-blue-400 bg-clip-text text-transparent animate-fade-in pb-1"
                style={{ lineHeight: '1.2' }}
              >
                {words[currentWordIndex]}
              </span>{' '}
              That{' '}
              <span className="gradient-text bg-gradient-to-r from-pulsee-green to-blue-400 bg-clip-text text-transparent pb-1">
                Thinks
              </span>
              <br />
              Beyond Headlines
            </h1>
            
            <p className="scroll-fade-in text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed pt-4">
              Experience journalism enhanced by artificial intelligence. Get deeper insights, 
              comprehensive analysis, and personalized news from trusted sources across India.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="scroll-slide-left flex flex-wrap justify-center gap-3 pt-4">
            {[
              { icon: Zap, text: "Real-time Updates" },
              { icon: Globe, text: "India-focused" },
              { icon: Sparkles, text: "AI Enhanced" }
            ].map((feature, index) => (
              <Badge 
                key={index}
                variant="secondary" 
                className="bg-card/50 backdrop-blur-sm border-pulsee-green/20 text-pulsee-white px-4 py-2 stagger-animation"
                style={{ '--animation-order': index } as React.CSSProperties}
              >
                <feature.icon className="w-3 h-3 mr-2" />
                {feature.text}
              </Badge>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="scroll-slide-right flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-6">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-pulsee-green to-emerald-400 text-pulsee-black hover:from-pulsee-green-hover hover:to-emerald-500 font-semibold px-8 py-4 text-lg group hover-lift shadow-lg hover:shadow-pulsee-green/25"
              onClick={() => navigate('/news')}
            >
              Read Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-gradient-to-r from-pulsee-green/10 to-emerald-400/10 border-pulsee-green text-pulsee-green hover:bg-gradient-to-r hover:from-pulsee-green hover:to-emerald-400 hover:text-pulsee-black px-8 py-4 text-lg hover-lift shadow-lg hover:shadow-pulsee-green/25"
              onClick={() => navigate('/about')}
            >
              Learn More
            </Button>
          </div>

          {/* Partnership and Metrics */}
          <div className="scroll-fade-in grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
            <div className="text-center scroll-slide-left">
              <div className="text-3xl md:text-4xl font-bold text-pulsee-green mb-2">
                Growing Community
              </div>
              <div className="text-muted-foreground">
                Trusted Readers Daily
              </div>
            </div>
            
            <div className="text-center scroll-slide-right">
              <div className="flex items-center justify-center gap-2 mb-2">
                <svg 
                  className="w-8 h-8" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" 
                    fill="#4285F4"
                  />
                  <path 
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" 
                    fill="#34A853"
                  />
                  <path 
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" 
                    fill="#FBBC05"
                  />
                  <path 
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" 
                    fill="#EA4335"
                  />
                </svg>
                <div className="text-3xl md:text-4xl font-bold text-pulsee-green">
                  Google Partner
                </div>
              </div>
              <div className="text-muted-foreground">
                AI Technology Partner
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-pulsee-black to-transparent" />
    </section>
  );
};

export default Hero;
