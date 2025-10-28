import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Canvas, RoundedRect, Group, useValue, runTiming, Easing } from '@shopify/react-native-skia';

interface SkiaWaveformProps {
  audioLevel: number; // 0-1 normalized audio level
  frequencyData?: number[]; // Optional frequency spectrum data
  isRecording: boolean;
  showTimer?: boolean;
  width?: number;
  height?: number;
  barCount?: number;
}

// WhatsApp-inspired design constants
const WAVEFORM_CONFIG = {
  barWidth: 3,
  barSpacing: 2,
  barRadius: 1.5,
  minHeight: 3,
  maxHeight: 60,
  baseColor: '#87BAA3', // Sage green
  activeColor: '#436E59', // Deep teal
  inactiveOpacity: 0.3,
  activeOpacity: 0.95,
};

export const SkiaWaveform: React.FC<SkiaWaveformProps> = ({
  audioLevel = 0,
  frequencyData,
  isRecording = false,
  showTimer = true,
  width = 280,
  height = 68,
  barCount = 32,
}) => {
  // Use Skia shared values for smooth 60fps animations
  const barHeights = useMemo(
    () => Array.from({ length: barCount }, () => useValue(WAVEFORM_CONFIG.minHeight)),
    [barCount]
  );

  const barOpacities = useMemo(
    () => Array.from({ length: barCount }, () => useValue(WAVEFORM_CONFIG.inactiveOpacity)),
    [barCount]
  );

  const [recordingTime, setRecordingTime] = React.useState(0);
  const audioHistoryRef = React.useRef<number[]>([]);

  // Recording timer
  useEffect(() => {
    if (!isRecording) {
      setRecordingTime(0);
      return;
    }

    const timer = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRecording]);

  // Real-time waveform updates using frequency data or audio level
  useEffect(() => {
    if (!isRecording) {
      // Reset to baseline when not recording
      barHeights.forEach((height) => {
        runTiming(height, WAVEFORM_CONFIG.minHeight, {
          duration: 200,
          easing: Easing.out(Easing.ease),
        });
      });
      barOpacities.forEach((opacity) => {
        runTiming(opacity, WAVEFORM_CONFIG.inactiveOpacity, {
          duration: 200,
        });
      });
      audioHistoryRef.current = [];
      return;
    }

    // Scrolling waveform effect - update at 60fps
    const frameInterval = setInterval(() => {
      // Add new audio data to history
      const currentLevel = audioLevel;
      audioHistoryRef.current.push(currentLevel);

      // Keep only the data we need for the visible bars
      if (audioHistoryRef.current.length > barCount) {
        audioHistoryRef.current.shift();
      }

      // Update each bar with animated transition
      barHeights.forEach((heightValue, index) => {
        // Scrolling effect: newer data on right, older on left
        const historyIndex = audioHistoryRef.current.length - barCount + index;
        const level = historyIndex >= 0 ? audioHistoryRef.current[historyIndex] : 0;

        // Use frequency data if available, otherwise use audio level
        let barLevel = level;
        if (frequencyData && frequencyData[index]) {
          barLevel = frequencyData[index];
        }

        // Add natural variation for organic feel
        const variation = (Math.random() - 0.5) * 0.1;
        const adjustedLevel = Math.max(0, Math.min(1, barLevel + variation));

        // Calculate target height
        const targetHeight = Math.max(
          WAVEFORM_CONFIG.minHeight,
          adjustedLevel * WAVEFORM_CONFIG.maxHeight
        );

        // Smooth animation to target height
        runTiming(heightValue, targetHeight, {
          duration: 80, // Fast response
          easing: Easing.out(Easing.cubic),
        });
      });

      // Animate opacity based on activity
      const targetOpacity = audioLevel > 0.05
        ? WAVEFORM_CONFIG.activeOpacity
        : WAVEFORM_CONFIG.inactiveOpacity;

      barOpacities.forEach((opacity) => {
        runTiming(opacity, targetOpacity, {
          duration: 100,
        });
      });
    }, 16); // ~60fps

    return () => clearInterval(frameInterval);
  }, [isRecording, audioLevel, frequencyData, barCount, barHeights, barOpacities]);

  // Calculate bar positions
  const totalBarWidth = WAVEFORM_CONFIG.barWidth + WAVEFORM_CONFIG.barSpacing;
  const totalWaveformWidth = barCount * totalBarWidth;
  const startX = (width - totalWaveformWidth) / 2;

  // Format timer
  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate dynamic color based on audio level
  const getBarColor = (level: number): string => {
    const normalizedLevel = Math.max(0, Math.min(1, level));
    const lightSageGreen = { r: 199, g: 223, b: 206 };
    const deepTealGreen = { r: 67, g: 110, b: 89 };

    const intensifiedLevel = Math.pow(normalizedLevel, 0.7);

    const r = Math.round(lightSageGreen.r + (deepTealGreen.r - lightSageGreen.r) * intensifiedLevel);
    const g = Math.round(lightSageGreen.g + (deepTealGreen.g - lightSageGreen.g) * intensifiedLevel);
    const b = Math.round(lightSageGreen.b + (deepTealGreen.b - lightSageGreen.b) * intensifiedLevel);

    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <View style={styles.container}>
      {/* Timer */}
      {showTimer && isRecording && (
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTimer(recordingTime)}</Text>
        </View>
      )}

      {/* Skia Canvas for waveform */}
      <Canvas style={{ width, height }}>
        <Group>
          {barHeights.map((heightValue, index) => {
            const x = startX + index * totalBarWidth;
            const y = (height - WAVEFORM_CONFIG.maxHeight) / 2;

            return (
              <RoundedRect
                key={index}
                x={x}
                y={y}
                width={WAVEFORM_CONFIG.barWidth}
                height={heightValue}
                r={WAVEFORM_CONFIG.barRadius}
                color={getBarColor(audioLevel)}
                opacity={barOpacities[index]}
              />
            );
          })}
        </Group>
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerContainer: {
    marginBottom: 4,
    marginTop: 8,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 13,
    color: '#374151',
    fontFamily: 'Inter-Medium',
    letterSpacing: 0.3,
    opacity: 0.9,
    fontWeight: '500',
  },
});
