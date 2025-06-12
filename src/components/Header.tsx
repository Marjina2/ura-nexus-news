
import React, { useState, useEffect } from 'react';
import { Search, Menu, X, User, Bookmark, Settings, Crown } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['World', 'India', 'Tech', 'Politics', 'Science', 'Business', 'Sports'];

  // Check if user has Pro subscription (mock for now)
  const isPro = user?.publicMetadata?.subscription === 'pro';

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
              <a href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-ura-green rounded-lg flex items-center justify-center">
                  <span className="text-ura-black font-bold text-lg">U</span>
                </div>
                <span className="text-2xl font-bold gradient-text">URA</span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <a href="/" className="text-ura-white hover:text-ura-green transition-colors">Home</a>
              <a href="/about" className="text-ura-white hover:text-ura-green transition-colors">About</a>
              <a href="/pricing" className="text-ura-white hover:text-ura-green transition-colors">Pricing</a>
              <a href="/contact" className="text-ura-white hover:text-ura-green transition-colors">Contact</a>
              <SignedIn>
                <a href="/dashboard" className="text-ura-white hover:text-ura-green transition-colors flex items-center gap-2">
                  Dashboard
                  {isPro && <Crown className="w-4 h-4 text-ura-green" />}
                </a>
              </SignedIn>
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
              
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="ghost" className="text-ura-white hover:text-ura-green">
                    Sign In
                  </Button>
                </SignInButton>
                <Button className="bg-ura-green text-ura-black hover:bg-ura-green-hover">
                  Subscribe
                </Button>
              </SignedOut>

              <SignedIn>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-ura-white hover:text-ura-green"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  <Bookmark className="w-4 h-4 mr-2" />
                  Bookmarks
                </Button>
                {!isPro && (
                  <Button 
                    className="bg-ura-green text-ura-black hover:bg-ura-green-hover"
                    onClick={() => window.location.href = '/pricing'}
                  >
                    Upgrade to Pro
                  </Button>
                )}
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                    },
                  }}
                />
              </SignedIn>
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
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-ura-green rounded-lg flex items-center justify-center">
                        <span className="text-ura-black font-bold text-lg">U</span>
                      </div>
                      <span className="text-2xl font-bold gradient-text">URA</span>
                    </div>
                    <SignedIn>
                      {isPro && <Badge variant="secondary" className="bg-ura-green text-ura-black">Pro</Badge>}
                    </SignedIn>
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
                    <a href="/about" className="block text-ura-white hover:text-ura-green transition-colors text-lg">About</a>
                    <a href="/pricing" className="block text-ura-white hover:text-ura-green transition-colors text-lg">Pricing</a>
                    <a href="/contact" className="block text-ura-white hover:text-ura-green transition-colors text-lg">Contact</a>
                    <SignedIn>
                      <a href="/dashboard" className="block text-ura-white hover:text-ura-green transition-colors text-lg flex items-center gap-2">
                        Dashboard
                        {isPro && <Crown className="w-4 h-4 text-ura-green" />}
                      </a>
                    </SignedIn>
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
                    <SignedOut>
                      <SignInButton mode="modal">
                        <Button variant="outline" className="w-full">
                          Sign In
                        </Button>
                      </SignInButton>
                      <Button 
                        className="w-full bg-ura-green text-ura-black hover:bg-ura-green-hover"
                        onClick={() => window.location.href = '/pricing'}
                      >
                        Subscribe
                      </Button>
                    </SignedOut>

                    <SignedIn>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => window.location.href = '/dashboard'}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                      {!isPro && (
                        <Button 
                          className="w-full bg-ura-green text-ura-black hover:bg-ura-green-hover"
                          onClick={() => window.location.href = '/pricing'}
                        >
                          Upgrade to Pro
                        </Button>
                      )}
                    </SignedIn>
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
