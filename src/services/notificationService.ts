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

export interface PersonalizedNotificationConfig {
  morningTime?: string; // HH:MM
  middayTime?: string; // HH:MM
  eveningTime?: string; // HH:MM
  extraSupportEnabled?: boolean; // Allow 2 notifications per day instead of 1
  streakRemindersEnabled?: boolean;
  insightRemindersEnabled?: boolean;
  goalRemindersEnabled?: boolean;
}

export interface UserNotificationContext {
  lastActiveTimestamp?: number;
  streakDays?: number;
  topValue?: string;
  savedReframes?: Array<{ id: string; title: string; lastUsed: number }>;
  goals?: Array<{ id: string; title: string; lastActivity: number }>;
  newInsights?: Array<{ id: string; title: string; createdAt: number; viewed: boolean }>;
  hasJournaledToday?: boolean;
}

// Notification handler will be set during initialization

class NotificationService {
  private readonly STORAGE_KEY = 'journal_reminder_settings';
  private readonly PERSONALIZED_CONFIG_KEY = 'personalized_notification_config';
  private readonly USER_CONTEXT_KEY = 'user_notification_context';
  private readonly LAST_NOTIFICATION_KEY = 'last_notification_sent';

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

  // Personalized notification messages with action routing
  private notificationTemplates = {
    morning: [
      {
        title: '☀️ Good morning',
        body: 'One minute to set today\'s focus?',
        actionType: 'chat',
        chatContext: 'I want to do a quick morning check-in and set my focus for today.'
      },
      {
        title: '💪 One small step',
        body: 'One small step for your goal today?',
        actionType: 'chat',
        chatContext: 'I want to work on taking one small step toward my goal today.'
      },
      {
        title: '😌 Breathe first',
        body: 'Breathe first, then act. 2-min reset?',
        actionType: 'breathing',
        chatContext: '' // Not used for breathing
      },
    ],
    midday: [
      {
        title: '🌀 Stuck on a thought?',
        body: 'Try a quick reframe.',
        actionType: 'chat',
        chatContext: 'I\'m stuck on a thought and want to try reframing it.'
      },
      {
        title: '🧘 Quick reset',
        body: 'Quick reset for your afternoon? 2 min, eyes open.',
        actionType: 'breathing',
        chatContext: '' // Not used for breathing
      },
      {
        title: '📓 Label and move on',
        body: 'Want to label what\'s present and move on?',
        actionType: 'chat',
        chatContext: 'I want to do a quick mood check-in and label what I\'m feeling right now.'
      },
    ],
    evening: [
      {
        title: '🌙 Close your day',
        body: 'One line: what mattered most?',
        actionType: 'journal',
        chatContext: '' // Will use guided journaling
      },
      {
        title: '📝 Busy mind?',
        body: 'Quick brain dump before bed?',
        actionType: 'journal',
        chatContext: '' // Will use guided journaling
      },
      {
        title: '✨ Gentle wrap-up',
        body: 'A gentle wrap-up helps sleep. Want a 3-min review?',
        actionType: 'journal',
        chatContext: '' // Will use guided journaling
      },
    ],
    personalized: {
      streak: {
        title: '🔥 {{streak_days}}-day streak!',
        body: 'Keep it going with a check-in.',
        actionType: 'chat',
        chatContext: 'I have a {{streak_days}}-day streak going and want to do a check-in to keep the momentum.'
      },
      savedReframe: {
        title: '🔑 Your saved reframe',
        body: '\'{{saved_reframe_title}}\' is waiting for you.',
        actionType: 'chat',
        chatContext: 'I want to revisit my saved reframe: {{saved_reframe_title}}'
      },
      newInsight: {
        title: '✨ New insight found',
        body: '\'{{insight_title}}\'',
        actionType: 'insights',
        chatContext: '' // Will navigate to insights screen
      },
      valueStep: {
        title: '🌱 Your value',
        body: 'You chose {{top_value}} as important. Want a tiny action for it today?',
        actionType: 'chat',
        chatContext: 'I want to take a small action aligned with my value: {{top_value}}'
      },
      goalNudge: {
        title: '💪 Keep momentum',
        body: 'Your goal is waiting. Take one small step?',
        actionType: 'chat',
        chatContext: 'I want to work on my goal and take one small step forward.'
      },
      eveningJournal: {
        title: '🌙 Day review',
        body: 'No journal today yet. Close your day with reflection?',
        actionType: 'journal',
        chatContext: '' // Will use guided journaling
      },
    },
  };

