
import React from 'react';
import { Brain, Sparkles, Target, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AIPicks = () => {
  const aiPicks = [
    {
      title: 'Revolutionary AI Model Breaks All Records',
      summary: 'New AI model shows unprecedented capabilities in natural language understanding and generation.',
      confidence: 95,
      category: 'Technology',
      readTime: '5 min'
    },
    {
      title: 'Climate Action Summit Reaches Historic Agreement',
      summary: 'World leaders unite on ambitious carbon reduction targets with AI-powered monitoring systems.',
      confidence: 89,
      category: 'Environment',
      readTime: '7 min'
    },
    {
      title: 'Economic Indicators Point to AI-Driven Growth',
      summary: 'Latest economic data suggests AI adoption is driving significant productivity improvements.',
      confidence: 87,
      category: 'Economics',
      readTime: '6 min'
    }
  ];

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-ura-green" />,
      title: 'Smart Curation',
      description: 'AI analyzes thousands of sources to find the most relevant stories for you.'
    },
    {
      icon: <Target className="w-8 h-8 text-ura-green" />,
      title: 'Personalized',
      description: 'Learns your preferences to deliver increasingly relevant content.'
    },
    {
      icon: <Sparkles className="w-8 h-8 text-ura-green" />,
      title: 'Quality Scored',
      description: 'Every article gets a quality score based on multiple factors.'
    },
    {
      icon: <Zap className="w-8 h-8 text-ura-green" />,
      title: 'Real-time Updates',
      description: 'Continuously updated as new stories emerge and trends develop.'
    }
  ];

  return (
    <div className="min-h-screen bg-ura-black">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
              AI Picks
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover the most important stories, curated by artificial intelligence
            </p>
          </div>
        </section>

        {/* AI Features */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How AI Chooses Your News</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center hover-lift">
                  <CardHeader>
                    <div className="mx-auto mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Today's AI Picks */}
        <section className="py-16 px-4 bg-card/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Today's Top AI Picks</h2>
            <div className="space-y-6">
              {aiPicks.map((pick, index) => (
                <Card key={index} className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{pick.title}</h3>
                        <p className="text-muted-foreground mb-4">{pick.summary}</p>
                        <div className="flex items-center space-x-4">
                          <Badge variant="secondary">{pick.category}</Badge>
                          <span className="text-sm text-muted-foreground">{pick.readTime} read</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-ura-green">{pick.confidence}%</div>
                        <div className="text-sm text-muted-foreground">AI Confidence</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-ura-green h-2 rounded-full" 
                        style={{ width: `${pick.confidence}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AIPicks;
