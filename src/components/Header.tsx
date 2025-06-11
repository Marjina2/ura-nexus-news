
import React, { useState, useEffect } from 'react';
import { Search, Menu, X, User, Bookmark, Settings, Crown } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

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
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-ura-green rounded-lg flex items-center justify-center">
                <span className="text-ura-black font-bold text-lg">U</span>
              </div>
              <span className="text-2xl font-bold gradient-text">URA</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link to="/" className="text-ura-white hover:text-ura-green transition-colors">Home</Link>
              <a href="/trending" className="text-ura-white hover:text-ura-green transition-colors">Trending</a>
              <Link to="/pricing" className="text-ura-white hover:text-ura-green transition-colors">Pricing</Link>
              <Link to="/about" className="text-ura-white hover:text-ura-green transition-colors">About</Link>
              <Link to="/contact" className="text-ura-white hover:text-ura-green transition-colors">Contact</Link>
              <SignedIn>
                <Link to="/dashboard" className="text-ura-white hover:text-ura-green transition-colors flex items-center gap-2">
                  Dashboard
                  {isPro && <Crown className="w-4 h-4 text-ura-green" />}
                </Link>
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
                <Link to="/pricing">
                  <Button className="bg-ura-green text-ura-black hover:bg-ura-green-hover">
                    Subscribe
                  </Button>
                </Link>
              </SignedOut>

              <SignedIn>
                <Link to="/dashboard">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-ura-white hover:text-ura-green"
                  >
                    <Bookmark className="w-4 h-4 mr-2" />
                    Bookmarks
                  </Button>
                </Link>
                {!isPro && (
                  <Link to="/pricing">
                    <Button className="bg-ura-green text-ura-black hover:bg-ura-green-hover">
                      Upgrade to Pro
                    </Button>
                  </Link>
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
                    <Link to="/" className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-ura-green rounded-lg flex items-center justify-center">
                        <span className="text-ura-black font-bold text-lg">U</span>
                      </div>
                      <span className="text-2xl font-bold gradient-text">URA</span>
                    </Link>
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
                    <Link to="/" className="block text-ura-white hover:text-ura-green transition-colors text-lg">Home</Link>
                    <a href="/trending" className="block text-ura-white hover:text-ura-green transition-colors text-lg">Trending</a>
                    <Link to="/pricing" className="block text-ura-white hover:text-ura-green transition-colors text-lg">Pricing</Link>
                    <Link to="/about" className="block text-ura-white hover:text-ura-green transition-colors text-lg">About</Link>
                    <Link to="/contact" className="block text-ura-white hover:text-ura-green transition-colors text-lg">Contact</Link>
                    <SignedIn>
                      <Link to="/dashboard" className="block text-ura-white hover:text-ura-green transition-colors text-lg flex items-center gap-2">
                        Dashboard
                        {isPro && <Crown className="w-4 h-4 text-ura-green" />}
                      </Link>
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
                      <Link to="/pricing">
                        <Button className="w-full bg-ura-green text-ura-black hover:bg-ura-green-hover">
                          Subscribe
                        </Button>
                      </Link>
                    </SignedOut>

                    <SignedIn>
                      <Link to="/dashboard">
                        <Button variant="outline" className="w-full">
                          <Settings className="w-4 h-4 mr-2" />
                          Dashboard
                        </Button>
                      </Link>
                      {!isPro && (
                        <Link to="/pricing">
                          <Button className="w-full bg-ura-green text-ura-black hover:bg-ura-green-hover">
                            Upgrade to Pro
                          </Button>
                        </Link>
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
