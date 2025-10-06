import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

export const AnimatedTranscribingText: React.FC = () => {
  // Gradient shimmer animation - actually moves across text
  const shimmerTranslate = useRef(new Animated.Value(-1)).current;

  // Sequential dots animation
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Shimmer gradient - smooth back and forth motion (no abrupt reset)
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerTranslate, {
          toValue: 1,
          duration: 2000, // Slower - 2 seconds forward
          useNativeDriver: true,
        }),
        Animated.timing(shimmerTranslate, {
          toValue: -1,
          duration: 2000, // 2 seconds back - smooth reverse
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Sequential dots appearing one after another - slower
    const animateDots = () => {
      Animated.sequence([
        Animated.timing(dot1, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dot2, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dot3, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.delay(500),
        Animated.parallel([
          Animated.timing(dot1, { toValue: 0, duration: 0, useNativeDriver: true }),
          Animated.timing(dot2, { toValue: 0, duration: 0, useNativeDriver: true }),
          Animated.timing(dot3, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      ]).start(() => animateDots());
    };

    animateDots();
  }, []);

  const textStyle = {
    fontSize: 17,
    fontFamily: 'Inter-Regular',
    fontWeight: '600' as const, // Bolder
    color: '#cbcbcb', // Lighter base color
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ position: 'relative' }}>
        {/* Base text - always visible */}
        <Text style={textStyle}>Transcribing</Text>

        {/* Gradient overlay - ACTUALLY moves across text */}
        <MaskedView
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          maskElement={
            <Text style={textStyle}>Transcribing</Text>
          }
        >
          <Animated.View
            style={{
              width: 300, // Much wider than text
              height: 30,
              transform: [
                {
                  translateX: shimmerTranslate.interpolate({
                    inputRange: [-1, 1],
                    outputRange: [-150, 150], // Actually travels from left to right
                  }),
                },
              ],
            }}
          >
            <LinearGradient
              colors={['#cbcbcb', '#5e766e', '#cbcbcb']} // Light gray to green-gray gradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </Animated.View>
        </MaskedView>
      </View>

      {/* Sequential Dots */}
      <View style={{ flexDirection: 'row', marginLeft: 2 }}>
        <Animated.Text style={{ opacity: dot1, ...textStyle }}>.</Animated.Text>
        <Animated.Text style={{ opacity: dot2, ...textStyle }}>.</Animated.Text>
        <Animated.Text style={{ opacity: dot3, ...textStyle }}>.</Animated.Text>
      </View>
    </View>
  );
};
