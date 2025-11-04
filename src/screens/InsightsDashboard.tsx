import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, Alert, ImageBackground, Dimensions, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { CheckCircle2, ArrowRight, Plus, Trash2, X, Lightbulb, MessageCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useNavigationBarStyle, navigationBarConfigs } from '../hooks/useNavigationBarStyle';
import { insightService, ThoughtPattern } from '../services/insightService';
import { memoryService, Insight, Summary } from '../services/memoryService';
import { goalService, TherapyGoal } from '../services/goalService';
import { motivationalCardService, MotivationalData, MotivationalMessage } from '../services/motivationalCardService';
import { getShortConfidenceLabel } from '../utils/confidenceDisplay';
import { generateInsightPreview, getCategoryDisplayName } from '../utils/insightPreviewGenerator';
import ThinkingPatternsModal from '../components/ThinkingPatternsModal';
import ThinkingPatternReflectionsModal from '../components/ThinkingPatternReflectionsModal';
import { GoalDetailsModal } from '../components/GoalDetailsModal';
import { SessionSummariesModal } from '../components/SessionSummariesModal';
import { MoodInsightsCard } from '../components/MoodInsightsCard';
import { ValueCards } from '../components/ValueCards';
import { VisionInsightsCard } from '../components/VisionInsightsCard';
import { thinkingPatternsService, ThinkingPatternReflectionSummary } from '../services/thinkingPatternsService';
import { valuesService } from '../services/valuesService';
import { storageService } from '../services/storageService';
import { VisionDetailsModal } from '../components/VisionDetailsModal';
import { insightsDashboardStyles as styles } from '../styles/components/InsightsDashboard.styles';
import { ValuesReflectButton } from '../components/ReflectButton';
import { generateSampleMoodData } from '../utils/sampleMoodData';
import { generateSampleValuesData } from '../utils/sampleValuesData';
import { getTopExercises, ExerciseProgress } from '../utils/exercisePriority';
import streakService from '../services/streakService';
import { moodInsightsService, MoodInsight } from '../services/moodInsightsService';

interface InsightsDashboardProps {
  onInsightClick: (type: string, insight?: any) => void;
  onTherapyGoalsClick?: () => void;
  onExerciseClick?: (exercise?: any) => void;
}

