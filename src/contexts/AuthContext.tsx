import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';

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
  requestLogin: () => void;
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
    const cleanup = setupAuthListener();
    return cleanup; // Properly cleanup subscription on unmount
  }, []);

  const checkInitialSession = async () => {
    try {
      const session = await authService.getCurrentSession();
      if (session?.user) {
        setIsAuthenticated(true);
        setUser(session.user);
        setIsAnonymous(false);
        
        // Get display name with priority: onboarding > signup > fallback
        const displayName = await storageService.getDisplayNameWithPriority(session.user);
        const [firstName, ...lastNameParts] = displayName.split(' ');
        const lastName = lastNameParts.join(' ');
        
        setProfile({
          first_name: firstName || 'Friend',
          last_name: lastName || '',
          created_at: session.user.created_at
        });
      } else {
        // Check if user was in anonymous mode
        const anonymousMode = await authService.getAnonymousMode();
        if (anonymousMode) {
          setIsAuthenticated(true);
          setIsAnonymous(true);
          setUser(null);
          
          // For anonymous users, check if they have an onboarding name
          const displayName = await storageService.getDisplayNameWithPriority();
          const [firstName, ...lastNameParts] = displayName.split(' ');
          const lastName = lastNameParts.join(' ');
          
          setProfile({ 
            first_name: firstName || 'Friend', 
            last_name: lastName || '', 
            created_at: new Date().toISOString() 
          });
        }
      }
    } catch (error) {
      console.error('Error checking initial session');
    } finally {
      setIsLoading(false);
    }
  };

  const setupAuthListener = () => {
    try {
      const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event);

        if (session?.user) {
          setIsAuthenticated(true);
          setUser(session.user);
          setIsAnonymous(false);

          // Get display name with priority: onboarding > signup > fallback
          const displayName = await storageService.getDisplayNameWithPriority(session.user);
          const [firstName, ...lastNameParts] = displayName.split(' ');
          const lastName = lastNameParts.join(' ');

          setProfile({
            first_name: firstName || 'Friend',
            last_name: lastName || '',
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
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      setIsLoading(false);
      // Return a no-op cleanup function if setup fails
      return () => {};
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await authService.signIn(email, password);
      console.log('Sign in successful');
    } catch (error: any) {
      console.error('Sign in error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const data = await authService.signInWithGoogle();
      console.log('Google sign in successful');
    } catch (error: any) {
      console.error('Google sign in error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    try {
      const data = await authService.signUp(email, password, firstName, lastName);
      console.log('Sign up successful');
    } catch (error: any) {
      console.error('Sign up error');
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
      console.error('Sign out error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const skipAuth = async () => {
    setIsAuthenticated(true);
    setIsAnonymous(true);
    setUser(null);
    
    // For anonymous users, check if they have an onboarding name
    const displayName = await storageService.getDisplayNameWithPriority();
    const [firstName, ...lastNameParts] = displayName.split(' ');
    const lastName = lastNameParts.join(' ');
    
    setProfile({ 
      first_name: firstName || 'Friend', 
      last_name: lastName || '', 
      created_at: new Date().toISOString() 
    });
    authService.setAnonymousMode();
  };

  const requestLogin = () => {
    // Clear anonymous mode and reset auth state to trigger login flow
    setIsAuthenticated(false);
    setIsAnonymous(false);
    setUser(null);
    setProfile(null);
    authService.clearAnonymousMode();
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
    requestLogin,
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