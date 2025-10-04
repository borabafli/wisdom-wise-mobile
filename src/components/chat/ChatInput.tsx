import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Modal, Text, Keyboard, TouchableWithoutFeedback, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Mic, ArrowUp, Expand, X, Check } from 'lucide-react-native';
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
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  // 👇 add this
const [inputHeight, setInputHeight] = useState(40);
  const insets = useSafeAreaInsets();
  const inputLineCount = Math.min(inputText.split('\n').length, 9);


  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

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
      <View style={[
        styles.inputContainer, 
        { 
          paddingBottom: Math.max(insets.bottom || 0, 16) + (keyboardHeight > 0 ? 30 : 0) // Extra padding only when keyboard is visible
        }
      ]}>
        <View style={styles.inputCard}>
          <View style={styles.inputRow}>
            {!isRecording ? (
              <TextInput
              value={inputText}
              onChangeText={handleInputTextChange}
              placeholder={isTranscribing ? t('chat.transcribing') : t('chat.typeOrSpeak')}
              placeholderTextColor="#94a3b8"
              multiline
              style={[
                styles.textInput,
                {
                  height: Math.min(Math.max(40, inputHeight), 9 * 22), // min 40, max 9 lines
                  textAlign: isTranscribing ? 'center' : 'left',
                }
              ]}
              editable={!isTranscribing}
              allowFontScaling={false}
              selectionColor="#3b82f6"
              onContentSizeChange={(e) => {
                setInputHeight(e.nativeEvent.contentSize.height);
              }}
            />
            
            ) : (
              /* Recording Interface: X button - Wave with Timer inside chatbox - Check button */
              <View style={styles.recordingInterfaceWithTimer} pointerEvents="box-none">
                {/* Cancel Button (X) - Left side, light filled */}
                <TouchableOpacity
                  onPress={() => {
                    console.log('❌❌❌ CANCEL BUTTON PRESSED - ChatInput ❌❌❌');
                    onCancelRecording();
                  }}
                  style={styles.cancelButton}
                  activeOpacity={0.7}
                  hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                  accessible={true}
                  accessibilityLabel="Cancel recording"
                  accessibilityRole="button"
                  pointerEvents="auto"
                >
                  <X size={20} color="#ffffff" />
                </TouchableOpacity>

                {/* Wave and Timer Container - Center */}
                <View style={styles.waveWithTimerInside} pointerEvents="box-none">
                  <SimpleVolumeWaveform
                    audioLevel={audioLevel}
                    isRecording={isRecording}
                    showTimer={true}
                    width={230}
                    height={68}
                    barCount={28}
                  />
                </View>

                {/* Submit Button (Check) - Right side, filled like send button */}
                <TouchableOpacity
                  onPress={() => {
                    console.log('✅✅✅ SUBMIT BUTTON PRESSED - ChatInput ✅✅✅');
                    onStopRecording();
                  }}
                  style={styles.submitRecordingButton}
                  activeOpacity={0.7}
                  hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                  accessible={true}
                  accessibilityLabel="Submit recording"
                  accessibilityRole="button"
                  pointerEvents="auto"
                >
                  <Check size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>
            )}
            
            {!isRecording && (
              <View style={styles.inputButtonsContainer}>
                {inputLineCount >= 5 && (
                  <TouchableOpacity 
                    onPress={toggleFullscreenInput}
                    style={styles.expandButton}
                    activeOpacity={0.7}
                  >
                    <Expand size={18} color="#6b7280" />
                  </TouchableOpacity>
                )}
                {inputText.trim() ? (
                  <TouchableOpacity 
                    onPress={() => onSend()}
                    style={styles.sendButton}
                    activeOpacity={0.7}
                  >
                    <ArrowUp size={24} color="#ffffff" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    onPressIn={onMicPressIn}
                    onPressOut={onMicPressOut}
                    style={styles.micButton}
                    activeOpacity={0.7}
                  >
                    <Mic size={26} color="#334155" />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
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
              <X size={24} color="#6b7280" />
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
  placeholderTextColor="#94a3b8"
  multiline
  style={styles.fullscreenTextInput}  // ✅ use fullscreen style
  onContentSizeChange={(e) =>
    setInputHeight(e.nativeEvent.contentSize.height)
  }
/>
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaWrapper>
      </Modal>
    </>
  );
};

export default ChatInput;