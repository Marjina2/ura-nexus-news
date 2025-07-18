import React from 'react';
import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const NotificationSettings = () => {
  const notificationTypes = [
    {
      id: 'email_news',
      title: 'Email News Updates',
      description: 'Receive daily news summaries via email',
      icon: <Mail className="w-5 h-5" />,
      enabled: true
    },
    {
      id: 'breaking_news',
      title: 'Breaking News Alerts',
      description: 'Get notified immediately about breaking news',
      icon: <Bell className="w-5 h-5" />,
      enabled: false
    },
    {
      id: 'weekly_digest',
      title: 'Weekly Digest',
      description: 'Summary of top stories from the week',
      icon: <MessageSquare className="w-5 h-5" />,
      enabled: true
    },
    {
      id: 'mobile_push',
      title: 'Mobile Push Notifications',
      description: 'Push notifications on mobile devices',
      icon: <Smartphone className="w-5 h-5" />,
      enabled: false
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Bell className="w-5 h-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Choose what notifications you want to receive and how
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Notification Types */}
        <div className="space-y-4">
          {notificationTypes.map((notification) => (
            <div key={notification.id} className="flex items-center justify-between p-4 bg-card/30 border border-border/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-muted-foreground">
                  {notification.icon}
                </div>
                <div>
                  <Label htmlFor={notification.id} className="text-foreground font-medium cursor-pointer">
                    {notification.title}
                  </Label>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                </div>
              </div>
              <Switch 
                id={notification.id}
                defaultChecked={notification.enabled}
                disabled
              />
            </div>
          ))}
        </div>

        {/* Info Notice */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h4 className="font-medium text-blue-400 mb-2">Coming Soon</h4>
          <p className="text-sm text-blue-400/80">
            Notification preferences will be available in a future update. We're working on implementing customizable notification settings for all users.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;