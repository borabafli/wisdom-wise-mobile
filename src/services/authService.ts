import { supabase, isSupabaseAvailable, supabaseInitError } from '../config/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import Constants, { ExecutionEnvironment } from 'expo-constants';

// Required so Android custom tabs can hand the OAuth redirect back to the app.
WebBrowser.maybeCompleteAuthSession();

export class AuthService {
  // Check if Supabase is available before operations
  private checkSupabaseAvailable(): void {
    if (!isSupabaseAvailable()) {
      throw new Error(`Supabase not available: ${supabaseInitError || 'Unknown error'}`);
    }
  }
  // Helper to get the correct redirect URL for current environment
  private getRedirectUrl(path: string = '/auth/verify'): string {
    if (__DEV__) {
      // For development, we'll use a localhost URL that we'll configure in Supabase
      // This works for all developers without needing to change IPs
      return `exp://localhost:19000/--${path}`;
    }
    // Production: use custom scheme (must match app.json scheme)
    return `zenmind:${path}`;
  }

  // Sign up with email and password
  async signUp(email: string, password: string, firstName: string, lastName: string) {
    try {
      this.checkSupabaseAvailable();
      const { data, error } = await supabase!.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
          emailRedirectTo: this.getRedirectUrl('/auth/verify')
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error: any) {
      console.error('AuthService.signUp error:', error);
      throw error;
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string) {
    try {
      this.checkSupabaseAvailable();
      const { data, error } = await supabase!.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error: any) {
      console.error('AuthService.signIn error:', error);
      throw error;
    }
  }

  // Sign in with Google OAuth
  async signInWithGoogle() {
    try {
      this.checkSupabaseAvailable();

      const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

      // Configure the redirect URL for the current runtime (Expo Go vs standalone)
      const redirectUrl = isExpoGo
        ? AuthSession.getDefaultReturnUrl('auth/verify')
        : AuthSession.makeRedirectUri({
            scheme: 'zenmind',
            path: 'auth/verify',
          });

      console.log('OAuth redirect URL:', redirectUrl);

      // Start the OAuth session with Supabase
      const { data, error } = await supabase!.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Supabase OAuth error:', error);
        throw new Error(error.message);
      }

      if (!data.url) {
        throw new Error('No OAuth URL returned from Supabase');
      }

      console.log('Opening OAuth URL:', data.url);

      // Open the OAuth URL in the browser
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl
      );

      console.log('WebBrowser result:', result);

      if (result.type === 'cancel') {
        throw new Error('Authentication was cancelled');
      }

      if (result.type === 'dismiss') {
        throw new Error('Authentication was dismissed');
      }

      if (result.type !== 'success' || !result.url) {
        throw new Error('Authentication failed - no success URL returned');
      }

      // Extract tokens from the callback URL
      const url = new URL(result.url);
      const fragment = url.hash.substring(1); // Remove the '#' character
      const params = new URLSearchParams(fragment);
      
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      
      if (!accessToken) {
        throw new Error('No access token found in OAuth callback');
      }

      // Set the session manually with the extracted tokens
      const { data: sessionData, error: sessionError } = await supabase!.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || ''
      });
      
      if (sessionError) {
        throw new Error(`Session error: ${sessionError.message}`);
      }

      if (!sessionData.session) {
        throw new Error('No session established after OAuth');
      }

      return { session: sessionData.session, user: sessionData.session.user };
    } catch (error: any) {
      console.error('AuthService.signInWithGoogle error:', error);
      throw error;
    }
  }

  // Sign out
  async signOut() {
    try {
      this.checkSupabaseAvailable();
      const { error } = await supabase!.auth.signOut();
      
      if (error) {
        throw new Error(error.message);
      }

      // Only clear auth-related data, preserve all user content
      // Note: Supabase manages its own auth tokens, but we clear any custom auth data
      const authKeysToRemove = [
        'userProfile', // User profile data from auth
        'authState',   // Any custom auth state
        'user_profile' // Alternative key name
      ];

      // Clear only specific auth-related keys, preserving all user content:
      // - chat_current_session, chat_history (preserved)
      // - user_values, value_insights (preserved) 
      // - wisdom_wise_mood_ratings (preserved)
      // - user_settings (preserved)
      // - thought_patterns, insights_history (preserved)
      await Promise.all(
        authKeysToRemove.map(key => AsyncStorage.removeItem(key).catch(() => {}))
      );
    } catch (error: any) {
      console.error('AuthService.signOut error:', error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      this.checkSupabaseAvailable();
      const { data: { user }, error } = await supabase!.auth.getUser();
      
      if (error) {
        throw new Error(error.message);
      }

      return user;
    } catch (error: any) {
      console.error('AuthService.getCurrentUser error:', error);
      return null;
    }
  }

  // Get current session
  async getCurrentSession() {
    try {
      if (!isSupabaseAvailable()) {
        console.log('[AuthService] Supabase not available, returning null session');
        return null;
      }
      const { data: { session }, error } = await supabase!.auth.getSession();
      
      if (error) {
        throw new Error(error.message);
      }

      return session;
    } catch (error: any) {
      console.error('AuthService.getCurrentSession error:', error);
      return null;
    }
  }

  // Reset password
  async resetPassword(email: string) {
    try {
      this.checkSupabaseAvailable();
      const { error } = await supabase!.auth.resetPasswordForEmail(email);
      
      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      console.error('AuthService.resetPassword error:', error);
      throw error;
    }
  }

  // Resend verification email
  async resendVerification(email: string) {
    try {
      this.checkSupabaseAvailable();
      const { error } = await supabase!.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: this.getRedirectUrl('/auth/verify')
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      console.error('AuthService.resendVerification error:', error);
      throw error;
    }
  }

  // Verify email with token (if manually handling verification)
  async verifyEmail(token: string, email: string) {
    try {
      this.checkSupabaseAvailable();
      const { data, error } = await supabase!.auth.verifyOtp({
        token,
        type: 'signup',
        email,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error: any) {
      console.error('AuthService.verifyEmail error:', error);
      throw error;
    }
  }

  // Listen to auth changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!isSupabaseAvailable()) {
      console.warn('[AuthService] Supabase not available, returning no-op subscription');
      return {
        data: {
          subscription: {
            unsubscribe: () => console.log('[AuthService] No-op unsubscribe')
          }
        }
      };
    }
    return supabase!.auth.onAuthStateChange(callback);
  }

  // Anonymous mode management
  async setAnonymousMode() {
    try {
      await AsyncStorage.setItem('anonymous_mode', 'true');
    } catch (error) {
      console.error('Error setting anonymous mode:', error);
    }
  }

  async getAnonymousMode(): Promise<boolean> {
    try {
      const anonymousMode = await AsyncStorage.getItem('anonymous_mode');
      return anonymousMode === 'true';
    } catch (error) {
      console.error('Error getting anonymous mode:', error);
      return false;
    }
  }

  async clearAnonymousMode() {
    try {
      await AsyncStorage.removeItem('anonymous_mode');
    } catch (error) {
      console.error('Error clearing anonymous mode:', error);
    }
  }

  // Utility method to clear specific data on signout (if needed)
  async clearUserData(options: {
    clearChatHistory?: boolean;
    clearMoodRatings?: boolean;
    clearValues?: boolean;
    clearSettings?: boolean;
  } = {}) {
    try {
      const keysToRemove: string[] = [];

      if (options.clearChatHistory) {
        keysToRemove.push('chat_current_session', 'chat_history');
      }
      if (options.clearMoodRatings) {
        keysToRemove.push('wisdom_wise_mood_ratings');
      }
      if (options.clearValues) {
        keysToRemove.push('user_values', 'value_insights', 'value_reflection_summaries');
      }
      if (options.clearSettings) {
        keysToRemove.push('user_settings');
      }

      await Promise.all(
        keysToRemove.map(key => AsyncStorage.removeItem(key).catch(() => {}))
      );

      console.log('Cleared user data:', keysToRemove);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  }
}

export const authService = new AuthService();