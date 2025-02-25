import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Session } from '@supabase/supabase-js';
import { Alert } from 'react-native';

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider - Initializing');
    
    // Initialize session from existing session
    const initializeSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log('AuthProvider - Initial session:', !!data.session);
        setSession(data.session);
      } catch (err) {
        console.error('AuthProvider - Error getting session:', err);
      } finally {
        setLoading(false);
      }
    };
    
    initializeSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      console.log('AuthProvider - Auth state changed:', _event);
      setSession(currentSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('AuthProvider - Signing in:', email);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('AuthProvider - Sign in error:', error);
        throw error;
      }
      console.log('AuthProvider - Sign in successful');
    } catch (error: any) {
      console.error('AuthProvider - Sign in exception:', error.message);
      Alert.alert('Error signing in', error.message || 'An error occurred');
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    console.log('AuthProvider - Signing up:', email);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        console.error('AuthProvider - Sign up error:', error);
        throw error;
      }
      console.log('AuthProvider - Sign up successful');
      Alert.alert('Sign Up Successful', 'Check your email for a confirmation link.');
    } catch (error: any) {
      console.error('AuthProvider - Sign up exception:', error.message);
      Alert.alert('Error signing up', error.message || 'An error occurred');
      throw error;
    }
  };

  const signOut = async () => {
    console.log('AuthProvider - Signing out');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('AuthProvider - Sign out error:', error);
        throw error;
      }
      console.log('AuthProvider - Sign out successful');
    } catch (error: any) {
      console.error('AuthProvider - Sign out exception:', error.message);
      Alert.alert('Error signing out', error.message || 'An error occurred');
      throw error;
    }
  };

  const value = {
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  console.log('AuthProvider - Rendering with session:', !!session, 'loading:', loading);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 