
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface VerificationBadgeProps {
  isVerified?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({ 
  isVerified = false, 
  size = 'md',
  showText = true 
}) => {
  const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  
  if (isVerified) {
    return (
      <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
        <CheckCircle className={`${iconSize} mr-1`} />
        {showText && 'Verified'}
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="border-yellow-500/50 text-yellow-500">
      <AlertCircle className={`${iconSize} mr-1`} />
      {showText && 'Unverified'}
    </Badge>
  );
};

export default VerificationBadge;
