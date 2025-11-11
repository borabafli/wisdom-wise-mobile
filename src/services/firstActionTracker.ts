/**
 * First Action Tracker Service
 *
 * Tracks what users do FIRST when they open the app.
 * This helps answer questions like:
 * - Do new users start chatting immediately or explore exercises?
 * - What's the most common first action after onboarding?
 * - Do users who start with exercises have better retention?
 *
 * Implementation:
 * - Stores a flag in AsyncStorage after first action is tracked
 * - Sends a one-time "first_action" event to PostHog
 * - Resets on sign out (to track first action per user)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { PostHog } from 'posthog-react-native';

const STORAGE_KEYS = {
  FIRST_ACTION_TRACKED: 'posthog_first_action_tracked',
  USER_FIRST_ACTION: 'posthog_user_first_action', // Store what it was
  SESSION_STARTED_AT: 'posthog_session_started_at',
};

export type FirstActionType =
  | 'chat_session_started'
  | 'tell_your_story_started'
  | 'therapy_goal_setting_started'
  | 'exercises_tab_visited'
  | 'insights_tab_visited'
  | 'profile_tab_visited'
  | 'exercise_viewed'
  | 'exercise_started';

export interface FirstActionMetadata {
  actionType: FirstActionType;
  timeSinceAppOpen: number; // milliseconds
  userType: 'new_user' | 'returning_user' | 'anonymous';
  onboardingCompleted: boolean;
  [key: string]: any; // Additional properties
}

class FirstActionTrackerService {
  private posthog: PostHog | null = null;
  private sessionStartTime: number | null = null;

  /**
   * Initialize the tracker with PostHog instance
   * Call this in App.tsx or AppContent.tsx
   */
  initialize(posthog: PostHog | null) {
    this.posthog = posthog;
    this.sessionStartTime = Date.now();
    AsyncStorage.setItem(STORAGE_KEYS.SESSION_STARTED_AT, this.sessionStartTime.toString());
  }

  /**
   * Check if we've already tracked the first action for this user
   */
  private async hasTrackedFirstAction(): Promise<boolean> {
    try {
      const tracked = await AsyncStorage.getItem(STORAGE_KEYS.FIRST_ACTION_TRACKED);
      return tracked === 'true';
    } catch (error) {
      console.error('[FirstActionTracker] Error checking first action:', error);
      return false;
    }
  }

  /**
   * Get the time since app opened (for this session)
   */
  private async getTimeSinceAppOpen(): Promise<number> {
    try {
      const startTime = await AsyncStorage.getItem(STORAGE_KEYS.SESSION_STARTED_AT);
      if (startTime) {
        return Date.now() - parseInt(startTime, 10);
      }
      return 0;
    } catch (error) {
      console.error('[FirstActionTracker] Error getting session start time:', error);
      return 0;
    }
  }

  /**
   * Track the first action a user takes in the app
   * This will only fire ONCE per user (until they sign out)
   *
   * @param actionType - The type of first action
   * @param metadata - Additional context about the action
   */
  async trackFirstAction(
    actionType: FirstActionType,
    metadata: Partial<FirstActionMetadata> = {}
  ): Promise<void> {
    try {
      // Check if we've already tracked a first action
      const alreadyTracked = await this.hasTrackedFirstAction();
      if (alreadyTracked) {
        console.log('[FirstActionTracker] First action already tracked, skipping');
        return;
      }

      // Get time since app opened
      const timeSinceAppOpen = await this.getTimeSinceAppOpen();

      // Build complete metadata
      const fullMetadata: FirstActionMetadata = {
        actionType,
        timeSinceAppOpen,
        userType: metadata.userType || 'anonymous',
        onboardingCompleted: metadata.onboardingCompleted || false,
        timestamp: new Date().toISOString(),
        ...metadata,
      };

      // Track in PostHog
      this.posthog?.capture('user_first_action', fullMetadata);

      // Store that we've tracked this
      await AsyncStorage.setItem(STORAGE_KEYS.FIRST_ACTION_TRACKED, 'true');
      await AsyncStorage.setItem(STORAGE_KEYS.USER_FIRST_ACTION, actionType);

      console.log('[FirstActionTracker] First action tracked:', actionType, fullMetadata);
    } catch (error) {
      console.error('[FirstActionTracker] Error tracking first action:', error);
    }
  }

  /**
   * Reset first action tracking
   * Call this when user signs out, so we can track their first action again if they sign back in
   */
  async reset(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.FIRST_ACTION_TRACKED);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_FIRST_ACTION);
      console.log('[FirstActionTracker] Reset first action tracking');
    } catch (error) {
      console.error('[FirstActionTracker] Error resetting first action:', error);
    }
  }

  /**
   * Get what the user's first action was (if tracked)
   */
  async getFirstAction(): Promise<FirstActionType | null> {
    try {
      const action = await AsyncStorage.getItem(STORAGE_KEYS.USER_FIRST_ACTION);
      return action as FirstActionType | null;
    } catch (error) {
      console.error('[FirstActionTracker] Error getting first action:', error);
      return null;
    }
  }

  /**
   * Track user journey events (not first action, but general flow)
   * These are always tracked to understand user behavior patterns
   */
  trackJourneyEvent(eventName: string, properties?: Record<string, any>): void {
    this.posthog?.capture(`user_journey_${eventName}`, {
      ...properties,
      timestamp: new Date().toISOString(),
    });
  }
}

// Export singleton instance
export const firstActionTracker = new FirstActionTrackerService();

/**
 * Helper hook to use in components
 */
export const useFirstActionTracker = () => {
  return firstActionTracker;
};
