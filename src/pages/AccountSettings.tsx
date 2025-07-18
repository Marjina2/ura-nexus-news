
import React, { useState, memo } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Settings, User, Shield, Smartphone, ArrowLeft, Bell, Palette, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Lazy load components to improve performance
const ProfileSettings = React.lazy(() => import("@/components/settings/ProfileSettings"));
const SecuritySettings = React.lazy(() => import("@/components/settings/SecuritySettings"));
const ConnectedDevices = React.lazy(() => import("@/components/settings/ConnectedDevices"));
const NotificationSettings = React.lazy(() => import("@/components/settings/NotificationSettings"));
const AppearanceSettings = React.lazy(() => import("@/components/settings/AppearanceSettings"));

const AccountSettings = memo(() => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header with gradient */}
      <div className="border-b border-border/20 bg-gradient-to-r from-card/20 via-card/10 to-card/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Settings className="w-7 h-7 text-primary" />
                  </div>
                  Account Settings
                </h1>
                <p className="text-muted-foreground mt-1 text-lg">
                  Manage your account preferences, security settings, and personalization options
                </p>
              </div>
            </div>
            {user && (
              <div className="flex items-center gap-3 p-3 bg-card/50 rounded-lg border border-border/20">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  {user.imageUrl ? (
                    <img src={user.imageUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{user.fullName || user.username}</p>
                  <p className="text-xs text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {user ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-5 bg-card/50 border border-border/20 p-1 h-auto">
              <TabsTrigger 
                value="profile" 
                className="flex flex-col items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:text-foreground transition-all duration-200"
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">Profile</span>
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="flex flex-col items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:text-foreground transition-all duration-200"
              >
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">Security</span>
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="flex flex-col items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:text-foreground transition-all duration-200"
              >
                <Bell className="w-5 h-5" />
                <span className="text-sm font-medium">Notifications</span>
              </TabsTrigger>
              <TabsTrigger 
                value="appearance" 
                className="flex flex-col items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:text-foreground transition-all duration-200"
              >
                <Palette className="w-5 h-5" />
                <span className="text-sm font-medium">Appearance</span>
              </TabsTrigger>
              <TabsTrigger 
                value="devices" 
                className="flex flex-col items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:text-foreground transition-all duration-200"
              >
                <Smartphone className="w-5 h-5" />
                <span className="text-sm font-medium">Devices</span>
              </TabsTrigger>
            </TabsList>

            <React.Suspense fallback={
              <Card>
                <CardContent className="p-8">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            }>
              <TabsContent value="profile" className="space-y-6">
                <ProfileSettings />
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <SecuritySettings />
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <NotificationSettings />
              </TabsContent>

              <TabsContent value="appearance" className="space-y-6">
                <AppearanceSettings />
              </TabsContent>

              <TabsContent value="devices" className="space-y-6">
                <ConnectedDevices />
              </TabsContent>
            </React.Suspense>
          </Tabs>
        ) : (
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Authentication Required
              </h2>
              <p className="text-muted-foreground mb-6">
                Please sign in to access your account settings and manage your preferences.
              </p>
              <Link to="/auth">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
                  Sign In to Continue
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
});

AccountSettings.displayName = 'AccountSettings';

export default AccountSettings;
