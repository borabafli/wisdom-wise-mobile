import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, ImageBackground, FlatList, Dimensions, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import { TrendingUp, Heart, Star, Clock, MessageCircle, BarChart3, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MoodChart, WeeklyMoodComparison } from './MoodChart';
import { moodInsightsService, type MoodInsightsData } from '../services/moodInsightsService';
import { moodRatingService } from '../services/moodRatingService';
import { memoryService } from '../services/memoryService';
import { insightsDashboardStyles as styles } from '../styles/components/InsightsDashboard.styles';
import { generateSampleMoodData } from '../utils/sampleMoodData';
import { generateSampleValuesData } from '../utils/sampleValuesData';
import { getShortConfidenceLabel } from '../utils/confidenceDisplay';

interface MoodInsightsCardProps {
  onInsightPress?: (type: string, data?: any) => void;
  displayPatterns?: any[];
  currentPatternIndex?: number;
  onPatternSwipeLeft?: () => void;
  onPatternSwipeRight?: () => void;
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
  onPatternSwipeRight
}) => {
  const { t } = useTranslation();
  const [insights, setInsights] = useState<MoodInsightsData | null>(null);

  // Helper function to determine font size based on text length
  // Baseline: current balanced thought length (~80-120 chars) = 15px
  const getDynamicFontSize = (text: string) => {
    const length = text.length;
    if (length <= 25) return 18;     // Very short text - much larger font
    if (length <= 50) return 16;
    if (length <= 115) return 14;     // Slightly longer - normal font
    if (length <= 225) return 13;     // Long text - smaller font
    return 12;                        // Very long text - smallest font
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
  const renderPatternCard = (pattern: any) => {
    if (!pattern) return null;

    return (
      <>
        {/* Explanation Container */}
        <View style={{
          marginHorizontal: 16,
          marginTop: 0,
          marginBottom: 20,
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: 'rgba(173, 216, 230, 0.15)',
            borderRadius: 20,
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
            width: '95%',
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
                {getPatternName(pattern.distortionTypes[0]) || t('insights.thinkingPatterns.thoughtPattern')}
              </Text>
              <Text style={{
                fontSize: 13,
                color: '#6B7280',
                lineHeight: 18,
                fontFamily: 'Ubuntu-Light',
              }}>
                {getDistortionExplanation(pattern.distortionTypes[0])}
              </Text>
            </View>
          </View>
        </View>

        {/* Distorted Thought Container */}
        <View style={{
          marginHorizontal: '-17%',
          marginBottom: 20,
          marginTop: -5,
        }}>
          <ImageBackground
            source={require('../../assets/new-design/Homescreen/Thinking Patterns/distorted-thought-card-clean8.png')}
            style={{
              minHeight: 200,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 12,
              overflow: 'visible',
            }}
            imageStyle={{ borderRadius: 12 }}
            resizeMode="cover"
          >
            {/* Distorted Thought Label */}
            <View style={{
              position: 'absolute',
              top: '9%',
              width: '100%',
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: 17,
                color: 'white',
                fontWeight: '600',
                fontFamily: 'Ubuntu-Medium',
                textAlign: 'center',
              }}>
                {t('insights.moodInsights.distortedThought')}
              </Text>
            </View>

            <View style={{
              paddingHorizontal: 8,
              paddingVertical: 15,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'transparent',
              marginTop: -20,
              width: '60%',
              alignSelf: 'center',
            }}>
              <Text style={{
                fontSize: getDynamicFontSize(`"${pattern.originalThought}"`),
                color: '#374151',
                fontWeight: '500',
                textAlign: 'center',
                fontFamily: 'Ubuntu-Regular',
              }}>
                "{pattern.originalThought}"
              </Text>
            </View>

            {/* Blue containers at bottom */}
            <View style={{
              position: 'absolute',
              bottom: '10%',
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              paddingHorizontal: '20%',
              marginLeft: '5%',
            }}>
              <View style={{
                width: '40%',
                backgroundColor: 'transparent',
                paddingHorizontal: 6,
                paddingVertical: 6,
                alignItems: 'flex-start',
                justifyContent: 'center',
                marginLeft: '2%',
                minHeight: 36,
              }}>
                <Text style={{
                  fontSize: 13,
                  color: '#374151',
                  textAlign: 'left',
                  lineHeight: 15,
                  fontFamily: 'Ubuntu-Medium',
                }}>
                  {pattern.distortionTypes[0] || 'Pattern Type'}
                </Text>
              </View>

            </View>

            {/* Arrow Overlay - Positioned relative to this container */}
            <View style={{
              position: 'absolute',
              bottom: -20,
              left: '75%',
              transform: [{ translateX: -23.5 }],
              zIndex: 1000,
              pointerEvents: 'none',
            }}>
              <Image
                source={require('../../assets/new-design/Homescreen/Thinking Patterns/arrow-1.png')}
                style={{
                  width: 47,
                  height: 47,
                }}
                contentFit="contain"
              />
            </View>

          </ImageBackground>
        </View>

        {/* Balanced Thought Container */}
        <View style={{
          marginHorizontal: '-18%',
          marginBottom: 10,
          marginTop: -15,
        }}>
          <ImageBackground
            source={require('../../assets/new-design/Homescreen/Thinking Patterns/balanced-thought-card-clean-7.png')}
            style={{
              minHeight: 220,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 12,
              overflow: 'visible',
            }}
            imageStyle={{ borderRadius: 12 }}
            resizeMode="cover"
          >
            {/* Balanced Thought Label */}
            <View style={{
              position: 'absolute',
              top: '10%',
              width: '100%',
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: 17,
                color: 'white',
                fontWeight: '600',
                fontFamily: 'Ubuntu-Medium',
                textAlign: 'center',
              }}>
                {t('insights.moodInsights.balancedThought')}
              </Text>
            </View>

            <View style={{
              paddingHorizontal: 8,
              paddingVertical: 15,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'transparent',
              marginTop: -29,
              width: '60%',
              alignSelf: 'center',
            }}>
              <Text style={{
                fontSize: getDynamicFontSize(`"${pattern.reframedThought}"`),
                color: '#374151',
                fontWeight: '500',
                textAlign: 'center',
                fontFamily: 'Ubuntu-Medium',
              }}>
                "{pattern.reframedThought}"
              </Text>
            </View>

            {/* Blue containers at bottom */}
            <View style={{
              position: 'absolute',
              bottom: '11%',
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              paddingHorizontal: '20%',
              marginLeft: '5%',
            }}>
              <View style={{
                width: '40%',
                backgroundColor: 'transparent',
                paddingHorizontal: 6,
                paddingVertical: 6,
                alignItems: 'flex-start',
                justifyContent: 'center',
                marginLeft: '2%',
                minHeight: 36,
              }}>
                <Text style={{
                  fontSize: 13,
                  color: '#374151',
                  textAlign: 'left',
                  lineHeight: 15,
                  fontFamily: 'Ubuntu-Medium',
                }}>{t('insights.moodInsights.moreBalanced')}</Text>
              </View>

            </View>

          </ImageBackground>
        </View>

        {/* Reflect on This Button */}
        <View style={{
          marginHorizontal: 16,
          marginTop: 8,
          marginBottom: 4,
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
      </>
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

        if (currentAvg > previousAvg) {
          setWeeklyTrend('improving');
        } else if (currentAvg === previousAvg) {
          setWeeklyTrend('steady');
        } else {
          setWeeklyTrend('declining');
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

      // Auto-generate sample data if no data exists (for demo purposes)
      if (!availability.hasSessionSummaries && !availability.hasMoodRatings) {
        console.log('No data found, auto-generating sample data...');
        const success = await generateSampleMoodData();
        if (success) {
          // Reload availability after generating sample data
          const newAvailability = await checkDataAvailability();
          setDataAvailability(newAvailability);

          if (newAvailability.hasSessionSummaries || newAvailability.hasMoodRatings) {
            const insightsData = await moodInsightsService.generateMoodInsights();
            console.log('Generated insights from sample data:', insightsData);
            if (insightsData.sessionsAnalyzed > 0) {
              setInsights(insightsData);
            }
          }
        }
      } else {
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

          {/* Sample Data Button */}
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
            }}
            activeOpacity={0.8}
          >
            <Text style={{
              color: 'white',
              fontSize: 13,
              fontWeight: '500',
            }}>
              {t('insights.moodInsights.emptyStates.noData.sampleButton')}
            </Text>
          </TouchableOpacity>
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
                }}>{t('insights.moodInsights.trackEmotions')}</Text>
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
            marginTop: 8,
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



    </>
  );
};