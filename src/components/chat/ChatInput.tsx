import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Modal, Text, Keyboard, TouchableWithoutFeedback, Platform } from 'react-native';
import { Mic, ArrowUp, Expand, X, Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RecordingWave } from '../RecordingWave';
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
  const [isFullscreenInput, setIsFullscreenInput] = useState(false);
  const insets = useSafeAreaInsets();
  
  // Count lines by splitting on newlines and adding 1
  const inputLineCount = Math.min(inputText.split('\n').length, 9);

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
      <View style={[styles.inputContainer, { paddingBottom: insets.bottom || 0 }]}>
        <View style={styles.inputCard}>
          <View style={styles.inputRow}>
            {!isRecording ? (
              <TextInput
                value={inputText}
                onChangeText={handleInputTextChange}
                placeholder={isTranscribing ? "Transcribing..." : "Type or speak..."}
                placeholderTextColor="#94a3b8"
                multiline
                style={[
                  styles.textInput,
                  {
                    height: Math.min(Math.max(40, inputLineCount * 22), 9 * 22),
                    textAlign: isTranscribing ? 'center' : 'left',
                  }
                ]}
                editable={!isTranscribing}
                allowFontScaling={false}
                selectionColor="#3b82f6"
              />
            ) : (
              /* Recording Interface: X button - Wave with Timer inside chatbox - Check button */
              <View style={styles.recordingInterfaceWithTimer}>
                {/* Cancel Button (X) - Left side, light filled */}
                <TouchableOpacity 
                  onPress={onCancelRecording}
                  style={styles.cancelButton}
                  activeOpacity={0.7}
                >
                  <X size={20} color="#ffffff" />
                </TouchableOpacity>

                {/* Wave and Timer Container - Center */}
                <View style={styles.waveWithTimerInside}>
                  <RecordingWave
                    audioLevel={audioLevel} // Use direct audio level
                    isRecording={isRecording}
                    variant="bars"
                    size="medium"
                    showTimer={true}
                  />
                </View>

                {/* Submit Button (Check) - Right side, filled like send button */}
                <TouchableOpacity 
                  onPress={onStopRecording}
                  style={styles.submitRecordingButton}
                  activeOpacity={0.7}
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
            <Text style={styles.fullscreenInputTitle}>Compose Message</Text>
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
                placeholder="Type your message here..."
                placeholderTextColor="#94a3b8"
                multiline
                style={styles.fullscreenTextInput}
                autoFocus
                textAlignVertical="top"
                selectionColor="#3b82f6"
              />
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaWrapper>
      </Modal>
    </>
  );
};

export default ChatInput;