
import React from 'react';
import { Newspaper, Briefcase, Globe, Heart, Zap, Gamepad2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Categories = () => {
  const categories = [
    {
      name: 'Politics',
      icon: <Globe className="w-8 h-8 text-ura-green" />,
      description: 'Latest political news and government updates',
      count: '1,245'
    },
    {
      name: 'Business',
      icon: <Briefcase className="w-8 h-8 text-ura-green" />,
      description: 'Market trends, corporate news, and economic analysis',
      count: '987'
    },
    {
      name: 'Technology',
      icon: <Zap className="w-8 h-8 text-ura-green" />,
      description: 'Tech innovations, AI developments, and digital trends',
      count: '1,456'
    },
    {
      name: 'Health',
      icon: <Heart className="w-8 h-8 text-ura-green" />,
      description: 'Medical breakthroughs, wellness tips, and health policy',
      count: '678'
    },
    {
      name: 'Sports',
      icon: <Gamepad2 className="w-8 h-8 text-ura-green" />,
      description: 'Sports news, match results, and athlete updates',
      count: '892'
    },
    {
      name: 'General',
      icon: <Newspaper className="w-8 h-8 text-ura-green" />,
      description: 'Miscellaneous news and general interest stories',
      count: '2,134'
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
              News Categories
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Explore news by categories that matter to you
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <Card key={index} className="hover-lift cursor-pointer group">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 group-hover:scale-110 transition-transform">
                      {category.icon}
                    </div>
                    <CardTitle className="text-xl">{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-2xl font-bold text-ura-green mb-2">{category.count}</div>
                    <p className="text-sm text-muted-foreground">articles available</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Tags */}
        <section className="py-16 px-4 bg-card/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Popular Tags</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {['AI', 'Climate Change', 'Elections', 'Cryptocurrency', 'Space', 'Healthcare', 'Education', 'Economy', 'Innovation', 'Security'].map((tag, index) => (
                <span key={index} className="px-4 py-2 bg-ura-green/20 text-ura-green rounded-full text-sm hover:bg-ura-green/30 transition-colors cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;
