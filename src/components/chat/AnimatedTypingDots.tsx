import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { chatInterfaceStyles as styles } from '../../styles/components/ChatInterface.styles';

interface AnimatedTypingDotsProps {
  isVisible: boolean;
}

export const AnimatedTypingDots: React.FC<AnimatedTypingDotsProps> = ({ isVisible }) => {
  const dot1TranslateY = useRef(new Animated.Value(0)).current;
  const dot2TranslateY = useRef(new Animated.Value(0)).current;
  const dot3TranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isVisible) {
      // Reset all dots to normal position when not visible
      dot1TranslateY.setValue(0);
      dot2TranslateY.setValue(0);
      dot3TranslateY.setValue(0);
      return;
    }

    const createJumpAnimation = (dotTranslateY: Animated.Value, initialDelay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(initialDelay), // Initial stagger delay
          Animated.timing(dotTranslateY, {
            toValue: -8, // Jump up by 8 pixels
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dotTranslateY, {
            toValue: 0, // Return to original position
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Start animations with staggered delays for wave effect
    const dot1Animation = createJumpAnimation(dot1TranslateY, 0);
    const dot2Animation = createJumpAnimation(dot2TranslateY, 150);
    const dot3Animation = createJumpAnimation(dot3TranslateY, 300);

    dot1Animation.start();
    dot2Animation.start();
    dot3Animation.start();

    // Cleanup function
    return () => {
      dot1Animation.stop();
      dot2Animation.stop();
      dot3Animation.stop();
    };
  }, [isVisible, dot1TranslateY, dot2TranslateY, dot3TranslateY]);

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.typingDots}>
      <Animated.View 
        style={[
          styles.typingDot, 
          { transform: [{ translateY: dot1TranslateY }] }
        ]} 
      />
      <Animated.View 
        style={[
          styles.typingDot, 
          { transform: [{ translateY: dot2TranslateY }] }
        ]} 
      />
      <Animated.View 
        style={[
          styles.typingDot, 
          { transform: [{ translateY: dot3TranslateY }] }
        ]} 
      />
    </View>
  );
};

export default AnimatedTypingDots;