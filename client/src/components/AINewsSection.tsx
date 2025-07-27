
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Zap, TrendingUp, Globe } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

const AINewsSection = () => {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return null;
  }

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Curation",
      description: "Our AI analyzes thousands of sources to bring you the most relevant news"
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Get breaking news as it happens with our real-time notification system"
    },
    {
      icon: TrendingUp,
      title: "Trending Analysis",
      description: "Discover what's trending with our advanced analytics and insights"
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Stay informed with news from around the world, all in one place"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            AI-Powered News Experience
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the future of news consumption with our intelligent platform
            that learns from your preferences and delivers personalized content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className="w-12 h-12 mx-auto text-primary mb-4" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AINewsSection;
