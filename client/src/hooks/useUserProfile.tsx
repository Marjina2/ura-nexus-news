import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import type { Profile } from '@shared/schema';

type UserProfile = Profile;

export const useUserProfile = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchProfile = async () => {
    if (!user?.id) return;

    try {
      const profile = await apiClient.getProfile(user.id);
      setProfile(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user?.id) return false;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update local state
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const sendEmailVerification = async () => {
    if (!user?.id || !user?.primaryEmailAddress?.emailAddress) return false;

    try {
      const supabaseUrl = 'https://csjwgsqnsarvmdvmfwig.supabase.co';
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzandnc3Fuc2Fydm1kdm1md2lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NjE5MTIsImV4cCI6MjA2NTIzNzkxMn0.rR86HzR9JKFVLIpSfH4n1VGmSye5_9uGKvHP06_Z_fE';
      
      const response = await fetch(`${supabaseUrl}/functions/v1/send-verification-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          email: user.primaryEmailAddress.emailAddress,
          userId: user.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send verification email');
      }

      const result = await response.json();
      
      toast({
        title: "Verification Email Sent",
        description: "Please check your email for the verification link"
      });

      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      toast({
        title: "Error",
        description: "Failed to send verification email",
        variant: "destructive"
      });
      return false;
    }
  };

  const addConnectedDevice = async (deviceInfo: any) => {
    if (!profile) return false;

    const newDevice = {
      id: Math.random().toString(36).substring(2, 15),
      ...deviceInfo,
      connected_at: new Date().toISOString()
    };

    const updatedDevices = [...(Array.isArray(profile.connected_devices) ? profile.connected_devices : []), newDevice];
    const { error } = await supabase
      .from('profiles')
      .update({ connected_devices: updatedDevices })
      .eq('id', profile.id);

    return !error;
  };

  const removeConnectedDevice = async (deviceId: string) => {
    if (!profile) return false;

    const currentDevices = Array.isArray(profile.connected_devices) ? profile.connected_devices : [];
    const updatedDevices = currentDevices.filter(
      (device: any) => device.id !== deviceId
    );
    const { error } = await supabase
      .from('profiles')
      .update({ connected_devices: updatedDevices })
      .eq('id', profile.id);

    return !error;
  };

  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

  return {
    profile,
    loading,
    updating,
    updateProfile,
    sendEmailVerification,
    addConnectedDevice,
    removeConnectedDevice,
    refetch: fetchProfile
  };
};