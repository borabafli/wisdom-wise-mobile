import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Animated } from 'react-native';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { Brain, Target, CheckCircle2, ArrowRight, Heart, Plus, Lightbulb } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { insightService, ThoughtPattern } from '../services/insightService';
import { memoryService, Insight, Summary } from '../services/memoryService';
import { goalService, TherapyGoal } from '../services/goalService';
import { motivationalCardService, MotivationalData, MotivationalMessage } from '../services/motivationalCardService';
import { getShortConfidenceLabel } from '../utils/confidenceDisplay';
import { generateInsightPreview, getCategoryDisplayName } from '../utils/insightPreviewGenerator';
import ThinkingPatternsModal from '../components/ThinkingPatternsModal';
import { GoalDetailsModal } from '../components/GoalDetailsModal';
import { SessionSummariesModal } from '../components/SessionSummariesModal';
import { MoodInsightsCard } from '../components/MoodInsightsCard';
import { ValueCards } from '../components/ValueCards';
import { VisionInsightsCard } from '../components/VisionInsightsCard';
import { VisionDetailsModal } from '../components/VisionDetailsModal';
import { useUserProfile } from '../hooks';
import { insightsDashboardStyles as styles } from '../styles/components/InsightsDashboard.styles';
import { ValuesReflectButton } from '../components/ReflectButton';

const { width } = Dimensions.get('window');

interface InsightsDashboardProps {
  onInsightClick: (type: string, insight?: any) => void;
}

