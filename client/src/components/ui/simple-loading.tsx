
import React from 'react';
import { Loader2 } from 'lucide-react';

interface SimpleLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const SimpleLoading = ({ 
  size = 'md', 
  text = 'Loading...', 
  className = '' 
}: SimpleLoadingProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className="relative">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-pulsee-green`} />
        <div className="absolute inset-0 animate-ping">
          <div className={`${sizeClasses[size]} rounded-full bg-pulsee-green/20`} />
        </div>
      </div>
      
      {text && (
        <p className="text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default SimpleLoading;
