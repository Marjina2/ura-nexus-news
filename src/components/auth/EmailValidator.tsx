
import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface EmailValidatorProps {
  email: string;
  onValidationChange: (isValid: boolean, message?: string) => void;
}

const EmailValidator: React.FC<EmailValidatorProps> = ({ email, onValidationChange }) => {
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);

  React.useEffect(() => {
    validateEmail(email);
  }, [email]);

  const validateEmail = (emailAddress: string) => {
    if (!emailAddress) {
      setIsValid(true);
      setValidationMessage('');
      onValidationChange(true);
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      setIsValid(false);
      setValidationMessage('Please enter a valid email address');
      onValidationChange(false, 'Please enter a valid email address');
      return;
    }

    const domain = emailAddress.toLowerCase().split('@')[1];
    
    // List of common temporary email domains
    const blockedDomains = [
      '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'temp-mail.org',
      'throwaway.email', 'yopmail.com', 'maildrop.cc', 'getnada.com',
      'tempmail.net', 'sharklasers.com', 'grr.la', 'guerrillamailblock.com',
      'fakeinbox.com', 'getairmail.com', 'spamgourmet.com', 'mytrashmail.com'
    ];

    // Check if domain is blocked
    if (blockedDomains.includes(domain)) {
      setIsValid(false);
      setValidationMessage('Temporary email addresses are not allowed');
      onValidationChange(false, 'Temporary email addresses are not allowed');
      return;
    }

    // Check for temporary email patterns
    const tempPatterns = ['temp', 'trash', 'fake', 'disposable', 'throwaway', 'guerrilla', 'spam'];
    const hasPatterns = tempPatterns.some(pattern => domain.includes(pattern));
    
    if (hasPatterns) {
      setIsValid(false);
      setValidationMessage('Temporary or disposable email addresses are not allowed');
      onValidationChange(false, 'Temporary or disposable email addresses are not allowed');
      return;
    }

    // Check domain structure
    if (domain.length < 4 || !domain.includes('.')) {
      setIsValid(false);
      setValidationMessage('Please use a valid email domain');
      onValidationChange(false, 'Please use a valid email domain');
      return;
    }

    // Email is valid
    setIsValid(true);
    setValidationMessage('');
    onValidationChange(true);
  };

  if (isValid || !email) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 mt-1 text-red-500 text-sm">
      <AlertTriangle className="w-4 h-4" />
      <span>{validationMessage}</span>
    </div>
  );
};

export default EmailValidator;
