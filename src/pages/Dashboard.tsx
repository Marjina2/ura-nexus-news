
import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Crown, 
  Bookmark, 
  Download, 
  Key, 
  Settings, 
  FileText, 
  BarChart3,
  Bell,
  Moon,
  Sun,
  Monitor,
  CreditCard,
  Zap
} from 'lucide-react';
import Header from '@/components/Header';

const Dashboard = () => {
  const { user } = useUser();
  const [darkMode, setDarkMode] = useState('system');
  const [notifications, setNotifications] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  // Mock data - in real app this would come from your backend
  const isPro = user?.publicMetadata?.subscription === 'pro';
  const bookmarksCount = 12;
  const maxBookmarks = isPro ? 'Unlimited' : 20;
  const dailyReads = 3;
  const maxDailyReads = isPro ? 'Unlimited' : 5;
  const monthlyDownloads = 14;
  const maxMonthlyDownloads = isPro ? 25 : 0;

  const mockBookmarks = [
    { id: 1, title: "AI Revolution in Tech Industry", category: "Tech", date: "2024-01-15" },
    { id: 2, title: "Climate Change Impact on Global Economy", category: "Science", date: "2024-01-14" },
    { id: 3, title: "New Space Mission Launches", category: "Science", date: "2024-01-13" },
  ];

  const mockApiUsage = {
    requests: 1250,
    limit: 5000,
    key: "ura_sk_***************"
  };

  return (
    <div className="min-h-screen bg-ura-black">
      <Header />
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback className="bg-ura-green text-ura-black text-xl font-bold">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-ura-white">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  {isPro ? (
                    <Badge className="bg-ura-green text-ura-black">
                      <Crown className="w-4 h-4 mr-1" />
                      Pro
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-muted-foreground text-muted-foreground">
                      Free
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{user?.emailAddresses[0]?.emailAddress}</p>
              </div>
            </div>

            {!isPro && (
              <Card className="bg-gradient-to-r from-ura-green/10 to-blue-500/10 border-ura-green/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-ura-white mb-1">Upgrade to Pro</h3>
                      <p className="text-sm text-muted-foreground">
                        Unlock unlimited access, API keys, and creator tools
                      </p>
                    </div>
                    <Button className="bg-ura-green text-ura-black hover:bg-ura-green-hover">
                      <Zap className="w-4 h-4 mr-2" />
                      Upgrade Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Dashboard */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 bg-card">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              {isPro && <TabsTrigger value="downloads">Downloads</TabsTrigger>}
              {isPro && <TabsTrigger value="api">API Access</TabsTrigger>}
              {isPro && <TabsTrigger value="billing">Billing</TabsTrigger>}
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Bookmarks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-ura-white">{bookmarksCount}</div>
                    <p className="text-xs text-muted-foreground">of {maxBookmarks} {!isPro && 'max'}</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Today's Reads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-ura-white">{dailyReads}</div>
                    <p className="text-xs text-muted-foreground">of {maxDailyReads} {!isPro && 'daily limit'}</p>
                  </CardContent>
                </Card>

                {isPro && (
                  <>
                    <Card className="bg-card border-border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Downloads</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-ura-white">{monthlyDownloads}</div>
                        <p className="text-xs text-muted-foreground">of {maxMonthlyDownloads} this month</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">API Requests</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-ura-white">{mockApiUsage.requests}</div>
                        <p className="text-xs text-muted-foreground">of {mockApiUsage.limit} this month</p>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </TabsContent>

            {/* Bookmarks Tab */}
            <TabsContent value="bookmarks" className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-ura-white">
                    <Bookmark className="w-5 h-5" />
                    Your Bookmarks ({bookmarksCount}/{maxBookmarks})
                  </CardTitle>
                  <CardDescription>
                    Save articles to read later. {!isPro && 'Free users can save up to 20 articles.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockBookmarks.map((bookmark) => (
                      <div key={bookmark.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div>
                          <h3 className="font-medium text-ura-white">{bookmark.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">{bookmark.category}</Badge>
                            <span className="text-xs text-muted-foreground">{bookmark.date}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Read
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-ura-white">
                    <Settings className="w-5 h-5" />
                    Reading Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium text-ura-white mb-3 block">Theme</Label>
                      <div className="flex items-center space-x-4">
                        <Button 
                          variant={darkMode === 'light' ? 'default' : 'outline'} 
                          size="sm"
                          onClick={() => setDarkMode('light')}
                        >
                          <Sun className="w-4 h-4 mr-2" />
                          Light
                        </Button>
                        <Button 
                          variant={darkMode === 'dark' ? 'default' : 'outline'} 
                          size="sm"
                          onClick={() => setDarkMode('dark')}
                        >
                          <Moon className="w-4 h-4 mr-2" />
                          Dark
                        </Button>
                        <Button 
                          variant={darkMode === 'system' ? 'default' : 'outline'} 
                          size="sm"
                          onClick={() => setDarkMode('system')}
                        >
                          <Monitor className="w-4 h-4 mr-2" />
                          System
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notifications" className="text-base font-medium text-ura-white">
                          Email Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about breaking news and updates
                        </p>
                      </div>
                      <Switch 
                        id="notifications" 
                        checked={notifications}
                        onCheckedChange={setNotifications}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="newsletter" className="text-base font-medium text-ura-white">
                          Newsletter Subscription
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Weekly digest of top stories and AI insights
                        </p>
                      </div>
                      <Switch 
                        id="newsletter" 
                        checked={newsletter}
                        onCheckedChange={setNewsletter}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pro-only tabs */}
            {isPro && (
              <>
                <TabsContent value="downloads" className="space-y-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-ura-white">
                        <Download className="w-5 h-5" />
                        Content Downloads & Licensing
                      </CardTitle>
                      <CardDescription>
                        Download articles for offline reading or content licensing
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 border border-border rounded-lg">
                          <h3 className="font-medium text-ura-white mb-2">Usage This Month</h3>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Downloads used</span>
                            <span className="font-medium text-ura-white">{monthlyDownloads}/25</span>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <Button variant="outline" className="flex-1">
                            <FileText className="w-4 h-4 mr-2" />
                            Download as PDF
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <Download className="w-4 h-4 mr-2" />
                            Export JSON
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="api" className="space-y-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-ura-white">
                        <Key className="w-5 h-5" />
                        API Access
                      </CardTitle>
                      <CardDescription>
                        Use our API to embed news content in your applications
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 border border-border rounded-lg">
                        <Label className="text-sm font-medium text-muted-foreground">API Key</Label>
                        <div className="flex items-center gap-2 mt-2">
                          <code className="flex-1 p-2 bg-muted rounded text-sm font-mono">
                            {mockApiUsage.key}
                          </code>
                          <Button size="sm" variant="outline">Copy</Button>
                        </div>
                      </div>
                      <div className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-ura-white">Monthly Usage</span>
                          <span className="text-sm text-muted-foreground">
                            {mockApiUsage.requests.toLocaleString()}/{mockApiUsage.limit.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-ura-green h-2 rounded-full" 
                            style={{ width: `${(mockApiUsage.requests / mockApiUsage.limit) * 100}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="billing" className="space-y-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-ura-white">
                        <CreditCard className="w-5 h-5" />
                        Billing & Subscription
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-medium text-ura-white">Pro Plan</h3>
                            <p className="text-sm text-muted-foreground">$29/month • Renews Jan 15, 2024</p>
                          </div>
                          <Badge className="bg-ura-green text-ura-black">Active</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Manage Subscription</Button>
                          <Button variant="outline" size="sm">Download Invoices</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
