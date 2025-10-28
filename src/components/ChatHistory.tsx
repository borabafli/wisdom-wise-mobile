import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Modal, Alert, Platform } from 'react-native';
import { SafeAreaWrapper } from './SafeAreaWrapper';
import { X, MessageCircle, Clock, Trash2, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { storageService } from '../services/storageService';
import { chatHistoryStyles as styles } from '../styles/components/ChatHistory.styles';
import SessionDetailModal from './SessionDetailModal';
import { Image } from 'expo-image';

const { width, height } = Dimensions.get('window');

const modalPresentationStyle = Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen';

interface ChatHistoryProps {
  visible: boolean;
  onClose: () => void;
  onOpenSession?: (sessionId: string) => void;
}

interface HistorySession {
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
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ visible, onClose, onOpenSession }) => {
  const [sessions, setSessions] = useState<HistorySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<HistorySession | null>(null);
  const [showSessionDetail, setShowSessionDetail] = useState(false);

  useEffect(() => {
    if (visible) {
      loadChatHistory();
    }
  }, [visible]);

  const loadChatHistory = async () => {
    try {
      setLoading(true);
      const history = await storageService.getChatHistory();
      setSessions(history);
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };

    if (date.getFullYear() !== now.getFullYear()) {
      options.year = 'numeric';
    }
    return date.toLocaleDateString('en-US', options);
  };

  const confirmDeleteSession = (session: HistorySession) => {
    Alert.alert(
      "Delete Session",
      "Are you sure you want to delete this conversation? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteSession(session.id)
        }
      ]
    );
  };

  const deleteSession = async (sessionId: string) => {
    try {
      // Remove from storage
      await storageService.deleteSessionFromHistory(sessionId);
      
      // Remove from local state
      setSessions(prev => prev.filter(s => s.id !== sessionId));
    } catch (error) {
      console.error('Error deleting session:', error);
      Alert.alert('Error', 'Failed to delete session. Please try again.');
    }
  };

  const clearAllHistory = () => {
    Alert.alert(
      "Clear All History",
      "Are you sure you want to delete all saved conversations? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              await storageService.clearChatHistory();
              setSessions([]);
            } catch (error) {
              console.error('Error clearing history:', error);
              Alert.alert('Error', 'Failed to clear history. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleSessionPress = (session: HistorySession) => {
    setSelectedSession(session);
    setShowSessionDetail(true);
  };

  const handleCloseSessionDetail = () => {
    setShowSessionDetail(false);
    setSelectedSession(null);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle={modalPresentationStyle}>
      <SafeAreaWrapper style={styles.container}>


        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Chat History</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#2D3436" />
            </TouchableOpacity>
          </View>
          {sessions.length > 0 && (
            <TouchableOpacity onPress={clearAllHistory} style={styles.clearAllButton}>
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading your conversations...</Text>
            </View>
          ) : sessions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MessageCircle size={48} color="#6BB3A5" />
              <Text style={styles.emptyTitle}>No Saved Conversations</Text>
              <Text style={styles.emptySubtitle}>
                Your conversation history will appear here after you save sessions
              </Text>
            </View>
          ) : (
            <View style={styles.sessionsList}>
              {sessions.map((session) => (
                <View key={session.id} style={styles.sessionCard}>
                  <TouchableOpacity
                    style={styles.sessionContent}
                    onPress={() => handleSessionPress(session)}
                  >
                    <View style={styles.cardContentWrapper}>
                      <Image
                        source={require('../../assets/images/journal-icon-1.png')}
                        style={styles.chatIcon}
                        contentFit="contain"
                      />
                      <View style={styles.mainTextContent}>
                        <View style={styles.sessionHeader}>
                          <Text style={styles.sessionDate}>
                            {formatDate(session.metadata?.savedAt || session.createdAt)}
                          </Text>
                          <TouchableOpacity
                            onPress={() => confirmDeleteSession(session)}
                            style={styles.deleteButton}
                          >
                            <Trash2 size={16} color="rgba(239, 68, 68, 0.3)" />
                          </TouchableOpacity>
                        </View>
                        
                        <Text style={styles.sessionPreview} numberOfLines={2}>
                          {session.metadata?.firstMessage || 'No preview available'}
                        </Text>
                        
                        <View style={styles.sessionMeta}>
                          <View style={styles.metaItem}>
                            <MessageCircle size={12} color="#36657D" />
                            <Text style={styles.metaText}>
                              {session.metadata?.userMessageCount || 0} messages
                            </Text>
                          </View>
                          <View style={styles.metaItem}>
                            <Clock size={12} color="#36657D" />
                            <Text style={styles.metaText}>
                              {session.metadata?.duration || '< 1 min'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaWrapper>

      {/* Session Detail Modal */}
      <SessionDetailModal
        visible={showSessionDetail}
        onClose={handleCloseSessionDetail}
        session={selectedSession}
      />
    </Modal>
  );
};



export default ChatHistory;
