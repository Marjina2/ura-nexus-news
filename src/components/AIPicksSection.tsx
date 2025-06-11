
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Brain, ArrowRight, Clock } from 'lucide-react';

const AIPicksSection = () => {
  const aiEnhancedStories = [
    {
      id: 1,
      title: "How Climate Change is Reshaping Global Agriculture",
      originalTitle: "Climate Change Affects Farming",
      summary: "Our AI has rewritten this story with deeper analysis, connecting climate patterns to specific agricultural impacts across different regions...",
      category: "Environment",
      readTime: "6 min",
      enhancementType: "Enhanced Analysis",
      confidence: 95,
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop&crop=focalpoint"
    },
    {
      id: 2,
      title: "The Hidden Economics Behind Cryptocurrency Adoption",
      originalTitle: "Crypto Market Update",
      summary: "AI-enhanced perspective on cryptocurrency trends, including socioeconomic factors and behavioral economics insights...",
      category: "Finance",
      readTime: "8 min",
      enhancementType: "Deep Dive",
      confidence: 92,
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop&crop=focalpoint"
    },
    {
      id: 3,
      title: "Space Technology Innovations Transforming Earth-Based Industries",
      originalTitle: "New Space Mission Launched",
      summary: "Our AI connected space exploration advances to practical applications in telecommunications, materials science, and more...",
      category: "Technology",
      readTime: "7 min",
      enhancementType: "Cross-Industry Analysis",
      confidence: 89,
      image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=800&h=600&fit=crop&crop=focalpoint"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-ura-black to-purple-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-card/50 backdrop-blur-sm border border-ura-green/20 rounded-full px-4 py-2 mb-6">
            <Brain className="w-4 h-4 text-ura-green" />
            <span className="text-sm text-ura-white">AI-Enhanced Content</span>
          </div>
          
          <h2 className="text-4xl font-bold text-ura-white mb-4">
            AI Picks - <span className="gradient-text">Enhanced Stories</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI doesn't just summarize - it enhances, analyzes, and connects stories 
            to provide deeper insights you won't find anywhere else.
          </p>
        </div>

        {/* AI Enhanced Stories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {aiEnhancedStories.map((story) => (
            <Card 
              key={story.id} 
              className="group bg-card border-border hover-lift cursor-pointer overflow-hidden relative"
            >
              {/* AI Badge */}
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-gradient-to-r from-ura-green to-blue-500 text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI-Enhanced
                </Badge>
              </div>

              {/* Confidence Indicator */}
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white">
                  {story.confidence}% confidence
                </div>
              </div>

              <div className="relative">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                    {story.category}
                  </Badge>
                  <Badge variant="outline" className="border-ura-green/30 text-ura-green text-xs">
                    {story.enhancementType}
                  </Badge>
                </div>
                
                <h3 className="font-bold text-ura-white mb-2 group-hover:text-ura-green transition-colors">
                  {story.title}
                </h3>
                
                <div className="text-xs text-muted-foreground mb-3 italic">
                  Original: "{story.originalTitle}"
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {story.summary}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{story.readTime}</span>
                  </div>
                  <span>Enhanced 2h ago</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-ura-green/10 to-blue-500/10 border-ura-green/20 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Brain className="w-6 h-6 text-ura-green" />
                <h3 className="text-2xl font-bold text-ura-white">Experience AI-Enhanced Journalism</h3>
              </div>
              
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Get access to our complete library of AI-enhanced articles, deeper analysis, 
                and exclusive insights that traditional news sources can't provide.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  size="lg" 
                  className="bg-ura-green text-ura-black hover:bg-ura-green-hover"
                >
                  Subscribe for AI Content
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-ura-green text-ura-green hover:bg-ura-green hover:text-ura-black"
                >
                  View Free Samples
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AIPicksSection;
