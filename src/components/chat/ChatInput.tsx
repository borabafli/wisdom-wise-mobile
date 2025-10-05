import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Modal, Text, Keyboard, TouchableWithoutFeedback, Platform, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Mic, ArrowUp, X, Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SimpleVolumeWaveform } from '../audio';
import { SafeAreaWrapper } from '../SafeAreaWrapper';
import { chatInterfaceStyles as styles } from '../../styles/components/ChatInterface.styles';

interface ChatInputProps {
  inputText: string;
  onInputTextChange: (text: string) => void;
  onSend: (text?: string) => void;
  isRecording: boolean;
  isTranscribing?: boolean;
  audioLevel: number; // Single audio level instead of array
  partialTranscript?: string;
  onMicPressIn: () => void;
  onMicPressOut: () => void;
  onStopRecording: () => void;
  onCancelRecording: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputText,
  onInputTextChange,
  onSend,
  isRecording,
  isTranscribing,
  audioLevel,
  partialTranscript,
  onMicPressIn,
  onMicPressOut,
  onStopRecording,
  onCancelRecording,
}) => {
  const { t } = useTranslation();
  const [isFullscreenInput, setIsFullscreenInput] = useState(false);
  const insets = useSafeAreaInsets();

  // Animation values - simple and performant
  const iconFade = useRef(new Animated.Value(0)).current;
  const backgroundColorAnim = useRef(new Animated.Value(0)).current;

  // Simple, performant animations
  useEffect(() => {
    if (isRecording) {
      Animated.parallel([
        Animated.timing(backgroundColorAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false, // backgroundColor requires non-native
        }),
        Animated.timing(iconFade, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backgroundColorAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(iconFade, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isRecording]);

  const handleInputTextChange = (text: string) => {
    onInputTextChange(text);
  };

  const toggleFullscreenInput = () => {
    setIsFullscreenInput(!isFullscreenInput);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <>
      {/* Input Area */}
      <View style={styles.inputContainer}>
        <Animated.View
          style={[
            styles.inputCard,
            {
              backgroundColor: backgroundColorAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['#F0F0F0', '#2C5F6F'], // Grey → Dark Blue
              }),
            }
          ]}
        >

          <View style={styles.inputRow}>
            {!isRecording ? (
              <TextInput
                value={inputText}
                onChangeText={handleInputTextChange}
                placeholder={isTranscribing ? t('chat.transcribing') : t('chat.typeOrSpeak')}
                placeholderTextColor="#9CA3AF"
                multiline
                style={[
                  styles.textInput,
                  {
                    maxHeight: 100,
                  }
                ]}
                editable={!isTranscribing}
                selectionColor="#007AFF"
              />
            ) : (
              <Animated.View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: iconFade,
                }}
              >
                <SimpleVolumeWaveform
                  audioLevel={audioLevel}
                  isRecording={isRecording}
                  showTimer={true}
                  width={230}
                  height={50}
                  barCount={28}
                />
              </Animated.View>
            )}

            {/* Buttons Container */}
            <View style={styles.inputButtonsContainer}>
              {/* Left Button: Mic morphs to X (Cancel) */}
              <TouchableOpacity
                onPressIn={isRecording ? undefined : onMicPressIn}
                onPressOut={isRecording ? undefined : onMicPressOut}
                onPress={isRecording ? onCancelRecording : undefined}
                style={[
                  styles.micButton,
                  isRecording && styles.cancelButton,
                ]}
                activeOpacity={0.7}
              >
                {!isRecording ? (
                  <Mic size={26} color="#334155" />
                ) : (
                  <X size={24} color="#ffffff" strokeWidth={2.5} />
                )}
              </TouchableOpacity>

              {/* Right Button: Send morphs to Check (Accept) */}
              <TouchableOpacity
                onPress={isRecording ? onStopRecording : () => onSend()}
                style={styles.sendButton}
                activeOpacity={0.7}
              >
                {!isRecording ? (
                  <ArrowUp size={20} color="#ffffff" />
                ) : (
                  <Check size={24} color="#ffffff" strokeWidth={2.5} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Fullscreen Input Modal */}
      <Modal
        visible={isFullscreenInput}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsFullscreenInput(false)}
      >
        <SafeAreaWrapper style={styles.fullscreenInputContainer}>
          <View style={styles.fullscreenInputHeader}>
            <TouchableOpacity
              onPress={() => setIsFullscreenInput(false)}
              style={styles.fullscreenCloseButton}
            >
              <X size={24} color="#6b7280" strokeWidth={2.5} />
            </TouchableOpacity>
            <Text style={styles.fullscreenInputTitle}>{t('chat.composeMessage')}</Text>
            <TouchableOpacity 
              onPress={() => {
                onSend();
                setIsFullscreenInput(false);
              }}
              style={[styles.fullscreenSendButton, !inputText.trim() && styles.fullscreenSendButtonDisabled]}
              disabled={!inputText.trim()}
            >
              <ArrowUp size={20} color={inputText.trim() ? "#ffffff" : "#9ca3af"} />
            </TouchableOpacity>
          </View>
          
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.fullscreenInputContent}>
            <TextInput
  value={inputText}
  onChangeText={handleInputTextChange}
  placeholder={t('chat.typeOrSpeak')}
  placeholderTextColor="#9CA3AF"
  multiline
  style={styles.fullscreenTextInput}
/>
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaWrapper>
      </Modal>
    </>
  );
};

export default ChatInput;