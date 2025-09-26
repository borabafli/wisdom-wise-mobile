import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = 'wisdomwise_onboarding_completed';

// Development flag - set to true to always show onboarding for testing
const ALWAYS_SHOW_ONBOARDING_FOR_DEVELOPMENT = true;

export class OnboardingService {
  /**
   * Check if the user has completed onboarding
   */
  static async hasCompletedOnboarding(): Promise<boolean> {
    // For development testing - always show onboarding
    if (ALWAYS_SHOW_ONBOARDING_FOR_DEVELOPMENT) {
      return false;
    }

    try {
      const completed = await AsyncStorage.getItem(ONBOARDING_KEY);
      return completed === 'true';
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false; // Default to showing onboarding if we can't read storage
    }
  }

  /**
   * Mark onboarding as completed
   */
  static async completeOnboarding(): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (error) {
      console.error('Error saving onboarding completion:', error);
    }
  }

  /**
   * Reset onboarding status (useful for development/testing)
   */
  static async resetOnboarding(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  }

}