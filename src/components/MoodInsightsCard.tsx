import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, ImageBackground, FlatList, Dimensions, Animated, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import { TrendingUp, Heart, Star, Clock, MessageCircle, BarChart3, ChevronLeft, ChevronRight, ArrowRight, Trash2, X, Lightbulb } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MoodChart, WeeklyMoodComparison } from './MoodChart';
import { moodInsightsService, type MoodInsightsData } from '../services/moodInsightsService';
import { moodRatingService } from '../services/moodRatingService';
import { memoryService } from '../services/memoryService';
import { insightsDashboardStyles as styles } from '../styles/components/InsightsDashboard.styles';
import { generateSampleValuesData } from '../utils/sampleValuesData';
import { getShortConfidenceLabel } from '../utils/confidenceDisplay';

interface MoodInsightsCardProps {
  onInsightPress?: (type: string, data?: any) => void;
  displayPatterns?: any[];
  currentPatternIndex?: number;
  onPatternSwipeLeft?: () => void;
  onPatternSwipeRight?: () => void;
  onDeletePattern?: (patternId: string) => void;
}

interface DataAvailability {
  hasSessionSummaries: boolean;
  hasMoodRatings: boolean;
  sessionCount: number;
  moodRatingCount: number;
}

export const MoodInsightsCard: React.FC<MoodInsightsCardProps> = ({
  onInsightPress,
  displayPatterns = [],
  currentPatternIndex = 0,
  onPatternSwipeLeft,
  onPatternSwipeRight,
  onDeletePattern
}) => {
  const { t } = useTranslation();
  const [insights, setInsights] = useState<MoodInsightsData | null>(null);
  const [showExampleModal, setShowExampleModal] = useState(false);

  // Example pattern data for demonstration
  const examplePattern = {
    id: 'example_pattern',
    originalThought: "I completely messed up that presentation, I'm terrible at public speaking",
    reframedThought: "The presentation had some rough spots, but I also had good moments. I'm learning and improving.",
    distortionTypes: ['All-or-Nothing Thinking'],
    confidence: 0.9,
    timestamp: new Date().toISOString(),
    context: 'Example',
    extractedFrom: { sessionId: 'example', messageId: 'example' }
  };

  // Helper function to determine font size based on text length
  // Baseline: current balanced thought length (~80-120 chars) = 15px
  const getDynamicFontSize = (text: string, maxFontSize: number = 20, minFontSize: number = 12) => {
    const baseLength = 90; // Length before scaling kicks in
    const scalingFactor = 0.045; // Stronger scaling for longer passages

    let fontSize = maxFontSize - Math.max(0, text.length - baseLength) * scalingFactor;

    return Math.max(minFontSize, Math.min(maxFontSize, fontSize));
  };

  // Get pattern name and explanation using translation keys (same as InsightsDashboard)
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

  // Render a pattern card for the given pattern data
  // isExample: if true, hides interactive buttons (Reflect, Delete)
  const renderPatternCard = (pattern: any, isExample: boolean = false) => {
    if (!pattern) return null;

    return (
      <View style={{ position: 'relative' }}>

        {/* Distorted Thought Container */}
        <View style={{
          marginHorizontal: 16,
          marginBottom: 16,
          marginTop: 5,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible',
        }}>
          {/* Distorted Thought Label - Above Picture */}
          <View style={{
            marginBottom: -10,
            alignItems: 'center',
            width: '100%',
          }}>
            <Text style={{
              fontSize: 17,
              color: '#000000',
              fontWeight: '600',
              fontFamily: 'Ubuntu-Medium',
              textAlign: 'center',
            }}>
              {t('insights.moodInsights.distortedThought')}
            </Text>
          </View>

          <ImageBackground
            source={require('../../assets/images/distorted-new-4.png')}
            style={{
              width: Dimensions.get('window').width - 32,
              aspectRatio: 1.2,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}
            imageStyle={{ borderRadius: 8, opacity: 0.8 }}
            resizeMode="contain"
          >

            <View style={{
              paddingHorizontal: 16,
              paddingVertical: 14,
              justifyContent: 'center',
              alignItems: 'center',
              width: '78%',
              alignSelf: 'center',
              marginTop: -15,
              marginLeft: 12, // Nudge text to the right
            }}>
              <Text style={{
                fontSize: getDynamicFontSize(pattern.originalThought),
                color: '#374151',
                fontWeight: '500',
                textAlign: 'center',
                fontFamily: 'Ubuntu-Medium',
                lineHeight: getDynamicFontSize(pattern.originalThought) * 1.3,
              }}>
                {pattern.originalThought}
              </Text>
            </View>


            {/* Arrow Overlay - Much bigger floating in background */}
            <View style={{
              position: 'absolute',
              bottom: -105,
              left: '12%',
              transform: [{ translateX: -75 }],
              zIndex: 1,
              pointerEvents: 'none',
              opacity: 0.6,
            }}>
              <Image
                source={require('../../assets/images/arrow-red-green.png')}
                style={{
                  width: 155,
                  height: 155,
                }}
                contentFit="contain"
              />
            </View>

          </ImageBackground>
        </View>

        {/* Explanation Container - Between heading and image */}
        <View style={{
          marginHorizontal: 16,
          marginTop: -40,
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
                {pattern.distortionTypes && pattern.distortionTypes.length > 0 ? getPatternName(pattern.distortionTypes[0]) : t('insights.thinkingPatterns.thoughtPattern')}
              </Text>
              <Text style={{
                fontSize: 13,
                color: '#6B7280',
                lineHeight: 18,
                fontFamily: 'Ubuntu-Light',
              }}>
                {pattern.distortionTypes && pattern.distortionTypes.length > 0 ? getDistortionExplanation(pattern.distortionTypes[0]) : ''}
              </Text>
            </View>
        </View>

        {/* Balanced Thought Container */}
        <View style={{
          marginHorizontal: 16,
          marginBottom: 15,
          marginTop: 20,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible',
        }}>
          {/* Balanced Thought Label - Above Picture */}
          <View style={{
            marginBottom: 0,
            alignItems: 'center',
            width: '100%',
          }}>
            <Text style={{
              fontSize: 17,
              color: '#000000',
              fontWeight: '600',
              fontFamily: 'Ubuntu-Medium',
              textAlign: 'center',
            }}>
              {t('insights.moodInsights.balancedThought')}
            </Text>
          </View>

          <ImageBackground
            source={require('../../assets/images/balanced-new-4.png')}
            style={{
              width: Dimensions.get('window').width - 32,
              aspectRatio: 1.2,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginTop: -10, // Pull image up to reduce gap
            }}
            imageStyle={{ borderRadius: 8, opacity: 0.8 }}
            resizeMode="contain"
          >

            <View style={{
              paddingHorizontal: 16,
              paddingVertical: 14,
              justifyContent: 'center',
              alignItems: 'center',
              width: '78%',
              alignSelf: 'center',
            }}>
              <Text style={{
                fontSize: getDynamicFontSize(pattern.reframedThought),
                color: '#374151',
                fontWeight: '500',
                textAlign: 'center',
                fontFamily: 'Ubuntu-Medium',
                lineHeight: getDynamicFontSize(pattern.reframedThought) * 1.3,
              }}>
                {pattern.reframedThought}
              </Text>
            </View>


          </ImageBackground>
        </View>

        {/* Reflect on This Button - Only show for real patterns, not examples */}
        {!isExample && (
          <View style={{
            marginHorizontal: 16,
            marginTop: -25,
            marginBottom: 20,
          }}>
            <View style={{
              borderRadius: 12,
              padding: 2,
              overflow: 'hidden',
            }}>
              <LinearGradient
                colors={['#2B4A5C', '#5A7B8A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  borderRadius: 12,
                  padding: 2,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    const prompt = `I noticed that your thought "${pattern.originalThought}" might show a pattern of ${pattern.distortionTypes[0]?.toLowerCase() || 'cognitive distortion'}. Sometimes when we experience ${pattern.distortionTypes[0]?.toLowerCase() || 'cognitive distortions'}, it can make situations feel more challenging than they might actually be. Would you like to explore this specific thought pattern with me?`;
                    onInsightPress?.('thinking_pattern_reflection', {
                      originalThought: pattern.originalThought,
                      distortionType: pattern.distortionTypes[0] || 'Cognitive Distortion',
                      reframedThought: pattern.reframedThought,
                      prompt: prompt
                    });
                  }}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                  }}
                  activeOpacity={0.8}
                >
                  <MessageCircle
                    size={16}
                    color="#2B4A5C"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={{
                    color: '#2B4A5C',
                    fontSize: 14,
                    fontWeight: '500',
                    fontFamily: 'Ubuntu-Medium',
                    marginRight: 4,
                  }}>
                    {t('insights.moodInsights.reflectOnThis')}
                  </Text>
                  <ArrowRight size={14} color="#2B4A5C" />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        )}

        {/* Delete Button - Only show for real patterns, not examples */}
        {!isExample && onDeletePattern && pattern.id && !pattern.id.startsWith('mock_') && (
          <View style={{
            marginHorizontal: 16,
            marginTop: -8,
            marginBottom: 20,
            alignItems: 'center',
          }}>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onDeletePattern(pattern.id);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 8,
                paddingHorizontal: 12,
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Trash2 size={16} color="#2B4A5C" opacity={0.6} style={{ marginRight: 6 }} />
              <Text style={{
                color: '#2B4A5C',
                fontSize: 13,
                fontWeight: '500',
                opacity: 0.6,
              }}>
                Delete insight
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  // Modern FlatList approach with 3D effects
  const screenWidth = Dimensions.get('window').width;
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Sync FlatList with currentPatternIndex
  useEffect(() => {
    if (displayPatterns.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: currentPatternIndex,
        animated: true,
      });
    }
  }, [currentPatternIndex, displayPatterns.length]);

  // Handle FlatList scroll end
  const handleScrollEnd = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);

    if (pageNum !== currentPatternIndex) {
      if (pageNum > currentPatternIndex && onPatternSwipeLeft) {
        onPatternSwipeLeft();
      } else if (pageNum < currentPatternIndex && onPatternSwipeRight) {
        onPatternSwipeRight();
      }
    }
  };

  const [loading, setLoading] = useState(true);
  const [showFullChart, setShowFullChart] = useState(false);
  const [weeklyTrend, setWeeklyTrend] = useState<'improving' | 'steady' | 'declining' | null>(null);
  const [dataAvailability, setDataAvailability] = useState<DataAvailability>({
    hasSessionSummaries: false,
    hasMoodRatings: false,
    sessionCount: 0,
    moodRatingCount: 0
  });

  useEffect(() => {
    loadInsights();
    calculateWeeklyTrend();
  }, []);

  const calculateWeeklyTrend = async () => {
    try {
      const allRatings = await moodRatingService.getAllRatings();

      // Calculate current and previous week averages
      const now = new Date();
      const currentWeekStart = new Date(now);
      currentWeekStart.setDate(now.getDate() - now.getDay());
      currentWeekStart.setHours(0, 0, 0, 0);

      const previousWeekStart = new Date(currentWeekStart);
      previousWeekStart.setDate(previousWeekStart.getDate() - 7);

      const currentWeekRatings = allRatings.filter(rating => {
        const ratingDate = new Date(rating.timestamp);
        return ratingDate >= currentWeekStart;
      });

      const previousWeekRatings = allRatings.filter(rating => {
        const ratingDate = new Date(rating.timestamp);
        return ratingDate >= previousWeekStart && ratingDate < currentWeekStart;
      });

      if (currentWeekRatings.length > 0 && previousWeekRatings.length > 0) {
        const currentAvg = currentWeekRatings.reduce((sum, r) => sum + r.rating, 0) / currentWeekRatings.length;
        const previousAvg = previousWeekRatings.reduce((sum, r) => sum + r.rating, 0) / previousWeekRatings.length;

        // Add wiggle room: ±0.3 on 0-5 scale (6% tolerance)
        const threshold = 0.3;
        const difference = currentAvg - previousAvg;

        if (difference > threshold) {
          setWeeklyTrend('improving');
        } else if (difference < -threshold) {
          setWeeklyTrend('declining');
        } else {
          setWeeklyTrend('steady');
        }
      }
    } catch (error) {
      console.error('Error calculating weekly trend:', error);
    }
  };

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

      // REMOVED AUTO-GENERATION: Don't auto-generate sample data anymore
      // Users should see empty state if they have no data
      if (availability.hasSessionSummaries || availability.hasMoodRatings) {
        // Only generate insights if we have actual data
        const insightsData = await moodInsightsService.generateMoodInsights();
        console.log('Generated insights:', insightsData);
        // Only set insights if they contain real data (not fallbacks)
        if (insightsData.sessionsAnalyzed > 0) {
          setInsights(insightsData);
        }
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
            {t('insights.moodInsights.emptyStates.noData.title')}
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#6b7280',
            textAlign: 'center',
            marginTop: 8,
            lineHeight: 20,
            marginBottom: 20,
          }}>
            {t('insights.moodInsights.emptyStates.noData.description')}
          </Text>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#8B5CF6',
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 20,
              }}
              activeOpacity={0.8}
            >
              <Text style={{
                color: 'white',
                fontSize: 13,
                fontWeight: '500',
              }}>
                {t('insights.moodInsights.emptyStates.noData.chatButton')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: '#6366F1',
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 20,
              }}
              activeOpacity={0.8}
            >
              <Text style={{
                color: 'white',
                fontSize: 13,
                fontWeight: '500',
              }}>
                {t('insights.moodInsights.emptyStates.noData.exerciseButton')}
              </Text>
            </TouchableOpacity>
          </View>
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
            {t('insights.moodInsights.emptyStates.moodOnly.title')}
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#6b7280',
            textAlign: 'center',
            marginTop: 8,
            lineHeight: 20,
            marginBottom: 20,
          }}>
            {t('insights.moodInsights.emptyStates.moodOnly.description', { count: moodRatingCount })}
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: '#8B5CF6',
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 20,
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
            {t('insights.moodInsights.emptyStates.sessionsOnly.title')}
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#6b7280',
            textAlign: 'center',
            marginTop: 8,
            lineHeight: 20,
            marginBottom: 20,
          }}>
            {t('insights.moodInsights.emptyStates.sessionsOnly.description', { count: sessionCount })}
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: '#6366F1',
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 20,
            }}
            activeOpacity={0.8}
          >
            <Text style={{
              color: 'white',
              fontSize: 13,
              fontWeight: '500',
            }}>
              {t('insights.moodInsights.emptyStates.sessionsOnly.exerciseButton')}
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
            {t('insights.moodInsights.emptyStates.bothData.title')}
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#6b7280',
            textAlign: 'center',
            marginTop: 8,
            lineHeight: 20,
            marginBottom: 20,
          }}>
            {t('insights.moodInsights.emptyStates.bothData.description', { sessionCount, moodRatingCount })}
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
          {t('insights.moodInsights.emptyStates.fallback.title')}
        </Text>
      </>
    );
  };

  if (loading) {
    return (
      <View style={[styles.insightCard, { alignItems: 'center', justifyContent: 'center', minHeight: 200 }]}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={{ color: '#64748b', fontSize: 14, marginTop: 12 }}>
          {t('insights.moodInsights.analyzingPatterns')}
        </Text>
      </View>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strength': return <Star size={16} color="#87BAA3" />;
      case 'progress': return <TrendingUp size={16} color="#6BA087" />;
      case 'growth': return <Heart size={16} color="#A3C4B3" />;
      case 'clarity': return <Clock size={16} color="#5A8A6B" />;
      default: return <Star size={16} color="#87BAA3" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strength': return '#87BAA3'; // Main green
      case 'progress': return '#6BA087'; // Darker green
      case 'growth': return '#A3C4B3'; // Lighter green
      case 'clarity': return '#5A8A6B'; // Dark forest green
      default: return '#87BAA3'; // Default to main green
    }
  };

  return (
    <>
      {/* White Container around entire Your Mood section */}
      <View style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginHorizontal: 4,
        marginBottom: 20,
        overflow: 'hidden'
      }}>
        {/* Mood Chart section without background */}
        <View style={{
          minHeight: 320,
          justifyContent: 'flex-start',
          backgroundColor: 'transparent',
          position: 'relative'
        }}>
          {/* Background pattern in top left corner - using pattern-blue-2 */}
          <Image
            source={require('../../assets/new-design/Homescreen/Cards/pattern-blue-2.png')}
            style={{
              position: 'absolute',
              top: 0,
              left: -50,
              width: 180,
              height: 81,
              opacity: 1
            }}
            contentFit="contain"
          />

          <View style={{ padding: 20, flex: 1 }}>
            {/* Header for mood chart */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 32,
              marginLeft: 24,
              marginTop: 16,
              gap: 12
            }}>
              <Image
                source={require('../../assets/new-design/Homescreen/Icons/distorted-thought-card-icon-1.png')}
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
                }}>{t('insights.moodInsights.yourMood')}</Text>
                <Text style={{
                  fontSize: 14,
                  color: '#6B7280',
                  fontFamily: 'Ubuntu-Light',
                  marginTop: 2
                }}>{t('insights.moodInsights.trackMoodJourney')}</Text>
              </View>
            </View>

            {/* Main Mood Chart */}
            <View style={{ marginTop: -8 }}>
              <MoodChart days={14} height={200} />
            </View>
          </View>
        </View>

        {/* Weekly Progress Section - Inside white container */}
        <View style={{ padding: 16, backgroundColor: 'transparent' }}>
          {/* Weekly Mood Comparison with white boxes - moved up */}
          <WeeklyMoodComparison style={{ marginBottom: 12, marginTop: -8 }} />

          {/* Empty state encouragement message - only show when no data */}
          {(!dataAvailability.hasMoodRatings || dataAvailability.moodRatingCount === 0) && (
            <View style={{
              alignItems: 'center',
              marginTop: 8,
              marginBottom: 16,
              paddingHorizontal: 16,
            }}>
              <View style={{
                backgroundColor: 'rgba(90, 136, 181, 0.08)',
                borderRadius: 16,
                paddingVertical: 16,
                paddingHorizontal: 20,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'rgba(90, 136, 181, 0.15)',
              }}>
                <Text style={{
                  fontSize: 14,
                  color: '#5A88B5',
                  textAlign: 'center',
                  fontFamily: 'Ubuntu-Medium',
                  lineHeight: 20,
                  marginBottom: 4,
                }}>
                  {t('insights.moodInsights.emptyState.encouragement')}
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: '#6B7280',
                  textAlign: 'center',
                  fontFamily: 'Ubuntu-Light',
                  lineHeight: 18,
                }}>
                  {t('insights.moodInsights.emptyState.trackProgress')}
                </Text>
              </View>
            </View>
          )}

          {/* Centered weekly trend tag - moved below */}
          <View style={{ alignItems: 'center', marginBottom: 8 }}>
            {weeklyTrend === 'improving' && (
              <View style={{
                backgroundColor: '#5A88B5',
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}>
                <Text style={{
                  color: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: '600',
                  fontFamily: 'Ubuntu-Medium',
                }}>
                  {t('insights.moodInsights.weeklyTrend.improving')}
                </Text>
              </View>
            )}
            {weeklyTrend === 'steady' && (
              <View style={{
                backgroundColor: '#5A88B5',
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 6,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Text style={{
                  color: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: '600',
                  fontFamily: 'Ubuntu-Medium',
                }}>
                  {t('insights.moodInsights.weeklyTrend.steady')}
                </Text>
              </View>
            )}
            {weeklyTrend === 'declining' && (
              <View style={{
                backgroundColor: '#5A88B5',
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}>
                <Text style={{
                  color: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: '600',
                  fontFamily: 'Ubuntu-Medium',
                }}>
                  {t('insights.moodInsights.weeklyTrend.declining')}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* White Container around Your Thought Patterns section */}
      <View style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginHorizontal: 0,
        marginTop: 48,
        marginBottom: 20,
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Background pattern in top right corner */}
        <Image
          source={require('../../assets/new-design/Homescreen/Cards/pattern-blue-1.png')}
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

        {/* Header for Your Thought Patterns */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 32,
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

        {/* Empty State with "Show Example" Button */}
        {displayPatterns.length === 0 && (
          <View style={{
            marginHorizontal: 16,
            marginBottom: 32,
            alignItems: 'center',
            paddingVertical: 24,
            paddingHorizontal: 20,
          }}>
            <Lightbulb size={48} color="#5A88B5" style={{ marginBottom: 16 }} />
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#374151',
              textAlign: 'center',
              fontFamily: 'Ubuntu-Medium',
              marginBottom: 8,
            }}>
              {t('moodInsights.thoughtPatterns.emptyStateTitle')}
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#6B7280',
              textAlign: 'center',
              fontFamily: 'Ubuntu-Light',
              lineHeight: 20,
              marginBottom: 20,
            }}>
              {t('moodInsights.thoughtPatterns.emptyStateDescription')}
            </Text>

            {/* Buttons Row */}
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
              <TouchableOpacity
                onPress={() => setShowExampleModal(true)}
                style={{
                  backgroundColor: 'rgba(90, 136, 181, 0.1)',
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#5A88B5',
                }}
                activeOpacity={0.7}
              >
                <Text style={{
                  color: '#5A88B5',
                  fontSize: 14,
                  fontWeight: '600',
                  fontFamily: 'Ubuntu-Medium',
                }}>
                  {t('moodInsights.thoughtPatterns.seeExample')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onInsightPress?.('exercise', { type: 'automatic-thoughts' })}
                style={{
                  backgroundColor: '#5A88B5',
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 12,
                }}
                activeOpacity={0.8}
              >
                <Text style={{
                  color: '#FFFFFF',
                  fontSize: 14,
                  fontWeight: '600',
                  fontFamily: 'Ubuntu-Medium',
                }}>
                  {t('moodInsights.thoughtPatterns.startExercise')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Modern FlatList Swipeable Cards with 3D Effect */}
        {displayPatterns.length > 0 && (
          <Animated.FlatList
            ref={flatListRef}
            data={displayPatterns}
            renderItem={({ item, index }) => {
              const inputRange = [
                (index - 1) * screenWidth,
                index * screenWidth,
                (index + 1) * screenWidth,
              ];

              const scale = scrollX.interpolate({
                inputRange,
                outputRange: [0.95, 1, 0.95],
                extrapolate: 'clamp',
              });

              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.7, 1, 0.7],
                extrapolate: 'clamp',
              });

              const rotateY = scrollX.interpolate({
                inputRange,
                outputRange: ['15deg', '0deg', '-15deg'],
                extrapolate: 'clamp',
              });

              const translateX = scrollX.interpolate({
                inputRange,
                outputRange: [screenWidth * 0.05, 0, -screenWidth * 0.05],
                extrapolate: 'clamp',
              });

              return (
                <Animated.View style={{
                  width: screenWidth,
                  paddingHorizontal: 16,
                  transform: [
                    { scale },
                    { rotateY },
                    { translateX },
                    { perspective: 1000 }
                  ],
                  opacity,
                }}>
                  {renderPatternCard(item)}
                </Animated.View>
              );
            }}
            keyExtractor={(item, index) => `pattern-${index}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true }
            )}
            onMomentumScrollEnd={handleScrollEnd}
            snapToInterval={screenWidth}
            snapToAlignment="start"
            decelerationRate="fast"
            scrollEventThrottle={16}
            style={{ marginHorizontal: -16 }}
          />
        )}

        {/* Navigation Controls at Bottom */}
        {displayPatterns.length > 1 && (
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 24,
            marginTop: -5,
            marginBottom: 12,
          }}>
            <TouchableOpacity
              onPress={onPatternSwipeRight}
              disabled={currentPatternIndex === 0}
              style={{
                opacity: currentPatternIndex === 0 ? 0.3 : 1,
                padding: 6
              }}
            >
              <ChevronLeft size={32} color="#2B4A5C" />
            </TouchableOpacity>

            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: 16,
                color: '#2B4A5C',
                fontWeight: '600'
              }}>
                {currentPatternIndex + 1} of {displayPatterns.length}
              </Text>
            </View>

            <TouchableOpacity
              onPress={onPatternSwipeLeft}
              disabled={currentPatternIndex === displayPatterns.length - 1}
              style={{
                opacity: currentPatternIndex === displayPatterns.length - 1 ? 0.3 : 1,
                padding: 6
              }}
            >
              <ChevronRight size={32} color="#2B4A5C" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Example Modal */}
      <Modal
        visible={showExampleModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowExampleModal(false)}
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
            overflow: 'hidden',
          }}>
            {/* Header with EXAMPLE Badge */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 12,
              borderBottomWidth: 1,
              borderBottomColor: '#E5E7EB',
            }}>
              <View style={{
                backgroundColor: '#FEF3C7',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#F59E0B',
              }}>
                <Text style={{
                  color: '#D97706',
                  fontSize: 12,
                  fontWeight: '700',
                  fontFamily: 'Ubuntu-Medium',
                  letterSpacing: 0.5,
                }}>
                  EXAMPLE
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowExampleModal(false)}
                style={{ padding: 4 }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Scrollable Content */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {/* Info Message */}
              <View style={{
                marginHorizontal: 20,
                marginTop: 16,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderRadius: 12,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderLeftWidth: 4,
                borderLeftColor: '#3B82F6',
              }}>
                <Text style={{
                  fontSize: 13,
                  color: '#1E40AF',
                  fontFamily: 'Ubuntu-Medium',
                  lineHeight: 18,
                }}>
                  {t('moodInsights.thoughtPatterns.exampleModalInfo')}
                </Text>
              </View>

              {/* Example Pattern Card */}
              <View style={{ marginTop: 8 }}>
                {renderPatternCard(examplePattern, true)}
              </View>

              {/* Bottom Action Buttons */}
              <View style={{
                marginHorizontal: 20,
                marginTop: 8,
                gap: 12,
              }}>
                <LinearGradient
                  colors={['#2B4A5C', '#5A7B8A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    borderRadius: 12,
                    padding: 2,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setShowExampleModal(false);
                      onInsightPress?.('exercise', { type: 'automatic-thoughts' });
                    }}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingVertical: 14,
                      paddingHorizontal: 20,
                    }}
                    activeOpacity={0.8}
                  >
                    <MessageCircle
                      size={16}
                      color="#2B4A5C"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={{
                      color: '#2B4A5C',
                      fontSize: 15,
                      fontWeight: '600',
                      fontFamily: 'Ubuntu-Medium',
                    }}>
                      {t('moodInsights.thoughtPatterns.startExercise')}
                    </Text>
                    <ArrowRight size={16} color="#2B4A5C" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </>
  );
};