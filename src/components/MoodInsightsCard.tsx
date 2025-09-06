import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { TrendingUp, Heart, Star, Clock, MessageCircle, BarChart3 } from 'lucide-react-native';
import { MoodChart, WeeklyMoodComparison } from './MoodChart';
import { moodInsightsService, type MoodInsightsData } from '../services/moodInsightsService';
import { moodRatingService } from '../services/moodRatingService';
import { memoryService } from '../services/memoryService';
import { insightsDashboardStyles as styles } from '../styles/components/InsightsDashboard.styles';
import { generateSampleMoodData } from '../utils/sampleMoodData';

interface MoodInsightsCardProps {
  onInsightPress?: (insightId: string) => void;
}

interface DataAvailability {
  hasSessionSummaries: boolean;
  hasMoodRatings: boolean;
  sessionCount: number;
  moodRatingCount: number;
}

export const MoodInsightsCard: React.FC<MoodInsightsCardProps> = ({ onInsightPress }) => {
  const [insights, setInsights] = useState<MoodInsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFullChart, setShowFullChart] = useState(false);
  const [dataAvailability, setDataAvailability] = useState<DataAvailability>({
    hasSessionSummaries: false,
    hasMoodRatings: false,
    sessionCount: 0,
    moodRatingCount: 0
  });

  useEffect(() => {
    loadInsights();
  }, []);

  const checkDataAvailability = async (): Promise<DataAvailability> => {
    try {
      // Check session summaries from last 14 days
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
      
      const sessionSummaries = await memoryService.getSessionSummaries();
      const recentSessions = sessionSummaries.filter(session => 
        new Date(session.date) >= fourteenDaysAgo
      );

      // Check mood ratings from last 14 days  
      const allRatings = await moodRatingService.getAllRatings();
      const recentRatings = allRatings.filter(rating =>
        new Date(rating.timestamp) >= fourteenDaysAgo
      );

      return {
        hasSessionSummaries: recentSessions.length > 0,
        hasMoodRatings: recentRatings.length > 0,
        sessionCount: recentSessions.length,
        moodRatingCount: recentRatings.length
      };
    } catch (error) {
      console.error('Error checking data availability:', error);
      return {
        hasSessionSummaries: false,
        hasMoodRatings: false,
        sessionCount: 0,
        moodRatingCount: 0
      };
    }
  };

  const loadInsights = async () => {
    try {
      // First check what data we have available
      const availability = await checkDataAvailability();
      console.log('Data availability:', availability);
      setDataAvailability(availability);

      // Only generate insights if we have actual data
      if (availability.hasSessionSummaries || availability.hasMoodRatings) {
        const insightsData = await moodInsightsService.generateMoodInsights();
        console.log('Generated insights:', insightsData);
        // Only set insights if they contain real data (not fallbacks)
        if (insightsData.sessionsAnalyzed > 0) {
          setInsights(insightsData);
        }
      } else {
        console.log('No data available for insights');
      }
    } catch (error) {
      console.error('Error loading mood insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderEmptyStateContent = () => {
    const { hasSessionSummaries, hasMoodRatings, sessionCount, moodRatingCount } = dataAvailability;
    
    // No data at all
    if (!hasSessionSummaries && !hasMoodRatings) {
      return (
        <>
          <MessageCircle size={32} color="#8B5CF6" />
          <Text style={{
            fontSize: 16,
            color: '#374151',
            textAlign: 'center',
            marginTop: 12,
            fontWeight: '600',
            lineHeight: 24,
          }}>
            Start your wellness journey! ✨
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#6b7280',
            textAlign: 'center',
            marginTop: 8,
            lineHeight: 20,
            marginBottom: 20,
          }}>
            Chat with Anu or track your mood after exercises to see personalized insights here
          </Text>
          
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#8B5CF6',
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 20,
                shadowColor: '#8B5CF6',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
              }}
              activeOpacity={0.8}
            >
              <Text style={{
                color: 'white',
                fontSize: 13,
                fontWeight: '500',
              }}>
                Chat with Anu
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                backgroundColor: '#6366F1',
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 20,
                shadowColor: '#6366F1',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
              }}
              activeOpacity={0.8}
            >
              <Text style={{
                color: 'white',
                fontSize: 13,
                fontWeight: '500',
              }}>
                Try Exercise
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Sample Data Button - Development Only */}
          {__DEV__ && (
            <TouchableOpacity
              onPress={async () => {
                setLoading(true);
                await generateSampleMoodData();
                await loadInsights();
                setLoading(false);
              }}
              style={{
                marginTop: 16,
                backgroundColor: '#A78BFA',
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 20,
                shadowColor: '#A78BFA',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
              }}
              activeOpacity={0.8}
            >
              <Text style={{
                color: 'white',
                fontSize: 13,
                fontWeight: '500',
              }}>
                Generate Sample Data
              </Text>
            </TouchableOpacity>
          )}
        </>
      );
    }
    
    // Has mood ratings only
    if (!hasSessionSummaries && hasMoodRatings) {
      return (
        <>
          <BarChart3 size={32} color="#6366F1" />
          <Text style={{
            fontSize: 16,
            color: '#374151',
            textAlign: 'center',
            marginTop: 12,
            fontWeight: '600',
            lineHeight: 24,
          }}>
            Great job tracking your mood! 📈
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#6b7280',
            textAlign: 'center',
            marginTop: 8,
            lineHeight: 20,
            marginBottom: 20,
          }}>
            You've logged {moodRatingCount} mood {moodRatingCount === 1 ? 'rating' : 'ratings'}. Chat with Anu to unlock personalized insights about your patterns.
          </Text>
          
          <TouchableOpacity
            style={{
              backgroundColor: '#8B5CF6',
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 20,
              shadowColor: '#8B5CF6',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
            }}
            activeOpacity={0.8}
          >
            <Text style={{
              color: 'white',
              fontSize: 13,
              fontWeight: '500',
            }}>
              Chat with Anu
            </Text>
          </TouchableOpacity>
        </>
      );
    }
    
    // Has sessions only  
    if (hasSessionSummaries && !hasMoodRatings) {
      return (
        <>
          <Heart size={32} color="#8B5CF6" />
          <Text style={{
            fontSize: 16,
            color: '#374151',
            textAlign: 'center',
            marginTop: 12,
            fontWeight: '600',
            lineHeight: 24,
          }}>
            Nice progress with Anu! 💬
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#6b7280',
            textAlign: 'center',
            marginTop: 8,
            lineHeight: 20,
            marginBottom: 20,
          }}>
            You've had {sessionCount} conversation{sessionCount === 1 ? '' : 's'}. Rate your mood after exercises to see weekly trends and deeper insights.
          </Text>
          
          <TouchableOpacity
            style={{
              backgroundColor: '#6366F1',
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 20,
              shadowColor: '#6366F1',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
            }}
            activeOpacity={0.8}
          >
            <Text style={{
              color: 'white',
              fontSize: 13,
              fontWeight: '500',
            }}>
              Try an Exercise
            </Text>
          </TouchableOpacity>
        </>
      );
    }
    
    // Has both data types but insights didn't generate - show encouragement to continue
    if (hasSessionSummaries && hasMoodRatings) {
      return (
        <>
          <Star size={32} color="#8B5CF6" />
          <Text style={{
            fontSize: 16,
            color: '#374151',
            textAlign: 'center',
            marginTop: 12,
            fontWeight: '600',
            lineHeight: 24,
          }}>
            Keep building your insights! ⭐
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#6b7280',
            textAlign: 'center',
            marginTop: 8,
            lineHeight: 20,
            marginBottom: 20,
          }}>
            You have {sessionCount} conversations and {moodRatingCount} mood ratings. Continue your journey for deeper insights.
          </Text>
        </>
      );
    }

    // Should not reach here, but fallback
    return (
      <>
        <MessageCircle size={32} color="#8B5CF6" />
        <Text style={{
          fontSize: 16,
          color: '#374151',
          textAlign: 'center',
          marginTop: 12,
          fontWeight: '600',
          lineHeight: 24,
        }}>
          Checking your data... ✨
        </Text>
      </>
    );
  };

  if (loading) {
    return (
      <View style={[styles.insightCard, { alignItems: 'center', justifyContent: 'center', minHeight: 200 }]}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={{ color: '#64748b', fontSize: 14, marginTop: 12 }}>
          Analyzing your mood patterns...
        </Text>
      </View>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strength': return <Star size={16} color="#22c55e" />;
      case 'progress': return <TrendingUp size={16} color="#3b82f6" />;
      case 'growth': return <Heart size={16} color="#8b5cf6" />;
      case 'clarity': return <Clock size={16} color="#f59e0b" />;
      default: return <Star size={16} color="#6b7280" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strength': return '#22c55e';
      case 'progress': return '#3b82f6';
      case 'growth': return '#8b5cf6';
      case 'clarity': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <View style={styles.insightCard}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardTitle}>Mood Insights</Text>
          <Text style={styles.cardSubtitle}>
            {insights ? `${insights.sessionsAnalyzed} sessions analyzed` : 'Your emotional wellness'}
          </Text>
        </View>
        <TouchableOpacity 
          onPress={() => setShowFullChart(!showFullChart)}
          style={styles.chartToggleButton}
          activeOpacity={0.7}
        >
          <Text style={styles.chartToggleButtonText}>
            {showFullChart ? 'Hide' : 'View'} Chart
          </Text>
        </TouchableOpacity>
      </View>

      {/* Weekly Mood Comparison - Always visible */}
      <WeeklyMoodComparison style={{ marginBottom: 20 }} />

      {/* Full Chart - Toggle visibility */}
      {showFullChart && (
        <View style={{ marginBottom: 20 }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#374151',
            marginBottom: 12,
            textAlign: 'center'
          }}>
            Mood Over Time
          </Text>
          <MoodChart days={14} height={200} />
        </View>
      )}

      {/* Insights Highlights */}
      <View>
        <Text style={{
          fontSize: 16,
          fontWeight: '600',
          color: '#374151',
          marginBottom: 16,
        }}>
          Recent Highlights
        </Text>

        {insights?.highlights.length ? (
          <View style={{ gap: 12 }}>
            {insights.highlights.map((insight, index) => (
              <TouchableOpacity
                key={insight.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#f8fafc',
                  borderRadius: 12,
                  padding: 16,
                  borderLeftWidth: 4,
                  borderLeftColor: getCategoryColor(insight.category),
                }}
                onPress={() => onInsightPress?.(insight.id)}
                activeOpacity={0.7}
              >
                <View style={{ marginRight: 12 }}>
                  {getCategoryIcon(insight.category)}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: '#374151',
                    lineHeight: 20,
                  }}>
                    {insight.text}
                  </Text>
                  {insight.confidence > 0.7 && (
                    <View style={{
                      backgroundColor: getCategoryColor(insight.category),
                      borderRadius: 10,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      alignSelf: 'flex-start',
                      marginTop: 6,
                    }}>
                      <Text style={{
                        fontSize: 10,
                        color: 'white',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                      }}>
                        High Confidence
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 32,
            paddingHorizontal: 20,
          }}>
            {renderEmptyStateContent()}
          </View>
        )}
      </View>

      {/* Refresh Button */}
      <TouchableOpacity
        onPress={loadInsights}
        style={{
          marginTop: 20,
          backgroundColor: '#f1f5f9',
          borderRadius: 8,
          paddingVertical: 10,
          alignItems: 'center',
        }}
        activeOpacity={0.7}
      >
        <Text style={{
          fontSize: 12,
          color: '#64748b',
          fontWeight: '500',
        }}>
          Refresh Insights
        </Text>
      </TouchableOpacity>

      {/* Analysis Date */}
      {insights?.analysisDate && (
        <Text style={{
          fontSize: 10,
          color: '#9ca3af',
          textAlign: 'center',
          marginTop: 8,
        }}>
          Last updated: {new Date(insights.analysisDate).toLocaleDateString()}
        </Text>
      )}
    </View>
  );
};