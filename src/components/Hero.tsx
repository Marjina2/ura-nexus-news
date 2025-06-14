
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Zap, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-ura-black via-ura-black to-purple-900/20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Animated Background Circles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-ura-green/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(64,224,208,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(64,224,208,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Content */}
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-ura-green/10 backdrop-blur-sm border border-ura-green/20 rounded-full px-4 py-2">
            <Sparkles className="w-4 h-4 text-ura-green" />
            <span className="text-sm text-ura-white">AI-Powered News Platform</span>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-ura-white leading-tight">
              News That{' '}
              <span className="gradient-text bg-gradient-to-r from-ura-green to-blue-400 bg-clip-text text-transparent">
                Thinks
              </span>
              <br />
              Beyond Headlines
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Experience journalism enhanced by artificial intelligence. Get deeper insights, 
              comprehensive analysis, and personalized news from trusted sources across India.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: Zap, text: "Real-time Updates" },
              { icon: Globe, text: "India-focused" },
              { icon: Sparkles, text: "AI Enhanced" }
            ].map((feature, index) => (
              <Badge 
                key={index}
                variant="secondary" 
                className="bg-card/50 backdrop-blur-sm border-ura-green/20 text-ura-white px-4 py-2"
              >
                <feature.icon className="w-3 h-3 mr-2" />
                {feature.text}
              </Badge>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-4">
            <Button 
              size="lg" 
              className="bg-ura-green text-ura-black hover:bg-ura-green-hover font-semibold px-8 py-4 text-lg group"
              onClick={() => navigate('/news')}
            >
              Read Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-ura-green text-ura-green hover:bg-ura-green hover:text-ura-black px-8 py-4 text-lg"
              onClick={() => navigate('/about')}
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
            {[
              { number: "10K+", label: "Daily Readers" },
              { number: "500+", label: "News Sources" },
              { number: "24/7", label: "Live Updates" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-ura-green mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ura-black to-transparent" />
    </section>
  );
};

export default Hero;
