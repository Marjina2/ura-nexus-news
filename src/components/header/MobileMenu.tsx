
import React from 'react';
import { Mail, Menu, Bookmark, Settings, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const MobileMenu = () => {
  const { isSignedIn } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const isPro = false; // TODO: Implement pro subscription check with Clerk

  const handleSubscribe = () => {
    // TODO: Integrate with Beehive newsletter subscription
    console.log('Subscribe to newsletter - Beehive integration coming soon');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
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
              <div className="w-8 h-8 bg-pulsee-green rounded-lg flex items-center justify-center">
                <span className="text-pulsee-black font-bold text-lg">P</span>
              </div>
              <span className="text-2xl font-bold gradient-text">Pulsee</span>
            </div>
            {isSignedIn && (
              <div className="flex items-center gap-2">
                {isPro && <Badge variant="secondary" className="bg-pulsee-green text-pulsee-black">Pro</Badge>}
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <nav className="space-y-4 mb-6">
            <a href="/" className="block text-pulsee-white hover:text-pulsee-green transition-colors text-lg">Home</a>
            <a href="/about" className="block text-pulsee-white hover:text-pulsee-green transition-colors text-lg">About</a>
            <a href="/pricing" className="block text-pulsee-white hover:text-pulsee-green transition-colors text-lg">Pricing</a>
            <a href="/contact" className="block text-pulsee-white hover:text-pulsee-green transition-colors text-lg">Contact</a>
            {isSignedIn && (
              <a href="/dashboard" className="block text-pulsee-white hover:text-pulsee-green transition-colors text-lg flex items-center gap-2">
                Dashboard
                {isPro && <Crown className="w-4 h-4 text-pulsee-green" />}
              </a>
            )}
          </nav>

          {/* Mobile Actions */}
          <div className="mt-auto space-y-3">
            {/* Subscribe Button - Mobile */}
            <Button 
              variant="outline" 
              className="w-full border-pulsee-green text-pulsee-green hover:bg-pulsee-green hover:text-pulsee-black"
              onClick={handleSubscribe}
            >
              <Mail className="w-4 h-4 mr-2" />
              Subscribe to Newsletter
            </Button>

            {!isSignedIn ? (
              <>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </Button>
                <Button 
                  className="w-full bg-pulsee-green text-pulsee-black hover:bg-pulsee-green-hover"
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
                  <Bookmark className="w-4 h-4 mr-2" />
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
                    className="w-full bg-pulsee-green text-pulsee-black hover:bg-pulsee-green-hover"
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
  );
};

export default MobileMenu;
