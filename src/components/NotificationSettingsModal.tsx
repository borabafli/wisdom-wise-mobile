import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Switch,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { X, Bell, Clock, Zap } from 'lucide-react-native';
import { notificationService, PersonalizedNotificationConfig } from '../services/notificationService';
import { notificationSettingsModalStyles as styles } from '../styles/components/NotificationSettingsModal.styles';
import WheelTimePicker from './WheelTimePicker';
import { wheelTimePickerStyles } from '../styles/components/WheelTimePicker.styles';

interface NotificationSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  visible,
  onClose,
}) => {
  const { t } = useTranslation();
  const [config, setConfig] = useState<PersonalizedNotificationConfig>({
    morningTime: '08:00',
    middayTime: '14:00',
    eveningTime: '20:00',
    extraSupportEnabled: false,
    streakRemindersEnabled: true,
    insightRemindersEnabled: true,
    goalRemindersEnabled: true,
  });
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [editingTimeKey, setEditingTimeKey] = useState<'morningTime' | 'middayTime' | 'eveningTime' | null>(null);
  const [tempSelectedTime, setTempSelectedTime] = useState({
    hour: 0,
    minute: 0,
    period: 'AM' as 'AM' | 'PM',
  });

  useEffect(() => {
    if (visible) {
      loadSettings();
    }
  }, [visible]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const savedConfig = await notificationService.getPersonalizedConfig();
      const permissionStatus = await notificationService.getPermissionStatus();

      setConfig(savedConfig);
      setHasPermission(permissionStatus === 'granted');
      console.log('[NotificationSettingsModal] Loaded config:', savedConfig);
      console.log('[NotificationSettingsModal] Has permission:', permissionStatus === 'granted');
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await notificationService.savePersonalizedConfig(config);

      if (hasPermission) {
        await notificationService.refreshPersonalizedNotifications();
        Alert.alert(
          'Settings Saved',
          'Your notification preferences have been updated.',
          [{ text: 'OK', onPress: onClose }]
        );
      } else {
        Alert.alert(
          'Settings Saved',
          'Enable notifications to receive personalized reminders.',
          [{ text: 'OK', onPress: onClose }]
        );
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    }
  };

  const handleEnableNotifications = async () => {
    try {
      const granted = await notificationService.requestPermissions();
      if (granted) {
        setHasPermission(true);
        await notificationService.refreshPersonalizedNotifications();
        Alert.alert('Notifications Enabled', 'You\'ll now receive personalized reminders.');
      } else {
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
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
    }
  };

  const toggleSetting = (key: keyof PersonalizedNotificationConfig) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const parseTime = (timeString: string) => {
    const [hourStr, minuteStr] = timeString.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    let period: 'AM' | 'PM' = 'AM';

    if (hour >= 12) {
      period = 'PM';
      if (hour > 12) hour -= 12;
    }
    if (hour === 0) hour = 12; // 00:xx is 12 AM

    return { hour, minute, period };
  };

  const formatTime = (hour: number, minute: number, period: 'AM' | 'PM') => {
    let h = hour;
    if (period === 'PM' && hour !== 12) h += 12;
    if (period === 'AM' && hour === 12) h = 0; // 12 AM is 00:xx
    
    const hourStr = h.toString().padStart(2, '0');
    const minuteStr = minute.toString().padStart(2, '0');
    return `${hourStr}:${minuteStr}`;
  };

  const openTimePicker = (key: 'morningTime' | 'middayTime' | 'eveningTime') => {
    setEditingTimeKey(key);
    const { hour, minute, period } = parseTime(config[key]);
    setTempSelectedTime({ hour, minute, period });
    setShowTimePicker(true);
  };

  const handleTimeChange = () => {
    if (editingTimeKey) {
      const newTime = formatTime(tempSelectedTime.hour, tempSelectedTime.minute, tempSelectedTime.period);
      setConfig(prev => ({ ...prev, [editingTimeKey]: newTime }));
    }
    setShowTimePicker(false);
    setEditingTimeKey(null);
  };

  const handleCancelTimeChange = () => {
    setShowTimePicker(false);
    setEditingTimeKey(null);
  };



  if (loading) {
    return (
      <Modal visible={visible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.loadingText}>Loading settings...</Text>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <Bell size={24} color="#0f766e" strokeWidth={2} />
              <Text style={styles.title}>Notification Settings</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }}> {/* Added flex: 1 here */}
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
              {/* Permission Status */}
              {!hasPermission && (
                <View style={styles.permissionBanner}>
                  <Text style={styles.permissionText}>
                    Enable notifications to receive personalized reminders
                  </Text>
                  <TouchableOpacity
                    style={styles.enableButton}
                    onPress={handleEnableNotifications}
                  >
                    <Text style={styles.enableButtonText}>Enable</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Notification Times */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Clock size={20} color="#0f766e" />
                  <Text style={styles.sectionTitle}>Notification Times</Text>
                </View>
                <Text style={styles.sectionDescription}>
                  Set your preferred times for daily reminders.
                </Text>

                <TouchableOpacity style={styles.settingRow} onPress={() => openTimePicker('morningTime')}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Morning Reminder</Text>
                    <Text style={styles.settingDescription}>Set a reminder to start your day mindfully.</Text>
                  </View>
                  <Text style={styles.timeDisplay}>{config.morningTime}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingRow} onPress={() => openTimePicker('middayTime')}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Midday Check-in</Text>
                    <Text style={styles.settingDescription}>Pause and re-center during your day.</Text>
                  </View>
                  <Text style={styles.timeDisplay}>{config.middayTime}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingRow} onPress={() => openTimePicker('eveningTime')}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Evening Reflection</Text>
                    <Text style={styles.settingDescription}>Reflect on your day and unwind.</Text>
                  </View>
                  <Text style={styles.timeDisplay}>{config.eveningTime}</Text>
                </TouchableOpacity>
              </View>

              {/* Extra Support (Removed) */}

              {/* Personalized Triggers */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Clock size={20} color="#0f766e" />
                  <Text style={styles.sectionTitle}>Smart Reminders</Text>
                </View>
                <Text style={styles.sectionDescription}>
                  Anu will personalize notifications based on your activity
                </Text>

                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Streak Reminders</Text>
                    <Text style={styles.settingDescription}>
                      Get reminded when you have a 3+ day streak
                    </Text>
                  </View>
                  <Switch
                    value={config.streakRemindersEnabled}
                    onValueChange={() => toggleSetting('streakRemindersEnabled')}
                    trackColor={{ false: '#d1d5db', true: '#36657D' }}
                    thumbColor="#ffffff"
                  />
                </View>

                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Insight Reminders</Text>
                    <Text style={styles.settingDescription}>
                      Notified about new insights you haven't viewed
                    </Text>
                  </View>
                  <Switch
                    value={config.insightRemindersEnabled}
                  trackColor={{ false: '#d1d5db', true: '#36657D' }}
                    thumbColor="#ffffff"
                  />
                </View>

                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Goal Reminders</Text>
                    <Text style={styles.settingDescription}>
                      Keep momentum on goals you haven't worked on
                    </Text>
                  </View>
                  <Switch
                    value={config.goalRemindersEnabled}
                    onValueChange={() => toggleSetting('goalRemindersEnabled')}
                    trackColor={{ false: '#d1d5db', true: '#36657D' }}
                    thumbColor="#ffffff"
                  />
                </View>
              </View>

              {/* Info Section */}
              <View style={styles.infoSection}>
                <Text style={styles.infoText}>
                  🌿 Smart notifications adapt to your usage patterns and skip when you're already active in the app.
                </Text>
              </View>
            </ScrollView>

            {/* Save Button */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Time Picker Modal */}
      <Modal
        visible={showTimePicker}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCancelTimeChange}
      >
        <View style={styles.timePickerOverlay}>
          <View style={styles.timePickerContainer}>
            <Text style={styles.timePickerTitle}>Select Time</Text>
            <WheelTimePicker
              selectedHour={tempSelectedTime.hour}
              selectedMinute={tempSelectedTime.minute}
              selectedPeriod={tempSelectedTime.period}
              onHourChange={(hour) => setTempSelectedTime(prev => ({ ...prev, hour }))}
              onMinuteChange={(minute) => setTempSelectedTime(prev => ({ ...prev, minute }))}
              onPeriodChange={(period) => setTempSelectedTime(prev => ({ ...prev, period }))}
            />
            <View style={styles.timePickerActions}>
              <TouchableOpacity onPress={handleCancelTimeChange} style={styles.timePickerButton}>
                <Text style={styles.timePickerButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleTimeChange} style={[styles.timePickerButton, styles.timePickerSaveButton]}>
                <Text style={[styles.timePickerButtonText, styles.timePickerSaveButtonText]}>Set</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

export default NotificationSettingsModal;

export default NotificationSettingsModal;
