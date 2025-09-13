import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { authService } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  profile: any;
  isAnonymous: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  skipAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start as true to check initial session
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Check for existing session on app start
  useEffect(() => {
    checkInitialSession();
    setupAuthListener();
  }, []);

  const checkInitialSession = async () => {
    try {
      const session = await authService.getCurrentSession();
      if (session?.user) {
        setIsAuthenticated(true);
        setUser(session.user);
        setIsAnonymous(false);
        // Set user profile data if available
        setProfile({
          first_name: session.user.user_metadata?.first_name || '',
          last_name: session.user.user_metadata?.last_name || '',
          created_at: session.user.created_at
        });
      } else {
        // Check if user was in anonymous mode
        const anonymousMode = await authService.getAnonymousMode();
        if (anonymousMode) {
          setIsAuthenticated(true);
          setIsAnonymous(true);
          setUser(null);
          setProfile({ first_name: 'Friend', last_name: '', created_at: new Date().toISOString() });
        }
      }
    } catch (error) {
      console.error('Error checking initial session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupAuthListener = () => {
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (session?.user) {
        setIsAuthenticated(true);
        setUser(session.user);
        setIsAnonymous(false);
        setProfile({
          first_name: session.user.user_metadata?.first_name || '',
          last_name: session.user.user_metadata?.last_name || '',
          created_at: session.user.created_at
        });
      } else {
        // Don't change authenticated status if in anonymous mode
        const checkAnonymous = async () => {
          const anonymousMode = await authService.getAnonymousMode();
          if (!anonymousMode) {
            setIsAuthenticated(false);
            setUser(null);
            setProfile(null);
            setIsAnonymous(false);
          }
        };
        checkAnonymous();
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await authService.signIn(email, password);
      console.log('Sign in successful:', data.user?.email);
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const data = await authService.signInWithGoogle();
      console.log('Google sign in successful:', data.user?.email);
    } catch (error: any) {
      console.error('Google sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    try {
      const data = await authService.signUp(email, password, firstName, lastName);
      console.log('Sign up successful:', data.user?.email);
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
      // Clear anonymous mode
      await authService.clearAnonymousMode();
      setIsAuthenticated(false);
      setUser(null);
      setProfile(null);
      setIsAnonymous(false);
      console.log('Sign out successful');
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const skipAuth = () => {
    setIsAuthenticated(true);
    setIsAnonymous(true);
    setUser(null);
    setProfile({ first_name: 'Friend', last_name: '', created_at: new Date().toISOString() });
    authService.setAnonymousMode();
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    profile,
    isAnonymous,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    skipAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};