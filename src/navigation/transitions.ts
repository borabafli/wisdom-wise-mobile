import { Easing } from 'react-native';
import {
  CardStyleInterpolators,
  StackNavigationOptions,
  TransitionSpec,
} from '@react-navigation/stack';

const slideOpenConfig: TransitionSpec = {
  animation: 'timing',
  config: {
    duration: 320,
    easing: Easing.out(Easing.cubic),
  },
};

const slideCloseConfig: TransitionSpec = {
  animation: 'timing',
  config: {
    duration: 280,
    easing: Easing.in(Easing.cubic),
  },
};

export const smoothSlideTransition: StackNavigationOptions = {
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  transitionSpec: {
    open: slideOpenConfig,
    close: slideCloseConfig,
  },
};
