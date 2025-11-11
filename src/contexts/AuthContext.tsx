import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { usePostHog } from 'posthog-react-native';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';
import { firstActionTracker } from '../services/firstActionTracker';
import { subscriptionService } from '../services/subscriptionService';
import { profileSyncService } from '../services/profileSyncService';

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
  const posthog = usePostHog();
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
      console.log('[AuthProvider] checkInitialSession: START');

      let session = null;
      try {
        session = await authService.getCurrentSession();
        console.log('[AuthProvider] getCurrentSession: SUCCESS', !!session);
      } catch (sessionError) {
        console.error('[AuthProvider] getCurrentSession: FAILED', sessionError);
        setIsLoading(false);
        return; // Exit early if we can't get session
      }

      if (session?.user) {
        console.log('[AuthProvider] User session found');
        setIsAuthenticated(true);
        setUser(session.user);
        setIsAnonymous(false);

        try {
          // 🔄 Load profile from Supabase for authenticated users
          console.log('[AuthProvider] Loading profile from Supabase...');
          const supabaseProfile = await profileSyncService.loadFromSupabase(session.user.id);

          // Get display name with priority (Supabase profile > auth metadata > email)
          const displayName = await storageService.getDisplayNameWithPriority(session.user);
          const [firstName, ...lastNameParts] = displayName.split(' ');
          const lastName = lastNameParts.join(' ');

          setProfile({
            first_name: firstName || 'Friend',
            last_name: lastName || '',
            created_at: session.user.created_at
          });

          // 🎯 Identify user in PostHog
          posthog?.identify(session.user.id, {
            email: session.user.email || '',
            firstName: firstName || 'Friend',
            lastName: lastName || '',
            isAnonymous: false,
            accountCreatedAt: session.user.created_at || new Date().toISOString(),
          });

          console.log('[AuthProvider] Profile loaded and set successfully');
        } catch (profileError) {
          console.error('[AuthProvider] Error loading profile:', profileError);
          // Set default profile if storage fails
          setProfile({
            first_name: 'Friend',
            last_name: '',
            created_at: session.user.created_at
          });
        }
      } else {
        console.log('[AuthProvider] No user session, checking anonymous mode');
        try {
          const anonymousMode = await authService.getAnonymousMode();
          console.log('[AuthProvider] Anonymous mode:', anonymousMode);

          if (anonymousMode) {
            setIsAuthenticated(true);
            setIsAnonymous(true);
            setUser(null);

            try {
              const displayName = await storageService.getDisplayNameWithPriority();
              const [firstName, ...lastNameParts] = displayName.split(' ');
              const lastName = lastNameParts.join(' ');

              setProfile({
                first_name: firstName || 'Friend',
                last_name: lastName || '',
                created_at: new Date().toISOString()
              });
            } catch (displayError) {
              console.error('[AuthProvider] Error getting display name:', displayError);
              setProfile({
                first_name: 'Friend',
                last_name: '',
                created_at: new Date().toISOString()
              });
            }
          }
        } catch (anonError) {
          console.error('[AuthProvider] Error checking anonymous mode:', anonError);
        }
      }
    } catch (error) {
      console.error('[AuthProvider] checkInitialSession: FATAL ERROR', error);
    } finally {
      // Initialize RevenueCat with user ID (if authenticated)
      try {
        console.log('[AuthProvider] Initializing RevenueCat...');
        // Use actual user ID or let RevenueCat generate anonymous ID (don't pass 'anonymous' string - it's blocked)
        const userId = user?.id;
        await subscriptionService.initialize(userId);
        console.log('[AuthProvider] RevenueCat initialized successfully');
      } catch (rcError) {
        console.error('[AuthProvider] RevenueCat initialization failed:', rcError);
        // Non-blocking - app continues even if RevenueCat fails
      }

      console.log('[AuthProvider] checkInitialSession: COMPLETE, setting isLoading=false');
      setIsLoading(false);
    }
  };

  const setupAuthListener = () => {
    try {
      console.log('[AuthProvider] setupAuthListener: START');

      const authStateResult = authService.onAuthStateChange(async (event, session) => {
        try {
          console.log('[AuthProvider] Auth state changed:', event);

          if (session?.user) {
            setIsAuthenticated(true);
            setUser(session.user);
            setIsAnonymous(false);

            try {
              const displayName = await storageService.getDisplayNameWithPriority(session.user);
              const [firstName, ...lastNameParts] = displayName.split(' ');
              const lastName = lastNameParts.join(' ');

              setProfile({
                first_name: firstName || 'Friend',
                last_name: lastName || '',
                created_at: session.user.created_at
              });
            } catch (profileError) {
              console.error('[AuthProvider] Error in auth listener profile setup:', profileError);
              setProfile({
                first_name: 'Friend',
                last_name: '',
                created_at: session.user.created_at
              });
            }
          } else {
            try {
              const anonymousMode = await authService.getAnonymousMode();
              if (!anonymousMode) {
                setIsAuthenticated(false);
                setUser(null);
                setProfile(null);
                setIsAnonymous(false);
              }
            } catch (anonError) {
              console.error('[AuthProvider] Error checking anonymous in listener:', anonError);
            }
          }
          setIsLoading(false);
        } catch (callbackError) {
          console.error('[AuthProvider] Error in auth state callback:', callbackError);
          setIsLoading(false);
        }
      });

      console.log('[AuthProvider] Auth listener setup complete');

      // Safely extract subscription
      if (authStateResult?.data?.subscription) {
        return () => {
          console.log('[AuthProvider] Unsubscribing from auth listener');
          authStateResult.data.subscription.unsubscribe();
        };
      } else {
        console.warn('[AuthProvider] No subscription returned from onAuthStateChange');
        return () => {};
      }
    } catch (error) {
      console.error('[AuthProvider] setupAuthListener: FATAL ERROR', error);
      setIsLoading(false);
      return () => {};
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await authService.signIn(email, password);

      // 🎯 Identify user in PostHog
      if (data?.user) {
        posthog?.identify(data.user.id, {
          email: data.user.email || '',
          isAnonymous: false,
        });
        posthog?.capture('user_signed_in', {
          method: 'email',
        });
      }

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

      // 🎯 Identify user in PostHog
      if (data?.user) {
        posthog?.identify(data.user.id, {
          email: data.user.email || '',
          isAnonymous: false,
        });
        posthog?.capture('user_signed_in', {
          method: 'google',
        });
      }

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

      // 🎯 Identify user in PostHog
      if (data?.user) {
        posthog?.identify(data.user.id, {
          email: data.user.email || '',
          firstName,
          lastName,
          isAnonymous: false,
          accountCreatedAt: new Date().toISOString(),
        });
        posthog?.capture('user_signed_up', {
          method: 'email',
        });
      }

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
      // 🎯 Track sign out and reset PostHog
      posthog?.capture('user_signed_out');
      posthog?.reset(); // Clears user identity

      // 🎯 Reset first action tracking
      await firstActionTracker.reset();

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

    // 🎯 Set anonymous flag in PostHog
    posthog?.capture('anonymous_mode_enabled', {
      isAnonymous: true,
      firstName: firstName || 'Friend',
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