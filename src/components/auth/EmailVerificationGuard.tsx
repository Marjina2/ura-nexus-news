
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface EmailVerificationGuardProps {
  children: React.ReactNode;
}

const EmailVerificationGuard: React.FC<EmailVerificationGuardProps> = ({ children }) => {
  return (
    <ProtectedRoute requireVerification={true}>
      {children}
    </ProtectedRoute>
  );
};

export default EmailVerificationGuard;
