
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signUpWithEmail: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  updateProfile: (updates: any) => Promise<{ error: any }>;
  resendVerification: () => Promise<{ error: any }>;
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
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
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
  };

  const signInWithEmail = async (email: string, password: string) => {
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
  };

  const signUpWithEmail = async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: userData
      }
    });
    
    if (!error && data.user) {
      if (!data.user.email_confirmed_at) {
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      } else {
        toast({
          title: "Account created and verified!",
          description: "Welcome! You can now access all features.",
        });
      }
    }
    
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    return { error };
  };

  const updateProfile = async (updates: any) => {
    if (!user) return { error: 'No user found' };
    
    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id);
    
    if (!error) {
      setProfile({ ...profile, ...updates });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    }
    
    return { error };
  };

  const resendVerification = async () => {
    if (!user?.email) return { error: 'No email found' };
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email
    });

    if (!error) {
      toast({
        title: "Verification email sent!",
        description: "Please check your inbox.",
      });
    }
    
    return { error };
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signOut,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    updateProfile,
    resendVerification,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
