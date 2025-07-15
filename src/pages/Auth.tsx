
import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate, useSearchParams } from 'react-router-dom';
import ClerkAuthForm from '@/components/auth/ClerkAuthForm';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const { isSignedIn, isLoaded } = useUser();
  
  const redirectPath = searchParams.get('redirect') || '/';

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-ura-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ura-green mx-auto mb-4"></div>
        <div className="text-ura-white">Loading...</div>
      </div>
    );
  }

  // Redirect if already signed in
  if (isSignedIn) {
    return <Navigate to={redirectPath} replace />;
  }

  return <ClerkAuthForm redirectPath={redirectPath} />;
};

export default Auth;
