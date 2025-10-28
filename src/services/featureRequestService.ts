import { supabase, isSupabaseAvailable, supabaseInitError } from '../config/supabase';
import { Platform } from 'react-native';

export interface FeatureRequest {
  id?: string;
  user_id?: string;
  feature_text: string;
  created_at?: string;
  status?: string;
  user_email?: string;
  platform?: string;
}

export interface SubmitFeatureRequestResponse {
  success: boolean;
  error?: string;
  data?: FeatureRequest;
}

class FeatureRequestService {
  /**
   * Check if Supabase is available before operations
   */
  private checkSupabaseAvailable(): void {
    if (!isSupabaseAvailable()) {
      throw new Error(`Supabase not available: ${supabaseInitError || 'Unknown error'}`);
    }
  }

  /**
   * Validate feature request text
   */
  private validateFeatureText(text: string): { valid: boolean; error?: string } {
    if (!text || text.trim().length === 0) {
      return { valid: false, error: 'Feature request cannot be empty' };
    }

    const trimmedText = text.trim();

    if (trimmedText.length < 10) {
      return { valid: false, error: 'Please write at least 10 characters' };
    }

    if (trimmedText.length > 500) {
      return { valid: false, error: 'Please keep your request under 500 characters' };
    }

    return { valid: true };
  }

  /**
   * Submit a feature request
   * @param featureText - The feature request text from the user
   * @returns Promise with success status and optional error message
   */
  async submitFeatureRequest(featureText: string): Promise<SubmitFeatureRequestResponse> {
    try {
      // Check Supabase availability
      this.checkSupabaseAvailable();

      // Validate input
      const validation = this.validateFeatureText(featureText);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error,
        };
      }

      // Get current user (but don't require authentication)
      let user = null;
      try {
        const { data: { user: currentUser }, error: userError } = await supabase!.auth.getUser();
        // Only log error if it's not an AuthSessionMissingError
        if (userError && !userError.message.includes('Auth session missing')) {
          console.warn('Error getting user (non-critical):', userError);
        }
        user = currentUser;
      } catch (error: any) {
        // Ignore auth errors - allow anonymous submissions
        console.log('User not authenticated, proceeding with anonymous submission:', error?.message || 'Unknown error');
      }

      // Prepare feature request data (allow anonymous submissions)
      const featureRequest: Omit<FeatureRequest, 'id' | 'created_at'> = {
        user_id: user?.id || null,
        feature_text: featureText.trim(),
        user_email: user?.email || null,
        platform: Platform.OS,
        status: 'submitted',
      };

      // Insert into database
      const { data, error } = await supabase!
        .from('feature_requests')
        .insert([featureRequest])
        .select()
        .single();

      if (error) {
        console.error('Error submitting feature request:', error);
        return {
          success: false,
          error: 'Unable to submit your request. Please try again later.',
        };
      }

      return {
        success: true,
        data: data as FeatureRequest,
      };
    } catch (error: any) {
      console.error('FeatureRequestService.submitFeatureRequest error:', error);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred. Please try again.',
      };
    }
  }

  /**
   * Get all feature requests for the current user
   * @returns Promise with user's feature requests
   */
  async getUserFeatureRequests(): Promise<FeatureRequest[]> {
    try {
      this.checkSupabaseAvailable();

      const { data: { user }, error: userError } = await supabase!.auth.getUser();

      if (userError || !user) {
        console.error('Error getting user:', userError);
        return [];
      }

      const { data, error } = await supabase!
        .from('feature_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching feature requests:', error);
        return [];
      }

      return data as FeatureRequest[];
    } catch (error) {
      console.error('FeatureRequestService.getUserFeatureRequests error:', error);
      return [];
    }
  }
}

export const featureRequestService = new FeatureRequestService();