const InsightsDashboard: React.FC<InsightsDashboardProps> = ({ onInsightClick }) => {
  const { firstName } = useUserProfile();
  const [thinkingPatterns, setThinkingPatterns] = useState<ThoughtPattern[]>([]);
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
  const [goalDetailsVisible, setGoalDetailsVisible] = useState(false);
  const [sessionSummariesVisible, setSessionSummariesVisible] = useState(false);
  const [visionDetailsVisible, setVisionDetailsVisible] = useState(false);
  const [expandedMemoryInsights, setExpandedMemoryInsights] = useState<Set<string>>(new Set()); // Collapsed by default
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
      
      // Load recent thought patterns (existing system)
      const recentPatterns = await insightService.getRecentPatterns(10);
      setThinkingPatterns(recentPatterns);
      console.log('🔍 [INSIGHTS DEBUG] Thought patterns loaded:', recentPatterns.length);
      
      
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
      id: 1,
      title: 'Active Goals',
      value: goalStats.activeGoals.toString(),
      subtitle: `${goalStats.averageProgress}% average progress`,
      icon: Target,
      trend: goalStats.activeGoals > 0 ? 'positive' : 'neutral'
    }
  ];

  return (
    <SafeAreaWrapper style={styles.container}>
      {/* Background */}
      <LinearGradient
        colors={['#dbeafe', '#f0f9ff', '#bfdbfe']}
        style={styles.backgroundGradient}
      />
      
      {/* Beautiful background shapes */}
      <View style={[styles.watercolorBlob, styles.blob1]} />
      <View style={[styles.watercolorBlob, styles.blob2]} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {firstName !== 'Friend' ? `${firstName}'s Progress` : 'Progress'}
        </Text>
        <Text style={styles.subtitle}>
          {firstName !== 'Friend' ? `${firstName}, your wellness journey continues ✨` : 'Your wellness journey continues'}
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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
            <LinearGradient
              colors={['#e0e7ff', '#c7d2fe']}
              style={styles.patternsIcon}
            >
              <Lightbulb size={24} color="#6366f1" />
            </LinearGradient>
            <View style={styles.patternsTitleContainer}>
              <Text style={styles.patternsTitle}>Thoughts</Text>
              <Text style={styles.patternsSubtitle}>Patterns & insights</Text>
            </View>
          </View>

          <View style={styles.patternsContainer}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading your insights...</Text>
              </View>
            ) : displayPatterns.length > 0 ? (
              // Show only the first (most recent) pattern as preview
              (() => {
                const previewPattern = displayPatterns[0];
                return (
                  <TouchableOpacity
                    key={previewPattern.id}
                    onPress={() => onInsightClick('pattern', previewPattern)}
                    style={styles.patternCard}
                    activeOpacity={0.9}
                  >
                    <View style={styles.patternContent}>
                      <View style={styles.patternContentLeft}>
                        <Text style={styles.patternName}>
                          {previewPattern.distortionTypes[0] || 'Thought Pattern'}
                        </Text>
                        <Text style={styles.patternDescription}>
                          {previewPattern.context || getShortConfidenceLabel(previewPattern.confidence, 'pattern')}
                        </Text>
                        
                        <View style={styles.thoughtContainer}>
                          <View style={styles.originalThought}>
                            <Text style={styles.thoughtText}>
                              "{previewPattern.originalThought}"
                            </Text>
                          </View>
                          <View style={styles.reframedThought}>
                            <Text style={styles.reframedText}>
                              "{previewPattern.reframedThought}"
                            </Text>
                          </View>
                        </View>
                        
                        {previewPattern.distortionTypes.length > 1 && (
                          <View style={styles.distortionTags}>
                            {previewPattern.distortionTypes.slice(1, 3).map((distortion, index) => (
                              <View key={index} style={styles.distortionTag}>
                                <Text style={styles.distortionTagText}>
                                  {distortion}
                                </Text>
                              </View>
                            ))}
                          </View>
                        )}
                        
                        {/* Reflect on This Button */}
                        <ValuesReflectButton
                          onPress={(e) => {
                            e.stopPropagation();
                            const prompt = `I noticed that your thought "${previewPattern.originalThought}" might show a pattern of ${previewPattern.distortionTypes[0]?.toLowerCase() || 'cognitive distortion'}. Sometimes when we experience ${previewPattern.distortionTypes[0]?.toLowerCase() || 'cognitive distortions'}, it can make situations feel more challenging than they might actually be. Would you like to explore this specific thought pattern with me?`;
                            onInsightClick('thinking_pattern_reflection', {
                              originalThought: previewPattern.originalThought,
                              distortionType: previewPattern.distortionTypes[0] || 'Cognitive Distortion',
                              reframedThought: previewPattern.reframedThought,
                              prompt: prompt
                            });
                          }}
                          style={{ marginTop: 12 }}
                        />
                      </View>
                      <View style={styles.patternArrow}>
                        <ArrowRight size={16} color="#1e40af" />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })()
            ) : (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>
                  Start a conversation to discover your thought patterns! 🌱
                </Text>
              </View>
            )}
          </View>

          {displayPatterns.length > 1 && (
            <View style={styles.viewAllContainer}>
              <TouchableOpacity
                onPress={() => setPatternsModalVisible(true)}
                style={styles.viewAllButton}
                activeOpacity={0.7}
              >
                <Text style={styles.viewAllText}>
                  Show all patterns ({displayPatterns.length})
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Values Section - Third */}
        <View style={styles.patternsCard}>
          <View style={[styles.patternsAccent, { backgroundColor: 'rgba(153, 246, 228, 0.15)' }]} />
          
          <View style={styles.patternsHeader}>
            <LinearGradient
              colors={['#f0fdfa', '#ccfbf1']}
              style={styles.patternsIcon}
            >
              <Heart size={24} color="#0d9488" />
            </LinearGradient>
            <View style={styles.patternsTitleContainer}>
              <Text style={styles.patternsTitle}>Values</Text>
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


        {/* Quick Insights */}
        <View style={styles.insightsSection}>
          {insights.map((insight) => {
            const Icon = insight.icon;
            return (
              <TouchableOpacity
                key={insight.id}
                onPress={() => onInsightClick('insight', insight)}
                style={styles.insightCard}
                activeOpacity={0.9}
              >
                <View style={styles.insightContent}>
                  <View style={styles.insightLeft}>
                    <LinearGradient
                      colors={insight.trend === 'positive' ? ['#bfdbfe', '#7dd3fc'] : ['#bae6fd', '#7dd3fc']}
                      style={styles.insightIcon}
                    >
                      <Icon 
                        size={24} 
                        color={insight.trend === 'positive' ? '#1e40af' : '#0369a1'} 
                      />
                    </LinearGradient>
                    <View style={styles.insightText}>
                      <Text style={styles.insightTitle}>
                        {insight.title}
                      </Text>
                      <Text style={styles.insightSubtitle}>{insight.subtitle}</Text>
                    </View>
                  </View>
                  <View style={styles.insightRight}>
                    <Text style={[
                      styles.insightValue,
                      insight.trend === 'positive' ? styles.insightValuePositive : styles.insightValueNeutral
                    ]}>
                      {insight.value}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Active Goals Section */}
        {activeGoals.length > 0 && (
          <View style={styles.patternsCard}>
            <View style={[styles.patternsAccent, { backgroundColor: 'rgba(251, 146, 60, 0.15)' }]} />
            
            <View style={styles.patternsHeader}>
              <LinearGradient
                colors={['#fef7ed', '#fed7aa']}
                style={styles.patternsIcon}
              >
                <Target size={24} color="#ea580c" />
              </LinearGradient>
              <View style={styles.patternsTitleContainer}>
                <Text style={styles.patternsTitle}>Goals</Text>
                <Text style={styles.patternsSubtitle}>Working toward change</Text>
              </View>
              <TouchableOpacity
                onPress={() => onInsightClick('add_goal')}
                style={styles.addGoalButton}
                activeOpacity={0.7}
              >
                <Plus size={18} color="#d97706" />
              </TouchableOpacity>
            </View>

            <View style={styles.patternsContainer}>
              {activeGoals.map((goal, index) => (
                <TouchableOpacity
                  key={goal.id}
                  onPress={() => {
                    setSelectedGoal(goal);
                    setGoalDetailsVisible(true);
                  }}
                  style={styles.goalCard}
                  activeOpacity={0.9}
                >
                  <View style={styles.goalContent}>
                    <View style={styles.goalContentLeft}>
                      <Text style={styles.goalTitle}>
                        {goal.mainGoal}
                      </Text>
                      <Text style={styles.goalMeta}>
                        {goal.timelineText} • {goal.progress}% complete
                      </Text>
                      
                      <View style={styles.goalProgressContainer}>
                        <View style={styles.goalProgressTrack}>
                          <View style={[styles.goalProgressFill, { width: `${goal.progress}%` }]} />
                        </View>
                      </View>

                      <Text style={styles.goalStep}>
                        Next: {goal.practicalStep}
                      </Text>

                      <Text style={styles.goalMotivation}>
                        "{goal.motivation}"
                      </Text>
                    </View>
                    <View style={styles.patternArrow}>
                      <ArrowRight size={16} color="#d97706" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {goalStats.totalGoals > activeGoals.length && (
              <View style={styles.viewAllContainer}>
                <TouchableOpacity
                  onPress={() => onInsightClick('all_goals')}
                  style={styles.viewAllButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.viewAllText}>
                    View all goals ({goalStats.totalGoals})
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}


        {/* Memory Insights Section */}
        {memoryInsights.length > 0 && (
          <View style={styles.patternsCard}>
            <View style={styles.patternsAccent} />
            
            <View style={styles.patternsHeader}>
              <LinearGradient
                colors={['#fef3c7', '#fbbf24']}
                style={styles.patternsIcon}
              >
                <Brain size={24} color="#d97706" />
              </LinearGradient>
              <View style={styles.patternsTitleContainer}>
                <Text style={styles.patternsTitle}>Memory Insights</Text>
                <Text style={styles.patternsSubtitle}>Long-term patterns & themes</Text>
              </View>
            </View>

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
                                onPress={(e) => {
                                  e.stopPropagation();
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
                                onPress={(e) => {
                                  e.stopPropagation();
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
          </View>
        )}


        {/* Recent Achievements */}
        <View style={styles.achievementsCard}>
          {/* Background accent */}
          <View style={styles.achievementsAccent} />
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

        {/* Your Journey Section - Moved to bottom */}
        <View style={styles.journeyCard}>
          {/* Background accent */}
          <View style={styles.journeyAccent} />
          
          <View style={styles.journeyHeader}>
            <LinearGradient
              colors={['#f0f9ff', '#dbeafe']}
              style={styles.journeyIcon}
            >
              <Heart size={24} color="#2563eb" />
            </LinearGradient>
            <View style={styles.journeyTitleContainer}>
              <Text style={styles.journeyTitle}>Journey</Text>
              <Text style={styles.journeySubtitle}>Every step counts</Text>
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