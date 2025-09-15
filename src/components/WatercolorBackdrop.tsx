import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';
import WatercolorBlob from './WatercolorBlob';

interface WatercolorBackdropProps {
  style?: StyleProp<ViewStyle>;
}

/**
 * Animated backdrop that gently moves watercolor blobs for a meditative feel.
 */
const WatercolorBackdrop: React.FC<WatercolorBackdropProps> = ({ style }) => {
  const translate1 = useRef(new Animated.Value(0)).current;
  const translate2 = useRef(new Animated.Value(0)).current;
  const opacity1 = useRef(new Animated.Value(0.6)).current;
  const opacity2 = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const loop = () => {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(translate1, { toValue: 12, duration: 6000, useNativeDriver: true }),
          Animated.timing(translate1, { toValue: -12, duration: 6000, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(translate2, { toValue: -10, duration: 7000, useNativeDriver: true }),
          Animated.timing(translate2, { toValue: 10, duration: 7000, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity1, { toValue: 0.5, duration: 6000, useNativeDriver: true }),
          Animated.timing(opacity1, { toValue: 0.7, duration: 6000, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity2, { toValue: 0.45, duration: 7000, useNativeDriver: true }),
          Animated.timing(opacity2, { toValue: 0.6, duration: 7000, useNativeDriver: true }),
        ]),
      ]).start(() => loop());
    };
    loop();
  }, [translate1, translate2, opacity1, opacity2]);

  return (
    <Animated.View style={style} pointerEvents="none">
      <Animated.View style={{ position: 'absolute', top: -30, left: -20, opacity: opacity1, transform: [{ translateX: translate1 }] }}>
        <WatercolorBlob width={320} height={220} />
      </Animated.View>
      <Animated.View style={{ position: 'absolute', bottom: -20, right: -10, opacity: opacity2, transform: [{ translateX: translate2 }] }}>
        <WatercolorBlob width={280} height={200} />
      </Animated.View>
    </Animated.View>
  );
};

export default WatercolorBackdrop;


