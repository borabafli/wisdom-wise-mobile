import React from 'react';
import { View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface WhatsAppWaveformProps {
  waveformBars: number[];
  isActive?: boolean;
  style?: ViewStyle;
  barColor?: string;
  barWidth?: number;
  barSpacing?: number;
  maxBarHeight?: number;
  minBarHeight?: number;
}

export const WhatsAppWaveform: React.FC<WhatsAppWaveformProps> = ({
  waveformBars,
  isActive = true,
  style,
  barColor = '#06B6D4',
  barWidth = 3,
  barSpacing = 2,
  maxBarHeight = 24,
  minBarHeight = 3,
}) => {
  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    height: maxBarHeight + 4,
    paddingHorizontal: 4,
    ...style,
  };

  const renderBar = (level: number, index: number) => {
    // Calculate bar height based on audio level
    const normalizedLevel = Math.max(0, Math.min(1, level));
    const barHeight = minBarHeight + (normalizedLevel * (maxBarHeight - minBarHeight));
    
    // Add slight randomization for more organic feel
    const randomFactor = 0.9 + (Math.random() * 0.2); // 0.9 to 1.1
    const finalHeight = Math.max(minBarHeight, barHeight * randomFactor);
    
    // Create animated bar style
    const barStyle: ViewStyle = {
      width: barWidth,
      height: finalHeight,
      backgroundColor: isActive ? barColor : '#94a3b8',
      borderRadius: barWidth / 2,
      marginHorizontal: barSpacing / 2,
      opacity: isActive ? 0.8 + (normalizedLevel * 0.2) : 0.4, // Dynamic opacity
    };

    // Add gradient effect for active state
    if (isActive && normalizedLevel > 0.1) {
      return (
        <LinearGradient
          key={index}
          colors={[barColor, `${barColor}80`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={barStyle}
        />
      );
    }

    return <View key={index} style={barStyle} />;
  };

  return (
    <View style={containerStyle}>
      {waveformBars.map((level, index) => renderBar(level, index))}
    </View>
  );
};