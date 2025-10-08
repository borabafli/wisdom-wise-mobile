import React, { useEffect, useState, useMemo, useRef } from 'react';
import { View, Text } from 'react-native';

interface RecordingWaveProps {
  audioLevel: number; // 0-1, single source of truth
  isRecording: boolean;
  variant?: 'bars' | 'pulse';
  size?: 'small' | 'medium' | 'large';
  showTimer?: boolean; // Show recording timer
  colorScheme?: 'default' | 'blue';
}

// WhatsApp-style design constants with maximum height bars
const WHATSAPP_STYLE = {
  barWidth: 3, // Width of bars
  barSpacing: 2,
  barRadius: 1.5, // Radius for rounded bars
  minHeight: 3, // Same as barWidth for perfect circles in silence
  maxHeight: 80, // Increased for more dramatic visual effect
  color: '#87BAA3',
  inactiveOpacity: 0.3,
  activeOpacity: 0.95,
  timerColor: '#64748b',
};

// Minimal audio processing - preserve raw levels with natural variation
const processAudioLevel = (rawLevel: number, variation: number = 0): number => {
  // Just ensure bounds and add variation for scrolling wave effect
  const clampedLevel = Math.max(0, Math.min(1, rawLevel));
  
  // Create more noticeable variation for better scrolling effect
  const naturalVariation = (variation - 0.5) * 0.1; // ±5% variation for smooth waves
  return Math.max(0, Math.min(1, clampedLevel + naturalVariation));
};

// Calculate dynamic color based on audio level with intense effect
const getBarColor = (level: number): string => {
  // Ensure level is between 0 and 1
  const normalizedLevel = Math.max(0, Math.min(1, level));
  
  // Gradient from light sage green to deep teal green
  const lightSageGreen = { r: 199, g: 223, b: 206 }; // #C7DFCE - Light sage green
  const deepTealGreen = { r: 67, g: 110, b: 89 };    // #436E59 - Deep teal green
  
  // Apply power curve for more dramatic color transition
  const intensifiedLevel = Math.pow(normalizedLevel, 0.7); // Makes transition more dramatic
  
  // Interpolate between light sage green and deep teal green
  const r = Math.round(lightSageGreen.r + (deepTealGreen.r - lightSageGreen.r) * intensifiedLevel);
  const g = Math.round(lightSageGreen.g + (deepTealGreen.g - lightSageGreen.g) * intensifiedLevel);
  const b = Math.round(lightSageGreen.b + (deepTealGreen.b - lightSageGreen.b) * intensifiedLevel);
  
  return `rgb(${r}, ${g}, ${b})`;
};

const getBlueBarColor = (level: number): string => {
  const normalizedLevel = Math.max(0, Math.min(1, level));

  const softSkyBlue = { r: 186, g: 219, b: 255 }; // #BADBFF
  const deepOceanBlue = { r: 45, g: 90, b: 140 }; // #2D5A8C

  const intensifiedLevel = Math.pow(normalizedLevel, 0.7);

  const r = Math.round(softSkyBlue.r + (deepOceanBlue.r - softSkyBlue.r) * intensifiedLevel);
  const g = Math.round(softSkyBlue.g + (deepOceanBlue.g - softSkyBlue.g) * intensifiedLevel);
  const b = Math.round(softSkyBlue.b + (deepOceanBlue.b - softSkyBlue.b) * intensifiedLevel);

  return `rgb(${r}, ${g}, ${b})`;
};


