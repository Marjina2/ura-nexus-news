import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Tablet, Trash2, MapPin, Clock, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';

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
  const { profile, removeConnectedDevice, addConnectedDevice } = useUserProfile();
  const { toast } = useToast();
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

  const handleRemoveDevice = async (deviceId: string) => {
    const success = await removeConnectedDevice(deviceId);
    if (success) {
      toast({
        title: "Device Removed",
        description: "The device has been disconnected from your account"
      });
    }
  };

  const handleAddCurrentDevice = async () => {
    if (currentDevice) {
      const success = await addConnectedDevice({
        name: currentDevice.name,
        type: currentDevice.type,
        browser: currentDevice.browser,
        os: currentDevice.os,
        last_active: currentDevice.last_active,
        is_current: true
      });
      
      if (success) {
        toast({
          title: "Device Added",
          description: "Current device has been registered"
        });
      }
    }
  };

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

  const devices = Array.isArray(profile?.connected_devices) ? (profile.connected_devices as unknown as DeviceInfo[]) : [];

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
            <div className="flex items-center justify-between">
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
              {!devices.some((d: any) => d?.is_current) && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddCurrentDevice}
                  className="border-ura-green/20 text-ura-green hover:bg-ura-green/10"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Register
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Connected Devices */}
        {devices.length > 0 ? (
          <div className="space-y-3">
            {devices.map((device: any, index: number) => (
              <div key={device?.id || index} className="p-4 bg-card/50 border border-border/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-muted-foreground">
                      {getDeviceIcon(device?.type || 'desktop')}
                    </div>
                    <div>
                      <h4 className="font-medium text-ura-white">{device?.name || 'Unknown Device'}</h4>
                      <p className="text-sm text-muted-foreground">
                        {device?.browser || 'Unknown'} on {device?.os || 'Unknown'}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatLastActive(device?.last_active || new Date().toISOString())}
                        </span>
                        {device?.location && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {device.location}
                          </span>
                        )}
                        {device?.is_current && (
                          <Badge variant="default" className="bg-ura-green/20 text-ura-green border-ura-green/20">
                            Current
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {!device?.is_current && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemoveDevice(device?.id || '')}
                      className="text-red-400 border-red-400/20 hover:bg-red-400/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Monitor className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-medium text-ura-white mb-1">No Connected Devices</h3>
            <p className="text-sm text-muted-foreground">
              Devices you sign in with will appear here
            </p>
          </div>
        )}

        {devices.length > 0 && (
          <div className="pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Remove devices you don't recognize or no longer use to keep your account secure.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConnectedDevices;