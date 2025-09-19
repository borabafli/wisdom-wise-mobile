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

interface JournalScreenProps {
  navigation: any;
}

interface SwipablePromptCardProps {
  prompts: string[];
  onPromptSelect: (prompt: string) => void;
}

const SwipablePromptCard: React.FC<SwipablePromptCardProps> = ({ prompts, onPromptSelect }) => {
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
                    <Text style={styles.promptCardButtonText}>Start Writing</Text>
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

const JournalEntryCard: React.FC<{
  entry: JournalEntry;
  onPress: () => void;
  onDelete: () => void;
}> = ({ entry, onPress, onDelete }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <TouchableOpacity style={styles.entryCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.entryCardHeader}>
        <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Trash2 size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <Text style={styles.entryPrompt} numberOfLines={2}>
        {entry.initialPrompt}
      </Text>

      <Text style={styles.entrySummary} numberOfLines={3}>
        {truncateText(entry.summary)}
      </Text>

      {entry.insights.length > 0 && (
        <View style={styles.insightsPreview}>
          <Text style={styles.insightsLabel}>Key Insights:</Text>
          <Text style={styles.insightsText} numberOfLines={2}>
            {entry.insights.join(' • ')}
          </Text>
        </View>
      )}

      {entry.isPolished && (
        <View style={styles.polishedBadge}>
          <Text style={styles.polishedBadgeText}>✨ Polished</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const JournalScreen: React.FC<JournalScreenProps> = ({ navigation }) => {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [todayPrompts, setTodayPrompts] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

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
      Alert.alert('Error', 'Failed to load journal data. Please try again.');
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
      'Delete Entry',
      'Are you sure you want to delete this journal entry? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await JournalStorageService.deleteJournalEntry(entryId);
              setJournalEntries(prev => prev.filter(entry => entry.id !== entryId));
            } catch (error) {
              console.error('Error deleting entry:', error);
              Alert.alert('Error', 'Failed to delete entry. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderEntryItem = ({ item }: { item: JournalEntry }) => (
    <JournalEntryCard
      entry={item}
      onPress={() => handleEntryPress(item)}
      onDelete={() => handleDeleteEntry(item.id)}
    />
  );

  if (loading) {
    return (
      <SafeAreaWrapper style={styles.container}>
        <StatusBar style="dark" backgroundColor="#F8FAFC" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your journal...</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper style={styles.container}>
      <StatusBar style="dark" backgroundColor="transparent" translucent />

      {/* Background Gradient - Same as ExerciseLibrary */}
      <LinearGradient
        colors={['rgb(216, 235, 243)', 'rgba(255, 255, 255, 1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.backgroundGradient}
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
                    <Text style={styles.headerTitle}>Journal</Text>
                    <Text style={styles.headerSubtitle}>📝 For your thoughts</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Swipable Prompt Cards */}
            {todayPrompts.length > 0 && (
              <View style={styles.promptsSection}>
                <Text style={styles.sectionTitle}>Writing Prompts</Text>
                <SwipablePromptCard
                  prompts={todayPrompts}
                  onPromptSelect={handlePromptSelect}
                />
              </View>
            )}

            {/* Entries Section Header */}
            {journalEntries.length > 0 && (
              <View style={styles.entriesSection}>
                <Text style={styles.sectionTitle}>Your Entries</Text>
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Calendar size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No journal entries yet</Text>
            <Text style={styles.emptyText}>
              Start your journaling journey by selecting a prompt above or create your own entry.
            </Text>
          </View>
        }
      />
    </SafeAreaWrapper>
  );
};

export default JournalScreen;