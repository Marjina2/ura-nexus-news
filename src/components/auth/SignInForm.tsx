
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Github, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SignInFormProps {
  onToggleMode: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithEmail, signInWithGoogle, signInWithGitHub } = useAuth();
  const { toast } = useToast();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signInWithEmail(email, password);
    
    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    }
    
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast({
        title: "Google sign in failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleGitHubSignIn = async () => {
    const { error } = await signInWithGitHub();
    if (error) {
      toast({
        title: "GitHub sign in failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card border-border">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-ura-white">Welcome Back</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleEmailSignIn} className="space-y-4">
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
              className="bg-background border-border"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-ura-green text-ura-black hover:bg-ura-green-hover"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <Separator />

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full border-border hover:bg-muted"
            onClick={handleGoogleSignIn}
          >
            <Mail className="w-4 h-4 mr-2" />
            Continue with Google
          </Button>
          <Button
            variant="outline"
            className="w-full border-border hover:bg-muted"
            onClick={handleGitHubSignIn}
          >
            <Github className="w-4 h-4 mr-2" />
            Continue with GitHub
          </Button>
        </div>

        <div className="text-center">
          <Button variant="link" onClick={onToggleMode} className="text-ura-green">
            Don't have an account? Sign up
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignInForm;
