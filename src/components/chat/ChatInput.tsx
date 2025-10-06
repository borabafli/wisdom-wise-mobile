import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Modal, Text, Keyboard, TouchableWithoutFeedback, Platform, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Mic, ArrowUp, X, Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SimpleVolumeWaveform } from '../audio';
import { SafeAreaWrapper } from '../SafeAreaWrapper';
import { AnimatedTranscribingText } from './AnimatedTranscribingText';
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
  simpleRecordingLayout?: boolean; // New prop for guided journal layout
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
  simpleRecordingLayout = false,
}) => {
  const { t } = useTranslation();
  const [isFullscreenInput, setIsFullscreenInput] = useState(false);
  const insets = useSafeAreaInsets();

  // Animation values - simple and performant
  const iconFade = useRef(new Animated.Value(0)).current;
  const sendIconRotation = useRef(new Animated.Value(0)).current;
  const buttonsVerticalPosition = useRef(new Animated.Value(0)).current;
  const inputCardHeight = useRef(new Animated.Value(0)).current;
  const circleScale = useRef(new Animated.Value(0)).current;

  const [showCircle, setShowCircle] = useState(false);
  const [showStaticCircle, setShowStaticCircle] = useState(false);

  // Simple, performant animations
  useEffect(() => {
    if (isRecording) {
      // Show animated circle for expansion
      setShowCircle(true);
      setShowStaticCircle(false);

      Animated.parallel([
        Animated.timing(iconFade, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(sendIconRotation, {
          toValue: 1,
          useNativeDriver: true,
          tension: 80,
          friction: 8,
        }),
        Animated.spring(buttonsVerticalPosition, {
          toValue: 1,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }),
        Animated.spring(inputCardHeight, {
          toValue: 1,
          useNativeDriver: false, // height requires non-native
          tension: 80,
          friction: 10,
        }),
        // Circle expansion - native driver for best performance
        Animated.timing(circleScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Replace animated circle with static View (no transform, no overhead)
        setShowCircle(false);
        setShowStaticCircle(true);
      });
    } else {
      // Hide static circle, show animated circle for shrinking
      setShowStaticCircle(false);
      setShowCircle(true);
      circleScale.setValue(1); // Reset to full size

      Animated.parallel([
        Animated.timing(iconFade, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(sendIconRotation, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 8,
        }),
        Animated.spring(buttonsVerticalPosition, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }),
        Animated.spring(inputCardHeight, {
          toValue: 0,
          useNativeDriver: false, // height requires non-native
          tension: 80,
          friction: 10,
        }),
        // Circle shrinking - reverse animation
        Animated.timing(circleScale, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Hide animated circle after shrinking completes
        setShowCircle(false);
      });
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
              backgroundColor: '#F0F0F0', // Always light gray - circle provides the dark area
              minHeight: inputCardHeight.interpolate({
                inputRange: [0, 1],
                outputRange: [44, 90], // Grow from 44 to 90 to fit timer inside
              }),
            }
          ]}
        >
          {/* Animated circle - only during expansion/shrinking - hidden in simple layout */}
          {!simpleRecordingLayout && showCircle && (
            <Animated.View
              style={{
                position: 'absolute',
                // Mic button position: 12px padding + 32px send + 16px gap + 16px (mic center)
                right: 76, // From right: padding(12) + send(32) + gap(16) + mic-center(16)
                bottom: 22, // Vertically centered in input card
                width: 10, // Start with tiny circle
                height: 10,
                marginRight: -5, // Center the circle on the position (half of width)
                marginBottom: -5, // Center the circle on the position (half of height)
                borderRadius: 5,
                backgroundColor: '#2C5F6F', // Always dark blue circle
                zIndex: 1, // Behind content
                opacity: circleScale.interpolate({
                  inputRange: [0, 0.15, 1], // Fade out when scale < 0.15 (before becoming tiny dot)
                  outputRange: [0, 0, 1],
                }),
                transform: [
                  {
                    scale: circleScale.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 44.6], // Fine-tuned to exact wave edge
                    })
                  }
                ],
              }}
            />
          )}

          {/* Static circle - during recording (no animations, no transforms, maximum performance) - hidden in simple layout */}
          {!simpleRecordingLayout && showStaticCircle && (
            <View
              style={{
                position: 'absolute',
                right: 76, // Same position as animated circle
                bottom: 22,
                width: 446, // 10px * 44.6 = final size
                height: 446,
                marginRight: -223, // Center it (half of width)
                marginBottom: -223, // Center it (half of height)
                borderRadius: 223,
                backgroundColor: '#2C5F6F',
                zIndex: 1, // Behind content
              }}
            />
          )}

          <View style={[styles.inputRow, { zIndex: 2 }]}>
            {isTranscribing ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingBottom: 4 }}>
                <AnimatedTranscribingText />
              </View>
            ) : !isRecording ? (
              <TextInput
                value={inputText}
                onChangeText={handleInputTextChange}
                placeholder={t('chat.typeOrSpeak')}
                placeholderTextColor="#9CA3AF"
                multiline
                style={[
                  styles.textInput,
                  {
                    maxHeight: 100,
                  }
                ]}
                editable={true}
                selectionColor="#007AFF"
              />
            ) : simpleRecordingLayout ? (
              // Simple layout for guided journal - waveform left, buttons right
              <Animated.View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  opacity: iconFade,
                  gap: 12,
                }}
              >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <SimpleVolumeWaveform
                    audioLevel={audioLevel}
                    isRecording={isRecording}
                    showTimer={true}
                    width={180}
                    height={40}
                    barCount={24}
                  />
                </View>
                <View style={styles.recordingActions}>
                  <TouchableOpacity
                    onPress={onCancelRecording}
                    style={styles.recordingButton}
                    activeOpacity={0.7}
                  >
                    <X size={20} color="#ef4444" strokeWidth={2} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onStopRecording}
                    style={[styles.recordingButton, { backgroundColor: '#63A5A5' }]}
                    activeOpacity={0.7}
                  >
                    <Check size={20} color="#ffffff" strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ) : (
              // Original layout with expanding circle
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
                  height={46}
                  barCount={28}
                />
              </Animated.View>
            )}

            {/* Buttons Container - hidden when recording in simple layout */}
            {!(isRecording && simpleRecordingLayout) && (
              <Animated.View
                style={[
                  styles.inputButtonsContainer,
                  {
                    transform: [{
                      translateY: buttonsVerticalPosition.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -8], // Move up by 8px
                      })
                    }]
                  }
                ]}
              >
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
                    <Mic size={26} color="#334155" strokeWidth={1.5} />
                  ) : (
                    <X size={24} color="#ffffff" strokeWidth={2} />
                  )}
                </TouchableOpacity>

                {/* Right Button: Send morphs to Check (Accept) */}
                <TouchableOpacity
                  onPress={isRecording ? onStopRecording : () => onSend()}
                  style={styles.sendButton}
                  activeOpacity={0.7}
                >
                  <View style={{ position: 'relative', width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
                    {/* ArrowUp - rotates and fades out */}
                    <Animated.View
                      style={{
                        position: 'absolute',
                        opacity: sendIconRotation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 0],
                        }),
                        transform: [{
                          rotate: sendIconRotation.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '90deg'],
                          })
                        }]
                      }}
                    >
                      <ArrowUp size={20} color="#ffffff" strokeWidth={2} />
                    </Animated.View>

                    {/* Check - fades in */}
                    <Animated.View
                      style={{
                        position: 'absolute',
                        opacity: sendIconRotation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1],
                        }),
                      }}
                    >
                      <Check size={24} color="#ffffff" strokeWidth={2} />
                    </Animated.View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            )}
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