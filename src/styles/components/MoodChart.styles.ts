/**
 * MoodChart Styles - Therapeutic Design System
 * Following mindful minimalism principles for mental health apps
 */

import { tokens } from '../tokens';

export const moodChartStyles = {
  // Container styles - transparent for clean look
  chartContainer: {
    backgroundColor: 'transparent',
    paddingVertical: tokens.spacing.therapy.sm,
    paddingHorizontal: 0,
  },

  // Loading states with calm aesthetics
  loadingContainer: {
    backgroundColor: 'transparent',
    borderRadius: tokens.spacing.radius.lg,
    paddingVertical: tokens.spacing.therapy.lg,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  loadingText: {
    color: tokens.colors.text.tertiary,
    fontSize: tokens.typography.fontSize.sm,
    fontFamily: tokens.typography.fontFamily.body,
  },

  // Empty state with supportive messaging
  emptyContainer: {
    backgroundColor: 'transparent',
    borderRadius: tokens.spacing.radius.lg,
    paddingVertical: tokens.spacing.therapy.lg,
    paddingHorizontal: tokens.spacing.therapy.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderWidth: 1,
    borderColor: 'rgba(229, 231, 235, 0.4)',
    borderStyle: 'dashed' as const,
  },

  emptyTitle: {
    color: tokens.colors.text.tertiary,
    fontSize: tokens.typography.fontSize.sm,
    fontFamily: tokens.typography.fontFamily.body,
    fontWeight: '500' as const,
  },

  emptySubtitle: {
    color: tokens.colors.text.light,
    fontSize: tokens.typography.fontSize.xs,
    marginTop: tokens.spacing.therapy.xs,
    textAlign: 'center' as const,
    fontFamily: tokens.typography.fontFamily.body,
    lineHeight: 18,
  },

  // Sample data button styles
  sampleDataButton: {
    marginTop: tokens.spacing.therapy.md,
    backgroundColor: tokens.colors.teal[400],
    paddingHorizontal: tokens.spacing.therapy.md,
    paddingVertical: tokens.spacing.therapy.xs,
    borderRadius: tokens.spacing.radius.pill,
    ...tokens.shadows.components.actionButton,
  },

  sampleDataButtonText: {
    color: tokens.colors.white,
    fontSize: tokens.typography.fontSize.xs,
    fontWeight: '500' as const,
    fontFamily: tokens.typography.fontFamily.body,
  },

  // Emoji axis styling
  emojiContainer: {
    position: 'absolute' as const,
    left: tokens.spacing.therapy.xs,
    top: 0,
    justifyContent: 'space-between' as const,
  },

  emojiText: {
    fontSize: 16,
    textAlign: 'center' as const,
    opacity: 0.6,
  },

  // X-axis labels with readable typography
  labelsContainer: {
    position: 'absolute' as const,
    bottom: tokens.spacing.therapy.sm,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },

  labelText: {
    fontSize: tokens.typography.fontSize.xs,
    color: tokens.colors.text.tertiary,
    textAlign: 'center' as const,
    fontWeight: '500' as const,
    fontFamily: tokens.typography.fontFamily.body,
  },

  // Weekly comparison styles - New unified design
  weeklyContainer: {
    paddingHorizontal: tokens.spacing.therapy.lg,
    paddingVertical: tokens.spacing.therapy.md,
    backgroundColor: 'transparent' as const,
  },

  // Main comparison card
  comparisonCard: {
    backgroundColor: tokens.colors.white,
    borderRadius: tokens.spacing.radius.lg,
    padding: tokens.spacing.therapy.lg,
    shadowColor: tokens.colors.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: tokens.colors.gray[100],
  },

  // Header with trend indicator
  comparisonHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: tokens.spacing.therapy.md,
  },

  comparisonTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#374151',
    fontFamily: 'Inter-SemiBold',
  },

  trendIndicator: {
    backgroundColor: '#EFF6FF',
    borderRadius: tokens.spacing.radius.pill,
    paddingHorizontal: tokens.spacing.therapy.sm,
    paddingVertical: 4,
  },

  trendText: {
    fontSize: tokens.typography.fontSize.xs,
    fontWeight: '500' as const,
    color: '#1D4ED8',
    fontFamily: tokens.typography.fontFamily.body,
  },

  // Progress visualization
  progressVisualization: {
    gap: tokens.spacing.therapy.md,
  },

  // Side-by-side weeks layout
  weeksRow: {
    flexDirection: 'row' as const,
    gap: tokens.spacing.therapy.lg,
  },

  weekSection: {
    flex: 1,
  },

  weekHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: tokens.spacing.therapy.xs,
  },

  weekPeriod: {
    fontSize: tokens.typography.fontSize.sm,
    fontWeight: '500' as const,
    color: tokens.colors.text.secondary,
    fontFamily: tokens.typography.fontFamily.body,
  },

  moodEmoji: {
    fontSize: 20,
  },

  moodLabel: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.text.primary,
    fontWeight: '600' as const,
    marginBottom: tokens.spacing.therapy.xs,
    fontFamily: tokens.typography.fontFamily.body,
  },

  progressBar: {
    height: 8,
    backgroundColor: tokens.colors.gray[100],
    borderRadius: tokens.spacing.radius.sm,
    overflow: 'hidden' as const,
  },

  progressFill: {
    height: '100%',
    borderRadius: tokens.spacing.radius.sm,
  },

  previousWeekFill: {
    backgroundColor: '#5A88B5', // Previous week using blue with reduced opacity
    opacity: 0.6,
  },

  currentWeekFill: {
    backgroundColor: '#5A88B5', // Current week using blue
  },

  // Chart SVG colors following therapeutic palette
  colors: {
    // Warm, therapeutic gradients for the line
    lineGradient: {
      start: '#8B5CF6', // Warm purple
      middle: '#6366F1', // Indigo
      end: '#3B82F6',   // Blue
    },
    
    // Calming area fill with warm tones
    areaGradient: {
      start: '#EDE9FE', // Light purple
      middle: '#EEF2FF', // Light indigo
      end: tokens.colors.white,
    },
    
    // Gentle effects with warm colors
    glow: '#A78BFA',   // Purple-400
    shadow: '#7C3AED', // Purple-600
    gridLines: tokens.colors.gray[200],
    
    // Data points with warm accent
    dataPointFill: tokens.colors.white,
    dataPointStroke: '#6366F1', // Indigo-500
    dataPointHighlight: '#8B5CF6', // Purple-500
  },

  // Chart dimensions with breathing room
  dimensions: {
    defaultHeight: 220,
    paddingVertical: tokens.spacing.therapy.lg,
    paddingHorizontal: tokens.spacing.therapy.md,
  },
} as const;

export type MoodChartStyles = typeof moodChartStyles;