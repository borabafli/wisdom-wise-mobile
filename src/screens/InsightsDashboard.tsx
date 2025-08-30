import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Brain, TrendingUp, Target, CheckCircle2, Lightbulb, ArrowRight, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { insightService, ThoughtPattern } from '../services/insightService';

const { width, height } = Dimensions.get('window');

interface InsightsDashboardProps {
  onInsightClick: (type: string, insight?: any) => void;
}

const InsightsDashboard: React.FC<InsightsDashboardProps> = ({ onInsightClick }) => {
  const [thinkingPatterns, setThinkingPatterns] = useState<ThoughtPattern[]>([]);
  const [insightStats, setInsightStats] = useState({
    totalPatterns: 0,
    commonDistortions: [] as { name: string; count: number }[],
    recentActivity: 0,
    confidenceAverage: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInsightData();
  }, []);

  const loadInsightData = async () => {
    try {
      setIsLoading(true);
      
      // Load recent thought patterns
      const recentPatterns = await insightService.getRecentPatterns(10);
      setThinkingPatterns(recentPatterns);
      
      // Load insight statistics
      const stats = await insightService.getInsightStats();
      setInsightStats(stats);
      
    } catch (error) {
      console.error('Error loading insight data:', error);
      // Fallback to mock data if needed
      setThinkingPatterns([]);
    } finally {
      setIsLoading(false);
    }
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
      title: 'Patterns Found',
      value: insightStats.totalPatterns.toString(),
      subtitle: 'Thought patterns identified',
      icon: Brain,
      trend: 'neutral'
    },
    {
      id: 2,
      title: 'Recent Activity',
      value: insightStats.recentActivity.toString(),
      subtitle: 'Patterns this week',
      icon: TrendingUp,
      trend: insightStats.recentActivity > 0 ? 'positive' : 'neutral'
    },
    {
      id: 3,
      title: 'Accuracy Score',
      value: Math.round(insightStats.confidenceAverage * 100) + '%',
      subtitle: 'AI confidence average',
      icon: Target,
      trend: insightStats.confidenceAverage > 0.7 ? 'positive' : 'neutral'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  watercolorBlob: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.3,
  },
  blob1: {
    top: 0,
    right: -80,
    width: 256,
    height: 256,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  blob2: {
    bottom: 0,
    left: -96,
    width: 384,
    height: 384,
    backgroundColor: 'rgba(125, 211, 252, 0.15)',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 18,
    color: '#64748b',
    marginTop: 8,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  journeyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(191, 219, 254, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    padding: 24,
    marginBottom: 24,
    overflow: 'hidden',
  },
  journeyAccent: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 96,
    height: 96,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 48,
    transform: [{ translateY: -48 }, { translateX: 48 }],
  },
  journeyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    zIndex: 10,
  },
  journeyIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  journeyTitleContainer: {
    flex: 1,
  },
  journeyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  journeySubtitle: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  statValueSky: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  suggestionCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
    zIndex: 10,
  },
  suggestionText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 22,
    fontWeight: '500',
  },
  suggestionBold: {
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  suggestionBoldBlue: {
    fontWeight: 'bold',
    color: '#1d4ed8',
  },
  insightsSection: {
    gap: 12,
    marginBottom: 24,
  },
  insightCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(191, 219, 254, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    padding: 16,
  },
  insightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  insightLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightText: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  insightSubtitle: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  insightRight: {
    alignItems: 'flex-end',
  },
  insightValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  insightValuePositive: {
    color: '#3b82f6',
  },
  insightValueNeutral: {
    color: '#0ea5e9',
  },
  patternsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(191, 219, 254, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    padding: 24,
    marginBottom: 24,
    overflow: 'hidden',
  },
  patternsAccent: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 128,
    height: 128,
    backgroundColor: 'rgba(125, 211, 252, 0.15)',
    borderRadius: 64,
    transform: [{ translateY: 64 }, { translateX: 64 }],
  },
  patternsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    zIndex: 10,
  },
  patternsIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  patternsTitleContainer: {
    flex: 1,
  },
  patternsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  patternsSubtitle: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  patternsContainer: {
    gap: 16,
  },
  patternCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    padding: 16,
    zIndex: 10,
  },
  patternContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  patternContentLeft: {
    flex: 1,
  },
  patternName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  patternDescription: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 12,
    lineHeight: 22,
    fontWeight: '500',
  },
  thoughtContainer: {
    gap: 12,
  },
  originalThought: {
    backgroundColor: 'rgba(254, 242, 242, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#fca5a5',
  },
  thoughtText: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  reframedThought: {
    backgroundColor: 'rgba(240, 253, 244, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#86efac',
  },
  reframedText: {
    fontSize: 14,
    color: '#374151',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  patternArrow: {
    marginLeft: 16,
    opacity: 0.7,
  },
  viewAllContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(226, 232, 240, 0.6)',
  },
  viewAllButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
  },
  viewAllText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
  achievementsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(191, 219, 254, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    padding: 24,
    marginBottom: 24,
    overflow: 'hidden',
  },
  achievementsAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 80,
    height: 80,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 40,
    transform: [{ translateY: -40 }, { translateX: -40 }],
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
    zIndex: 10,
  },
  achievementsList: {
    gap: 8,
    zIndex: 10,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  achievementText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  emptyStateContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 246, 255, 0.5)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
  },
  distortionTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  distortionTag: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  distortionTagText: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '600',
  },
});

export default InsightsDashboard;