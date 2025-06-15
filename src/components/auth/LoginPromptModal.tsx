
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { LogIn } from 'lucide-react';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectPath?: string;
}

const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ 
  isOpen, 
  onClose, 
  redirectPath = '/news' 
}) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    const redirectUrl = encodeURIComponent(redirectPath);
    navigate(`/auth?redirect=${redirectUrl}`);
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-ura-green">
            <LogIn className="w-5 h-5" />
            Login Required
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Please log in to read full articles and access premium features. 
            Create a free account to get started!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogin} className="bg-ura-green text-ura-black hover:bg-ura-green-hover">
            Login / Sign Up
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LoginPromptModal;
