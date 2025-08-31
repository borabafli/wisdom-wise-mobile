import React, { useEffect, useRef, useState } from 'react';
import { View, Animated } from 'react-native';
import { soundWaveStyles as styles } from '../styles/components/SoundWave.styles';

interface SoundWaveAnimationProps {
  isRecording: boolean;
  audioLevels?: number[];
}

const SoundWaveAnimation: React.FC<SoundWaveAnimationProps> = ({ isRecording, audioLevels = [] }) => {
  const waveCount = 80; // More bars for smoother scrolling effect
  const [waveHistory, setWaveHistory] = useState<number[]>(Array(waveCount).fill(0.01));
  const lastUpdateTime = useRef(0);
  const updateInterval = 150; // Update every 150ms instead of every frame (slower scrolling)
  const baselineNoise = useRef(0); // Dynamic baseline for ambient noise
  const noiseCalibrationFrames = useRef(0);
  const waveAnimations = useRef(
    Array.from({ length: waveCount }, () => new Animated.Value(0.01))
  ).current;

  useEffect(() => {
    if (isRecording) {
      // Reset wave history and start noise calibration
      setWaveHistory(Array(waveCount).fill(0.01));
      baselineNoise.current = 0;
      noiseCalibrationFrames.current = 0;
      initializeWaveHeights();
    } else {
      // Stop animation and reset to idle state
      stopWaveAnimation();
    }
  }, [isRecording]);

  useEffect(() => {
    if (isRecording && audioLevels.length > 0) {
      // Throttle updates for slower scrolling
      const now = Date.now();
      if (now - lastUpdateTime.current >= updateInterval) {
        scrollWaveHistory(audioLevels);
        lastUpdateTime.current = now;
      }
    }
  }, [audioLevels, isRecording]);

  const initializeWaveHeights = () => {
    // Set all bars to a very quiet baseline level when recording starts
    waveAnimations.forEach((anim) => {
      anim.setValue(0.02); // Much lower baseline for silence
    });
  };

  const stopWaveAnimation = () => {
    waveAnimations.forEach((anim) => {
      anim.stopAnimation();
      Animated.timing(anim, {
        toValue: 0.02, // Reset to very low baseline
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
  };

  const scrollWaveHistory = (levels: number[]) => {
    // Calculate overall audio energy for this frame
    const totalEnergy = levels.reduce((sum, level) => sum + level, 0);
    const avgEnergy = totalEnergy / levels.length;
    
    // Fine-tuned scaling - close to original but slightly bigger overall
    const scaledEnergy = Math.pow(avgEnergy, 0.8) * 1.3; // Less aggressive than before
    const newWaveHeight = Math.max(0.01, Math.min(1, scaledEnergy)); // Lower minimum for silence
    
    // Scroll the wave history: shift left and add new data on the right
    setWaveHistory(prevHistory => {
      const newHistory = [...prevHistory.slice(1), newWaveHeight];
      
      // Update each bar's animation to its position in the history
      newHistory.forEach((height, index) => {
        Animated.timing(waveAnimations[index], {
          toValue: height,
          duration: 120, // Slower, smoother transitions
          useNativeDriver: false,
        }).start();
      });
      
      return newHistory;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.waveContainer}>
        {waveAnimations.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.waveBar,
              {
                height: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [2, 20], // Simple linear mapping from audio level to height
                  extrapolate: 'clamp',
                }),
                opacity: anim.interpolate({
                  inputRange: [0, 0.3, 1],
                  outputRange: [0.4, 0.7, 1],
                  extrapolate: 'clamp',
                }),
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default SoundWaveAnimation;