export const RecordingWave: React.FC<RecordingWaveProps> = ({
  audioLevel = 0,
  isRecording = false,
  variant = 'bars',
  size = 'medium',
  showTimer = true,
  colorScheme = 'default',
}) => {
  // State hooks - always called in same order
  const [audioHistory, setAudioHistory] = useState<number[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  
  // Ref to access current audioLevel in interval
  const audioLevelRef = useRef(audioLevel);
  useEffect(() => {
    audioLevelRef.current = audioLevel;
  }, [audioLevel]);
  
  // Memoized dimensions with maximum width and height
  const dimensions = useMemo(() => {
    switch (size) {
      case 'small': return { width: 200, height: 76, bars: 20 }; // Even wider for more presence
      case 'large': return { width: 340, height: 80, bars: 45 }; // Even wider for more presence
      default: return { width: 280, height: 68, bars: 32 }; // Reduced height for more compact chatbar
    }
  }, [size]);
  
  // Recording timer effect
  useEffect(() => {
    if (!isRecording) {
      setRecordingTime(0);
      return;
    }
    
    const timer = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isRecording]);
  
  // Continuous scrolling effect - always running during recording
  useEffect(() => {
    if (!isRecording) return;
    
    const interval = setInterval(() => {
      setAudioHistory(prev => {
        // Always add new data for continuous scrolling - even during silence
        const variation = Math.random();
        const currentLevel = audioLevelRef.current; // Use ref to get current value
        const processedLevel = processAudioLevel(currentLevel, variation);
        const newHistory = [...prev, processedLevel];
        
        // Keep exactly the number of bars for smooth scrolling
        return newHistory.slice(-dimensions.bars);
      });
    }, 120); // Slower scrolling for longer history - ~8fps
    
    return () => clearInterval(interval);
  }, [isRecording, dimensions.bars]); // Remove audioLevel dependency for continuous scrolling
  
  // Separate effect to update current audio level without affecting scrolling
  useEffect(() => {
    // This updates the current level but doesn't control scrolling
  }, [audioLevel]);

  // Clear history effect
  useEffect(() => {
    if (!isRecording) {
      setTimeout(() => setAudioHistory([]), 200);
    }
  }, [isRecording]);

  // Format timer display
  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };


  // Handle pulse variant
  if (variant === 'pulse') {
    return (
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: colorScheme === 'blue' ? '#4F7EBF' : WHATSAPP_STYLE.color,
          opacity: isRecording ? 0.9 : 0.6,
          transform: [{ scale: isRecording ? 1.1 : 1 }],
        }}
      />
    );
  }

  // Render bars
  const renderBars = () => {
    // Show baseline when no data
    if (audioHistory.length === 0) {
    return Array.from({ length: Math.min(8, dimensions.bars) }).map((_, index) => (
      <View
        key={`baseline-${index}`}
        style={{
          width: WHATSAPP_STYLE.barWidth,
          height: WHATSAPP_STYLE.minHeight,
          backgroundColor: colorScheme === 'blue' ? getBlueBarColor(0) : getBarColor(0),
          borderRadius: WHATSAPP_STYLE.barRadius,
          marginHorizontal: WHATSAPP_STYLE.barSpacing / 2,
          opacity: WHATSAPP_STYLE.inactiveOpacity,
          alignSelf: 'center',
        }}
        />
      ));
    }

    return Array.from({ length: dimensions.bars }).map((_, index) => {
      // For scrolling effect: newer data appears on the right, older on the left
      const historyIndex = audioHistory.length - dimensions.bars + index;
      const level = historyIndex >= 0 ? audioHistory[historyIndex] : 0;
      
      const calculatedHeight = level * WHATSAPP_STYLE.maxHeight;
      const barHeight = Math.max(
        WHATSAPP_STYLE.minHeight,
        Math.min(WHATSAPP_STYLE.maxHeight, calculatedHeight)
      );
      
      // Debug logging for silence issue
      return (
        <View
          key={index}
          style={{
            width: WHATSAPP_STYLE.barWidth,
            height: barHeight,
            backgroundColor: colorScheme === 'blue' ? getBlueBarColor(level) : getBarColor(level),
            borderRadius: WHATSAPP_STYLE.barRadius,
            marginHorizontal: WHATSAPP_STYLE.barSpacing / 2,
            opacity: isRecording ? WHATSAPP_STYLE.activeOpacity : WHATSAPP_STYLE.inactiveOpacity,
            alignSelf: 'center',
          }}
        />
      );
    });
  };

  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: 'transparent',
        paddingHorizontal: colorScheme === 'blue' ? 12 : 8,
      }}
    >
      {/* Recording Timer - Inside chatbox, positioned lower */}
      {showTimer && isRecording && (
        <View style={{
          marginBottom: 2,
          marginTop: 8, // Increased from 2 to 8 to move timer lower
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: 13,
            color: colorScheme === 'blue' ? '#1E3A8A' : '#374151',
            fontFamily: 'Inter-Medium',
            letterSpacing: 0.3,
            opacity: 0.9,
            fontWeight: '500',
          }}>
            {formatTimer(recordingTime)}
          </Text>
        </View>
      )}
      
      {/* Audio Wave Bars */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: dimensions.width,
          height: dimensions.height,
        }}
      >
        {renderBars()}
      </View>
    </View>
  );
};
