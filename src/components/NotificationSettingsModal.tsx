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
import { X, Bell, Clock } from 'lucide-react-native';
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
  // const { t } = useTranslation();
  const [config, setConfig] = useState<PersonalizedNotificationConfig>({
    morningTime: '08:00',
    middayTime: '14:00',
    eveningTime: '20:00',
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



  if (loading || !config) {
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
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}>
        <View style={{
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 20,
          width: '100%',
          maxHeight: '80%',
        }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#333',
            }}>Notification Settings</Text>
            <TouchableOpacity onPress={onClose} style={{
              padding: 8,
            }}>
              <Text style={{ fontSize: 16, color: '#666' }}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <Text style={{ fontSize: 16, marginBottom: 20 }}>
            Configure your notification preferences here.
          </Text>

          <TouchableOpacity
            onPress={onClose}
            style={{
              backgroundColor: '#0f766e',
              padding: 15,
              borderRadius: 10,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default NotificationSettingsModal;
