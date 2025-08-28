/**
 * HomeScreen Component Styles
 * Separated from component for better maintainability
 */

import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

const { width, height } = Dimensions.get('window');

export const homeScreenStyles = StyleSheet.create({
  // Container & Layout
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

  // Watercolor Background Effects
  watercolorBlob: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.3,
  },
  blob1: {
    top: 80,
    left: -72,
    width: 288,
    height: 224,
    backgroundColor: 'rgba(186, 230, 253, 0.5)',
  },
  blob2: {
    top: height * 0.25,
    right: -80,
    width: 320,
    height: 256,
    backgroundColor: 'rgba(191, 219, 254, 0.3)',
  },
  blob3: {
    top: height * 0.65,
    left: width * 0.25,
    width: 256,
    height: 192,
    backgroundColor: 'rgba(125, 211, 252, 0.4)',
  },
  blob4: {
    bottom: 128,
    right: width * 0.33,
    width: 224,
    height: 168,
    backgroundColor: 'rgba(191, 219, 254, 0.25)',
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },

  // Header Section
  header: {
    paddingHorizontal: spacing.layout.screenPadding,
    paddingTop: spacing[16],
    paddingBottom: spacing.layout.screenPadding,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.components.cardGap,
  },
  headerText: {
    flex: 1,
  },
  welcomeTitle: {
    ...typography.textStyles.welcomeTitle,
    color: colors.text.primary,
    marginBottom: spacing[4],
  },
  welcomeSubtitle: {
    ...typography.textStyles.welcomeSubtitle,
    color: colors.text.tertiary,
    fontWeight: typography.fontWeight.medium,
  },

  // Turtle Companion
  turtleContainer: {
    width: 128,
    height: 128,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  turtleGradient: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  turtleImage: {
    width: 120,
    height: 120,
    opacity: 0.8,
  },

  // CTA Section
  ctaSection: {
    paddingHorizontal: spacing.layout.screenPadding,
    marginBottom: spacing[16],
  },
  ctaButton: {
    borderRadius: spacing.radius['2xl'],
    ...shadows.components.floating,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(20px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  ctaGradient: {
    borderRadius: spacing.radius['2xl'],
    padding: spacing[16],
  },
  ctaContent: {
    alignItems: 'center',
  },
  ctaTitle: {
    ...typography.textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing[6],
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  ctaSubtitle: {
    ...typography.textStyles.body,
    color: 'rgba(30, 41, 59, 0.9)',
    marginBottom: spacing[14],
    textAlign: 'center',
  },

  // Input Container
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: spacing.layout.screenPadding,
    paddingVertical: spacing.components.cardGap,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    gap: spacing.components.cardGap,
    minWidth: 280,
    ...shadows.md,
  },
  inputText: {
    flex: 1,
    ...typography.textStyles.bodySmall,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
  },
  micButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.components.actionButton,
  },

  // Exercises Section
  exercisesSection: {
    paddingHorizontal: spacing.layout.screenPadding,
    marginBottom: spacing.layout.screenPadding,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.components.cardGap,
  },
  sectionTitle: {
    ...typography.textStyles.h4,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.bold,
  },
  seeAllButton: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: spacing.radius.sm,
  },
  seeAllText: {
    ...typography.textStyles.bodySmall,
    color: colors.blue[700],
    fontWeight: typography.fontWeight.semibold,
  },

  // Exercise Cards
  exercisesList: {
    gap: spacing.components.cardGap,
  },
  exerciseCard: {
    borderRadius: spacing.radius.lg,
    ...shadows.components.card,
  },
  exerciseCardGradient: {
    borderRadius: spacing.radius.lg,
    padding: spacing.components.cardPadding,
    borderWidth: 1,
    borderColor: 'rgba(191, 219, 254, 0.6)',
  },
  exerciseCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.components.cardGap,
  },
  exerciseIcon: {
    width: 48,
    height: 48,
    borderRadius: spacing.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.components.actionButton,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    ...typography.textStyles.actionTitle,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  exerciseTime: {
    ...typography.textStyles.bodySmall,
    color: colors.text.tertiary,
    fontWeight: typography.fontWeight.medium,
  },
  exerciseAction: {
    marginLeft: 'auto',
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: spacing.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },

  // Quick Actions
  quickActions: {
    paddingHorizontal: spacing.layout.screenPadding,
    marginBottom: spacing.layout.screenPadding,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: spacing.components.cardGap,
  },
  quickActionButton: {
    flex: 1,
    borderRadius: spacing.radius.lg,
    ...shadows.components.actionButton,
    overflow: 'hidden',
  },
  quickActionBackgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.4,
  },
  quickActionGradient: {
    borderRadius: spacing.radius.lg,
    padding: spacing.components.cardGap,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 96,
    gap: spacing[4],
  },
  quickActionText: {
    color: colors.blue[900],
    ...typography.textStyles.body,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },

  // Quote Section
  quoteSection: {
    paddingHorizontal: spacing.layout.screenPadding,
    marginBottom: spacing.layout.screenPadding,
  },
  quoteCard: {
    borderRadius: spacing.radius['2xl'],
    ...shadows.components.modal,
    overflow: 'hidden',
  },
  quoteBackgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.6,
  },
  quoteGradient: {
    padding: spacing[16],
    alignItems: 'center',
  },
  quoteIcon: {
    width: 48,
    height: 48,
    borderRadius: spacing.radius.soft,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.components.cardGap,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  quoteSymbol: {
    ...typography.textStyles.h3,
    color: colors.text.inverse,
    fontWeight: typography.fontWeight.bold,
  },
  quoteText: {
    ...typography.textStyles.h4,
    color: colors.text.inverse,
    textAlign: 'center',
    lineHeight: typography.lineHeight.loose,
    marginBottom: spacing[6],
  },
  quoteAuthor: {
    ...typography.textStyles.bodySmall,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
});