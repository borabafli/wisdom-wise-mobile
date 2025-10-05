import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { CheckCircle2, ArrowRight, Plus, Trash2 } from 'lucide-react-native';
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

interface InsightsDashboardProps {
  onInsightClick: (type: string, insight?: any) => void;
  onTherapyGoalsClick?: () => void;
}

const InsightsDashboard: React.FC<InsightsDashboardProps> = ({ onInsightClick, onTherapyGoalsClick }) => {
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
  const [memoryInsightsSectionExpanded, setMemoryInsightsSectionExpanded] = useState(false);
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0);
  const [motivationalCard, setMotivationalCard] = useState<{
    message: MotivationalMessage;
    statsText: string;
    stats: Array<{ value: string; label: string }>;
    data: MotivationalData;
  } | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    loadInsightData();
  }, []);

  useEffect(() => {
    if (motivationalCard) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, tension: 20, friction: 7, useNativeDriver: true }),
      ]).start();
    }
  }, [motivationalCard, fadeAnim, scaleAnim]);

  const loadInsightData = async () => {
    try {
      setIsLoading(true);
      const recentPatterns = await insightService.getRecentPatterns(10);
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

  const mockPatterns = [
    {
      id: 'mock_1',
      originalThought: t('insights.mockData.patterns.presentationThought') || 'I will mess up this presentation',
      reframedThought: t('insights.mockData.patterns.presentationReframe') || 'I am prepared and will do my best',
      distortionTypes: ['All-or-Nothing Thinking'],
      confidence: 0.85,
      extractedFrom: { messageId: 'mock', sessionId: 'mock' },
      timestamp: new Date().toISOString(),
      context: t('insights.mockData.patterns.presentationContext') || 'Work presentation'
    },
    {
      id: 'mock_2',
      originalThought: t('insights.mockData.patterns.jobThought') || 'I will never find a job',
      reframedThought: t('insights.mockData.patterns.jobReframe') || 'Finding the right opportunity takes time',
      distortionTypes: ['Catastrophizing'],
      confidence: 0.92,
      extractedFrom: { messageId: 'mock', sessionId: 'mock' },
      timestamp: new Date().toISOString(),
      context: t('insights.mockData.patterns.jobContext') || 'Job search'
    }
  ];

  const displayPatterns = thinkingPatterns.length > 0 ? thinkingPatterns : mockPatterns;

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
    streakDays: 5,
    nextSuggestion: t('insights.mockData.journey.nextSuggestion') || 'mindfulness breathing',
    achievements: [
      t('insights.mockData.journey.achievements.firstSession') || 'First Session Completed',
      t('insights.mockData.journey.achievements.dailyStreak') || '5-Day Streak',
      t('insights.mockData.journey.achievements.breathingExercise') || 'Breathing Exercise'
    ].filter(Boolean)
  };

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
          {/* Motivational Card */}
          <Animated.View style={[styles.motivationalCard, { opacity: motivationalCard ? fadeAnim : 0.3, transform: [{ scale: motivationalCard ? scaleAnim : 0.95 }] }]}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 1)', 'rgba(249, 250, 251, 1)', 'rgba(243, 244, 246, 1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.motivationalGradient}
            >
              <View style={styles.motivationalContent}>
                <View style={styles.motivationalText}>
                  <Text style={styles.motivationalTitle}>
                    {`${motivationalCard?.message?.emoji ? `${motivationalCard.message.emoji} ` : ''}${motivationalCard?.message?.text || t('insights.motivational.fallbackMessage')}`}
                  </Text>
                </View>
                <View style={styles.motivationalStats}>
                  {motivationalCard?.stats && motivationalCard.stats.length > 0 ? (
                    motivationalCard.stats.map((stat, index) => (
                      <View key={index} style={styles.motivationalStat}>
                        <Text style={[
                          styles.motivationalNumber,
                          motivationalCard?.message?.category === 'vision' && styles.motivationalNumberVision,
                          motivationalCard?.message?.category === 'achievement' && styles.motivationalNumberAchievement
                        ]}>
                          {stat?.value || '0'}
                        </Text>
                        <Text style={styles.motivationalLabel}>{stat?.label || 'metric'}</Text>
                      </View>
                    ))
                  ) : (
                    <View style={styles.motivationalStat}>
                      <Text style={styles.motivationalNumber}>1</Text>
                      <Text style={styles.motivationalLabel}>{t('insights.motivational.startingToday')}</Text>
                    </View>
                  )}
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Mood Insights Card */}
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

          {/* Session Summaries */}
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

          {/* Memory Insights Section */}
          <View style={styles.patternsCard}>
            <TouchableOpacity
              style={styles.patternsHeader}
              onPress={() => setMemoryInsightsSectionExpanded(!memoryInsightsSectionExpanded)}
              activeOpacity={0.7}
            >
              <View style={styles.patternsIcon}>
                <Image source={require('../../assets/images/New Icons/icon-7.png')} style={{ width: 60, height: 60 }} contentFit="contain" />
              </View>
              <View style={styles.patternsTitleContainer}>
                <Text style={styles.patternsTitle}>{t('insights.memoryInsights') || 'Memory Insights'}</Text>
                <Text style={styles.patternsSubtitle}>{t('insights.longTermPatterns') || 'Long-term patterns'}</Text>
              </View>
              <View style={styles.patternArrow}>
                <ArrowRight size={16} color="#d97706" style={memoryInsightsSectionExpanded ? { transform: [{ rotate: '90deg' }] } : {}} />
              </View>
            </TouchableOpacity>

            {memoryInsightsSectionExpanded && memoryInsights.length > 0 && (
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
                            <TouchableOpacity
                              onPress={(e) => {
                                e.stopPropagation();
                                handleDeleteInsight(insight.id);
                              }}
                              style={{ padding: 4, marginLeft: 8 }}
                              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                              <Trash2 size={14} color="#d97706" opacity={0.6} />
                            </TouchableOpacity>
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
                                    const prompt = t('insights.prompts.strengthReflection').replace('{{content}}', insight.content);
                                    onInsightClick('strength_reflection', { insightContent: insight.content, category: insight.category, prompt: prompt });
                                  }}
                                  text={t('insights.actions.reflectOnStrengths')}
                                  style={{ marginBottom: 8 }}
                                />

                                <ValuesReflectButton
                                  onPress={() => {
                                    const prompt = t('insights.prompts.emotionReflection').replace('{{content}}', insight.content);
                                    onInsightClick('emotion_reflection', { insightContent: insight.content, category: insight.category, prompt: prompt });
                                  }}
                                  text={t('insights.actions.spendTimeWithEmotions')}
                                />
                              </View>
                            </>
                          )}
                        </View>
                        <View style={styles.patternArrow}>
                          <ArrowRight size={16} color="#d97706" style={isExpanded ? { transform: [{ rotate: '90deg' }] } : {}} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
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
                <Text style={styles.statValue}>{journeyData.streakDays}</Text>
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
          </View>

          {/* Control Buttons */}
          <View style={{ flexDirection: 'row', marginTop: 30, marginBottom: 20, marginHorizontal: 16, gap: 12 }}>
            <TouchableOpacity
              onPress={async () => {
                setIsLoading(true);
                await Promise.all([generateSampleMoodData(), generateSampleValuesData()]);
                await loadInsightData();
                setIsLoading(false);
              }}
              style={{ flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center', overflow: 'hidden' }}
              activeOpacity={0.8}
            >
              <LinearGradient colors={['#4A6B7C', '#1A2B36']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
              <Text style={{ fontSize: 14, color: 'white', fontWeight: '600', fontFamily: 'Ubuntu-Medium' }}>{t('insights.actions.generateData')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={loadInsightData}
              style={{ flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center', overflow: 'hidden' }}
              activeOpacity={0.8}
            >
              <LinearGradient colors={['#4A6B7C', '#1A2B36']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
              <Text style={{ fontSize: 14, color: 'white', fontWeight: '600', fontFamily: 'Ubuntu-Medium' }}>{t('insights.actions.refresh')}</Text>
            </TouchableOpacity>
          </View>
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
    </SafeAreaWrapper>
  );
};

export default InsightsDashboard;
