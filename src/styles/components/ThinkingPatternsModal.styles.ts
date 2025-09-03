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
    marginRight: spacing.components.cardGap,
    borderRadius: spacing.radius['2xl'],
    overflow: 'hidden',
    ...shadows.components.modal,
  },
  cardBlurContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // Even more subtle blur background
    borderRadius: spacing.radius['2xl'],
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)', // More subtle border
    ...shadows.components.card, // Add subtle shadow for definition
  },
  cardContent: {
    padding: spacing.layout.screenPadding,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Glass morphism - much more transparent
    borderRadius: spacing.radius['2xl'],
    margin: 2, // Small margin inside blur view
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.35)', // Enhanced glass border
    ...shadows.components.card, // Subtle shadow for depth
  },

  // Card header
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.components.cardGap,
  },
  patternType: {
    ...typography.textStyles.h4,
    color: colors.primary[700],
    fontWeight: typography.fontWeight.bold,
    flex: 1,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  confidenceText: {
    ...typography.textStyles.bodySmall,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.semibold,
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: spacing.radius.full,
    marginLeft: spacing[2],
  },

  // Thoughts container
  thoughtsContainer: {
    gap: spacing.components.cardGap,
    marginBottom: spacing.components.cardGap,
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
    backgroundColor: 'rgba(254, 242, 242, 0.4)', // More translucent for glass effect
    padding: spacing.components.cardGap,
    borderRadius: spacing.radius.lg,
    borderLeftWidth: 3,
    borderLeftColor: 'rgba(248, 113, 113, 0.8)', // Slightly transparent border
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
    backgroundColor: 'rgba(240, 253, 244, 0.4)', // More translucent for glass effect
    padding: spacing.components.cardGap,
    borderRadius: spacing.radius.lg,
    borderLeftWidth: 3,
    borderLeftColor: 'rgba(74, 222, 128, 0.8)', // Slightly transparent border
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

  // Distortion tags
  distortionTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  distortionTag: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: spacing.radius.full,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  distortionTagText: {
    ...typography.textStyles.caption,
    color: colors.primary[700],
    fontWeight: typography.fontWeight.semibold,
  },

  // Context
  contextText: {
    ...typography.textStyles.bodySmall,
    color: colors.text.secondary,
    fontStyle: 'italic',
    lineHeight: typography.lineHeight.relaxed,
    marginTop: spacing[2],
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
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