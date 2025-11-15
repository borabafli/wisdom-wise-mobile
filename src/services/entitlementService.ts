/**
 * Entitlement Service
 *
 * Handles feature access logic and entitlement checks
 * Determines what features users can access based on their subscription tier
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { subscriptionService } from './subscriptionService';
import {
  FEATURE_LIMITS,
  FEATURE_ENTITLEMENTS,
  ENTITLEMENTS,
} from '../config/revenueCat';
import {
  SubscriptionTier,
  EntitlementCheckResult,
  FeatureLimitStatus,
} from '../types/subscription';

/**
 * Storage keys for tracking usage
 */
const USAGE_STORAGE_KEYS = {
  DAILY_MESSAGES: 'usage_daily_messages',
  WEEKLY_MESSAGES: 'usage_weekly_messages',
  DAILY_VOICE_MINUTES: 'usage_daily_voice_minutes',
  DAILY_EXERCISES: 'usage_daily_exercises',
  DAILY_JOURNAL_PROMPTS: 'usage_daily_journal_prompts',
  THINKING_PATTERNS_COUNT: 'usage_thinking_patterns_count',
  LAST_RESET_DATE: 'usage_last_reset_date',
  LAST_WEEKLY_RESET_DATE: 'usage_last_weekly_reset_date',
} as const;

/**
 * Entitlement Service Class
 */
class EntitlementService {
  private static instance: EntitlementService;
  private cachedTier: SubscriptionTier = 'free';
  private lastTierCheck: number = 0;
  private readonly TIER_CACHE_DURATION = 60000; // 1 minute cache

  private constructor() {
    this.initializeDailyReset();
  }

  static getInstance(): EntitlementService {
    if (!EntitlementService.instance) {
      EntitlementService.instance = new EntitlementService();
    }
    return EntitlementService.instance;
  }

  /**
   * Initialize daily usage reset check
   */
  private async initializeDailyReset(): Promise<void> {
    await this.checkAndResetDailyUsage();
    await this.checkAndResetWeeklyUsage();
  }

  /**
   * Check and reset daily usage if needed
   */
  private async checkAndResetDailyUsage(): Promise<void> {
    try {
      const lastResetDateStr = await AsyncStorage.getItem(USAGE_STORAGE_KEYS.LAST_RESET_DATE);
      const today = new Date().toDateString();

      // Debug logging (only in development)
      if (__DEV__) {
        console.log('[Entitlement] Last reset date:', lastResetDateStr);
        console.log('[Entitlement] Today:', today);
      }

      if (lastResetDateStr !== today) {
        // Reset all daily counters
        await AsyncStorage.setItem(USAGE_STORAGE_KEYS.DAILY_MESSAGES, '0');
        await AsyncStorage.setItem(USAGE_STORAGE_KEYS.DAILY_VOICE_MINUTES, '0');
        await AsyncStorage.setItem(USAGE_STORAGE_KEYS.DAILY_EXERCISES, '0');
        await AsyncStorage.setItem(USAGE_STORAGE_KEYS.DAILY_JOURNAL_PROMPTS, '0');
        await AsyncStorage.setItem(USAGE_STORAGE_KEYS.LAST_RESET_DATE, today);

        console.log('[EntitlementService] ✅ Daily usage reset');
      }
    } catch (error) {
      console.error('[EntitlementService] Failed to reset daily usage:', error);
    }
  }

