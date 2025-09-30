import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface JournalReminderTime {
  id: string;
  time: string; // "HH:MM" format
  enabled: boolean;
  label: string;
  description: string;
}

// Set the notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

class NotificationService {
  private readonly STORAGE_KEY = 'journal_reminder_settings';

  // Default reminder times
  private defaultReminderTimes: JournalReminderTime[] = [
    {
      id: 'morning',
      time: '08:00',
      enabled: true,
      label: 'Morning',
      description: 'Start your day grounded'
    },
    {
      id: 'afternoon',
      time: '16:00',
      enabled: false,
      label: 'Daytime',
      description: 'Take a mindful break'
    },
    {
      id: 'evening',
      time: '20:00',
      enabled: true,
      label: 'Evening',
      description: 'Reflect and unwind'
    }
  ];

  /**
   * Request notification permissions from the user
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // If permission was explicitly denied, we can't request again
      if (existingStatus === 'denied') {
        console.log('Notification permission was previously denied');
        return false;
      }

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      // For Android, also set up notification channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('journal-reminders', {
          name: 'Journal Reminders',
          importance: Notifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#2DB29D',
          sound: 'default',
        });
      }

      return finalStatus === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Check if user can be asked for permissions or needs to go to settings
   */
  async canRequestPermissions(): Promise<{ canRequest: boolean; shouldGoToSettings: boolean }> {
    try {
      const { status } = await Notifications.getPermissionsAsync();

      return {
        canRequest: status === 'undetermined',
        shouldGoToSettings: status === 'denied'
      };
    } catch (error) {
      console.error('Error checking permission status:', error);
      return { canRequest: false, shouldGoToSettings: false };
    }
  }

  /**
   * Guide user to settings to enable notifications manually
   */
  async openSettings(): Promise<void> {
    try {
      const { Linking } = require('react-native');

      if (Platform.OS === 'ios') {
        // On iOS, open app-specific settings
        await Linking.openURL('app-settings:');
      } else {
        // On Android, try to open app-specific notification settings
        try {
          await Linking.sendIntent('android.settings.APP_NOTIFICATION_SETTINGS', [
            { key: 'android.provider.extra.APP_PACKAGE', value: 'your.app.package.name' }
          ]);
        } catch {
          // Fallback to general app settings
          await Linking.openSettings();
        }
      }
    } catch (error) {
      console.error('Error opening settings:', error);
      // Fallback to general settings if all else fails
      const { Linking } = require('react-native');
      await Linking.openSettings();
    }
  }

  /**
   * Create better user guidance for enabling notifications
   */
  getNotificationGuidance(): { title: string; message: string; steps: string[] } {
    const isIOS = Platform.OS === 'ios';

    return {
      title: 'Enable Gentle Reminders',
      message: 'Anu can send you gentle mindfulness reminders to support your mental health journey. These are completely optional and can be customized.',
      steps: isIOS ? [
        '1. Tap "Open Settings" below',
        '2. Toggle on "Allow Notifications"',
        '3. Choose your preferred notification style',
        '4. Return to WisdomWise when done'
      ] : [
        '1. Tap "Open Settings" below',
        '2. Turn on "Show notifications"',
        '3. Choose your notification preferences',
        '4. Press back to return to WisdomWise'
      ]
    };
  }

