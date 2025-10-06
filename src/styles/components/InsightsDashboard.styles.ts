/**
 * InsightsDashboard Component Styles
 * Separated from component for better maintainability
 */

import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';


const { width, height } = Dimensions.get('window');

export const insightsDashboardStyles = StyleSheet.create({
  // Container & Layout - Consistent with HomeScreen
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: colors.appBackground,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    width: width,
    minHeight: height, // Changed from fixed height to minHeight
  },

  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,  // ensures it fills the whole screen
    //zIndex: -1,                        // push it fully behind everything
  },
  

  // Header Section - Matching ExerciseLibrary style
  header: {
    paddingHorizontal: spacing.layout.screenPadding,
    paddingTop: spacing[16],
    paddingBottom: spacing[4],
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[2],
    paddingRight: spacing[8],
  },
  headerTurtleIcon: {
    width: 130,
    height: 130,
    marginRight: spacing[1],
    marginTop: -spacing[7],
    flexShrink: 0,
  },
  titleAndSubtitleContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: spacing[12],
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#002d14',
    fontFamily: 'BubblegumSans-Regular',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: spacing[1],
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6b7280',
    fontFamily: 'Inter-Medium',
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#002d14', // Consistent with HomeScreen green theme
    fontFamily: 'BubblegumSans-Regular',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    textAlign: 'center',
  },
  compactTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#002d14',
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  subtitle: {
    fontSize: width < 375 ? 16 : 18,
    fontWeight: 'normal',
    color: '#002d14',
    marginTop: spacing[4],
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing[8],
    zIndex: 3,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingTop: 10, // No top padding needed anymore
    paddingBottom: 120,
  },
  // Header Image Styles
  headerImageContainer: {
    position: 'relative',
    width: '88%',
    height: 190,
    alignSelf: 'center',
    borderRadius: spacing.radius.lg,
    overflow: 'hidden',
    marginBottom: spacing[4],
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerTextContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 2,
  },
  maskedView: {
    width: 140,
    height: 42,
  },
  maskText: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Ubuntu-Bold',
    color: 'black',
    textAlign: 'left',
    backgroundColor: 'transparent',
  },
  gradientFill: {
    width: 140,
    height: 42,
  },
  contentContainer: {
    position: 'relative',
    zIndex: 3,
    paddingTop: spacing[5],
    backgroundColor: 'transparent',
  },
  // Enhanced Motivational Header Card
  motivationalCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: spacing.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(135, 186, 163, 0.3)',
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: spacing.layout.screenPadding,
    overflow: 'hidden',
  },
  
  motivationalGradient: {
    // No padding here to avoid double padding
  },
  motivationalContent: {
    padding: spacing[12], // Further reduced height
    gap: spacing[4], // Much smaller gap
  },
  motivationalText: {
    flex: 1,
    marginBottom: spacing[2], // Much smaller distance
  },
  motivationalTitle: {
    fontSize: 17,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing[4],
    lineHeight: 24,
  },
  motivationalSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 20,
  },
  motivationalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: spacing[12],
  },
  motivationalStat: {
    alignItems: 'center',
    flex: 1,
  },
  motivationalNumber: {
    fontSize: 20,
    fontWeight: typography.fontWeight.bold,
    color: '#4A6B7C', // Same blue color as the buttons
    marginBottom: spacing[2],
  },

  motivationalNumberVision: {
    color: '#4A6B7C', // Same blue color as the buttons
  },

  motivationalNumberAchievement: {
    color: '#4A6B7C', // Same blue color as the buttons
  },
  motivationalLabel: {
    fontSize: 11,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  journeyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: spacing.radius['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.4)',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    padding: spacing.layout.screenPadding,
    marginBottom: spacing.layout.screenPadding,
    overflow: 'hidden',
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
    color: '#87BAA3',
  },
  statValueSky: {
    ...typography.textStyles.h1,
    color: '#87BAA3',
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: spacing.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.4)',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: spacing.radius['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.4)',
    padding: spacing[12], // Reduced from spacing.layout.screenPadding for less height
    marginBottom: spacing[8], // Reduced from spacing.layout.screenPadding for tighter spacing
    overflow: 'hidden',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  patternsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.components.cardGap,
    marginBottom: spacing[8], // Reduced from spacing.components.cardPadding for less height
    zIndex: 10,
  },
  patternsIcon: {
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderWidth: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    padding: 0,
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
  insightPreview: {
    ...typography.textStyles.body,
    color: colors.text.primary,
    marginBottom: spacing[1],
    lineHeight: typography.lineHeight.relaxed,
    fontStyle: 'italic',
    fontSize: 14,
    fontWeight: typography.fontWeight.normal,
  },
  thoughtContainer: {
    gap: spacing.components.cardGap,
  },
  originalThought: {
    paddingHorizontal: spacing.components.cardGap,
    paddingVertical: spacing.components.cardGap,
    borderRadius: spacing.radius.md,
    borderLeftWidth: 4,
    borderLeftColor: '#BE0223',
    overflow: 'hidden',
  },
  thoughtText: {
    ...typography.textStyles.bodySmall,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.normal,
  },
  reframedThought: {
    paddingHorizontal: spacing.components.cardGap,
    paddingVertical: spacing.components.cardGap,
    borderRadius: spacing.radius.md,
    borderLeftWidth: 4,
    borderLeftColor: '#046B3B',
    overflow: 'hidden',
  },
  reframedText: {
    ...typography.textStyles.bodySmall,
    color: colors.text.primary,
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
    backgroundColor: 'rgba(135, 186, 163, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(135, 186, 163, 0.2)',
    ...shadows.components.actionButton,
  },
  viewAllText: {
    textAlign: 'center',
    ...typography.textStyles.body,
    fontWeight: typography.fontWeight.semibold,
    color: '#87BAA3',
  },
  achievementsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: spacing.radius['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.4)',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    padding: spacing.layout.screenPadding,
    marginBottom: spacing.layout.screenPadding,
    overflow: 'hidden',
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
    backgroundColor: 'rgba(248, 251, 249, 0.6)',
    borderRadius: spacing.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(135, 186, 163, 0.3)',
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
    backgroundColor: 'rgba(135, 186, 163, 0.1)',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: spacing.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(135, 186, 163, 0.2)',
  },
  distortionTagText: {
    ...typography.textStyles.caption,
    color: '#87BAA3',
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
    flexDirection: 'column',
    gap: spacing[2],
    marginTop: spacing[3],
  },

  memoryActionButton: {
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

  // Therapy Goals Styles
  goalProgressBar: {
    height: 4,
    backgroundColor: colors.gray[200],
    borderRadius: 2,
    marginBottom: spacing[1],
  },

  noGoalsContainer: {
    alignItems: 'center',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[3],
  },

  noGoalsText: {
    ...typography.textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing[3],
    lineHeight: typography.lineHeight.relaxed,
  },

  setGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6', // Purple - better contrast and matches app theme
    paddingVertical: spacing[3], // Increased padding for more button-like feel
    paddingHorizontal: spacing[6], // Wider button
    borderRadius: spacing.radius.lg, // More rounded for modern button feel
    gap: spacing[2],
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4, // Android shadow
    minHeight: 48, // Accessibility guideline for touch targets
  },

  setGoalButtonText: {
    ...typography.textStyles.body, // Larger text size
    color: colors.white,
    fontWeight: typography.fontWeight.semibold, // Bolder text
    fontSize: 16,
  },

});
