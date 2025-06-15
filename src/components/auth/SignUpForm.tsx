
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import PersonalInfoSection from './signup/PersonalInfoSection';
import EmailPasswordSection from './signup/EmailPasswordSection';
import CountrySection from './signup/CountrySection';
import OAuthButtons from './signup/OAuthButtons';

interface SignUpFormProps {
  onToggleMode: () => void;
  redirectPath?: string;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onToggleMode, redirectPath = '/' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  const [emailValidationMessage, setEmailValidationMessage] = useState('');
  const { signUpWithEmail, signInWithGoogle, signInWithGitHub } = useAuth();
  const { toast } = useToast();

  const handleEmailValidation = (isValid: boolean, message?: string) => {
    setEmailValid(isValid);
    setEmailValidationMessage(message || '');
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailValid) {
      toast({
        title: "Invalid Email",
        description: emailValidationMessage,
        variant: "destructive",
      });
      return;
    }
    
    if (!country) {
      toast({
        title: "Please select a country",
        variant: "destructive",
      });
      return;
    }
    
    if (!username.trim()) {
      toast({
        title: "Please enter a username",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await signUpWithEmail(email, password, username, country, fullName);
      
      if (error) {
        console.error('Sign up error:', error);
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account. You must verify within 24 hours.",
        });
      }
    } catch (error: any) {
      console.error('Unexpected sign up error:', error);
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!username.trim()) {
      toast({
        title: "Please enter a username",
        description: "Username is required before continuing with Google",
        variant: "destructive",
      });
      return;
    }
    
    if (!country) {
      toast({
        title: "Please select a country",
        description: "Country is required before continuing with Google",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('pendingUserData', JSON.stringify({
      username,
      country,
      full_name: fullName
    }));

    const { error } = await signInWithGoogle();
    if (error) {
      localStorage.removeItem('pendingUserData');
      toast({
        title: "Google sign up failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleGitHubSignUp = async () => {
    if (!username.trim()) {
      toast({
        title: "Please enter a username",
        description: "Username is required before continuing with GitHub",
        variant: "destructive",
      });
      return;
    }
    
    if (!country) {
      toast({
        title: "Please select a country",
        description: "Country is required before continuing with GitHub",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('pendingUserData', JSON.stringify({
      username,
      country,
      full_name: fullName
    }));

    const { error } = await signInWithGitHub();
    if (error) {
      localStorage.removeItem('pendingUserData');
      toast({
        title: "GitHub sign up failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card/80 backdrop-blur-xl border-border/50 rounded-2xl shadow-2xl animate-scale-in">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl text-ura-white gradient-text">Create Account</CardTitle>
        <CardDescription className="text-muted-foreground">
          Join URA to get personalized news
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleEmailSignUp} className="space-y-4">
          <PersonalInfoSection
            fullName={fullName}
            username={username}
            onFullNameChange={setFullName}
            onUsernameChange={setUsername}
          />
          
          <EmailPasswordSection
            email={email}
            password={password}
            emailValid={emailValid}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onEmailValidation={handleEmailValidation}
          />
          
          <CountrySection
            country={country}
            onCountryChange={setCountry}
          />

          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-xs text-yellow-500 font-medium mb-1">Important Notice:</p>
            <p className="text-xs text-muted-foreground">
              • You must verify your email within 24 hours
              • Temporary/disposable emails are not allowed
              • Only verified users can read news articles
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-ura-green text-ura-black hover:bg-ura-green-hover rounded-xl h-12 font-semibold transition-all duration-200 hover:shadow-lg"
            disabled={loading || !emailValid}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <div className="relative">
          <Separator className="my-4" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-card px-2 text-xs text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <OAuthButtons
          onGoogleSignUp={handleGoogleSignUp}
          onGitHubSignUp={handleGitHubSignUp}
        />

        <div className="text-center pt-4">
          <Button variant="link" onClick={onToggleMode} className="text-ura-green hover:text-ura-green-hover">
            Already have an account? Sign in
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignUpForm;
