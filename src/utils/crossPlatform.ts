/**
 * Cross-platform utilities for consistent UI across all devices
 */
import { Platform, Dimensions, StatusBar } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Device breakpoints for responsive design
export const breakpoints = {
  xs: 320,  // Very small phones
  sm: 375,  // iPhone SE, small phones
  md: 414,  // Standard phone size
  lg: 768,  // Tablet portrait
  xl: 1024, // Tablet landscape
  xxl: 1200 // Desktop
};

// Check if we're on a specific platform
export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isMobile = isIOS || isAndroid;

// Screen dimensions and breakpoint helpers
export const screenDimensions = {
  width: screenWidth,
  height: screenHeight,
  isSmall: screenWidth < breakpoints.sm,
  isMedium: screenWidth >= breakpoints.sm && screenWidth < breakpoints.lg,
  isLarge: screenWidth >= breakpoints.lg,
  isTablet: screenWidth >= breakpoints.lg,
  isDesktop: screenWidth >= breakpoints.xl,
};

// Safe area helpers
export const getSafeAreaInsets = () => {
  const statusBarHeight = Platform.OS === 'ios' 
    ? getStatusBarHeight(true) 
    : StatusBar.currentHeight || 0;

  return {
    top: statusBarHeight,
    bottom: isIOS && screenHeight >= 812 ? 34 : 0, // iPhone X+ home indicator
    left: 0,
    right: 0,
  };
};

// Touch target helpers
export const touchTargets = {
  minimum: 44,      // Minimum touch target size
  comfortable: 48,  // Comfortable touch target
  large: 56,        // Large touch target for primary actions
};

// Responsive font scaling
export const responsiveFontSize = (size: number) => {
  const scale = screenWidth / 375; // Base on iPhone 8 width
  const newSize = size * scale;
  
  // Limit scaling between 0.85 and 1.3
  return Math.max(size * 0.85, Math.min(newSize, size * 1.3));
};

// Responsive spacing
export const responsiveSpacing = (spacing: number) => {
  if (screenDimensions.isTablet) {
    return spacing * 1.2; // Slightly more spacing on tablets
  }
  if (screenDimensions.isSmall) {
    return spacing * 0.9; // Slightly less spacing on small screens
  }
  return spacing;
};

// Platform-specific styles
export const platformStyles = {
  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    android: {
      elevation: 4,
    },
    web: {
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
  }),
  
  borderRadius: Platform.select({
    ios: 12,
    android: 8,
    web: 12,
  }),
  
  headerHeight: Platform.select({
    ios: 44,
    android: 56,
    web: 64,
  }),
};

// Common container styles
export const containerStyles = {
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    ...getSafeAreaInsets(),
  },
  
  screenPadding: {
    paddingHorizontal: responsiveSpacing(20),
    paddingVertical: responsiveSpacing(16),
  },
  
  cardPadding: {
    padding: responsiveSpacing(16),
  },
  
  section: {
    marginBottom: responsiveSpacing(24),
  },
};

// Typography helpers for cross-platform consistency
export const typographyHelpers = {
  // Apply text style with responsive scaling
  applyTextStyle: (style: any) => ({
    ...style,
    fontSize: responsiveFontSize(style.fontSize),
    lineHeight: style.lineHeight ? responsiveFontSize(style.lineHeight) : undefined,
  }),
  
  // Get appropriate font family with fallbacks
  getFontFamily: (fontFamily: string) => {
    // Map design token fonts to actual font names
    const fontMap: Record<string, string> = {
      'Nunito-Regular': Platform.select({
        ios: 'Nunito-Regular',
        android: 'Nunito-Regular', 
        web: 'Nunito, system-ui, sans-serif',
      }) || 'System',
      'Nunito-Medium': Platform.select({
        ios: 'Nunito-Medium',
        android: 'Nunito-Medium',
        web: 'Nunito, system-ui, sans-serif',
      }) || 'System',
      'Nunito-SemiBold': Platform.select({
        ios: 'Nunito-SemiBold', 
        android: 'Nunito-SemiBold',
        web: 'Nunito, system-ui, sans-serif',
      }) || 'System',
      'Nunito-Bold': Platform.select({
        ios: 'Nunito-Bold',
        android: 'Nunito-Bold',
        web: 'Nunito, system-ui, sans-serif', 
      }) || 'System',
      'Ubuntu-Regular': Platform.select({
        ios: 'Ubuntu-Regular',
        android: 'Ubuntu-Regular',
        web: 'Ubuntu, system-ui, sans-serif',
      }) || 'System',
      'ClashGrotesk-Regular': Platform.select({
        ios: 'ClashGrotesk-Regular',
        android: 'ClashGrotesk-Regular',
        web: 'ClashGrotesk, system-ui, sans-serif',
      }) || 'System',
    };
    
    return fontMap[fontFamily] || fontFamily;
  },
};

// Common responsive patterns
export const responsivePatterns = {
  // Flexible button sizing
  buttonSize: {
    small: {
      height: touchTargets.minimum,
      paddingHorizontal: responsiveSpacing(12),
      paddingVertical: responsiveSpacing(8),
    },
    medium: {
      height: touchTargets.comfortable,
      paddingHorizontal: responsiveSpacing(16),
      paddingVertical: responsiveSpacing(12),
    },
    large: {
      height: touchTargets.large,
      paddingHorizontal: responsiveSpacing(24),
      paddingVertical: responsiveSpacing(16),
    },
  },
  
  // Card layouts
  card: {
    borderRadius: platformStyles.borderRadius,
    padding: containerStyles.cardPadding.padding,
    ...platformStyles.shadow,
    backgroundColor: '#ffffff',
  },
  
  // List item spacing
  listItem: {
    paddingVertical: responsiveSpacing(12),
    paddingHorizontal: responsiveSpacing(16),
    minHeight: touchTargets.comfortable,
  },
};