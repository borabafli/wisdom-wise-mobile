import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Animated, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { Brain, Target, CheckCircle2, ArrowRight, Heart, Plus, Lightbulb, FileText, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
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

const { width } = Dimensions.get('window');

interface InsightsDashboardProps {
  onInsightClick: (type: string, insight?: any) => void;
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

const InsightsDashboard: React.FC<InsightsDashboardProps> = ({ onInsightClick }) => {
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
      
      {/* Background Image */}
      <Image
        source={require('../../assets/images/insights-background.png')}
        style={styles.backgroundImage}
        contentFit="cover"
      />
      
      {/* Blur Overlay */}
      <BlurView intensity={8} style={styles.blurOverlay} />
      
      {/* Blue Overlay */}
      <LinearGradient
        colors={['rgba(248, 250, 252, 0.7)', 'rgba(241, 245, 249, 0.8)']}
        style={styles.blueOverlay}
      />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header - Now inside ScrollView so it scrolls away */}
        <View style={styles.scrollableHeader}>
          <Text style={styles.compactTitle}>
            Your progress
          </Text>
          <Text style={styles.subtitle}>
            Your wellness journey continues
          </Text>
        </View>
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
            colors={['rgba(251, 146, 60, 0.08)', 'rgba(248, 250, 252, 0.95)', 'rgba(165, 180, 252, 0.08)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.motivationalGradient}
          >
            <View style={styles.motivationalContent}>
              <View style={styles.motivationalText}>
                <Text style={styles.motivationalTitle}>
                  {motivationalCard?.message.emoji} {motivationalCard?.message.text || 'Your wellness journey continues'}
                </Text>
                <Text style={styles.motivationalSubtitle}>
                  {motivationalCard?.statsText || 'Every step counts'}
                </Text>
              </View>
              <View style={styles.motivationalStats}>
                {motivationalCard?.stats.map((stat, index) => (
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
                )) || (
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
        <MoodInsightsCard onInsightPress={(insightId) => onInsightClick('mood_insight', insightId)} />

        {/* Thinking Patterns Section - Second */}
        <View style={styles.patternsCard}>
          {/* Background accent */}
          <View style={styles.patternsAccent} />
          
          <View style={styles.patternsHeader}>
            <View style={styles.patternsIcon}>
              <Image 
                source={require('../../assets/images/New Icons/icon-8.png')}
                style={{ width: 60, height: 60 }}
                contentFit="contain"
              />
            </View>
            <View style={styles.patternsTitleContainer}>
              <Text style={styles.patternsTitle}>Your Thoughts</Text>
              <Text style={styles.patternsSubtitle}>Patterns & insights</Text>
            </View>
          </View>

          <View style={styles.patternsContainer}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading your insights...</Text>
              </View>
            ) : displayPatterns.length > 0 ? (
              <View>
                {/* Navigation Header */}
                {displayPatterns.length > 1 && (
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingBottom: 12
                  }}>
                    <TouchableOpacity
                      onPress={handlePatternSwipeRight}
                      disabled={currentPatternIndex === 0}
                      style={{
                        opacity: currentPatternIndex === 0 ? 0.3 : 1,
                        padding: 8
                      }}
                    >
                      <ChevronLeft size={24} color="#87BAA3" />
                    </TouchableOpacity>
                    
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{
                        fontSize: 14,
                        color: '#87BAA3',
                        fontWeight: '500'
                      }}>
                        {currentPatternIndex + 1} of {displayPatterns.length}
                      </Text>
                      <Text style={{
                        fontSize: 12,
                        color: '#9CA3AF',
                        marginTop: 2
                      }}>
                        Swipe to explore
                      </Text>
                    </View>
                    
                    <TouchableOpacity
                      onPress={handlePatternSwipeLeft}
                      disabled={currentPatternIndex === displayPatterns.length - 1}
                      style={{
                        opacity: currentPatternIndex === displayPatterns.length - 1 ? 0.3 : 1,
                        padding: 8
                      }}
                    >
                      <ChevronRight size={24} color="#87BAA3" />
                    </TouchableOpacity>
                  </View>
                )}

                {/* Swipeable Pattern List */}
                <View style={{ minHeight: 400 }}>
                  <FlatList
                    data={displayPatterns}
                    renderItem={({ item: currentPattern }) => (
                      <View
                        key={currentPattern.id}
                        style={{ 
                          width: width - 32,
                          marginHorizontal: 0,
                          paddingHorizontal: 16,
                          paddingBottom: 20
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => onInsightClick('pattern', currentPattern)}
                          style={[styles.patternCard, { marginBottom: 16 }]}
                          activeOpacity={0.9}
                        >
                          <View style={styles.patternContentLeft}>
                            <Text style={styles.patternName}>
                              {currentPattern.distortionTypes[0] || 'Thought Pattern'}
                            </Text>
                            <Text style={[styles.patternDescription, { fontSize: 12, lineHeight: 16 }]}>
                              {getPatternExplanation(currentPattern.distortionTypes[0] || 'Thought Pattern')}
                            </Text>
                            
                            <View style={styles.thoughtContainer}>
                              <View>
                                <Text style={{ fontSize: 13, fontWeight: '600', color: '#BE0223', marginBottom: 6, fontFamily: 'Inter-SemiBold' }}>
                                  ⚡ Distorted Thought
                                </Text>
                                <LinearGradient
                                  colors={['rgba(190, 2, 35, 0.08)', 'rgba(190, 2, 35, 0.02)', 'rgba(190, 2, 35, 0)']}
                                  locations={[0, 0.15, 1]}
                                  start={{ x: 0, y: 0 }}
                                  end={{ x: 1, y: 1 }}
                                  style={styles.originalThought}
                                >
                                  <Text style={[styles.thoughtText, { fontFamily: 'Ubuntu-Regular', color: '#374151' }]}>
                                    "{currentPattern.originalThought}"
                                  </Text>
                                </LinearGradient>
                              </View>
                              <View>
                                <Text style={{ fontSize: 13, fontWeight: '600', color: '#046B3B', marginBottom: 6, fontFamily: 'Inter-SemiBold' }}>
                                  🌟 Balanced Thought
                                </Text>
                                <LinearGradient
                                  colors={['rgba(4, 107, 59, 0.08)', 'rgba(4, 107, 59, 0.02)', 'rgba(4, 107, 59, 0)']}
                                  locations={[0, 0.15, 1]}
                                  start={{ x: 0, y: 0 }}
                                  end={{ x: 1, y: 1 }}
                                  style={styles.reframedThought}
                                >
                                  <Text style={[styles.reframedText, { fontFamily: 'Ubuntu-Medium', color: '#374151' }]}>
                                    "{currentPattern.reframedThought}"
                                  </Text>
                                </LinearGradient>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>
                    )}
                    keyExtractor={(item) => item.id}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={width - 32}
                    decelerationRate="fast"
                    onMomentumScrollEnd={(event) => {
                      const newIndex = Math.round(event.nativeEvent.contentOffset.x / (width - 32));
                      setCurrentPatternIndex(newIndex);
                    }}
                  />
                </View>

                {/* Reflect on This Button - Centered and visible */}
                <View style={{ paddingHorizontal: 16, marginTop: 16, marginBottom: 8 }}>
                  <ValuesReflectButton
                    onPress={() => {
                      const currentPatternForButton = displayPatterns[currentPatternIndex] || displayPatterns[0];
                      const prompt = `I noticed that your thought "${currentPatternForButton.originalThought}" might show a pattern of ${currentPatternForButton.distortionTypes[0]?.toLowerCase() || 'cognitive distortion'}. Sometimes when we experience ${currentPatternForButton.distortionTypes[0]?.toLowerCase() || 'cognitive distortions'}, it can make situations feel more challenging than they might actually be. Would you like to explore this specific thought pattern with me?`;
                      onInsightClick('thinking_pattern_reflection', {
                        originalThought: currentPatternForButton.originalThought,
                        distortionType: currentPatternForButton.distortionTypes[0] || 'Cognitive Distortion',
                        reframedThought: currentPatternForButton.reframedThought,
                        prompt: prompt
                      });
                    }}
                  />
                </View>

                {/* Action Buttons */}
                {(displayPatterns.length > 1 || thinkingPatternReflections.length > 0) && (
                  <View style={{ marginTop: 16, gap: 8, paddingHorizontal: 16 }}>
                    {displayPatterns.length > 1 && (
                      <TouchableOpacity
                        onPress={() => setPatternsModalVisible(true)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f8fafc',
                          borderColor: '#87BAA3',
                          borderWidth: 1,
                          borderRadius: 10,
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                        }}
                        activeOpacity={0.8}
                      >
                        <Lightbulb size={14} color="#87BAA3" />
                        <Text style={{
                          color: '#87BAA3',
                          fontSize: 13,
                          fontWeight: '500',
                          marginLeft: 6,
                        }}>
                          Show all {displayPatterns.length} Patterns
                        </Text>
                      </TouchableOpacity>
                    )}

                    {/* View Thinking Pattern Reflections Button */}
                    {thinkingPatternReflections.length > 0 && (
                      <TouchableOpacity
                        onPress={() => setThinkingPatternReflectionsModalVisible(true)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f8fafc',
                          borderColor: '#87BAA3',
                          borderWidth: 1,
                          borderRadius: 10,
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                        }}
                        activeOpacity={0.8}
                      >
                        <FileText size={14} color="#87BAA3" />
                        <Text style={{
                          color: '#87BAA3',
                          fontSize: 13,
                          fontWeight: '500',
                          marginLeft: 6,
                        }}>
                          View {thinkingPatternReflections.length} Reflection{thinkingPatternReflections.length > 1 ? 's' : ''}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>
                  Start a conversation to discover your thought patterns!
                </Text>
              </View>
            )}
          </View>

        </View>

        {/* Values Section - Third */}
        <View style={styles.patternsCard}>
          <View style={[styles.patternsAccent, { backgroundColor: 'rgba(153, 246, 228, 0.15)' }]} />
          
          <View style={styles.patternsHeader}>
            <View style={styles.patternsIcon}>
              <Image 
                source={require('../../assets/images/New Icons/icon-9.png')}
                style={{ width: 60, height: 60 }}
                contentFit="contain"
              />
            </View>
            <View style={styles.patternsTitleContainer}>
              <Text style={styles.patternsTitle}>Your Values</Text>
              <Text style={styles.patternsSubtitle}>What matters to you</Text>
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
          <View style={styles.patternsAccent} />
          
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
          <View style={styles.patternsAccent} />
          
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

        {/* Your Journey Section - Moved to bottom */}
        <View style={styles.patternsCard}>
          {/* Background accent */}
          <View style={[styles.patternsAccent, { backgroundColor: 'rgba(96, 165, 250, 0.15)' }]} />
          
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