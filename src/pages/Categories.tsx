
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  TrendingUp, 
  Briefcase, 
  Cpu, 
  Heart, 
  Gamepad2, 
  Music, 
  Car,
  Zap,
  Building
} from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Categories = () => {
  const navigate = useNavigate();
  useScrollAnimation();

  const categories = [
    { 
      id: 'general', 
      name: 'General News', 
      description: 'Latest breaking news and current events from around the world',
      icon: Globe,
      color: 'bg-blue-500',
      count: '2.4k articles'
    },
    { 
      id: 'business', 
      name: 'Business', 
      description: 'Market updates, company news, and economic developments',
      icon: Briefcase,
      color: 'bg-green-500',
      count: '1.8k articles'
    },
    { 
      id: 'technology', 
      name: 'Technology', 
      description: 'Latest tech innovations, gadgets, and digital trends',
      icon: Cpu,
      color: 'bg-purple-500',
      count: '1.5k articles'
    },
    { 
      id: 'health', 
      name: 'Health', 
      description: 'Medical breakthroughs, wellness tips, and health news',
      icon: Heart,
      color: 'bg-red-500',
      count: '980 articles'
    },
    { 
      id: 'entertainment', 
      name: 'Entertainment', 
      description: 'Movies, TV shows, celebrities, and pop culture',
      icon: Music,
      color: 'bg-pink-500',
      count: '1.2k articles'
    },
    { 
      id: 'sports', 
      name: 'Sports', 
      description: 'Live scores, match updates, and sports news',
      icon: TrendingUp,
      color: 'bg-orange-500',
      count: '2.1k articles'
    },
    { 
      id: 'science', 
      name: 'Science', 
      description: 'Scientific discoveries, research, and innovations',
      icon: Zap,
      color: 'bg-yellow-500',
      count: '742 articles'
    },
    { 
      id: 'automotive', 
      name: 'Automotive', 
      description: 'Car reviews, industry news, and automotive trends',
      icon: Car,
      color: 'bg-indigo-500',
      count: '456 articles'
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/news?category=${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-pulsee-black">
      <Header />
      <main className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="scroll-scale-in text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
              News Categories
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore news by your interests. Stay updated on topics that matter to you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card 
                  key={category.id}
                  className={`
                    scroll-fade-in bg-card/20 backdrop-blur-sm border-border cursor-pointer 
                    hover-lift hover:border-pulsee-green/50 transition-all duration-300
                    stagger-animation
                  `}
                  style={{ '--animation-order': index } as React.CSSProperties}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="secondary" className="bg-card/50">
                        {category.count}
                      </Badge>
                    </div>
                    <CardTitle className="text-pulsee-white">{category.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Explore category</span>
                      <div className="w-2 h-2 bg-pulsee-green rounded-full"></div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="scroll-slide-left mt-16 text-center">
            <Card className="bg-card/20 backdrop-blur-sm border-border max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-pulsee-white">Can't Find What You're Looking For?</CardTitle>
                <CardDescription>
                  Use our AI-powered search to find specific topics and get personalized recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 justify-center">
                  <button 
                    onClick={() => navigate('/search')}
                    className="bg-pulsee-green text-pulsee-black px-6 py-2 rounded-lg hover:bg-pulsee-green-hover transition-colors"
                  >
                    Search News
                  </button>
                  <button 
                    onClick={() => navigate('/ai-picks')}
                    className="border border-pulsee-green text-pulsee-green px-6 py-2 rounded-lg hover:bg-pulsee-green/10 transition-colors"
                  >
                    AI Recommendations
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
