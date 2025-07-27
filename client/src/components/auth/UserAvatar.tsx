
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
    if (user?.identities?.find((id: any) => id.provider === 'github')?.identity_data?.avatar_url) {
      return user.identities.find((id: any) => id.provider === 'github').identity_data.avatar_url;
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
        .map((n: string) => n[0])
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
    <Avatar className={`${sizeClasses[size]} ${className} ring-2 ring-ura-green/20 transition-all duration-200 hover:ring-ura-green/40`}>
      <AvatarImage src={getAvatarUrl() || ''} alt="User avatar" className="object-cover" />
      <AvatarFallback className="bg-gradient-to-br from-ura-green to-ura-green-hover text-ura-black font-semibold">
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
