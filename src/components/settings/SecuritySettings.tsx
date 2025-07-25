import React, { useState } from 'react';
import { Shield, Mail, Key, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';

const SecuritySettings = () => {
  const { user, isLoaded } = useUser();
  const { toast } = useToast();
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Check if user signed up with Google (external account)
  const isGoogleUser = user?.externalAccounts?.some(account => account.provider === 'google');
  const isEmailVerified = isGoogleUser || user?.primaryEmailAddress?.verification?.status === 'verified';

  const securityFeatures = [
    {
      id: 'email_verification',
      title: 'Email Verification',
      description: 'Verify your email address to secure your account',
      icon: <Mail className="w-5 h-5" />,
      status: isEmailVerified ? 'enabled' : 'disabled',
      action: isEmailVerified ? null : 'verify'
    },
    {
      id: 'two_factor',
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security with 2FA',
      icon: <Shield className="w-5 h-5" />,
      status: user?.twoFactorEnabled ? 'enabled' : 'disabled',
      action: user?.twoFactorEnabled ? 'disable' : 'enable'
    },
    {
      id: 'password_strength',
      title: 'Change Password',
      description: 'Update your password to keep your account secure',
      icon: <Key className="w-5 h-5" />,
      status: isGoogleUser ? 'not_applicable' : 'enabled',
      action: isGoogleUser ? null : 'change'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'enabled':
        return (
          <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Enabled
          </Badge>
        );
      case 'disabled':
        return (
          <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/20">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Disabled
          </Badge>
        );
      case 'not_applicable':
        return (
          <Badge variant="outline" className="bg-muted/20 text-muted-foreground border-muted/20">
            Not Applicable
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleSendVerification = async () => {
    if (!user || !user.primaryEmailAddress || isGoogleUser) {
      toast({
        title: "Verification Not Needed",
        description: "Your email is already verified through your account provider",
        variant: "default"
      });
      return;
    }
    
    try {
      await user.primaryEmailAddress.prepareVerification({ 
        strategy: 'email_link',
        redirectUrl: window.location.href
      });
      toast({
        title: "Verification Email Sent",
        description: "Please check your email for the verification link"
      });
    } catch (error) {
      console.error('Error sending verification email:', error);
      toast({
        title: "Error",
        description: "Failed to send verification email",
        variant: "destructive"
      });
    }
  };

  const handleChangePassword = async () => {
    if (!user || isGoogleUser) {
      toast({
        title: "Password Change Not Available",
        description: "Password changes are managed through your Google account",
        variant: "default"
      });
      return;
    }
    
    setIsChangingPassword(true);
    try {
      // Navigate to Clerk's user profile for password change
      window.location.href = '/user-profile';
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: "Error",
        description: "Failed to navigate to password change",
        variant: "destructive"
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const getActionButton = (feature: any) => {
    switch (feature.action) {
      case 'verify':
        return (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSendVerification}
            className="border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10"
          >
            Send Verification
          </Button>
        );
      case 'enable':
        return (
          <Button 
            variant="outline" 
            size="sm"
            disabled={true}
            className="border-ura-green/20 text-ura-green hover:bg-ura-green/10"
          >
            Coming Soon
          </Button>
        );
      case 'change':
        return (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleChangePassword}
            disabled={isChangingPassword}
            className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
          >
            {isChangingPassword ? 'Sending...' : 'Change Password'}
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-ura-white">
          <Shield className="w-5 h-5" />
          Security Settings
        </CardTitle>
        <CardDescription>
          Manage your account security and authentication methods
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* Security Features */}
        <div className="space-y-3">
          {securityFeatures.map((feature) => (
            <div key={feature.id} className="p-4 bg-card/30 border border-border/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-muted-foreground">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-ura-white">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(feature.status)}
                  {getActionButton(feature)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Security Tips */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h4 className="font-medium text-blue-400 mb-2">Security Tips</h4>
          <ul className="text-sm text-blue-400/80 space-y-1">
            <li>• Use a unique, strong password for your account</li>
            <li>• Enable two-factor authentication for extra security</li>
            <li>• Verify your email address to secure account recovery</li>
            <li>• Regularly review your connected devices</li>
          </ul>
        </div>

        {/* Recent Security Activity */}
        <div className="space-y-3">
          <h4 className="font-medium text-ura-white">Recent Security Activity</h4>
          <div className="space-y-2">
            {user?.lastSignInAt && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last sign in</span>
                <span className="text-ura-white">
                  {new Date(user.lastSignInAt).toLocaleDateString()}
                </span>
              </div>
            )}
            {user?.updatedAt && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Profile updated</span>
                <span className="text-ura-white">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;