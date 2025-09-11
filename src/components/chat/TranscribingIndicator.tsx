import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { chatInterfaceStyles as styles } from '../../styles/components/ChatInterface.styles';

interface TranscribingIndicatorProps {
  isVisible: boolean;
}

export const TranscribingIndicator: React.FC<TranscribingIndicatorProps> = ({ isVisible }) => {
  const dot1Opacity = useRef(new Animated.Value(0.3)).current;
  const dot2Opacity = useRef(new Animated.Value(0.3)).current;
  const dot3Opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (!isVisible) {
      // Reset all dots to low opacity when not visible
      dot1Opacity.setValue(0.3);
      dot2Opacity.setValue(0.3);
      dot3Opacity.setValue(0.3);
      return;
    }

    const createDotAnimation = (dotOpacity: Animated.Value, initialDelay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(initialDelay), // Initial stagger delay
          Animated.timing(dotOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: false,
          }),
          Animated.timing(dotOpacity, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: false,
          }),
        ])
      );
    };

    // Start animations with staggered delays
    const dot1Animation = createDotAnimation(dot1Opacity, 0);
    const dot2Animation = createDotAnimation(dot2Opacity, 200);
    const dot3Animation = createDotAnimation(dot3Opacity, 400);

    dot1Animation.start();
    dot2Animation.start();
    dot3Animation.start();

    // Cleanup function
    return () => {
      dot1Animation.stop();
      dot2Animation.stop();
      dot3Animation.stop();
    };
  }, [isVisible, dot1Opacity, dot2Opacity, dot3Opacity]);

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.userMessageContainer}>
      <View style={[styles.userMessageBubble, { backgroundColor: '#7FC4C4' }]}>
        <View style={styles.transcribingMessageContent}>
          <Text style={styles.transcribingMessageText}>Transcribing</Text>
          <View style={styles.transcribingMessageDots}>
            <Animated.View 
              style={[
                styles.transcribingMessageDot, 
                { opacity: dot1Opacity }
              ]}
            />
            <Animated.View 
              style={[
                styles.transcribingMessageDot, 
                { opacity: dot2Opacity }
              ]}
            />
            <Animated.View 
              style={[
                styles.transcribingMessageDot, 
                { opacity: dot3Opacity }
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default TranscribingIndicator;