
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingAnimationProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  showProgress?: boolean;
  progress?: number;
}

const LoadingAnimation = ({ 
  size = 'md', 
  text = 'Loading...', 
  showProgress = false, 
  progress = 0 
}: LoadingAnimationProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-pulsee-green`} />
        <div className="absolute inset-0 animate-ping">
          <div className={`${sizeClasses[size]} rounded-full bg-pulsee-green/20`} />
        </div>
      </div>
      
      {text && (
        <p className={`${textSizes[size]} text-muted-foreground animate-pulse`}>
          {text}
        </p>
      )}
      
      {showProgress && (
        <div className="w-48 bg-muted rounded-full h-2">
          <div 
            className="bg-pulsee-green h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default LoadingAnimation;
