
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';

interface SpotlightHeaderProps {
  currentTime: Date;
  liveUpdateCount: number;
}

const SpotlightHeader = ({ currentTime, liveUpdateCount }: SpotlightHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-red-500/30">
            <Zap className="w-6 h-6 text-red-400 animate-pulse" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full" />
        </div>
        <div>
          <h2 className="text-4xl font-bold text-pulsee-white flex items-center gap-3">
            Breaking Spotlight
            <Badge className="bg-red-500 text-white animate-pulse text-xs">
              LIVE
            </Badge>
          </h2>
          <p className="text-muted-foreground mt-1">
            Real-time updates • Last synced: {currentTime.toLocaleTimeString()}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Updates today</div>
          <div className="text-2xl font-bold text-pulsee-green">{liveUpdateCount}</div>
        </div>
        {liveUpdateCount > 0 && (
          <Badge variant="secondary" className="bg-pulsee-green/20 text-pulsee-green animate-bounce">
            +{liveUpdateCount} new
          </Badge>
        )}
      </div>
    </div>
  );
};

export default SpotlightHeader;
