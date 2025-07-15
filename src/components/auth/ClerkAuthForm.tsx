
import React, { useState } from 'react';
import { SignIn, SignUp, useUser, useClerk } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClerkAuthForm = ({ redirectPath = '/news' }: { redirectPath?: string }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  if (isSignedIn) {
    navigate(redirectPath);
    return null;
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
        <Card className="w-full max-w-md mx-auto bg-card/80 backdrop-blur-xl border-border/50 rounded-2xl shadow-2xl">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-2xl text-ura-white">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isSignUp ? 'Join URA to get personalized news' : 'Sign in to your account to continue'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="clerk-auth-container">
              {isSignUp ? (
                <SignUp 
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "bg-transparent border-none shadow-none",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton: "bg-background/50 border-border/50 rounded-xl hover:bg-muted/50 text-ura-white",
                      formButtonPrimary: "bg-ura-green text-ura-black hover:bg-ura-green-hover rounded-xl h-12 font-semibold",
                      formFieldInput: "bg-background/50 border-border/50 rounded-xl text-ura-white",
                      formFieldLabel: "text-ura-white",
                      footerActionLink: "text-ura-green hover:text-ura-green-hover",
                      identityPreviewText: "text-ura-white",
                      identityPreviewEditButton: "text-ura-green hover:text-ura-green-hover",
                      footer: "bg-transparent",
                      footerPages: "bg-transparent",
                      footerActionText: "text-muted-foreground",
                      modalContent: "bg-transparent",
                      modalCloseButton: "text-ura-white",
                    }
                  }}
                  redirectUrl={window.location.origin + redirectPath}
                  fallbackRedirectUrl={redirectPath}
                />
              ) : (
                <SignIn 
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "bg-transparent border-none shadow-none",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton: "bg-background/50 border-border/50 rounded-xl hover:bg-muted/50 text-ura-white",
                      formButtonPrimary: "bg-ura-green text-ura-black hover:bg-ura-green-hover rounded-xl h-12 font-semibold",
                      formFieldInput: "bg-background/50 border-border/50 rounded-xl text-ura-white",
                      formFieldLabel: "text-ura-white",
                      footerActionLink: "text-ura-green hover:text-ura-green-hover",
                      identityPreviewText: "text-ura-white",
                      identityPreviewEditButton: "text-ura-green hover:text-ura-green-hover",
                      footer: "bg-transparent",
                      footerPages: "bg-transparent", 
                      footerActionText: "text-muted-foreground",
                      modalContent: "bg-transparent",
                      modalCloseButton: "text-ura-white",
                    }
                  }}
                  redirectUrl={window.location.origin + redirectPath}
                  fallbackRedirectUrl={redirectPath}
                />
              )}
            </div>

            <div className="text-center pt-4">
              <Button 
                variant="link" 
                onClick={() => setIsSignUp(!isSignUp)} 
                className="text-ura-green hover:text-ura-green-hover"
              >
                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClerkAuthForm;
