import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { X, TrendingUp, Calendar, MessageCircle, ShieldCheck, Sparkles, Clock, Layers, Trash2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { memoryService, Summary } from '../services/memoryService';
import { storageService } from '../services/storageService';
import { sessionSummariesStyles as styles } from '../styles/components/SessionSummaries.styles';

interface SessionSummariesModalProps {
  visible: boolean;
  onClose: () => void;
  initialSummaries?: Summary[];
  totalCount?: number;
  onDelete?: (summaryId: string) => void;
}

export const SessionSummariesModal: React.FC<SessionSummariesModalProps> = ({
  visible,
  onClose,
  initialSummaries = [],
  totalCount = 0,
  onDelete
}) => {
  const { t } = useTranslation();
  const [summaries, setSummaries] = useState<Summary[]>(initialSummaries);
  const [filter, setFilter] = useState<'all' | 'session' | 'consolidated'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    if (visible && initialSummaries.length === 0) {
      loadAllSummaries();
    } else {
      setSummaries(initialSummaries);
    }
  }, [visible, initialSummaries]);

  useEffect(() => {
    let isMounted = true;

    const fetchName = async () => {
      try {
        const name = await storageService.getFirstName();
        if (isMounted) {
          setFirstName(name);
        }
      } catch (error) {
        if (isMounted) {
          setFirstName('Friend');
        }
      }
    };

    if (visible) {
      fetchName();
    }

    return () => {
      isMounted = false;
    };
  }, [visible]);

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

  const sessionSummariesCount = useMemo(
    () => summaries.filter(summary => summary.type === 'session').length,
    [summaries]
  );

  const consolidatedSummariesCount = useMemo(
    () => summaries.filter(summary => summary.type === 'consolidated').length,
    [summaries]
  );

  const sessionOrderMap = useMemo(() => {
    const sessionOnly = summaries.filter(summary => summary.type === 'session');
    const reversed = [...sessionOnly].reverse();
    return new Map(reversed.map((summary, index) => [summary.id, index + 1]));
  }, [summaries]);

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
        <Text style={styles.headerTitle}>{t('insights.sessionSummaries.title')}</Text>
        <Text style={styles.headerSubtitle}>
          {t('insights.sessionSummaries.analyzedCount', {
            count: totalCount || summaries.length
          })}
        </Text>
      </View>
    </LinearGradient>
  );

  const renderInfoSection = () => (
    <View style={styles.infoContainer}>
      <View style={styles.infoHeader}>
        <ShieldCheck size={18} color="#1E3A5F" />
        <Text style={styles.infoTitle}>{t('insights.sessionSummaries.infoCard.title')}</Text>
      </View>

      <Text style={styles.infoDescription}>
        {t('insights.sessionSummaries.infoCard.body', {
          name: firstName || 'Friend'
        })}
      </Text>

      <View style={styles.infoMetaRow}>
        <View style={styles.infoMetaPill}>
          <Clock size={14} color="#1E3A5F" />
          <Text style={styles.infoMetaText}>
            {t('insights.sessionSummaries.infoCard.meta.timing')}
          </Text>
        </View>
        <View style={styles.infoMetaPill}>
          <ShieldCheck size={14} color="#1E3A5F" />
          <Text style={styles.infoMetaText}>
            {t('insights.sessionSummaries.infoCard.meta.storage')}
          </Text>
        </View>
        <View style={styles.infoMetaPill}>
          <Layers size={14} color="#1E3A5F" />
          <Text style={styles.infoMetaText}>
            {t('insights.sessionSummaries.infoCard.meta.consolidated')}
          </Text>
        </View>
      </View>

      <View style={styles.infoFooter}>
        <Sparkles size={14} color="#C2410C" />
        <Text style={styles.infoFooterText}>
          {t('insights.sessionSummaries.infoCard.highlight')}
        </Text>
      </View>
    </View>
  );

  const renderFilterBar = () => (
    <View style={styles.filterBar}>
      <TouchableOpacity
        style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
        onPress={() => setFilter('all')}
        activeOpacity={0.7}
      >
        <Text
          style={[styles.filterText, filter === 'all' && styles.filterTextActive]}
          numberOfLines={1}
        >
          {t('insights.sessionSummaries.filters.all', { count: summaries.length })}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.filterButton, filter === 'session' && styles.filterButtonActive]}
        onPress={() => setFilter('session')}
        activeOpacity={0.7}
      >
        <Text
          style={[styles.filterText, filter === 'session' && styles.filterTextActive]}
          numberOfLines={1}
        >
          {t('insights.sessionSummaries.filters.sessions', { count: sessionSummariesCount })}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.filterButton, filter === 'consolidated' && styles.filterButtonActive]}
        onPress={() => setFilter('consolidated')}
        activeOpacity={0.7}
      >
        <Text
          style={[styles.filterText, filter === 'consolidated' && styles.filterTextActive]}
          numberOfLines={1}
        >
          {t('insights.sessionSummaries.filters.themes', { count: consolidatedSummariesCount })}
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
              {summary.type === 'consolidated'
                ? t('insights.sessionSummaries.badges.consolidated')
                : t('insights.sessionSummaries.badges.session')}
            </Text>
          </View>

          <Text style={styles.summaryTitle}>
            {summary.type === 'consolidated'
              ? t('insights.sessionSummaries.themesTitle')
              : t('insights.sessionSummaries.sessionTitle', {
                  number: sessionOrderMap.get(summary.id) || Math.max(sessionSummariesCount - index, 1)
                })
            }
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {onDelete && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onDelete(summary.id);
              }}
              style={{ padding: 4 }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Trash2 size={14} color="#d97706" opacity={0.6} />
            </TouchableOpacity>
          )}
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
      </View>

      <Text style={styles.summaryContent}>
        {summary.text}
      </Text>

      {summary.type === 'consolidated' && summary.sessionIds && (
        <View style={styles.consolidatedInfo}>
          <Text style={styles.consolidatedInfoText}>
            {t('insights.sessionSummaries.consolidatedInfo', {
              count: summary.sessionIds.length
            })}
          </Text>
        </View>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <TrendingUp size={48} color="#9ca3af" />
      <Text style={styles.emptyStateTitle}>{t('insights.sessionSummaries.emptyState.title')}</Text>
      <Text style={styles.emptyStateText}>
        {t('insights.sessionSummaries.emptyState.description')}
      </Text>
    </View>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#357A8A" />
          <Text style={styles.loadingText}>{t('insights.sessionSummaries.loading')}</Text>
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
        {renderInfoSection()}
        {renderFilterBar()}
        {renderContent()}
      </View>
    </Modal>
  );
};