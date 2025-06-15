
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const getPasswordStrength = (password: string) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    score = Object.values(checks).filter(Boolean).length;

    if (score < 2) return { strength: 'Weak', color: 'bg-red-500', percentage: 20 };
    if (score < 4) return { strength: 'Medium', color: 'bg-yellow-500', percentage: 60 };
    return { strength: 'Strong', color: 'bg-green-500', percentage: 100 };
  };

  const { strength, color, percentage } = getPasswordStrength(password);

  const requirements = [
    { text: 'At least 8 characters', met: password.length >= 8 },
    { text: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { text: 'One lowercase letter', met: /[a-z]/.test(password) },
    { text: 'One number', met: /\d/.test(password) },
    { text: 'One special character', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
  ];

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${color}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className={`text-xs font-medium ${
          strength === 'Weak' ? 'text-red-500' : 
          strength === 'Medium' ? 'text-yellow-500' : 
          'text-green-500'
        }`}>
          {strength}
        </span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <div className="space-y-1">
                <p className="font-medium">Password Requirements:</p>
                {requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${req.met ? 'bg-green-500' : 'bg-muted'}`} />
                    <span className={req.met ? 'text-green-500' : 'text-muted-foreground'}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default PasswordStrength;
