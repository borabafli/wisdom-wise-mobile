import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Animated, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { Brain, Target, CheckCircle2, ArrowRight, Heart, Plus, Lightbulb, FileText, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
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
import { VisionDetailsModal } from '../components/VisionDetailsModal';
import { useUserProfile } from '../hooks';
import { insightsDashboardStyles as styles } from '../styles/components/InsightsDashboard.styles';
import { ValuesReflectButton } from '../components/ReflectButton';
import { generateSampleMoodData } from '../utils/sampleMoodData';
import { generateSampleValuesData } from '../utils/sampleValuesData';


const { width } = Dimensions.get('window');

interface InsightsDashboardProps {
  onInsightClick: (type: string, insight?: any) => void;
  onTherapyGoalsClick?: () => void;
}

// Brief explanations for thought pattern types
const PATTERN_EXPLANATIONS: Record<string, string> = {
  'All-or-Nothing Thinking': 'Seeing things in black and white without middle ground',
  'Catastrophizing': 'Imagining the worst possible outcomes',
  'Mental Filter': 'Focusing only on negative details',
  'Overgeneralization': 'Making broad conclusions from single events',
  'Mind Reading': 'Assuming you know what others think',
  'Fortune Telling': 'Predicting negative outcomes without evidence',
  'Emotional Reasoning': 'Believing feelings reflect reality',
  'Should Statements': 'Using rigid rules about how things should be',
  'Labeling': 'Attaching negative labels to yourself or others',
  'Personalization': 'Blaming yourself for things outside your control',
  'Magnification': 'Blowing things out of proportion',
  'Minimization': 'Downplaying positive aspects',
  'Thought Pattern': 'A recurring way of thinking that may need attention'
};

const InsightsDashboard: React.FC<InsightsDashboardProps> = ({ onInsightClick, onTherapyGoalsClick }) => {
  const { firstName } = useUserProfile();
  
  // Apply dynamic navigation bar styling
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
  const [goalStats, setGoalStats] = useState({
    totalGoals: 0,
    activeGoals: 0,
    averageProgress: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [patternsModalVisible, setPatternsModalVisible] = useState(false);
  const [thinkingPatternReflectionsModalVisible, setThinkingPatternReflectionsModalVisible] = useState(false);
  const [goalDetailsVisible, setGoalDetailsVisible] = useState(false);
  const [sessionSummariesVisible, setSessionSummariesVisible] = useState(false);
  const [visionDetailsVisible, setVisionDetailsVisible] = useState(false);
  const [expandedMemoryInsights, setExpandedMemoryInsights] = useState<Set<string>>(new Set()); // Collapsed by default
  const [memoryInsightsSectionExpanded, setMemoryInsightsSectionExpanded] = useState(false);
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0);
  const [motivationalCard, setMotivationalCard] = useState<{
    message: MotivationalMessage;
    statsText: string;
    stats: Array<{ value: string; label: string }>;
    data: MotivationalData;
  } | null>(null);
  const [contentHeight, setContentHeight] = useState(0);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    loadInsightData();
  }, []);

  useEffect(() => {
    if (motivationalCard) {
      // Gentle fade-in with slight scale animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [motivationalCard, fadeAnim, scaleAnim]);

  const loadInsightData = async () => {
    try {
      setIsLoading(true);
      
      // DEBUG: Log what we're trying to load
      console.log('🔍 [INSIGHTS DEBUG] Loading insight data...');
      
      // Load recent thought patterns (existing system) - show all 10
      const recentPatterns = await insightService.getRecentPatterns(10);
      setThinkingPatterns(recentPatterns);
      console.log('🔍 [INSIGHTS DEBUG] Thought patterns loaded:', recentPatterns.length);
      
      // Load thinking pattern reflections (new dedicated system)
      const reflectionSummaries = await thinkingPatternsService.getRecentReflections(10);
      setThinkingPatternReflections(reflectionSummaries);
      console.log('🔍 [INSIGHTS DEBUG] Thinking pattern reflections loaded:', reflectionSummaries.length);
      
      // Load new memory system data
      const insights = await memoryService.getInsights();
      setMemoryInsights(insights.slice(0, 10)); // Top 10 recent insights
      console.log('🔍 [INSIGHTS DEBUG] Memory insights loaded:', insights.length, insights);
      
      const summaries = await memoryService.getSummaries();
      setSummaries(summaries.slice(0, 5)); // Top 5 recent summaries
      console.log('🔍 [INSIGHTS DEBUG] Summaries loaded:', summaries.length, summaries);
      
      const memStats = await memoryService.getMemoryStats();
      console.log('🔍 [INSIGHTS DEBUG] Memory stats:', memStats);
      if (memStats) {
        setMemoryStats({
          totalInsights: memStats.totalInsights,
          sessionSummaries: memStats.sessionSummaries,
          consolidatedSummaries: memStats.consolidatedSummaries
        });
      }

      // Load goals data
      const goals = await goalService.getActiveGoals();
      setActiveGoals(goals.slice(0, 2)); // Show max 2 goals in dashboard
      console.log('🔍 [INSIGHTS DEBUG] Active goals loaded:', goals.length);

      const goalProgress = await goalService.getGoalProgress();
      setGoalStats({
        totalGoals: goalProgress.totalGoals,
        activeGoals: goalProgress.activeGoals,
        averageProgress: goalProgress.averageProgress
      });
      console.log('🔍 [INSIGHTS DEBUG] Goal stats loaded:', goalProgress);

      // Load motivational card data
      const motivationalData = await motivationalCardService.getCompleteMotivationalCard();
      setMotivationalCard(motivationalData);
      console.log('🔍 [INSIGHTS DEBUG] Motivational card loaded:', motivationalData);
      
    } catch (error) {
      console.error('Error loading insight data:', error);
      // Fallback to mock data if needed
      setThinkingPatterns([]);
      setMemoryInsights([]);
      setSummaries([]);
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

  // Mock data for demonstration when no patterns exist
  const mockPatterns = [
    {
      id: 'mock_1',
      originalThought: 'I completely messed up that presentation, I\'m terrible at public speaking',
      reframedThought: 'The presentation had some rough spots, but I also had good moments. I\'m learning and improving.',
      distortionTypes: ['All-or-Nothing Thinking'],
      confidence: 0.85,
      extractedFrom: { messageId: 'mock', sessionId: 'mock' },
      timestamp: new Date().toISOString(),
      context: 'Identified during conversation about work stress'
    },
    {
      id: 'mock_2', 
      originalThought: 'If I don\'t get this job, my career will be ruined',
      reframedThought: 'Not getting this particular job would be disappointing, but there are other opportunities out there.',
      distortionTypes: ['Catastrophizing'],
      confidence: 0.92,
      extractedFrom: { messageId: 'mock', sessionId: 'mock' },
      timestamp: new Date().toISOString(),
      context: 'Pattern recognized during anxiety session'
    }
  ];

  const displayPatterns = thinkingPatterns.length > 0 ? thinkingPatterns : mockPatterns;

  // Handle swipe functions for patterns
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

  // Get brief explanation for pattern type
  const getPatternExplanation = (patternType: string): string => {
    return PATTERN_EXPLANATIONS[patternType] || PATTERN_EXPLANATIONS['Thought Pattern'];
  };

  const journeyData = {
    sessionsCompleted: 3,
    exercisesCompleted: 7,
    streakDays: 5,
    nextSuggestion: 'Try a Reframe to reduce worry',
    achievements: [
      'First guided session',
      'Daily check-in streak', 
      'Completed breathing exercise'
    ]
  };

  const insights = [
    {
      id: 3,
      title: 'Session Summaries',
      value: memoryStats.sessionSummaries.toString(),
      subtitle: 'Sessions analyzed',
      icon: FileText,
      trend: memoryStats.sessionSummaries > 0 ? 'positive' : 'neutral',
      onClick: () => setSessionSummariesVisible(true)
    }
  ];

  return (
    <SafeAreaWrapper style={styles.container}>
      
      <StatusBar style={statusBarStyle} backgroundColor="transparent" translucent />
      {/* Persistent Solid Background - Same as HomeScreen */}
      <View
        style={[styles.backgroundGradient, { backgroundColor: '#ebf5f9' }]}
        pointerEvents="none"
      />
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onContentSizeChange={(width, height) => setContentHeight(height)}
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
                <Text style={styles.headerTitle}>Insights</Text>
                <Text style={styles.headerSubtitle}>✨ For your growth</Text>
              </View>
            </View>
          </View>
        </View>

        {/* All content container */}
        <View style={styles.contentContainer}>
        {/* Enhanced Motivational Header Card */}
        <Animated.View 
          style={[
            styles.motivationalCard, 
            {
              opacity: motivationalCard ? fadeAnim : 0.3,
              transform: [{ scale: motivationalCard ? scaleAnim : 0.95 }]
            }
          ]}
        >
          <LinearGradient
            colors={['rgba(255, 255, 255, 1)', 'rgba(249, 250, 251, 1)', 'rgba(243, 244, 246, 1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.motivationalGradient}
          >
            <View style={styles.motivationalContent}>
              <View style={styles.motivationalText}>
                <Text style={styles.motivationalTitle}>
                  {motivationalCard?.message.emoji ? `${motivationalCard.message.emoji} ` : ''}{motivationalCard?.message.text || 'Your wellness journey continues'}
                </Text>
              </View>
              <View style={styles.motivationalStats}>
                {motivationalCard?.stats && motivationalCard.stats.length > 0 ? (
                  motivationalCard.stats.map((stat, index) => (
                    <View key={index} style={styles.motivationalStat}>
                      <Text style={[
                        styles.motivationalNumber,
                        motivationalCard.message.category === 'vision' && styles.motivationalNumberVision,
                        motivationalCard.message.category === 'achievement' && styles.motivationalNumberAchievement
                      ]}>
                        {stat.value}
                      </Text>
                      <Text style={styles.motivationalLabel}>{stat.label}</Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.motivationalStat}>
                    <Text style={styles.motivationalNumber}>1</Text>
                    <Text style={styles.motivationalLabel}>starting today</Text>
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
        {/* Mood Insights Section - First */}
        <MoodInsightsCard
          onInsightPress={(type, data) => onInsightClick(type, data)}
          displayPatterns={displayPatterns}
          currentPatternIndex={currentPatternIndex}
          onPatternSwipeLeft={handlePatternSwipeLeft}
          onPatternSwipeRight={handlePatternSwipeRight}
        />


        {/* Values Section - Third */}
        <View style={[styles.patternsCard, { position: 'relative', overflow: 'hidden' }]}>
          {/* Background pattern in top right corner */}
          <Image
            source={require('../../assets/new-design/Homescreen/Cards/pattern-blue-3.png')}
            style={{
              position: 'absolute',
              top: 0,
              right: -40,
              width: 150,
              height: 67,
              opacity: 1
            }}
            contentFit="contain"
          />

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 32,
            marginLeft: 24,
            marginTop: 16,
            gap: 12
          }}>
            <Image
              source={require('../../assets/images/New Icons/new-5.png')}
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
              }}>Your Values</Text>
              <Text style={{
                fontSize: 14,
                color: '#6B7280',
                fontFamily: 'Ubuntu-Light',
                marginTop: 2
              }}>What matters to you</Text>
            </View>
          </View>

          <ValueCards 
            onStartReflection={(valueId, prompt, valueName, valueDescription) => {
              onInsightClick('value_reflection', { 
                valueId, 
                prompt, 
                valueName, 
                valueDescription 
              });
            }}
            showBarChart={true}
            maxValues={4}
          />
        </View>

        {/* Vision of the Future Section */}
        <VisionInsightsCard
          onReflectPress={(visionInsight) => {
            const prompt = `I see that you've created a beautiful vision of your future self. You described your future self as embodying qualities like: ${visionInsight.coreQualities.join(', ')}. Your vision was: "${visionInsight.fullDescription}"\n\nI'd love to explore this vision with you. What aspects of this future self feel most inspiring to you right now? And what small step could you take today to embody a little more of these qualities?`;
            onInsightClick('vision_reflection', {
              visionInsight,
              prompt
            });
          }}
          onViewAllPress={() => setVisionDetailsVisible(true)}
          onStartExercise={() => onInsightClick('exercise', { type: 'vision-of-future' })}
        />









        {/* Session Summaries Section */}
        <View style={styles.patternsCard}>
          
          <TouchableOpacity 
            style={styles.patternsHeader}
            onPress={() => setSessionSummariesVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.patternsIcon}>
              <Image 
                source={require('../../assets/images/New Icons/icon-10.png')}
                style={{ width: 60, height: 60 }}
                contentFit="contain"
              />
            </View>
            <View style={styles.patternsTitleContainer}>
              <Text style={styles.patternsTitle}>Session Summaries</Text>
              <Text style={styles.patternsSubtitle}>Sessions analyzed</Text>
            </View>
            <View style={styles.patternArrow}>
              <ArrowRight size={16} color="#1e40af" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Memory Insights Section - Collapsible */}
        <View style={styles.patternsCard}>
          
          <TouchableOpacity 
            style={styles.patternsHeader}
            onPress={() => setMemoryInsightsSectionExpanded(!memoryInsightsSectionExpanded)}
            activeOpacity={0.7}
          >
            <View style={styles.patternsIcon}>
              <Image 
                source={require('../../assets/images/New Icons/icon-7.png')}
                style={{ width: 60, height: 60 }}
                contentFit="contain"
              />
            </View>
            <View style={styles.patternsTitleContainer}>
              <Text style={styles.patternsTitle}>Memory Insights</Text>
              <Text style={styles.patternsSubtitle}>Long-term patterns & themes</Text>
            </View>
            <View style={styles.patternArrow}>
              <ArrowRight 
                size={16} 
                color="#d97706" 
                style={memoryInsightsSectionExpanded ? { transform: [{ rotate: '90deg' }] } : {}}
              />
            </View>
          </TouchableOpacity>

          {memoryInsightsSectionExpanded && memoryInsights.length > 0 && (
            <View style={styles.patternsContainer}>
              {memoryInsights.map((insight) => {
                const isExpanded = expandedMemoryInsights.has(insight.id);
                const previewText = generateInsightPreview(insight);
                const categoryName = getCategoryDisplayName(insight.category);
                
                return (
                  <TouchableOpacity
                    key={insight.id}
                    onPress={() => toggleMemoryInsightExpansion(insight.id)}
                    style={styles.patternCard}
                    activeOpacity={0.9}
                  >
                    <View style={styles.patternContent}>
                      <View style={styles.patternContentLeft}>
                        <Text style={styles.patternName}>
                          {categoryName}
                        </Text>
                        
                        {!isExpanded && (
                          <Text style={styles.insightPreview}>
                            {previewText}
                          </Text>
                        )}
                        
                        <Text style={[styles.patternDescription, { marginTop: isExpanded ? 0 : 8 }]}>
                          {getShortConfidenceLabel(insight.confidence, 'insight')} • {new Date(insight.date).toLocaleDateString()}
                        </Text>
                        
                        {isExpanded && (
                          <>
                            <View style={styles.thoughtContainer}>
                              <Text style={styles.summaryText}>
                                {insight.content}
                              </Text>
                            </View>
                            
                            {/* Action Buttons */}
                            <View style={styles.memoryActionButtons}>
                              <ValuesReflectButton
                                onPress={() => {
                                  const prompt = `I noticed from your memory insights that you have some strengths and positive patterns. Let's take a moment to reflect on these strengths: "${insight.content}"\n\nWhat do you think makes these strengths particularly meaningful to you? How might you lean into these strengths more in your daily life?`;
                                  onInsightClick('strength_reflection', {
                                    insightContent: insight.content,
                                    category: insight.category,
                                    prompt: prompt
                                  });
                                }}
                                text="Reflect on Strengths"
                                style={{ marginBottom: 8 }}
                              />
                              
                              <ValuesReflectButton
                                onPress={() => {
                                  const prompt = `I see that you have some deep emotional insights from our conversations: "${insight.content}"\n\nSometimes it's valuable to spend time with our emotions and understand what they're telling us. What emotions come up for you when you read this insight? What might these emotions be trying to communicate to you?`;
                                  onInsightClick('emotion_reflection', {
                                    insightContent: insight.content,
                                    category: insight.category,
                                    prompt: prompt
                                  });
                                }}
                                text="Spend Time with Emotions"
                              />
                            </View>
                          </>
                        )}
                      </View>
                      <View style={styles.patternArrow}>
                        <ArrowRight 
                          size={16} 
                          color="#d97706" 
                          style={isExpanded ? { transform: [{ rotate: '90deg' }] } : {}}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Therapy Goals Section */}
        <View style={styles.patternsCard}>
          <TouchableOpacity
            style={styles.patternsHeader}
            onPress={onTherapyGoalsClick || (() => setGoalDetailsVisible(true))}
            activeOpacity={0.7}
          >
            <View style={styles.patternsIcon}>
              <Image
                source={require('../../assets/images/New Icons/icon-12.png')}
                style={{ width: 60, height: 60 }}
                contentFit="contain"
              />
            </View>
            <View style={styles.patternsTitleContainer}>
              <Text style={styles.patternsTitle}>Therapy Goals</Text>
              <Text style={styles.patternsSubtitle}>
                {activeGoals.length > 0
                  ? `${activeGoals.length} active goal${activeGoals.length === 1 ? '' : 's'}`
                  : 'Set your first goal'
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
                        {goal.focusArea === 'other' ? goal.customFocusArea :
                         goal.focusArea.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Text>
                      <Text style={styles.insightPreview}>
                        {goal.mainGoal}
                      </Text>
                      <View style={styles.goalProgressContainer}>
                        <View style={styles.goalProgressBar}>
                          <View
                            style={[
                              styles.goalProgressFill,
                              { width: `${goal.progress}%` }
                            ]}
                          />
                        </View>
                        <Text style={styles.patternDescription}>
                          {goal.progress}% complete • {goal.timeline}
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
                    Set therapy goals to give direction and motivation to your healing journey.
                  </Text>
                  <TouchableOpacity
                    onPress={() => onInsightClick('goal-setting')}
                    style={styles.setGoalButton}
                    activeOpacity={0.8}
                  >
                    <Plus size={16} color="#FFFFFF" />
                    <Text style={styles.setGoalButtonText}>Set Your First Goal</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Your Journey Section - Moved to bottom */}
        <View style={styles.patternsCard}>
          
          <View style={styles.patternsHeader}>
            <View style={styles.patternsIcon}>
              <Image 
                source={require('../../assets/images/New Icons/icon-14.png')}
                style={{ width: 60, height: 60 }}
                contentFit="contain"
              />
            </View>
            <View style={styles.patternsTitleContainer}>
              <Text style={styles.patternsTitle}>Journey</Text>
              <Text style={styles.patternsSubtitle}>Every step counts</Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{journeyData.sessionsCompleted}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValueSky}>{journeyData.exercisesCompleted}</Text>
              <Text style={styles.statLabel}>Exercises</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{journeyData.streakDays}</Text>
              <Text style={styles.statLabel}>Day streak</Text>
            </View>
          </View>

          <LinearGradient
            colors={['rgba(59, 130, 246, 0.05)', 'rgba(14, 165, 233, 0.05)']}
            style={styles.suggestionCard}
          >
            <Text style={styles.suggestionText}>
              You've completed <Text style={styles.suggestionBold}>{journeyData.sessionsCompleted}</Text> guided sessions! 
              <Text style={styles.suggestionBoldBlue}> Next up: {journeyData.nextSuggestion}</Text>
            </Text>
          </LinearGradient>

          {/* Recent Achievements - Now inside Journey section */}
          <View style={{ marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(226, 232, 240, 0.6)' }}>
            <Text style={styles.achievementsTitle}>Recent Achievements</Text>
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

        {/* Control Buttons at Bottom */}
        <View style={{
          flexDirection: 'row',
          marginTop: 30,
          marginBottom: 20,
          marginHorizontal: 16,
          gap: 12
        }}>
          <TouchableOpacity
            onPress={async () => {
              setIsLoading(true);
              // Generate both mood and values sample data
              await Promise.all([
                generateSampleMoodData(),
                generateSampleValuesData()
              ]);
              await loadInsightData();
              setIsLoading(false);
            }}
            style={{
              flex: 1,
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: 'center',
              overflow: 'hidden'
            }}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#4A6B7C', '#1A2B36']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
              }}
            />
            <Text style={{
              fontSize: 14,
              color: 'white',
              fontWeight: '600',
              fontFamily: 'Ubuntu-Medium'
            }}>
              Generate Data
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={loadInsightData}
            style={{
              flex: 1,
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: 'center',
              overflow: 'hidden'
            }}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#4A6B7C', '#1A2B36']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
              }}
            />
            <Text style={{
              fontSize: 14,
              color: 'white',
              fontWeight: '600',
              fontFamily: 'Ubuntu-Medium'
            }}>
              Refresh
            </Text>
          </TouchableOpacity>
        </View>
        </View> {/* Close contentContainer */}
      </ScrollView>

      {/* Thinking Patterns Modal */}
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
            distortionType: pattern.distortionTypes[0] || 'Cognitive Distortion',
            reframedThought: pattern.reframedThought,
            prompt: prompt
          });
        }}
      />

      {/* Thinking Pattern Reflections Modal */}
      <ThinkingPatternReflectionsModal
        visible={thinkingPatternReflectionsModalVisible}
        reflections={thinkingPatternReflections}
        onClose={() => setThinkingPatternReflectionsModalVisible(false)}
        onReflectionPress={(reflection) => {
          setThinkingPatternReflectionsModalVisible(false);
          // Optional: Handle reflection press if needed
        }}
      />

      {/* Goal Details Modal */}
      <GoalDetailsModal
        visible={goalDetailsVisible}
        goal={selectedGoal}
        onClose={() => {
          setGoalDetailsVisible(false);
          setSelectedGoal(null);
        }}
        onGoalUpdated={() => {
          loadInsightData(); // Refresh data when goal is updated
        }}
        onStartExercise={(exerciseType) => {
          setGoalDetailsVisible(false);
          onInsightClick('exercise', { type: exerciseType });
        }}
      />

      {/* Session Summaries Modal */}
      <SessionSummariesModal
        visible={sessionSummariesVisible}
        onClose={() => setSessionSummariesVisible(false)}
        initialSummaries={sessionSummaries}
        totalCount={memoryStats.sessionSummaries}
      />

      {/* Vision Details Modal */}
      <VisionDetailsModal
        visible={visionDetailsVisible}
        onClose={() => setVisionDetailsVisible(false)}
        onReflectPress={(visionInsight) => {
          setVisionDetailsVisible(false);
          const prompt = `I see that you've created a beautiful vision of your future self. You described your future self as embodying qualities like: ${visionInsight.coreQualities.join(', ')}. Your vision was: "${visionInsight.fullDescription}"\n\nI'd love to explore this vision with you. What aspects of this future self feel most inspiring to you right now? And what small step could you take today to embody a little more of these qualities?`;
          onInsightClick('vision_reflection', {
            visionInsight,
            prompt
          });
        }}
      />
    </SafeAreaWrapper>
  );
};



export default InsightsDashboard;