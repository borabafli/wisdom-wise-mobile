import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Modal, Text, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Mic, ArrowUp, Expand, X, Check } from 'lucide-react-native';
import SoundWaveAnimation from '../SoundWaveAnimation';
import { SafeAreaWrapper } from '../SafeAreaWrapper';
import { chatInterfaceStyles as styles } from '../../styles/components/ChatInterface.styles';

interface ChatInputProps {
  inputText: string;
  onInputTextChange: (text: string) => void;
  onSend: (text?: string) => void;
  isRecording: boolean;
  audioLevels: number[];
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
  audioLevels,
  partialTranscript,
  onMicPressIn,
  onMicPressOut,
  onStopRecording,
  onCancelRecording,
}) => {
  const [isFullscreenInput, setIsFullscreenInput] = useState(false);
  
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
      <View style={styles.inputContainer}>
        <View style={styles.inputCard}>
          <View style={styles.inputRow}>
            {!isRecording ? (
              <TextInput
                value={inputText}
                onChangeText={handleInputTextChange}
                placeholder="Type or speak..."
                placeholderTextColor="#94a3b8"
                multiline
                style={[
                  styles.textInput,
                  {
                    height: Math.min(Math.max(48, inputLineCount * 22), 9 * 22),
                  }
                ]}
                editable={true}
                allowFontScaling={false}
                selectionColor="#3b82f6"
              />
            ) : (
              <View style={styles.waveInInputContainer}>
                <SoundWaveAnimation 
                  isRecording={isRecording} 
                  audioLevels={audioLevels} 
                />
              </View>
            )}
            
            {!isRecording ? (
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
                    <Mic size={26} color="#6b7280" />
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View style={styles.recordingActions}>
                <TouchableOpacity 
                  onPress={onCancelRecording}
                  style={styles.recordingButton}
                  activeOpacity={0.7}
                >
                  <X size={18} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={onStopRecording}
                  style={styles.recordingButton}
                  activeOpacity={0.7}
                >
                  <Check size={18} color="#1d4ed8" />
                </TouchableOpacity>
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