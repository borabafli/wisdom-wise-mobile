import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Image } from 'react-native';
import Svg, { Line, Circle, Path, Defs, LinearGradient, Stop, Filter, FeGaussianBlur, FeMorphology, FeFlood, FeComposite, Rect } from 'react-native-svg';
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
  showEmojis = false, // Clean design without emojis
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
      
      console.log('🎯 MoodChart Debug:');
      console.log('- Stats loaded:', stats);
      console.log('- Mood trend:', stats.moodTrend);
      console.log('- Total ratings:', stats.totalRatings);
      console.log('- Date sequence length:', dateSequence.length);
      
      // Create a map of existing data
      const dataMap = new Map();
      stats.moodTrend.forEach(item => {
        dataMap.set(item.date, item.rating);
      });
      
      console.log('- Data map size:', dataMap.size);
      console.log('- Data map entries:', Array.from(dataMap.entries()).slice(0, 5));
      
      // Fill gaps with null values and ensure proper sequence
      const filledData = dateSequence.map(date => ({
        date,
        rating: dataMap.get(date) || null
      }));
      
      // Filter out null values for display, but keep structure
      const validData = filledData.filter(item => item.rating !== null);
      
      console.log('- Valid data points:', validData.length);
      console.log('- Valid data sample:', validData.slice(0, 3));
      
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

  // Fixed chart dimensions to prevent width overflow
  const containerPadding = 40; // Increased container padding for better spacing
  const chartWidth = screenWidth - containerPadding; // Use remaining space after padding
  const chartHeight = height - 20; // Reduced to minimize top space
  
  // Padding with space for smiley Y-axis
  const paddingLeft = 60; // Increased space for new emoji images with more padding
  const paddingRight = 20; // Adequate padding
  const paddingTop = 20; // Reduced top padding
  const paddingBottom = 30; // Space for date labels
  
  const graphWidth = Math.max(200, chartWidth - paddingLeft - paddingRight);
  const graphHeight = Math.max(120, chartHeight - paddingTop - paddingBottom);
  

  if (!moodData.length) {
    return (
      <View style={[styles.emptyContainer, { height }, style]}>
        <Text style={styles.emptyTitle}>No mood data available</Text>
        <Text style={styles.emptySubtitle}>Track your mood to see insights here</Text>
      </View>
    );
  }

  // Calculate chart coordinates (mood scale 1-5)
  const minValue = 1;
  const maxValue = 5;
  const valueRange = maxValue - minValue;
  
  const xStep = moodData.length > 1 ? graphWidth / (moodData.length - 1) : 0;
  
  // Generate path for mood line with bounds checking
  const pathData = moodData.map((item, index) => {
    const x = Math.min(paddingLeft + graphWidth, paddingLeft + (index * xStep));
    const y = paddingTop + graphHeight - ((item.rating - minValue) / valueRange) * graphHeight;
    return { x, y, value: item.rating, date: item.date };
  });
  
  // Clean, consistent date labels
  const generateLabels = () => {
    // Always show exactly 4 labels for consistency: first, middle points, and last
    const labelIndices = [];
    if (moodData.length <= 4) {
      // Show all if we have 4 or fewer points
      labelIndices.push(...Array.from({length: moodData.length}, (_, i) => i));
    } else {
      // Always show first, two middle points, and last for consistency
      labelIndices.push(0);
      labelIndices.push(Math.floor(moodData.length / 3));
      labelIndices.push(Math.floor((moodData.length * 2) / 3));
      labelIndices.push(moodData.length - 1);
    }
    
    return moodData.map((item, index) => {
      if (labelIndices.includes(index)) {
        const date = new Date(item.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      return '';
    });
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

  // Smiley Y-axis positions (5 smileys for mood scale 1-5) - Using custom emoji images
  const smileyPositions = [
    { 
      mood: 5, 
      image: require('../../assets/images/emojis/5.png'), // Best
      y: paddingTop + graphHeight - ((5 - minValue) / valueRange) * graphHeight
    },
    { 
      mood: 4, 
      image: require('../../assets/images/emojis/4.png'), 
      y: paddingTop + graphHeight - ((4 - minValue) / valueRange) * graphHeight 
    },
    { 
      mood: 3, 
      image: require('../../assets/images/emojis/3.png'), // Neutral
      y: paddingTop + graphHeight - ((3 - minValue) / valueRange) * graphHeight 
    },
    { 
      mood: 2, 
      image: require('../../assets/images/emojis/2.png'), 
      y: paddingTop + graphHeight - ((2 - minValue) / valueRange) * graphHeight 
    },
    { 
      mood: 1, 
      image: require('../../assets/images/emojis/1.png'), // Lowest
      y: paddingTop + graphHeight - ((1 - minValue) / valueRange) * graphHeight 
    }
  ];
  
  return (
    <View style={[styles.chartContainer, { 
      height, 
      width: '100%', // Full width
      alignItems: 'center', // Center the chart
      justifyContent: 'center',
      overflow: 'visible', // Allow emojis to be visible
      padding: 0
    }, style]}>
      <View style={{
        width: chartWidth,
        height: chartHeight,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{marginLeft: 0}}>
          <Defs>
            {/* Solid line gradient - no edge fading */}
            <LinearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#87BAA3" stopOpacity="1" />
              <Stop offset="100%" stopColor="#87BAA3" stopOpacity="1" />
            </LinearGradient>
            
            {/* Area gradient fill with vertical fade and white edge fade */}
            <LinearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#87BAA3" stopOpacity="0.6" />
              <Stop offset="20%" stopColor="#87BAA3" stopOpacity="0.4" />
              <Stop offset="50%" stopColor="#87BAA3" stopOpacity="0.2" />
              <Stop offset="80%" stopColor="#87BAA3" stopOpacity="0.08" />
              <Stop offset="100%" stopColor="#87BAA3" stopOpacity="0" />
            </LinearGradient>
            
            {/* White fade gradients for left and right edges */}
            <LinearGradient id="leftFade" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="white" stopOpacity="1" />
              <Stop offset="100%" stopColor="white" stopOpacity="0" />
            </LinearGradient>
            
            <LinearGradient id="rightFade" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="white" stopOpacity="0" />
              <Stop offset="100%" stopColor="white" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          
          {/* Grid lines for mood levels 1-5 */}
          {[1, 2, 3, 4, 5].map((moodLevel) => {
            const y = paddingTop + graphHeight - ((moodLevel - minValue) / valueRange) * graphHeight;
            return (
              <Line
                key={`grid-${moodLevel}`}
                x1={paddingLeft}
                y1={y}
                x2={paddingLeft + graphWidth}
                y2={y}
                stroke="#D1D5DB"
                strokeWidth={0.5}
                opacity={0.8}
              />
            );
          })}
          
          {/* Clean solid line - thicker */}
          <Path
            d={createSmoothPath()}
            stroke="#87BAA3"
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* White fade overlays - REMOVED for transparency */}
          
          {/* Data points - solid, no fading */}
          {pathData.map((point, index) => {
            return (
              <Circle
                key={`point-${index}`}
                cx={point.x}
                cy={point.y}
                r={4}
                fill="#87BAA3"
                opacity={0.9}
              />
            );
          })}
        </Svg>
      
      {/* Smiley Y-axis indicators - properly positioned with padding */}
      <View style={{
        position: 'absolute',
        left: 5, // Space from edge
        top: 0,
        bottom: paddingBottom,
        width: 50, // Container for emoji images
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8, // More internal padding for spacing
      }}>
        {smileyPositions.map((smiley, index) => (
          <Image
            key={`smiley-${index}`}
            source={smiley.image}
            style={{
              position: 'absolute',
              top: smiley.y - 10, // Centered for 20px image
              left: 15, // Centered with padding and additional spacing
              width: 20, // Smaller size for better fit
              height: 20,
              opacity: 0.85,
              borderRadius: 10,
              shadowColor: '#87BAA3', // Sage green tint
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08, // Much lighter
              shadowRadius: 1.5,
              elevation: 1, // Lighter Android shadow
            }}
            resizeMode="contain"
          />
        ))}
      </View>
      
      {/* Clean, minimal X-axis labels */}
      <View style={{
        position: 'absolute',
        bottom: 5,
        left: paddingLeft,
        right: paddingRight,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: graphWidth,
      }}>
        {labels.map((label, index) => 
          label ? (
            <Text
              key={`label-${index}`}
              style={{
                fontSize: 11,
                color: '#64748B',
                fontWeight: '400',
              }}
            >
              {label}
            </Text>
          ) : null
        )}
      </View>
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

  
  const getMoodImage = (rating: number) => {
    let imageSource;
    if (rating >= 4.5) imageSource = require('../../assets/images/emojis/5.png');
    else if (rating >= 3.5) imageSource = require('../../assets/images/emojis/4.png');
    else if (rating >= 2.5) imageSource = require('../../assets/images/emojis/3.png');
    else if (rating >= 1.5) imageSource = require('../../assets/images/emojis/2.png');
    else if (rating > 0) imageSource = require('../../assets/images/emojis/1.png');
    else imageSource = require('../../assets/images/emojis/3.png'); // Default to neutral
    
    return (
      <Image 
        source={imageSource} 
        style={{ 
          width: 20, 
          height: 20,
          borderRadius: 10,
          shadowColor: '#87BAA3', // Sage green tint
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.08, // Much lighter
          shadowRadius: 1.5,
          elevation: 1 // Lighter Android shadow
        }} 
        resizeMode="contain" 
      />
    );
  };
  
  return (
    <View style={[{ paddingHorizontal: 0 }, style]}>
      {/* Separator line */}
      <View style={{
        height: 2,
        backgroundColor: '#9CA3AF',
        marginTop: 8,
        marginBottom: 16,
        marginHorizontal: 20
      }} />
      
      {/* Weekly progress content without card */}
      <View style={{ paddingHorizontal: 20 }}>
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
                <View style={styles.moodEmoji}>{getMoodImage(weeklyData.previousWeek.rating)}</View>
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
                <View style={styles.moodEmoji}>{getMoodImage(weeklyData.currentWeek.rating)}</View>
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