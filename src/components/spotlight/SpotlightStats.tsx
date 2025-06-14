
import React from 'react';
import { Eye, ExternalLink, Users, Phone } from 'lucide-react';

interface SpotlightStatsProps {
  liveUpdates: any[];
  videoUrls: string[];
  casualtiesCount: number;
  emergencyContacts: any;
}

const SpotlightStats = ({ liveUpdates, videoUrls, casualtiesCount, emergencyContacts }: SpotlightStatsProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      {liveUpdates && liveUpdates.length > 0 && (
        <div className="flex items-center space-x-1 text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-lg">
          <Eye className="w-3 h-3" />
          <span>{liveUpdates.length} updates</span>
        </div>
      )}
      {videoUrls && videoUrls.length > 0 && (
        <div className="flex items-center space-x-1 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-lg">
          <ExternalLink className="w-3 h-3" />
          <span>{videoUrls.length} videos</span>
        </div>
      )}
      {casualtiesCount !== null && casualtiesCount > 0 && (
        <div className="flex items-center space-x-1 text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-lg">
          <Users className="w-3 h-3" />
          <span>{casualtiesCount} affected</span>
        </div>
      )}
      {emergencyContacts && Object.keys(emergencyContacts).length > 0 && (
        <div className="flex items-center space-x-1 text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-lg">
          <Phone className="w-3 h-3" />
          <span>Emergency</span>
        </div>
      )}
    </div>
  );
};

export default SpotlightStats;
