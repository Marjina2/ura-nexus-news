
import React from 'react';
import { Mail, Bookmark, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import ClerkUserAvatar from '@/components/auth/ClerkUserAvatar';

const HeaderActions = () => {
  const { user, isSignedIn } = useUser();
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
    <div className="hidden md:flex items-center space-x-4">
      {/* Subscribe Button - Always visible */}
      <Button 
        variant="outline" 
        size="sm"
        className="text-pulsee-white border-pulsee-green hover:bg-pulsee-green hover:text-pulsee-black"
        onClick={handleSubscribe}
      >
        <Mail className="w-4 h-4 mr-2" />
        Subscribe
      </Button>

      {!isSignedIn ? (
        <>
          <Button 
            variant="ghost" 
            className="text-pulsee-white hover:text-pulsee-green"
            onClick={() => navigate('/auth')}
          >
            Sign In
          </Button>
          <Button 
            className="bg-pulsee-green text-pulsee-black hover:bg-pulsee-green-hover"
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
            className="text-pulsee-white hover:text-pulsee-green"
            onClick={() => navigate('/dashboard')}
          >
            <Bookmark className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          {!isPro && (
            <Button 
              className="bg-pulsee-green text-pulsee-black hover:bg-pulsee-green-hover"
              onClick={() => navigate('/pricing')}
            >
              Upgrade to Pro
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                <ClerkUserAvatar />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-border">
              <div className="flex items-center justify-start gap-2 p-2">
                <ClerkUserAvatar />
                <div className="flex flex-col space-y-1 leading-none">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-pulsee-white">{user?.fullName || user?.firstName || 'User'}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">@{user?.username || user?.emailAddresses[0]?.emailAddress}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                <Bookmark className="mr-2 h-4 w-4" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/account-settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/50">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  );
};

export default HeaderActions;
