import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';

interface WatercolorBlobProps {
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
  /**
   * Base teal color stops from center to edge. Provide 2-3 stops from darker to lighter.
   */
  stops?: { offset: string; color: string; opacity?: number }[];
  /** Overall opacity for the blob group */
  opacity?: number;
}

/**
 * Minimal watercolor-like blob built from overlapping radial gradients.
 * This avoids heavy filters and performs well on mobile.
 */
const WatercolorBlob: React.FC<WatercolorBlobProps> = ({
  width = 260,
  height = 180,
  style,
  stops = [
    { offset: '0%', color: '#2E8C9E', opacity: 0.30 },
    { offset: '60%', color: '#5BA3B8', opacity: 0.20 },
    { offset: '100%', color: '#A7D8DC', opacity: 0.00 },
  ],
  opacity = 1,
}) => {
  const gradientStops = stops.map((s, i) => (
    <Stop key={i} offset={s.offset} stopColor={s.color} stopOpacity={s.opacity ?? 1} />
  ));

  return (
    <View style={style} pointerEvents="none">
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} opacity={opacity}>
        <Defs>
          <RadialGradient id="grad1" cx="30%" cy="40%" rx="55%" ry="55%">
            {gradientStops}
          </RadialGradient>
          <RadialGradient id="grad2" cx="70%" cy="50%" rx="50%" ry="50%">
            {gradientStops}
          </RadialGradient>
          <RadialGradient id="grad3" cx="45%" cy="70%" rx="45%" ry="45%">
            {gradientStops}
          </RadialGradient>
        </Defs>

        {/* Overlapping soft circles to evoke organic watercolor pooling */}
        <Circle cx={width * 0.30} cy={height * 0.40} r={Math.min(width, height) * 0.38} fill="url(#grad1)" />
        <Circle cx={width * 0.70} cy={height * 0.50} r={Math.min(width, height) * 0.36} fill="url(#grad2)" />
        <Circle cx={width * 0.50} cy={height * 0.70} r={Math.min(width, height) * 0.32} fill="url(#grad3)" />

        {/* Small splatters for spontaneity */}
        <Circle cx={width * 0.15} cy={height * 0.20} r={3} fill="#5BA3B8" opacity={0.18} />
        <Circle cx={width * 0.85} cy={height * 0.25} r={2.5} fill="#2E8C9E" opacity={0.16} />
        <Circle cx={width * 0.78} cy={height * 0.78} r={2} fill="#5BA3B8" opacity={0.14} />
        <Circle cx={width * 0.22} cy={height * 0.75} r={2.5} fill="#4FA0AF" opacity={0.16} />
      </Svg>
    </View>
  );
};

export default WatercolorBlob;


