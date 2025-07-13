
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

interface NewsFiltersProps {
  selectedCategory: string;
  categories: string[];
  onCategoryChange: (category: string) => void;
}

const NewsFilters = ({
  selectedCategory,
  categories,
  onCategoryChange,
}: NewsFiltersProps) => {
  return (
    <div className="scroll-fade-in bg-card/20 backdrop-blur-sm border border-border rounded-lg p-6 mb-8">
      <div className="flex items-center gap-4 mb-4">
        <Filter className="w-5 h-5 text-pulsee-green" />
        <h3 className="text-lg font-semibold text-pulsee-white">Filter News</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-pulsee-white">
            Category
          </label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="bg-card border-border text-pulsee-white">
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
                ? "bg-pulsee-green text-pulsee-black hover:bg-pulsee-green-hover"
                : "border-pulsee-green/30 hover:border-pulsee-green text-pulsee-white"
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
