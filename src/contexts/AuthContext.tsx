import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { authService, AuthResponse } from '../services/authService';
import { UserProfile } from '../config/supabase';

interface AuthContextType {
  // Auth state
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Auth actions
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    privacyAccepted: boolean;
  }) => Promise<AuthResponse>;
  signInWithGoogle: () => Promise<AuthResponse>;
  signOut: () => Promise<AuthResponse>;
  resetPassword: (email: string) => Promise<AuthResponse>;
  verifyEmail: (token: string) => Promise<AuthResponse>;
  resendVerification: (email: string) => Promise<AuthResponse>;
  
  // Profile actions
  updateProfile: (updates: Partial<UserProfile>) => Promise<AuthResponse>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (isMounted) {
          setUser(currentUser);
          
          if (currentUser) {
            const userProfile = await authService.getUserProfile(currentUser.id);
            setProfile(userProfile);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = authService.onAuthStateChange((authUser, authProfile) => {
      if (isMounted) {
        setUser(authUser);
        setProfile(authProfile);
        if (!isLoading) {
          setIsLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Auth actions
  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.signIn({ email, password });
      
      if (response.success && response.user) {
        setUser(response.user);
        setProfile(response.profile || null);
      }
      
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    privacyAccepted: boolean;
  }): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.signUp({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        privacyAccepted: data.privacyAccepted,
      });
      
      if (response.success && response.user && !response.needsVerification) {
        setUser(response.user);
        // Profile will be created by trigger, fetch it
        const userProfile = await authService.getUserProfile(response.user.id);
        setProfile(userProfile);
      }
      
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.signInWithGoogle();
      
      if (response.success && response.user) {
        setUser(response.user);
        setProfile(response.profile || null);
      }
      
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.signOut();
      
      if (response.success) {
        setUser(null);
        setProfile(null);
      }
      
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<AuthResponse> => {
    return await authService.resetPassword(email);
  };

  const verifyEmail = async (token: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.verifyEmail(token);
      
      if (response.success && response.user) {
        setUser(response.user);
        // Fetch profile after verification
        const userProfile = await authService.getUserProfile(response.user.id);
        setProfile(userProfile);
      }
      
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerification = async (email: string): Promise<AuthResponse> => {
    return await authService.resendVerification(email);
  };

  // Profile actions
  const updateProfile = async (updates: Partial<UserProfile>): Promise<AuthResponse> => {
    if (!user) {
      return { success: false, error: 'No authenticated user' };
    }

    const response = await authService.updateUserProfile(user.id, updates);
    
    if (response.success && response.profile) {
      setProfile(response.profile);
    }
    
    return response;
  };

  const refreshProfile = async (): Promise<void> => {
    if (user) {
      const userProfile = await authService.getUserProfile(user.id);
      setProfile(userProfile);
    }
  };

  const value: AuthContextType = {
    // Auth state
    user,
    profile,
    isLoading,
    isAuthenticated,
    
    // Auth actions
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    verifyEmail,
    resendVerification,
    
    // Profile actions
    updateProfile,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};