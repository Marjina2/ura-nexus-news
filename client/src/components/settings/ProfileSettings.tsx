import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Camera, Check, X, Mail, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useUser } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  username: string;
}

const ProfileSettings = () => {
  const { user, isLoaded } = useUser();
  const { toast } = useToast();
  const [updating, setUpdating] = useState(false);

  // Check if user signed up with Google (external account)
  const isGoogleUser = user?.externalAccounts?.some(account => account.provider === 'google');
  const isEmailVerified = isGoogleUser || user?.primaryEmailAddress?.verification?.status === 'verified';

  const form = useForm<ProfileFormData>({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      username: user?.username || '',
    }
  });

  // Update form when user loads
  React.useEffect(() => {
    if (user && isLoaded) {
      form.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
      });
    }
  }, [user, isLoaded, form]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Avatar changes are disabled - show info message
    toast({
      title: "Avatar Update Disabled",
      description: "Profile picture updates are managed through your account provider",
      variant: "default"
    });
  };

  const onSubmit = async (data: ProfileFormData) => {
    // Profile updates are disabled - show info message
    toast({
      title: "Profile Update Disabled", 
      description: "Profile information is managed through your account provider and cannot be changed here",
      variant: "default"
    });
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

  if (!isLoaded || !user) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-muted h-16 w-16"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-ura-white">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Manage your personal information and profile settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            <div className="relative opacity-75">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                {user.imageUrl ? (
                  <img 
                    src={user.imageUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-muted rounded-full flex items-center justify-center opacity-50">
                <Camera className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-ura-white">{user.fullName || user.username}</h3>
              <p className="text-sm text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</p>
              <div className="flex items-center gap-2 mt-1">
                {isEmailVerified ? (
                  <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/20">
                    <Check className="w-3 h-3 mr-1" />
                    Email Verified
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/20">
                    <X className="w-3 h-3 mr-1" />
                    Email Not Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Email Verification */}
          {!isEmailVerified && !isGoogleUser && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-sm font-medium text-yellow-400">Verify your email address</p>
                    <p className="text-xs text-yellow-400/80">Complete verification to access all features</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSendVerification}
                  className="border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10"
                >
                  Send Verification
                </Button>
              </div>
            </div>
          )}

          {/* Read-only notice */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-blue-400">Profile Information</p>
                <p className="text-xs text-blue-400/80">Your profile is managed by your account provider and cannot be edited here</p>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-ura-white">First Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          disabled
                          className="bg-background/30 border-border/30 text-ura-white opacity-75 cursor-not-allowed"
                          placeholder="First name managed by provider"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-ura-white">Last Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          disabled
                          className="bg-background/30 border-border/30 text-ura-white opacity-75 cursor-not-allowed"
                          placeholder="Last name managed by provider"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-ura-white">Username</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          disabled
                          className="bg-background/30 border-border/30 text-ura-white opacity-75 cursor-not-allowed"
                          placeholder="Username managed by provider"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="button" 
                disabled
                className="bg-muted text-muted-foreground cursor-not-allowed"
              >
                Profile Managed by Provider
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;