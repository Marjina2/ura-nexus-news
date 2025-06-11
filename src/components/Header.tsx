
import React, { useState, useEffect } from 'react';
import { Search, Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-ura-white hover:text-ura-green transition-colors">Home</a>
              <a href="/trending" className="text-ura-white hover:text-ura-green transition-colors">Trending</a>
              <a href="/pricing" className="text-ura-white hover:text-ura-green transition-colors">Pricing</a>
              <a href="/creators" className="text-ura-white hover:text-ura-green transition-colors">For Creators</a>
            </nav>

            {/* Search & Auth */}
            <div className="flex items-center space-x-4">
              {/* Desktop Search */}
              <div className="hidden md:flex items-center space-x-2">
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
              </div>

              {/* Auth Buttons */}
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" className="text-ura-white hover:text-ura-green">
                  Sign In
                </Button>
                <Button className="bg-ura-green text-ura-black hover:bg-ura-green-hover">
                  Subscribe
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="border-t border-white/10 bg-card/50 backdrop-blur-sm">
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

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute top-0 right-0 w-64 h-full bg-card border-l border-border">
            <div className="p-6 space-y-6">
              {/* Mobile Search */}
              <div className="relative">
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
              <nav className="space-y-4">
                <a href="/" className="block text-ura-white hover:text-ura-green transition-colors">Home</a>
                <a href="/trending" className="block text-ura-white hover:text-ura-green transition-colors">Trending</a>
                <a href="/pricing" className="block text-ura-white hover:text-ura-green transition-colors">Pricing</a>
                <a href="/creators" className="block text-ura-white hover:text-ura-green transition-colors">For Creators</a>
              </nav>

              {/* Mobile Auth */}
              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
                <Button className="w-full bg-ura-green text-ura-black hover:bg-ura-green-hover">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
