/**
 * Subscription Context
 *
 * Provides global subscription state and methods throughout the app
 * Wraps RevenueCat functionality in a React context
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import { subscriptionService } from '../services/subscriptionService';
import { entitlementService } from '../services/entitlementService';
import { usePostHog } from 'posthog-react-native';
import {
  SubscriptionContextState,
  SubscriptionStatus,
  ActiveSubscription,
  SubscriptionTier,
  PurchaseResult,
  RestoreResult,
} from '../types/subscription';

/**
 * Subscription Context
 */
const SubscriptionContext = createContext<SubscriptionContextState | undefined>(undefined);

/**
 * Subscription Provider Props
 */
interface SubscriptionProviderProps {
  children: React.ReactNode;
}

/**
 * Subscription Provider Component
 */
export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const posthog = usePostHog();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isTrialing, setIsTrialing] = useState<boolean>(false);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('free');
  const [entitlements, setEntitlements] = useState<string[]>([]);
  const [offerings, setOfferings] = useState<PurchasesOffering[]>([]);
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    isPremium: false,
    isTrialing: false,
    willRenew: false,
    isExpired: false,
    tier: 'free',
    productId: null,
    expirationDate: null,
    purchaseDate: null,
    originalPurchaseDate: null,
    managementURL: null,
  });
  const [activeSubscription, setActiveSubscription] = useState<ActiveSubscription | null>(null);

  /**
   * Initialize subscription state
   */
  const initialize = useCallback(async () => {
    try {
      setIsLoading(true);

      // Wait for subscription service to be ready (with timeout)
      const maxWaitTime = 5000; // 5 seconds max
      const checkInterval = 100; // Check every 100ms
      let waited = 0;

      while (!subscriptionService.isReady() && waited < maxWaitTime) {
        console.log('[SubscriptionContext] Service not ready, waiting...', waited, 'ms');
        await new Promise(resolve => setTimeout(resolve, checkInterval));
        waited += checkInterval;
      }

      if (!subscriptionService.isReady()) {
        console.error('[SubscriptionContext] Service failed to initialize within timeout');
        return;
      }

      // Load subscription status
      await refreshSubscriptionStatus();

      // Load offerings
      await loadOfferings();

      console.log('[SubscriptionContext] Initialized successfully');
    } catch (error) {
      console.error('[SubscriptionContext] Initialization failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Load offerings from RevenueCat
   */
  const loadOfferings = async () => {
    try {
      const allOfferings = await subscriptionService.getOfferings();
      setOfferings(allOfferings);

      const current = await subscriptionService.getCurrentOffering();
      setCurrentOffering(current);

      console.log('[SubscriptionContext] Loaded offerings:', allOfferings.length);
    } catch (error) {
      console.error('[SubscriptionContext] Failed to load offerings:', error);
    }
  };

  /**
   * Refresh subscription status
   */
  const refreshSubscriptionStatus = useCallback(async () => {
    try {
      // Get subscription status
      const status = await subscriptionService.getSubscriptionStatus();
      setSubscriptionStatus(status);
      setIsPremium(status.isPremium);
      setIsTrialing(status.isTrialing);
      setSubscriptionTier(status.tier);

      // Get active entitlements
      const activeEntitlements = await subscriptionService.getActiveEntitlements();
      setEntitlements(activeEntitlements);

      // Get active subscription details
      const activeSub = await subscriptionService.getActiveSubscription();
      setActiveSubscription(activeSub);

      // Clear entitlement service cache
      entitlementService.clearCache();

      // Update analytics
      posthog?.capture('user_properties_updated', {
        plan: status.tier,
        is_trialing: status.isTrialing,
      });

      console.log('[SubscriptionContext] Status refreshed:', status.tier);
    } catch (error) {
      console.error('[SubscriptionContext] Failed to refresh status:', error);
    }
  }, [posthog]);

  /**
   * Purchase a package
   */
  const purchasePackage = useCallback(async (pkg: PurchasesPackage): Promise<void> => {
    try {
      setIsLoading(true);

      // Track purchase initiation
      posthog?.capture('purchase_initiated', {
        plan: pkg.identifier.includes('monthly') ? 'monthly' : 'annual',
        product_id: pkg.product.identifier,
        price: pkg.product.price,
      });

      // Make purchase
      const result: PurchaseResult = await subscriptionService.purchasePackage(pkg);

      if (result.success) {
        // Track successful purchase
        posthog?.capture('purchase_completed', {
          plan: pkg.identifier.includes('monthly') ? 'monthly' : 'annual',
          product_id: pkg.product.identifier,
          price: pkg.product.price,
          is_trial: subscriptionStatus.isTrialing,
        });

        // Refresh subscription status
        await refreshSubscriptionStatus();

        // Show success message
        Alert.alert(
          'Welcome to Premium!',
          'Thank you for upgrading. Enjoy unlimited access to all features.',
          [{ text: 'Get Started', style: 'default' }]
        );
      } else if (result.userCancelled) {
        // Track cancellation
        posthog?.capture('purchase_cancelled', {
          plan: pkg.identifier.includes('monthly') ? 'monthly' : 'annual',
        });

        console.log('[SubscriptionContext] Purchase cancelled by user');
      } else {
        // Track failure
        posthog?.capture('purchase_failed', {
          plan: pkg.identifier.includes('monthly') ? 'monthly' : 'annual',
          error: result.error,
        });

        // Show error
        Alert.alert(
          'Purchase Failed',
          result.error || 'Unable to complete purchase. Please try again.',
          [{ text: 'OK', style: 'default' }]
        );
      }
    } catch (error: any) {
      console.error('[SubscriptionContext] Purchase error:', error);

      posthog?.capture('purchase_error', {
        error: error.message,
      });

      Alert.alert(
        'Purchase Error',
        'Something went wrong. Please try again later.',
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setIsLoading(false);
    }
  }, [refreshSubscriptionStatus, subscriptionStatus.isTrialing, posthog]);

  /**
   * Restore purchases
   */
  const restorePurchases = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);

      console.log('[SubscriptionContext] Restoring purchases...');

      const result: RestoreResult = await subscriptionService.restorePurchases();

      if (result.success) {
        await refreshSubscriptionStatus();

        const entitlementsCount = result.entitlementsRestored || 0;

        if (entitlementsCount > 0) {
          posthog?.capture('subscription_restored', {
            entitlements_count: entitlementsCount,
          });

          Alert.alert(
            'Purchases Restored',
            `Successfully restored ${entitlementsCount} purchase${entitlementsCount > 1 ? 's' : ''}.`,
            [{ text: 'OK', style: 'default' }]
          );
        } else {
          Alert.alert(
            'No Purchases Found',
            'No previous purchases were found for this account.',
            [{ text: 'OK', style: 'default' }]
          );
        }
      } else {
        Alert.alert(
          'Restore Failed',
          result.error || 'Unable to restore purchases. Please try again.',
          [{ text: 'OK', style: 'default' }]
        );
      }
    } catch (error) {
      console.error('[SubscriptionContext] Restore error:', error);

      Alert.alert(
        'Restore Error',
        'Something went wrong while restoring purchases.',
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setIsLoading(false);
    }
  }, [refreshSubscriptionStatus]);

  /**
   * Check if user has a specific entitlement
   */
  const hasEntitlement = useCallback((entitlementId: string): boolean => {
    return entitlements.includes(entitlementId);
  }, [entitlements]);

  /**
   * Initialize on mount
   */
  useEffect(() => {
    initialize();
  }, [initialize]);

  /**
   * Context value
   */
  const value: SubscriptionContextState = {
    isLoading,
    isPremium,
    isTrialing,
    subscriptionTier,
    entitlements,
    offerings,
    currentOffering,
    subscriptionStatus,
    activeSubscription,
    purchasePackage,
    restorePurchases,
    refreshSubscriptionStatus,
    hasEntitlement,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

/**
 * Hook to use subscription context
 */
export const useSubscription = (): SubscriptionContextState => {
  const context = useContext(SubscriptionContext);

  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }

  return context;
};

export default SubscriptionContext;
