import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Bell, Sun, Coffee, Moon, Plus, Trash2 } from 'lucide-react-native';
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
            { text: t('onboarding.notifications.permissionGuidance.buttons.notNow'), style: 'cancel' },
            {
              text: t('onboarding.notifications.permissionGuidance.buttons.openSettings'),
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
          Alert.alert(
            t('onboarding.notifications.settings.notificationsEnabled'),
            t('onboarding.notifications.settings.willReceiveReminders')
          );
        }
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      Alert.alert(
        t('onboarding.notifications.settings.error'),
        t('onboarding.notifications.settings.failedToEnable')
      );
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
        Alert.alert(
          t('onboarding.notifications.settings.error'),
          t('onboarding.notifications.settings.failedToAdd')
        );
      }
    }
  };

  const handleCancelCustomReminder = () => {
    setShowCustomReminderInput(false);
    setCustomReminderLabel('');
  };

  const handleDeleteReminder = async (reminderId: string) => {
    // Only allow deletion of custom reminders (not the default 3)
    const isCustom = !['morning', 'daytime', 'afternoon', 'evening'].includes(reminderId);

    if (!isCustom) {
      return; // Don't allow deletion of default reminders
    }

    try {
      await notificationService.removeReminder(reminderId);
      await loadSettings();
    } catch (error) {
      console.error('Error deleting reminder:', error);
      Alert.alert(
        t('onboarding.notifications.settings.error'),
        t('onboarding.notifications.settings.failedToDelete')
      );
    }
  };

  const handleSave = async () => {
    try {
      await notificationService.saveReminderSettings(reminderTimes);

      if (hasPermission) {
        await notificationService.scheduleReminders();
        Alert.alert(
          t('onboarding.notifications.settings.settingsSaved'),
          t('onboarding.notifications.settings.preferencesUpdated'),
          [{ text: t('common.ok'), onPress: onClose }]
        );
      } else {
        Alert.alert(
          t('onboarding.notifications.settings.settingsSaved'),
          t('onboarding.notifications.settings.enableToReceive'),
          [{ text: t('common.ok'), onPress: onClose }]
        );
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
      Alert.alert(
        t('onboarding.notifications.settings.error'),
        t('onboarding.notifications.settings.failedToSave')
      );
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

  // Swipeable Reminder Card Component
  const SwipeableReminderCard = ({
    reminder,
    onDelete,
    onTimePress,
    onToggle,
    isCustom,
  }: {
    reminder: JournalReminderTime;
    onDelete: () => void;
    onTimePress: () => void;
    onToggle: (enabled: boolean) => void;
    isCustom: boolean;
  }) => {
    const translateX = useRef(new Animated.Value(0)).current;
    const [isDeleting, setIsDeleting] = useState(false);

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => isCustom,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return isCustom && Math.abs(gestureState.dx) > 5;
        },
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dx < 0) {
            translateX.setValue(Math.max(gestureState.dx, -80));
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx < -60) {
            Animated.timing(translateX, {
              toValue: -80,
              duration: 200,
              useNativeDriver: true,
            }).start();
          } else {
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        },
      })
    ).current;

    const handleDeletePress = () => {
      setIsDeleting(true);
      Animated.timing(translateX, {
        toValue: -400,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onDelete();
      });
    };

    const IconComponent = getIconForReminder(reminder.id);
    const timeFormatted = formatTimeDisplay(reminder.time);

    return (
      <View style={styles.swipeableContainer}>
        {/* Delete button background */}
        <View style={styles.deleteBackground}>
          <TouchableOpacity
            onPress={handleDeletePress}
            style={styles.deleteButton}
            activeOpacity={0.8}
          >
            <Trash2 size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Swipeable card */}
        <Animated.View
          style={[
            { transform: [{ translateX }] },
          ]}
          {...(isCustom ? panResponder.panHandlers : {})}
        >
          <TouchableOpacity
            style={styles.reminderCard}
            activeOpacity={0.95}
            onLongPress={isCustom ? handleDeletePress : undefined}
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
                onPress={onTimePress}
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
              onValueChange={onToggle}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
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
          <Text style={styles.loadingText}>{t('onboarding.notifications.settings.loadingSettings')}</Text>
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
          <Text style={styles.title}>{t('onboarding.notifications.settings.title')}</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
          bounces={true}
          keyboardShouldPersistTaps="handled"
        >
          {/* Permission Banner */}
          {!hasPermission && (
            <View style={styles.permissionBanner}>
              <Text style={styles.permissionText}>
                {t('onboarding.notifications.settings.enableNotifications')}
              </Text>
              <TouchableOpacity
                style={styles.enableButton}
                onPress={handleEnableNotifications}
              >
                <Text style={styles.enableButtonText}>{t('onboarding.notifications.settings.enable')}</Text>
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
              <Text style={styles.sectionTitle}>{t('onboarding.notifications.settings.dailyReminders')}</Text>
            </View>
            <Text style={styles.sectionDescription}>
              {t('onboarding.notifications.settings.dailyRemindersDescription')}
            </Text>

            {/* Reminder Cards */}
            <View style={styles.remindersContainer}>
              {reminderTimes.map((reminder) => {
                const isCustom = !['morning', 'daytime', 'afternoon', 'evening'].includes(reminder.id);

                return (
                  <SwipeableReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    isCustom={isCustom}
                    onDelete={() => handleDeleteReminder(reminder.id)}
                    onTimePress={() => handleTimePress(reminder.id, reminder.time)}
                    onToggle={(enabled) => handleToggleReminder(reminder.id, enabled)}
                  />
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
                  <Text style={styles.addLabel}>{t('onboarding.notifications.settings.addCustomReminder')}</Text>
                  <Text style={styles.addDescription}>{t('onboarding.notifications.settings.createCustomReminder')}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <Text style={styles.infoText}>
              {t('onboarding.notifications.settings.infoText')}
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
            <Text style={styles.saveButtonText}>{t('onboarding.notifications.settings.saveChanges')}</Text>
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
                <Text style={styles.timePickerTitle}>{t('onboarding.notifications.timePickerTitle')}</Text>

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
                    <Text style={styles.timePickerButtonText}>{t('onboarding.notifications.cancelButton')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.timePickerButton, styles.timePickerSaveButton]}
                    onPress={handleTimeConfirm}
                  >
                    <Text style={[styles.timePickerButtonText, styles.timePickerSaveButtonText]}>
                      {t('onboarding.notifications.saveButton')}
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
                <Text style={styles.customInputTitle}>{t('onboarding.notifications.settings.addCustomReminder')}</Text>
                <Text style={styles.customInputDescription}>
                  {t('onboarding.notifications.settings.customReminderLabel')}
                </Text>

                <TextInput
                  style={styles.customInput}
                  value={customReminderLabel}
                  onChangeText={setCustomReminderLabel}
                  placeholder={t('onboarding.notifications.settings.customReminderPlaceholder')}
                  placeholderTextColor="#94a3b8"
                  autoFocus={true}
                  maxLength={30}
                />

                <View style={styles.customInputActions}>
                  <TouchableOpacity
                    style={styles.customInputButton}
                    onPress={handleCancelCustomReminder}
                  >
                    <Text style={styles.customInputButtonText}>{t('onboarding.notifications.cancelButton')}</Text>
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
                      {t('onboarding.notifications.settings.add')}
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
