import React, { createContext, useContext } from 'react';
import { Animated, Easing, useWindowDimensions, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

export type TabDirection = 1 | -1;

const TabTransitionDirectionContext = createContext<TabDirection>(1);

interface TabTransitionProviderProps {
  direction: TabDirection;
  children: React.ReactNode;
}

export const TabTransitionProvider: React.FC<TabTransitionProviderProps> = ({ direction, children }) => {
  return (
    <TabTransitionDirectionContext.Provider value={direction}>
      {children}
    </TabTransitionDirectionContext.Provider>
  );
};

function useTabTransitionDirection() {
  return useContext(TabTransitionDirectionContext);
}

interface TabSlideViewProps {
  children: React.ReactNode;
}

export const TabSlideView: React.FC<TabSlideViewProps> = ({ children }) => {
  const direction = useTabTransitionDirection();
  const isFocused = useIsFocused();
  const { width } = useWindowDimensions();

  const translateX = React.useRef(new Animated.Value(0)).current;
  const scale = React.useRef(new Animated.Value(1)).current;
  const opacity = React.useRef(new Animated.Value(isFocused ? 1 : 0)).current;
  
  const isInitialRender = React.useRef(true);

  React.useEffect(() => {
    // On initial render, immediately set the focused screen to be visible
    // and non-focused screens to be fully translated out of view.
    if (isInitialRender.current) {
      if (isFocused) {
        translateX.setValue(0);
        scale.setValue(1);
        opacity.setValue(1);
      } else {
        // Position off-screen. Direction doesn't matter yet.
        translateX.setValue(width); 
        scale.setValue(0.9);
        opacity.setValue(0);
      }
      isInitialRender.current = false;
      return;
    }

    // Animate based on focus change
    if (isFocused) {
      // ---- Animate IN ----
      // Instantly move to starting position
      translateX.setValue(width * direction);
      scale.setValue(0.9);
      opacity.setValue(0);

      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          tension: 120,
          friction: 20,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: 120,
          friction: 20,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // ---- Animate OUT ----
      // Current values are already set from the 'in' animation (translateX: 0, scale: 1, opacity: 1)
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: -width * direction, // Slide fully out
          tension: 120,
          friction: 20,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 0.9,
          tension: 120,
          friction: 20,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isFocused, direction, width]);

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill, // Use absolute positioning
        {
          transform: [{ translateX }, { scale }],
          opacity,
        },
      ]}
      pointerEvents={isFocused ? 'auto' : 'none'}
    >
      {children}
    </Animated.View>
  );
};
