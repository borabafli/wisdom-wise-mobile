import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import { notificationService } from '../services/notificationService'; // Assuming notificationService is exported

const BACKGROUND_NOTIFICATION_TASK = 'background-notification-task';

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error('Background notification task error:', error);
    return;
  }
  if (data) {
    console.log('Background notification task received data:', data);
    // In a real scenario, you might want to check the data
  }

  console.log('Running background notification task...');
  try {
    // Re-schedule personalized notifications to ensure they are up-to-date
    // and persist across app closures.
    await notificationService.refreshPersonalizedNotifications();
    console.log('Background notification task completed: Personalized notifications refreshed.');
  } catch (e) {
    console.error('Error in background notification task:', e);
  }
});

export const registerBackgroundNotificationTask = async () => {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_NOTIFICATION_TASK);
  if (isRegistered) {
    console.log('Background notification task already registered.');
    return;
  }

  // Register the task to run periodically. 
  // For personalized notifications, we want to re-evaluate them regularly.
  // A daily interval might be sufficient, or more frequent if context changes rapidly.
  // For now, let's schedule it once a day.
  await TaskManager.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK, {
    // This option is for Android only, to run the task on device boot
    // event: TaskManager.TaskEvent.BOOT_COMPLETED,
    // For periodic execution, use interval
    // interval: 60 * 60 * 1000, // Run every hour (for testing, can be daily)
    // For production, a daily interval might be more appropriate:
    interval: 24 * 60 * 60 * 1000, // Run once every 24 hours
    // Or, if we want to be more precise, we can schedule it around the notification times
    // and let the task itself decide if it needs to reschedule.
  });
  console.log('Background notification task registered.');
};

export const unregisterBackgroundNotificationTask = async () => {
  await TaskManager.unregisterAllTasksAsync();
  console.log('All background tasks unregistered.');
};