  /**
   * Get current permission status
   */
  async getPermissionStatus(): Promise<'granted' | 'denied' | 'undetermined'> {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status;
    } catch (error) {
      console.error('Error getting notification permissions:', error);
      return 'denied';
    }
  }

  /**
   * Save reminder settings to storage
   */
  async saveReminderSettings(reminderTimes: JournalReminderTime[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(reminderTimes));
    } catch (error) {
      console.error('Error saving reminder settings:', error);
    }
  }

  /**
   * Get saved reminder settings or default ones
   */
  async getReminderSettings(): Promise<JournalReminderTime[]> {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return this.defaultReminderTimes;
    } catch (error) {
      console.error('Error getting reminder settings:', error);
      return this.defaultReminderTimes;
    }
  }

  /**
   * Schedule notifications based on current settings
   */
  async scheduleReminders(): Promise<void> {
    try {
      // Cancel existing notifications
      await this.cancelAllReminders();

      const settings = await this.getReminderSettings();
      const enabledReminders = settings.filter(reminder => reminder.enabled);

      for (const reminder of enabledReminders) {
        await this.scheduleReminderNotification(reminder);
      }

      console.log(`Scheduled ${enabledReminders.length} journal reminders`);
    } catch (error) {
      console.error('Error scheduling reminders:', error);
    }
  }

  /**
   * Schedule a single reminder notification
   */
  private async scheduleReminderNotification(reminder: JournalReminderTime): Promise<void> {
    try {
      const [hours, minutes] = reminder.time.split(':').map(Number);

      await Notifications.scheduleNotificationAsync({
        identifier: `journal-reminder-${reminder.id}`,
        content: {
          title: "Time for mindful reflection",
          body: `${reminder.description}. Anu is here to support you.`,
          sound: 'default',
          data: {
            type: 'journal-reminder',
            reminderId: reminder.id,
          },
        },
        trigger: {
          channelId: Platform.OS === 'android' ? 'journal-reminders' : undefined,
          repeats: true,
          hour: hours,
          minute: minutes,
        },
      });
    } catch (error) {
      console.error(`Error scheduling notification for ${reminder.id}:`, error);
    }
  }

  /**
   * Cancel all scheduled reminders
   */
  async cancelAllReminders(): Promise<void> {
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      const journalReminders = scheduled.filter(notification =>
        notification.identifier.startsWith('journal-reminder-')
      );

      for (const notification of journalReminders) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    } catch (error) {
      console.error('Error canceling reminders:', error);
    }
  }

  /**
   * Update a specific reminder time setting
   */
  async updateReminderSetting(reminderId: string, updates: Partial<JournalReminderTime>): Promise<void> {
    try {
      const settings = await this.getReminderSettings();
      const updatedSettings = settings.map(reminder =>
        reminder.id === reminderId ? { ...reminder, ...updates } : reminder
      );

      await this.saveReminderSettings(updatedSettings);

      // Reschedule notifications
      await this.scheduleReminders();
    } catch (error) {
      console.error('Error updating reminder setting:', error);
    }
  }

  /**
   * Add a new custom reminder
   */
  async addCustomReminder(reminder: Omit<JournalReminderTime, 'id'>): Promise<void> {
    try {
      const settings = await this.getReminderSettings();
      const newReminder: JournalReminderTime = {
        ...reminder,
        id: `custom-${Date.now()}`, // Generate unique ID
      };

      const updatedSettings = [...settings, newReminder];
      await this.saveReminderSettings(updatedSettings);

      // Reschedule notifications to include new reminder
      await this.scheduleReminders();
    } catch (error) {
      console.error('Error adding custom reminder:', error);
    }
  }

  /**
   * Remove a reminder
   */
  async removeReminder(reminderId: string): Promise<void> {
    try {
      const settings = await this.getReminderSettings();
      const updatedSettings = settings.filter(reminder => reminder.id !== reminderId);

      await this.saveReminderSettings(updatedSettings);

      // Cancel the specific notification
      await Notifications.cancelScheduledNotificationAsync(`journal-reminder-${reminderId}`);

      // Reschedule remaining notifications
      await this.scheduleReminders();
    } catch (error) {
      console.error('Error removing reminder:', error);
    }
  }

  /**
   * Initialize notification service with default settings
   */
  async initialize(): Promise<void> {
    try {
      const hasPermission = await this.getPermissionStatus();

      if (hasPermission === 'granted') {
        await this.scheduleReminders();
      }
    } catch (error) {
      console.error('Error initializing notification service:', error);
    }
  }

  /**
   * Send immediate test notification
   */
  async sendTestNotification(): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Test from WisdomWise",
          body: "Your notifications are working! Anu is ready to support your mindfulness journey.",
          sound: 'default',
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  }
}

export const notificationService = new NotificationService();