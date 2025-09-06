import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Line, Circle, Path, Defs, LinearGradient, Stop, Filter, FeGaussianBlur, FeMorphology, FeFlood, FeComposite } from 'react-native-svg';
import { moodRatingService, type MoodStats } from '../services/moodRatingService';

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

  const loadMoodData = async () => {
    try {
      const stats = await moodRatingService.getMoodStats();
      const recentTrend = stats.moodTrend.slice(-days);
      setMoodData(recentTrend);
    } catch (error) {
      console.error('Error loading mood data:', error);
      setMoodData([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[{ height, alignItems: 'center', justifyContent: 'center' }, style]}>
        <Text style={{ color: '#9ca3af', fontSize: 14 }}>Loading mood data...</Text>
      </View>
    );
  }

  const chartWidth = screenWidth - 64;
  const chartHeight = height - 80;
  const paddingLeft = showEmojis ? 40 : 20;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 50;
  
  const graphWidth = chartWidth - paddingLeft - paddingRight;
  const graphHeight = chartHeight - paddingTop - paddingBottom;
  
  if (!moodData.length) {
    return (
      <View style={[{ height, alignItems: 'center', justifyContent: 'center' }, style]}>
        <Text style={{ color: '#9ca3af', fontSize: 14 }}>No mood data available</Text>
      </View>
    );
  }

  // Calculate chart coordinates
  const minValue = 0;
  const maxValue = 5;
  const valueRange = maxValue - minValue;
  
  const xStep = graphWidth / Math.max(1, moodData.length - 1);
  
  // Generate path for mood line
  const pathData = moodData.map((item, index) => {
    const x = paddingLeft + (index * xStep);
    const y = paddingTop + graphHeight - ((item.rating - minValue) / valueRange) * graphHeight;
    return { x, y, value: item.rating, date: item.date };
  });
  
  // Generate labels from dates
  const labels = moodData.map(item => {
    const date = new Date(item.date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

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
  
  // Y-axis emoji positions
  const emojiPositions = [
    { rating: 5, emoji: '😊', y: paddingTop },
    { rating: 4, emoji: '🙂', y: paddingTop + graphHeight * 0.2 },
    { rating: 3, emoji: '😐', y: paddingTop + graphHeight * 0.4 },
    { rating: 2, emoji: '😕', y: paddingTop + graphHeight * 0.6 },
    { rating: 1, emoji: '😞', y: paddingTop + graphHeight * 0.8 },
    { rating: 0, emoji: '😢', y: paddingTop + graphHeight }
  ];
  
  return (
    <View style={[{ height }, style]}>
      <Svg width={chartWidth} height={chartHeight}>
        <Defs>
          {/* Main line gradient */}
          <LinearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
            <Stop offset="30%" stopColor="rgba(59, 130, 246, 0.8)" />
            <Stop offset="100%" stopColor="rgba(59, 130, 246, 1)" />
          </LinearGradient>
          
          {/* Area gradient */}
          <LinearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
            <Stop offset="50%" stopColor="rgba(59, 130, 246, 0.15)" />
            <Stop offset="100%" stopColor="rgba(59, 130, 246, 0.05)" />
          </LinearGradient>
          
          {/* Glow effect */}
          <Filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <FeGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <FeFlood floodColor="#3b82f6" floodOpacity="0.4"/>
            <FeComposite in="SourceGraphic" operator="over"/>
          </Filter>
          
          {/* Shadow effect */}
          <Filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <FeGaussianBlur stdDeviation="2" result="blur"/>
            <FeFlood floodColor="#1e40af" floodOpacity="0.2"/>
            <FeComposite in="SourceGraphic" operator="over"/>
          </Filter>
        </Defs>
        
        {/* Background grid lines */}
        {emojiPositions.map((pos, index) => (
          <Line
            key={`grid-${index}`}
            x1={paddingLeft}
            y1={pos.y}
            x2={paddingLeft + graphWidth}
            y2={pos.y}
            stroke="#f1f5f9"
            strokeWidth={1}
            strokeDasharray="2,4"
            opacity={0.6}
          />
        ))}
        
        {/* Gradient area fill */}
        <Path
          d={createAreaPath()}
          fill="url(#areaGradient)"
          opacity={0.8}
        />
        
        {/* Shadow line */}
        <Path
          d={createSmoothPath()}
          stroke="rgba(59, 130, 246, 0.3)"
          strokeWidth={8}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#shadow)"
        />
        
        {/* Main mood line with glow */}
        <Path
          d={createSmoothPath()}
          stroke="url(#lineGradient)"
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        />
        
        {/* Data points */}
        {pathData.map((point, index) => (
          <Circle
            key={`point-${index}`}
            cx={point.x}
            cy={point.y}
            r={6}
            fill="#ffffff"
            stroke="#3b82f6"
            strokeWidth={3}
            filter="url(#shadow)"
            opacity={0.9}
          />
        ))}
        
        {/* Highlight circles */}
        {pathData.map((point, index) => (
          <Circle
            key={`highlight-${index}`}
            cx={point.x}
            cy={point.y}
            r={3}
            fill="#3b82f6"
          />
        ))}
      </Svg>
      
      {/* Emoji Y-axis */}
      {showEmojis && (
        <View style={{
          position: 'absolute',
          left: 8,
          top: 0,
          height: chartHeight,
          justifyContent: 'space-between',
          paddingVertical: paddingTop,
        }}>
          {emojiPositions.map((pos, index) => (
            <Text
              key={`emoji-${index}`}
              style={{
                fontSize: 16,
                textAlign: 'center',
                position: 'absolute',
                top: pos.y - 10,
                opacity: 0.7,
              }}
            >
              {pos.emoji}
            </Text>
          ))}
        </View>
      )}
      
      {/* X-axis labels */}
      <View style={{
        position: 'absolute',
        bottom: 15,
        left: paddingLeft,
        right: paddingRight,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
        {labels.map((label, index) => (
          <Text
            key={`label-${index}`}
            style={{
              fontSize: 11,
              color: '#64748b',
              textAlign: 'center',
              fontWeight: '500',
            }}
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

  useEffect(() => {
    loadWeeklyData();
  }, []);

  const loadWeeklyData = async () => {
    try {
      const stats = await moodRatingService.getMoodStats();
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
    }
  };

  if (!weeklyData) {
    return (
      <View style={[{ height: 120, alignItems: 'center', justifyContent: 'center' }, style]}>
        <Text style={{ color: '#9ca3af', fontSize: 14 }}>Loading weekly data...</Text>
      </View>
    );
  }

  const barWidth = (screenWidth - 120) / 2;
  const maxBarHeight = 80;
  
  const currentBarHeight = Math.max(5, (weeklyData.currentWeek.rating / 5) * maxBarHeight);
  const previousBarHeight = Math.max(5, (weeklyData.previousWeek.rating / 5) * maxBarHeight);
  
  const getMoodEmoji = (rating: number) => {
    if (rating >= 4.5) return '😊';
    if (rating >= 3.5) return '🙂';
    if (rating >= 2.5) return '😐';
    if (rating >= 1.5) return '😕';
    if (rating > 0) return '😞';
    return '😶';
  };
  
  return (
    <View style={[{
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
      paddingHorizontal: 20,
      paddingVertical: 20,
      height: 140,
    }, style]}>
      {/* Previous Week */}
      <View style={{ alignItems: 'center', flex: 1 }}>
        <View style={{
          width: barWidth - 20,
          height: previousBarHeight,
          backgroundColor: '#e2e8f0',
          borderRadius: 12,
          marginBottom: 12,
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: 8,
          shadowColor: '#64748b',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}>
          <Text style={{ fontSize: 22 }}>{getMoodEmoji(weeklyData.previousWeek.rating)}</Text>
        </View>
        <Text style={{ fontSize: 12, color: '#64748b', textAlign: 'center', marginBottom: 2 }}>
          Week Before
        </Text>
        <Text style={{ fontSize: 14, color: '#374151', fontWeight: '600' }}>
          {weeklyData.previousWeek.label}
        </Text>
      </View>
      
      {/* Current Week */}
      <View style={{ alignItems: 'center', flex: 1 }}>
        <View style={{
          width: barWidth - 20,
          height: currentBarHeight,
          backgroundColor: '#3b82f6',
          borderRadius: 12,
          marginBottom: 12,
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: 8,
          shadowColor: '#3b82f6',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
        }}>
          <Text style={{ fontSize: 22 }}>{getMoodEmoji(weeklyData.currentWeek.rating)}</Text>
        </View>
        <Text style={{ fontSize: 12, color: '#64748b', textAlign: 'center', marginBottom: 2 }}>
          This Week
        </Text>
        <Text style={{ fontSize: 14, color: '#374151', fontWeight: '600' }}>
          {weeklyData.currentWeek.label}
        </Text>
      </View>
    </View>
  );
};