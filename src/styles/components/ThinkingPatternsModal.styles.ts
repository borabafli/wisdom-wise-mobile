/**
 * ThinkingPatternsModal Component Styles
 * Enhanced styling with background image support and optimized text contrast
 */

import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

const { width, height } = Dimensions.get('window');

export const thinkingPatternsModalStyles = StyleSheet.create({
  // Background and container
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay for better text readability
  },
  container: {
    flex: 1,
    paddingTop: 60, // Account for status bar
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.layout.screenPadding,
    paddingVertical: spacing.components.cardGap,
    zIndex: 10,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.components.actionButton,
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    ...typography.textStyles.h4,
    color: 'white',
    fontWeight: typography.fontWeight.bold,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    ...typography.textStyles.bodySmall,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: typography.fontWeight.medium,
    marginTop: spacing[1],
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerRight: {
    width: 44, // Balance the close button
  },


  // List and cards
  flatList: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: spacing.layout.screenPadding,
    paddingBottom: spacing.layout.screenPadding,
  },
  patternCard: {
    width: width - (spacing.layout.screenPadding * 2),
    height: height * 0.65, // Even smaller to accommodate fixed bottom section
    marginRight: spacing.components.cardGap,
    borderRadius: spacing.radius['2xl'],
    overflow: 'hidden',
    ...shadows.components.modal,
  },
  cardBlurContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // Back to glassy look
    borderRadius: spacing.radius['2xl'],
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)', // Subtle glassy border
    ...shadows.components.card,
  },
  cardContent: {
    padding: spacing.layout.screenPadding,
    backgroundColor: 'rgba(255, 255, 255, 0.25)', // Glass morphism - translucent
    borderRadius: spacing.radius['2xl'],
    margin: 2,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)', // Glassy border
    ...shadows.components.card,
  },

  // Card header (compact)
  cardHeader: {
    marginBottom: spacing[3],
  },
  patternType: {
    ...typography.textStyles.h3,
    color: colors.primary[700],
    fontWeight: typography.fontWeight.bold,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    textAlign: 'center',
  },

  // Education section (simple, no box)
  educationSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[4],
    paddingHorizontal: spacing[2],
    gap: spacing[2],
  },
  educationIcon: {
    marginTop: spacing[0.5],
  },
  educationText: {
    ...typography.textStyles.bodySmall,
    color: colors.text.primary,
    lineHeight: typography.lineHeight.relaxed,
    fontStyle: 'italic',
    flex: 1,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Personalized thought shift section (prominent positioning)
  thoughtShiftSection: {
    marginTop: spacing[4],
    marginBottom: spacing[3],
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    padding: spacing[3],
    borderRadius: spacing.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    ...shadows.components.card,
  },
  thoughtShiftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  thoughtShiftTitle: {
    ...typography.textStyles.bodySmall,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  thoughtShiftText: {
    ...typography.textStyles.bodySmall,
    color: colors.text.primary,
    fontStyle: 'italic',
    lineHeight: typography.lineHeight.relaxed,
    fontWeight: typography.fontWeight.semibold,
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  // Compact progress section
  compactEffectSection: {
    marginBottom: spacing[3],
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  progressTitle: {
    ...typography.textStyles.caption,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.semibold,
    textShadowColor: 'rgba(255, 255, 255, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: spacing.radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: spacing.radius.full,
  },

  // Fixed top patterns section (higher position)
  fixedTopPatternsSection: {
    position: 'absolute',
    bottom: spacing[16], // Higher up from bottom
    left: spacing.layout.screenPadding,
    right: spacing.layout.screenPadding,
    zIndex: 10,
  },
  fixedTopPatternsContainer: {
    borderRadius: spacing.radius.lg,
    padding: spacing[3],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  fixedTopPatternsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[2],
    justifyContent: 'center',
  },
  fixedTopPatternsTitle: {
    ...typography.textStyles.caption,
    color: 'white',
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fixedTopPatternsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  fixedPatternStatItem: {
    alignItems: 'center',
    minWidth: '30%',
  },
  fixedPatternStatName: {
    ...typography.textStyles.caption,
    color: 'white',
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
    fontSize: 10,
    marginBottom: spacing[0.5],
  },
  fixedPatternStatCount: {
    ...typography.textStyles.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    fontSize: 12,
  },

  // Thoughts container (priority section)
  thoughtsContainer: {
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  thoughtLabel: {
    ...typography.textStyles.caption,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing[2],
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  originalThought: {
    backgroundColor: 'rgba(254, 242, 242, 0.4)', // Back to glassy translucent
    padding: spacing.components.cardGap,
    borderRadius: spacing.radius.lg,
    borderLeftWidth: 3,
    borderLeftColor: 'rgba(248, 113, 113, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.2)',
    ...shadows.components.card,
  },
  thoughtText: {
    ...typography.textStyles.body,
    color: colors.text.primary,
    fontStyle: 'italic',
    lineHeight: typography.lineHeight.relaxed,
    textShadowColor: 'rgba(255, 255, 255, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  reframedThought: {
    backgroundColor: 'rgba(240, 253, 244, 0.4)', // Back to glassy translucent
    padding: spacing.components.cardGap,
    borderRadius: spacing.radius.lg,
    borderLeftWidth: 3,
    borderLeftColor: 'rgba(74, 222, 128, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.2)',
    ...shadows.components.card,
  },
  reframedText: {
    ...typography.textStyles.body,
    color: colors.text.primary,
    fontStyle: 'italic',
    lineHeight: typography.lineHeight.relaxed,
    fontWeight: typography.fontWeight.medium,
    textShadowColor: 'rgba(255, 255, 255, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  // Compact distortion tags
  compactDistortionTags: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  compactDistortionTag: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: spacing.radius.md,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  compactDistortionTagText: {
    ...typography.textStyles.caption,
    color: colors.primary[700],
    fontWeight: typography.fontWeight.medium,
    fontSize: 10,
  },


  // Context (compact)
  contextText: {
    ...typography.textStyles.caption,
    color: colors.text.secondary,
    fontStyle: 'italic',
    lineHeight: typography.lineHeight.normal,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    fontSize: 10,
    marginTop: spacing[2],
  },


  // Navigation indicators
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.components.cardGap,
    gap: spacing[2],
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeIndicator: {
    backgroundColor: 'white',
    width: 24,
    ...shadows.components.actionButton,
  },

  // Empty state
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.layout.screenPadding * 2,
  },
  emptyStateText: {
    ...typography.textStyles.h4,
    color: 'white',
    textAlign: 'center',
    lineHeight: typography.lineHeight.relaxed,
    fontWeight: typography.fontWeight.medium,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});