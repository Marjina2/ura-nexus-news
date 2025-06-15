
import React from 'react';
import { Button } from '@/components/ui/button';

interface CategoryFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8 justify-center">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onCategoryChange(category)}
          className={selectedCategory === category ? "bg-pulsee-green text-pulsee-black" : ""}
          size="sm"
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilters;
