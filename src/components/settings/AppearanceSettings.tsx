import React from 'react';
import { Palette, Moon, Sun, Monitor, Eye, Type } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const AppearanceSettings = () => {
  const themes = [
    { id: 'dark', name: 'Dark Theme', icon: <Moon className="w-4 h-4" />, current: true },
    { id: 'light', name: 'Light Theme', icon: <Sun className="w-4 h-4" />, current: false },
    { id: 'system', name: 'System Default', icon: <Monitor className="w-4 h-4" />, current: false }
  ];

  const fontSizes = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' }
  ];

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Palette className="w-5 h-5" />
            Theme & Display
          </CardTitle>
          <CardDescription>
            Customize the appearance and visual settings of your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Options */}
          <div className="space-y-3">
            <Label className="text-foreground font-medium">Color Theme</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {themes.map((theme) => (
                <div
                  key={theme.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    theme.current 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border/30 bg-card/30 hover:border-border/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={theme.current ? 'text-primary' : 'text-muted-foreground'}>
                      {theme.icon}
                    </div>
                    <span className={`font-medium ${theme.current ? 'text-primary' : 'text-foreground'}`}>
                      {theme.name}
                    </span>
                    {theme.current && (
                      <div className="w-2 h-2 bg-primary rounded-full ml-auto"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <Label className="text-foreground font-medium">Font Size</Label>
            <Select defaultValue="medium" disabled>
              <SelectTrigger className="w-full bg-card/30 border-border/30">
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                {fontSizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    <div className="flex items-center gap-2">
                      <Type className="w-4 h-4" />
                      {size.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Accessibility Options */}
          <div className="space-y-4">
            <Label className="text-foreground font-medium">Accessibility</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-card/30 border border-border/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <Label className="text-foreground font-medium">High Contrast Mode</Label>
                    <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                  </div>
                </div>
                <Switch disabled />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-card/30 border border-border/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Type className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <Label className="text-foreground font-medium">Reduce Motion</Label>
                    <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                  </div>
                </div>
                <Switch disabled />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Notice */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Palette className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h4 className="font-medium text-blue-400 mb-1">Appearance Customization</h4>
              <p className="text-sm text-blue-400/80">
                Advanced appearance settings including theme switching and accessibility options are coming soon. Currently using the default dark theme optimized for news reading.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppearanceSettings;