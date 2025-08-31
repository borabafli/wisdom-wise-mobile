import React, { useRef, useEffect } from 'react';
import { View, Animated } from 'react-native';

interface TypewriterAnimationProps {
  isActive: boolean;
}

export const AnimatedTypingCursor: React.FC<TypewriterAnimationProps> = ({ isActive }) => {
  const cursorOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isActive) {
      cursorOpacity.setValue(0);
      return;
    }

    const blinkAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0.2,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );

    blinkAnimation.start();

    return () => blinkAnimation.stop();
  }, [cursorOpacity, isActive]);

  if (!isActive) return null;

  return (
    <Animated.View 
      style={{ 
        marginLeft: 3,
        marginTop: 2,
        opacity: cursorOpacity
      }}
    >
      <View
        style={{
          width: 2,
          height: 18,
          backgroundColor: '#3b82f6',
          borderRadius: 1,
        }}
      />
    </Animated.View>
  );
};

export default AnimatedTypingCursor;