
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireVerification?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireVerification = false 
}) => {
  const { user, profile, loading, resendVerification } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-ura-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ura-green mx-auto mb-4"></div>
        <div className="text-ura-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requireVerification && user && !user.email_confirmed_at) {
    return (
      <div className="min-h-screen bg-ura-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card border-border">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-yellow-500" />
            </div>
            <CardTitle className="text-ura-white">Email Verification Required</CardTitle>
            <CardDescription>
              You must verify your email address to access this feature.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-blue-500 mb-2">
                <Mail className="w-4 h-4" />
                <span className="font-semibold">Check Your Email</span>
              </div>
              <p className="text-sm text-muted-foreground">
                We've sent a verification email to {user.email}
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => resendVerification()}
                className="w-full bg-ura-green text-ura-black hover:bg-ura-green-hover"
              >
                Resend Verification Email
              </Button>

              <Button 
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full border-border text-ura-white hover:bg-muted"
              >
                I've Verified - Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
