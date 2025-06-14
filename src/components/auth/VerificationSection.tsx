
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import VerificationBadge from './VerificationBadge';
import { Mail, Phone, Shield, AlertTriangle } from 'lucide-react';

const VerificationSection = () => {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const sendVerificationEmail = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    try {
      // Generate verification token and update profile
      const token = await supabase.rpc('generate_verification_token');
      
      const { error } = await updateProfile({
        verification_token: token.data,
        verification_sent_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Verification email sent!",
        description: "Please check your inbox and follow the instructions.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyAccount = async () => {
    if (!verificationCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter the verification code.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (verificationCode === profile?.verification_token) {
        const { error } = await updateProfile({
          is_verified: true,
          verification_completed_at: new Date().toISOString(),
          verification_token: null,
        });

        if (error) throw error;

        toast({
          title: "Account verified!",
          description: "You can now access all features including reading news.",
        });
      } else {
        toast({
          title: "Invalid code",
          description: "The verification code is incorrect.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isProfileComplete = profile?.full_name && profile?.phone_number && profile?.country;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-ura-white flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Account Verification
            </CardTitle>
            <CardDescription>
              Verify your account to access all features including reading news
            </CardDescription>
          </div>
          <VerificationBadge isVerified={profile?.is_verified} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isProfileComplete && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-500 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-semibold">Profile Incomplete</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Please complete your profile information (full name, phone number, and country) before verification.
            </p>
          </div>
        )}

        {isProfileComplete && !profile?.is_verified && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-blue-500 mb-2">
                <Mail className="w-4 h-4" />
                <span className="font-semibold">Email Verification Required</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                To access news articles and other features, you need to verify your account.
              </p>
              <Button 
                onClick={sendVerificationEmail}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {loading ? 'Sending...' : 'Send Verification Email'}
              </Button>
            </div>

            {profile?.verification_sent_at && (
              <div className="space-y-3">
                <Label htmlFor="verificationCode">Enter Verification Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="verificationCode"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter the code from your email"
                    className="bg-background border-border flex-1"
                  />
                  <Button 
                    onClick={verifyAccount}
                    disabled={loading}
                    className="bg-ura-green text-ura-black hover:bg-ura-green-hover"
                  >
                    Verify
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {profile?.is_verified && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-green-500 mb-2">
              <Shield className="w-4 h-4" />
              <span className="font-semibold">Account Verified</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your account is verified. You have full access to all features.
            </p>
            {profile?.verification_completed_at && (
              <p className="text-xs text-muted-foreground mt-1">
                Verified on {new Date(profile.verification_completed_at).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-semibold text-ura-white">Verification Benefits</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Access to all news articles</li>
            <li>• Bookmark and save articles</li>
            <li>• Personalized content recommendations</li>
            <li>• Enhanced security for your account</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationSection;
