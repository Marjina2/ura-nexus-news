
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Bookmark, Share2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TopStories = () => {
  const topStories = [
    {
      id: 1,
      title: "Global Technology Summit Unveils Next-Generation Innovations",
      summary: "Industry leaders showcase groundbreaking technologies that promise to reshape how we work and live. The summit featured presentations from major tech companies...",
      category: "Tech",
      readTime: "7 min",
      publishedAt: "3 hours ago",
      source: "TechCrunch",
      featured: true,
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=600&fit=crop&crop=focalpoint"
    },
    {
      id: 2,
      title: "Economic Recovery Shows Promising Signs Across Major Markets",
      summary: "Latest economic indicators suggest sustained growth momentum in key global markets, with employment rates reaching pre-pandemic levels...",
      category: "Business",
      readTime: "5 min",
      publishedAt: "5 hours ago",
      source: "Financial Times",
      featured: false,
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=600&fit=crop&crop=focalpoint"
    },
    {
      id: 3,
      title: "Renewable Energy Milestone: Solar Power Reaches New Efficiency Record",
      summary: "Scientists achieve breakthrough in solar panel technology, promising more efficient and cost-effective renewable energy solutions...",
      category: "Science",
      readTime: "6 min",
      publishedAt: "8 hours ago",
      source: "Nature",
      featured: false,
      image: "https://images.unsplash.com/photo-1508615039623-faacf6976ee8?w=800&h=600&fit=crop&crop=focalpoint"
    },
    {
      id: 4,
      title: "Healthcare Innovation Brings Hope to Millions",
      summary: "New medical treatment shows remarkable results in clinical trials, offering hope for patients with previously incurable conditions...",
      category: "Health",
      readTime: "8 min",
      publishedAt: "12 hours ago",
      source: "Medical Journal",
      featured: false,
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&crop=focalpoint"
    },
    {
      id: 5,
      title: "Space Exploration Reaches New Frontiers",
      summary: "Latest space mission discovers potentially habitable exoplanets, advancing our understanding of the universe...",
      category: "Science",
      readTime: "9 min",
      publishedAt: "1 day ago",
      source: "NASA",
      featured: false,
      image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop&crop=focalpoint"
    },
    {
      id: 6,
      title: "Artificial Intelligence Ethics Guidelines Established",
      summary: "International committee releases comprehensive guidelines for ethical AI development and deployment across industries...",
      category: "Tech",
      readTime: "6 min",
      publishedAt: "1 day ago",
      source: "IEEE",
      featured: false,
      image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&h=600&fit=crop&crop=focalpoint"
    }
  ];

  const featuredStory = topStories.find(story => story.featured);
  const regularStories = topStories.filter(story => !story.featured);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-ura-white">Top Stories</h2>
          <Button variant="outline" className="border-ura-green text-ura-green hover:bg-ura-green hover:text-ura-black">
            View All Stories
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Story */}
          {featuredStory && (
            <div className="lg:col-span-2">
              <Card className="group bg-card border-border hover-lift cursor-pointer overflow-hidden h-full">
                <div className="relative">
                  <img
                    src={featuredStory.image}
                    alt={featuredStory.title}
                    className="w-full h-64 lg:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-ura-green text-ura-black">
                      Featured
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button size="sm" variant="secondary" className="bg-black/50 backdrop-blur-sm">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="bg-black/50 backdrop-blur-sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                      {featuredStory.category}
                    </Badge>
                    <span className="text-sm text-muted-foreground">from {featuredStory.source}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-ura-white mb-3 group-hover:text-ura-green transition-colors">
                    {featuredStory.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {featuredStory.summary}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{featuredStory.readTime}</span>
                      </div>
                      <span>{featuredStory.publishedAt}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Regular Stories */}
          <div className="space-y-6">
            {regularStories.slice(0, 3).map((story) => (
              <Card 
                key={story.id} 
                className="group bg-card border-border hover-lift cursor-pointer overflow-hidden"
              >
                <div className="flex">
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  
                  <CardContent className="p-4 flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 text-xs">
                        {story.category}
                      </Badge>
                    </div>
                    
                    <h4 className="font-semibold text-ura-white mb-2 line-clamp-2 group-hover:text-ura-green transition-colors text-sm">
                      {story.title}
                    </h4>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{story.readTime}</span>
                      </div>
                      <span>{story.publishedAt}</span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}

            {/* Show More Button */}
            <Card className="bg-gradient-to-r from-ura-green/10 to-blue-500/10 border-ura-green/20 cursor-pointer hover-lift">
              <CardContent className="p-6 text-center">
                <h4 className="font-semibold text-ura-white mb-2">More Top Stories</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Discover additional breaking news and trending stories
                </p>
                <Button variant="outline" size="sm" className="border-ura-green text-ura-green hover:bg-ura-green hover:text-ura-black">
                  View All
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopStories;
