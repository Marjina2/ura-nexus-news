
import React from "react";
import { Users, AlertTriangle, MapPin, FileSearch, Phone } from "lucide-react";

interface SpotlightDetailStatsProps {
  casualtiesCount?: number | null;
  survivorsCount?: number | null;
  location?: string | null;
  blackBoxFound?: boolean | null;
  emergencyContacts?: Record<string, string> | null;
}

const SpotlightDetailStats: React.FC<SpotlightDetailStatsProps> = ({
  casualtiesCount,
  survivorsCount,
  location,
  blackBoxFound,
  emergencyContacts,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 my-6">
      <div className="flex items-center space-x-2 px-3 py-2 bg-red-500/10 rounded-lg text-red-400">
        <AlertTriangle className="w-4 h-4" />
        <span>
          Deaths: <span className="font-semibold text-pulsee-white">{casualtiesCount !== undefined && casualtiesCount !== null ? casualtiesCount : "Unknown"}</span>
        </span>
      </div>
      <div className="flex items-center space-x-2 px-3 py-2 bg-green-500/10 rounded-lg text-green-400">
        <Users className="w-4 h-4" />
        <span>
          Survivors: <span className="font-semibold text-pulsee-white">{survivorsCount !== undefined && survivorsCount !== null ? survivorsCount : "Unknown"}</span>
        </span>
      </div>
      <div className="flex items-center space-x-2 px-3 py-2 bg-blue-500/10 rounded-lg text-blue-400">
        <MapPin className="w-4 h-4" />
        <span>
          Location: <span className="font-semibold text-pulsee-white">{location || "Unknown"}</span>
        </span>
      </div>
      <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-500/10 rounded-lg text-yellow-400">
        <FileSearch className="w-4 h-4" />
        <span>
          Black Box: <span className="font-semibold text-pulsee-white">{blackBoxFound === true ? "Found" : blackBoxFound === false ? "Not Found" : "Unknown"}</span>
        </span>
      </div>
      {emergencyContacts && Object.keys(emergencyContacts).length > 0 && (
        <div className="col-span-2 md:col-span-1 flex items-center space-x-2 px-3 py-2 bg-orange-500/10 rounded-lg text-orange-400">
          <Phone className="w-4 h-4" />
          <div>
            Emergency Contacts:
            <ul className="ml-2 text-xs mt-1">
              {Object.entries(emergencyContacts).map(([label, number], idx) => (
                <li key={idx}>
                  <span className="text-pulsee-white font-medium">{label}:</span>{" "}
                  <span>{number}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpotlightDetailStats;
