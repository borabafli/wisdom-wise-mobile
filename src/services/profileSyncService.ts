import { supabase, isSupabaseAvailable } from '../config/supabase';
import { storageService, UserProfile } from './storageService';

/**
 * ProfileSyncService handles syncing user profiles between local storage and Supabase
 * - For anonymous users: Profiles stay in AsyncStorage only
 * - For authenticated users: Profiles sync to Supabase database and persist across sessions
 */
class ProfileSyncService {
  /**
   * Sync local profile to Supabase (for authenticated users only)
   * Call this after user updates their profile
   */
  async syncToSupabase(userId: string, profile: UserProfile): Promise<boolean> {
    try {
      if (!isSupabaseAvailable()) {
        console.log('[ProfileSync] Supabase not available, skipping sync');
        return false;
      }

      const { error } = await supabase!
        .from('user_profiles')
        .upsert({
          id: userId,
          first_name: profile.firstName,
          last_name: profile.lastName || '',
          display_name: profile.displayName,
          emoji_preference: profile.emojiPreference,
          motivation: profile.motivation,
          motivation_timestamp: profile.motivationTimestamp,
          challenges: profile.challenges,
          goals: profile.goals,
          onboarding_values: profile.onboardingValues,
          onboarding_focus_areas: profile.onboardingFocusAreas,
          onboarding_age_group: profile.onboardingAgeGroup,
          values_timestamp: profile.valuesTimestamp,
          focus_areas_timestamp: profile.focusAreasTimestamp,
          challenges_timestamp: profile.challengesTimestamp,
          baseline_mood: profile.baselineMood,
          baseline_mood_timestamp: profile.baselineMoodTimestamp,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error) {
        console.error('[ProfileSync] Error syncing to Supabase:', error);
        return false;
      }

      console.log('[ProfileSync] Successfully synced profile to Supabase');
      return true;
    } catch (error) {
      console.error('[ProfileSync] Unexpected error syncing to Supabase:', error);
      return false;
    }
  }

  /**
   * Load profile from Supabase and save to local storage
   * Call this after user signs in
   */
  async loadFromSupabase(userId: string): Promise<UserProfile | null> {
    try {
      if (!isSupabaseAvailable()) {
        console.log('[ProfileSync] Supabase not available, skipping load');
        return null;
      }

      const { data, error } = await supabase!
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found, this is normal for new users
          console.log('[ProfileSync] No profile found in Supabase (new user)');
          return null;
        }
        console.error('[ProfileSync] Error loading from Supabase:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      // Convert Supabase data to UserProfile format
      const profile: UserProfile = {
        firstName: data.first_name,
        lastName: data.last_name || '',
        displayName: data.display_name,
        emojiPreference: data.emoji_preference,
        motivation: data.motivation,
        motivationTimestamp: data.motivation_timestamp,
        challenges: data.challenges,
        goals: data.goals,
        onboardingValues: data.onboarding_values,
        onboardingFocusAreas: data.onboarding_focus_areas,
        onboardingAgeGroup: data.onboarding_age_group,
        valuesTimestamp: data.values_timestamp,
        focusAreasTimestamp: data.focus_areas_timestamp,
        challengesTimestamp: data.challenges_timestamp,
        baselineMood: data.baseline_mood,
        baselineMoodTimestamp: data.baseline_mood_timestamp,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      // Save to local storage
      await storageService.saveUserProfile(profile);
      console.log('[ProfileSync] Successfully loaded and saved profile from Supabase');

      return profile;
    } catch (error) {
      console.error('[ProfileSync] Unexpected error loading from Supabase:', error);
      return null;
    }
  }

  /**
   * Check if user has a profile in Supabase
   */
  async hasSupabaseProfile(userId: string): Promise<boolean> {
    try {
      if (!isSupabaseAvailable()) {
        return false;
      }

      const { data, error } = await supabase!
        .from('user_profiles')
        .select('id')
        .eq('id', userId)
        .single();

      return !error && !!data;
    } catch (error) {
      return false;
    }
  }

  /**
   * Delete profile from Supabase (called on account deletion)
   */
  async deleteFromSupabase(userId: string): Promise<boolean> {
    try {
      if (!isSupabaseAvailable()) {
        return false;
      }

      const { error } = await supabase!
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('[ProfileSync] Error deleting from Supabase:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('[ProfileSync] Unexpected error deleting from Supabase:', error);
      return false;
    }
  }
}

export const profileSyncService = new ProfileSyncService();
