import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, Dimensions, Animated, Platform } from 'react-native';
import { audioWaveformStyles as styles } from '../../styles/components/AudioWaveform.styles';

const { width: screenWidth } = Dimensions.get('window');

interface AudioWaveformProps {
  isRecording?: boolean;
  audioLevel?: number; // Single audio level instead of array
  audioLevels?: number[]; // Keep for backwards compatibility
  width?: number;
  height?: number;
  color?: string;
  gradientColors?: string[];
  sensitivity?: number;
  showSpectrum?: boolean;
  style?: any;
  bufferDuration?: number; // Duration in seconds (default 6)
  samplesPerSecond?: number; // How many samples per second (default 20)
}

interface AudioSample {
  level: number;
  timestamp: number;
  smoothedLevel?: number; // For smoothing calculations
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  isRecording = false,
  audioLevel = 0,
  audioLevels = [], // Fallback for compatibility
  width = screenWidth - 40,
  height = 60,
  color = '#06B6D4',
  gradientColors = ['#06B6D4', '#0891B2', '#0E7490'],
  sensitivity = 1.0,
  bufferDuration = 5, // 4-5 seconds rolling buffer
  samplesPerSecond = 25, // ~40ms sampling (25 samples/sec for live feel)
  style
}) => {
  // Rolling buffer for the last 4-5 seconds of audio data
  const [audioBuffer, setAudioBuffer] = useState<AudioSample[]>([]);
  const smoothingBuffer = useRef<number[]>([]); // Last 3 samples for averaging
  const scrollAnimation = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(0.7)).current;
  
  // Smooth scrolling animation for continuous movement at 60fps
  const smoothScrollOffset = useRef(new Animated.Value(0)).current;
  const continuousScrollAnimation = useRef<any>(null);
  
  // Create animated values for each bar for smooth height transitions
  const barAnimations = useRef<Animated.Value[]>([]);
  
  // Initialize bar animations when totalBars changes
  useMemo(() => {
    const newAnimations = Array.from({ length: totalBars }, (_, i) => 
      barAnimations.current[i] || new Animated.Value(0)
    );
    barAnimations.current = newAnimations.slice(0, totalBars);
  }, [totalBars]);
  
  // Memoize calculated values to prevent re-renders
  const maxSamples = useMemo(() => bufferDuration * samplesPerSecond, [bufferDuration, samplesPerSecond]);
  const barWidth = 3; // Thicker bars for better mobile visibility
  const barSpacing = 1; // Minimal spacing for wave continuity
  const totalBars = useMemo(() => Math.floor(width / (barWidth + barSpacing)), [width]);

  // Store the last processed values to prevent infinite loops
  const lastProcessedLevel = useRef<number>(0);
  const lastProcessedTime = useRef<number>(0);
  
  // Update rolling buffer when new audio data arrives
  useEffect(() => {
    // Handle both single audioLevel and array audioLevels for compatibility
    // Web provides frequency array data, mobile provides single level
    const currentLevel = Platform.OS === 'web' && audioLevels.length > 0 
      ? audioLevels.reduce((sum, level) => sum + level, 0) / audioLevels.length // Average of frequency data for web
      : audioLevel || (audioLevels.length > 0 ? audioLevels[0] : 0); // Single level for mobile
    
    const now = Date.now();
    
    // Debug logging for all platforms
    if (isRecording && Math.random() < 0.05) { // 5% of the time
      console.log(`📱 ${Platform.OS} AudioWaveform - currentLevel:`, currentLevel, 'audioLevel:', audioLevel, 'audioLevels length:', audioLevels.length, 'buffer length:', audioBuffer.length);
    }
    
    // High-frequency sampling: 30-50ms polling for live feel
    if (isRecording && now - lastProcessedTime.current > 40) { // 40ms = 25fps for responsive updates
      
      lastProcessedLevel.current = currentLevel;
      lastProcessedTime.current = now;
      
      // Always add samples to keep waveform continuous (including silence)
      setAudioBuffer(prevBuffer => {
        // Add new sample - use much lower minimum for true silence detection
        // Apply sensitivity
        const mobileSensitivity = Platform.OS === 'ios' || Platform.OS === 'android' ? sensitivity * 1.0 : sensitivity;
        const rawLevel = Math.max(0.005, Math.min(1.0, currentLevel * mobileSensitivity));
        
        // Smoothing: Average the last 2-3 samples to remove jitter
        smoothingBuffer.current.push(rawLevel);
        if (smoothingBuffer.current.length > 3) {
          smoothingBuffer.current.shift(); // Keep only last 3 samples
        }
        
        const smoothedLevel = smoothingBuffer.current.reduce((sum, val) => sum + val, 0) / smoothingBuffer.current.length;
        const finalLevel = Math.max(0.005, Math.min(1.0, smoothedLevel));
        
        const newSample: AudioSample = {
          level: finalLevel,
          timestamp: now,
          smoothedLevel: smoothedLevel
        };
        
        // Add to buffer and keep only recent samples
        const updatedBuffer = [...prevBuffer, newSample];
        const cutoffTime = now - (bufferDuration * 1000);
        
        // Remove old samples and limit total count
        const newBuffer = updatedBuffer
          .filter(sample => sample.timestamp >= cutoffTime)
          .slice(-maxSamples);
          
        // Animate bars to new heights after state update
        setTimeout(() => animateBarsSimple(newBuffer), 0);
        
        // Data update complete - continuous scrolling is handled separately
        
        return newBuffer;
      });
    }
  }, [audioLevel, audioLevels, isRecording]);

  // Smooth bar animation function
  const animateBars = (buffer: AudioSample[]) => {
    if (buffer.length === 0) {
      // Animate all bars to zero height
      barAnimations.current.forEach(anim => {
        Animated.timing(anim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      });
      return;
    }
    
    // Calculate target heights for each bar
    const dataPoints = buffer.length;
    barAnimations.current.forEach((anim, index) => {
      let sample;
      if (dataPoints >= totalBars) {
        // More data than bars: sample from the end (recent data)
        const dataIndex = dataPoints - totalBars + index;
        sample = buffer[Math.max(0, dataIndex)] || { level: 0.005, timestamp: 0 };
      } else {
        // Less data than bars: stretch data across all bars
        const dataIndex = Math.floor((index / totalBars) * dataPoints);
        sample = buffer[Math.min(dataIndex, dataPoints - 1)] || { level: 0.005, timestamp: 0 };
      }
      
      // Calculate scaled height using same logic as render
      let scaledLevel;
      if (Platform.OS === 'web') {
        if (sample.level <= 0.05) {
          scaledLevel = sample.level * 0.02;
        } else if (sample.level <= 0.2) {
          scaledLevel = 0.03 + (sample.level - 0.05) * 0.5;
        } else {
          scaledLevel = 0.1 + (sample.level - 0.2) * 1.5;
        }
      } else {
        if (sample.level <= 0.05) {
          scaledLevel = sample.level * 0.1;
        } else if (sample.level <= 0.2) {
          scaledLevel = 0.01 + (sample.level - 0.05) * 0.3;
        } else {
          scaledLevel = 0.05 + (sample.level - 0.2) * 1.2;
        }
      }
      
      const maxHeight = height * 0.8;
      const targetHeight = Math.max(1, scaledLevel * maxHeight);
      
      // Smooth animation to target height with ultra-fast timing for high-frequency updates
      Animated.timing(anim, {
        toValue: targetHeight,
        duration: 15, // Ultra-fast for high-frequency audio capture
        useNativeDriver: false,
      }).start();
    });
  };

  // Simpler animation function for reliable mobile performance
  const animateBarsSimple = (buffer: AudioSample[]) => {
    if (!barAnimations.current) return;
    
    const dataPoints = buffer.length;
    const maxHeight = height * 0.8;
    
    barAnimations.current.forEach((anim, index) => {
      if (!anim) return;
      
      let targetHeight = 1; // Default minimum
      
      if (dataPoints > 0) {
        // Calculate target height using same logic as render
        let sample;
        if (dataPoints >= totalBars) {
          const dataIndex = dataPoints - totalBars + index;
          sample = buffer[Math.max(0, dataIndex)] || { level: 0.005, timestamp: 0 };
        } else {
          const dataIndex = Math.floor((index / totalBars) * dataPoints);
          sample = buffer[Math.min(dataIndex, dataPoints - 1)] || { level: 0.005, timestamp: 0 };
        }
        
        // Platform-specific scaling (same as render)
        let scaledLevel;
        if (Platform.OS === 'web') {
          if (sample.level <= 0.05) {
            scaledLevel = sample.level * 0.02;
          } else if (sample.level <= 0.2) {
            scaledLevel = 0.03 + (sample.level - 0.05) * 0.5;
          } else {
            scaledLevel = 0.1 + (sample.level - 0.2) * 1.5;
          }
        } else {
          // Mobile animation scaling: match the conservative render scaling
          if (sample.level <= 0.03) {
            scaledLevel = 0;
          } else if (sample.level <= 0.15) {
            scaledLevel = 0.02 + (sample.level - 0.03) * 0.4;
          } else {
            scaledLevel = 0.06 + (sample.level - 0.15) * 1.0;
          }
        }
        
        targetHeight = Math.max(1, scaledLevel * maxHeight);
      }
      
      // Interpolation/Tweening: animate from previous → new height over 30-40ms
      Animated.timing(anim, {
        toValue: targetHeight,
        duration: 35, // 30-40ms interpolation for smooth gliding
        useNativeDriver: false,
      }).start();
    });
  };

  // Start continuous 60fps scrolling animation when recording
  useEffect(() => {
    if (isRecording) {
      // Start continuous scrolling animation
      const startContinuousScroll = () => {
        continuousScrollAnimation.current = Animated.loop(
          Animated.timing(smoothScrollOffset, {
            toValue: width, // Scroll exactly one screen width
            duration: 2000, // 2 seconds for one full scroll - fast scrolling right to left
            useNativeDriver: true,
          }),
          { iterations: -1 } // Infinite loop
        );
        continuousScrollAnimation.current.start();
      };
      
      startContinuousScroll();
    } else {
      // Stop continuous scrolling
      if (continuousScrollAnimation.current) {
        continuousScrollAnimation.current.stop();
        continuousScrollAnimation.current = null;
      }
      smoothScrollOffset.setValue(0);
    }
    
    return () => {
      if (continuousScrollAnimation.current) {
        continuousScrollAnimation.current.stop();
      }
    };
  }, [isRecording]);

  // Fade in/out animation
  useEffect(() => {
    Animated.timing(containerOpacity, {
      toValue: isRecording ? 1 : 0.4,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isRecording]);

  // Clear buffer when recording stops (with smooth animation)
  useEffect(() => {
    if (!isRecording) {
      // Animate all bars to zero height first
      animateBarsSimple([]);
      
      // Clear smoothing buffer immediately
      smoothingBuffer.current = [];
      
      // Then clear buffer after animation starts
      setTimeout(() => {
        setAudioBuffer([]);
      }, 100);
    }
  }, [isRecording]);

  // Render thin vertical bars (WhatsApp style)
  const renderWaveformBars = () => {
    // Always show minimum baseline bars to prevent disappearing wave
    if (audioBuffer.length === 0) {
      // Show baseline bars when no data is available
      return Array.from({ length: Math.floor(totalBars / 4) }, (_, index) => (
        <View
          key={`baseline-${index}`}
          style={{
            width: barWidth,
            height: 2,
            backgroundColor: color,
            opacity: 0.3,
            borderRadius: barWidth / 2,
            marginRight: barSpacing,
            alignSelf: 'center',
          }}
        />
      ));
    }
    
    // Use full width: stretch available data across all bars for better "zoom" 
    const dataPoints = audioBuffer.length;
    
    return Array.from({ length: totalBars }, (_, index) => {
      // Map each bar to a data point with interpolation for smoother waves
      let interpolatedLevel;
      
      if (dataPoints >= totalBars) {
        // More data than bars: sample from the end (recent data)
        const dataIndex = dataPoints - totalBars + index;
        const sample = audioBuffer[Math.max(0, dataIndex)] || { level: 0.005, timestamp: 0 };
        interpolatedLevel = sample.level;
      } else if (dataPoints === 0) {
        interpolatedLevel = 0.005;
      } else {
        // Less data than bars: use nearest data point (no artificial interpolation)
        const dataIndex = Math.round((index / totalBars) * (dataPoints - 1));
        const sample = audioBuffer[Math.min(dataIndex, dataPoints - 1)] || { level: 0.005, timestamp: 0 };
        interpolatedLevel = sample.level;
      }
      
      // No artificial smoothing - let real audio data show through naturally
      
      const sample = { level: interpolatedLevel, timestamp: Date.now() };
      
      // Convert level to bar height with better scaling for silence vs speech
      const minHeight = 1; // Very low minimum for silence
      const maxHeight = height * 0.8;
      
      // Platform-specific scaling: Web and mobile have different audio level characteristics
      let scaledLevel;
      
      if (Platform.OS === 'web') {
        // Web scaling: dramatic difference between silence and speech
        if (sample.level <= 0.05) {
          // True silence - almost invisible
          scaledLevel = sample.level * 0.02; // Much smaller silence bars
        } else if (sample.level <= 0.2) {
          // Quiet speech - small but clearly visible jump
          scaledLevel = 0.03 + (sample.level - 0.05) * 0.5;
        } else {
          // Active speech - full dramatic scaling
          scaledLevel = 0.1 + (sample.level - 0.2) * 1.5;
        }
      } else {
        // Mobile scaling: conservative to prevent oversensitivity
        if (sample.level <= 0.03) {
          // True silence - invisible
          scaledLevel = 0;
        } else if (sample.level <= 0.15) {
          // Quiet speech - small but visible
          scaledLevel = 0.02 + (sample.level - 0.03) * 0.4;
        } else {
          // Normal speech - conservative scaling
          scaledLevel = 0.06 + (sample.level - 0.15) * 1.0;
        }
      }
      
      const barHeight = Math.max(minHeight, scaledLevel * maxHeight);
      
      return (
        <Animated.View
          key={index}
          style={{
            width: barWidth,
            height: barAnimations.current[index] ? barAnimations.current[index].interpolate({
              inputRange: [0, maxHeight],
              outputRange: [1, maxHeight],
              extrapolate: 'clamp'
            }) : barHeight, // Use animation if available, fallback to direct height
            backgroundColor: color,
            opacity: isRecording ? 0.9 : 0.5,
            borderRadius: barWidth / 2, // More rounded edges (half the width for pill shape)
            marginRight: barSpacing,
            alignSelf: 'center',
            transform: [{
              translateX: smoothScrollOffset.interpolate({
                inputRange: [0, width],
                outputRange: [0, -width],
                extrapolate: 'repeat'
              })
            }]
          }}
        />
      );
    });
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        { 
          width, 
          height, 
          opacity: containerOpacity,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingHorizontal: 8,
          backgroundColor: 'transparent',
          overflow: 'hidden',
        }, 
        style
      ]}
    >
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start', // Standard alignment for full-width display
        height: '100%',
        width: '100%',
      }}>
        {renderWaveformBars()}
      </View>
    </Animated.View>
  );
};

