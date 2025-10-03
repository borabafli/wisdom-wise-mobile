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

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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

            {/* Extra Support */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Zap size={20} color="#0f766e" />
                <Text style={styles.sectionTitle}>Notification Frequency</Text>
              </View>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Extra Support</Text>
                  <Text style={styles.settingDescription}>
                    Receive up to 2 notifications per day instead of 1
                  </Text>
                </View>
                <Switch
                  value={config.extraSupportEnabled}
                  onValueChange={() => toggleSetting('extraSupportEnabled')}
                  trackColor={{ false: '#d1d5db', true: '#14b8a6' }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>

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
                  trackColor={{ false: '#d1d5db', true: '#14b8a6' }}
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
                  onValueChange={() => toggleSetting('insightRemindersEnabled')}
                  trackColor={{ false: '#d1d5db', true: '#14b8a6' }}
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
                  trackColor={{ false: '#d1d5db', true: '#14b8a6' }}
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
    </Modal>
  );
};

export default NotificationSettingsModal;
