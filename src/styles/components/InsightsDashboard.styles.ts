/**
 * InsightsDashboard Component Styles
 * Separated from component for better maintainability
 */

import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

const { width, height } = Dimensions.get('window');

export const insightsDashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  watercolorBlob: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.3,
  },
  blob1: {
    top: 0,
    right: -80,
    width: 256,
    height: 256,
    backgroundColor: 'rgba(96, 165, 250, 0.15)', // Softer blue
  },
  blob2: {
    bottom: 0,
    left: -96,
    width: 384,
    height: 384,
    backgroundColor: 'rgba(147, 197, 253, 0.12)', // Lighter complement
  },
  header: {
    paddingHorizontal: spacing.layout.screenPadding,
    paddingTop: spacing[8],
    paddingBottom: spacing.layout.screenPadding,
  },
  title: {
    ...typography.textStyles.h1,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.textStyles.h4,
    color: colors.text.secondary,
    marginTop: spacing[2],
    fontWeight: typography.fontWeight.medium,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing.layout.screenPadding,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  // Enhanced Motivational Header Card
  motivationalCard: {
    borderRadius: spacing.radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(251, 146, 60, 0.15)',
    ...shadows.components.modal,
    marginBottom: spacing.layout.screenPadding,
    overflow: 'hidden',
  },
  
  motivationalGradient: {
    padding: spacing.layout.screenPadding,
  },
  motivationalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.layout.screenPadding,
  },
  motivationalText: {
    flex: 1,
    marginRight: spacing[4],
  },
  motivationalTitle: {
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  motivationalSubtitle: {
    fontSize: 13,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  motivationalStats: {
    flexDirection: 'row',
    gap: spacing[4],
  },
  motivationalStat: {
    alignItems: 'center',
    minWidth: 50,
  },
  motivationalNumber: {
    fontSize: 20,
    fontWeight: typography.fontWeight.bold,
    color: '#3b82f6',
    marginBottom: spacing[0],
  },
  
  motivationalNumberVision: {
    color: '#7c3aed', // Purple for vision-related stats
  },
  
  motivationalNumberAchievement: {
    color: '#059669', // Green for achievement stats
  },
  motivationalLabel: {
    fontSize: 11,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  journeyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: spacing.radius['2xl'],
    borderWidth: 1,
    borderColor: colors.border.primary,
    ...shadows.components.modal,
    padding: spacing.layout.screenPadding,
    marginBottom: spacing.layout.screenPadding,
    overflow: 'hidden',
  },
  journeyAccent: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 96,
    height: 96,
    backgroundColor: 'rgba(96, 165, 250, 0.15)', // Updated blue for journey
    borderRadius: 48,
    transform: [{ translateY: -48 }, { translateX: 48 }],
  },
  journeyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.components.cardGap,
    marginBottom: spacing.components.cardGap,
    zIndex: 10,
  },
  journeyIcon: {
    width: 48,
    height: 48,
    borderRadius: spacing.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.components.actionButton,
  },
  journeyTitleContainer: {
    flex: 1,
  },
  journeyTitle: {
    ...typography.textStyles.h4,
    color: colors.text.primary,
  },
  journeySubtitle: {
    ...typography.textStyles.body,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.components.cardGap,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...typography.textStyles.h1,
    color: colors.primary[500],
  },
  statValueSky: {
    ...typography.textStyles.h1,
    color: colors.primary[400],
  },
  statLabel: {
    ...typography.textStyles.bodySmall,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  suggestionCard: {
    borderRadius: spacing.radius.lg,
    padding: spacing.components.cardGap,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
    zIndex: 10,
  },
  suggestionText: {
    ...typography.textStyles.body,
    color: colors.text.primary,
    lineHeight: typography.lineHeight.relaxed,
    fontWeight: typography.fontWeight.medium,
  },
  suggestionBold: {
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[500],
  },
  suggestionBoldBlue: {
    fontWeight: typography.fontWeight.bold,
    color: colors.blue[700],
  },
  insightsSection: {
    gap: spacing.components.cardGap,
    marginBottom: spacing.layout.screenPadding,
  },
  insightCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: spacing.radius.lg,
    borderWidth: 1,
    borderColor: colors.border.primary,
    ...shadows.components.card,
    padding: spacing.components.cardPadding,
    marginBottom: spacing.components.cardGap,
  },

  // Card header styles
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.components.cardPadding,
  },

  cardTitle: {
    ...typography.textStyles.h3,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.bold,
  },

  cardSubtitle: {
    ...typography.textStyles.bodySmall,
    color: colors.text.tertiary,
    marginTop: spacing[1],
    fontWeight: typography.fontWeight.medium,
  },

  // Chart toggle button
  chartToggleButton: {
    backgroundColor: '#6366F1', // Indigo to match our new palette
    borderRadius: spacing.radius.full,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    ...shadows.components.actionButton,
  },

  chartToggleButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.body,
  },
  insightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  insightLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.components.cardGap,
    flex: 1,
  },
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: spacing.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.components.actionButton,
  },
  insightText: {
    flex: 1,
  },
  insightTitle: {
    ...typography.textStyles.actionTitle,
    color: colors.text.primary,
  },
  insightSubtitle: {
    ...typography.textStyles.body,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  insightRight: {
    alignItems: 'flex-end',
  },
  insightValue: {
    ...typography.textStyles.h1,
  },
  insightValuePositive: {
    color: colors.primary[500],
  },
  insightValueNeutral: {
    color: colors.primary[400],
  },
  patternsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: spacing.radius['2xl'],
    borderWidth: 1,
    borderColor: colors.border.primary,
    ...shadows.components.modal,
    padding: spacing.layout.screenPadding,
    marginBottom: spacing.layout.screenPadding,
    overflow: 'hidden',
  },
  patternsAccent: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 128,
    height: 128,
    backgroundColor: 'rgba(165, 180, 252, 0.15)', // Indigo accent for thinking patterns
    borderRadius: 64,
    transform: [{ translateY: 64 }, { translateX: 64 }],
  },
  patternsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.components.cardGap,
    marginBottom: spacing.components.cardPadding,
    zIndex: 10,
  },
  patternsIcon: {
    width: 48,
    height: 48,
    borderRadius: spacing.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.components.actionButton,
  },
  patternsTitleContainer: {
    flex: 1,
  },
  patternsTitle: {
    ...typography.textStyles.h4,
    color: colors.text.primary,
  },
  patternsSubtitle: {
    ...typography.textStyles.body,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  patternsContainer: {
    gap: spacing.components.cardGap,
  },
  patternCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: spacing.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
    ...shadows.components.card,
    padding: spacing.components.cardGap,
    zIndex: 10,
  },
  patternContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  patternContentLeft: {
    flex: 1,
  },
  patternName: {
    ...typography.textStyles.actionTitle,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  patternDescription: {
    ...typography.textStyles.body,
    color: colors.text.secondary,
    marginBottom: spacing.components.cardGap,
    lineHeight: typography.lineHeight.relaxed,
    fontWeight: typography.fontWeight.medium,
  },
  thoughtContainer: {
    gap: spacing.components.cardGap,
  },
  originalThought: {
    backgroundColor: 'rgba(254, 242, 242, 0.6)',
    paddingHorizontal: spacing.components.cardGap,
    paddingVertical: spacing.components.cardGap,
    borderRadius: spacing.radius.md,
    borderLeftWidth: 4,
    borderLeftColor: '#fca5a5',
  },
  thoughtText: {
    ...typography.textStyles.bodySmall,
    color: colors.text.secondary,
    fontStyle: 'italic',
    lineHeight: typography.lineHeight.normal,
  },
  reframedThought: {
    backgroundColor: 'rgba(240, 253, 244, 0.6)',
    paddingHorizontal: spacing.components.cardGap,
    paddingVertical: spacing.components.cardGap,
    borderRadius: spacing.radius.md,
    borderLeftWidth: 4,
    borderLeftColor: '#86efac',
  },
  reframedText: {
    ...typography.textStyles.bodySmall,
    color: colors.text.primary,
    fontStyle: 'italic',
    lineHeight: typography.lineHeight.normal,
  },
  summaryText: {
    ...typography.textStyles.bodySmall,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.relaxed,
    marginTop: spacing[2],
  },
  patternArrow: {
    marginLeft: spacing.components.cardGap,
    opacity: 0.7,
  },
  viewAllContainer: {
    marginTop: spacing.components.cardPadding,
    paddingTop: spacing.components.cardGap,
    borderTopWidth: 1,
    borderTopColor: 'rgba(226, 232, 240, 0.6)',
  },
  viewAllButton: {
    width: '100%',
    paddingVertical: spacing.components.cardGap,
    borderRadius: spacing.radius.lg,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    ...shadows.components.actionButton,
  },
  viewAllText: {
    textAlign: 'center',
    ...typography.textStyles.body,
    fontWeight: typography.fontWeight.semibold,
    color: '#6366f1',
  },
  achievementsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: spacing.radius['2xl'],
    borderWidth: 1,
    borderColor: colors.border.primary,
    ...shadows.components.modal,
    padding: spacing.layout.screenPadding,
    marginBottom: spacing.layout.screenPadding,
    overflow: 'hidden',
  },
  achievementsAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 80,
    height: 80,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 40,
    transform: [{ translateY: -40 }, { translateX: -40 }],
  },
  achievementsTitle: {
    ...typography.textStyles.actionTitle,
    color: colors.text.primary,
    marginBottom: spacing.components.cardGap,
    zIndex: 10,
  },
  achievementsList: {
    gap: spacing[2],
    zIndex: 10,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.components.cardGap,
  },
  achievementText: {
    ...typography.textStyles.body,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
  },
  loadingContainer: {
    padding: spacing[8],
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...typography.textStyles.body,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  emptyStateContainer: {
    padding: spacing[8],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 246, 255, 0.5)',
    borderRadius: spacing.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
  },
  emptyStateText: {
    ...typography.textStyles.body,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
    lineHeight: typography.lineHeight.relaxed,
  },
  distortionTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginTop: spacing[2],
  },
  distortionTag: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: spacing.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  distortionTagText: {
    ...typography.textStyles.caption,
    color: colors.primary[500],
    fontWeight: typography.fontWeight.semibold,
  },

  // Goal-specific styles
  addGoalButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.semantic.warning.light,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.semantic.warning.default,
  },

  goalCard: {
    backgroundColor: colors.white,
    borderRadius: spacing.radius.lg,
    borderWidth: 1,
    borderColor: colors.gray[100],
    ...shadows.sm,
  },

  goalContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing[4],
  },

  goalContentLeft: {
    flex: 1,
  },

  goalTitle: {
    ...typography.textStyles.bodyMd,
    color: colors.gray[900],
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing[1],
    lineHeight: 20,
  },

  goalMeta: {
    ...typography.textStyles.captionSm,
    color: colors.gray[500],
    marginBottom: spacing[2],
  },

  goalProgressContainer: {
    marginBottom: spacing[3],
  },

  goalProgressTrack: {
    height: 6,
    backgroundColor: colors.gray[200],
    borderRadius: 3,
  },

  goalProgressFill: {
    height: '100%',
    backgroundColor: colors.semantic.warning.default,
    borderRadius: 3,
  },

  goalStep: {
    ...typography.textStyles.captionMd,
    color: colors.gray[600],
    fontStyle: 'italic',
    marginBottom: spacing[2],
  },

  goalMotivation: {
    ...typography.textStyles.captionMd,
    color: colors.gray[700],
    fontStyle: 'italic',
    lineHeight: 18,
  },

  // Memory Insights Action Buttons
  memoryActionButtons: {
    flexDirection: 'row',
    gap: spacing[2],
    marginTop: spacing[3],
  },

  memoryActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: spacing.radius.md,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    gap: spacing[1],
  },

  memoryActionButtonText: {
    ...typography.textStyles.bodySmall,
    color: '#059669',
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
});
