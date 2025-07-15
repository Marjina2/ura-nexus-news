
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Settings, User, Shield, Smartphone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSettings from "@/components/settings/ProfileSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import ConnectedDevices from "@/components/settings/ConnectedDevices";

const AccountSettings = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-ura-black">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-ura-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-ura-white flex items-center gap-2">
                  <Settings className="w-6 h-6" />
                  Account Settings
                </h1>
                <p className="text-muted-foreground">
                  Manage your account preferences and security settings
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {user ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-card/50 border border-border/50">
              <TabsTrigger 
                value="profile" 
                className="flex items-center gap-2 data-[state=active]:bg-ura-green data-[state=active]:text-ura-black"
              >
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="flex items-center gap-2 data-[state=active]:bg-ura-green data-[state=active]:text-ura-black"
              >
                <Shield className="w-4 h-4" />
                Security
              </TabsTrigger>
              <TabsTrigger 
                value="devices" 
                className="flex items-center gap-2 data-[state=active]:bg-ura-green data-[state=active]:text-ura-black"
              >
                <Smartphone className="w-4 h-4" />
                Devices
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <ProfileSettings />
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <SecuritySettings />
            </TabsContent>

            <TabsContent value="devices" className="space-y-6">
              <ConnectedDevices />
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold text-ura-white mb-4">
                Please log in to access account settings
              </h2>
              <Link to="/auth">
                <Button className="bg-ura-green text-ura-black hover:bg-ura-green/80">
                  Sign In
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;
