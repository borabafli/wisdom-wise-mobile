import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Canvas, RoundedRect, Group, Skia } from '@shopify/react-native-skia';

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
  maxHeight: 54, // Max height for loud speech
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

  // Use ref to avoid stale closure
  const audioLevelRef = React.useRef(audioLevel);
  React.useEffect(() => {
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

  // SIMPLE volume-based animation
  useEffect(() => {
    if (!isRecording) {
      setBars(Array(barCount).fill(CONFIG.minHeight));
      return;
    }

    // MUCH SLOWER scroll - update only 8 times per second
    const interval = setInterval(() => {
      const volume = audioLevelRef.current; // Get CURRENT value from ref

      setBars((prevBars) => {
        // Scroll: remove first, add new at end
        const newBars = [...prevBars.slice(1)];

        // LIGHT boost - most work done in dB conversion
        let boostedVolume = volume;

        if (volume > 0.02) {
          // Gentle power curve for smooth gradation
          boostedVolume = Math.pow(volume, 0.8) * 1.1; // Light boost
        }

        // Clamp between 0 and 1
        boostedVolume = Math.min(1.0, boostedVolume);

        // Map to bar height
        const heightRange = CONFIG.maxHeight - CONFIG.minHeight;
        const calculatedHeight = CONFIG.minHeight + (boostedVolume * heightRange);

        // Small variation for organic feel
        const variation = (Math.random() - 0.5) * 2; // Subtle variation
        const finalHeight = Math.max(CONFIG.minHeight, Math.min(CONFIG.maxHeight, calculatedHeight + variation));

        newBars.push(finalHeight);
        return newBars;
      });
    }, 120); // MUCH slower - only ~8 updates per second

    return () => clearInterval(interval);
  }, [isRecording, barCount]); // REMOVED audioLevel dependency - using ref instead!

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
    // Interpolate between base and active color
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
      {showTimer && isRecording && (
        <Text style={styles.timer}>{formatTime(recordingTime)}</Text>
      )}

      <Canvas style={{ width, height }}>
        <Group>
          {bars.map((barHeight, i) => {
            const x = startX + i * totalBarWidth;
            const y = centerY - barHeight / 2; // Center vertically

            // Color based on height (taller = darker)
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timer: {
    fontSize: 13,
    color: '#374151',
    fontFamily: 'Inter-Medium',
    letterSpacing: 0.3,
    marginBottom: 4,
    marginTop: 8,
  },
});
