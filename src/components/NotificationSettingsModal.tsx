import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Image,
  Platform,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Bell, Sun, Coffee, Moon, Plus } from 'lucide-react-native';
import { notificationService, JournalReminderTime } from '../services/notificationService';
import { notificationSettingsModalStyles as styles } from '../styles/components/NotificationSettingsModal.styles';
import WheelTimePicker from './WheelTimePicker';

interface NotificationSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  visible,
  onClose,
}) => {
  const { t } = useTranslation();
  const [reminderTimes, setReminderTimes] = useState<JournalReminderTime[]>([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [editingReminder, setEditingReminder] = useState<string | null>(null);
  const [selectedHour, setSelectedHour] = useState(8);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM');
  const [showCustomReminderInput, setShowCustomReminderInput] = useState(false);
  const [customReminderLabel, setCustomReminderLabel] = useState('');

  useEffect(() => {
    if (visible) {
      loadSettings();
    }
  }, [visible]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const savedSettings = await notificationService.getReminderSettings();
      const permissionStatus = await notificationService.getPermissionStatus();

      setReminderTimes(savedSettings);
      setHasPermission(permissionStatus === 'granted');
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnableNotifications = async () => {
    try {
      const { canRequest, shouldGoToSettings } = await notificationService.canRequestPermissions();

      if (shouldGoToSettings) {
        const guidance = notificationService.getDeniedGuidance();
        Alert.alert(
          guidance.title,
          guidance.message,
          [
            { text: 'Not Now', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => notificationService.openSettings(),
            },
          ]
        );
        return;
      }

      if (canRequest) {
        const granted = await notificationService.requestPermissions();
        if (granted) {
          setHasPermission(true);
          await notificationService.scheduleReminders();
          Alert.alert('Notifications Enabled', 'You\'ll now receive mindful reminders.');
        }
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      Alert.alert('Error', 'Failed to enable notifications. Please try again.');
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
      // Revert on error
      setReminderTimes(prev =>
        prev.map(reminder =>
          reminder.id === reminderId ? { ...reminder, enabled: !enabled } : reminder
        )
      );
    }
  };

  const handleTimePress = (reminderId: string, currentTime: string) => {
    const [hours24, minutes] = currentTime.split(':').map(Number);

    // Convert 24-hour to 12-hour format
    const period: 'AM' | 'PM' = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 === 0 ? 12 : hours24 > 12 ? hours24 - 12 : hours24;

    setSelectedHour(hours12);
    setSelectedMinute(minutes);
    setSelectedPeriod(period);
    setEditingReminder(reminderId);
    setShowTimePicker(true);
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

      // Update local state
      const newReminderTimes = reminderTimes.map(reminder =>
        reminder.id === editingReminder ? { ...reminder, time: newTime } : { ...reminder }
      );

      setReminderTimes(newReminderTimes);

      // Update the service
      try {
        await notificationService.updateReminderSetting(editingReminder, { time: newTime });
      } catch (error) {
        console.error('Error updating reminder time:', error);
      }
    }

    setShowTimePicker(false);
    setEditingReminder(null);
  };

  const handleTimePickerClose = () => {
    setShowTimePicker(false);
    setEditingReminder(null);
  };

  const handleAddCustomReminder = () => {
    setCustomReminderLabel('');
    setShowCustomReminderInput(true);
  };

  const handleConfirmCustomReminder = async () => {
    if (customReminderLabel && customReminderLabel.trim()) {
      try {
        await notificationService.addCustomReminder({
          time: '12:00',
          enabled: true,
          label: customReminderLabel.trim(),
          description: 'Custom mindful reminder',
        });
        setShowCustomReminderInput(false);
        setCustomReminderLabel('');
        await loadSettings();
      } catch (error) {
        console.error('Error adding custom reminder:', error);
        Alert.alert('Error', 'Failed to add custom reminder.');
      }
    }
  };

  const handleCancelCustomReminder = () => {
    setShowCustomReminderInput(false);
    setCustomReminderLabel('');
  };

  const handleDeleteReminder = (reminderId: string) => {
    // Only allow deletion of custom reminders (not the default 3)
    const isCustom = !['morning', 'daytime', 'afternoon', 'evening'].includes(reminderId);

    if (!isCustom) {
      return; // Don't allow deletion of default reminders
    }

    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await notificationService.removeReminder(reminderId);
              await loadSettings();
            } catch (error) {
              console.error('Error deleting reminder:', error);
              Alert.alert('Error', 'Failed to delete reminder.');
            }
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    try {
      await notificationService.saveReminderSettings(reminderTimes);

      if (hasPermission) {
        await notificationService.scheduleReminders();
        Alert.alert(
          'Settings Saved',
          'Your notification preferences have been updated.',
          [{ text: 'OK', onPress: onClose }]
        );
      } else {
        Alert.alert(
          'Settings Saved',
          'Enable notifications to receive reminders.',
          [{ text: 'OK', onPress: onClose }]
        );
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    }
  };

  const getIconForReminder = (reminderId: string) => {
    switch (reminderId) {
      case 'morning':
        return Sun;
      case 'daytime':
      case 'afternoon':
        return Coffee;
      case 'evening':
        return Moon;
      default:
        return Bell;
    }
  };

  const formatTimeDisplay = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

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
        <View
          style={[
            styles.customToggleThumb,
            {
              transform: [{
                translateX: value ? 24 : 2,
              }]
            }
          ]}
        />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <ChevronLeft size={24} color="#0f766e" />
          </TouchableOpacity>
          <Text style={styles.title}>Notification Settings</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Permission Banner */}
          {!hasPermission && (
            <View style={styles.permissionBanner}>
              <Text style={styles.permissionText}>
                Enable notifications to receive mindful reminders
              </Text>
              <TouchableOpacity
                style={styles.enableButton}
                onPress={handleEnableNotifications}
              >
                <Text style={styles.enableButtonText}>Enable</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Preview Image */}
          <View style={styles.previewImageContainer}>
            <Image
              source={require('../../assets/images/onboarding/notifications-preview.png')}
              style={styles.previewImage}
              resizeMode="contain"
            />
          </View>

          {/* Section Header */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Daily Reminders</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Pick the times that work best for your daily wellbeing practice.
            </Text>

            {/* Reminder Cards */}
            <View style={styles.remindersContainer}>
              {reminderTimes.map((reminder) => {
                const IconComponent = getIconForReminder(reminder.id);
                const timeFormatted = formatTimeDisplay(reminder.time);
                const isCustom = !['morning', 'daytime', 'afternoon', 'evening'].includes(reminder.id);

                return (
                  <TouchableOpacity
                    key={reminder.id}
                    style={styles.reminderCard}
                    activeOpacity={0.95}
                    onLongPress={isCustom ? () => handleDeleteReminder(reminder.id) : undefined}
                  >
                    <View style={styles.reminderIconContainer}>
                      <IconComponent
                        size={18}
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
                        <Text style={styles.timeDisplay}>
                          {timeFormatted}
                        </Text>
                      </TouchableOpacity>
                      <Text style={styles.reminderDescription}>
                        {reminder.description}
                      </Text>
                    </View>

                    <CustomToggle
                      value={reminder.enabled}
                      onValueChange={(enabled) => handleToggleReminder(reminder.id, enabled)}
                    />
                  </TouchableOpacity>
                );
              })}

              {/* Add Custom Reminder Button */}
              <TouchableOpacity
                style={styles.addReminderCard}
                onPress={handleAddCustomReminder}
                activeOpacity={0.8}
              >
                <View style={styles.addIconContainer}>
                  <Plus size={18} color="#FFFFFF" strokeWidth={2} />
                </View>
                <View style={styles.addContent}>
                  <Text style={styles.addLabel}>Add Custom Reminder</Text>
                  <Text style={styles.addDescription}>Create your own reminder time</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <Text style={styles.infoText}>
              You can customize these reminders anytime. Long press custom reminders to delete them. Notifications help maintain consistency in your mindfulness practice.
            </Text>
          </View>
        </ScrollView>

        {/* Footer with Save Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>

        {/* Time Picker Modal */}
        {showTimePicker && (
          <Modal transparent={true} visible={showTimePicker} animationType="slide">
            <View style={styles.timePickerOverlay}>
              <TouchableOpacity
                style={{ flex: 1 }}
                activeOpacity={1}
                onPress={handleTimePickerClose}
              />
              <View style={styles.timePickerContainer}>
                <Text style={styles.timePickerTitle}>Select Time</Text>

                <WheelTimePicker
                  selectedHour={selectedHour}
                  selectedMinute={selectedMinute}
                  selectedPeriod={selectedPeriod}
                  onHourChange={setSelectedHour}
                  onMinuteChange={setSelectedMinute}
                  onPeriodChange={setSelectedPeriod}
                />

                <View style={styles.timePickerActions}>
                  <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={handleTimePickerClose}
                  >
                    <Text style={styles.timePickerButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.timePickerButton, styles.timePickerSaveButton]}
                    onPress={handleTimeConfirm}
                  >
                    <Text style={[styles.timePickerButtonText, styles.timePickerSaveButtonText]}>
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}

        {/* Custom Reminder Input Modal */}
        {showCustomReminderInput && (
          <Modal transparent={true} visible={showCustomReminderInput} animationType="fade">
            <View style={styles.customInputOverlay}>
              <TouchableOpacity
                style={{ flex: 1 }}
                activeOpacity={1}
                onPress={handleCancelCustomReminder}
              />
              <View style={styles.customInputContainer}>
                <Text style={styles.customInputTitle}>Add Custom Reminder</Text>
                <Text style={styles.customInputDescription}>
                  Enter a label for your custom reminder
                </Text>

                <TextInput
                  style={styles.customInput}
                  value={customReminderLabel}
                  onChangeText={setCustomReminderLabel}
                  placeholder="e.g., Before Bed, After Lunch"
                  placeholderTextColor="#94a3b8"
                  autoFocus={true}
                  maxLength={30}
                />

                <View style={styles.customInputActions}>
                  <TouchableOpacity
                    style={styles.customInputButton}
                    onPress={handleCancelCustomReminder}
                  >
                    <Text style={styles.customInputButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.customInputButton,
                      styles.customInputAddButton,
                      !customReminderLabel.trim() && styles.customInputButtonDisabled
                    ]}
                    onPress={handleConfirmCustomReminder}
                    disabled={!customReminderLabel.trim()}
                  >
                    <Text style={[
                      styles.customInputButtonText,
                      styles.customInputAddButtonText
                    ]}>
                      Add
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default NotificationSettingsModal;
