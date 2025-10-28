import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  Alert,
  RefreshControl,
  ImageBackground,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { StatusBar } from 'expo-status-bar';
import { Plus, Calendar, Search, Trash2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { journalScreenStyles as styles } from '../styles/components/JournalScreen.styles';
import { JournalEntry } from '../services/journalStorageService';
import JournalStorageService from '../services/journalStorageService';
import JournalPromptService from '../services/journalPromptService';
import DailyPromptCard from '../components/DailyPromptCard';
import { useFocusEffect } from '@react-navigation/native';

interface JournalScreenProps {
  navigation: any;
}

interface SwipablePromptCardProps {
  prompts: string[];
  onPromptSelect: (prompt: string) => void;
}

const SwipablePromptCard: React.FC<SwipablePromptCardProps> = ({ prompts, onPromptSelect }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { width } = Dimensions.get('window');

  // Calculate card width with proper spacing for perfect centering
  const cardSpacing = 6; // minimal spacing between cards
  const sideMargin = 12; // minimal margin on sides for perfect centering
  const cardWidth = width - (sideMargin * 2); // Card width minus margins only
  const totalCardWidth = cardWidth + cardSpacing; // Total width including spacing

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / totalCardWidth);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.swipableContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled={false} // Disable paging to use custom snap behavior
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        contentContainerStyle={styles.promptsScrollContent}
        decelerationRate="fast"
        snapToInterval={totalCardWidth} // Snap to each card + spacing
        snapToAlignment="start"
      >
        {prompts.map((prompt, index) => (
          <View key={index} style={[styles.promptCardContainer, { width: totalCardWidth }]}>
            <ImageBackground
              source={require('../../assets/images/daily-journal-prompt-card.png')}
              style={styles.promptCard}
              imageStyle={styles.promptCardBackground}
              resizeMode="cover"
            >
              <TouchableOpacity
                style={styles.promptCardTouchable}
                onPress={() => onPromptSelect(prompt)}
                activeOpacity={0.8}
              >
                <View style={styles.promptCardContent}>
                  <View style={styles.promptTextContainer}>
                    <Text style={styles.promptCardText}>{prompt}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.promptCardButton}
                    onPress={() => onPromptSelect(prompt)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.promptCardButtonText}>{t('journal.startWriting')}</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </ImageBackground>
          </View>
        ))}
      </ScrollView>

      {/* Page indicator */}
      <View style={styles.pageIndicator}>
        {prompts.map((_, index) => (
          <View
            key={index}
            style={[
              styles.pageIndicatorDot,
              currentIndex === index && styles.pageIndicatorDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

interface JournalEntryCardProps {
  entry: JournalEntry;
  onPress: () => void;
  onDelete: () => void;
  entryNumber: number;
}

const JournalEntryCard: React.FC<JournalEntryCardProps> = ({ entry, onPress, onDelete, entryNumber }) => {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };

    if (date.getFullYear() !== now.getFullYear()) {
      options.year = 'numeric';
    }
    return date.toLocaleDateString('en-US', options);
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <TouchableOpacity style={styles.entryCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardContentWrapper}>
        <Image
          source={require('../../assets/images/journal-icon-1.png')}
          style={styles.journalIcon}
          contentFit="contain"
        />
        <View style={styles.mainTextContent}>
          <View style={styles.entryCardHeader}>
            <Text style={styles.entryNumber}>{entryNumber}.</Text>
            <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
          </View>

          <Text style={styles.entryPrompt} numberOfLines={2}>
            {entry.initialPrompt}
          </Text>
        </View>
      </View>

      <Text style={styles.entrySummary} numberOfLines={3}>
        {truncateText(entry.summary)}
      </Text>

      {entry.insights.length > 0 && (
        <View style={styles.insightsPreview}>
          <Text style={styles.insightsLabel}>{t('journal.keyInsights')}</Text>
          <View style={styles.insightsChipContainer}>
            {entry.insights.map((insight, index) => (
              <View key={index} style={styles.insightsChip}>
                <Text style={styles.insightsChipText}>{insight}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {entry.isPolished && (
        <View style={styles.polishedBadge}>
          <Text style={styles.polishedBadgeText}>{t('journal.polished')}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const JournalScreen: React.FC<JournalScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [todayPrompts, setTodayPrompts] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      setLoading(true);

      // Load journal entries
      const entries = await JournalStorageService.getAllJournalEntries();
      setJournalEntries(entries);

      // Load today's prompts
      const prompts = await JournalPromptService.getTodaysPrompts();
      const promptTexts = prompts.map(p => p.text);
      setTodayPrompts(promptTexts);
    } catch (error) {
      console.error('Error loading journal data:', error);
      Alert.alert(t('common.error'), t('journal.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handlePromptSelect = (prompt: string) => {
    navigation.navigate('GuidedJournal', { initialPrompt: prompt });
  };

  const handleEntryPress = (entry: JournalEntry) => {
    navigation.navigate('JournalEntryDetail', { entry });
  };

  const handleDeleteEntry = async (entryId: string) => {
    Alert.alert(
      t('journal.deleteEntry'),
      t('journal.deleteEntryConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await JournalStorageService.deleteJournalEntry(entryId);
              setJournalEntries(prev => prev.filter(entry => entry.id !== entryId));
            } catch (error) {
              console.error('Error deleting entry:', error);
              Alert.alert(t('common.error'), t('journal.failedToDelete'));
            }
          },
        },
      ]
    );
  };

  const renderEntryItem = ({ item, index }: { item: JournalEntry; index: number }) => (
    <JournalEntryCard
      entry={item}
      onPress={() => handleEntryPress(item)}
      onDelete={() => handleDeleteEntry(item.id)}
      entryNumber={journalEntries.length - index}
    />
  );

  if (loading) {
    return (
      <SafeAreaWrapper style={styles.container}>
        <StatusBar style="dark" backgroundColor="#e9eff1" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t('journal.loadingJournal')}</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper style={styles.container}>
      <StatusBar style="dark" backgroundColor="transparent" translucent />

      {/* Persistent Solid Background - Same as HomeScreen */}
      <View
        style={[styles.backgroundGradient, { backgroundColor: '#e9eff1' }]}
        pointerEvents="none"
      />

      <FlatList
        data={journalEntries}
        renderItem={renderEntryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <View style={styles.headerTitleContainer}>
                  <Image
                    source={require('../../assets/new-design/Turtle Hero Section/journal-hero.png')}
                    style={styles.headerTurtleIcon}
                    contentFit="contain"
                  />
                  <View style={styles.titleAndSubtitleContainer}>
                    <Text style={styles.headerTitle}>{t('navigation.journal')}</Text>
                    <Text style={styles.headerSubtitle}>📝 For your thoughts</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Swipable Prompt Cards */}
            {todayPrompts.length > 0 && (
              <View style={styles.promptsSection}>
                <Text style={styles.sectionTitle}>{t('journal.writingPrompts')}</Text>
                <SwipablePromptCard
                  prompts={todayPrompts}
                  onPromptSelect={handlePromptSelect}
                />
              </View>
            )}

            {/* Entries Section Header */}
            {journalEntries.length > 0 && (
              <View style={styles.entriesSection}>
                <Text style={styles.sectionTitle}>{t('journal.yourEntries')}</Text>
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Calendar size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>{t('journal.noEntriesTitle')}</Text>
            <Text style={styles.emptyText}>
              {t('journal.noEntriesText')}
            </Text>
          </View>
        }
      />
    </SafeAreaWrapper>
  );
};

export default JournalScreen;
