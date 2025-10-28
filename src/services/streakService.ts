import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_CHECK_IN_DATE_KEY = 'lastCheckInDate';
const CURRENT_STREAK_KEY = 'currentStreak';

const streakService = {
  /**
   * Records a check-in for the current day and updates the streak.
   * @returns The new streak count.
   */
  recordCheckIn: async (): Promise<number> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    const lastCheckInDateStr = await AsyncStorage.getItem(LAST_CHECK_IN_DATE_KEY);
    let lastCheckInDate: Date | null = null;
    if (lastCheckInDateStr) {
      lastCheckInDate = new Date(lastCheckInDateStr);
    }

    let currentStreak = await streakService.getStreak();

    if (lastCheckInDate) {
      const diffTime = Math.abs(today.getTime() - lastCheckInDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) { // Consecutive day
        currentStreak++;
      } else if (diffDays > 1) { // Day missed, reset streak
        currentStreak = 1;
      } else { // Same day, do nothing (streak doesn't increase)
        // currentStreak remains the same
      }
    } else { // First check-in ever
      currentStreak = 1;
    }

    await AsyncStorage.setItem(LAST_CHECK_IN_DATE_KEY, today.toISOString());
    await AsyncStorage.setItem(CURRENT_STREAK_KEY, currentStreak.toString());

    return currentStreak;
  },

  /**
   * Retrieves the current streak count.
   * If the last check-in was not yesterday or today, the streak is reset.
   * @returns The current streak count.
   */
  getStreak: async (): Promise<number> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastCheckInDateStr = await AsyncStorage.getItem(LAST_CHECK_IN_DATE_KEY);
    let lastCheckInDate: Date | null = null;
    if (lastCheckInDateStr) {
      lastCheckInDate = new Date(lastCheckInDateStr);
      lastCheckInDate.setHours(0, 0, 0, 0); // Normalize
    }

    let currentStreak = parseInt(await AsyncStorage.getItem(CURRENT_STREAK_KEY) || '0', 10);

    if (lastCheckInDate) {
      const diffTime = Math.abs(today.getTime() - lastCheckInDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 1) { // Day missed, reset streak
        currentStreak = 0; // Or 1 if you want to count today as start of new streak
        await AsyncStorage.setItem(CURRENT_STREAK_KEY, currentStreak.toString());
      }
      // If diffDays is 0 (same day) or 1 (consecutive day), streak is valid
    } else {
      // No last check-in date, so no streak
      currentStreak = 0;
    }

    return currentStreak;
  },

  /**
   * Checks if a check-in has already been recorded for the current day.
   * @returns True if a check-in exists for today, false otherwise.
   */
  hasCheckedInToday: async (): Promise<boolean> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastCheckInDateStr = await AsyncStorage.getItem(LAST_CHECK_IN_DATE_KEY);
    if (lastCheckInDateStr) {
      const lastCheckInDate = new Date(lastCheckInDateStr);
      lastCheckInDate.setHours(0, 0, 0, 0);
      return today.getTime() === lastCheckInDate.getTime();
    }
    return false;
  },

  /**
   * Resets the streak and last check-in date. (For testing/debug purposes)
   */
  resetStreak: async () => {
    await AsyncStorage.removeItem(LAST_CHECK_IN_DATE_KEY);
    await AsyncStorage.removeItem(CURRENT_STREAK_KEY);
  },
};

export default streakService;
