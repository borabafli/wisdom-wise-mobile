import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, ImageBackground, FlatList, Dimensions, Animated } from 'react-native';
import { Image } from 'expo-image';
import { TrendingUp, Heart, Star, Clock, MessageCircle, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react-native';
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
  onInsightPress?: (insightId: string) => void;
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

  // Using the same explanations as the main dashboard
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
    'Magnification': 'Exaggerating the importance of problems',
    'Minimization': 'Downplaying positive experiences or accomplishments'
  };

  const getDistortionExplanation = (distortionType: string) => {
    return PATTERN_EXPLANATIONS[distortionType] || 'A common thinking pattern that may not reflect reality accurately.';
  };

  // Render a pattern card for the given pattern data
  const renderPatternCard = (pattern: any) => {
    if (!pattern) return null;

    return (
      <>
        {/* Explanation Container */}
        <View style={{
          marginHorizontal: 8,
          marginTop: 0,
          marginBottom: 20,
          alignItems: 'flex-start',
        }}>
          <View style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 16,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            minWidth: '90%',
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
                fontSize: 13,
                fontWeight: '600',
                color: '#374151',
                marginBottom: 4,
                fontFamily: 'Ubuntu-Medium',
              }}>
                {pattern.distortionTypes[0] || 'Thought Pattern'}
              </Text>
              <Text style={{
                fontSize: 11,
                color: '#6B7280',
                lineHeight: 16,
                fontFamily: 'Ubuntu-Light',
              }}>
                {getDistortionExplanation(pattern.distortionTypes[0])}
              </Text>
            </View>
          </View>
        </View>

        {/* Distorted Thought Container */}
        <View style={{
          marginHorizontal: '-20%',
          marginBottom: 20,
          marginTop: -5,
        }}>
          <ImageBackground
            source={require('../../assets/new-design/Homescreen/Thinking Patterns/distorted-thought-card-clean-6.png')}
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
              top: '8%',
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
                Distorted Thought
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
              bottom: '8%',
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
                }}>
                  {pattern.distortionTypes[0] || 'Pattern Type'}
                </Text>
              </View>

              <View style={{
                width: '40%',
                backgroundColor: 'transparent',
                paddingHorizontal: 6,
                paddingVertical: 6,
                alignItems: 'flex-start',
                justifyContent: 'center',
                minHeight: 36,
              }}>
                <Text style={{
                  fontSize: 13,
                  color: '#374151',
                  textAlign: 'left',
                  lineHeight: 15,
                }}>Not realistic</Text>
              </View>
            </View>

          </ImageBackground>
        </View>

        {/* Balanced Thought Container */}
        <View style={{
          marginHorizontal: '-20%',
          marginBottom: 20,
          marginTop: -5,
        }}>
          <ImageBackground
            source={require('../../assets/new-design/Homescreen/Thinking Patterns/balanced-thought-card-clean-7.png')}
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
            {/* Balanced Thought Label */}
            <View style={{
              position: 'absolute',
              top: '5%',
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
                Balanced Thought
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
              bottom: '8%',
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
                }}>More balanced</Text>
              </View>

              <View style={{
                width: '40%',
                backgroundColor: 'transparent',
                paddingHorizontal: 6,
                paddingVertical: 6,
                alignItems: 'flex-start',
                justifyContent: 'center',
                minHeight: 36,
              }}>
                <Text style={{
                  fontSize: 13,
                  color: '#374151',
                  textAlign: 'left',
                  lineHeight: 15,
                }}>More realistic</Text>
              </View>
            </View>

          </ImageBackground>
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
              Generate Sample Data
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
      {/* Mood Chart Card - Only contains the chart */}
      <ImageBackground
        source={require('../../assets/new-design/Homescreen/Cards/blue-card-high.png')}
        style={{
          marginHorizontal: 4,
          marginBottom: 20,
          minHeight: 320,
          justifyContent: 'flex-start',
          borderRadius: 20
        }}
        imageStyle={{ borderRadius: 20 }}
        resizeMode="stretch"
      >
        <View style={{ padding: 20, flex: 1 }}>
          {/* Header for mood chart */}
          <View style={[styles.patternsHeader, { marginBottom: 8 }]}>
            <View style={styles.patternsIcon}>
              <Image
                source={require('../../assets/new-design/Homescreen/Icons/distorted-thought-card-icon-1.png')}
                style={{ width: 50, height: 50 }}
                contentFit="contain"
              />
            </View>
            <View style={styles.patternsTitleContainer}>
              <Text style={[styles.patternsTitle, { fontFamily: 'Ubuntu-Medium' }]}>Your Mood</Text>
              <Text style={[styles.patternsSubtitle, { fontFamily: 'Ubuntu-Light' }]}>Track your emotions</Text>
            </View>
          </View>

          {/* Main Mood Chart */}
          <View style={{ marginTop: -8 }}>
            <MoodChart days={14} height={200} />
          </View>
        </View>
      </ImageBackground>

      {/* Weekly Progress Section - Simple with white boxes */}
      <View style={{ marginHorizontal: 16, marginBottom: 20 }}>
        {/* Header for weekly progress */}
        <View style={[styles.patternsHeader, { marginBottom: 16 }]}>
          <View style={styles.patternsIcon}>
            <Image
              source={require('../../assets/images/New Icons/new-3.png')}
              style={{ width: 50, height: 50 }}
              contentFit="contain"
            />
          </View>
          <View style={styles.patternsTitleContainer}>
            <Text style={[styles.patternsTitle, { fontFamily: 'Ubuntu-Medium' }]}>Weekly Progress</Text>
            <Text style={[styles.patternsSubtitle, { fontFamily: 'Ubuntu-Light' }]}>Your weekly trends</Text>
          </View>
        </View>

        {/* Weekly Mood Comparison with white boxes */}
        <WeeklyMoodComparison style={{ marginBottom: 0 }} />
      </View>

      {/* Header for Your Thought Patterns */}
      <View style={[styles.patternsHeader, { marginBottom: 16, marginHorizontal: 16 }]}>
        <View style={styles.patternsIcon}>
          <Image
            source={require('../../assets/images/New Icons/new-4.png')}
            style={{ width: 50, height: 50 }}
            contentFit="contain"
          />
        </View>
        <View style={styles.patternsTitleContainer}>
          <Text style={[styles.patternsTitle, { fontFamily: 'Ubuntu-Medium' }]}>Your Thought Patterns</Text>
          <Text style={[styles.patternsSubtitle, { fontFamily: 'Ubuntu-Light' }]}>Identify and reframe</Text>
        </View>
      </View>

      {/* Navigation Controls at Top */}
      {displayPatterns.length > 1 && (
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 16,
          marginBottom: 16,
        }}>
          <TouchableOpacity
            onPress={onPatternSwipeRight}
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
              color: '#374151',
              fontWeight: '500'
            }}>
              {currentPatternIndex + 1} of {displayPatterns.length}
            </Text>
            <Text style={{
              fontSize: 12,
              color: '#9CA3AF',
              marginTop: 2
            }}>
              Swipe to navigate
            </Text>
          </View>

          <TouchableOpacity
            onPress={onPatternSwipeLeft}
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

      {/* Arrow Overlay - Highest Z-Index Layer */}
      <View style={{
        position: 'absolute',
        top: '65%', // Position between the cards
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }], // Center the 50x50 arrow
        zIndex: 1000, // Highest layer
        pointerEvents: 'none', // Don't interfere with touch events
      }}>
        <Image
          source={require('../../assets/new-design/Homescreen/Thinking Patterns/arrow-1.png')}
          style={{
            width: 50,
            height: 50,
          }}
          contentFit="contain"
        />
      </View>

      {/* Separate card for insights */}
      <View style={[styles.patternsCard, { backgroundColor: 'transparent' }]}>

      {/* Insights Highlights */}
      <View style={{ paddingHorizontal: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#374151',
            fontFamily: 'Inter-SemiBold',
          }}>
            Recent Highlights
          </Text>
        </View>

        {insights?.highlights.length ? (
          <View style={{ gap: 12 }}>
            {insights.highlights.slice(0, 2).map((insight, index) => (
              <TouchableOpacity
                key={insight.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'rgba(248, 250, 252, 0.5)',
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
                        {getShortConfidenceLabel(insight.confidence, 'insight')}
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

      {/* Analysis Date */}
      {insights?.analysisDate && (
        <View style={{ alignItems: 'center', marginTop: 8 }}>
          <Text style={{
            fontSize: 10,
            color: '#9ca3af',
            textAlign: 'center',
          }}>
            Last updated: {new Date(insights.analysisDate).toLocaleDateString()}
          </Text>
          {insights && (
            <Text style={{
              fontSize: 10,
              color: '#9ca3af',
              textAlign: 'center',
              marginTop: 2,
            }}>
              {insights.sessionsAnalyzed} sessions tracked
            </Text>
          )}
        </View>
      )}
      </View>

    </>
  );
};