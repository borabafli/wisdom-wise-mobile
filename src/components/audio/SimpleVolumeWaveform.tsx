import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Canvas, RoundedRect, Group } from '@shopify/react-native-skia';

interface SimpleVolumeWaveformProps {
  audioLevel: number; // REAL 0-1 audio level from microphone
  isRecording: boolean;
  showTimer?: boolean;
  width?: number;
  height?: number;
  barCount?: number;
}

const CONFIG = {
  barWidth: 4, // Thicker bars for visibility
  barSpacing: 3, // More space between bars
  barRadius: 2,
  minHeight: 4, // Small dot for silence (same as barWidth for perfect circle)
  maxHeight: 42, // Adjusted for smaller wave height
  color: '#87BAA3', // Single color for maximum performance
};

const SimpleVolumeWaveformComponent: React.FC<SimpleVolumeWaveformProps> = ({
  audioLevel = 0,
  isRecording = false,
  showTimer = true,
  width = 280,
  height = 68,
  barCount = 32,
}) => {
  const [bars, setBars] = React.useState<number[]>(Array(barCount).fill(CONFIG.minHeight));
  const [recordingTime, setRecordingTime] = React.useState(0);
  const audioLevelRef = useRef(audioLevel);
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  // Update ref when audioLevel changes
  useEffect(() => {
    audioLevelRef.current = audioLevel;
  }, [audioLevel]);

  // Timer
  useEffect(() => {
    if (!isRecording) {
      setRecordingTime(0);
      return;
    }
    const timer = setInterval(() => setRecordingTime((p) => p + 1), 1000);
    return () => clearInterval(timer);
  }, [isRecording]);

  // Optimized wave animation using requestAnimationFrame
  const updateWave = useCallback(() => {
    const now = performance.now();
    const elapsed = now - lastUpdateRef.current;

    // Update at ~12fps (83ms) for performance
    if (elapsed >= 83) {
      const volume = audioLevelRef.current;

      setBars((prevBars) => {
        const newBars = prevBars.slice(1);

        // Use raw volume for better dynamic range (show pauses clearly)
        const processedVolume = Math.min(1.0, volume);

        // Map to bar height
        const heightRange = CONFIG.maxHeight - CONFIG.minHeight;
        const calculatedHeight = CONFIG.minHeight + (processedVolume * heightRange);

        // Minimal smoothing for quick response to pauses
        const lastBarHeight = prevBars[prevBars.length - 1] || CONFIG.minHeight;
        const smoothed = lastBarHeight * 0.1 + calculatedHeight * 0.9;

        // Add variation only when speaking (not during pauses)
        const variation = processedVolume > 0.1 ? (Math.random() - 0.5) * (processedVolume * 1.5) : 0;
        const finalHeight = Math.max(CONFIG.minHeight, Math.min(CONFIG.maxHeight, smoothed + variation));

        newBars.push(finalHeight);
        return newBars;
      });

      lastUpdateRef.current = now;
    }

    if (isRecording) {
      animationFrameRef.current = requestAnimationFrame(updateWave);
    }
  }, [isRecording]);

  useEffect(() => {
    if (!isRecording) {
      setBars(Array(barCount).fill(CONFIG.minHeight));
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    lastUpdateRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(updateWave);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRecording, barCount, updateWave]);

  // Calculate positions
  const totalBarWidth = CONFIG.barWidth + CONFIG.barSpacing;
  const totalWidth = barCount * totalBarWidth;
  const startX = (width - totalWidth) / 2;
  const centerY = height / 2;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };


  return (
    <View style={styles.container}>
      {showTimer && isRecording && (
        <Text style={styles.timer}>{formatTime(recordingTime)}</Text>
      )}
      <Canvas style={{ width, height }}>
        <Group>
          {bars.map((barHeight, i) => {
            const x = startX + i * totalBarWidth;
            const y = centerY - barHeight / 2;

            return (
              <RoundedRect
                key={i}
                x={x}
                y={y}
                width={CONFIG.barWidth}
                height={barHeight}
                r={CONFIG.barRadius}
                color={CONFIG.color}
                opacity={isRecording ? 0.95 : 0.3}
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
    width: '100%',
    gap: 4, // Small gap between timer and wave
  },
  timer: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    letterSpacing: 0.5,
    textAlign: 'center',
    paddingTop: 2,
    marginLeft: 20, // Shift slightly to the right
  },
});

// Memoize to prevent unnecessary re-renders
export const SimpleVolumeWaveform = React.memo(
  SimpleVolumeWaveformComponent,
  (prevProps, nextProps) => {
    // Only re-render if these props changed significantly
    const audioLevelChanged = Math.abs(prevProps.audioLevel - nextProps.audioLevel) > 0.01;
    const recordingChanged = prevProps.isRecording !== nextProps.isRecording;
    const timerChanged = prevProps.showTimer !== nextProps.showTimer;

    // Return true to skip re-render, false to re-render
    return !audioLevelChanged && !recordingChanged && !timerChanged;
  }
);
