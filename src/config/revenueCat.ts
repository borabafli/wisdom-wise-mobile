/**
 * RevenueCat Configuration
 *
 * Centralized configuration for RevenueCat SDK
 * Manages API keys, product identifiers, and entitlements
 */

import { Platform } from 'react-native';

/**
 * RevenueCat API Keys
 * iOS: appl_zvNqvXCtuhNiWnLVMuvgZMmMNSZ
 * Android: TBD (to be added from RevenueCat dashboard)
 */
export const REVENUE_CAT_API_KEYS = {
  ios: 'appl_zvNqvXCtuhNiWnLVMuvgZMmMNSZ',
  android: '', // TODO: Add Android API key from RevenueCat dashboard
};

/**
 * Get the appropriate API key for the current platform
 */
export const getRevenueCatApiKey = (): string => {
  const apiKey = Platform.OS === 'ios'
    ? REVENUE_CAT_API_KEYS.ios
    : REVENUE_CAT_API_KEYS.android;

  if (!apiKey) {
    throw new Error(`RevenueCat API key not configured for platform: ${Platform.OS}`);
  }

  return apiKey;
};

/**
 * Product Identifiers
 * These match the products created in App Store Connect and Google Play Console
 */
export const PRODUCT_IDS = {
  MONTHLY: 'com.wisdomwise.app.Monthly',
  ANNUAL: 'com.wisdomwise.app.Annual',
} as const;

/**
 * Package Identifiers
 * These match the packages configured in RevenueCat dashboard
 */
export const PACKAGE_TYPES = {
  MONTHLY: '$rc_monthly',
  ANNUAL: '$rc_annual',
} as const;

/**
 * Entitlement Identifiers
 * These match the entitlements configured in RevenueCat dashboard
 */
export const ENTITLEMENTS = {
  PRO: 'Pro', // Main entitlement that unlocks all premium features
} as const;

/**
 * Offering Identifiers
 * These match the offerings configured in RevenueCat dashboard
 */
export const OFFERINGS = {
  DEFAULT: 'default',
} as const;

/**
 * Subscription Tiers
 */
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PREMIUM: 'premium',
} as const;

/**
 * Feature Limits by Tier
 */
export const FEATURE_LIMITS = {
  FREE: {
    MESSAGES_PER_DAY: 50,
    MESSAGES_PER_WEEK: 350,
    VOICE_MINUTES_PER_DAY: 5,
    VOICE_MINUTES_PER_WEEK: 20,
    EXERCISES_PER_DAY: 2,
    UNLOCKED_EXERCISES: 4,
    JOURNAL_PROMPTS_PER_DAY: 1,
    MAX_THINKING_PATTERNS: 2,
    CHAT_HISTORY_DAYS: 7,
  },
  PREMIUM: {
    MESSAGES_PER_DAY: 100, // Soft cap for cost management
    MESSAGES_PER_WEEK: 2000, // Hard cap to prevent abuse
    VOICE_MINUTES_PER_DAY: 30, // Soft cap
    VOICE_MINUTES_PER_WEEK: 90, // Soft cap
    EXERCISES_PER_DAY: -1, // -1 = unlimited
    UNLOCKED_EXERCISES: -1, // -1 = all
    JOURNAL_PROMPTS_PER_DAY: -1, // -1 = unlimited
    MAX_THINKING_PATTERNS: -1, // -1 = unlimited
    CHAT_HISTORY_DAYS: -1, // -1 = unlimited
  },
} as const;

/**
 * Pricing Information
 * For display purposes only (actual pricing comes from stores)
 */
export const PRICING = {
  MONTHLY: {
    price: 9.99,
    currency: 'USD',
    period: 'month',
    trialDays: 3,
  },
  ANNUAL: {
    price: 49.99,
    currency: 'USD',
    period: 'year',
    trialDays: 3,
    savingsPercent: 50, // Save 50% vs monthly ($4.17/month)
    monthlyEquivalent: 4.17,
  },
} as const;

/**
 * Feature Entitlement Mapping
 * Maps features to entitlements they require
 */
export const FEATURE_ENTITLEMENTS = {
  UNLIMITED_MESSAGES: ENTITLEMENTS.PRO,
  UNLIMITED_VOICE: ENTITLEMENTS.PRO,
  PREMIUM_EXERCISES: ENTITLEMENTS.PRO,
  ADVANCED_INSIGHTS: ENTITLEMENTS.PRO,
  UNLIMITED_JOURNALING: ENTITLEMENTS.PRO,
  FULL_HISTORY: ENTITLEMENTS.PRO,
  PRIORITY_SUPPORT: ENTITLEMENTS.PRO,
  AI_POLISHING: ENTITLEMENTS.PRO,
  EXPORT_DATA: ENTITLEMENTS.PRO,
} as const;

/**
 * Configuration for sandbox/testing mode
 */
export const DEBUG_CONFIG = {
  // Enable this to use RevenueCat sandbox mode
  USE_SANDBOX: __DEV__, // Automatically use sandbox in development

  // Enable verbose logging
  VERBOSE_LOGGING: __DEV__,

  // Mock purchases for testing UI without actual purchases
  MOCK_PURCHASES: false, // Set to true to test UI with fake premium status
};

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  PURCHASE_CANCELLED: 'Purchase was cancelled',
  PURCHASE_FAILED: 'Purchase failed. Please try again.',
  RESTORE_FAILED: 'Could not restore purchases. Please try again.',
  NOT_AVAILABLE: 'This feature is not available on your platform',
  NO_OFFERINGS: 'No subscription options available at this time',
  INITIALIZATION_FAILED: 'Could not initialize subscription service',
  NETWORK_ERROR: 'Network error. Please check your connection.',
} as const;

export default {
  REVENUE_CAT_API_KEYS,
  PRODUCT_IDS,
  PACKAGE_TYPES,
  ENTITLEMENTS,
  OFFERINGS,
  SUBSCRIPTION_TIERS,
  FEATURE_LIMITS,
  PRICING,
  FEATURE_ENTITLEMENTS,
  DEBUG_CONFIG,
  ERROR_MESSAGES,
  getRevenueCatApiKey,
};