  /**
   * Request notification permissions from the user
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Request permission if not already determined
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      // For Android, also set up notification channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('journal-reminders', {
          name: 'ZenMind',
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
            { key: 'android.provider.extra.APP_PACKAGE', value: 'com.wisdomwise.app' }
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
   * Get notification prompt for first-time request
   */
  getFirstTimePrompt(): { title: string; message: string; allowText: string; declineText: string } {
    return {
      title: 'Enable Gentle Reminders?',
      message: 'Get optional mindfulness reminders to support your mental health journey. You can customize or disable them anytime.',
      allowText: 'Enable',
      declineText: 'Not Now'
    };
  }

  /**
   * Get simplified guidance for when notifications were denied
   */
  getDeniedGuidance(): { title: string; message: string } {
    const isIOS = Platform.OS === 'ios';

    return {
      title: 'Enable Notifications in Settings',
      message: isIOS
        ? 'To enable reminders, go to your iPhone Settings → ZenMind → Notifications, then turn on "Allow Notifications".'
        : 'To enable reminders, go to your phone Settings → Apps → ZenMind → Notifications, then turn on "Show notifications".'
    };
  }

  /**
   * Create better user guidance for enabling notifications (legacy - kept for backward compatibility)
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
        '4. Return to ZenMind when done'
      ] : [
        '1. Tap "Open Settings" below',
        '2. Turn on "Show notifications"',
        '3. Choose your notification preferences',
        '4. Press back to return to ZenMind'
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
      const journalReminders = scheduled.filter(notification => {
        const data = (notification as any).content?.data as { type?: string } | undefined;
        return data?.type === 'journal-reminder';
      });

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
      // Set the notification handler
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: false, // Deprecated, use shouldShowBanner instead
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });

      const hasPermission = await this.getPermissionStatus();

      if (hasPermission === 'granted') {
        await this.scheduleReminders();
      }
    } catch (error) {
      console.error('Error initializing notification service:', error);
      // Don't throw - allow app to continue even if notifications fail
    }
  }

  /**
   * Send immediate test notification
   */
  async sendTestNotification(): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Test from ZenMind",
          body: "Your notifications are working! Anu is ready to support your mindfulness journey.",
          sound: 'default',
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  }

  // ==================== PERSONALIZED NOTIFICATIONS ====================

  /**
   * Save personalized notification configuration
   */
  async savePersonalizedConfig(config: PersonalizedNotificationConfig): Promise<void> {
    try {
      await AsyncStorage.setItem(this.PERSONALIZED_CONFIG_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Error saving personalized config:', error);
    }
  }

  /**
   * Get personalized notification configuration
   */
  async getPersonalizedConfig(): Promise<PersonalizedNotificationConfig> {
    try {
      const stored = await AsyncStorage.getItem(this.PERSONALIZED_CONFIG_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return {
        morningTime: '08:00',
        middayTime: '14:00',
        eveningTime: '20:00',
        extraSupportEnabled: false,
        streakRemindersEnabled: true,
        insightRemindersEnabled: true,
        goalRemindersEnabled: true,
      };
    } catch (error) {
      console.error('Error getting personalized config:', error);
      return {};
    }
  }

  /**
   * Update user notification context (to be called by app when user data changes)
   */
  async updateUserContext(context: Partial<UserNotificationContext>): Promise<void> {
    try {
      const existing = await this.getUserContext();
      const updated = { ...existing, ...context };
      await AsyncStorage.setItem(this.USER_CONTEXT_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error updating user context:', error);
    }
  }

  /**
   * Get user notification context
   */
  async getUserContext(): Promise<UserNotificationContext> {
    try {
      const stored = await AsyncStorage.getItem(this.USER_CONTEXT_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return {};
    } catch (error) {
      console.error('Error getting user context:', error);
      return {};
    }
  }

  /**
   * Check if user was recently active (within last 2 hours)
   */
  private isRecentlyActive(lastActiveTimestamp?: number): boolean {
    if (!lastActiveTimestamp) return false;
    const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
    return lastActiveTimestamp > twoHoursAgo;
  }

  /**
   * Check if we should skip notification based on daily limit
   */
  private async shouldSkipDueToLimit(config: PersonalizedNotificationConfig): Promise<boolean> {
    try {
      const lastNotificationData = await AsyncStorage.getItem(this.LAST_NOTIFICATION_KEY);
      if (!lastNotificationData) return false;

      const { date, count } = JSON.parse(lastNotificationData);
      const today = new Date().toDateString();

      if (date !== today) return false; // Different day, reset count

      const maxPerDay = config.extraSupportEnabled ? 2 : 1;
      return count >= maxPerDay;
    } catch (error) {
      console.error('Error checking notification limit:', error);
      return false;
    }
  }

  /**
   * Record that a notification was sent
   */
  private async recordNotificationSent(): Promise<void> {
    try {
      const today = new Date().toDateString();
      const lastNotificationData = await AsyncStorage.getItem(this.LAST_NOTIFICATION_KEY);

      let count = 1;
      if (lastNotificationData) {
        const { date, count: prevCount } = JSON.parse(lastNotificationData);
        if (date === today) {
          count = prevCount + 1;
        }
      }

      await AsyncStorage.setItem(
        this.LAST_NOTIFICATION_KEY,
        JSON.stringify({ date: today, count })
      );
    } catch (error) {
      console.error('Error recording notification:', error);
    }
  }

  /**
   * Determine which personalized notification to send based on context
   */
  private selectPersonalizedNotification(
    context: UserNotificationContext,
    config: PersonalizedNotificationConfig,
    timeOfDay: 'morning' | 'midday' | 'evening'
  ): { title: string; body: string; actionType: string; chatContext: string } | null {
    // Priority 1: Streak reminders (3+ days)
    if (
      config.streakRemindersEnabled &&
      context.streakDays &&
      context.streakDays >= 3
    ) {
      const template = this.notificationTemplates.personalized.streak;
      return {
        title: template.title.replace('{{streak_days}}', context.streakDays.toString()),
        body: template.body,
        actionType: template.actionType,
        chatContext: template.chatContext.replace('{{streak_days}}', context.streakDays.toString()),
      };
    }

    // Priority 2: Unused saved reframe (3+ days idle)
    if (context.savedReframes && context.savedReframes.length > 0) {
      const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
      const unusedReframe = context.savedReframes.find(r => r.lastUsed < threeDaysAgo);
      if (unusedReframe) {
        const template = this.notificationTemplates.personalized.savedReframe;
        return {
          title: template.title,
          body: template.body.replace('{{saved_reframe_title}}', unusedReframe.title),
          actionType: template.actionType,
          chatContext: template.chatContext.replace('{{saved_reframe_title}}', unusedReframe.title),
        };
      }
    }

    // Priority 3: New unviewed insights (48+ hours)
    if (
      config.insightRemindersEnabled &&
      context.newInsights &&
      context.newInsights.length > 0
    ) {
      const twoDaysAgo = Date.now() - (48 * 60 * 60 * 1000);
      const unviewedInsight = context.newInsights.find(
        i => !i.viewed && i.createdAt < twoDaysAgo
      );
      if (unviewedInsight) {
        const template = this.notificationTemplates.personalized.newInsight;
        return {
          title: template.title,
          body: template.body.replace('{{insight_title}}', unviewedInsight.title),
          actionType: template.actionType,
          chatContext: template.chatContext.replace('{{insight_title}}', unviewedInsight.title),
        };
      }
    }

    // Priority 4: Idle goals (3+ days)
    if (
      config.goalRemindersEnabled &&
      context.goals &&
      context.goals.length > 0 &&
      timeOfDay === 'morning'
    ) {
      const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
      const idleGoal = context.goals.find(g => g.lastActivity < threeDaysAgo);
      if (idleGoal) {
        return this.notificationTemplates.personalized.goalNudge;
      }
    }

    // Priority 5: No journal today (evening only, after 8pm)
    if (timeOfDay === 'evening' && !context.hasJournaledToday) {
      const currentHour = new Date().getHours();
      if (currentHour >= 20) {
        return this.notificationTemplates.personalized.eveningJournal;
      }
    }

    // Priority 6: Value-based action (if top value exists)
    if (context.topValue && timeOfDay === 'morning') {
      const template = this.notificationTemplates.personalized.valueStep;
      return {
        title: template.title,
        body: template.body.replace('{{top_value}}', context.topValue),
        actionType: template.actionType,
        chatContext: template.chatContext.replace('{{top_value}}', context.topValue),
      };
    }

    // Fallback: Rotate through standard time-based notifications
    const templates = this.notificationTemplates[timeOfDay];
    const randomIndex = Math.floor(Math.random() * templates.length);
    return templates[randomIndex];
  }

  /**
   * Schedule intelligent personalized notifications
   */
  async schedulePersonalizedNotifications(): Promise<void> {
    try {
      const config = await this.getPersonalizedConfig();
      const context = await this.getUserContext();

      // Skip if user was recently active
      if (this.isRecentlyActive(context.lastActiveTimestamp)) {
        console.log('User recently active, skipping notification scheduling');
        return;
      }

      // Skip if daily limit reached
      if (await this.shouldSkipDueToLimit(config)) {
        console.log('Daily notification limit reached');
        return;
      }

      // Cancel existing personalized notifications
      await this.cancelPersonalizedNotifications();

      // Determine time slots
      const times = [
        { time: config.morningTime || '08:00', period: 'morning' as const },
        { time: config.middayTime || '14:00', period: 'midday' as const },
        { time: config.eveningTime || '20:00', period: 'evening' as const },
      ];

      // Schedule notifications for each time slot
      for (const { time, period } of times) {
        const notification = this.selectPersonalizedNotification(context, config, period);
        if (notification) {
          const [hours, minutes] = time.split(':').map(Number);

          await Notifications.scheduleNotificationAsync({
            identifier: `personalized-${period}`,
            content: {
              title: notification.title,
              body: notification.body,
              sound: 'default',
              data: {
                type: 'personalized-notification',
                actionType: notification.actionType,
                chatContext: notification.chatContext,
                period,
              },
            },
            trigger: {
              channelId: Platform.OS === 'android' ? 'journal-reminders' : undefined,
              repeats: false, // Send once, then reschedule based on context
              hour: hours,
              minute: minutes,
            },
          });
        }
      }

      await this.recordNotificationSent();
      console.log('Personalized notifications scheduled');
    } catch (error) {
      console.error('Error scheduling personalized notifications:', error);
    }
  }

  /**
   * Cancel personalized notifications
   */
  async cancelPersonalizedNotifications(): Promise<void> {
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      const personalizedNotifications = scheduled.filter(notification =>
        notification.identifier.startsWith('personalized-')
      );

      for (const notification of personalizedNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    } catch (error) {
      console.error('Error canceling personalized notifications:', error);
    }
  }

  /**
   * Refresh personalized notifications (call this when user context changes significantly)
   */
  async refreshPersonalizedNotifications(): Promise<void> {
    const hasPermission = await this.getPermissionStatus();
    if (hasPermission === 'granted') {
      await this.schedulePersonalizedNotifications();
    }
  }
}

export const notificationService = new NotificationService();