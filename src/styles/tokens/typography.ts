/**
 * WisdomWise Design System - Typography Tokens
 * Consistent typography scale and font definitions
 */

export const typography = {
  // Font Families - Nunito as main font
  fontFamily: {
    primary: 'Nunito-Regular', // Clean, readable for UI
    secondary: 'Nunito-Medium', // Friendly, approachable
    body: 'Nunito-Regular', // Warm, comfortable for reading
    serif: 'Nunito-Regular', // Elegant, readable
    display: 'Nunito-SemiBold', // Beautiful for headings
    decorative: 'Nunito-Regular', // Sophisticated, calming
    clash: 'ClashGrotesk-Regular', // For quoted content
    clashMedium: 'ClashGrotesk-Medium', // For quoted content emphasis
    clashBold: 'ClashGrotesk-Bold', // For quoted content emphasis
    ubuntu: 'Ubuntu-Regular', // For quoted content and chat
    ubuntuMedium: 'Ubuntu-Medium', // For quoted content emphasis
    ubuntuBold: 'Ubuntu-Bold', // For quoted content emphasis
    system: 'System', // Fallback
  },

  // Font Weights
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500', 
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 40,
    '6xl': 48,
  },

  // Line Heights
  lineHeight: {
    tight: 20,
    normal: 22,
    relaxed: 24,
    loose: 28,
    extra: 32,
  },

  // Text Styles - Predefined combinations
  textStyles: {
    // Headers
    h1: {
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 40,
      fontFamily: 'Nunito-Bold',
    },
    h2: {
      fontSize: 28,
      fontWeight: '600', 
      lineHeight: 36,
      fontFamily: 'Nunito-SemiBold',
    },
    h3: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
      fontFamily: 'Nunito-SemiBold',
    },
    h4: {
      fontSize: 20,
      fontWeight: '500',
      lineHeight: 28,
      fontFamily: 'Nunito-Medium',
    },
    h5: {
      fontSize: 18,
      fontWeight: '500',
      lineHeight: 26,
      fontFamily: 'Nunito-Medium',
    },
    h6: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
      fontFamily: 'Nunito-Medium',
    },

    // Body Text
    bodyLarge: {
      fontSize: 18,
      fontWeight: '400',
      lineHeight: 28,
      fontFamily: 'Nunito-Regular',
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      fontFamily: 'Nunito-Regular',
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 22,
      fontFamily: 'Nunito-Regular',
    },

    // UI Text
    button: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 22,
      fontFamily: 'Nunito-Medium',
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 18,
      fontFamily: 'Nunito-Regular',
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 20,
      fontFamily: 'Nunito-Medium',
    },

    // Chat Interface
    chatMessage: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      fontFamily: 'Ubuntu-Regular',
    },
    chatTimestamp: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 18,
      fontFamily: 'Nunito-Regular',
    },

    // Welcome & Headers
    welcomeTitle: {
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 36,
      fontFamily: 'Nunito-Bold',
    },
    welcomeSubtitle: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      fontFamily: 'Nunito-Regular',
    },

    // Session Headers
    sessionTitle: {
      fontSize: 18,
      fontWeight: '500',
      lineHeight: 26,
      fontFamily: 'Nunito-Medium',
    },
    sessionSubtitle: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 22,
      fontFamily: 'Nunito-Regular',
    },

    // Action Items
    actionTitle: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 24,
      fontFamily: 'Nunito-SemiBold',
    },
    actionDescription: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
      fontFamily: 'Nunito-Regular',
    },

    // Quoted Content - Ubuntu
    quote: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      fontFamily: 'Ubuntu-Regular',
    },
    quoteMedium: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
      fontFamily: 'Ubuntu-Medium',
    },
    quoteLarge: {
      fontSize: 18,
      fontWeight: '400',
      lineHeight: 26,
      fontFamily: 'Ubuntu-Regular',
    },
  },

  // Legacy structure for backward compatibility
  heading: {
    xs: {
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 20,
      fontFamily: 'Nunito-SemiBold',
    },
    sm: {
      fontSize: 16,
      fontWeight: '600', 
      lineHeight: 24,
      fontFamily: 'Nunito-SemiBold',
    },
    md: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 26,
      fontFamily: 'Nunito-SemiBold', 
    },
    lg: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
      fontFamily: 'Nunito-SemiBold',
    },
    xl: {
      fontSize: 24,
      fontWeight: '700',
      lineHeight: 32,
      fontFamily: 'Nunito-Bold',
    },
    '2xl': {
      fontSize: 28,
      fontWeight: '700', 
      lineHeight: 36,
      fontFamily: 'Nunito-Bold',
    },
  },

  body: {
    xs: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 18,
      fontFamily: 'Nunito-Regular',
    },
    sm: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
      fontFamily: 'Nunito-Regular',
    },
    md: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      fontFamily: 'Nunito-Regular',
    },
    lg: {
      fontSize: 18,
      fontWeight: '400',
      lineHeight: 28,
      fontFamily: 'Nunito-Regular',
    },
  },
} as const;

export type TypographyTokens = typeof typography;