import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Line, Circle, Path, Defs, LinearGradient, Stop, Filter, FeGaussianBlur, FeMorphology, FeFlood, FeComposite } from 'react-native-svg';
import { moodRatingService, type MoodStats } from '../services/moodRatingService';
import { moodChartStyles as styles } from '../styles/components/MoodChart.styles';

const { width: screenWidth } = Dimensions.get('window');

interface MoodChartProps {
  height?: number;
  showEmojis?: boolean;
  style?: any;
  days?: number;
}

export const MoodChart: React.FC<MoodChartProps> = ({ 
  height = 220, 
  showEmojis = true,
  style,
  days = 14
}) => {
  const [moodData, setMoodData] = useState<{ date: string; rating: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMoodData();
  }, [days]);

  const generateDateSequence = (days: number) => {
    const today = new Date();
    const sequence = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      sequence.push(date.toISOString().split('T')[0]);
    }
    
    return sequence;
  };

  const loadMoodData = async () => {
    try {
      const stats = await moodRatingService.getMoodStats();
      const dateSequence = generateDateSequence(days);
      
      // Create a map of existing data
      const dataMap = new Map();
      stats.moodTrend.forEach(item => {
        dataMap.set(item.date, item.rating);
      });
      
      // Fill gaps with null values and ensure proper sequence
      const filledData = dateSequence.map(date => ({
        date,
        rating: dataMap.get(date) || null
      }));
      
      // Filter out null values for display, but keep structure
      const validData = filledData.filter(item => item.rating !== null);
      
      setMoodData(validData);
    } catch (error) {
      console.error('Error loading mood data:', error);
      setMoodData([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { height }, style]}>
        <Text style={styles.loadingText}>Loading mood data...</Text>
      </View>
    );
  }

  // Mobile-first width calculation with aggressive padding
  const containerPadding = 80; // More aggressive padding for mobile
  const chartWidth = Math.min(screenWidth - containerPadding, 320); // Cap max width
  const chartHeight = height - 80;
  
  // Mobile-optimized padding calculations  
  const paddingLeft = showEmojis ? 40 : 16;
  const paddingRight = 30; // Extra right padding for mobile safety
  const paddingTop = 24;
  const paddingBottom = 40;
  
  const graphWidth = Math.max(180, chartWidth - paddingLeft - paddingRight);
  const graphHeight = Math.max(120, chartHeight - paddingTop - paddingBottom);
  

  if (!moodData.length) {
    return (
      <View style={[styles.emptyContainer, { height }, style]}>
        <Text style={styles.emptyTitle}>No mood data available</Text>
        <Text style={styles.emptySubtitle}>Track your mood to see insights here</Text>
      </View>
    );
  }

  // Calculate chart coordinates
  const minValue = 0;
  const maxValue = 5;
  const valueRange = maxValue - minValue;
  
  const xStep = moodData.length > 1 ? graphWidth / (moodData.length - 1) : 0;
  
  // Generate path for mood line with bounds checking
  const pathData = moodData.map((item, index) => {
    const x = Math.min(paddingLeft + graphWidth, paddingLeft + (index * xStep));
    const y = paddingTop + graphHeight - ((item.rating - minValue) / valueRange) * graphHeight;
    return { x, y, value: item.rating, date: item.date };
  });
  
  // Generate labels from dates with better spacing
  const generateLabels = () => {
    if (moodData.length <= 4) {
      // Show all labels for small datasets
      return moodData.map(item => {
        const date = new Date(item.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      });
    } else {
      // Show fewer labels for larger datasets to prevent overlap
      const step = Math.ceil(moodData.length / 4);
      return moodData.map((item, index) => {
        if (index % step === 0 || index === moodData.length - 1) {
          const date = new Date(item.date);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
        return '';
      });
    }
  };

  const labels = generateLabels();

  // Create smooth curve path
  const createSmoothPath = () => {
    if (pathData.length < 2) return `M${pathData[0]?.x || 0},${pathData[0]?.y || 0}`;
    
    let smoothPath = `M${pathData[0].x},${pathData[0].y}`;
    
    for (let i = 1; i < pathData.length; i++) {
      const current = pathData[i];
      const previous = pathData[i - 1];
      
      if (i === pathData.length - 1) {
        smoothPath += ` L${current.x},${current.y}`;
      } else {
        const next = pathData[i + 1];
        const cp1x = previous.x + (current.x - previous.x) * 0.6;
        const cp1y = previous.y;
        const cp2x = current.x - (next.x - current.x) * 0.6;
        const cp2y = current.y;
        
        smoothPath += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${current.x},${current.y}`;
      }
    }
    
    return smoothPath;
  };
  
  // Create area path for gradient fill
  const createAreaPath = () => {
    const linePath = createSmoothPath();
    const lastPoint = pathData[pathData.length - 1];
    const firstPoint = pathData[0];
    return `${linePath} L${lastPoint.x},${paddingTop + graphHeight} L${firstPoint.x},${paddingTop + graphHeight} Z`;
  };
  
  // Y-axis emoji positions aligned with actual chart scale
  const emojiPositions = [
    { 
      rating: 5, 
      emoji: '😊', 
      y: paddingTop + graphHeight - ((5 - 0) / 5) * graphHeight
    },
    { 
      rating: 4, 
      emoji: '🙂', 
      y: paddingTop + graphHeight - ((4 - 0) / 5) * graphHeight 
    },
    { 
      rating: 3, 
      emoji: '😐', 
      y: paddingTop + graphHeight - ((3 - 0) / 5) * graphHeight 
    },
    { 
      rating: 2, 
      emoji: '😕', 
      y: paddingTop + graphHeight - ((2 - 0) / 5) * graphHeight 
    },
    { 
      rating: 1, 
      emoji: '😞', 
      y: paddingTop + graphHeight - ((1 - 0) / 5) * graphHeight 
    },
    { 
      rating: 0, 
      emoji: '😢', 
      y: paddingTop + graphHeight - ((0 - 0) / 5) * graphHeight 
    }
  ];
  
  return (
    <View style={[styles.chartContainer, { 
      height, 
      width: chartWidth, 
      overflow: 'hidden',
      padding: 0 // Override default padding
    }, style]}>
      <Svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
        <Defs>
          {/* Therapeutic line gradient */}
          <LinearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={styles.colors.lineGradient.start} stopOpacity="0.6" />
            <Stop offset="50%" stopColor={styles.colors.lineGradient.middle} stopOpacity="0.8" />
            <Stop offset="100%" stopColor={styles.colors.lineGradient.end} stopOpacity="1" />
          </LinearGradient>
          
          {/* Calming area gradient */}
          <LinearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={styles.colors.areaGradient.start} stopOpacity="0.4" />
            <Stop offset="50%" stopColor={styles.colors.areaGradient.middle} stopOpacity="0.2" />
            <Stop offset="100%" stopColor={styles.colors.areaGradient.end} stopOpacity="0.05" />
          </LinearGradient>
          
          {/* Gentle glow effect */}
          <Filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <FeGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <FeFlood floodColor={styles.colors.glow} floodOpacity="0.3"/>
            <FeComposite in="SourceGraphic" operator="over"/>
          </Filter>
          
          {/* Soft shadow effect */}
          <Filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <FeGaussianBlur stdDeviation="1.5" result="blur"/>
            <FeFlood floodColor={styles.colors.shadow} floodOpacity="0.15"/>
            <FeComposite in="SourceGraphic" operator="over"/>
          </Filter>
        </Defs>
        
        {/* Calming background grid lines */}
        {emojiPositions.map((pos, index) => (
          <Line
            key={`grid-${index}`}
            x1={paddingLeft}
            y1={pos.y}
            x2={paddingLeft + graphWidth}
            y2={pos.y}
            stroke={styles.colors.gridLines}
            strokeWidth={0.8}
            strokeDasharray="3,6"
            opacity={0.4}
          />
        ))}
        
        
        {/* Gentle shadow line */}
        <Path
          d={createSmoothPath()}
          stroke={styles.colors.glow}
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#shadow)"
          opacity={0.3}
        />
        
        {/* Main therapeutic line with soft glow */}
        <Path
          d={createSmoothPath()}
          stroke="url(#lineGradient)"
          strokeWidth={3.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        />
        
        {/* Calming data points */}
        {pathData.map((point, index) => (
          <Circle
            key={`point-${index}`}
            cx={point.x}
            cy={point.y}
            r={5.5}
            fill={styles.colors.dataPointFill}
            stroke={styles.colors.dataPointStroke}
            strokeWidth={2.5}
            filter="url(#shadow)"
            opacity={0.95}
          />
        ))}
        
        {/* Gentle highlight circles */}
        {pathData.map((point, index) => (
          <Circle
            key={`highlight-${index}`}
            cx={point.x}
            cy={point.y}
            r={2.5}
            fill={styles.colors.dataPointHighlight}
          />
        ))}
      </Svg>
      
      {/* Mindful emoji Y-axis */}
      {showEmojis && (
        <View style={[styles.emojiContainer, {
          height: chartHeight,
          paddingVertical: paddingTop,
        }]}>
          {emojiPositions.map((pos, index) => (
            <Text
              key={`emoji-${index}`}
              style={[styles.emojiText, { 
                position: 'absolute',
                top: pos.y - 10,
                left: -2,
              }]}
            >
              {pos.emoji}
            </Text>
          ))}
        </View>
      )}
      
      {/* Gentle X-axis labels */}
      <View style={[styles.labelsContainer, {
        left: paddingLeft,
        right: paddingRight,
        width: graphWidth,
      }]}>
        {labels.map((label, index) => (
          <Text
            key={`label-${index}`}
            style={[styles.labelText, {
              width: graphWidth / labels.length,
              textAlign: index === 0 ? 'left' : 
                       index === labels.length - 1 ? 'right' : 'center'
            }]}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
};

// Weekly mood comparison bars
interface WeeklyMoodProps {
  style?: any;
}

export const WeeklyMoodComparison: React.FC<WeeklyMoodProps> = ({ style }) => {
  const [weeklyData, setWeeklyData] = useState<{
    currentWeek: { rating: number; label: string };
    previousWeek: { rating: number; label: string };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeeklyData();
  }, []);

  const loadWeeklyData = async () => {
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
      
      const currentWeekAvg = currentWeekRatings.length > 0
        ? currentWeekRatings.reduce((sum, r) => sum + r.moodRating, 0) / currentWeekRatings.length
        : 0;
        
      const previousWeekAvg = previousWeekRatings.length > 0
        ? previousWeekRatings.reduce((sum, r) => sum + r.moodRating, 0) / previousWeekRatings.length
        : 0;
      
      const getRatingLabel = (rating: number) => {
        if (rating >= 4.5) return 'Great';
        if (rating >= 3.5) return 'Good';
        if (rating >= 2.5) return 'Okay';
        if (rating >= 1.5) return 'Challenging';
        if (rating > 0) return 'Difficult';
        return 'No data';
      };
      
      setWeeklyData({
        currentWeek: {
          rating: currentWeekAvg,
          label: getRatingLabel(currentWeekAvg)
        },
        previousWeek: {
          rating: previousWeekAvg,
          label: getRatingLabel(previousWeekAvg)
        }
      });
    } catch (error) {
      console.error('Error loading weekly data:', error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <View style={[styles.loadingContainer, { height: 120 }, style]}>
        <Text style={styles.loadingText}>Loading weekly data...</Text>
      </View>
    );
  }

  // Don't show empty state for weekly comparison - always show the bars with emojis
  if (!weeklyData) {
    // Only show empty state if data couldn't be loaded at all
    return (
      <View style={[styles.emptyContainer, { height: 120 }, style]}>
        <Text style={styles.emptyTitle}>Loading weekly data...</Text>
      </View>
    );
  }

  
  const getMoodEmoji = (rating: number) => {
    if (rating >= 4.5) return '😊';
    if (rating >= 3.5) return '🙂';
    if (rating >= 2.5) return '😐';
    if (rating >= 1.5) return '😕';
    if (rating > 0) return '😞';
    return '😶'; // Neutral emoji for no data
  };
  
  return (
    <View style={[styles.weeklyContainer, style]}>
      {/* Unified comparison card */}
      <View style={styles.comparisonCard}>
        {/* Header with trend indicator */}
        <View style={styles.comparisonHeader}>
          <Text style={styles.comparisonTitle}>Weekly Progress</Text>
          {weeklyData.currentWeek.rating > weeklyData.previousWeek.rating && (
            <View style={styles.trendIndicator}>
              <Text style={styles.trendText}>↗ Improving</Text>
            </View>
          )}
          {weeklyData.currentWeek.rating === weeklyData.previousWeek.rating && (
            <View style={[styles.trendIndicator, { backgroundColor: '#F3F4F6' }]}>
              <Text style={[styles.trendText, { color: '#6B7280' }]}>→ Stable</Text>
            </View>
          )}
        </View>

        {/* Progress visualization - Side by side layout */}
        <View style={styles.progressVisualization}>
          <View style={styles.weeksRow}>
            {/* Previous week */}
            <View style={styles.weekSection}>
              <View style={styles.weekHeader}>
                <Text style={styles.weekPeriod}>Last Week</Text>
                <Text style={styles.moodEmoji}>{getMoodEmoji(weeklyData.previousWeek.rating)}</Text>
              </View>
              <Text style={styles.moodLabel}>{weeklyData.previousWeek.label}</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[styles.progressFill, styles.previousWeekFill, {
                    width: `${Math.max(10, (weeklyData.previousWeek.rating / 5) * 100)}%`
                  }]}
                />
              </View>
            </View>

            {/* Current week */}
            <View style={styles.weekSection}>
              <View style={styles.weekHeader}>
                <Text style={styles.weekPeriod}>This Week</Text>
                <Text style={styles.moodEmoji}>{getMoodEmoji(weeklyData.currentWeek.rating)}</Text>
              </View>
              <Text style={styles.moodLabel}>{weeklyData.currentWeek.label}</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[styles.progressFill, styles.currentWeekFill, {
                    width: `${Math.max(10, (weeklyData.currentWeek.rating / 5) * 100)}%`
                  }]}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};