import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Tablet, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@clerk/clerk-react';

interface DeviceInfo {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  location?: string;
  ip_address?: string;
  last_active: string;
  connected_at: string;
  is_current?: boolean;
}

const ConnectedDevices = () => {
  const { user, isLoaded } = useUser();
  const [currentDevice, setCurrentDevice] = useState<DeviceInfo | null>(null);

  useEffect(() => {
    // Get current device info
    const getDeviceInfo = (): Omit<DeviceInfo, 'id' | 'connected_at'> => {
      const userAgent = navigator.userAgent;
      const platform = navigator.platform;
      
      let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';
      let browser = 'Unknown';
      let os = 'Unknown';

      // Detect device type
      if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
        if (/iPad/.test(userAgent)) {
          deviceType = 'tablet';
        } else {
          deviceType = 'mobile';
        }
      }

      // Detect browser
      if (userAgent.includes('Chrome')) browser = 'Chrome';
      else if (userAgent.includes('Firefox')) browser = 'Firefox';
      else if (userAgent.includes('Safari')) browser = 'Safari';
      else if (userAgent.includes('Edge')) browser = 'Edge';

      // Detect OS
      if (platform.includes('Win')) os = 'Windows';
      else if (platform.includes('Mac')) os = 'macOS';
      else if (platform.includes('Linux')) os = 'Linux';
      else if (userAgent.includes('Android')) os = 'Android';
      else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';

      return {
        name: `${os} - ${browser}`,
        type: deviceType,
        browser,
        os,
        last_active: new Date().toISOString(),
        is_current: true
      };
    };

    const deviceInfo = getDeviceInfo();
    setCurrentDevice({
      id: 'current',
      connected_at: new Date().toISOString(),
      ...deviceInfo
    });
  }, []);


  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="w-5 h-5" />;
      case 'tablet':
        return <Tablet className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Active now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  // For now, just show current device since Clerk doesn't provide device management

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-ura-white">
          <Monitor className="w-5 h-5" />
          Connected Devices
        </CardTitle>
        <CardDescription>
          Manage devices that have access to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Device */}
        {currentDevice && (
          <div className="p-4 bg-ura-green/10 border border-ura-green/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="text-ura-green">
                {getDeviceIcon(currentDevice.type)}
              </div>
              <div>
                <h4 className="font-medium text-ura-white">{currentDevice.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {currentDevice.browser} on {currentDevice.os}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="default" className="bg-ura-green/20 text-ura-green border-ura-green/20">
                    Current Device
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Active now
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info about device management */}
        <div className="text-center py-8 border border-border/30 rounded-lg bg-card/20">
          <Monitor className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-medium text-ura-white mb-1">Device Management</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Your current device is shown above. For comprehensive device management, including viewing and removing other devices, please visit your Clerk account settings.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectedDevices;