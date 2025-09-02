import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { Brain, TrendingUp, Target, CheckCircle2, Lightbulb, ArrowRight, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { insightService, ThoughtPattern } from '../services/insightService';
import { insightsDashboardStyles as styles } from '../styles/components/InsightsDashboard.styles';

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
    </SafeAreaWrapper>
  );
};



export default InsightsDashboard;