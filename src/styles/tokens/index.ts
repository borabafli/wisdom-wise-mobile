/**
 * WisdomWise Design System - Design Tokens
 * Central export for all design tokens
 */

export { colors, gradients, type ColorTokens, type GradientTokens } from './colors';
export { typography, type TypographyTokens } from './typography';
export { spacing, type SpacingTokens } from './spacing';
export { shadows, type ShadowTokens } from './shadows';

// Re-export the individual token modules for direct access
import { colors, gradients } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { shadows } from './shadows';

// Combined design tokens
export const tokens = {
  colors,
  gradients,
  typography,
  spacing,
  shadows,
} as const;

export type DesignTokens = typeof tokens;