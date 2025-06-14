
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-ura-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ura-green mx-auto mb-4"></div>
        <div className="text-ura-white">Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ura-black via-gray-900 to-ura-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-ura-green opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-ura-green opacity-5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Exit button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-card/20 backdrop-blur-sm border border-border/30 hover:bg-card/40 transition-all duration-200 flex items-center justify-center group"
      >
        <X className="w-5 h-5 text-muted-foreground group-hover:text-ura-white transition-colors" />
      </button>

      <div className="w-full max-w-md relative z-10">
        <div className="animate-fade-in">
          {isSignUp ? (
            <SignUpForm onToggleMode={() => setIsSignUp(false)} />
          ) : (
            <SignInForm onToggleMode={() => setIsSignUp(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
