import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useFonts, Caveat_400Regular } from '@expo-google-fonts/caveat';
import { Volume2, VolumeX, Copy } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { Message } from '../../services/storageService';
import { colors } from '../../styles/tokens';
import { chatInterfaceStyles as styles } from '../../styles/components/ChatInterface.styles';
import { useMessageFormatting } from '../../hooks/useMessageFormatting';

interface MessageItemProps {
  message: Message;
  isTypewriting: boolean;
  currentTypewriterMessage: Message | null;
  typewriterText: string;
  playingMessageId: string | null;
  ttsStatus: { isSpeaking: boolean; isPaused: boolean; currentSpeechId: string | null };
  onSkipTypewriter: () => void;
  onPlayTTS: (messageId: string, text: string) => void;
  onStopTTS: () => void;
  onCopyMessage: (content: string) => void;
  onPromptSuggestion: (text: string) => void;
  AnimatedTypingCursor: React.ComponentType;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isTypewriting,
  currentTypewriterMessage,
  typewriterText,
  playingMessageId,
  ttsStatus,
  onSkipTypewriter,
  onPlayTTS,
  onStopTTS,
  onCopyMessage,
  onPromptSuggestion,
  AnimatedTypingCursor,
}) => {
  const { t } = useTranslation();
  const [fontsLoaded] = useFonts({
    Caveat_400Regular,
  });

  const { formatMessageContent, cleanAIContent } = useMessageFormatting();

  if (message.type === 'user') {
    return (
      <View style={styles.userMessageContainer}>
        <View style={styles.userMessageWrapper}>
          <LinearGradient
            colors={['#C4E6E0', '#E5F1F0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.userMessageBubble}
          >
            <Text style={styles.userMessageText}>
              {message.text}
            </Text>
          </LinearGradient>
        </View>
      </View>
    );
  }

  const isWelcomeMessage = message.type === 'welcome';
  const turtleContainerStyle = isWelcomeMessage 
    ? styles.turtleAvatarContainer 
    : styles.turtleAvatarContainerSmall;
  const turtleStyle = isWelcomeMessage 
    ? styles.turtleAvatar 
    : styles.turtleAvatarSmall;
  const messageContainerStyle = isWelcomeMessage 
    ? styles.systemMessageContainer 
    : styles.systemMessageContainerSmall;
  const messageContentStyle = isWelcomeMessage 
    ? styles.systemMessageContent 
    : styles.systemMessageContentSmall;

  return (
    <View style={messageContainerStyle}>
      <View style={styles.systemMessageBubble}>
        <View style={messageContentStyle}>
          {/* Avatar and Name Section */}
          {isWelcomeMessage ? (
            // Large welcome layout - avatar on top, name below
            <View style={styles.avatarSection}>
              <View style={turtleContainerStyle}>
                <Image 
                  source={require('../../../assets/images/Teal watercolor single element/chat-background.png')}
                  style={turtleStyle}
                  contentFit="contain"
                />
              </View>
              {fontsLoaded && (
                <View style={styles.therapistNameContainer}>
                  <Text style={styles.therapistGreeting}>Hey! I'm </Text>
                  <Text style={styles.therapistName}>Anu</Text>
                </View>
              )}
            </View>
          ) : (
            // Small layout - avatar and name side by side
            <View style={styles.avatarRowSmall}>
              <View style={turtleContainerStyle}>
                <Image 
                  source={require('../../../assets/images/Teal watercolor single element/chat-background.png')}
                  style={turtleStyle}
                  contentFit="contain"
                />
              </View>
              {fontsLoaded && (
                <Text style={styles.therapistNameSmall}>Anu</Text>
              )}
            </View>
          )}
          
          <TouchableOpacity 
            style={isWelcomeMessage ? styles.welcomeMessageTextContainer : styles.systemMessageTextContainer}
            onPress={isTypewriting && currentTypewriterMessage?.id === message.id ? onSkipTypewriter : undefined}
            activeOpacity={isTypewriting && currentTypewriterMessage?.id === message.id ? 0.7 : 1}
          >
            <View>
              {isTypewriting && currentTypewriterMessage?.id === message.id ? (
                // Show typewriter text when animation is active for this message
                formatMessageContent(
                  typewriterText, 
                  isWelcomeMessage ? styles.welcomeMessageText : styles.systemMessageText,
                  isWelcomeMessage
                )
              ) : (
                // Show normal content
                formatMessageContent(
                  message.content || message.text || 'Hello! I\'m here to listen and support you. 🌸',
                  isWelcomeMessage ? styles.welcomeMessageText : styles.systemMessageText,
                  isWelcomeMessage
                )
              )}
              {/* Typing cursor for typewriter animation */}
              {isTypewriting && currentTypewriterMessage?.id === message.id && (
                <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                  <AnimatedTypingCursor />
                  <Text style={{ fontSize: 11, color: '#6b7280', marginLeft: 8, opacity: 0.7 }}>
                    tap to skip
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Message Action Buttons - Only show for non-welcome messages */}
        {!isWelcomeMessage && (
          <View style={styles.messageActions}>
            {playingMessageId === message.id && ttsStatus.isSpeaking ? (
              <TouchableOpacity
                onPress={onStopTTS}
                style={styles.iconButton}
                activeOpacity={0.7}
              >
                <VolumeX size={16} color="#6b7280" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => onPlayTTS(message.id, message.content || message.text || '')}
                style={styles.iconButton}
                activeOpacity={0.7}
              >
                <Volume2 size={16} color="#6b7280" />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              onPress={() => onCopyMessage(message.content || message.text || '')}
              style={styles.iconButton}
              activeOpacity={0.7}
            >
              <Copy size={16} color="#6b7280" />
            </TouchableOpacity>
          </View>
        )}
        
        {/* "or" divider for welcome messages */}
        {isWelcomeMessage && (
          <View style={styles.orDividerContainer}>
            <Text style={styles.orText}>or</Text>
          </View>
        )}
        
        {/* Prompt Suggestion Card - Only for welcome messages */}
        {isWelcomeMessage && (
          <TouchableOpacity
            style={styles.promptSuggestionCard}
            onPress={() => onPromptSuggestion(t('chat.promptSuggestion'))}
            activeOpacity={0.8}
          >
            <Text style={styles.promptSuggestionText}>
              {t('chat.promptSuggestion')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default MessageItem;