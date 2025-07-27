
import React from 'react';
import { TrendingUp, Clock, Eye } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Trending = () => {
  const trendingTopics = [
    { topic: 'AI Revolution', count: '1.2M', growth: '+45%' },
    { topic: 'Climate Change', count: '890K', growth: '+32%' },
    { topic: 'Tech Innovation', count: '756K', growth: '+28%' },
    { topic: 'Economic Policy', count: '642K', growth: '+25%' },
    { topic: 'Healthcare', count: '534K', growth: '+18%' }
  ];

  const trendingArticles = [
    {
      title: 'AI Breakthrough Changes Everything',
      views: '2.3M',
      time: '2 hours ago',
      category: 'Technology'
    },
    {
      title: 'Global Climate Summit Results',
      views: '1.8M',
      time: '4 hours ago',
      category: 'Environment'
    },
    {
      title: 'New Economic Reforms Announced',
      views: '1.5M',
      time: '6 hours ago',
      category: 'Politics'
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
              Trending Now
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover what's capturing the world's attention right now
            </p>
          </div>
        </section>

        {/* Trending Topics */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Hot Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingTopics.map((topic, index) => (
                <Card key={index} className="hover-lift">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{topic.topic}</CardTitle>
                      <TrendingUp className="w-6 h-6 text-ura-green" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-ura-green">{topic.count}</div>
                      <Badge className="bg-ura-green/20 text-ura-green">{topic.growth}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">discussions</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Articles */}
        <section className="py-16 px-4 bg-card/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Most Viewed Articles</h2>
            <div className="space-y-6">
              {trendingArticles.map((article, index) => (
                <Card key={index} className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {article.views}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {article.time}
                          </div>
                          <Badge variant="secondary">{article.category}</Badge>
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-ura-green">#{index + 1}</div>
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

export default Trending;
