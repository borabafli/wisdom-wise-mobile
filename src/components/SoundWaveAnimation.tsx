import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, Platform, Dimensions } from 'react-native';
import { soundWaveStyles as styles } from '../styles/components/SoundWave.styles';
import { AudioWaveform } from './audio/AudioWaveform';

interface SoundWaveAnimationProps {
  isRecording: boolean;
  audioLevel?: number; // Single audio level instead of array
  audioLevels?: number[]; // Keep for backwards compatibility
}

const SoundWaveAnimation: React.FC<SoundWaveAnimationProps> = ({ isRecording, audioLevel = 0, audioLevels = [] }) => {
  // Get screen width for responsive sizing
  const { width: screenWidth } = Dimensions.get('window');
  
  // Use new Skia-based waveform for modern platforms, fallback to animated bars for compatibility
  const useModernWaveform = Platform.OS === 'ios' || Platform.OS === 'android' || Platform.OS === 'web';
  
  // Legacy animated bars implementation
  const waveCount = 80;
  const [waveHistory, setWaveHistory] = useState<number[]>(Array(waveCount).fill(0));
  const lastUpdateTime = useRef(0);
  const updateInterval = 50; // Stable updates for reliable mobile performance
  const baselineNoise = useRef(0);
  const noiseCalibrationFrames = useRef(0);
  const waveAnimations = useRef(
    Array.from({ length: waveCount }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    if (isRecording) {
      // Reset wave history and start noise calibration
      setWaveHistory(Array(waveCount).fill(0));
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
        
        // Debug real audio data (reduce frequency)
        if (Math.random() < 0.01) { // 1% of the time
          console.log('🎵 SoundWave receiving audio levels:', audioLevels.map(l => l.toFixed(2)));
        }
      }
    }
  }, [audioLevels, isRecording]);

  const initializeWaveHeights = () => {
    // Start completely invisible - no baseline bars
    waveAnimations.forEach((anim) => {
      anim.setValue(0); // Completely invisible at start
    });
  };

  const stopWaveAnimation = () => {
    waveAnimations.forEach((anim) => {
      anim.stopAnimation();
      Animated.timing(anim, {
        toValue: 0, // Reset to completely invisible
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
  };

  const scrollWaveHistory = (levels: number[]) => {
    // Calculate overall audio energy for this frame
    const totalEnergy = levels.reduce((sum, level) => sum + level, 0);
    const avgEnergy = totalEnergy / levels.length;
    
    // Precisely calibrated: silence = 0.24, speech = 0.64 (slightly bigger overall)
    let scaledEnergy;
    if (avgEnergy <= 0.24) {
      // True silence - small but visible
      scaledEnergy = 0.01;
    } else if (avgEnergy < 0.35) {
      // Background noise above silence - small but visible
      scaledEnergy = 0.01 + (avgEnergy - 0.24) * 0.4;
    } else {
      // Speech range (0.35 to 0.64+) - good scaling
      scaledEnergy = 0.06 + (avgEnergy - 0.35) * 2.2;
    }
    const newWaveHeight = Math.max(0.01, Math.min(1, scaledEnergy));
    
    // Scroll the wave history: shift left and add new data on the right
    setWaveHistory(prevHistory => {
      const newHistory = [...prevHistory.slice(1), newWaveHeight];
      
      // Update each bar's animation to its position in the history
      newHistory.forEach((height, index) => {
        Animated.timing(waveAnimations[index], {
          toValue: height,
          duration: 150, // Stable duration for smooth mobile animation
          useNativeDriver: false,
        }).start();
      });
      
      return newHistory;
    });
  };

  // Handle both single audioLevel and array audioLevels for compatibility
  const currentLevel = audioLevel || (audioLevels.length > 0 ? audioLevels[0] : 0);

  // Render modern Skia waveform or fallback to legacy animated bars
  if (useModernWaveform) {
    return (
      <View style={styles.container}>
        <AudioWaveform
          isRecording={isRecording}
          audioLevel={currentLevel}
          audioLevels={audioLevels} // Pass array data for web compatibility
          width={screenWidth - 120} // More conservative width to fit exactly within chat bar
          height={50} // Slightly taller for better visibility
          bufferDuration={12} // Extended duration for better history visibility
          samplesPerSecond={30} // Optimized for mobile performance
          color="#06B6D4"
          gradientColors={['#06B6D4', '#0891B2', '#0E7490']}
          sensitivity={1.2}
          showSpectrum={true}
          style={{ alignSelf: 'center' }}
        />
      </View>
    );
  }

  // Legacy fallback implementation
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
                  outputRange: [3, 28], // Taller waves with higher minimum
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