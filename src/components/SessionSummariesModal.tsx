import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { X, TrendingUp, Calendar, MessageCircle, ArrowRight, Filter } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { memoryService, Summary } from '../services/memoryService';
import { sessionSummariesStyles as styles } from '../styles/components/SessionSummaries.styles';

interface SessionSummariesModalProps {
  visible: boolean;
  onClose: () => void;
  initialSummaries?: Summary[];
  totalCount?: number;
}

export const SessionSummariesModal: React.FC<SessionSummariesModalProps> = ({
  visible,
  onClose,
  initialSummaries = [],
  totalCount = 0
}) => {
  const [summaries, setSummaries] = useState<Summary[]>(initialSummaries);
  const [filter, setFilter] = useState<'all' | 'session' | 'consolidated'>('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (visible && initialSummaries.length === 0) {
      loadAllSummaries();
    } else {
      setSummaries(initialSummaries);
    }
  }, [visible, initialSummaries]);

  const loadAllSummaries = async () => {
    setIsLoading(true);
    try {
      const allSummaries = await memoryService.getSummaries();
      setSummaries(allSummaries);
    } catch (error) {
      console.error('Error loading summaries:', error);
      Alert.alert('Error', 'Failed to load session summaries.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSummaries = summaries.filter(summary => {
    if (filter === 'all') return true;
    return summary.type === filter;
  });

  const renderHeader = () => (
    <LinearGradient
      colors={['#A8D5E8', '#5BA3B8']} // Primary light to primary blue-teal
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <TouchableOpacity
        style={styles.closeButton}
        onPress={onClose}
        activeOpacity={0.7}
      >
        <X size={24} color="#357A8A" />
      </TouchableOpacity>

      <View style={styles.headerContent}>
        <TrendingUp size={32} color="#FFFFFF" />
        <Text style={styles.headerTitle}>Session Summaries</Text>
        <Text style={styles.headerSubtitle}>
          {totalCount || summaries.length} sessions analyzed
        </Text>
      </View>
    </LinearGradient>
  );

  const renderFilterBar = () => (
    <View style={styles.filterBar}>
      <TouchableOpacity
        style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
        onPress={() => setFilter('all')}
        activeOpacity={0.7}
      >
        <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
          All ({summaries.length})
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.filterButton, filter === 'session' && styles.filterButtonActive]}
        onPress={() => setFilter('session')}
        activeOpacity={0.7}
      >
        <Text style={[styles.filterText, filter === 'session' && styles.filterTextActive]}>
          Individual ({summaries.filter(s => s.type === 'session').length})
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.filterButton, filter === 'consolidated' && styles.filterButtonActive]}
        onPress={() => setFilter('consolidated')}
        activeOpacity={0.7}
      >
        <Text style={[styles.filterText, filter === 'consolidated' && styles.filterTextActive]}>
          Themes ({summaries.filter(s => s.type === 'consolidated').length})
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSummaryCard = (summary: Summary, index: number) => (
    <View key={summary.id} style={styles.summaryCard}>
      <View style={styles.summaryHeader}>
        <View style={styles.summaryHeaderLeft}>
          <View style={[
            styles.typeBadge,
            summary.type === 'consolidated' ? styles.typeBadgeConsolidated : styles.typeBadgeSession
          ]}>
            <Text style={[
              styles.typeBadgeText,
              summary.type === 'consolidated' ? styles.typeBadgeTextConsolidated : styles.typeBadgeTextSession
            ]}>
              {summary.type === 'consolidated' ? 'Consolidated' : 'Session'}
            </Text>
          </View>
          
          <Text style={styles.summaryTitle}>
            {summary.type === 'consolidated' 
              ? 'Therapeutic Themes'
              : `Session ${summaries.filter(s => s.type === 'session').length - index}`
            }
          </Text>
        </View>
        
        <View style={styles.summaryMeta}>
          <View style={styles.metaItem}>
            <Calendar size={14} color="#6b7280" />
            <Text style={styles.metaText}>
              {new Date(summary.date).toLocaleDateString()}
            </Text>
          </View>
          
          <View style={styles.metaItem}>
            <MessageCircle size={14} color="#6b7280" />
            <Text style={styles.metaText}>
              {summary.messageCount} messages
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.summaryContent}>
        {summary.text}
      </Text>

      {summary.type === 'consolidated' && summary.sessionIds && (
        <View style={styles.consolidatedInfo}>
          <Text style={styles.consolidatedInfoText}>
            Based on {summary.sessionIds.length} sessions
          </Text>
        </View>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <TrendingUp size={48} color="#9ca3af" />
      <Text style={styles.emptyStateTitle}>No Session Summaries</Text>
      <Text style={styles.emptyStateText}>
        Continue having conversations and summaries will appear here to track your therapeutic journey.
      </Text>
    </View>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading summaries...</Text>
        </View>
      );
    }

    if (filteredSummaries.length === 0) {
      return renderEmptyState();
    }

    return (
      <ScrollView style={styles.summariesList} showsVerticalScrollIndicator={false}>
        {filteredSummaries.map((summary, index) => renderSummaryCard(summary, index))}
      </ScrollView>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {renderHeader()}
        {renderFilterBar()}
        {renderContent()}
      </View>
    </Modal>
  );
};