const InsightsDashboard: React.FC<InsightsDashboardProps> = ({ onInsightClick, onTherapyGoalsClick, onExerciseClick }) => {
  const { t } = useTranslation();
  const { statusBarStyle } = useNavigationBarStyle(navigationBarConfigs.insightsDashboard);

  const [thinkingPatterns, setThinkingPatterns] = useState<ThoughtPattern[]>([]);
  const [thinkingPatternReflections, setThinkingPatternReflections] = useState<ThinkingPatternReflectionSummary[]>([]);
  const [memoryInsights, setMemoryInsights] = useState<Insight[]>([]);
  const [sessionSummaries, setSummaries] = useState<Summary[]>([]);
  const [activeGoals, setActiveGoals] = useState<TherapyGoal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<TherapyGoal | null>(null);
  const [memoryStats, setMemoryStats] = useState({
    totalInsights: 0,
    sessionSummaries: 0,
    consolidatedSummaries: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [patternsModalVisible, setPatternsModalVisible] = useState(false);
  const [thinkingPatternReflectionsModalVisible, setThinkingPatternReflectionsModalVisible] = useState(false);
  const [goalDetailsVisible, setGoalDetailsVisible] = useState(false);
  const [sessionSummariesVisible, setSessionSummariesVisible] = useState(false);
  const [visionDetailsVisible, setVisionDetailsVisible] = useState(false);
  const [expandedMemoryInsights, setExpandedMemoryInsights] = useState<Set<string>>(new Set());
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0);
  const [motivationalCard, setMotivationalCard] = useState<{
    message: MotivationalMessage;
    statsText: string;
    stats: Array<{ value: string; label: string }>;
    data: MotivationalData;
  } | null>(null);
  const [nextExercise, setNextExercise] = useState<any>(null);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [weeklyHighlights, setWeeklyHighlights] = useState<MoodInsight[]>([]);
  const [showDeeperInsightsExampleModal, setShowDeeperInsightsExampleModal] = useState(false);



  // Load data when screen comes into focus (fixes real-time updates issue)
  useFocusEffect(
    useCallback(() => {
      loadInsightData();
    }, [])
  );



  const loadInsightData = async () => {
    try {
      setIsLoading(true);
      const recentPatterns = await insightService.getRecentPatterns(10);
      console.log('[InsightsDashboard] Loaded thinking patterns:', recentPatterns.length, recentPatterns);
      setThinkingPatterns(recentPatterns);

      const reflectionSummaries = await thinkingPatternsService.getRecentReflections(10);
      setThinkingPatternReflections(reflectionSummaries);

      const insights = await memoryService.getInsights();
      setMemoryInsights(insights.slice(0, 10));

      const summaries = await memoryService.getSummaries();
      setSummaries(summaries.slice(0, 5));

      const memStats = await memoryService.getMemoryStats();
      if (memStats) {
        setMemoryStats({
          totalInsights: memStats.totalInsights,
          sessionSummaries: memStats.sessionSummaries,
          consolidatedSummaries: memStats.consolidatedSummaries
        });
      }

      const goals = await goalService.getActiveGoals();
      setActiveGoals(goals.slice(0, 2));

      const motivationalData = await motivationalCardService.getCompleteMotivationalCard();
      setMotivationalCard(motivationalData);

      const moodInsightsData = await moodInsightsService.generateMoodInsights();
      setWeeklyHighlights(moodInsightsData.highlights);

      const streak = await streakService.getStreak();
      setCurrentStreak(streak);

      // Get the first scheduled exercise
      const exerciseProgress: ExerciseProgress = {};
      const topExercises = getTopExercises(exerciseProgress, [], t);
      if (topExercises.length > 0) {
        setNextExercise(topExercises[0]);
      }
    } catch (error) {
      console.error('[InsightsDashboard] Error loading insight data:', error);
      setThinkingPatterns([]);
      setThinkingPatternReflections([]);
      setMemoryInsights([]);
      setSummaries([]);
      setActiveGoals([]);
      setMemoryStats({ totalInsights: 0, sessionSummaries: 0, consolidatedSummaries: 0 });
      setMotivationalCard(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateDummyInsights = async () => {
    try {
      setIsLoading(true);
      const dummyPatterns: ThoughtPattern[] = [
        {
          id: `dummy_${Date.now()}_1`,
          originalThought: 'I completely failed my presentation, everyone must think I\'m an idiot.',
          reframedThought: 'I wasn\'t as prepared as I wanted, but I got through it. It\'s a learning experience.',
          distortionTypes: ['All-or-Nothing Thinking', 'Mind Reading'],
          confidence: 0.9,
          timestamp: new Date().toISOString(),
          context: 'Work presentation',
          extractedFrom: { sessionId: 'dummy_session', messageId: 'dummy_message_1' },
        },
        {
          id: `dummy_${Date.now()}_2`,
          originalThought: 'I haven\'t heard back about the job, so I\'m definitely not going to get it. I\'m a failure.',
          reframedThought: 'The hiring process takes time. I will follow up next week and continue exploring other opportunities.',
          distortionTypes: ['Catastrophizing', 'Labeling'],
          confidence: 0.88,
          timestamp: new Date().toISOString(),
          context: 'Job application',
          extractedFrom: { sessionId: 'dummy_session', messageId: 'dummy_message_2' },
        },
      ];

      await storageService.saveSessionInsights('dummy_session', dummyPatterns);

      await loadInsightData();
      Alert.alert('Success', 'Dummy thought patterns have been generated.');
    } catch (error) {
      console.error('Error generating dummy patterns:', error);
      Alert.alert('Error', 'Could not generate dummy patterns.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateDummyMemoryInsights = async () => {
    try {
      setIsLoading(true);
      const dummyMemoryInsights: Insight[] = [
        {
          id: `mem_dummy_${Date.now()}_1`,
          category: 'automatic_thoughts',
          content: 'Frequently engages in all-or-nothing thinking, especially regarding personal achievements.',
          date: new Date().toISOString(),
          sourceMessageIds: ['dummy_msg_1', 'dummy_msg_2'],
          confidence: 0.95,
        },
        {
          id: `mem_dummy_${Date.now()}_2`,
          category: 'emotions',
          content: 'Experiences heightened anxiety in social situations, often leading to avoidance behaviors.',
          date: new Date().toISOString(),
          sourceMessageIds: ['dummy_msg_3', 'dummy_msg_4'],
          confidence: 0.88,
        },
        {
          id: `mem_dummy_${Date.now()}_3`,
          category: 'values_goals',
          content: 'Places a high value on personal growth and continuous learning, seeking new challenges.',
          date: new Date().toISOString(),
          sourceMessageIds: ['dummy_msg_5', 'dummy_msg_6'],
          confidence: 0.92,
        },
      ];

      for (const insight of dummyMemoryInsights) {
        await memoryService.saveInsight(insight);
      }

      await loadInsightData();
      Alert.alert('Success', 'Dummy memory insights have been generated.');
    } catch (error) {
      console.error('Error generating dummy memory insights:', error);
      Alert.alert('Error', 'Could not generate dummy memory insights.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMemoryInsightExpansion = (insightId: string) => {
    setExpandedMemoryInsights(prev => {
      const newSet = new Set(prev);
      if (newSet.has(insightId)) {
        newSet.delete(insightId);
      } else {
        newSet.add(insightId);
      }
      return newSet;
    });
  };

  const handleDeleteInsight = (insightId: string) => {
    Alert.alert(
      t('insights.deleteConfirm.title'),
      t('insights.deleteConfirm.message'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await memoryService.deleteInsight(insightId);
              setMemoryInsights(prev => prev.filter(i => i.id !== insightId));
            } catch (error) {
              console.error('Error deleting insight:', error);
            }
          }
        }
      ]
    );
  };

  const handleDeletePattern = (patternId: string) => {
    Alert.alert(
      t('insights.deleteConfirm.title'),
      t('insights.deleteConfirm.message'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await storageService.deleteThoughtPattern(patternId);
              setThinkingPatterns(prev => prev.filter(p => p.id !== patternId));
            } catch (error) {
              console.error('Error deleting pattern:', error);
            }
          }
        }
      ]
    );
  };

  const handleDeleteReflection = (reflectionId: string) => {
    Alert.alert(
      t('insights.deleteConfirm.title'),
      t('insights.deleteConfirm.message'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await thinkingPatternsService.deleteReflectionSummary(reflectionId);
              setThinkingPatternReflections(prev => prev.filter(r => r.id !== reflectionId));
            } catch (error) {
              console.error('Error deleting reflection:', error);
            }
          }
        }
      ]
    );
  };

  const handleDeleteSummary = (summaryId: string) => {
    Alert.alert(
      t('insights.deleteConfirm.title'),
      t('insights.deleteConfirm.message'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await memoryService.deleteSummary(summaryId);
              setSummaries(prev => prev.filter(s => s.id !== summaryId));
            } catch (error) {
              console.error('Error deleting summary:', error);
            }
          }
        }
      ]
    );
  };

  const handleDeleteValueReflection = (reflectionId: string) => {
    Alert.alert(
      t('insights.deleteConfirm.title'),
      t('insights.deleteConfirm.message'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await valuesService.deleteReflectionSummary(reflectionId);
              loadInsightData();
            } catch (error) {
              console.error('Error deleting value reflection:', error);
            }
          }
        }
      ]
    );
  };

  const handleDeleteValue = (valueId: string) => {
    Alert.alert(
      t('insights.deleteConfirm.title'),
      t('insights.deleteConfirm.message'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await valuesService.deleteValue(valueId);
              loadInsightData();
            } catch (error) {
              console.error('Error deleting value:', error);
            }
          }
        }
      ]
    );
  };

  // REMOVED: mockPatterns fallback - now showing empty state instead
  // Users will see the empty state with "Show Example" button when no patterns exist
  const displayPatterns = thinkingPatterns;
  console.log('[InsightsDashboard] Display patterns:', displayPatterns.length, displayPatterns);

  const handlePatternSwipeLeft = () => {
    if (currentPatternIndex < displayPatterns.length - 1) {
      setCurrentPatternIndex(currentPatternIndex + 1);
    }
  };

  const handlePatternSwipeRight = () => {
    if (currentPatternIndex > 0) {
      setCurrentPatternIndex(currentPatternIndex - 1);
    }
  };

  const journeyData = {
    sessionsCompleted: 3,
    exercisesCompleted: 7,
    streakDays: currentStreak,
    nextSuggestion: t('insights.mockData.journey.nextSuggestion') || 'mindfulness breathing',
    achievements: [
      t('insights.mockData.journey.achievements.firstSession') || 'First Session Completed',
      t('insights.mockData.journey.achievements.dailyStreak') || '5-Day Streak',
      t('insights.mockData.journey.achievements.breathingExercise') || 'Breathing Exercise'
    ].filter(Boolean)
  };

  // Helper functions for new UI
  const getDynamicFontSize = (text: string, maxFontSize: number = 18, minFontSize: number = 12, containerWidth: number = Dimensions.get('window').width / 2 - 32) => {
    const baseLength = 50; // Ideal length for maxFontSize
    const scalingFactor = 0.005; // How aggressively to reduce font size

    // Calculate a font size that scales down with length
    let fontSize = maxFontSize - (Math.max(0, text.length - baseLength) * scalingFactor);

    // Ensure font size is within min/max bounds
    fontSize = Math.max(minFontSize, Math.min(maxFontSize, fontSize));

    return fontSize;
  };

  const getPatternName = (patternType: string): string => {
    const patterns: Record<string, string> = {
      'All-or-Nothing Thinking': 'allOrNothing',
      'Catastrophizing': 'catastrophizing',
      'Mental Filter': 'mentalFilter',
      'Overgeneralization': 'overgeneralization',
      'Mind Reading': 'mindReading',
      'Fortune Telling': 'fortuneTelling',
      'Emotional Reasoning': 'emotionalReasoning',
      'Should Statements': 'shouldStatements',
      'Labeling': 'labeling',
      'Personalization': 'personalization',
      'Magnification': 'magnification',
      'Minimization': 'minimization'
    };
    const key = patterns[patternType];
    return key ? t(`insights.thinkingPatterns.${key}`) : t('insights.thinkingPatterns.thoughtPattern');
  };

  const getDistortionExplanation = (distortionType: string): string => {
    const patterns: Record<string, string> = {
      'All-or-Nothing Thinking': 'allOrNothing',
      'Catastrophizing': 'catastrophizing',
      'Mental Filter': 'mentalFilter',
      'Overgeneralization': 'overgeneralization',
      'Mind Reading': 'mindReading',
      'Fortune Telling': 'fortuneTelling',
      'Emotional Reasoning': 'emotionalReasoning',
      'Should Statements': 'shouldStatements',
      'Labeling': 'labeling',
      'Personalization': 'personalization',
      'Magnification': 'magnification',
      'Minimization': 'minimization'
    };
    const key = patterns[distortionType];
    return key ? t(`insights.thinkingPatterns.explanations.${key}`) : t('insights.thinkingPatterns.explanations.thoughtPattern');
  };

  const currentPattern = displayPatterns[currentPatternIndex];
  const memoryInsightCategories = [
    'Automatic Thoughts',
    'Emotional Patterns',
    'Behavioral Patterns',
    'Values & Goals',
    'Personal Strengths',
    'Life Context'
  ];

  // Example deeper insights data for the modal
  const exampleDeeperInsights: Insight[] = [
    {
      id: 'example_1',
      content: 'You frequently express worry about not being good enough, particularly in work situations. This pattern appears across multiple conversations where you discuss feeling inadequate despite positive feedback from others.',
      category: 'Automatic Thoughts',
      confidence: 0.85,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      sourceType: 'conversation',
      userId: 'example'
    },
    {
      id: 'example_2',
      content: 'There\'s a recurring theme of seeking validation from others before making decisions. You often mention feeling uncertain and needing reassurance, which may stem from a deeper fear of making mistakes.',
      category: 'Emotional Patterns',
      confidence: 0.78,
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      sourceType: 'conversation',
      userId: 'example'
    },
    {
      id: 'example_3',
      content: 'You\'ve shown remarkable resilience when facing setbacks. When discussing challenges, you naturally shift toward problem-solving and growth-oriented thinking, demonstrating a core strength in adaptability.',
      category: 'Personal Strengths',
      confidence: 0.92,
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
      sourceType: 'conversation',
      userId: 'example'
    }
  ];

  return (
    <SafeAreaWrapper style={styles.container}>
      <StatusBar style={statusBarStyle} backgroundColor="transparent" translucent />

      <View style={[styles.backgroundGradient, { backgroundColor: '#e9eff1' }]} pointerEvents="none" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerTitleContainer}>
              <Image
                source={require('../../assets/new-design/Turtle Hero Section/insights-hero.png')}
                style={styles.headerTurtleIcon}
                contentFit="contain"
              />
              <View style={styles.titleAndSubtitleContainer}>
                <Text style={styles.headerTitle}>{t('insights.title') || 'Insights'}</Text>
                <Text style={styles.headerSubtitle}>{t('insights.subtitle') || 'For your growth'}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          {/* Motivational Card - Daily Check-in */}
          <View style={styles.motivationalCard}>
            <LinearGradient
              colors={['#FDFEFF', '#F9FCFA', '#F5FAF7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.motivationalGradient}
            >
              <View style={styles.motivationalContent}>
                <Text style={styles.dailyCheckInTitle}>{t('insights.dailyCheckIn.title') || 'Daily Check-in'}</Text>
                <Text style={styles.dailyCheckInSubtitle}>{t('insights.dailyCheckIn.subtitle') || 'Keep the momentum going!'}</Text>

                <View style={styles.streakContainer}>
                  <View style={styles.streakIconContainer}>
                    <Image
                      source={require('../../assets/images/streak-icon.png')}
                      style={styles.streakIconImage}
                      contentFit="contain"
                    />
                    <Text style={styles.streakNumber}>{currentStreak === 0 ? 1 : currentStreak}</Text>
                  </View>
                </View>

                <Text style={styles.streakDayLabel}>{currentStreak === 0 ? 1 : currentStreak} {t('insights.dailyCheckIn.dayStreak')}</Text>
                <Text style={styles.lastActivityLabel}>{t('insights.dailyCheckIn.lastActivity') || 'Last activity'}: {t('insights.dailyCheckIn.today') || 'Today'}!</Text>

                <TouchableOpacity
                  style={styles.completeDailyTaskButton}
                  onPress={() => {
                    console.log('[InsightsDashboard] Complete Daily Task button pressed');
                    console.log('[InsightsDashboard] Next exercise:', nextExercise);
                    if (nextExercise && onExerciseClick) {
                      console.log('[InsightsDashboard] Calling onExerciseClick with:', nextExercise);
                      onExerciseClick(nextExercise);
                    } else {
                      console.log('[InsightsDashboard] No exercise or onExerciseClick not available');
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.completeDailyTaskButtonText}>
                    {t('insights.dailyCheckIn.completeTask') || 'Complete Daily Task'}
                  </Text>
                </TouchableOpacity>

                <Text style={styles.streakUpdatedLabel}>{t('insights.dailyCheckIn.streakUpdated') || 'Streak updated! Keep it up'}</Text>
              </View>
            </LinearGradient>
          </View>

          {/* --- NEW THOUGHTS SECTION (COMMENTED OUT) --- */}
          {/* {currentPattern && (
            <View style={{ marginBottom: 20 }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
                marginLeft: 24,
                marginTop: 46,
                gap: 12
              }}>
                <Image
                  source={require('../../assets/images/New Icons/new-4.png')}
                  style={{ width: 40, height: 40 }}
                  contentFit="contain"
                />
                <View>
                  <Text style={{
                    fontSize: 24,
                    fontWeight: '700',
                    color: '#1F2937',
                    fontFamily: 'Ubuntu-Medium',
                    letterSpacing: -0.5
                  }}>{t('insights.moodInsights.yourThoughts')}</Text>
                  <Text style={{
                    fontSize: 14,
                    color: '#6B7280',
                    fontFamily: 'Ubuntu-Light',
                    marginTop: 2
                  }}>{t('insights.moodInsights.identifyPatterns')}</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', marginHorizontal: -16 }}>
                <ImageBackground 
                                    source={require('../../assets/images/distorted-new-1.png')}
                                    style={{ width: Dimensions.get('window').width / 2, aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }}
                                    resizeMode="cover"                >
                  <Text style={{
                    fontSize: getDynamicFontSize(currentPattern.originalThought),
                    color: '#374151',
                    fontWeight: '500',
                    textAlign: 'center',
                    fontFamily: 'Ubuntu-Medium',
                    paddingHorizontal: 10,
                    lineHeight: getDynamicFontSize(currentPattern.originalThought) * 1.3,
                  }}>
                    {currentPattern.originalThought}
                  </Text>
                </ImageBackground>

                <ImageBackground 
                  source={require('../../assets/images/balanced-new-1.png')} 
                  style={{ width: Dimensions.get('window').width / 2, aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }}
                  resizeMode="cover"
                >
                  <Text style={{
                    fontSize: getDynamicFontSize(currentPattern.reframedThought),
                    color: '#374151',
                    fontWeight: '500',
                    textAlign: 'center',
                    fontFamily: 'Ubuntu-Medium',
                    paddingHorizontal: 10,
                    lineHeight: getDynamicFontSize(currentPattern.reframedThought) * 1.3,
                  }}>
                    {currentPattern.reframedThought}
                  </Text>
                </ImageBackground>
              </View>

              <View style={{
                marginHorizontal: 16,
                marginTop: 20,
                marginBottom: 4,
                alignItems: 'center',
                backgroundColor: 'rgba(173, 216, 230, 0.2)',
                borderRadius: 20,
                paddingVertical: 10,
                paddingHorizontal: 14,
                flexDirection: 'row',
                width: '85%',
                alignSelf: 'center',
                shadowColor: 'rgba(0, 0, 0, 0.05)',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 1,
              }}>
                  <Image
                    source={require('../../assets/images/New Icons/new-5-red.png')}
                    style={{
                      width: 24,
                      height: 24,
                      marginRight: 12,
                      marginTop: -2,
                    }}
                    contentFit="contain"
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 15,
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: 6,
                      fontFamily: 'Ubuntu-Medium',
                    }}>
                      {getPatternName(currentPattern.distortionTypes[0]) || t('insights.thinkingPatterns.thoughtPattern')}
                    </Text>
                    <Text style={{
                      fontSize: 13,
                      color: '#6B7280',
                      lineHeight: 18,
                      fontFamily: 'Ubuntu-Light',
                    }}>
                      {getDistortionExplanation(currentPattern.distortionTypes[0])}
                    </Text>
                  </View>
              </View>
            </View>
          )} */}

          <MoodInsightsCard
            onInsightPress={(type, data) => onInsightClick(type, data)}
            displayPatterns={displayPatterns}
            currentPatternIndex={currentPatternIndex}
            onPatternSwipeLeft={handlePatternSwipeLeft}
            onPatternSwipeRight={handlePatternSwipeRight}
            onDeletePattern={handleDeletePattern}
          />

          {/* Values Section */}
          <View style={[styles.patternsCard, { position: 'relative', overflow: 'hidden' }]}>
            <Image
              source={require('../../assets/new-design/Homescreen/Cards/pattern-blue-3.png')}
              style={{ position: 'absolute', top: 0, right: -40, width: 150, height: 67, opacity: 1 }}
              contentFit="contain"
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 32, marginLeft: 24, marginTop: 16, gap: 12 }}>
              <Image source={require('../../assets/images/New Icons/new-5.png')} style={{ width: 40, height: 40 }} contentFit="contain" />
              <View>
                <Text style={{ fontSize: 24, fontWeight: '700', color: '#1F2937', fontFamily: 'Ubuntu-Medium', letterSpacing: -0.5 }}>
                  {t('insights.values.title') || 'Your Values'}
                </Text>
                <Text style={{ fontSize: 14, color: '#6B7280', fontFamily: 'Ubuntu-Light', marginTop: 2 }}>
                  {t('insights.values.subtitle') || 'What matters to you'}
                </Text>
              </View>
            </View>

            <ValueCards
              onStartReflection={(valueId, prompt, valueName, valueDescription) => {
                onInsightClick('value_reflection', { valueId, prompt, valueName, valueDescription });
              }}
              onStartExercise={() => {
                onInsightClick('exercise', { type: 'values-clarification' });
              }}
              showBarChart={true}
              maxValues={4}
              onDelete={handleDeleteValueReflection}
              onDeleteValue={handleDeleteValue}
            />
          </View>

          {/* Vision Section */}
          <VisionInsightsCard
            onReflectPress={(visionInsight) => {
              const prompt = t('insights.prompts.visionReflection')
                .replace('{{qualities}}', visionInsight.coreQualities.join(', '))
                .replace('{{description}}', visionInsight.fullDescription);
              onInsightClick('vision_reflection', { visionInsight, prompt });
            }}
            onViewAllPress={() => setVisionDetailsVisible(true)}
            onStartExercise={() => onInsightClick('exercise', { type: 'vision-of-future' })}
          />

          {/* Memory Insights Section (moved above Session Summaries) */}
          <View style={styles.patternsCard}>
            <View style={styles.patternsHeader}>
              <View style={styles.patternsIcon}>
                <Image source={require('../../assets/images/New Icons/icon-7.png')} style={{ width: 60, height: 60 }} contentFit="contain" />
              </View>
              <View style={styles.patternsTitleContainer}>
                <Text style={styles.patternsTitle}>{t('insights.deeperInsights.title') || 'Deeper Insights'}</Text>
                <Text style={styles.patternsSubtitle}>{t('insights.longTermPatterns') || 'Long-term patterns'}</Text>
              </View>
            </View>

            {memoryInsights.length > 0 ? (
                <View style={styles.patternsContainer}>
                  {memoryInsights.map((insight) => {
                    const isExpanded = expandedMemoryInsights.has(insight.id);
                    const previewText = generateInsightPreview(insight);
                    const categoryName = getCategoryDisplayName(insight.category);

                    return (
                      <TouchableOpacity key={insight.id} onPress={() => toggleMemoryInsightExpansion(insight.id)} style={styles.patternCard} activeOpacity={0.9}>
                        <View style={styles.patternContent}>
                          <View style={styles.patternContentLeft}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Text style={styles.patternName}>{categoryName}</Text>
                            </View>

                            {!isExpanded && <Text style={styles.insightPreview}>{previewText}</Text>}

                            <Text style={[styles.patternDescription, { marginTop: isExpanded ? 0 : 8 }]}>
                              {getShortConfidenceLabel(insight.confidence, 'insight')} • {new Date(insight.date).toLocaleDateString()}
                            </Text>

                            {isExpanded && (
                              <>
                                <View style={styles.thoughtContainer}>
                                  <Text style={styles.summaryText}>{insight.content}</Text>
                                </View>

                                <View style={styles.memoryActionButtons}>
                                  <ValuesReflectButton
                                    onPress={() => {
                                      const prompt = t('insights.prompts.deeperInsightReflection')
                                        .replace('{{category}}', categoryName)
                                        .replace('{{content}}', insight.content);
                                      onInsightClick('deeper_insight_reflection', { 
                                        insightContent: insight.content, 
                                        category: categoryName, 
                                        prompt: prompt 
                                      });
                                    }}
                                    text={t('insights.actions.reflectOnThis')}
                                  />
                                </View>
                              </>
                            )}
                          </View>
                          <View style={styles.patternArrow}>
                            <ArrowRight size={16} color="#1e40af" style={isExpanded ? { transform: [{ rotate: '90deg' }] } : {}} />
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
            ) : (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 20, paddingHorizontal: 10 }}>
                  {t('insights.deeperInsights.emptyState.description') || 'As you continue your sessions, long-term patterns and themes will be generated here in categories such as:'}
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
                  {memoryInsightCategories.map(category => (
                    <View key={category} style={styles.distortionTag}>
                      <Text style={styles.distortionTagText}>{category}</Text>
                    </View>
                  ))}
                </View>

                {/* Action buttons */}
                <View style={{ flexDirection: 'row', gap: 12, width: '100%', maxWidth: 400, paddingHorizontal: 10 }}>
                  {/* See Example Button */}
                  <TouchableOpacity
                    onPress={() => setShowDeeperInsightsExampleModal(true)}
                    style={{
                      flex: 1,
                      borderWidth: 1.5,
                      borderColor: '#5A88B5',
                      borderRadius: 12,
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      alignItems: 'center',
                      backgroundColor: 'transparent',
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={{
                      color: '#5A88B5',
                      fontSize: 14,
                      fontWeight: '600',
                    }}>
                      {t('insights.deeperInsights.emptyState.seeExample') || 'See Example'}
                    </Text>
                  </TouchableOpacity>

                  {/* Start Session Button */}
                  <TouchableOpacity
                    onPress={() => onInsightClick('chat')}
                    style={{
                      flex: 1,
                      backgroundColor: '#5A88B5',
                      borderRadius: 12,
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      alignItems: 'center',
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={{
                      color: '#FFFFFF',
                      fontSize: 14,
                      fontWeight: '600',
                    }}>
                      {t('insights.deeperInsights.emptyState.startSession') || 'Start Session'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Session Summaries (moved below Deeper Insights) */}
          <View style={styles.patternsCard}>
            <TouchableOpacity style={styles.patternsHeader} onPress={() => setSessionSummariesVisible(true)} activeOpacity={0.7}>
              <View style={styles.patternsIcon}>
                <Image source={require('../../assets/images/New Icons/icon-10.png')} style={{ width: 60, height: 60 }} contentFit="contain" />
              </View>
              <View style={styles.patternsTitleContainer}>
                <Text style={styles.patternsTitle}>{t('insights.sessionSummaries.title') || 'Session Summaries'}</Text>
                <Text style={styles.patternsSubtitle}>{t('insights.sessionSummaries.subtitle') || 'Review your conversations'}</Text>
              </View>
              <View style={styles.patternArrow}>
                <ArrowRight size={16} color="#1e40af" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Therapy Goals */}
          <View style={styles.patternsCard}>
            <TouchableOpacity style={styles.patternsHeader} onPress={onTherapyGoalsClick || (() => setGoalDetailsVisible(true))} activeOpacity={0.7}>
              <View style={styles.patternsIcon}>
                <Image source={require('../../assets/images/New Icons/icon-12.png')} style={{ width: 60, height: 60 }} contentFit="contain" />
              </View>
              <View style={styles.patternsTitleContainer}>
                <Text style={styles.patternsTitle}>{t('insights.therapyGoals.title') || 'Therapy Goals'}</Text>
                <Text style={styles.patternsSubtitle}>
                  {activeGoals.length > 0
                    ? `${activeGoals.length} ${activeGoals.length === 1 ? t('insights.therapyGoals.activeGoal') || 'active goal' : t('insights.therapyGoals.activeGoals') || 'active goals'}`
                    : t('insights.therapyGoals.setFirstGoal') || 'Set your first goal'
                  }
                </Text>
              </View>
              <View style={styles.patternArrow}>
                <ArrowRight size={16} color="#059669" />
              </View>
            </TouchableOpacity>

            {activeGoals.length > 0 && (
              <View style={styles.patternsContainer}>
                {activeGoals.slice(0, 3).map((goal) => (
                  <TouchableOpacity
                    key={goal.id}
                    onPress={() => {
                      setSelectedGoal(goal);
                      setGoalDetailsVisible(true);
                    }}
                    style={styles.patternCard}
                    activeOpacity={0.9}
                  >
                    <View style={styles.patternContent}>
                      <View style={styles.patternContentLeft}>
                        <Text style={styles.patternName}>
                          {goal.focusArea === 'other' ? goal.customFocusArea : goal.focusArea.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Text>
                        <Text style={styles.insightPreview}>{goal.mainGoal}</Text>
                        <View style={styles.goalProgressContainer}>
                          <View style={styles.goalProgressBar}>
                            <View style={[styles.goalProgressFill, { width: `${goal.progress}%` }]} />
                          </View>
                          <Text style={styles.patternDescription}>
                            {goal.progress}% {t('insights.therapyGoals.complete') || 'complete'} • {goal.timeline || ''}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.patternArrow}>
                        <ArrowRight size={16} color="#059669" />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}

                {activeGoals.length === 0 && (
                  <View style={styles.noGoalsContainer}>
                    <Text style={styles.noGoalsText}>
                      {t('insights.therapyGoals.setGoalDescription') || 'Set your first therapy goal to track progress'}
                    </Text>
                    <TouchableOpacity onPress={() => onInsightClick('goal-setting')} style={styles.setGoalButton} activeOpacity={0.8}>
                      <Plus size={16} color="#FFFFFF" />
                      <Text style={styles.setGoalButtonText}>{t('insights.therapyGoals.setFirstGoalButton') || 'Set Your First Goal'}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Journey Section */}
          <View style={styles.patternsCard}>
            <View style={styles.patternsHeader}>
              <View style={styles.patternsIcon}>
                <Image source={require('../../assets/images/New Icons/icon-14.png')} style={{ width: 60, height: 60 }} contentFit="contain" />
              </View>
              <View style={styles.patternsTitleContainer}>
                <Text style={styles.patternsTitle}>{t('insights.journey.title') || 'Your Journey'}</Text>
                <Text style={styles.patternsSubtitle}>{t('insights.journey.subtitle') || 'Track your progress'}</Text>
              </View>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{journeyData.sessionsCompleted}</Text>
                <Text style={styles.statLabel}>{t('insights.journey.sessions')}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValueSky}>{journeyData.exercisesCompleted}</Text>
                <Text style={styles.statLabel}>{t('insights.journey.exercises')}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{currentStreak === 0 ? 1 : currentStreak}</Text>
                <Text style={styles.statLabel}>{t('insights.journey.dayStreak')}</Text>
              </View>
            </View>

            <LinearGradient colors={['rgba(59, 130, 246, 0.05)', 'rgba(14, 165, 233, 0.05)']} style={styles.suggestionCard}>
              <Text style={styles.suggestionText}>
                {t('insights.journey.completedSessions')}{' '}<Text style={styles.suggestionBold}>{journeyData.sessionsCompleted}</Text>{' '}{t('insights.journey.guidedSessions')}
                {' '}<Text style={styles.suggestionBoldBlue}>{t('insights.journey.nextUp')} {journeyData.nextSuggestion}</Text>
              </Text>
            </LinearGradient>

            <View style={{ marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(226, 232, 240, 0.6)' }}>
              <Text style={styles.achievementsTitle}>{t('insights.journey.recentAchievements')}</Text>
              <View style={styles.achievementsList}>
                {journeyData.achievements.map((achievement, index) => (
                  <View key={index} style={styles.achievementItem}>
                    <CheckCircle2 size={18} color="#1e40af" />
                    <Text style={styles.achievementText}>{achievement}</Text>
                  </View>
                ))}
              </View>
            </View>

            {weeklyHighlights.length > 0 && (
              <View style={{ marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(226, 232, 240, 0.6)' }}>
                <Text style={styles.achievementsTitle}>{t('insights.journey.recentHighlights')}</Text>
                <View style={styles.achievementsList}>
                  {weeklyHighlights.map((highlight, index) => (
                    <View key={highlight.id} style={styles.achievementItem}>
                      <CheckCircle2 size={18} color="#059669" />
                      <Text style={styles.achievementText}>{highlight.text}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Testing: control buttons hidden */}
          <View style={{ height: 0 }} />
        </View>
      </ScrollView>

      {/* Modals */}
      <ThinkingPatternsModal
        visible={patternsModalVisible}
        onClose={() => setPatternsModalVisible(false)}
        patterns={displayPatterns}
        onPatternPress={(pattern) => {
          setPatternsModalVisible(false);
          onInsightClick('pattern', pattern);
        }}
        onStartReflection={(pattern, prompt) => {
          setPatternsModalVisible(false);
          onInsightClick('thinking_pattern_reflection', {
            originalThought: pattern.originalThought,
            distortionType: pattern.distortionTypes[0] || t('insights.mockData.cognitiveDistortion'),
            reframedThought: pattern.reframedThought,
            prompt: prompt
          });
        }}
        onDelete={handleDeletePattern}
      />

      <ThinkingPatternReflectionsModal
        visible={thinkingPatternReflectionsModalVisible}
        reflections={thinkingPatternReflections}
        onClose={() => setThinkingPatternReflectionsModalVisible(false)}
        onReflectionPress={(reflection) => {
          setThinkingPatternReflectionsModalVisible(false);
        }}
        onDelete={handleDeleteReflection}
      />

      <GoalDetailsModal
        visible={goalDetailsVisible}
        goal={selectedGoal}
        onClose={() => {
          setGoalDetailsVisible(false);
          setSelectedGoal(null);
        }}
        onGoalUpdated={() => {
          loadInsightData();
        }}
        onStartExercise={(exerciseType) => {
          setGoalDetailsVisible(false);
          onInsightClick('exercise', { type: exerciseType });
        }}
      />

      <SessionSummariesModal
        visible={sessionSummariesVisible}
        onClose={() => setSessionSummariesVisible(false)}
        initialSummaries={sessionSummaries}
        totalCount={memoryStats.sessionSummaries}
        onDelete={handleDeleteSummary}
      />

      <VisionDetailsModal
        visible={visionDetailsVisible}
        onClose={() => setVisionDetailsVisible(false)}
        onReflectPress={(visionInsight) => {
          setVisionDetailsVisible(false);
          const prompt = t('insights.prompts.visionReflection')
            .replace('{{qualities}}', visionInsight.coreQualities.join(', '))
            .replace('{{description}}', visionInsight.fullDescription);
          onInsightClick('vision_reflection', { visionInsight, prompt });
        }}
      />

      {/* Deeper Insights Example Modal */}
      <Modal
        visible={showDeeperInsightsExampleModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowDeeperInsightsExampleModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            marginHorizontal: 20,
            maxHeight: '85%',
            width: '90%',
            maxWidth: 600,
          }}>
            {/* Header */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 20,
              borderBottomWidth: 1,
              borderBottomColor: '#E5E7EB',
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{
                  backgroundColor: '#EFF6FF',
                  padding: 8,
                  borderRadius: 10,
                }}>
                  <Lightbulb size={24} color="#5A88B5" />
                </View>
                <View>
                  <Text style={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: '#1F2937',
                  }}>
                    {t('insights.deeperInsights.exampleModal.title') || 'Deeper Insights Examples'}
                  </Text>
                  <View style={{
                    backgroundColor: '#FEF3C7',
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderRadius: 12,
                    marginTop: 4,
                  }}>
                    <Text style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: '#d97706',
                    }}>
                      {t('insights.deeperInsights.exampleModal.badge') || 'EXAMPLE'}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setShowDeeperInsightsExampleModal(false)}
                style={{
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor: '#F3F4F6',
                }}
              >
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Scrollable Content */}
            <ScrollView style={{ maxHeight: '70%' }}>
              <View style={{ padding: 20 }}>
                {/* Description */}
                <View style={{
                  backgroundColor: '#EFF6FF',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 20,
                }}>
                  <Text style={{
                    fontSize: 14,
                    color: '#374151',
                    lineHeight: 20,
                  }}>
                    {t('insights.deeperInsights.exampleModal.description') || 'As you interact with Anu through chat sessions, these long-term patterns and themes will be automatically identified and organized for you.'}
                  </Text>
                </View>

                {/* Example Insights */}
                {exampleDeeperInsights.map((insight, index) => {
                  const categoryName = getCategoryDisplayName(insight.category);
                  return (
                    <View key={insight.id} style={{
                      backgroundColor: '#F9FAFB',
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 16,
                      borderLeftWidth: 4,
                      borderLeftColor: '#5A88B5',
                    }}>
                      {/* Category Badge */}
                      <View style={{
                        backgroundColor: '#EFF6FF',
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 8,
                        alignSelf: 'flex-start',
                        marginBottom: 12,
                      }}>
                        <Text style={{
                          fontSize: 12,
                          fontWeight: '600',
                          color: '#5A88B5',
                        }}>
                          {categoryName}
                        </Text>
                      </View>

                      {/* Insight Content */}
                      <Text style={{
                        fontSize: 14,
                        color: '#374151',
                        lineHeight: 22,
                        marginBottom: 12,
                      }}>
                        {insight.content}
                      </Text>

                      {/* Metadata */}
                      <Text style={{
                        fontSize: 12,
                        color: '#9CA3AF',
                      }}>
                        {getShortConfidenceLabel(insight.confidence, 'insight')} • {new Date(insight.date).toLocaleDateString()}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </ScrollView>

            {/* Bottom Action */}
            <View style={{
              padding: 20,
              borderTopWidth: 1,
              borderTopColor: '#E5E7EB',
            }}>
              <TouchableOpacity
                onPress={() => {
                  setShowDeeperInsightsExampleModal(false);
                  onInsightClick('chat');
                }}
                style={{
                  backgroundColor: '#5A88B5',
                  borderRadius: 12,
                  paddingVertical: 14,
                  paddingHorizontal: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
                activeOpacity={0.8}
              >
                <MessageCircle size={20} color="#FFFFFF" />
                <Text style={{
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                  {t('insights.deeperInsights.exampleModal.action') || 'Start Session with Anu'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaWrapper>
  );
};

export default InsightsDashboard;
