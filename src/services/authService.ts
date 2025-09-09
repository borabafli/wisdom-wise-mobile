import { supabase, UserProfile } from '../config/supabase';
import { AuthError, User } from '@supabase/supabase-js';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';

WebBrowser.maybeCompleteAuthSession();

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  privacyAccepted: boolean;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  profile?: UserProfile;
  error?: string;
  needsVerification?: boolean;
}

class AuthService {
  /**
   * Sign up a new user with email and password
   */
  async signUp({ email, password, firstName, lastName, privacyAccepted }: SignUpData): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            privacy_accepted: privacyAccepted,
          },
        },
      });

      if (error) {
        return { success: false, error: this.getErrorMessage(error) };
      }

      if (data.user && !data.user.email_confirmed_at) {
        return { 
          success: true, 
          user: data.user, 
          needsVerification: true 
        };
      }

      return { 
        success: true, 
        user: data.user 
      };
    } catch (error) {
      return { 
        success: false, 
        error: 'An unexpected error occurred during sign up' 
      };
    }
  }

  /**
   * Sign in a user with email and password
   */
  async signIn({ email, password }: SignInData): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: this.getErrorMessage(error) };
      }

      // Get user profile after successful login
      const profile = await this.getUserProfile(data.user.id);

      return { 
        success: true, 
        user: data.user,
        profile
      };
    } catch (error) {
      return { 
        success: false, 
        error: 'An unexpected error occurred during sign in' 
      };
    }
  }

  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      const redirectUrl = AuthSession.makeRedirectUri({
        useProxy: true,
      });

      const authUrl = `https://tarwryruagxsoaljzoot.supabase.co/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectUrl)}`;

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);

      if (result.type === 'success') {
        const url = result.url;
        const params = new URLSearchParams(url.split('#')[1]);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            return { success: false, error: this.getErrorMessage(error) };
          }

          // Get user profile after successful Google login
          const profile = await this.getUserProfile(data.user.id);

          return { 
            success: true, 
            user: data.user,
            profile
          };
        }
      }

      return { success: false, error: 'Google sign-in was cancelled or failed' };
    } catch (error) {
      return { 
        success: false, 
        error: 'An error occurred during Google sign-in' 
      };
    }
  }

  /**
   * Verify email with confirmation token
   */
  async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      });

      if (error) {
        return { success: false, error: this.getErrorMessage(error) };
      }

      return { success: true, user: data.user };
    } catch (error) {
      return { 
        success: false, 
        error: 'An error occurred during email verification' 
      };
    }
  }

  /**
   * Resend verification email
   */
  async resendVerification(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        return { success: false, error: this.getErrorMessage(error) };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: 'An error occurred while resending verification email' 
      };
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        return { success: false, error: this.getErrorMessage(error) };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: 'An error occurred while sending password reset email' 
      };
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { success: false, error: this.getErrorMessage(error) };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: 'An error occurred during sign out' 
      };
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Get user profile from database
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return { success: false, error: 'Failed to update profile' };
      }

      return { success: true, profile: data };
    } catch (error) {
      return { 
        success: false, 
        error: 'An error occurred while updating profile' 
      };
    }
  }

  /**
   * Listen to authentication state changes
   */
  onAuthStateChange(callback: (user: User | null, profile: UserProfile | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user || null;
      let profile = null;

      if (user) {
        profile = await this.getUserProfile(user.id);
      }

      callback(user, profile);
    });
  }

  /**
   * Convert Supabase auth errors to user-friendly messages
   */
  private getErrorMessage(error: AuthError): string {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Invalid email or password. Please try again.';
      case 'Email not confirmed':
        return 'Please check your email and click the confirmation link.';
      case 'User already registered':
        return 'This email is already registered. Please sign in instead.';
      case 'Password should be at least 6 characters':
        return 'Password must be at least 6 characters long.';
      case 'Email address invalid':
        return 'Please enter a valid email address.';
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  }
}

export const authService = new AuthService();