// Circular waveform variant for compact spaces
export const CircularAudioWaveform: React.FC<AudioWaveformProps> = ({
  isRecording = false,
  audioLevels = [],
  width = 120,
  height = 120,
  color = '#06B6D4',
  sensitivity = 1.0,
  style
}) => {
  const numBars = 12;
  const barAnimations = useRef(
    Array.from({ length: numBars }, () => new Animated.Value(0.2))
  ).current;

  const containerOpacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (isRecording) {
      Animated.timing(containerOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(containerOpacity, {
        toValue: 0.6,
        duration: 300,
        useNativeDriver: false,
      }).start();

      // Reset all bars to minimum height
      barAnimations.forEach((animation) => {
        Animated.timing(animation, {
          toValue: 0.1,
          duration: 300,
          useNativeDriver: false,
        }).start();
      });
    }
  }, [isRecording]);

  useEffect(() => {
    if (isRecording && audioLevels.length > 0) {
      // Map 7-band audio to 12 circular segments
      const expandedLevels = Array.from({ length: 12 }, (_, i) => {
        const sourceIndex = Math.floor((i / 12) * audioLevels.length);
        return Math.max(0.1, Math.min(1.0, audioLevels[sourceIndex] * sensitivity));
      });

      barAnimations.forEach((animation, index) => {
        Animated.timing(animation, {
          toValue: expandedLevels[index],
          duration: 100,
          useNativeDriver: false,
        }).start();
      });
    }
  }, [audioLevels, sensitivity, isRecording]);


  const renderCircularBars = () => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width * 0.35;
    
    return barAnimations.map((animation, index) => {
      const angle = (index / numBars) * Math.PI * 2 - Math.PI / 2;
      const barLength = 15; // Fixed length, animation changes opacity/scale
      
      const startX = centerX + Math.cos(angle) * radius;
      const startY = centerY + Math.sin(angle) * radius;
      const endX = centerX + Math.cos(angle) * (radius + barLength);
      const endY = centerY + Math.sin(angle) * (radius + barLength);
      
      return (
        <Animated.View
          key={index}
          style={[
            {
              position: 'absolute',
              left: startX - 1,
              top: startY,
              width: 2,
              backgroundColor: color,
              borderRadius: 1,
              transformOrigin: 'bottom center',
            },
            {
              height: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [5, barLength],
              }),
              transform: [
                { rotate: `${angle + Math.PI / 2}rad` }
              ]
            }
          ]}
        />
      );
    });
  };

  return (
    <Animated.View 
      style={[
        styles.circularContainer,
        { 
          width, 
          height, 
          opacity: containerOpacity,
        }, 
        style
      ]}
    >
      {renderCircularBars()}
      
      {/* Center pulse */}
      <View
        style={{
          position: 'absolute',
          left: width / 2 - 8,
          top: height / 2 - 8,
          width: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: color,
          opacity: isRecording ? 0.6 : 0.3,
        }}
      />
    </Animated.View>
  );
};