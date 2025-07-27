
import React, { useState } from 'react';
import { Search as SearchIcon, Filter, Calendar, Globe } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'technology', 'politics', 'business', 'health', 'sports'];
  
  const searchResults = [
    {
      title: 'AI Technology Advances in Healthcare',
      summary: 'Latest developments in AI-powered medical diagnosis and treatment...',
      category: 'Technology',
      date: '2 hours ago',
      source: 'TechNews'
    },
    {
      title: 'Global Economic Trends for 2025',
      summary: 'Analysis of emerging economic patterns and market predictions...',
      category: 'Business', 
      date: '4 hours ago',
      source: 'Economic Times'
    },
    {
      title: 'Climate Change Policy Updates',
      summary: 'New international agreements on carbon emissions and sustainability...',
      category: 'Environment',
      date: '6 hours ago',
      source: 'Green Report'
    }
  ];

  return (
    <div className="min-h-screen bg-ura-black">
      <Header />
      
      <main className="pt-24">
        {/* Search Header */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
              Search News
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find the stories that matter to you with AI-powered search
            </p>
          </div>
        </section>

        {/* Search Interface */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for news, topics, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-6 text-lg bg-background border-border focus:border-ura-green"
                />
              </div>
              <Button className="bg-ura-green text-ura-black hover:bg-ura-green-hover px-8 py-6">
                Search
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-ura-green text-ura-black" : ""}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>

            {/* Search Results */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Search Results</h2>
              {searchResults.map((result, index) => (
                <Card key={index} className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{result.title}</h3>
                        <p className="text-muted-foreground mb-4">{result.summary}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {result.date}
                          </div>
                          <div className="flex items-center">
                            <Globe className="w-4 h-4 mr-1" />
                            {result.source}
                          </div>
                          <Badge variant="secondary">{result.category}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Search Tips */}
        <section className="py-16 px-4 bg-card/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Search Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-ura-green mb-2">Use Specific Keywords</h3>
                <p className="text-muted-foreground">Include specific terms to get more relevant results</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-ura-green mb-2">Filter by Category</h3>
                <p className="text-muted-foreground">Narrow down results by selecting a specific category</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Search;
