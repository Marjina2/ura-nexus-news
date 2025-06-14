
import React, { useState, useEffect } from 'react';
import { Search, Menu, X, User, Bookmark, Settings, Crown, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import UserAvatar from '@/components/auth/UserAvatar';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if user has Pro subscription (mock for now)
  const isPro = profile?.subscription === 'pro';

  const handleSubscribe = () => {
    // TODO: Integrate with Beehive newsletter subscription
    console.log('Subscribe to newsletter - Beehive integration coming soon');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

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
              {user && (
                <a href="/dashboard" className="text-ura-white hover:text-ura-green transition-colors flex items-center gap-2">
                  Dashboard
                  {isPro && <Crown className="w-4 h-4 text-ura-green" />}
                </a>
              )}
            </nav>

            {/* Auth & Actions - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Subscribe Button - Always visible */}
              <Button 
                variant="outline" 
                size="sm"
                className="text-ura-white border-ura-green hover:bg-ura-green hover:text-ura-black"
                onClick={handleSubscribe}
              >
                <Mail className="w-4 h-4 mr-2" />
                Subscribe
              </Button>

              {!user ? (
                <>
                  <Button 
                    variant="ghost" 
                    className="text-ura-white hover:text-ura-green"
                    onClick={() => navigate('/auth')}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="bg-ura-green text-ura-black hover:bg-ura-green-hover"
                    onClick={() => navigate('/auth')}
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-ura-white hover:text-ura-green"
                    onClick={() => navigate('/dashboard')}
                  >
                    <Bookmark className="w-4 h-4 mr-2" />
                    Bookmarks
                  </Button>
                  {!isPro && (
                    <Button 
                      className="bg-ura-green text-ura-black hover:bg-ura-green-hover"
                      onClick={() => navigate('/pricing')}
                    >
                      Upgrade to Pro
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                        <UserAvatar user={user} profile={profile} size="sm" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                      <div className="flex items-center justify-start gap-2 p-2">
                        <UserAvatar user={user} profile={profile} size="sm" />
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium text-ura-white">{profile?.full_name || 'User'}</p>
                          <p className="text-xs text-muted-foreground">@{profile?.username}</p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/account-settings')}>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
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
                    {user && isPro && <Badge variant="secondary" className="bg-ura-green text-ura-black">Pro</Badge>}
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="space-y-4 mb-6">
                    <a href="/" className="block text-ura-white hover:text-ura-green transition-colors text-lg">Home</a>
                    <a href="/about" className="block text-ura-white hover:text-ura-green transition-colors text-lg">About</a>
                    <a href="/pricing" className="block text-ura-white hover:text-ura-green transition-colors text-lg">Pricing</a>
                    <a href="/contact" className="block text-ura-white hover:text-ura-green transition-colors text-lg">Contact</a>
                    {user && (
                      <a href="/dashboard" className="block text-ura-white hover:text-ura-green transition-colors text-lg flex items-center gap-2">
                        Dashboard
                        {isPro && <Crown className="w-4 h-4 text-ura-green" />}
                      </a>
                    )}
                  </nav>

                  {/* Mobile Actions */}
                  <div className="mt-auto space-y-3">
                    {/* Subscribe Button - Mobile */}
                    <Button 
                      variant="outline" 
                      className="w-full border-ura-green text-ura-green hover:bg-ura-green hover:text-ura-black"
                      onClick={handleSubscribe}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Subscribe to Newsletter
                    </Button>

                    {!user ? (
                      <>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigate('/auth')}
                        >
                          Sign In
                        </Button>
                        <Button 
                          className="w-full bg-ura-green text-ura-black hover:bg-ura-green-hover"
                          onClick={() => navigate('/auth')}
                        >
                          Sign Up
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigate('/dashboard')}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Dashboard
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigate('/account-settings')}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Account Settings
                        </Button>
                        {!isPro && (
                          <Button 
                            className="w-full bg-ura-green text-ura-black hover:bg-ura-green-hover"
                            onClick={() => navigate('/pricing')}
                          >
                            Upgrade to Pro
                          </Button>
                        )}
                        <Button 
                          variant="destructive" 
                          className="w-full"
                          onClick={handleSignOut}
                        >
                          Sign Out
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
