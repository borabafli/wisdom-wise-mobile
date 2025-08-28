import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Volume2, VolumeX, Play, Settings } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider'; // We'd need to install this
import { ttsService, TTSSettings, TTSVoice } from '../services/ttsService';

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
      <SafeAreaView style={styles.container}>
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
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.6)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  settingCard: {
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingGradient: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(191, 219, 254, 0.4)',
  },
  settingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  settingContent: {
    padding: 20,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  settingValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3b82f6',
    textAlign: 'center',
    marginBottom: 16,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  sliderWrapper: {
    flex: 1,
  },
  sliderPlaceholder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 4,
  },
  sliderButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  sliderButtonActive: {
    backgroundColor: '#3b82f6',
  },
  sliderButtonText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  testContainer: {
    marginTop: 24,
  },
  testButton: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  testButtonActive: {
    // Additional styles when active
  },
  testButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default TTSSettingsComponent;