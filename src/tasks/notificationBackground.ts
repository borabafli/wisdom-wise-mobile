import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';

import { notificationService } from '../services/notificationService';

const BACKGROUND_NOTIFICATION_TASK = 'background-notification-task';

// Define the task immediately at module load time
console.log('[NotificationBackground] Defining background notification task at module load');

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error('Background notification task error:', error);
    return;
  }

  if (data) {
    console.log('Background notification task received data:', data);
  }

  try {
    await notificationService.refreshPersonalizedNotifications();
    console.log('Background notification task completed: Personalized notifications refreshed.');
  } catch (taskError) {
    console.error('Error in background notification task:', taskError);
  }
});

console.log('[NotificationBackground] Task definition complete at module load');

export const registerBackgroundNotificationTask = async () => {
  try {
    const isAvailable = await TaskManager.isAvailableAsync();
    console.log('[NotificationBackground] Task availability:', isAvailable);
    if (!isAvailable) {
      console.log('Background tasks not available on this platform. Skipping registration.');
      return;
    }

    // Wait longer and retry if task not defined
    let retries = 0;
    let isTaskDefined = false;

    while (!isTaskDefined && retries < 5) {
      await new Promise(resolve => setTimeout(resolve, 1000 * (retries + 1))); // Exponential backoff
      isTaskDefined = TaskManager.isTaskDefined(BACKGROUND_NOTIFICATION_TASK);
      console.log(`[NotificationBackground] Task defined? ${isTaskDefined} (attempt ${retries + 1})`);
      retries++;
    }

    if (!isTaskDefined) {
      console.error('Task definition failed after retries. Cannot register background task.');
      return;
    }

    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_NOTIFICATION_TASK);
    console.log('[NotificationBackground] Task already registered?', isRegistered);
    if (isRegistered) {
      console.log('Background notification task already registered.');
      return;
    }

    console.log('[NotificationBackground] Background task defined and ready for use');

    try {
      await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
      console.log('Background notification task registered with expo-notifications.');
    } catch (notificationsError) {
      const message = (notificationsError as Error).message || '';
      if (message.includes('is already registered')) {
        console.log('Background notification task already registered with expo-notifications.');
      } else {
        throw notificationsError;
      }
    }
  } catch (registrationError) {
    console.error('Failed to register background notification task:', registrationError);
  }
};

export const unregisterBackgroundNotificationTask = async () => {
  try {
    console.log('[NotificationBackground] Unregistering task');
    await TaskManager.unregisterTaskAsync(BACKGROUND_NOTIFICATION_TASK);
    try {
      await Notifications.unregisterTaskAsync(BACKGROUND_NOTIFICATION_TASK);
    } catch (notificationsError) {
      console.warn('Background notification task was not registered with expo-notifications:', notificationsError);
    }
    console.log('Background notification task unregistered.');
  } catch (error) {
    console.error('Failed to unregister background notification task:', error);
  }
};