  /**
   * Check and reset weekly usage if needed
   */
  private async checkAndResetWeeklyUsage(): Promise<void> {
    try {
      const lastWeeklyResetStr = await AsyncStorage.getItem(USAGE_STORAGE_KEYS.LAST_WEEKLY_RESET_DATE);
      const now = new Date();

      // Get start of current week (Monday)
      const startOfWeek = new Date(now);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0);
      const weekKey = startOfWeek.toDateString();

      if (__DEV__) {
        console.log('[Entitlement] Last weekly reset:', lastWeeklyResetStr);
        console.log('[Entitlement] Current week:', weekKey);
      }

      if (lastWeeklyResetStr !== weekKey) {
        // Reset weekly counters
        await AsyncStorage.setItem(USAGE_STORAGE_KEYS.WEEKLY_MESSAGES, '0');
        await AsyncStorage.setItem(USAGE_STORAGE_KEYS.LAST_WEEKLY_RESET_DATE, weekKey);

        console.log('[EntitlementService] ✅ Weekly usage reset');
      }
    } catch (error) {
      console.error('[EntitlementService] Failed to reset weekly usage:', error);
    }
  }

  /**
   * Get current subscription tier with caching
   */
  async getSubscriptionTier(): Promise<SubscriptionTier> {
    const now = Date.now();

    // Return cached tier if still valid
    if (now - this.lastTierCheck < this.TIER_CACHE_DURATION) {
      return this.cachedTier;
    }

    try {
      const status = await subscriptionService.getSubscriptionStatus();
      this.cachedTier = status.tier;
      this.lastTierCheck = now;
      return this.cachedTier;
    } catch (error) {
      console.error('[EntitlementService] Failed to get tier:', error);
      return 'free'; // Default to free on error
    }
  }

  /**
   * Check if user is premium
   */
  async isPremium(): Promise<boolean> {
    const tier = await this.getSubscriptionTier();
    return tier === 'premium';
  }

  /**
   * Get feature limits for current tier
   */
  async getFeatureLimits() {
    const tier = await this.getSubscriptionTier();
    return tier === 'premium' ? FEATURE_LIMITS.PREMIUM : FEATURE_LIMITS.FREE;
  }

  /**
   * Check message limit
   */
  async canSendMessage(): Promise<EntitlementCheckResult> {
    await this.checkAndResetDailyUsage();
    await this.checkAndResetWeeklyUsage();

    const tier = await this.getSubscriptionTier();
    const limits = await this.getFeatureLimits();

    // Debug logging (only in development)
    if (__DEV__) {
      console.log('[Entitlement] Checking message limit...');
      console.log('[Entitlement] Subscription tier:', tier);
    }

    // Premium users: check weekly hard cap first, then soft daily cap
    if (tier === 'premium') {
      const weeklyMessages = await this.getWeeklyMessageCount();
      const dailyMessages = await this.getDailyMessageCount();

      if (__DEV__) {
        console.log('[Entitlement] Premium user - Weekly messages:', weeklyMessages, '/', limits.MESSAGES_PER_WEEK);
        console.log('[Entitlement] Premium user - Daily messages:', dailyMessages, '/', limits.MESSAGES_PER_DAY);
      }

      // Hard cap: weekly message limit to prevent abuse
      if (weeklyMessages >= limits.MESSAGES_PER_WEEK) {
        if (__DEV__) {
          console.log('[Entitlement] ❌ Premium weekly limit reached');
        }

        return {
          hasAccess: false,
          reason: 'limit_reached',
          suggestedAction: 'wait_for_reset',
          resetsAt: this.getNextMondayDate(),
        };
      }

      // Soft warning at daily limit, but still allow
      if (dailyMessages >= limits.MESSAGES_PER_DAY) {
        console.warn('[EntitlementService] Premium user exceeding soft daily message limit');
      }

      return {
        hasAccess: true,
        suggestedAction: 'none',
      };
    }

    // Free tier: check hard limit
    const dailyMessages = await this.getDailyMessageCount();

    if (__DEV__) {
      console.log('[Entitlement] Free tier - Daily messages:', dailyMessages, '/', limits.MESSAGES_PER_DAY);
    }

    if (dailyMessages >= limits.MESSAGES_PER_DAY) {
      if (__DEV__) {
        console.log('[Entitlement] ❌ Access denied - limit reached');
      }

      return {
        hasAccess: false,
        reason: 'limit_reached',
        suggestedAction: 'upgrade',
        resetsAt: this.getTomorrowDate(),
      };
    }

    if (__DEV__) {
      console.log('[Entitlement] ✅ Access granted');
    }

    return {
      hasAccess: true,
      suggestedAction: 'none',
    };
  }

  /**
   * Increment message count (both daily and weekly)
   */
  async incrementMessageCount(): Promise<void> {
    // Increment daily count
    const currentDaily = await this.getDailyMessageCount();
    const newDailyCount = currentDaily + 1;
    await AsyncStorage.setItem(USAGE_STORAGE_KEYS.DAILY_MESSAGES, String(newDailyCount));

    // Increment weekly count
    const currentWeekly = await this.getWeeklyMessageCount();
    const newWeeklyCount = currentWeekly + 1;
    await AsyncStorage.setItem(USAGE_STORAGE_KEYS.WEEKLY_MESSAGES, String(newWeeklyCount));

    // Debug logging (only in development)
    if (__DEV__) {
      console.log('[Entitlement] Message counts incremented - Daily:', newDailyCount, 'Weekly:', newWeeklyCount);
    }
  }

  /**
   * Get daily message count
   */
  async getDailyMessageCount(): Promise<number> {
    const count = await AsyncStorage.getItem(USAGE_STORAGE_KEYS.DAILY_MESSAGES);
    return count ? parseInt(count, 10) : 0;
  }

  /**
   * Get weekly message count
   */
  async getWeeklyMessageCount(): Promise<number> {
    const count = await AsyncStorage.getItem(USAGE_STORAGE_KEYS.WEEKLY_MESSAGES);
    return count ? parseInt(count, 10) : 0;
  }

  /**
   * Get message limit status
   */
  async getMessageLimitStatus(): Promise<FeatureLimitStatus> {
    const tier = await this.getSubscriptionTier();
    const limits = await this.getFeatureLimits();
    const currentUsage = await this.getDailyMessageCount();
    const limit = limits.MESSAGES_PER_DAY;

    return {
      feature: 'messages',
      currentUsage,
      limit,
      isLimitReached: currentUsage >= limit,
      percentageUsed: (currentUsage / limit) * 100,
      resetsAt: this.getTomorrowDate(),
    };
  }

  /**
   * Check voice journaling access
   */
  async canUseVoiceJournaling(minutesNeeded: number = 1): Promise<EntitlementCheckResult> {
    await this.checkAndResetDailyUsage();

    const tier = await this.getSubscriptionTier();
    const limits = await this.getFeatureLimits();

    if (tier === 'premium') {
      return {
        hasAccess: true,
        suggestedAction: 'none',
      };
    }

    const dailyMinutes = await this.getDailyVoiceMinutes();

    if (dailyMinutes + minutesNeeded > limits.VOICE_MINUTES_PER_DAY) {
      return {
        hasAccess: false,
        reason: 'limit_reached',
        suggestedAction: 'upgrade',
        resetsAt: this.getTomorrowDate(),
      };
    }

    return {
      hasAccess: true,
      suggestedAction: 'none',
    };
  }

  /**
   * Increment voice minutes
   */
  async incrementVoiceMinutes(minutes: number): Promise<void> {
    const current = await this.getDailyVoiceMinutes();
    await AsyncStorage.setItem(USAGE_STORAGE_KEYS.DAILY_VOICE_MINUTES, String(current + minutes));
  }

  /**
   * Get daily voice minutes
   */
  async getDailyVoiceMinutes(): Promise<number> {
    const minutes = await AsyncStorage.getItem(USAGE_STORAGE_KEYS.DAILY_VOICE_MINUTES);
    return minutes ? parseFloat(minutes) : 0;
  }

  /**
   * Check exercise access
   */
  async canAccessExercise(exerciseId: string, isPremiumExercise: boolean = false): Promise<EntitlementCheckResult> {
    const tier = await this.getSubscriptionTier();

    // Premium users can access all exercises
    if (tier === 'premium') {
      return {
        hasAccess: true,
        suggestedAction: 'none',
      };
    }

    // Check if exercise is premium-only
    if (isPremiumExercise) {
      return {
        hasAccess: false,
        reason: 'feature_locked',
        suggestedAction: 'upgrade',
      };
    }

    return {
      hasAccess: true,
      suggestedAction: 'none',
    };
  }

  /**
   * Check daily exercise limit
   */
  async canCompleteExercise(): Promise<EntitlementCheckResult> {
    await this.checkAndResetDailyUsage();

    const tier = await this.getSubscriptionTier();
    const limits = await this.getFeatureLimits();

    if (tier === 'premium') {
      return {
        hasAccess: true,
        suggestedAction: 'none',
      };
    }

    const dailyExercises = await this.getDailyExerciseCount();

    if (dailyExercises >= limits.EXERCISES_PER_DAY) {
      return {
        hasAccess: false,
        reason: 'limit_reached',
        suggestedAction: 'upgrade',
        resetsAt: this.getTomorrowDate(),
      };
    }

    return {
      hasAccess: true,
      suggestedAction: 'none',
    };
  }

  /**
   * Increment exercise count
   */
  async incrementExerciseCount(): Promise<void> {
    const current = await this.getDailyExerciseCount();
    await AsyncStorage.setItem(USAGE_STORAGE_KEYS.DAILY_EXERCISES, String(current + 1));
  }

  /**
   * Get daily exercise count
   */
  async getDailyExerciseCount(): Promise<number> {
    const count = await AsyncStorage.getItem(USAGE_STORAGE_KEYS.DAILY_EXERCISES);
    return count ? parseInt(count, 10) : 0;
  }

  /**
   * Check guided journaling access
   */
  async canAccessJournalPrompt(): Promise<EntitlementCheckResult> {
    await this.checkAndResetDailyUsage();

    const tier = await this.getSubscriptionTier();
    const limits = await this.getFeatureLimits();

    if (tier === 'premium') {
      return {
        hasAccess: true,
        suggestedAction: 'none',
      };
    }

    const dailyPrompts = await this.getDailyJournalPromptCount();

    if (dailyPrompts >= limits.JOURNAL_PROMPTS_PER_DAY) {
      return {
        hasAccess: false,
        reason: 'limit_reached',
        suggestedAction: 'upgrade',
        resetsAt: this.getTomorrowDate(),
      };
    }

    return {
      hasAccess: true,
      suggestedAction: 'none',
    };
  }

  /**
   * Increment journal prompt count
   */
  async incrementJournalPromptCount(): Promise<void> {
    const current = await this.getDailyJournalPromptCount();
    await AsyncStorage.setItem(USAGE_STORAGE_KEYS.DAILY_JOURNAL_PROMPTS, String(current + 1));
  }

  /**
   * Get daily journal prompt count
   */
  async getDailyJournalPromptCount(): Promise<number> {
    const count = await AsyncStorage.getItem(USAGE_STORAGE_KEYS.DAILY_JOURNAL_PROMPTS);
    return count ? parseInt(count, 10) : 0;
  }

  /**
   * Check advanced insights access
   */
  async canAccessAdvancedInsights(): Promise<EntitlementCheckResult> {
    const tier = await this.getSubscriptionTier();

    if (tier === 'premium') {
      return {
        hasAccess: true,
        suggestedAction: 'none',
      };
    }

    return {
      hasAccess: false,
      reason: 'feature_locked',
      suggestedAction: 'upgrade',
    };
  }

  /**
   * Check thinking patterns limit
   */
  async canSaveThinkingPattern(): Promise<EntitlementCheckResult> {
    const tier = await this.getSubscriptionTier();
    const limits = await this.getFeatureLimits();

    if (tier === 'premium') {
      return {
        hasAccess: true,
        suggestedAction: 'none',
      };
    }

    const patternCount = await this.getThinkingPatternCount();

    if (patternCount >= limits.MAX_THINKING_PATTERNS) {
      return {
        hasAccess: false,
        reason: 'limit_reached',
        suggestedAction: 'upgrade',
      };
    }

    return {
      hasAccess: true,
      suggestedAction: 'none',
    };
  }

  /**
   * Get thinking pattern count
   */
  async getThinkingPatternCount(): Promise<number> {
    const count = await AsyncStorage.getItem(USAGE_STORAGE_KEYS.THINKING_PATTERNS_COUNT);
    return count ? parseInt(count, 10) : 0;
  }

  /**
   * Set thinking pattern count
   */
  async setThinkingPatternCount(count: number): Promise<void> {
    await AsyncStorage.setItem(USAGE_STORAGE_KEYS.THINKING_PATTERNS_COUNT, String(count));
  }

  /**
   * Check full chat history access
   */
  async canAccessFullHistory(): Promise<EntitlementCheckResult> {
    const tier = await this.getSubscriptionTier();

    if (tier === 'premium') {
      return {
        hasAccess: true,
        suggestedAction: 'none',
      };
    }

    return {
      hasAccess: false,
      reason: 'feature_locked',
      suggestedAction: 'upgrade',
    };
  }

  /**
   * Check if user has specific entitlement
   */
  async hasEntitlement(entitlementId: string): Promise<boolean> {
    return await subscriptionService.hasEntitlement(entitlementId);
  }

  /**
   * Clear cached tier (call after subscription change)
   */
  clearCache(): void {
    this.lastTierCheck = 0;
  }

  /**
   * Get tomorrow's date for reset time
   */
  private getTomorrowDate(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  }

  /**
   * Get next Monday's date for weekly reset time
   */
  private getNextMondayDate(): Date {
    const now = new Date();
    const nextMonday = new Date(now);

    // Calculate days until next Monday
    const currentDay = now.getDay();
    const daysUntilMonday = currentDay === 0 ? 1 : (8 - currentDay); // 0 = Sunday

    nextMonday.setDate(now.getDate() + daysUntilMonday);
    nextMonday.setHours(0, 0, 0, 0);

    return nextMonday;
  }

  /**
   * Reset all usage counters (for testing)
   */
  async resetAllUsage(): Promise<void> {
    await AsyncStorage.setItem(USAGE_STORAGE_KEYS.DAILY_MESSAGES, '0');
    await AsyncStorage.setItem(USAGE_STORAGE_KEYS.WEEKLY_MESSAGES, '0');
    await AsyncStorage.setItem(USAGE_STORAGE_KEYS.DAILY_VOICE_MINUTES, '0');
    await AsyncStorage.setItem(USAGE_STORAGE_KEYS.DAILY_EXERCISES, '0');
    await AsyncStorage.setItem(USAGE_STORAGE_KEYS.DAILY_JOURNAL_PROMPTS, '0');
    console.log('[EntitlementService] All usage counters reset');
  }
}

// Export singleton instance
export const entitlementService = EntitlementService.getInstance();

export default entitlementService;
