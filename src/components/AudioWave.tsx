import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

interface AudioWaveProps {
  audioLevel: number; // 0-1, single source of truth
  isRecording: boolean;
  variant?: 'bars' | 'pulse';
  size?: 'small' | 'medium' | 'large';
  theme?: 'calm' | 'energetic' | 'focus';
  showTimer?: boolean; // Show recording timer
}

// WhatsApp-style design constants - Back to original beautiful dimensions
const WHATSAPP_STYLE = {
  barWidth: 2,
  barSpacing: 2, // Back to original spacing
  barRadius: 1,
  minHeight: 3, // Back to original minimum
  maxHeight: 28, // Back to original maximum
  color: '#06B6D4',
  inactiveOpacity: 0.3,
  activeOpacity: 0.8,
  timerColor: '#64748b',
};

// Audio processing with natural variation - prevents identical neighboring bars
const processAudioLevel = (rawLevel: number, variation: number = 0): number => {
  let baseLevel;
  if (rawLevel < 0.01) baseLevel = 0;
  else if (rawLevel < 0.05) baseLevel = rawLevel * 2;
  else if (rawLevel < 0.2) baseLevel = 0.1 + (rawLevel - 0.05) * 2;
  else baseLevel = Math.min(1, 0.4 + (rawLevel - 0.2) * 1.5);
  
  // Add subtle natural variation to prevent identical bars
  const naturalVariation = (variation - 0.5) * 0.15; // ±7.5% variation
  return Math.max(0, Math.min(1, baseLevel + naturalVariation));
};

export const AudioWave: React.FC<AudioWaveProps> = ({
  audioLevel = 0,
  isRecording = false,
  variant = 'bars',
  size = 'medium',
  showTimer = true,
}) => {
  // CRITICAL: All hooks must be called in the exact same order every render
  const [audioHistory, setAudioHistory] = useState<number[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  
  // Calculate dimensions - memoized to prevent unnecessary recalculations
  const dimensions = React.useMemo(() => {
    switch (size) {
      case 'small': return { width: 140, height: 32, bars: 20 };
      case 'large': return { width: 280, height: 40, bars: 45 };  
      default: return { width: 200, height: 36, bars: 32 };
    }
  }, [size]);
  
  // Recording timer
  useEffect(() => {
    if (!isRecording) {
      setRecordingTime(0);
      return;
    }
    
    const timer = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000); // Update every second
    
    return () => clearInterval(timer);
  }, [isRecording]);
  
  // Format timer display (0:05, 1:23, etc.)
  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Continuously add data when recording with proper smooth scrolling
  useEffect(() => {
    if (!isRecording) return;
    
    const interval = setInterval(() => {
      const variation = Math.random(); // Natural variation for each bar
      const processedLevel = processAudioLevel(audioLevel, variation);
      setAudioHistory(prev => {
        const newHistory = [...prev, processedLevel];
        // Keep MORE history than displayed bars for smoother scrolling
        const maxHistory = dimensions.bars * 3; // 3x more data for smooth movement
        return newHistory.slice(-maxHistory);
      });
    }, 80); // Back to 80ms for proper WhatsApp-like timing
    
    return () => clearInterval(interval);
  }, [isRecording, audioLevel, dimensions.bars]);

  // Clear history when recording stops
  useEffect(() => {
    if (!isRecording) {
      setTimeout(() => setAudioHistory([]), 200);
    }
  }, [isRecording]);

  // Handle pulse variant after all hooks are defined
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

  // WhatsApp-style bars
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
      // Map each bar to the most recent portion of audio history for smooth scrolling
      const startIndex = Math.max(0, audioHistory.length - dimensions.bars);
      const level = audioHistory[startIndex + index] || 0;
      
      const barHeight = Math.max(
        WHATSAPP_STYLE.minHeight,
        Math.min(WHATSAPP_STYLE.maxHeight, level * WHATSAPP_STYLE.maxHeight)
      );

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
            minWidth: 35, // Prevents layout shift as timer changes
          }}>
            {formatTimer(recordingTime)}
          </Text>
        </View>
      )}
    </View>
  );
};