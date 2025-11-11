import { storageService } from './storageService';
import { entitlementService } from './entitlementService';
import { FEATURE_LIMITS } from '../config/revenueCat';

export interface RateLimit {
  dailyRequestCount: number;
  dailyRequestLimit: number;
  lastRequestDate: string | null;
  isLimitReached: boolean;
  requestsRemaining: number;
}

class RateLimitService {
  // Check if user can make a request
  async canMakeRequest(): Promise<RateLimit> {
    // Get subscription-aware limit
    const limits = await entitlementService.getFeatureLimits();
    const defaultLimit = limits.MESSAGES_PER_DAY;
    try {
      const settings = await storageService.getUserSettings();
      const today = new Date().toDateString();

      // Reset counter if it's a new day
      if (settings.lastRequestDate !== today) {
        settings.dailyRequestCount = 0;
        settings.lastRequestDate = today;
        settings.dailyRequestLimit = defaultLimit; // Update limit based on subscription
        await storageService.saveUserSettings(settings);
      }

      // Ensure limit matches current subscription tier
      if (settings.dailyRequestLimit !== defaultLimit) {
        settings.dailyRequestLimit = defaultLimit;
        await storageService.saveUserSettings(settings);
      }

      const isLimitReached = settings.dailyRequestCount >= settings.dailyRequestLimit;
      const requestsRemaining = Math.max(0, settings.dailyRequestLimit - settings.dailyRequestCount);

      return {
        dailyRequestCount: settings.dailyRequestCount,
        dailyRequestLimit: settings.dailyRequestLimit,
        lastRequestDate: settings.lastRequestDate,
        isLimitReached,
        requestsRemaining
      };
    } catch (error) {
      console.error('Error checking rate limit:', error);
      // Fallback to allow request on error
      return {
        dailyRequestCount: 0,
        dailyRequestLimit: defaultLimit,
        lastRequestDate: null,
        isLimitReached: false,
        requestsRemaining: defaultLimit
      };
    }
  }

  // Record a successful request
  async recordRequest(): Promise<void> {
    try {
      const settings = await storageService.getUserSettings();
      const today = new Date().toDateString();
      
      // Reset counter if it's a new day
      if (settings.lastRequestDate !== today) {
        settings.dailyRequestCount = 0;
      }
      
      settings.dailyRequestCount += 1;
      settings.lastRequestDate = today;
      
      await storageService.saveUserSettings(settings);
    } catch (error) {
      console.error('Error recording request:', error);
      // Don't throw - we don't want to block the user experience
    }
  }

  // Get user-friendly rate limit message
  getRateLimitMessage(rateLimit: RateLimit): string {
    if (!rateLimit.isLimitReached) {
      if (rateLimit.requestsRemaining <= 5) {
        return `You have ${rateLimit.requestsRemaining} messages remaining today. They'll reset tomorrow! 🌅`;
      }
      return `${rateLimit.requestsRemaining} messages remaining today`;
    }

    return `You've reached your daily limit of ${rateLimit.dailyRequestLimit} messages. Your messages will reset tomorrow at midnight. 🌙\n\nTake this as an opportunity to pause and reflect on our conversations today. 🌿`;
  }

  // Get rate limit status for UI display
  async getRateLimitStatus(): Promise<{
    used: number;
    total: number;
    percentage: number;
    message: string;
  }> {
    const rateLimit = await this.canMakeRequest();
    const percentage = Math.round((rateLimit.dailyRequestCount / rateLimit.dailyRequestLimit) * 100);
    
    return {
      used: rateLimit.dailyRequestCount,
      total: rateLimit.dailyRequestLimit,
      percentage,
      message: this.getRateLimitMessage(rateLimit)
    };
  }

  // Update user's rate limit (for premium users or admin)
  async updateRateLimit(newLimit: number): Promise<void> {
    try {
      const settings = await storageService.getUserSettings();
      settings.dailyRequestLimit = newLimit;
      await storageService.saveUserSettings(settings);
    } catch (error) {
      console.error('Error updating rate limit:', error);
      throw error;
    }
  }

  // Reset rate limit (for testing or admin)
  async resetRateLimit(): Promise<void> {
    try {
      const settings = await storageService.getUserSettings();
      settings.dailyRequestCount = 0;
      settings.lastRequestDate = new Date().toDateString();
      await storageService.saveUserSettings(settings);
    } catch (error) {
      console.error('Error resetting rate limit:', error);
      throw error;
    }
  }

  // Check how much time until reset
  getTimeUntilReset(): string {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilReset = tomorrow.getTime() - now.getTime();
    const hoursUntilReset = Math.ceil(msUntilReset / (1000 * 60 * 60));
    
    if (hoursUntilReset <= 1) {
      const minutesUntilReset = Math.ceil(msUntilReset / (1000 * 60));
      return `${minutesUntilReset} minute${minutesUntilReset === 1 ? '' : 's'}`;
    }
    
    return `${hoursUntilReset} hour${hoursUntilReset === 1 ? '' : 's'}`;
  }

  // Get warning when approaching limit
  shouldShowWarning(rateLimit: RateLimit): boolean {
    const percentageUsed = (rateLimit.dailyRequestCount / rateLimit.dailyRequestLimit) * 100;
    return percentageUsed >= 80; // Show warning at 80%
  }

  getWarningMessage(rateLimit: RateLimit): string {
    const percentageUsed = Math.round((rateLimit.dailyRequestCount / rateLimit.dailyRequestLimit) * 100);
    
    if (percentageUsed >= 90) {
      return `Almost at your daily limit! Only ${rateLimit.requestsRemaining} message${rateLimit.requestsRemaining === 1 ? '' : 's'} left. 🌙`;
    } else if (percentageUsed >= 80) {
      return `You're at ${percentageUsed}% of your daily message limit. ${rateLimit.requestsRemaining} remaining. 📊`;
    }
    
    return '';
  }
}

export const rateLimitService = new RateLimitService();