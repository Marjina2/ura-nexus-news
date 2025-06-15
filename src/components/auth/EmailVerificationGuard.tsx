
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Shield, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface EmailVerificationGuardProps {
  children: React.ReactNode;
}

const EmailVerificationGuard: React.FC<EmailVerificationGuardProps> = ({ children }) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-ura-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ura-green mx-auto mb-4"></div>
        <div className="text-ura-white">Loading...</div>
      </div>
    );
  }

  // If user is not logged in, show children (will redirect to auth)
  if (!user) {
    return <>{children}</>;
  }

  // If user is verified, show children
  if (profile?.is_verified) {
    return <>{children}</>;
  }

  // Show verification required screen
  return (
    <div className="min-h-screen bg-ura-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-yellow-500" />
          </div>
          <CardTitle className="text-ura-white">Email Verification Required</CardTitle>
          <CardDescription>
            You must verify your email address to access news articles and other features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <Mail className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-500">Check Your Inbox</p>
                <p className="text-xs text-muted-foreground">
                  We've sent a verification email to {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-500">Account Cleanup Notice</p>
                <p className="text-xs text-muted-foreground">
                  Unverified accounts are automatically removed after 24 hours
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </div>

            <Button 
              onClick={() => navigate('/account-settings')}
              className="w-full bg-ura-green text-ura-black hover:bg-ura-green-hover"
            >
              Go to Account Settings
            </Button>

            <Button 
              variant="outline"
              onClick={() => window.location.reload()}
              className="w-full border-border text-ura-white hover:bg-muted"
            >
              Refresh Page
            </Button>
          </div>

          <div className="text-center pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Having trouble? Contact support for assistance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerificationGuard;
