
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Github, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SignUpFormProps {
  onToggleMode: () => void;
}

const countries = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Spain', 'Italy', 
  'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Australia', 'New Zealand',
  'Japan', 'South Korea', 'Singapore', 'India', 'Brazil', 'Mexico', 'Argentina', 'Other'
];

const SignUpForm: React.FC<SignUpFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUpWithEmail, signInWithGoogle, signInWithGitHub } = useAuth();
  const { toast } = useToast();

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!country) {
      toast({
        title: "Please select a country",
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
        title: "Check your email!",
        description: "We've sent you a verification link to complete your registration.",
      });
    }
    
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast({
        title: "Google sign up failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleGitHubSignUp = async () => {
    const { error } = await signInWithGitHub();
    if (error) {
      toast({
        title: "GitHub sign up failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card border-border">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-ura-white">Create Account</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Join URA to get personalized news
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleEmailSignUp} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-background border-border"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background border-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="bg-background border-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select value={country} onValueChange={setCountry} required>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-ura-green text-ura-black hover:bg-ura-green-hover"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <Separator />

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full border-border hover:bg-muted"
            onClick={handleGoogleSignUp}
          >
            <Mail className="w-4 h-4 mr-2" />
            Continue with Google
          </Button>
          <Button
            variant="outline"
            className="w-full border-border hover:bg-muted"
            onClick={handleGitHubSignUp}
          >
            <Github className="w-4 h-4 mr-2" />
            Continue with GitHub
          </Button>
        </div>

        <div className="text-center">
          <Button variant="link" onClick={onToggleMode} className="text-ura-green">
            Already have an account? Sign in
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignUpForm;
