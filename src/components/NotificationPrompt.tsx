import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationService } from '../services/notificationService';
import { useTranslation } from 'react-i18next';

const PROMPT_SHOWN_KEY = 'notification_prompt_shown';

export const NotificationPrompt: React.FC = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    checkAndShowPrompt();
  }, []);

  const checkAndShowPrompt = async () => {
    try {
      // Check if we've already shown the prompt
      const hasShown = await AsyncStorage.getItem(PROMPT_SHOWN_KEY);
      if (hasShown) return;

      // Check current permission status
      const status = await notificationService.getPermissionStatus();

      // Only show if undetermined (never asked before)
      if (status === 'undetermined') {
        // Small delay to let the app settle
        setTimeout(() => setVisible(true), 2000);
      }
    } catch (error) {
      console.error('Error checking notification prompt:', error);
    }
  };

  const handleAllow = async () => {
    try {
      await AsyncStorage.setItem(PROMPT_SHOWN_KEY, 'true');
      setVisible(false);

      // Request permission
      await notificationService.requestPermissions();
    } catch (error) {
      console.error('Error requesting notifications:', error);
    }
  };

  const handleDecline = async () => {
    try {
      await AsyncStorage.setItem(PROMPT_SHOWN_KEY, 'true');
      setVisible(false);
    } catch (error) {
      console.error('Error declining notifications:', error);
    }
  };

  const prompt = notificationService.getFirstTimePrompt();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleDecline}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-3xl p-6 w-full max-w-sm">
          <Text className="text-xl font-semibold text-gray-900 mb-3 text-center">
            {prompt.title}
          </Text>

          <Text className="text-base text-gray-600 mb-6 text-center leading-6">
            {prompt.message}
          </Text>

          <View className="space-y-3">
            <TouchableOpacity
              onPress={handleAllow}
              className="bg-primary-500 py-4 rounded-2xl"
              activeOpacity={0.8}
            >
              <Text className="text-white text-center font-semibold text-base">
                {prompt.allowText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDecline}
              className="py-4 rounded-2xl"
              activeOpacity={0.8}
            >
              <Text className="text-gray-500 text-center font-medium text-base">
                {prompt.declineText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
