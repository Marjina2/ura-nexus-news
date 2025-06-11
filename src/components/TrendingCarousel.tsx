
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp } from 'lucide-react';

const TrendingCarousel = () => {
  const trendingNews = [
    {
      id: 1,
      title: "AI Revolution Reshapes Global Economy",
      summary: "Latest developments in artificial intelligence are transforming industries worldwide...",
      category: "Tech",
      readTime: "5 min",
      trending: true,
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&crop=focalpoint"
    },
    {
      id: 2,
      title: "Climate Summit Reaches Historic Agreement",
      summary: "World leaders unite on unprecedented climate action plan...",
      category: "World",
      readTime: "8 min",
      trending: true,
      image: "https://images.unsplash.com/photo-1569163139394-de4e5f43e4e3?w=800&h=600&fit=crop&crop=focalpoint"
    },
    {
      id: 3,
      title: "Breakthrough in Quantum Computing",
      summary: "Scientists achieve major milestone in quantum technology development...",
      category: "Science",
      readTime: "6 min",
      trending: true,
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop&crop=focalpoint"
    },
    {
      id: 4,
      title: "Global Markets React to Economic Policy",
      summary: "Financial markets show significant movement following policy announcements...",
      category: "Business",
      readTime: "4 min",
      trending: true,
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop&crop=focalpoint"
    }
  ];

  return (
    <section className="py-16 bg-card/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-6 h-6 text-ura-green" />
            <h2 className="text-3xl font-bold text-ura-white">Trending Now</h2>
          </div>
          <button className="text-ura-green hover:text-ura-green-hover transition-colors">
            View All
          </button>
        </div>

        {/* Trending Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingNews.map((article) => (
            <Card 
              key={article.id} 
              className="group bg-card border-border hover-lift cursor-pointer overflow-hidden"
            >
              <div className="relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-ura-green text-ura-black">
                    {article.category}
                  </Badge>
                </div>
                {article.trending && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-red-500 text-white">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Hot
                    </Badge>
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-ura-white mb-2 line-clamp-2 group-hover:text-ura-green transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {article.summary}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTime}</span>
                  </div>
                  <span>2 hours ago</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingCarousel;
