/**
 * SafeAreaWrapper - Consistent safe area handling across platforms
 */
import React from 'react';
import { SafeAreaView, View, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets, useSafeAreaFrame } from 'react-native-safe-area-context';
import { containerStyles, isWeb, screenDimensions } from '../utils/crossPlatform';

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  backgroundColor?: string;
  statusBarStyle?: 'default' | 'dark-content' | 'light-content';
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  style?: any;
}

export const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  backgroundColor = '#ffffff',
  statusBarStyle = 'dark-content',
  edges = ['top', 'bottom'],
  style,
}) => {
  // Safe fallback for when SafeAreaProvider context is not available
  let insets;
  try {
    insets = useSafeAreaInsets();
  } catch (error) {
    console.warn('SafeAreaProvider context not available, using fallback values');
    // Fallback insets for when context is not available
    insets = {
      top: Platform.OS === 'ios' ? 44 : 0,
      bottom: Platform.OS === 'ios' ? 34 : 0,
      left: 0,
      right: 0,
    };
  }

  // Calculate safe area padding - FORCE disable bottom on Android
  const safePadding = {
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: edges.includes('bottom') && Platform.OS !== 'android' ? insets.bottom : 0,
    paddingLeft: edges.includes('left') ? insets.left : 0,
    paddingRight: edges.includes('right') ? insets.right : 0,
  };

  // Debug logging removed for cleaner output


  const containerStyle = {
    flex: 1,
    backgroundColor,
    ...safePadding,
    ...style,
  };

  if (isWeb) {
    // Web-specific container with max width for desktop
    const webContainerStyle = {
      ...containerStyle,
      maxWidth: screenDimensions.isDesktop ? 1200 : '100%',
      marginHorizontal: screenDimensions.isDesktop ? 'auto' : 0,
    };

    return (
      <View style={webContainerStyle}>
        {children}
      </View>
    );
  }

  return (
    <>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={backgroundColor}
        translucent={Platform.OS === 'android'}
      />
      <SafeAreaView style={containerStyle}>
        {children}
      </SafeAreaView>
    </>
  );
};

// Specialized wrapper for screens
export const ScreenWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  backgroundColor = '#f8fafc', // Default app background
  ...props
}) => {
  return (
    <SafeAreaWrapper 
      backgroundColor={backgroundColor}
      edges={['top', 'bottom', 'left', 'right']}
      {...props}
    >
      <View style={containerStyles.screenPadding}>
        {children}
      </View>
    </SafeAreaWrapper>
  );
};

// Modal wrapper that handles different safe areas
export const ModalWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  backgroundColor = '#ffffff',
  ...props
}) => {
  return (
    <SafeAreaWrapper
      backgroundColor={backgroundColor}
      edges={['top', 'bottom']}
      {...props}
    >
      {children}
    </SafeAreaWrapper>
  );
};