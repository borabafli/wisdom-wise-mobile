/**
 * Subscription Type Definitions
 *
 * TypeScript types and interfaces for subscription management
 * Integrates with RevenueCat SDK types
 */

import {
  PurchasesOffering,
  PurchasesPackage,
  CustomerInfo,
  PurchasesStoreProduct,
} from 'react-native-purchases';

/**
 * Subscription Tier
 */
export type SubscriptionTier = 'free' | 'premium';

/**
 * Product Identifier Types
 */
export type ProductId = 'com.wisdomwise.app.Monthly' | 'com.wisdomwise.app.Annual';

/**
 * Package Type
 */
export type PackageType = '$rc_monthly' | '$rc_annual';

/**
 * Entitlement Identifier
 */
export type EntitlementId = 'Pro';

/**
 * Subscription Status
 */
export interface SubscriptionStatus {
  /** Is the user currently subscribed to premium? */
  isPremium: boolean;

  /** Is the user currently in a free trial? */
  isTrialing: boolean;

  /** Will the subscription renew automatically? */
  willRenew: boolean;

  /** Is the subscription expired? */
  isExpired: boolean;

  /** Subscription tier (free or premium) */
  tier: SubscriptionTier;

  /** Product identifier (Monthly or Annual) */
  productId: ProductId | null;

  /** Expiration date of the subscription */
  expirationDate: Date | null;

  /** Purchase date of the subscription */
  purchaseDate: Date | null;

  /** Original purchase date (for tracking subscription age) */
  originalPurchaseDate: Date | null;

  /** Management URL for the subscription (to cancel/manage) */
  managementURL: string | null;
}

/**
 * Active Subscription Details
 */
export interface ActiveSubscription {
  /** Product identifier */
  productId: ProductId;

  /** Package type (monthly or annual) */
  packageType: PackageType;

  /** Purchase date */
  purchaseDate: Date;

  /** Expiration date */
  expirationDate: Date;

  /** Original purchase date */
  originalPurchaseDate: Date;

  /** Will renew automatically? */
  willRenew: boolean;

  /** Is in free trial? */
  isTrialing: boolean;

  /** Management URL */
  managementURL: string | null;

  /** Store (apple, google, stripe, etc.) */
  store: string;
}

/**
 * Subscription Context State
 */
export interface SubscriptionContextState {
  /** Loading state */
  isLoading: boolean;

  /** Is user premium? */
  isPremium: boolean;

  /** Is user in trial? */
  isTrialing: boolean;

  /** Subscription tier */
  subscriptionTier: SubscriptionTier;

  /** List of active entitlements */
  entitlements: string[];

  /** Available offerings from RevenueCat */
  offerings: PurchasesOffering[];

  /** Current offering (usually 'default') */
  currentOffering: PurchasesOffering | null;

  /** Subscription status details */
  subscriptionStatus: SubscriptionStatus;

  /** Active subscription details */
  activeSubscription: ActiveSubscription | null;

  /** Purchase a package */
  purchasePackage: (pkg: PurchasesPackage) => Promise<PurchaseResult>;

  /** Restore purchases */
  restorePurchases: () => Promise<RestoreResult>;

  /** Refresh subscription status */
  refreshSubscriptionStatus: () => Promise<void>;

  /** Check if user has a specific entitlement */
  hasEntitlement: (entitlementId: string) => boolean;
}

/**
 * Purchase Result
 */
export interface PurchaseResult {
  /** Was the purchase successful? */
  success: boolean;

  /** Customer info after purchase */
  customerInfo?: CustomerInfo;

  /** Error message if failed */
  error?: string;

  /** Was purchase cancelled by user? */
  userCancelled?: boolean;
}

/**
 * Restore Result
 */
export interface RestoreResult {
  /** Was restore successful? */
  success: boolean;

  /** Customer info after restore */
  customerInfo?: CustomerInfo;

  /** Error message if failed */
  error?: string;

  /** Number of entitlements restored */
  entitlementsRestored?: number;
}

/**
 * Paywall Trigger
 * Tracks what triggered the paywall to show
 */
export type PaywallTrigger =
  | 'onboarding'
  | 'message_limit'
  | 'voice_limit'
  | 'exercise_locked'
  | 'insight_locked'
  | 'journal_locked'
  | 'history_locked'
  | 'profile_upgrade'
  | 'manual';

/**
 * Paywall Props
 */
export interface PaywallProps {
  /** Is the paywall visible? */
  visible: boolean;

  /** Callback when paywall is dismissed */
  onClose: () => void;

  /** What triggered the paywall? */
  trigger?: PaywallTrigger;

  /** Optional pre-selected package */
  preselectedPackage?: 'monthly' | 'annual';

  /** Can the user skip/dismiss the paywall? */
  skippable?: boolean;
}

/**
 * Pricing Card Props
 */
export interface PricingCardProps {
  /** The package to display */
  package: PurchasesPackage;

  /** Is this card selected? */
  isSelected: boolean;

  /** Callback when card is pressed */
  onPress: () => void;

  /** Is this the best value option? */
  isBestValue?: boolean;

  /** Loading state */
  isLoading?: boolean;
}

/**
 * Feature Limit Status
 */
export interface FeatureLimitStatus {
  /** Feature name */
  feature: string;

  /** Current usage */
  currentUsage: number;

  /** Limit for current tier */
  limit: number;

  /** Is limit reached? */
  isLimitReached: boolean;

  /** Percentage used (0-100) */
  percentageUsed: number;

  /** Time until reset (for daily/weekly limits) */
  resetsAt?: Date;
}

/**
 * Entitlement Check Result
 */
export interface EntitlementCheckResult {
  /** Does user have access? */
  hasAccess: boolean;

  /** Reason for denial (if hasAccess is false) */
  reason?: 'no_entitlement' | 'limit_reached' | 'feature_locked';

  /** Suggested action */
  suggestedAction?: 'upgrade' | 'wait_for_reset' | 'none';

  /** When the limit resets (if applicable) */
  resetsAt?: Date;
}

/**
 * Subscription Analytics Event
 */
export interface SubscriptionAnalyticsEvent {
  /** Event name */
  event: string;

  /** Event properties */
  properties: {
    trigger?: PaywallTrigger;
    plan?: 'monthly' | 'annual';
    price?: number;
    user_tier?: SubscriptionTier;
    success?: boolean;
    error?: string;
    [key: string]: any;
  };
}

/**
 * Export types from RevenueCat for convenience
 */
export type {
  PurchasesOffering,
  PurchasesPackage,
  CustomerInfo,
  PurchasesStoreProduct,
} from 'react-native-purchases';
