/**
 * WisdomWise Design System - Spacing Tokens
 * Consistent spacing scale for margins, padding, and gaps
 */

export const spacing = {
  // Base spacing scale (in pixels)
  0: 0,
  1: 2,
  2: 4,
  3: 6,
  4: 8,
  5: 10,
  6: 12,
  7: 14,
  8: 16,
  9: 18,
  10: 20,
  11: 22,
  12: 24,
  14: 28,
  16: 32,
  18: 36,
  20: 40,
  24: 48,
  28: 56,
  32: 64,
  36: 72,
  40: 80,
  48: 96,
  56: 112,
  64: 128,

  // Semantic spacing (therapy-focused)
  therapy: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
  },

  // Component-specific spacing
  components: {
    // Chat Interface
    messageGap: 20,
    messagePadding: 16,
    avatarSize: 36,
    avatarGap: 12,
    inputPadding: 20,
    contentGap: 20,
    
    // Tab Bar
    tabPadding: 12,
    tabGap: 8,
    
    // Cards & Containers
    cardPadding: 20,
    cardGap: 16,
    containerPadding: 24,
    
    // Buttons
    buttonPaddingH: 20,
    buttonPaddingV: 12,
    buttonGap: 8,
    
    // Form Elements
    inputPaddingH: 16,
    inputPaddingV: 14,
    labelGap: 8,
  },

  // Layout spacing
  layout: {
    screenPadding: 24,
    sectionGap: 32,
    contentGap: 20,
    headerHeight: 88,
    tabBarHeight: 88,
  },

  // Border radius scale
  radius: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    full: 9999,
    
    // Semantic radius
    soft: 12,
    medium: 16, 
    large: 24,
    pill: 9999,
  },
} as const;

export type SpacingTokens = typeof spacing;