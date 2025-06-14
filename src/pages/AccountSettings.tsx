
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import UserAvatar from '@/components/auth/UserAvatar';

const countries = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Spain', 'Italy', 
  'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Australia', 'New Zealand',
  'Japan', 'South Korea', 'Singapore', 'India', 'Brazil', 'Mexico', 'Argentina', 'Other'
];

const AccountSettings = () => {
  const { user, profile, loading, updateProfile, signOut } = useAuth();
  const { toast } = useToast();
  const [updating, setUpdating] = useState(false);
  
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    fullName: profile?.full_name || '',
    country: profile?.country || '',
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-ura-black flex items-center justify-center">
        <div className="text-ura-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    
    const { error } = await updateProfile({
      username: formData.username,
      full_name: formData.fullName,
      country: formData.country,
    });
    
    if (error) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    }
    
    setUpdating(false);
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <div className="min-h-screen bg-ura-black">
      <Header />
      <main className="pt-32 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            onClick={() => window.history.back()} 
            variant="ghost" 
            className="mb-6 text-ura-white hover:text-ura-green"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-ura-white mb-2">Account Settings</h1>
              <p className="text-muted-foreground">Manage your account preferences and profile information</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Profile Information */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-ura-white">Profile Information</CardTitle>
                  <CardDescription>Update your personal details and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="flex items-center space-x-4 mb-6">
                      <UserAvatar user={user} profile={profile} size="lg" />
                      <div>
                        <h3 className="text-lg font-semibold text-ura-white">{profile?.full_name || 'User'}</h3>
                        <p className="text-sm text-muted-foreground">@{profile?.username}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="bg-background border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="bg-background border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-muted border-border"
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
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
                      disabled={updating}
                    >
                      {updating ? 'Updating...' : 'Update Profile'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-ura-white">Account Actions</CardTitle>
                  <CardDescription>Manage your account and security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <div className="p-3 bg-background rounded-md border border-border">
                      <p className="text-sm text-ura-white">Free Account</p>
                      <p className="text-xs text-muted-foreground">Upgrade to Pro for additional features</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Member Since</Label>
                    <div className="p-3 bg-background rounded-md border border-border">
                      <p className="text-sm text-ura-white">
                        {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <Button 
                    variant="outline" 
                    className="w-full border-ura-green text-ura-green hover:bg-ura-green hover:text-ura-black"
                    onClick={() => window.location.href = '/pricing'}
                  >
                    Upgrade to Pro
                  </Button>

                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AccountSettings;
