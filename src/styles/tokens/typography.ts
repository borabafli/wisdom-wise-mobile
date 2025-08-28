/**
 * WisdomWise Design System - Typography Tokens
 * Consistent typography scale and font definitions
 */

export const typography = {
  // Font Families (from your existing system)
  fontFamily: {
    primary: 'Inter', // Clean, readable for UI
    secondary: 'Poppins', // Friendly, approachable
    body: 'Nunito', // Warm, comfortable for reading
    serif: 'Source Serif Pro', // Elegant, authoritative
    display: 'Lora', // Beautiful for headings
    decorative: 'Crimson Text', // Sophisticated, calming
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
      fontFamily: 'Lora',
    },
    h2: {
      fontSize: 28,
      fontWeight: '600', 
      lineHeight: 36,
      fontFamily: 'Poppins',
    },
    h3: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
      fontFamily: 'Poppins',
    },
    h4: {
      fontSize: 20,
      fontWeight: '500',
      lineHeight: 28,
      fontFamily: 'Inter',
    },
    h5: {
      fontSize: 18,
      fontWeight: '500',
      lineHeight: 26,
      fontFamily: 'Inter',
    },
    h6: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
      fontFamily: 'Inter',
    },

    // Body Text
    bodyLarge: {
      fontSize: 18,
      fontWeight: '400',
      lineHeight: 28,
      fontFamily: 'Nunito',
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      fontFamily: 'Nunito',
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 22,
      fontFamily: 'Inter',
    },

    // UI Text
    button: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 22,
      fontFamily: 'Inter',
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 18,
      fontFamily: 'Inter',
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 20,
      fontFamily: 'Inter',
    },

    // Chat Interface
    chatMessage: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      fontFamily: 'Nunito',
    },
    chatTimestamp: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 18,
      fontFamily: 'Inter',
    },

    // Welcome & Headers
    welcomeTitle: {
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 36,
      fontFamily: 'Lora',
    },
    welcomeSubtitle: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      fontFamily: 'Nunito',
    },

    // Session Headers
    sessionTitle: {
      fontSize: 18,
      fontWeight: '500',
      lineHeight: 26,
      fontFamily: 'Poppins',
    },
    sessionSubtitle: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 22,
      fontFamily: 'Inter',
    },

    // Action Items
    actionTitle: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 24,
      fontFamily: 'Poppins',
    },
    actionDescription: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
      fontFamily: 'Inter',
    },
  },
} as const;

export type TypographyTokens = typeof typography;