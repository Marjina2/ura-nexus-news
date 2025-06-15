
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PersonalInfoSectionProps {
  fullName: string;
  username: string;
  onFullNameChange: (value: string) => void;
  onUsernameChange: (value: string) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  fullName,
  username,
  onFullNameChange,
  onUsernameChange,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-ura-white">Full Name</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          required
          className="bg-background/50 border-border/50 rounded-xl focus:border-ura-green transition-all duration-200"
          placeholder="John Doe"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="username" className="text-ura-white">Username *</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          required
          className="bg-background/50 border-border/50 rounded-xl focus:border-ura-green transition-all duration-200"
          placeholder="johndoe"
        />
      </div>
    </div>
  );
};

export default PersonalInfoSection;
