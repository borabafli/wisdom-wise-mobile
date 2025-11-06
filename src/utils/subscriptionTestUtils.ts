/**
 * Subscription Testing Utilities
 *
 * Developer utilities for testing subscription flows and tier switching.
 * ONLY AVAILABLE IN __DEV__ MODE for safety.
 *
 * Usage:
 * ```typescript
 * import { subscriptionTestUtils } from './utils/subscriptionTestUtils';
 *
 * // Reset to free tier
 * await subscriptionTestUtils.resetToFreeTier();
 *
 * // Check current status
 * await subscriptionTestUtils.getDebugInfo();
 *
 * // Reset daily usage counters
 * await subscriptionTestUtils.forceResetDailyUsage();
 * ```
 */

import { subscriptionService } from '../services/subscriptionService';
import { entitlementService } from '../services/entitlementService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const subscriptionTestUtils = {
  /**
   * Reset to free tier
   * Clears RevenueCat user, resets cache, and resets usage counters
   *
   * Use this to test switching from premium → free tier
   *
   * @example
   * await subscriptionTestUtils.resetToFreeTier();
   * // Force quit app and relaunch to see free tier behavior
   */
  async resetToFreeTier(): Promise<void> {
    if (!__DEV__) {
      console.warn('[TEST] subscriptionTestUtils only available in development');
      return;
    }

    console.log('[TEST] 🔄 Resetting to free tier...');

    try {
      // 1. Logout RevenueCat user (clears purchases from current user)
      console.log('[TEST] Step 1/4: Logging out RevenueCat user...');
      await subscriptionService.logoutUser();

      // 2. Clear entitlement cache
      console.log('[TEST] Step 2/4: Clearing entitlement cache...');
      entitlementService.clearCache();

      // 3. Reset usage counters (messages, voice, exercises)
      console.log('[TEST] Step 3/4: Resetting usage counters...');
      await entitlementService.resetAllUsage();

      // 4. Re-initialize subscription service with new anonymous ID
      console.log('[TEST] Step 4/4: Re-initializing subscription service...');
      await subscriptionService.initialize();

      console.log('[TEST] ✅ Reset to free tier complete!');
      console.log('[TEST] 💡 Force quit the app and relaunch to see changes');
    } catch (error) {
      console.error('[TEST] ❌ Reset failed:', error);
      throw error;
    }
  },

  /**
   * Get comprehensive debug information
   * Shows current subscription status, feature limits, and usage
   *
   * @example
   * const info = await subscriptionTestUtils.getDebugInfo();
   * console.log(JSON.stringify(info, null, 2));
   */
  async getDebugInfo(): Promise<{
    subscriptionStatus: any;
    featureLimits: any;
    dailyUsage: {
      messages: number;
      voiceMinutes: number;
      exercises: number;
      journalPrompts: number;
    };
  }> {
    if (!__DEV__) {
      console.warn('[TEST] subscriptionTestUtils only available in development');
      return {} as any;
    }

    console.log('[DEBUG] 📊 Fetching subscription debug info...');

    try {
      // Get subscription status
      const subscriptionStatus = await subscriptionService.getSubscriptionStatus();
      console.log('[DEBUG] Subscription Status:', {
        isPremium: subscriptionStatus.isPremium,
        isTrialing: subscriptionStatus.isTrialing,
        tier: subscriptionStatus.tier,
        productId: subscriptionStatus.productId,
        expirationDate: subscriptionStatus.expirationDate,
      });

      // Get feature limits
      const featureLimits = await entitlementService.getFeatureLimits();
      console.log('[DEBUG] Feature Limits:', featureLimits);

      // Get current usage
      const messageCount = await entitlementService.getDailyMessageCount();
      const voiceMinutes = await entitlementService.getDailyVoiceMinutes();
      const exerciseCount = await entitlementService.getDailyExerciseCount();
      const journalPromptCount = await entitlementService.getDailyJournalPromptCount();

      const dailyUsage = {
        messages: messageCount,
        voiceMinutes,
        exercises: exerciseCount,
        journalPrompts: journalPromptCount,
      };

      console.log('[DEBUG] Daily Usage:', dailyUsage);

      return {
        subscriptionStatus,
        featureLimits,
        dailyUsage,
      };
    } catch (error) {
      console.error('[DEBUG] ❌ Failed to get debug info:', error);
      throw error;
    }
  },

  /**
   * Force reset daily usage counters
   * Resets message count, voice minutes, exercises, and journal prompts to 0
   *
   * Use this to test hitting daily limits
   *
   * @example
   * // Reset counters, then send 15 messages to test limit
   * await subscriptionTestUtils.forceResetDailyUsage();
   */
  async forceResetDailyUsage(): Promise<void> {
    if (!__DEV__) {
      console.warn('[TEST] subscriptionTestUtils only available in development');
      return;
    }

    console.log('[TEST] 🔄 Forcing daily usage reset...');

    try {
      await entitlementService.resetAllUsage();
      console.log('[TEST] ✅ Daily usage counters reset to 0');
      console.log('[TEST] 💡 You can now test hitting the daily limits');
    } catch (error) {
      console.error('[TEST] ❌ Reset failed:', error);
      throw error;
    }
  },

  /**
   * Check if user can send a message
   * Shows detailed breakdown of limit check
   *
   * @example
   * const result = await subscriptionTestUtils.checkMessageLimit();
   * console.log('Can send:', result.hasAccess);
   */
  async checkMessageLimit(): Promise<{
    hasAccess: boolean;
    reason?: string;
    currentCount: number;
    limit: number;
    tier: 'free' | 'premium';
  }> {
    if (!__DEV__) {
      console.warn('[TEST] subscriptionTestUtils only available in development');
      return {} as any;
    }

    console.log('[DEBUG] 🔍 Checking message limit...');

    try {
      const result = await entitlementService.canSendMessage();
      const messageCount = await entitlementService.getDailyMessageCount();
      const tier = await entitlementService.getSubscriptionTier();
      const limits = await entitlementService.getFeatureLimits();

      const debugResult = {
        hasAccess: result.hasAccess,
        reason: result.reason,
        currentCount: messageCount,
        limit: limits.MESSAGES_PER_DAY,
        tier,
      };

      console.log('[DEBUG] Message Limit Check:', debugResult);

      return debugResult;
    } catch (error) {
      console.error('[DEBUG] ❌ Check failed:', error);
      throw error;
    }
  },

  /**
   * Get all AsyncStorage keys related to subscriptions and usage
   * Useful for debugging storage issues
   *
   * @example
   * const keys = await subscriptionTestUtils.getStorageKeys();
   * console.log('Storage keys:', keys);
   */
  async getStorageKeys(): Promise<{
    usageKeys: string[];
    authKeys: string[];
    allKeys: string[];
  }> {
    if (!__DEV__) {
      console.warn('[TEST] subscriptionTestUtils only available in development');
      return {} as any;
    }

    console.log('[DEBUG] 🔑 Fetching AsyncStorage keys...');

    try {
      const allKeys = await AsyncStorage.getAllKeys();

      const usageKeys = allKeys.filter(key => key.startsWith('usage_'));
      const authKeys = allKeys.filter(key =>
        key === 'anonymous_mode' ||
        key === 'userProfile' ||
        key.startsWith('auth_')
      );

      console.log('[DEBUG] Usage Keys:', usageKeys);
      console.log('[DEBUG] Auth Keys:', authKeys);
      console.log('[DEBUG] All Keys:', allKeys);

      return {
        usageKeys,
        authKeys,
        allKeys,
      };
    } catch (error) {
      console.error('[DEBUG] ❌ Failed to get storage keys:', error);
      throw error;
    }
  },

  /**
   * Clear ALL AsyncStorage data (DESTRUCTIVE)
   * Use with extreme caution - clears user data, auth, usage, etc.
   *
   * NOTE: This does NOT clear RevenueCat purchases (stored in iOS Keychain).
   * To truly reset to free tier, you must delete and reinstall the app.
   *
   * @example
   * await subscriptionTestUtils.clearAllStorage();
   * // App will be in fresh install state (but purchases persist)
   */
  async clearAllStorage(): Promise<void> {
    if (!__DEV__) {
      console.warn('[TEST] subscriptionTestUtils only available in development');
      return;
    }

    console.warn('[TEST] ⚠️  WARNING: This will clear ALL app data!');
    console.log('[TEST] 🔄 Clearing all AsyncStorage...');

    try {
      // Clear AsyncStorage (user data, chat history, etc.)
      await AsyncStorage.clear();
      console.log('[TEST] ✅ AsyncStorage cleared');

      // Try to logout RevenueCat user (may fail if anonymous with purchases)
      try {
        await subscriptionService.logoutUser();
        console.log('[TEST] ✅ RevenueCat user logged out');
      } catch (error: any) {
        console.warn('[TEST] ⚠️  RevenueCat logout failed (expected if you have purchases):', error.message);
        console.log('[TEST] 💡 To fully reset: Delete app and reinstall from simulator');
      }

      console.log('[TEST] ✅ Storage cleared (purchases may persist in iOS Keychain)');
      console.log('[TEST] 💡 Force quit and relaunch app');
      console.log('[TEST] ⚠️  If you still see premium, delete and reinstall the app');
    } catch (error) {
      console.error('[TEST] ❌ Clear failed:', error);
      throw error;
    }
  },
};

