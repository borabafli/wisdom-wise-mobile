/**
 * WisdomWise Design System - Typography Tokens
 * Consistent typography scale and font definitions
 */

export const typography = {
  // Font Families (from your existing system)
  fontFamily: {
    primary: 'System', // Clean, readable for UI
    secondary: 'System', // Friendly, approachable
    body: 'System', // Warm, comfortable for reading
    serif: 'System', // Elegant, authoritative
    display: 'System', // Beautiful for headings
    decorative: 'System', // Sophisticated, calming
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
      fontFamily: 'System',
    },
    h2: {
      fontSize: 28,
      fontWeight: '600', 
      lineHeight: 36,
      fontFamily: 'System',
    },
    h3: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
      fontFamily: 'System',
    },
    h4: {
      fontSize: 20,
      fontWeight: '500',
      lineHeight: 28,
      fontFamily: 'System',
    },
    h5: {
      fontSize: 18,
      fontWeight: '500',
      lineHeight: 26,
      fontFamily: 'System',
    },
    h6: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
      fontFamily: 'System',
    },

    // Body Text
    bodyLarge: {
      fontSize: 18,
      fontWeight: '400',
      lineHeight: 28,
      fontFamily: 'System',
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      fontFamily: 'System',
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 22,
      fontFamily: 'System',
    },

    // UI Text
    button: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 22,
      fontFamily: 'System',
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 18,
      fontFamily: 'System',
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 20,
      fontFamily: 'System',
    },

    // Chat Interface
    chatMessage: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      fontFamily: 'System',
    },
    chatTimestamp: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 18,
      fontFamily: 'System',
    },

    // Welcome & Headers
    welcomeTitle: {
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 36,
      fontFamily: 'System',
    },
    welcomeSubtitle: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      fontFamily: 'System',
    },

    // Session Headers
    sessionTitle: {
      fontSize: 18,
      fontWeight: '500',
      lineHeight: 26,
      fontFamily: 'System',
    },
    sessionSubtitle: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 22,
      fontFamily: 'System',
    },

    // Action Items
    actionTitle: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 24,
      fontFamily: 'System',
    },
    actionDescription: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
      fontFamily: 'System',
    },
  },
} as const;

export type TypographyTokens = typeof typography;