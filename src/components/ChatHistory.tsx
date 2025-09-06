import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Modal, Alert } from 'react-native';
import { SafeAreaWrapper } from './SafeAreaWrapper';
import { X, MessageCircle, Clock, Trash2, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { storageService } from '../services/storageService';
import { chatHistoryStyles as styles } from '../styles/components/ChatHistory.styles';
import SessionDetailModal from './SessionDetailModal';

const { width, height } = Dimensions.get('window');

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
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
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
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaWrapper style={styles.container}>
        <LinearGradient
          colors={['#f0f9ff', '#e0f2fe']}
          style={styles.backgroundGradient}
        />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Chat History</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#475569" />
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
              <MessageCircle size={48} color="#94a3b8" />
              <Text style={styles.emptyTitle}>No Saved Conversations</Text>
              <Text style={styles.emptySubtitle}>
                Your conversation history will appear here after you save sessions
              </Text>
            </View>
          ) : (
            <View style={styles.sessionsList}>
              {sessions.map((session) => (
                <View key={session.id} style={styles.sessionCard}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.9)', 'rgba(240, 249, 255, 0.8)']}
                    style={styles.sessionGradient}
                  >
                    <TouchableOpacity
                      style={styles.sessionContent}
                      onPress={() => handleSessionPress(session)}
                    >
                      <View style={styles.sessionInfo}>
                        <View style={styles.sessionHeader}>
                          <MessageCircle size={20} color="#3b82f6" />
                          <Text style={styles.sessionDate}>
                            {formatDate(session.metadata?.savedAt || session.createdAt)}
                          </Text>
                          <TouchableOpacity
                            onPress={() => confirmDeleteSession(session)}
                            style={styles.deleteButton}
                          >
                            <Trash2 size={16} color="#ef4444" />
                          </TouchableOpacity>
                        </View>
                        
                        <Text style={styles.sessionPreview} numberOfLines={2}>
                          {session.metadata?.firstMessage || 'No preview available'}
                        </Text>
                        
                        <View style={styles.sessionMeta}>
                          <View style={styles.metaItem}>
                            <MessageCircle size={12} color="#6b7280" />
                            <Text style={styles.metaText}>
                              {session.metadata?.userMessageCount || 0} messages
                            </Text>
                          </View>
                          <View style={styles.metaItem}>
                            <Clock size={12} color="#6b7280" />
                            <Text style={styles.metaText}>
                              {session.metadata?.duration || '< 1 min'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </LinearGradient>
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