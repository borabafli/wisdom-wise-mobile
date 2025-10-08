import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';

import { notificationService } from '../services/notificationService';

const BACKGROUND_NOTIFICATION_TASK = 'background-notification-task';

let isTaskDefined = false;

const ensureTaskDefinition = () => {
  if (isTaskDefined) {
    return;
  }

  console.log('[NotificationBackground] Defining background notification task');

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

  isTaskDefined = true;
  console.log('[NotificationBackground] Task definition complete');
};

// Ensure the task is defined as soon as this module loads.
ensureTaskDefinition();

export const registerBackgroundNotificationTask = async () => {
  try {
    ensureTaskDefinition();

    const isAvailable = await TaskManager.isAvailableAsync();
    console.log('[NotificationBackground] Task availability:', isAvailable);
    if (!isAvailable) {
      console.log('Background tasks not available on this platform. Skipping registration.');
      return;
    }

    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_NOTIFICATION_TASK);
    console.log('[NotificationBackground] Task already registered?', isRegistered);
    if (isRegistered) {
      console.log('Background notification task already registered.');
      return;
    }

    console.log('[NotificationBackground] Registering background fetch task');
    await BackgroundFetch.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK, {
      minimumInterval: 24 * 60 * 60, // Run once every 24 hours
      stopOnTerminate: false,
      startOnBoot: true,
    });

    await BackgroundFetch.setMinimumIntervalAsync(24 * 60 * 60);

    console.log('Background notification task registered.');
  } catch (registrationError) {
    console.error('Failed to register background notification task:', registrationError);
  }
};

export const unregisterBackgroundNotificationTask = async () => {
  try {
    console.log('[NotificationBackground] Unregistering task');
    await BackgroundFetch.unregisterTaskAsync(BACKGROUND_NOTIFICATION_TASK);
    console.log('Background notification task unregistered.');
  } catch (error) {
    console.error('Failed to unregister background notification task:', error);
  }
};
