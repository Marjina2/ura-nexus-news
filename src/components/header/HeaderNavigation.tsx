
import React from 'react';
import { Crown } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

const HeaderNavigation = () => {
  const { isSignedIn } = useUser();
  const isPro = false; // TODO: Implement pro subscription check with Clerk

  return (
    <nav className="hidden lg:flex items-center space-x-8">
      <a href="/" className="text-pulsee-white hover:text-pulsee-green transition-colors">Home</a>
      <a href="/about" className="text-pulsee-white hover:text-pulsee-green transition-colors">About</a>
      <a href="/pricing" className="text-pulsee-white hover:text-pulsee-green transition-colors">Pricing</a>
      <a href="/contact" className="text-pulsee-white hover:text-pulsee-green transition-colors">Contact</a>
      {isSignedIn && (
        <a href="/dashboard" className="text-pulsee-white hover:text-pulsee-green transition-colors flex items-center gap-2">
          Dashboard
          {isPro && <Crown className="w-4 h-4 text-pulsee-green" />}
        </a>
      )}
    </nav>
  );
};

export default HeaderNavigation;
