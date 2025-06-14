
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Globe } from 'lucide-react';

interface NewsFiltersProps {
  selectedCategory: string;
  selectedCountry: string;
  categories: string[];
  onCategoryChange: (category: string) => void;
  onCountryChange: (country: string) => void;
}

const NewsFilters = ({
  selectedCategory,
  selectedCountry,
  categories,
  onCategoryChange,
  onCountryChange
}: NewsFiltersProps) => {
  const countries = [
    { code: 'in', name: 'India' },
    { code: 'us', name: 'United States' },
    { code: 'gb', name: 'United Kingdom' },
    { code: 'au', name: 'Australia' },
    { code: 'ca', name: 'Canada' }
  ];

  return (
    <div className="scroll-fade-in bg-card/20 backdrop-blur-sm border border-border rounded-lg p-6 mb-8">
      <div className="flex items-center gap-4 mb-4">
        <Filter className="w-5 h-5 text-ura-green" />
        <h3 className="text-lg font-semibold text-ura-white">Filter News</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-ura-white flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Country
          </label>
          <Select value={selectedCountry} onValueChange={onCountryChange}>
            <SelectTrigger className="bg-card border-border text-ura-white">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-ura-white">
            Category
          </label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="bg-card border-border text-ura-white">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category, index) => (
          <Button
            key={category}
            onClick={() => onCategoryChange(category)}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            className={`
              stagger-animation
              ${selectedCategory === category
                ? "bg-ura-green text-ura-black hover:bg-ura-green-hover"
                : "border-ura-green/30 hover:border-ura-green text-ura-white"
              }
            `}
            style={{ '--animation-order': index } as React.CSSProperties}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default NewsFilters;
