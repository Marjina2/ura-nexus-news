import React from 'react';
import { Shield, Mail, Key, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUser } from '@clerk/clerk-react';

const SecuritySettings = () => {
  const { user } = useUser();
  const { profile, sendEmailVerification } = useUserProfile();

  const securityFeatures = [
    {
      id: 'email_verification',
      title: 'Email Verification',
      description: 'Verify your email address to secure your account',
      icon: <Mail className="w-5 h-5" />,
      status: profile?.email_verified ? 'enabled' : 'disabled',
      action: profile?.email_verified ? null : 'verify'
    },
    {
      id: 'two_factor',
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security with 2FA',
      icon: <Shield className="w-5 h-5" />,
      status: 'disabled', // This would come from Clerk or your implementation
      action: 'enable'
    },
    {
      id: 'password_strength',
      title: 'Strong Password',
      description: 'Use a strong, unique password for your account',
      icon: <Key className="w-5 h-5" />,
      status: 'enabled', // This would be checked based on password policies
      action: 'change'
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
      default:
        return null;
    }
  };

  const getActionButton = (feature: any) => {
    switch (feature.action) {
      case 'verify':
        return (
          <Button 
            variant="outline" 
            size="sm"
            onClick={sendEmailVerification}
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
            className="border-ura-green/20 text-ura-green hover:bg-ura-green/10"
          >
            Enable
          </Button>
        );
      case 'change':
        return (
          <Button 
            variant="outline" 
            size="sm"
            className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
          >
            Change Password
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
        {/* Account Security Overview */}
        <div className="p-4 bg-card/50 border border-border/50 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-6 h-6 text-ura-green" />
            <div>
              <h4 className="font-medium text-ura-white">Account Security Score</h4>
              <p className="text-sm text-muted-foreground">
                Your account security level
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-background rounded-full h-2">
              <div 
                className="bg-ura-green h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(securityFeatures.filter(f => f.status === 'enabled').length / securityFeatures.length) * 100}%` 
                }}
              />
            </div>
            <span className="text-sm font-medium text-ura-white">
              {Math.round((securityFeatures.filter(f => f.status === 'enabled').length / securityFeatures.length) * 100)}%
            </span>
          </div>
        </div>

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
            {profile?.updated_at && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Profile updated</span>
                <span className="text-ura-white">
                  {new Date(profile.updated_at).toLocaleDateString()}
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