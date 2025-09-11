import React, { useEffect, useRef, useState } from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { audioWaveformStyles as styles } from '../../styles/components/AudioWaveform.styles';

const { width: screenWidth } = Dimensions.get('window');

interface ContinuousWaveformProps {
  isRecording?: boolean;
  audioLevel?: number; // Single audio level (0-1)
  width?: number;
  height?: number;
  gradientColors?: string[];
  sensitivity?: number;
  style?: any;
  duration?: number; // Duration in seconds to show (default 6)
  sampleRate?: number; // Samples per second (default 30)
}

interface AudioSample {
  level: number;
  timestamp: number;
}

export const ContinuousWaveform: React.FC<ContinuousWaveformProps> = ({
  isRecording = false,
  audioLevel = 0,
  width = screenWidth - 40,
  height = 100,
  gradientColors = ['#06B6D4', '#0891B2', '#0E7490'],
  sensitivity = 1.0,
  duration = 6,
  sampleRate = 30,
  style
}) => {
  // Store audio history for the last N seconds
  const [audioHistory, setAudioHistory] = useState<AudioSample[]>([]);
  const animationFrame = useRef<number>();
  
  // Maximum number of samples to keep (duration * sampleRate)
  const maxSamples = duration * sampleRate;
  
  // Update audio history when receiving new levels
  useEffect(() => {
    if (isRecording && audioLevel !== undefined) {
      const now = Date.now();
      
      setAudioHistory(prevHistory => {
        // Add new sample
        const newSample: AudioSample = {
          level: Math.max(0.02, Math.min(1.0, audioLevel * sensitivity)),
          timestamp: now
        };
        
        // Add new sample and remove old ones
        const updatedHistory = [...prevHistory, newSample];
        
        // Keep only samples from the last N seconds
        const cutoffTime = now - (duration * 1000);
        const filteredHistory = updatedHistory.filter(
          sample => sample.timestamp >= cutoffTime
        );
        
        // Ensure we don't exceed max samples
        return filteredHistory.slice(-maxSamples);
      });
    }
  }, [audioLevel, isRecording, sensitivity, duration, maxSamples]);

  // Clear history when recording stops
  useEffect(() => {
    if (!isRecording) {
      // Gradually fade out the waveform
      const fadeOut = () => {
        setAudioHistory(prevHistory => {
          const fadedHistory = prevHistory.map(sample => ({
            ...sample,
            level: sample.level * 0.95 // Fade out gradually
          }));
          
          // Remove samples that are too quiet
          const filteredHistory = fadedHistory.filter(sample => sample.level > 0.01);
          
          if (filteredHistory.length > 0) {
            animationFrame.current = requestAnimationFrame(fadeOut);
          }
          
          return filteredHistory;
        });
      };
      
      animationFrame.current = requestAnimationFrame(fadeOut);
    } else {
      // Cancel fade out animation if recording starts again
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    }
    
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [isRecording]);

  // Generate smooth waveform path
  const generateWaveformPath = (): string => {
    if (audioHistory.length < 2) {
      // Return flat line if no data
      const midY = height / 2;
      return `M 0 ${midY} L ${width} ${midY}`;
    }
    
    const pointsPerPixel = audioHistory.length / width;
    let path = '';
    
    // Generate points along the width
    for (let x = 0; x <= width; x += 2) { // Step by 2px for smoother curves
      const sampleIndex = Math.floor(x * pointsPerPixel);
      const sample = audioHistory[sampleIndex] || audioHistory[audioHistory.length - 1];
      
      if (!sample) continue;
      
      // Convert level to Y coordinate (0 = center, higher level = bigger wave)
      const amplitude = (sample.level * height * 0.4); // Max 40% of height
      const midY = height / 2;
      
      // Create sine wave effect for smoother appearance
      const time = sample.timestamp / 1000;
      const waveOffset = Math.sin(time * 2 + x * 0.01) * amplitude * 0.1;
      
      const y = midY - amplitude + waveOffset;
      
      if (x === 0) {
        path += `M ${x} ${y}`;
      } else {
        // Use quadratic curves for smoothness
        const prevX = Math.max(0, x - 2);
        path += ` Q ${prevX + 1} ${y} ${x} ${y}`;
      }
    }
    
    // Mirror the path for the bottom half of the wave
    let bottomPath = '';
    for (let x = width; x >= 0; x -= 2) {
      const sampleIndex = Math.floor(x * pointsPerPixel);
      const sample = audioHistory[sampleIndex] || audioHistory[audioHistory.length - 1];
      
      if (!sample) continue;
      
      const amplitude = (sample.level * height * 0.4);
      const midY = height / 2;
      
      const time = sample.timestamp / 1000;
      const waveOffset = Math.sin(time * 2 + x * 0.01) * amplitude * 0.1;
      
      const y = midY + amplitude - waveOffset;
      
      if (x === width) {
        bottomPath += ` L ${x} ${y}`;
      } else {
        const nextX = Math.min(width, x + 2);
        bottomPath += ` Q ${x + 1} ${y} ${x} ${y}`;
      }
    }
    
    return path + bottomPath + ' Z';
  };

  const waveformPath = generateWaveformPath();

  return (
    <View style={[{ width, height }, style]}>
      <Svg width={width} height={height} style={styles.svg}>
        <Defs>
          <LinearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={gradientColors[0]} stopOpacity="0.8" />
            <Stop offset="50%" stopColor={gradientColors[1]} stopOpacity="0.6" />
            <Stop offset="100%" stopColor={gradientColors[2]} stopOpacity="0.4" />
          </LinearGradient>
        </Defs>
        
        <Path
          d={waveformPath}
          fill="url(#waveGradient)"
          stroke={gradientColors[0]}
          strokeWidth="1"
          opacity={isRecording ? 0.9 : 0.3}
        />
        
        {/* Center line for reference */}
        <Path
          d={`M 0 ${height / 2} L ${width} ${height / 2}`}
          stroke={gradientColors[1]}
          strokeWidth="0.5"
          opacity="0.2"
          strokeDasharray="2,4"
        />
      </Svg>
      
      {/* Time indicators */}
      <View style={{
        position: 'absolute',
        bottom: 2,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
      }}>
        <View style={{ opacity: 0.4 }}>
          <View style={{ 
            width: 1, 
            height: 4, 
            backgroundColor: gradientColors[1] 
          }} />
        </View>
        <View style={{ opacity: 0.3 }}>
          <View style={{ 
            width: 1, 
            height: 3, 
            backgroundColor: gradientColors[1] 
          }} />
        </View>
        <View style={{ opacity: 0.4 }}>
          <View style={{ 
            width: 1, 
            height: 4, 
            backgroundColor: gradientColors[1] 
          }} />
        </View>
      </View>
    </View>
  );
};

// Export default component only
export default ContinuousWaveform;