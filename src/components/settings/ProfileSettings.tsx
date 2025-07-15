import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Camera, Check, X, Mail, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUser } from '@clerk/clerk-react';

interface ProfileFormData {
  username: string;
  full_name: string;
  phone_number: string;
  country: string;
}

const ProfileSettings = () => {
  const { user } = useUser();
  const { profile, updating, updateProfile, sendEmailVerification } = useUserProfile();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm<ProfileFormData>({
    defaultValues: {
      username: profile?.username || '',
      full_name: profile?.full_name || '',
      phone_number: profile?.phone_number || '',
      country: profile?.country || ''
    }
  });

  // Update form when profile loads
  React.useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username,
        full_name: profile.full_name || '',
        phone_number: profile.phone_number || '',
        country: profile.country
      });
    }
  }, [profile, form]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    await updateProfile(data);
  };

  const handleSendVerification = async () => {
    await sendEmailVerification();
  };

  if (!profile) {
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
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                {avatarPreview || profile.avatar_url ? (
                  <img 
                    src={avatarPreview || profile.avatar_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-ura-green rounded-full flex items-center justify-center cursor-pointer hover:bg-ura-green/80 transition-colors">
                <Camera className="w-4 h-4 text-ura-black" />
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <div>
              <h3 className="font-semibold text-ura-white">{profile.full_name || profile.username}</h3>
              <p className="text-sm text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
              <div className="flex items-center gap-2 mt-1">
                {profile.email_verified ? (
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
                {profile.is_verified && (
                  <Badge variant="default" className="bg-blue-500/20 text-blue-400 border-blue-500/20">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified Account
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Email Verification */}
          {!profile.email_verified && (
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

          {/* Profile Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-ura-white">Username</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-background/50 border-border/50 text-ura-white"
                          placeholder="Enter username"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-ura-white">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-background/50 border-border/50 text-ura-white"
                          placeholder="Enter full name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-ura-white">Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-background/50 border-border/50 text-ura-white"
                          placeholder="Enter phone number"
                          type="tel"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-ura-white">Country</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-background/50 border-border/50 text-ura-white"
                          placeholder="Enter country"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                disabled={updating}
                className="bg-ura-green text-ura-black hover:bg-ura-green/80"
              >
                {updating ? 'Updating...' : 'Update Profile'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;