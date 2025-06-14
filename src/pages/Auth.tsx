
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-ura-black flex items-center justify-center">
        <div className="text-ura-white">Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-ura-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isSignUp ? (
          <SignUpForm onToggleMode={() => setIsSignUp(false)} />
        ) : (
          <SignInForm onToggleMode={() => setIsSignUp(true)} />
        )}
      </div>
    </div>
  );
};

export default Auth;
