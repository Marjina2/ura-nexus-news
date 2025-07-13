
import React from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ClerkUserAvatar = () => {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn) {
    return null;
  }

  return (
    <UserButton 
      appearance={{
        elements: {
          avatarBox: "w-8 h-8",
          userButtonPopoverCard: "bg-card border-border shadow-lg",
          userButtonPopoverActionButton: "text-foreground hover:bg-muted",
          userButtonPopoverActionButtonText: "text-foreground",
          userButtonPopoverFooter: "hidden"
        }
      }}
      afterSignOutUrl="/"
    />
  );
};

export default ClerkUserAvatar;
