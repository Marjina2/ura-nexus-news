
import React, { useState, useEffect } from 'react';
import { Search, Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['World', 'India', 'Tech', 'Politics', 'Science', 'Business', 'Sports'];

  return (
    <>
      {/* Main Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass-morphism border-b border-white/10' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-ura-green rounded-lg flex items-center justify-center">
                <span className="text-ura-black font-bold text-lg">U</span>
              </div>
              <span className="text-2xl font-bold gradient-text">URA</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <a href="/" className="text-ura-white hover:text-ura-green transition-colors">Home</a>
              <a href="/trending" className="text-ura-white hover:text-ura-green transition-colors">Trending</a>
              <a href="/pricing" className="text-ura-white hover:text-ura-green transition-colors">Pricing</a>
              <a href="/creators" className="text-ura-white hover:text-ura-green transition-colors">For Creators</a>
            </nav>

            {/* Search & Auth - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card border-border focus:border-ura-green w-64"
                />
              </div>
              <Button variant="ghost" className="text-ura-white hover:text-ura-green">
                Sign In
              </Button>
              <Button className="bg-ura-green text-ura-black hover:bg-ura-green-hover">
                Subscribe
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-card border-l border-border">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="w-8 h-8 bg-ura-green rounded-lg flex items-center justify-center">
                      <span className="text-ura-black font-bold text-lg">U</span>
                    </div>
                    <span className="text-2xl font-bold gradient-text">URA</span>
                  </div>

                  {/* Mobile Search */}
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search news..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="space-y-4 mb-6">
                    <a href="/" className="block text-ura-white hover:text-ura-green transition-colors text-lg">Home</a>
                    <a href="/trending" className="block text-ura-white hover:text-ura-green transition-colors text-lg">Trending</a>
                    <a href="/pricing" className="block text-ura-white hover:text-ura-green transition-colors text-lg">Pricing</a>
                    <a href="/creators" className="block text-ura-white hover:text-ura-green transition-colors text-lg">For Creators</a>
                  </nav>

                  {/* Mobile Categories */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">Categories</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {navItems.map((item) => (
                        <button
                          key={item}
                          className="text-left text-sm text-muted-foreground hover:text-ura-green transition-colors p-2 rounded-md hover:bg-muted"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Auth */}
                  <div className="mt-auto space-y-3">
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                    <Button className="w-full bg-ura-green text-ura-black hover:bg-ura-green-hover">
                      Subscribe
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Categories Bar - Desktop Only */}
        <div className="hidden lg:block border-t border-white/10 bg-card/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-8 h-12 overflow-x-auto">
              {navItems.map((item) => (
                <button
                  key={item}
                  className="text-sm text-muted-foreground hover:text-ura-green transition-colors whitespace-nowrap"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
