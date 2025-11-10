import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Dimensions, Platform } from 'react-native';
import { SafeAreaWrapper } from './SafeAreaWrapper';
import { X, MessageCircle, Clock, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { sessionDetailModalStyles as styles } from '../styles/components/SessionDetailModal.styles';

const { width, height } = Dimensions.get('window');

const detailModalPresentationStyle = Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen';

// Simple markdown processing to clean up AI responses
const cleanMarkdownText = (text: string): string => {
  if (!text) return '';
  
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown **text**
    .replace(/\*(.*?)\*/g, '$1')     // Remove italic markdown *text*
    .replace(/__(.*?)__/g, '$1')     // Remove underline markdown __text__
    .replace(/_(.*?)_/g, '$1')       // Remove italic markdown _text_
    .trim();
};

// Read-only message component for viewing saved conversations
const ReadOnlyMessage: React.FC<{ message: any }> = ({ message }) => {
  if (message.type === 'user') {
    return (
      <View style={styles.userMessageContainer}>
        <View style={styles.userMessageBubble}>
          <Text style={styles.userMessageText}>
            {message.text || message.content}
          </Text>
          <Text style={styles.messageTimestamp}>{message.timestamp}</Text>
        </View>
      </View>
    );
  }

  if (message.type === 'system' || message.type === 'welcome') {
    const cleanedText = cleanMarkdownText(message.content || message.text);
    return (
      <View style={styles.aiMessageContainer}>
        <View style={styles.aiMessageContent}>
          <LinearGradient
            colors={['#F8FCFC', '#E8F4F1']}
            style={styles.aiMessageBubble}
          >
            <Text style={styles.aiMessageText}>
              {cleanedText}
            </Text>
            <Text style={styles.messageTimestamp}>{message.timestamp}</Text>
          </LinearGradient>
        </View>
      </View>
    );
  }

  if (message.type === 'exercise' || message.type === 'exercise-intro') {
    const cleanedText = cleanMarkdownText(message.content || message.text);
    return (
      <View style={styles.exerciseMessageContainer}>
        <LinearGradient
          colors={['#E8F4F1', '#F8FCFC']}
          style={styles.exerciseMessageBubble}
        >
          {message.title && (
            <Text style={styles.exerciseTitle}>
              {message.title}
            </Text>
          )}
          <Text style={styles.exerciseText}>
            {cleanedText}
          </Text>
          <Text style={styles.messageTimestamp}>{message.timestamp}</Text>
        </LinearGradient>
      </View>
    );
  }

  return null;
};

interface SessionDetailModalProps {
  visible: boolean;
  onClose: () => void;
  session: {
    id: string;
    messages: any[];
    createdAt: string;
    updatedAt: string;
    metadata?: {
      messageCount: number;
      userMessageCount: number;
      systemMessageCount: number;
      duration: string;
      firstMessage: string;
      savedAt: string;
    };
  } | null;
}

const SessionDetailModal: React.FC<SessionDetailModalProps> = ({ visible, onClose, session }) => {
  const scrollViewRef = useRef<ScrollView>(null);

  if (!session) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const userMessages = session.messages.filter(msg => msg.type === 'user');
  const conversationDate = session.metadata?.savedAt || session.createdAt;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle={detailModalPresentationStyle}>
      <SafeAreaWrapper style={styles.container}>
        <LinearGradient
          colors={['#F8FCFC', '#E8F4F1']}
          style={styles.backgroundGradient}
        />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Conversation Details</Text>
              <Text style={styles.headerSubtitle}>
                {formatDate(conversationDate)}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#2D3436" />
            </TouchableOpacity>
          </View>

          {/* Session Metadata */}
          <View style={styles.metadataContainer}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.95)', 'rgba(232, 244, 241, 0.8)']}
              style={styles.metadataGradient}
            >
              <View style={styles.metadataContent}>
                <View style={styles.metadataRow}>
                  <View style={styles.metadataItem}>
                    <Calendar size={16} color="#4A9B8E" />
                    <Text style={styles.metadataText}>
                      {formatTime(conversationDate)}
                    </Text>
                  </View>
                  <View style={styles.metadataItem}>
                    <MessageCircle size={16} color="#4A9B8E" />
                    <Text style={styles.metadataText}>
                      {session.metadata?.userMessageCount || userMessages.length} messages
                    </Text>
                  </View>
                  <View style={styles.metadataItem}>
                    <Clock size={16} color="#4A9B8E" />
                    <Text style={styles.metadataText}>
                      {session.metadata?.duration || '< 1 min'}
                    </Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Messages */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {session.messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MessageCircle size={48} color="#6BB3A5" />
              <Text style={styles.emptyTitle}>No Messages</Text>
              <Text style={styles.emptySubtitle}>
                This conversation doesn't contain any messages.
              </Text>
            </View>
          ) : (
            <View style={styles.messagesList}>
              {session.messages.map((message, index) => (
                <View key={message.id || index} style={styles.messageWrapper}>
                  <ReadOnlyMessage message={message} />
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Footer Note */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This is a saved conversation from your chat history
          </Text>
        </View>
      </SafeAreaWrapper>
    </Modal>
  );
};

export default SessionDetailModal;
