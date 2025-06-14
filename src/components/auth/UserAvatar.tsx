
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface UserAvatarProps {
  user: any;
  profile: any;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, profile, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const getAvatarUrl = () => {
    // Check for Google profile picture
    if (user?.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url;
    }
    
    // Check for GitHub profile picture
    if (user?.identities?.find(id => id.provider === 'github')?.identity_data?.avatar_url) {
      return user.identities.find(id => id.provider === 'github').identity_data.avatar_url;
    }
    
    // Check for custom avatar in profile
    if (profile?.avatar_url) {
      return profile.avatar_url;
    }
    
    return null;
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    
    if (profile?.username) {
      return profile.username[0].toUpperCase();
    }
    
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    
    return 'U';
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage src={getAvatarUrl() || ''} alt="User avatar" />
      <AvatarFallback className="bg-ura-green text-ura-black font-semibold">
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
