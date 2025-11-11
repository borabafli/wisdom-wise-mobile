/**
 * Analytics Service - PostHog Integration
 *
 * This service provides a centralized way to track user events and behaviors
 * across the WisdomWise app using PostHog analytics.
 *
 * Key Features:
 * - User identification for authenticated and anonymous users
 * - Custom event tracking with properties
 * - Screen view tracking
 * - User properties management
 * - Session replay integration
 */

import { usePostHog } from 'posthog-react-native';

// Event names - centralized to avoid typos
export const AnalyticsEvents = {
  // Auth Events
  USER_SIGNED_UP: 'user_signed_up',
  USER_SIGNED_IN: 'user_signed_in',
  USER_SIGNED_OUT: 'user_signed_out',
  ANONYMOUS_MODE_ENABLED: 'anonymous_mode_enabled',

  // Chat Events
  CHAT_SESSION_STARTED: 'chat_session_started',
  CHAT_MESSAGE_SENT: 'chat_message_sent',
  CHAT_MESSAGE_RECEIVED: 'chat_message_received',
  VOICE_INPUT_USED: 'voice_input_used',
  TEXT_TO_SPEECH_PLAYED: 'text_to_speech_played',

  // Exercise Events
  EXERCISE_STARTED: 'exercise_started',
  EXERCISE_COMPLETED: 'exercise_completed',
  EXERCISE_SKIPPED: 'exercise_skipped',
  EXERCISE_VIEWED: 'exercise_viewed',

  // Navigation Events
  SCREEN_VIEWED: 'screen_viewed',
  TAB_CHANGED: 'tab_changed',

  // Insight Events
  INSIGHTS_VIEWED: 'insights_viewed',
  MOOD_LOGGED: 'mood_logged',

  // Profile Events
  PROFILE_UPDATED: 'profile_updated',
  LANGUAGE_CHANGED: 'language_changed',
  THEME_CHANGED: 'theme_changed',
  NOTIFICATIONS_TOGGLED: 'notifications_toggled',

  // Error Events
  ERROR_OCCURRED: 'error_occurred',
  API_ERROR: 'api_error',
} as const;

// User properties - for user segmentation
export interface UserProperties {
  email?: string;
  firstName?: string;
  lastName?: string;
  isAnonymous: boolean;
  preferredLanguage?: string;
  accountCreatedAt?: string;
  plan?: 'free' | 'premium';
}

// Event properties - additional context for events
export interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Hook to get PostHog instance with common analytics methods
 */
export function useAnalytics() {
  const posthog = usePostHog();

  /**
   * Identify a user - call this when user signs in or signs up
   * This links all future events to this specific user
   *
   * @param userId - Unique user identifier (email, Supabase user ID, etc.)
   * @param properties - Additional user properties for segmentation
   */
  const identifyUser = (userId: string, properties?: UserProperties) => {
    if (!posthog) return;

    console.log('[Analytics] Identifying user:', userId);
    posthog.identify(userId, {
      ...properties,
      identifiedAt: new Date().toISOString(),
    });
  };

  /**
   * Track a custom event with optional properties
   *
   * @param eventName - Name of the event (use AnalyticsEvents constants)
   * @param properties - Additional context about the event
   */
  const trackEvent = (eventName: string, properties?: EventProperties) => {
    if (!posthog) return;

    console.log('[Analytics] Tracking event:', eventName, properties);
    posthog.capture(eventName, {
      ...properties,
      timestamp: new Date().toISOString(),
    });
  };

  /**
   * Track screen views - call this when user navigates to a new screen
   *
   * @param screenName - Name of the screen
   * @param properties - Additional context about the screen view
   */
  const trackScreenView = (screenName: string, properties?: EventProperties) => {
    if (!posthog) return;

    console.log('[Analytics] Screen viewed:', screenName);
    posthog.screen(screenName, properties);
  };

  /**
   * Update user properties - call this when user updates their profile
   * Note: User properties are set via capture events or identify calls
   *
   * @param properties - User properties to update
   */
  const setUserProperties = (properties: Partial<UserProperties>) => {
    if (!posthog) return;

    console.log('[Analytics] Setting user properties:', properties);
    // Set properties by capturing an event with them
    posthog.capture('user_properties_updated', properties);
  };

  /**
   * Reset analytics - call this when user signs out
   * This clears the user identity and starts a fresh session
   */
  const reset = () => {
    if (!posthog) return;

    console.log('[Analytics] Resetting analytics');
    posthog.reset();
  };

  /**
   * Enable/disable session replay recording
   *
   * @param enabled - Whether to enable session replay
   */
  const setSessionReplay = (enabled: boolean) => {
    if (!posthog) return;

    console.log('[Analytics] Session replay:', enabled ? 'enabled' : 'disabled');
    // PostHog automatically handles session replay based on the config
    // Track the preference change
    posthog.capture('session_replay_toggled', { enabled });
  };

  return {
    posthog,
    identifyUser,
    trackEvent,
    trackScreenView,
    setUserProperties,
    reset,
    setSessionReplay,
  };
}

/**
 * Common event tracking helpers
 */
export const AnalyticsHelpers = {
  /**
   * Track chat-related events
   */
  trackChatEvent: (
    eventName: typeof AnalyticsEvents[keyof typeof AnalyticsEvents],
    properties?: {
      messageType?: 'text' | 'voice';
      exerciseDetected?: boolean;
      sessionDuration?: number;
      messageLength?: number;
    }
  ) => {
    // This will be called from components using useAnalytics hook
    return { eventName, properties };
  },

  /**
   * Track exercise-related events
   */
  trackExerciseEvent: (
    eventName: typeof AnalyticsEvents[keyof typeof AnalyticsEvents],
    properties?: {
      exerciseId?: string;
      exerciseName?: string;
      duration?: number;
      completed?: boolean;
    }
  ) => {
    return { eventName, properties };
  },

  /**
   * Track errors for debugging
   */
  trackError: (
    errorType: 'api' | 'runtime' | 'user',
    properties?: {
      errorMessage?: string;
      errorCode?: string;
      stackTrace?: string;
      screen?: string;
    }
  ) => {
    return {
      eventName: AnalyticsEvents.ERROR_OCCURRED,
      properties: {
        errorType,
        ...properties,
      },
    };
  },
};
