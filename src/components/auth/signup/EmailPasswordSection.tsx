
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import EmailValidator from '../EmailValidator';
import PasswordStrength from '../PasswordStrength';

interface EmailPasswordSectionProps {
  email: string;
  password: string;
  emailValid: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onEmailValidation: (isValid: boolean, message?: string) => void;
}

const EmailPasswordSection: React.FC<EmailPasswordSectionProps> = ({
  email,
  password,
  emailValid,
  onEmailChange,
  onPasswordChange,
  onEmailValidation,
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-ura-white">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          className="bg-background/50 border-border/50 rounded-xl focus:border-ura-green transition-all duration-200"
          placeholder="john@example.com"
        />
        <EmailValidator email={email} onValidationChange={onEmailValidation} />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="text-ura-white">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
          minLength={6}
          className="bg-background/50 border-border/50 rounded-xl focus:border-ura-green transition-all duration-200"
          placeholder="••••••••"
        />
        <PasswordStrength password={password} />
      </div>
    </>
  );
};

export default EmailPasswordSection;
