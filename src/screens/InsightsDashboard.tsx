import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { Brain, TrendingUp, Target, CheckCircle2, Lightbulb, ArrowRight, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { insightService, ThoughtPattern } from '../services/insightService';
import { memoryService, Insight, Summary } from '../services/memoryService';
import { createTestMemoryData, debugMemorySystem } from '../utils/memoryDebugUtils';
import { insightsDashboardStyles as styles } from '../styles/components/InsightsDashboard.styles';

const { width, height } = Dimensions.get('window');

interface InsightsDashboardProps {
  onInsightClick: (type: string, insight?: any) => void;
}

const InsightsDashboard: React.FC<InsightsDashboardProps> = ({ onInsightClick }) => {
  const [thinkingPatterns, setThinkingPatterns] = useState<ThoughtPattern[]>([]);
  const [memoryInsights, setMemoryInsights] = useState<Insight[]>([]);
  const [sessionSummaries, setSummaries] = useState<Summary[]>([]);
  const [insightStats, setInsightStats] = useState({
    totalPatterns: 0,
    commonDistortions: [] as { name: string; count: number }[],
    recentActivity: 0,
    confidenceAverage: 0
  });
  const [memoryStats, setMemoryStats] = useState({
    totalInsights: 0,
    sessionSummaries: 0,
    consolidatedSummaries: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInsightData();
  }, []);

  const loadInsightData = async () => {
    try {
      setIsLoading(true);
      
      // DEBUG: Log what we're trying to load
      console.log('🔍 [INSIGHTS DEBUG] Loading insight data...');
      
      // Load recent thought patterns (existing system)
      const recentPatterns = await insightService.getRecentPatterns(10);
      setThinkingPatterns(recentPatterns);
      console.log('🔍 [INSIGHTS DEBUG] Thought patterns loaded:', recentPatterns.length);
      
      // Load insight statistics
      const stats = await insightService.getInsightStats();
      setInsightStats(stats);
      
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

  // DEBUG: Manual test functions
  const handleCreateTestData = async () => {
    console.log('🧪 Creating test memory data...');
    await createTestMemoryData();
    await loadInsightData(); // Reload to show new data
  };

  const handleDebugMemory = async () => {
    console.log('🔍 Running memory system debug...');
    await debugMemorySystem();
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
      title: 'Memory Insights',
      value: memoryStats.totalInsights.toString(),
      subtitle: 'Long-term patterns discovered',
      icon: Brain,
      trend: memoryStats.totalInsights > 0 ? 'positive' : 'neutral'
    },
    {
      id: 2,
      title: 'Session Summaries',
      value: memoryStats.sessionSummaries.toString(),
      subtitle: 'Sessions analyzed',
      icon: TrendingUp,
      trend: memoryStats.sessionSummaries > 0 ? 'positive' : 'neutral'
    },
    {
      id: 3,
      title: 'Thought Patterns',
      value: insightStats.totalPatterns.toString(),
      subtitle: 'CBT patterns identified',
      icon: Target,
      trend: insightStats.totalPatterns > 0 ? 'positive' : 'neutral'
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
          Your Progress
        </Text>
        <Text style={styles.subtitle}>
          Amazing journey so far!
        </Text>
        
        {/* DEBUG BUTTONS - Remove in production */}
        <View style={{ flexDirection: 'row', marginTop: 10, gap: 10 }}>
          <TouchableOpacity 
            onPress={handleCreateTestData}
            style={{ backgroundColor: '#3b82f6', padding: 8, borderRadius: 6 }}
          >
            <Text style={{ color: 'white', fontSize: 12 }}>Create Test Data</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleDebugMemory}
            style={{ backgroundColor: '#059669', padding: 8, borderRadius: 6 }}
          >
            <Text style={{ color: 'white', fontSize: 12 }}>Debug Memory</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={loadInsightData}
            style={{ backgroundColor: '#dc2626', padding: 8, borderRadius: 6 }}
          >
            <Text style={{ color: 'white', fontSize: 12 }}>Reload Data</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Your Journey Section */}
        <View style={styles.journeyCard}>
          {/* Background accent */}
          <View style={styles.journeyAccent} />
          
          <View style={styles.journeyHeader}>
            <LinearGradient
              colors={['#bfdbfe', '#7dd3fc']}
              style={styles.journeyIcon}
            >
              <Heart size={24} color="#1e40af" />
            </LinearGradient>
            <View style={styles.journeyTitleContainer}>
              <Text style={styles.journeyTitle}>Your Journey</Text>
              <Text style={styles.journeySubtitle}>Every step counts! Keep going</Text>
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

        {/* Session Summaries Section */}
        {sessionSummaries.length > 0 && (
          <View style={styles.patternsCard}>
            <View style={styles.patternsAccent} />
            
            <View style={styles.patternsHeader}>
              <LinearGradient
                colors={['#dcfdf4', '#86efac']}
                style={styles.patternsIcon}
              >
                <TrendingUp size={24} color="#059669" />
              </LinearGradient>
              <View style={styles.patternsTitleContainer}>
                <Text style={styles.patternsTitle}>Session Summaries</Text>
                <Text style={styles.patternsSubtitle}>Your therapeutic journey insights</Text>
              </View>
            </View>

            <View style={styles.patternsContainer}>
              {sessionSummaries.map((summary, index) => (
                <TouchableOpacity
                  key={summary.id}
                  onPress={() => onInsightClick('summary', summary)}
                  style={styles.patternCard}
                  activeOpacity={0.9}
                >
                  <View style={styles.patternContent}>
                    <View style={styles.patternContentLeft}>
                      <Text style={styles.patternName}>
                        {summary.type === 'consolidated' ? 'Consolidated Themes' : `Session ${index + 1}`}
                      </Text>
                      <Text style={styles.patternDescription}>
                        {new Date(summary.date).toLocaleDateString()} • {summary.messageCount} messages
                      </Text>
                      
                      <View style={styles.thoughtContainer}>
                        <Text style={styles.summaryText}>
                          {summary.text}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.patternArrow}>
                      <ArrowRight size={16} color="#059669" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
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
              {memoryInsights.map((insight) => (
                <TouchableOpacity
                  key={insight.id}
                  onPress={() => onInsightClick('memory_insight', insight)}
                  style={styles.patternCard}
                  activeOpacity={0.9}
                >
                  <View style={styles.patternContent}>
                    <View style={styles.patternContentLeft}>
                      <Text style={styles.patternName}>
                        {insight.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Text>
                      <Text style={styles.patternDescription}>
                        Confidence: {Math.round(insight.confidence * 100)}% • {new Date(insight.date).toLocaleDateString()}
                      </Text>
                      
                      <View style={styles.thoughtContainer}>
                        <Text style={styles.summaryText}>
                          {insight.content}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.patternArrow}>
                      <ArrowRight size={16} color="#d97706" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Thinking Patterns Section */}
        <View style={styles.patternsCard}>
          {/* Background accent */}
          <View style={styles.patternsAccent} />
          
          <View style={styles.patternsHeader}>
            <LinearGradient
              colors={['#bae6fd', '#7dd3fc']}
              style={styles.patternsIcon}
            >
              <Lightbulb size={24} color="#1e40af" />
            </LinearGradient>
            <View style={styles.patternsTitleContainer}>
              <Text style={styles.patternsTitle}>Thinking Patterns</Text>
              <Text style={styles.patternsSubtitle}>Recognize & transform your thoughts</Text>
            </View>
          </View>

          <View style={styles.patternsContainer}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading your insights...</Text>
              </View>
            ) : displayPatterns.length > 0 ? (
              displayPatterns.map((pattern) => (
                <TouchableOpacity
                  key={pattern.id}
                  onPress={() => onInsightClick('pattern', pattern)}
                  style={styles.patternCard}
                  activeOpacity={0.9}
                >
                  <View style={styles.patternContent}>
                    <View style={styles.patternContentLeft}>
                      <Text style={styles.patternName}>
                        {pattern.distortionTypes[0] || 'Thought Pattern'}
                      </Text>
                      <Text style={styles.patternDescription}>
                        {pattern.context || `Confidence: ${Math.round(pattern.confidence * 100)}%`}
                      </Text>
                      
                      <View style={styles.thoughtContainer}>
                        <View style={styles.originalThought}>
                          <Text style={styles.thoughtText}>
                            "{pattern.originalThought}"
                          </Text>
                        </View>
                        <View style={styles.reframedThought}>
                          <Text style={styles.reframedText}>
                            "{pattern.reframedThought}"
                          </Text>
                        </View>
                      </View>
                      
                      {pattern.distortionTypes.length > 1 && (
                        <View style={styles.distortionTags}>
                          {pattern.distortionTypes.slice(1, 3).map((distortion, index) => (
                            <View key={index} style={styles.distortionTag}>
                              <Text style={styles.distortionTagText}>
                                {distortion}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                    <View style={styles.patternArrow}>
                      <ArrowRight size={16} color="#1e40af" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>
                  Start a conversation to discover your thought patterns! 🌱
                </Text>
              </View>
            )}
          </View>

          <View style={styles.viewAllContainer}>
            <TouchableOpacity
              onPress={() => onInsightClick('patterns')}
              style={styles.viewAllButton}
              activeOpacity={0.7}
            >
              <Text style={styles.viewAllText}>
                View all patterns
              </Text>
            </TouchableOpacity>
          </View>
        </View>

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
      </ScrollView>
    </SafeAreaWrapper>
  );
};



export default InsightsDashboard;