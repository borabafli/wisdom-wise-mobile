import { supabase } from '../config/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

export class AuthService {
  // Helper to get the correct redirect URL for current environment
  private getRedirectUrl(path: string = '/auth/verify'): string {
    if (__DEV__) {
      // For development, we'll use a localhost URL that we'll configure in Supabase
      // This works for all developers without needing to change IPs
      return `exp://localhost:19000/--${path}`;
    }
    // Production: use custom scheme
    return `wisdomwise:${path}`;
  }

  // Sign up with email and password
  async signUp(email: string, password: string, firstName: string, lastName: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
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
      const { data, error } = await supabase.auth.signInWithPassword({
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
      // Configure the redirect URL for your app scheme
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: 'wisdomwise',
        path: '/auth/callback'
      });

      console.log('OAuth redirect URL:', redirectUrl);

      // Start the OAuth session with Supabase
      const { data, error } = await supabase.auth.signInWithOAuth({
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

      // Let Supabase handle the callback URL automatically
      // The session should be set automatically via the auth state change listener
      
      // Wait a moment for the session to be established
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if we have a valid session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(`Session error: ${sessionError.message}`);
      }

      if (!session) {
        throw new Error('No session established after OAuth');
      }

      return { session, user: session.user };
    } catch (error: any) {
      console.error('AuthService.signInWithGoogle error:', error);
      throw error;
    }
  }

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      
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
      const { data: { user }, error } = await supabase.auth.getUser();
      
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
      const { data: { session }, error } = await supabase.auth.getSession();
      
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
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
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
      const { error } = await supabase.auth.resend({
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
      const { data, error } = await supabase.auth.verifyOtp({
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
    return supabase.auth.onAuthStateChange(callback);
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