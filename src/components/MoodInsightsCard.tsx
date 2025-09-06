import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { TrendingUp, Heart, Star, Clock } from 'lucide-react-native';
import { MoodChart, WeeklyMoodComparison } from './MoodChart';
import { moodInsightsService, type MoodInsightsData } from '../services/moodInsightsService';
import { insightsDashboardStyles as styles } from '../styles/components/InsightsDashboard.styles';

interface MoodInsightsCardProps {
  onInsightPress?: (insightId: string) => void;
}

export const MoodInsightsCard: React.FC<MoodInsightsCardProps> = ({ onInsightPress }) => {
  const [insights, setInsights] = useState<MoodInsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFullChart, setShowFullChart] = useState(false);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      const insightsData = await moodInsightsService.generateMoodInsights();
      setInsights(insightsData);
    } catch (error) {
      console.error('Error loading mood insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.insightCard, { alignItems: 'center', justifyContent: 'center', minHeight: 200 }]}>
        <ActivityIndicator size="large" color="#3b82f6" />
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
          style={{
            backgroundColor: '#3b82f6',
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}
        >
          <Text style={{ color: 'white', fontSize: 12, fontWeight: '500' }}>
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
            paddingVertical: 20,
          }}>
            <Heart size={24} color="#9ca3af" />
            <Text style={{
              fontSize: 14,
              color: '#6b7280',
              textAlign: 'center',
              marginTop: 8,
            }}>
              Keep using the app to generate personalized insights
            </Text>
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