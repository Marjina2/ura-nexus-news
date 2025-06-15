
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Github } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import EmailValidator from './EmailValidator';
import PasswordStrength from './PasswordStrength';

interface SignUpFormProps {
  onToggleMode: () => void;
  redirectPath?: string;
}

const countries = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Spain', 'Italy', 
  'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Australia', 'New Zealand',
  'Japan', 'South Korea', 'Singapore', 'India', 'Brazil', 'Mexico', 'Argentina', 'Other'
];

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
    
    const { error } = await signUpWithEmail(email, password, username, country, fullName);
    
    if (error) {
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
    
    setLoading(false);
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

    // Store the data in localStorage temporarily for OAuth callback
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

    // Store the data in localStorage temporarily for OAuth callback
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-ura-white">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-background/50 border-border/50 rounded-xl focus:border-ura-green transition-all duration-200"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-ura-white">Username *</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-background/50 border-border/50 rounded-xl focus:border-ura-green transition-all duration-200"
                placeholder="johndoe"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-ura-white">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background/50 border-border/50 rounded-xl focus:border-ura-green transition-all duration-200"
              placeholder="john@example.com"
            />
            <EmailValidator email={email} onValidationChange={handleEmailValidation} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-ura-white">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="bg-background/50 border-border/50 rounded-xl focus:border-ura-green transition-all duration-200"
              placeholder="••••••••"
            />
            <PasswordStrength password={password} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country" className="text-ura-white">Country *</Label>
            <Select value={country} onValueChange={setCountry} required>
              <SelectTrigger className="bg-background/50 border-border/50 rounded-xl focus:border-ura-green transition-all duration-200">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full border-border/50 hover:bg-muted/50 rounded-xl h-12 transition-all duration-200 hover:scale-105"
            onClick={handleGoogleSignUp}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
          <Button
            variant="outline"
            className="w-full border-border/50 hover:bg-muted/50 rounded-xl h-12 transition-all duration-200 hover:scale-105"
            onClick={handleGitHubSignUp}
          >
            <Github className="w-5 h-5 mr-2" />
            Continue with GitHub
          </Button>
        </div>

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
