import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, MessageCircle, Clock, Trash2, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { storageService } from '../services/storageService';

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

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
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
                      onPress={() => {
                        // For now, just show info. Later we could restore the session
                        Alert.alert(
                          "Session Info",
                          `This conversation had ${session.metadata?.userMessageCount || 0} messages and lasted ${session.metadata?.duration || '< 1 min'}.\n\nFeature to restore sessions coming soon!`
                        );
                      }}
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
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.6)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  closeButton: {
    padding: 8,
  },
  clearAllButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  clearAllText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 32,
  },
  sessionsList: {
    paddingVertical: 24,
  },
  sessionCard: {
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionGradient: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(191, 219, 254, 0.4)',
  },
  sessionContent: {
    padding: 20,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sessionDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3b82f6',
    flex: 1,
    marginLeft: 8,
  },
  deleteButton: {
    padding: 4,
  },
  sessionPreview: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 12,
  },
  sessionMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default ChatHistory;