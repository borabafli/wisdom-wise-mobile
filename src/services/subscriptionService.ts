/**
 * Subscription Service
 *
 * Wrapper around RevenueCat SDK for subscription management
 * Handles initialization, purchases, restoration, and subscription status
 */

import Purchases, {
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage,
  LOG_LEVEL,
} from 'react-native-purchases';
import { Platform } from 'react-native';
import {
  getRevenueCatApiKey,
  ENTITLEMENTS,
  DEBUG_CONFIG,
  ERROR_MESSAGES,
  OFFERINGS,
} from '../config/revenueCat';
import {
  SubscriptionStatus,
  PurchaseResult,
  RestoreResult,
  ActiveSubscription,
  ProductId,
  PackageType,
} from '../types/subscription';

/**
 * Subscription Service Class
 * Singleton pattern for managing subscriptions throughout the app
 */
class SubscriptionService {
  private static instance: SubscriptionService;
  private isInitialized = false;
  private customerInfo: CustomerInfo | null = null;

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }

  /**
   * Initialize RevenueCat SDK
   * Should be called once on app launch
   */
  async initialize(userId?: string): Promise<void> {
    if (this.isInitialized) {
      console.log('[SubscriptionService] Already initialized');
      return;
    }

    try {
      const apiKey = getRevenueCatApiKey();

      // Configure SDK
      if (DEBUG_CONFIG.VERBOSE_LOGGING) {
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      }

      // Initialize Purchases
      await Purchases.configure({ apiKey });

      // IMPORTANT: Clear any cached user ID that might be blocked (like "anonymous")
      // This ensures we start fresh with a new auto-generated anonymous ID
      try {
        await Purchases.logOut();
        console.log('[SubscriptionService] Cleared cached user ID');
      } catch (logoutError) {
        // Ignore logout errors on first initialization
        console.log('[SubscriptionService] No cached user to clear (expected on first run)');
      }

      // Set user ID if provided, otherwise RevenueCat will auto-generate anonymous ID
      if (userId) {
        await this.identifyUser(userId);
      }

      this.isInitialized = true;
      console.log('[SubscriptionService] Initialized successfully');

      // Load initial customer info
      await this.refreshCustomerInfo();
    } catch (error) {
      console.error('[SubscriptionService] Initialization failed:', error);
      throw new Error(ERROR_MESSAGES.INITIALIZATION_FAILED);
    }
  }

  /**
   * Identify user with RevenueCat
   * Call this after user authentication
   */
  async identifyUser(userId: string): Promise<void> {
    try {
      await Purchases.logIn(userId);
      console.log('[SubscriptionService] User identified:', userId);

      // Refresh customer info after login
      await this.refreshCustomerInfo();
    } catch (error) {
      console.error('[SubscriptionService] Failed to identify user:', error);
      throw error;
    }
  }

  /**
   * Log out current user (for anonymous → authenticated transition)
   */
  async logoutUser(): Promise<void> {
    try {
      await Purchases.logOut();
      this.customerInfo = null;
      console.log('[SubscriptionService] User logged out');
    } catch (error) {
      console.error('[SubscriptionService] Failed to logout user:', error);
      throw error;
    }
  }

  /**
   * Refresh customer info from RevenueCat
   */
  async refreshCustomerInfo(): Promise<CustomerInfo> {
    try {
      this.customerInfo = await Purchases.getCustomerInfo();
      return this.customerInfo;
    } catch (error) {
      console.error('[SubscriptionService] Failed to refresh customer info:', error);
      throw error;
    }
  }

  /**
   * Get current customer info
   */
  async getCustomerInfo(): Promise<CustomerInfo> {
    if (!this.customerInfo) {
      return await this.refreshCustomerInfo();
    }
    return this.customerInfo;
  }

  /**
   * Get subscription status
   */
  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    try {
      const customerInfo = await this.getCustomerInfo();
      const proEntitlement = customerInfo.entitlements.active[ENTITLEMENTS.PRO];

      // Check if user has Pro entitlement
      const isPremium = !!proEntitlement;
      const isTrialing = proEntitlement?.periodType === 'trial' || false;

      // Get subscription details
      const productId = proEntitlement?.productIdentifier as ProductId | null;
      const expirationDate = proEntitlement?.expirationDate
        ? new Date(proEntitlement.expirationDate)
        : null;
      const purchaseDate = proEntitlement?.latestPurchaseDate
        ? new Date(proEntitlement.latestPurchaseDate)
        : null;
      const originalPurchaseDate = proEntitlement?.originalPurchaseDate
        ? new Date(proEntitlement.originalPurchaseDate)
        : null;

      const now = new Date();
      const isExpired = expirationDate ? expirationDate < now : false;
      const willRenew = proEntitlement?.willRenew || false;

      // Get management URL
      const managementURL = customerInfo.managementURL || null;

      return {
        isPremium,
        isTrialing,
        willRenew,
        isExpired,
        tier: isPremium ? 'premium' : 'free',
        productId,
        expirationDate,
        purchaseDate,
        originalPurchaseDate,
        managementURL,
      };
    } catch (error) {
      console.error('[SubscriptionService] Failed to get subscription status:', error);

      // Return free tier status on error
      return {
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
      };
    }
  }

  /**
   * Get active subscription details
   */
  async getActiveSubscription(): Promise<ActiveSubscription | null> {
    try {
      const customerInfo = await this.getCustomerInfo();
      const proEntitlement = customerInfo.entitlements.active[ENTITLEMENTS.PRO];

      if (!proEntitlement) {
        return null;
      }

      const productId = proEntitlement.productIdentifier as ProductId;
      const packageType = this.getPackageTypeFromProductId(productId);

      return {
        productId,
        packageType,
        purchaseDate: new Date(proEntitlement.latestPurchaseDate),
        expirationDate: new Date(proEntitlement.expirationDate!),
        originalPurchaseDate: new Date(proEntitlement.originalPurchaseDate),
        willRenew: proEntitlement.willRenew,
        isTrialing: proEntitlement.periodType === 'trial',
        managementURL: customerInfo.managementURL,
        store: proEntitlement.store,
      };
    } catch (error) {
      console.error('[SubscriptionService] Failed to get active subscription:', error);
      return null;
    }
  }

  /**
   * Helper to determine package type from product ID
   */
  private getPackageTypeFromProductId(productId: ProductId): PackageType {
    if (productId.includes('Monthly')) {
      return '$rc_monthly';
    }
    return '$rc_annual';
  }

  /**
   * Get available offerings
   */
  async getOfferings(): Promise<PurchasesOffering[]> {
    try {
      const offerings = await Purchases.getOfferings();

      if (!offerings.current) {
        console.warn('[SubscriptionService] No current offering available');
        return [];
      }

      // Return all offerings as array
      return Object.values(offerings.all);
    } catch (error) {
      console.error('[SubscriptionService] Failed to get offerings:', error);
      throw new Error(ERROR_MESSAGES.NO_OFFERINGS);
    }
  }

  /**
   * Get current offering (default)
   */
  async getCurrentOffering(): Promise<PurchasesOffering | null> {
    try {
      const offerings = await Purchases.getOfferings();
      return offerings.current || null;
    } catch (error) {
      console.error('[SubscriptionService] Failed to get current offering:', error);
      return null;
    }
  }

  /**
   * Purchase a package
   */
  async purchasePackage(pkg: PurchasesPackage): Promise<PurchaseResult> {
    try {
      console.log('[SubscriptionService] Purchasing package:', pkg.identifier);

      const { customerInfo } = await Purchases.purchasePackage(pkg);
      this.customerInfo = customerInfo;

      console.log('[SubscriptionService] Purchase successful');

      return {
        success: true,
        customerInfo,
      };
    } catch (error: any) {
      console.error('[SubscriptionService] Purchase failed:', error);

      // Check if user cancelled
      if (error.userCancelled) {
        return {
          success: false,
          userCancelled: true,
          error: ERROR_MESSAGES.PURCHASE_CANCELLED,
        };
      }

      // Check for network error
      if (error.code === 'NETWORK_ERROR') {
        return {
          success: false,
          error: ERROR_MESSAGES.NETWORK_ERROR,
        };
      }

      return {
        success: false,
        error: ERROR_MESSAGES.PURCHASE_FAILED,
      };
    }
  }

  /**
   * Restore purchases
   */
  async restorePurchases(): Promise<RestoreResult> {
    try {
      console.log('[SubscriptionService] Restoring purchases...');

      const customerInfo = await Purchases.restorePurchases();
      this.customerInfo = customerInfo;

      const entitlementsRestored = Object.keys(customerInfo.entitlements.active).length;

      console.log('[SubscriptionService] Restored entitlements:', entitlementsRestored);

      return {
        success: true,
        customerInfo,
        entitlementsRestored,
      };
    } catch (error) {
      console.error('[SubscriptionService] Restore failed:', error);

      return {
        success: false,
        error: ERROR_MESSAGES.RESTORE_FAILED,
      };
    }
  }

  /**
   * Check if user has a specific entitlement
   */
  async hasEntitlement(entitlementId: string): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo();
      return !!customerInfo.entitlements.active[entitlementId];
    } catch (error) {
      console.error('[SubscriptionService] Failed to check entitlement:', error);
      return false;
    }
  }

  /**
   * Get list of active entitlement IDs
   */
  async getActiveEntitlements(): Promise<string[]> {
    try {
      const customerInfo = await this.getCustomerInfo();
      return Object.keys(customerInfo.entitlements.active);
    } catch (error) {
      console.error('[SubscriptionService] Failed to get entitlements:', error);
      return [];
    }
  }

  /**
   * Check if subscription is active (not expired)
   */
  async isSubscriptionActive(): Promise<boolean> {
    try {
      const status = await this.getSubscriptionStatus();
      return status.isPremium && !status.isExpired;
    } catch (error) {
      console.error('[SubscriptionService] Failed to check subscription status:', error);
      return false;
    }
  }

  /**
   * Get subscription expiration date
   */
  async getExpirationDate(): Promise<Date | null> {
    try {
      const status = await this.getSubscriptionStatus();
      return status.expirationDate;
    } catch (error) {
      console.error('[SubscriptionService] Failed to get expiration date:', error);
      return null;
    }
  }

  /**
   * Check if initialized
   */
  isReady(): boolean {
    return this.isInitialized;
  }
}

// Export singleton instance
export const subscriptionService = SubscriptionService.getInstance();

export default subscriptionService;
