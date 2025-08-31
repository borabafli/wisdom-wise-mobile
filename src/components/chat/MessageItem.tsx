import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useFonts, Caveat_400Regular } from '@expo-google-fonts/caveat';
import { Volume2, VolumeX, Copy } from 'lucide-react-native';

import { Message } from '../../services/storageService';
import { colors } from '../../styles/tokens';
import { chatInterfaceStyles as styles } from '../../styles/components/ChatInterface.styles';

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
  const [fontsLoaded] = useFonts({
    Caveat_400Regular,
  });

  // Enhanced message content renderer with rich formatting
  const renderFormattedContent = (content: string, isWelcome = false) => {
    const textStyle = isWelcome ? styles.welcomeMessageText : styles.systemMessageText;
    // Split by lines first, then process each line
    const lines = content.split('\n');
    
    return lines.map((line, lineIndex) => {
      if (!line.trim()) {
        return <View key={lineIndex} style={{ height: 8 }} />;
      }
      
      // Check for titles (lines that start with # or are all caps)
      if (line.startsWith('#') || (line.length > 3 && line === line.toUpperCase() && line.length < 50)) {
        const titleText = line.startsWith('#') ? line.replace(/^#+\s*/, '') : line;
        return (
          <View key={lineIndex} style={{ marginVertical: 8 }}>
            <Text style={[textStyle, { 
              fontSize: 18, 
              fontWeight: '700', 
              color: '#1e293b',
              textAlign: 'center'
            }]}>
              {titleText}
            </Text>
          </View>
        );
      }
      
      // Check for bold text with **
      if (line.includes('**')) {
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <View key={lineIndex} style={{ marginVertical: 2 }}>
            <Text style={textStyle}>
              {parts.map((part, partIndex) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  const boldText = part.replace(/\*\*/g, '');
                  return (
                    <Text key={partIndex} style={{ fontWeight: '700', color: '#1e293b' }}>
                      {boldText}
                    </Text>
                  );
                }
                return part;
              })}
            </Text>
          </View>
        );
      }
      
      // Check for italic text with * (but not **)
      if (line.includes('*') && !line.includes('**')) {
        const parts = line.split(/(\*[^*]+\*)/g);
        return (
          <View key={lineIndex} style={{ marginVertical: 2 }}>
            <Text style={textStyle}>
              {parts.map((part, partIndex) => {
                if (part.startsWith('*') && part.endsWith('*')) {
                  const italicText = part.replace(/\*/g, '');
                  return (
                    <Text key={partIndex} style={{ fontStyle: 'italic', color: '#374151' }}>
                      {italicText}
                    </Text>
                  );
                }
                return part;
              })}
            </Text>
          </View>
        );
      }
      
      // Check for bullet points
      if (line.startsWith('• ')) {
        const text = line.replace(/^• /, '');
        return (
          <View key={lineIndex} style={{ flexDirection: 'row', alignItems: 'flex-start', marginVertical: 3 }}>
            <View style={{ 
              width: 6, 
              height: 6, 
              borderRadius: 3, 
              backgroundColor: '#3b82f6', 
              marginTop: 8, 
              marginRight: 12 
            }} />
            <Text style={[textStyle, { flex: 1 }]}>
              {text}
            </Text>
          </View>
        );
      }
      
      // Check for numbered lists
      if (/^\d+\. /.test(line)) {
        const match = line.match(/^(\d+\.) (.+)$/);
        if (match) {
          return (
            <View key={lineIndex} style={{ flexDirection: 'row', alignItems: 'flex-start', marginVertical: 3 }}>
              <Text style={[textStyle, { fontWeight: '600', color: '#3b82f6', marginRight: 8 }]}>
                {match[1]}
              </Text>
              <Text style={[textStyle, { flex: 1 }]}>
                {match[2]}
              </Text>
            </View>
          );
        }
      }
      
      // Check for emoji-heavy lines (treat as special formatting)
      const emojiCount = (line.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length;
      if (emojiCount > 2 && line.length < 100) {
        return (
          <View key={lineIndex} style={{ marginVertical: 4 }}>
            <Text style={[textStyle, { 
              fontSize: 16, 
              textAlign: 'center',
              lineHeight: 24
            }]}>
              {line}
            </Text>
          </View>
        );
      }
      
      // Regular text
      return (
        <Text key={lineIndex} style={[textStyle, { marginVertical: 2 }]}>
          {line}
        </Text>
      );
    });
  };

  // Clean AI message content by removing suggestion chips
  const cleanAIMessageContent = (content: string): string => {
    // Remove any trailing SUGGESTION_CHIPS: [ ... ] block if present
    return content.replace(/\s*SUGGESTION_CHIPS:\s*\[[\s\S]*?\]\s*$/gi, '').trim();
  };

  if (message.type === 'user') {
    return (
      <View style={styles.userMessageContainer}>
        <View style={styles.userMessageWrapper}>
          <LinearGradient
            colors={[...colors.gradients.messageUser]}
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
          <View style={turtleContainerStyle}>
            <Image 
              source={require('../../../assets/images/turtle-simple-3a.png')}
              style={turtleStyle}
              contentFit="cover"
            />
          </View>
          
          {/* Show Anu name for welcome messages */}
          {isWelcomeMessage && fontsLoaded && (
            <View style={styles.therapistNameContainer}>
              <Text style={styles.therapistGreeting}>Hey! I'm </Text>
              <Text style={styles.therapistName}>Anu</Text>
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
                renderFormattedContent(cleanAIMessageContent(typewriterText), isWelcomeMessage)
              ) : (
                // Show normal content
                renderFormattedContent(cleanAIMessageContent(message.content || message.text || 'Hello! I\'m here to listen and support you. 🌸'), isWelcomeMessage)
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
            onPress={() => onPromptSuggestion("Suggest something & guide me")}
            activeOpacity={0.8}
          >
            <Text style={styles.promptSuggestionText}>
              Suggest something & guide me
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default MessageItem;