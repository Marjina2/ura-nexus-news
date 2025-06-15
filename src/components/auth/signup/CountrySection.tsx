
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CountrySectionProps {
  country: string;
  onCountryChange: (value: string) => void;
}

const countries = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Spain', 'Italy', 
  'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Australia', 'New Zealand',
  'Japan', 'South Korea', 'Singapore', 'India', 'Brazil', 'Mexico', 'Argentina', 'Other'
];

const CountrySection: React.FC<CountrySectionProps> = ({
  country,
  onCountryChange,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="country" className="text-ura-white">Country *</Label>
      <Select value={country} onValueChange={onCountryChange} required>
        <SelectTrigger className="bg-background/50 border-border/50 rounded-xl focus:border-ura-green transition-all duration-200">
          <SelectValue placeholder="Select your country" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          {countries.map((c) => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CountrySection;
