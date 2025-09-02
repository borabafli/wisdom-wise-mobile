import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Switch, Alert } from 'react-native';
import { SafeAreaWrapper } from './SafeAreaWrapper';
import { X, Volume2, VolumeX, Play, Settings } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider'; // We'd need to install this
import { ttsService, TTSSettings, TTSVoice } from '../services/ttsService';
import { ttsSettingsStyles as styles } from '../styles/components/TTSSettings.styles';

interface TTSSettingsProps {
  visible: boolean;
  onClose: () => void;
}

const TTSSettingsComponent: React.FC<TTSSettingsProps> = ({ visible, onClose }) => {
  const [settings, setSettings] = useState<TTSSettings>({
    isEnabled: true,
    autoPlay: false,
    rate: 0.8,
    pitch: 0.9,
    language: 'en-US'
  });
  const [voices, setVoices] = useState<TTSVoice[]>([]);
  const [isTestSpeaking, setIsTestSpeaking] = useState(false);

  useEffect(() => {
    if (visible) {
      loadSettings();
      loadVoices();
    }
  }, [visible]);

  const loadSettings = async () => {
    try {
      const currentSettings = await ttsService.getSettings();
      setSettings(currentSettings);
    } catch (error) {
      console.error('Error loading TTS settings:', error);
    }
  };

  const loadVoices = async () => {
    try {
      const availableVoices = await ttsService.getAvailableVoices();
      setVoices(availableVoices);
    } catch (error) {
      console.error('Error loading voices:', error);
    }
  };

  const saveSettings = async (newSettings: Partial<TTSSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await ttsService.saveSettings(newSettings);
    } catch (error) {
      console.error('Error saving TTS settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const testVoice = async () => {
    if (isTestSpeaking) {
      await ttsService.stop();
      setIsTestSpeaking(false);
    } else {
      setIsTestSpeaking(true);
      const testText = "Hello, I'm your gentle turtle guide. This is how my voice will sound with these settings.";
      await ttsService.speak(testText, settings);
      // The service will handle the callback when done
      setTimeout(() => setIsTestSpeaking(false), 5000); // Fallback timeout
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaWrapper style={styles.container}>
        <LinearGradient
          colors={['#f0f9ff', '#e0f2fe']}
          style={styles.backgroundGradient}
        />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Voice Settings</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#475569" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          
          {/* Enable TTS */}
          <View style={styles.settingCard}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.9)', 'rgba(240, 249, 255, 0.8)']}
              style={styles.settingGradient}
            >
              <View style={styles.settingHeader}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Enable Voice</Text>
                  <Text style={styles.settingDescription}>
                    Allow your turtle guide to speak responses aloud
                  </Text>
                </View>
                <Switch
                  value={settings.isEnabled}
                  onValueChange={(value) => saveSettings({ isEnabled: value })}
                  trackColor={{ false: '#e5e7eb', true: '#bfdbfe' }}
                  thumbColor={settings.isEnabled ? '#3b82f6' : '#9ca3af'}
                />
              </View>
            </LinearGradient>
          </View>

          {/* Auto-play */}
          <View style={styles.settingCard}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.9)', 'rgba(240, 249, 255, 0.8)']}
              style={styles.settingGradient}
            >
              <View style={styles.settingHeader}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Auto-play Responses</Text>
                  <Text style={styles.settingDescription}>
                    Automatically speak AI responses when they arrive
                  </Text>
                </View>
                <Switch
                  value={settings.autoPlay}
                  onValueChange={(value) => saveSettings({ autoPlay: value })}
                  trackColor={{ false: '#e5e7eb', true: '#bfdbfe' }}
                  thumbColor={settings.autoPlay ? '#3b82f6' : '#9ca3af'}
                  disabled={!settings.isEnabled}
                />
              </View>
            </LinearGradient>
          </View>

          {/* Speaking Rate */}
          <View style={styles.settingCard}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.9)', 'rgba(240, 249, 255, 0.8)']}
              style={styles.settingGradient}
            >
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Speaking Speed</Text>
                <Text style={styles.settingValue}>{Math.round(settings.rate * 100)}%</Text>
                
                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderLabel}>Slow</Text>
                  <View style={styles.sliderWrapper}>
                    {/* Note: We'd need to install @react-native-community/slider */}
                    <View style={styles.sliderPlaceholder}>
                      <TouchableOpacity
                        style={[styles.sliderButton, settings.rate < 0.8 && styles.sliderButtonActive]}
                        onPress={() => saveSettings({ rate: 0.6 })}
                      >
                        <Text style={styles.sliderButtonText}>Slow</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.sliderButton, settings.rate >= 0.7 && settings.rate <= 0.9 && styles.sliderButtonActive]}
                        onPress={() => saveSettings({ rate: 0.8 })}
                      >
                        <Text style={styles.sliderButtonText}>Normal</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.sliderButton, settings.rate > 1.0 && styles.sliderButtonActive]}
                        onPress={() => saveSettings({ rate: 1.2 })}
                      >
                        <Text style={styles.sliderButtonText}>Fast</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.sliderLabel}>Fast</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Voice Pitch */}
          <View style={styles.settingCard}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.9)', 'rgba(240, 249, 255, 0.8)']}
              style={styles.settingGradient}
            >
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Voice Pitch</Text>
                <Text style={styles.settingValue}>{Math.round(settings.pitch * 100)}%</Text>
                
                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderLabel}>Lower</Text>
                  <View style={styles.sliderWrapper}>
                    <View style={styles.sliderPlaceholder}>
                      <TouchableOpacity
                        style={[styles.sliderButton, settings.pitch < 0.8 && styles.sliderButtonActive]}
                        onPress={() => saveSettings({ pitch: 0.7 })}
                      >
                        <Text style={styles.sliderButtonText}>Low</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.sliderButton, settings.pitch >= 0.8 && settings.pitch <= 1.0 && styles.sliderButtonActive]}
                        onPress={() => saveSettings({ pitch: 0.9 })}
                      >
                        <Text style={styles.sliderButtonText}>Normal</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.sliderButton, settings.pitch > 1.0 && styles.sliderButtonActive]}
                        onPress={() => saveSettings({ pitch: 1.2 })}
                      >
                        <Text style={styles.sliderButtonText}>High</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.sliderLabel}>Higher</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Test Voice */}
          <View style={styles.testContainer}>
            <TouchableOpacity
              onPress={testVoice}
              style={[styles.testButton, isTestSpeaking && styles.testButtonActive]}
              disabled={!settings.isEnabled}
            >
              <LinearGradient
                colors={isTestSpeaking 
                  ? ['rgba(239, 68, 68, 0.9)', 'rgba(220, 38, 38, 0.9)']
                  : ['rgba(59, 130, 246, 0.9)', 'rgba(37, 99, 235, 0.9)']
                }
                style={styles.testButtonGradient}
              >
                {isTestSpeaking ? (
                  <>
                    <VolumeX size={20} color="white" />
                    <Text style={styles.testButtonText}>Stop Test</Text>
                  </>
                ) : (
                  <>
                    <Play size={20} color="white" />
                    <Text style={styles.testButtonText}>Test Voice</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

        </View>
      </SafeAreaWrapper>
    </Modal>
  );
};



export default TTSSettingsComponent;