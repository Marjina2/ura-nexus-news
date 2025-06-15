
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any | null;
  loading: boolean;
  needsProfileCompletion: boolean;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signUpWithEmail: (email: string, password: string, username: string, country: string, fullName: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  updateProfile: (updates: any) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsProfileCompletion, setNeedsProfileCompletion] = useState(false);
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!error && data) {
        setProfile(data);
        
        const isIncomplete = !data.full_name || !data.country;
        setNeedsProfileCompletion(isIncomplete);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        console.log('Auth state changed:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            if (isMounted) {
              fetchProfile(session.user.id);
            }
          }, 0);
        } else {
          setProfile(null);
          setNeedsProfileCompletion(false);
        }
        
        setLoading(false);
      }
    );

    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            setTimeout(() => {
              if (isMounted) {
                fetchProfile(session.user.id);
              }
            }, 0);
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Unexpected error getting session:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setUser(null);
        setSession(null);
        setProfile(null);
        toast({
          title: "Signed out successfully",
          description: "You have been logged out.",
        });
      }
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error) {
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      return { error };
    }
  };

  const signUpWithEmail = async (email: string, password: string, username: string, country: string, fullName: string) => {
    try {
      console.log('Starting email sign up process...');
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            username,
            country,
            full_name: fullName,
          }
        }
      });
      
      console.log('Sign up response:', { data, error });
      
      if (!error && data.user) {
        if (!data.user.email_confirmed_at) {
          console.log('User created, verification email should be sent');
          toast({
            title: "Account created!",
            description: "Please check your email to verify your account. You must verify within 24 hours.",
          });
        } else {
          console.log('User created and already confirmed');
          toast({
            title: "Account created and verified!",
            description: "Welcome to URA! You can now access all features.",
          });
        }
      }
      
      return { error };
    } catch (error) {
      console.error('Unexpected error during sign up:', error);
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      return { error };
    } catch (error) {
      console.error('Unexpected error during Google sign in:', error);
      return { error };
    }
  };

  const updateProfile = async (updates: any) => {
    if (!user) return { error: 'No user found' };
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id);
      
      if (!error) {
        const updatedProfile = { ...profile, ...updates };
        setProfile(updatedProfile);
        
        const isIncomplete = !updatedProfile.full_name || !updatedProfile.country;
        setNeedsProfileCompletion(isIncomplete);
        
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Unexpected error updating profile:', error);
      return { error };
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    needsProfileCompletion,
    signOut,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