/**
 * Helper to print formatted debug info to console
 *
 * @example
 * await printSubscriptionDebug();
 */
export async function printSubscriptionDebug(): Promise<void> {
  if (!__DEV__) return;

  console.log('\n');
  console.log('═══════════════════════════════════════════');
  console.log('🧪 SUBSCRIPTION DEBUG INFO');
  console.log('═══════════════════════════════════════════');

  try {
    const info = await subscriptionTestUtils.getDebugInfo();

    console.log('\n📊 SUBSCRIPTION STATUS:');
    console.log('  Premium:', info.subscriptionStatus.isPremium ? '✅ Yes' : '❌ No');
    console.log('  Trialing:', info.subscriptionStatus.isTrialing ? '✅ Yes' : '❌ No');
    console.log('  Tier:', info.subscriptionStatus.tier);
    console.log('  Product:', info.subscriptionStatus.productId || 'None');

    console.log('\n📈 DAILY USAGE:');
    console.log('  Messages:', `${info.dailyUsage.messages} / ${info.featureLimits.MESSAGES_PER_DAY}`);
    console.log('  Voice:', `${info.dailyUsage.voiceMinutes} min / ${info.featureLimits.VOICE_MINUTES_PER_DAY} min`);
    console.log('  Exercises:', `${info.dailyUsage.exercises} / ${info.featureLimits.EXERCISES_PER_DAY}`);
    console.log('  Journal Prompts:', `${info.dailyUsage.journalPrompts} / ${info.featureLimits.JOURNAL_PROMPTS_PER_DAY}`);

    console.log('\n═══════════════════════════════════════════\n');
  } catch (error) {
    console.error('❌ Failed to print debug info:', error);
  }
}

export default subscriptionTestUtils;
