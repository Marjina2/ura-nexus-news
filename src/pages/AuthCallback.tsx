
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          toast({
            title: "Authentication failed",
            description: error.message,
            variant: "destructive",
          });
          navigate('/auth');
          return;
        }

        if (data.session) {
          // Check for pending user data from OAuth signup
          const pendingUserData = localStorage.getItem('pendingUserData');
          
          if (pendingUserData) {
            try {
              const userData = JSON.parse(pendingUserData);
              
              // Update user metadata with the collected data
              const { error: updateError } = await supabase.auth.updateUser({
                data: {
                  username: userData.username,
                  country: userData.country,
                  full_name: userData.full_name
                }
              });
              
              if (updateError) {
                console.error('Error updating user metadata:', updateError);
              }
              
              localStorage.removeItem('pendingUserData');
            } catch (parseError) {
              console.error('Error parsing pending user data:', parseError);
              localStorage.removeItem('pendingUserData');
            }
          }

          // Check if user has completed profile setup
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single();

          if (!profile) {
            // If no profile exists but we have metadata, it will be created by the trigger
            // Give it a moment and redirect to home
            setTimeout(() => {
              navigate('/');
            }, 1000);
          } else {
            navigate('/');
          }
        } else {
          navigate('/auth');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-ura-black via-gray-900 to-ura-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ura-green mx-auto mb-4"></div>
        <p className="text-ura-white">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
