/**
 * WisdomWise Design System - Color Tokens
 * Consistent color palette for the entire application
 */

export const colors = {
  // Primary Theme Colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe', 
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Main primary
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  // Blue Theme (Therapy & Chat)
  blue: {
    50: '#dbeafe',
    100: '#bfdbfe', 
    200: '#93c5fd',
    300: '#60a5fa',
    400: '#3b82f6', // Main blue
    500: '#2563eb',
    600: '#1d4ed8',
    700: '#1e40af',
    800: '#1e3a8a',
    900: '#1e293b',
  },

  // Therapeutic Greens
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0', 
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Mindfulness Teal
  teal: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },

  // Warm Orange (Gratitude)
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },

  // Purple (Exercises)
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },

  // Neutral Grays
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9', 
    150: '#f0f4f8',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },

  // Semantic Colors
  semantic: {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  // Special Colors
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',

  // Background Gradients
  gradients: {
    primaryLight: ['#f0f9ff', '#e0f2fe'],
    therapyCalm: ['#dbeafe', '#f0f9ff', '#bfdbfe'],
    turtleWisdom: ['rgba(59, 130, 246, 0.1)', 'rgba(147, 197, 253, 0.08)', 'transparent'],
    messageUser: ['#6794C4', '#2883B5'],
    messageSystem: ['rgba(255, 255, 255, 0.95)', 'rgba(248, 250, 252, 0.9)'],
    micButton: ['#3b82f6', '#1d4ed8'],
    stopButton: ['#ef4444', '#dc2626'],
  },

  // Text Colors
  text: {
    primary: '#111827',
    secondary: '#374151', 
    tertiary: '#6b7280',
    light: '#9ca3af',
    inverse: '#ffffff',
    disabled: '#d1d5db',
  },

  // Chat Colors
  chat: {
    bulletPoint: '#006A8F', // Turtle message bullet points and list numbers
  },

  // Border Colors - Ultra Subtle
  border: {
    light: 'rgba(255, 255, 255, 0.2)',
    medium: 'rgba(255, 255, 255, 0.25)', 
    dark: 'rgba(255, 255, 255, 0.3)',
    primary: 'rgba(59, 130, 246, 0.25)',
    focus: 'rgba(59, 130, 246, 0.4)',
    glass: 'rgba(255, 255, 255, 0.15)',
  },

  // Background Colors - Modern Glass Morphism
  background: {
    primary: 'rgba(255, 255, 255, 0.05)',
    secondary: 'rgba(255, 255, 255, 0.1)',
    tertiary: 'rgba(248, 250, 252, 0.08)',
    glass: 'rgba(255, 255, 255, 0.15)',
    card: 'rgba(255, 255, 255, 0.12)',
    blur: 'rgba(255, 255, 255, 0.08)',
  },

  // Overlay Colors
  overlay: {
    dark: 'rgba(0, 0, 0, 0.5)',
    light: 'rgba(255, 255, 255, 0.8)',
  },

  // Primary colors with alpha variants
  primaryAlpha: {
    10: 'rgba(59, 130, 246, 0.1)',
    20: 'rgba(59, 130, 246, 0.2)',
  },
} as const;

// Separate gradients for easier access
export const gradients = {
  // Background gradients - Ultra Modern
  background: {
    calm: ['rgba(59, 130, 246, 0.02)', 'rgba(147, 197, 253, 0.03)', 'rgba(186, 230, 253, 0.02)'],
    primary: ['rgba(255, 255, 255, 0.08)', 'rgba(248, 250, 252, 0.05)'],
    glass: ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.08)'],
  },
  
  // Card gradients - Modern Glass
  card: {
    primary: ['rgba(255, 255, 255, 0.15)', 'rgba(248, 250, 252, 0.12)'],
    glass: ['rgba(255, 255, 255, 0.18)', 'rgba(255, 255, 255, 0.12)'],
    subtle: ['rgba(59, 130, 246, 0.08)', 'rgba(147, 197, 253, 0.05)'],
    message: ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.15)'],
  },
  
  // Button gradients
  button: {
    primary: ['#4A98BC', '#3A7A9A'],
    blue: ['#3b82f6', '#1d4ed8'],
    purple: ['#8b5cf6', '#7c3aed'],
    cyan: ['#06b6d4', '#0891b2'],
    emerald: ['#10b981', '#059669'],
    subtle: ['rgba(186, 230, 253, 0.6)', 'rgba(147, 197, 253, 0.5)'],

  },
  
  // Icon gradients
  icon: {
    blue: ['#bfdbfe', '#7dd3fc'],
  },
  
  // Hero gradients
  hero: {
    primary: ['rgba(59, 130, 246, 0.4)', 'rgba(14, 165, 233, 0.3)', 'rgba(37, 99, 235, 0.5)'],
  },
} as const;

export type ColorTokens = typeof colors;
export type GradientTokens = typeof gradients;