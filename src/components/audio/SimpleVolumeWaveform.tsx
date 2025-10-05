import React, { useEffect, useRef } from 'react';
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
  maxHeight: 54, // Full height restored for better visual quality
  color: '#87BAA3',
  activeColor: '#436E59',
};

export const SimpleVolumeWaveform: React.FC<SimpleVolumeWaveformProps> = ({
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

  // Beautiful smooth wave animation - ORIGINAL SETTINGS
  useEffect(() => {
    if (!isRecording) {
      setBars(Array(barCount).fill(CONFIG.minHeight));
      return;
    }

    const interval = setInterval(() => {
      const volume = audioLevelRef.current;

      setBars((prevBars) => {
        const newBars = prevBars.slice(1);

        // Process volume with gentle curve
        let processedVolume = volume;
        if (volume > 0.02) {
          processedVolume = Math.pow(volume, 0.85);
        }
        processedVolume = Math.min(1.0, processedVolume);

        // Map to bar height
        const heightRange = CONFIG.maxHeight - CONFIG.minHeight;
        const calculatedHeight = CONFIG.minHeight + (processedVolume * heightRange);

        // Smooth with previous bar for organic flow
        const lastBarHeight = prevBars[prevBars.length - 1] || CONFIG.minHeight;
        const smoothed = lastBarHeight * 0.25 + calculatedHeight * 0.75;

        // Add variation for natural movement
        const variation = (Math.random() - 0.5) * (processedVolume * 2.0);
        const finalHeight = Math.max(CONFIG.minHeight, Math.min(CONFIG.maxHeight, smoothed + variation));

        newBars.push(finalHeight);
        return newBars;
      });
    }, 110); // Original smooth update rate

    return () => clearInterval(interval);
  }, [isRecording, barCount]);

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

  const getColor = (vol: number) => {
    if (vol < 0.1) return CONFIG.color;
    const t = Math.min(1, vol * 2);
    const base = { r: 135, g: 186, b: 163 }; // #87BAA3
    const active = { r: 67, g: 110, b: 89 }; // #436E59
    const r = Math.round(base.r + (active.r - base.r) * t);
    const g = Math.round(base.g + (active.g - base.g) * t);
    const b = Math.round(base.b + (active.b - base.b) * t);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <View style={styles.container}>
      <Canvas style={{ width, height }}>
        <Group>
          {bars.map((barHeight, i) => {
            const x = startX + i * totalBarWidth;
            const y = centerY - barHeight / 2;
            const intensity = (barHeight - CONFIG.minHeight) / (CONFIG.maxHeight - CONFIG.minHeight);
            const color = getColor(intensity);

            return (
              <RoundedRect
                key={i}
                x={x}
                y={y}
                width={CONFIG.barWidth}
                height={barHeight}
                r={CONFIG.barRadius}
                color={color}
                opacity={isRecording ? 0.95 : 0.3}
              />
            );
          })}
        </Group>
      </Canvas>

      {showTimer && isRecording && (
        <Text style={styles.timer}>{formatTime(recordingTime)}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  timer: {
    position: 'absolute',
    top: -24,
    left: 0,
    right: 0,
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
