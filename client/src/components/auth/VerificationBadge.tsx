
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

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
  if (!isVerified) return null;

  const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  
  return (
    <Badge variant="secondary" className="bg-ura-green/10 text-ura-green border-ura-green/20">
      <CheckCircle className={`${iconSize} mr-1`} />
      {showText && 'Verified'}
    </Badge>
  );
};

export default VerificationBadge;
