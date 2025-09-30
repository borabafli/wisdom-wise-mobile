import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Modal,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, BookOpen, Sun, Coffee, Moon, Plus } from 'lucide-react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { notificationPermissionStyles as styles } from '../../styles/components/onboarding/NotificationPermission.styles';
import { notificationService, JournalReminderTime } from '../../services/notificationService';
import WheelTimePicker from '../../components/WheelTimePicker';

interface NotificationPermissionScreenProps {
  onContinue: () => void;
  onBack?: () => void;
}

const NotificationPermissionScreen: React.FC<NotificationPermissionScreenProps> = ({
  onContinue,
  onBack
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [reminderTimes, setReminderTimes] = useState<JournalReminderTime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [editingReminder, setEditingReminder] = useState<string | null>(null);
  const [selectedHour, setSelectedHour] = useState(8);
  const [selectedMinute, setSelectedMinute] = useState(0);

  // Default reminders matching the design
  const defaultReminders: JournalReminderTime[] = [
    {
      id: 'morning',
      time: '08:00',
      enabled: true,
      label: 'Morning',
      description: 'Start your day grounded'
    },
    {
      id: 'daytime',
      time: '14:00',
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

  useEffect(() => {
    initializeScreen();
  }, []);

  const initializeScreen = async () => {
    try {
      NavigationBar.setBackgroundColorAsync('#EDF8F8');

      // Use default reminders for this screen
      setReminderTimes(defaultReminders);

      // Start entrance animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();

      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing notification screen:', error);
      setIsLoading(false);
    }
  };

  const handleToggleReminder = async (reminderId: string, enabled: boolean) => {
    try {
      setReminderTimes(prev =>
        prev.map(reminder =>
          reminder.id === reminderId ? { ...reminder, enabled } : reminder
        )
      );

      await notificationService.updateReminderSetting(reminderId, { enabled });
    } catch (error) {
      console.error('Error updating reminder setting:', error);
      setReminderTimes(prev =>
        prev.map(reminder =>
          reminder.id === reminderId ? { ...reminder, enabled: !enabled } : reminder
        )
      );
    }
  };


  const handleContinue = async () => {
    try {
      // Check current permission status
      const { canRequest, shouldGoToSettings } = await notificationService.canRequestPermissions();

      if (shouldGoToSettings) {
        // Permission was previously denied - offer to go to settings
        const guidance = notificationService.getNotificationGuidance();

        Alert.alert(
          guidance.title,
          `${guidance.message}\n\nWould you like to enable notifications in settings? You can always set this up later in your profile.`,
          [
            {
              text: 'Skip for Now',
              style: 'cancel',
              onPress: () => onContinue()
            },
            {
              text: 'Enable in Settings',
              style: 'default',
              onPress: async () => {
                await notificationService.openSettings();
                // Continue after opening settings (user can return to app)
                onContinue();
              }
            }
          ]
        );
        return;
      }

      // Try to request permission
      const hasPermission = await notificationService.requestPermissions();

      if (hasPermission) {
        await notificationService.saveReminderSettings(reminderTimes);
        await notificationService.scheduleReminders();
      }

      onContinue();
    } catch (error) {
      console.error('Error handling continue:', error);
      onContinue();
    }
  };

  const handleTimePress = (reminderId: string, currentTime: string) => {
    const [hours24, minutes] = currentTime.split(':').map(Number);

    // Convert 24-hour to 12-hour format
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 === 0 ? 12 : hours24 > 12 ? hours24 - 12 : hours24;

    // Set the selected time values from the current reminder
    setSelectedHour(hours12);
    setSelectedMinute(minutes);
    setSelectedPeriod(period);
    setEditingReminder(reminderId);
    setShowTimePicker(true);

    console.log('Opening time picker for:', reminderId, 'Current time:', currentTime, 'Selected:', hours12, minutes, period);
  };

  const handleTimeConfirm = async () => {
    if (editingReminder) {
      // Convert 12-hour format back to 24-hour format
      let hours24 = selectedHour;
      if (selectedPeriod === 'PM' && selectedHour !== 12) {
        hours24 = selectedHour + 12;
      } else if (selectedPeriod === 'AM' && selectedHour === 12) {
        hours24 = 0;
      }

      const newTime = `${hours24.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;

      console.log('Confirming time change for:', editingReminder, 'New time:', newTime, 'Selected:', selectedHour, selectedMinute, selectedPeriod);

      // Create a new array to force re-render
      const newReminderTimes = reminderTimes.map(reminder =>
        reminder.id === editingReminder ? { ...reminder, time: newTime } : { ...reminder }
      );

      console.log('Updated reminder times:', newReminderTimes);

      // Update the state with the new array
      setReminderTimes(newReminderTimes);

      // Update the service with the new time
      try {
        await notificationService.updateReminderSetting(editingReminder, { time: newTime });
        console.log('Successfully updated service with new time');
      } catch (error) {
        console.error('Error updating reminder time:', error);
      }
    }

    // Close the modal and reset editing state
    setShowTimePicker(false);
    setEditingReminder(null);
  };

  const handleTimePickerClose = () => {
    setShowTimePicker(false);
    setEditingReminder(null);
  };

  // Generate hours, minutes, and periods arrays
  const hours = Array.from({ length: 12 }, (_, i) => i === 0 ? 12 : i); // 1-12 for 12-hour format
  const minutes = Array.from({ length: 60 }, (_, i) => i).filter(i => i % 15 === 0); // 15-minute intervals
  const periods = ['AM', 'PM'];
  const [selectedPeriod, setSelectedPeriod] = useState('AM');

  // Custom Toggle Component
  const CustomToggle = ({ value, onValueChange }: { value: boolean, onValueChange: (value: boolean) => void }) => {
    return (
      <TouchableOpacity
        style={[
          styles.customToggleTrack,
          value ? styles.customToggleTrackActive : styles.customToggleTrackInactive
        ]}
        onPress={() => onValueChange(!value)}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.customToggleThumb,
            {
              transform: [{
                translateX: value ? 24 : 2, // Updated for equal distance: (52-26)/2 = 13, so 2px to 24px (52-26-2)
              }]
            }
          ]}
        />
      </TouchableOpacity>
    );
  };

  const getIconForReminder = (reminderId: string) => {
    switch (reminderId) {
      case 'morning':
        return Sun;
      case 'daytime':
        return Coffee;
      case 'evening':
        return Moon;
      default:
        return Sun;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" backgroundColor="#EDF8F8" translucent={false} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Setting up your reminders...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#EDF8F8" translucent={false} />
      <SafeAreaView style={styles.safeArea}>
        {/* Back Button */}
        {onBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color="#0f766e" />
          </TouchableOpacity>
        )}

        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.mainTitle}>Wellbeing grows with small, daily steps.</Text>
            <Text style={styles.subtitle}>
              Pick the times that work best for your daily wellbeing practice.
            </Text>
          </View>

          {/* Preview Image */}
          <View style={styles.previewImageContainer}>
            <Image
              source={require('../../../assets/images/onboarding/notifications-preview.png')}
              style={styles.previewImage}
              resizeMode="contain"
            />
          </View>

          {/* Reminder Cards */}
          <View style={styles.remindersContainer}>
            {reminderTimes.map((reminder) => {
              const IconComponent = getIconForReminder(reminder.id);

              // Format time display
              const timeFormatted = formatTimeDisplay(reminder.time);

              return (
                <View key={reminder.id} style={styles.reminderCard}>
                  <View style={styles.reminderIconContainer}>
                    <IconComponent
                      size={18} // Increased from 14 to match bigger container
                      color="#FFFFFF"
                      strokeWidth={2}
                    />
                  </View>

                  <View style={styles.reminderContent}>
                    <Text style={styles.reminderLabel}>
                      {reminder.label}
                    </Text>
                    <TouchableOpacity
                      style={styles.timeRow}
                      onPress={() => handleTimePress(reminder.id, reminder.time)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.reminderTime}>
                        {timeFormatted}
                      </Text>
                      <ChevronLeft
                        size={16}
                        color="#9CA3AF"
                        style={{ transform: [{ rotate: '180deg' }] }}
                      />
                    </TouchableOpacity>
                    <Text style={styles.reminderDescription}>
                      {reminder.description}
                    </Text>
                  </View>

                  <CustomToggle
                    value={reminder.enabled}
                    onValueChange={(enabled) => handleToggleReminder(reminder.id, enabled)}
                  />
                </View>
              );
            })}
          </View>

          {/* Action Buttons */}
          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>Continue</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => onContinue()}
              activeOpacity={0.8}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Bottom Sheet Time Picker */}
        {showTimePicker && (
          <Modal transparent={true} visible={showTimePicker} animationType="slide">
            <View style={styles.bottomSheetOverlay}>
              <TouchableOpacity
                style={styles.bottomSheetBackdrop}
                activeOpacity={1}
                onPress={handleTimePickerClose}
              />
              <View style={styles.bottomSheetContainer}>
                {/* Handle bar */}
                <View style={styles.bottomSheetHandle} />

                <Text style={styles.bottomSheetTitle}>Select Time</Text>

                <WheelTimePicker
                  selectedHour={selectedHour}
                  selectedMinute={selectedMinute}
                  selectedPeriod={selectedPeriod}
                  onHourChange={setSelectedHour}
                  onMinuteChange={setSelectedMinute}
                  onPeriodChange={setSelectedPeriod}
                />

                <View style={styles.bottomSheetButtons}>
                  <TouchableOpacity
                    style={styles.bottomSheetSaveButton}
                    onPress={handleTimeConfirm}
                  >
                    <Text style={styles.bottomSheetSaveText}>Save</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.bottomSheetCancelButton}
                    onPress={handleTimePickerClose}
                  >
                    <Text style={styles.bottomSheetCancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </SafeAreaView>
    </View>
  );
};

// Helper function to format time display
const formatTimeDisplay = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

export default NotificationPermissionScreen;