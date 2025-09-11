import React, { useEffect, useState, useMemo, useRef } from 'react';
import { View, Text } from 'react-native';

interface RecordingWaveProps {
  audioLevel: number; // 0-1, single source of truth
  isRecording: boolean;
  variant?: 'bars' | 'pulse';
  size?: 'small' | 'medium' | 'large';
  showTimer?: boolean; // Show recording timer
}

// WhatsApp-style design constants
const WHATSAPP_STYLE = {
  barWidth: 2,
  barSpacing: 2,
  barRadius: 1,
  minHeight: 3,
  maxHeight: 28,
  color: '#06B6D4',
  inactiveOpacity: 0.3,
  activeOpacity: 0.8,
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

export const RecordingWave: React.FC<RecordingWaveProps> = ({
  audioLevel = 0,
  isRecording = false,
  variant = 'bars',
  size = 'medium',
  showTimer = true,
}) => {
  // State hooks - always called in same order
  const [audioHistory, setAudioHistory] = useState<number[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  
  // Ref to access current audioLevel in interval
  const audioLevelRef = useRef(audioLevel);
  useEffect(() => {
    audioLevelRef.current = audioLevel;
  }, [audioLevel]);
  
  // Memoized dimensions
  const dimensions = useMemo(() => {
    switch (size) {
      case 'small': return { width: 140, height: 32, bars: 20 };
      case 'large': return { width: 280, height: 40, bars: 45 };  
      default: return { width: 200, height: 36, bars: 32 };
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
    }, 80); // Even faster scrolling for better effect - 12.5fps
    
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
          backgroundColor: WHATSAPP_STYLE.color,
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
            backgroundColor: WHATSAPP_STYLE.color,
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
      if (index === 0 && Math.random() < 0.01) { // Log occasionally for first bar
        console.log(`🎵 Bar ${index}: level=${level.toFixed(4)}, calculated=${calculatedHeight.toFixed(1)}px, final=${barHeight.toFixed(1)}px`);
      }

      return (
        <View
          key={index}
          style={{
            width: WHATSAPP_STYLE.barWidth,
            height: barHeight,
            backgroundColor: WHATSAPP_STYLE.color,
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
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        paddingHorizontal: 8,
      }}
    >
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
      
      {/* Recording Timer - Right side, same height */}
      {showTimer && isRecording && (
        <View style={{
          marginLeft: 12,
          justifyContent: 'center',
        }}>
          <Text style={{
            fontSize: 12,
            color: WHATSAPP_STYLE.timerColor,
            fontFamily: 'Inter-Medium',
            letterSpacing: 0.5,
            minWidth: 35,
          }}>
            {formatTimer(recordingTime)}
          </Text>
        </View>
      )}
    </View>
  );
};