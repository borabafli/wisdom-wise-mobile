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
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
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
    alignItems: 'center',
  },
  headerText: {
    alignItems: 'center',
  },
  welcomeTitle: {
    ...typography.textStyles.welcomeTitle,
    color: '#1f2937',
    marginBottom: spacing[4],
    textShadowColor: 'rgba(255, 255, 255, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    fontWeight: '600',
    textAlign: 'center',
  },
  welcomeSubtitle: {
    ...typography.textStyles.welcomeSubtitle,
    color: '#4b5563',
    fontWeight: typography.fontWeight.medium,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    textAlign: 'center',
  },

  // Turtle and Input Bar Layout
  inputWithTurtleWrapper: {
    alignItems: 'flex-end',
    marginTop: spacing[8],
    position: 'relative',
    width: '100%',
  },
  turtleAtBarContainer: {
    position: 'absolute',
    top: -120,
    right: width < 375 ? 25 : 35,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  turtleAtBarImage: {
    width: width < 375 ? 100 : 120,
    height: width < 375 ? 100 : 120,
    opacity: 0.9,
  },

  // Header Section
  header: {
    paddingHorizontal: spacing.layout.screenPadding,
    paddingTop: spacing[16],
    paddingBottom: spacing.layout.screenPadding,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerText: {
    alignItems: 'center', // Center the welcome text
  },
  welcomeTitle: {
    ...typography.textStyles.welcomeTitle,
    color: '#1f2937', // Darker for better contrast
    marginBottom: spacing[4],
    textShadowColor: 'rgba(255, 255, 255, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    fontWeight: '600',
    textAlign: 'center', // Center align the text
  },
  welcomeSubtitle: {
    ...typography.textStyles.welcomeSubtitle,
    color: '#4b5563', // Darker than tertiary, more readable
    fontWeight: typography.fontWeight.medium,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    textAlign: 'center', // Center align the text
  },

  // Turtle and Input Bar Layout
  inputWithTurtleWrapper: {
    alignItems: 'flex-end', // Align to right side
    marginTop: spacing[8],
    position: 'relative',
    width: '100%', // Full width to allow proper positioning
  },
  turtleAtBarContainer: {
    position: 'absolute',
    top: -120, // Position turtle so its bottom aligns with top of input bar
    right: width < 375 ? 25 : 35, // Moved slightly to the left from edge
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'flex-end', // Align turtle to bottom of container
  },

  // CTA Section
  ctaSection: {
    paddingHorizontal: width < 375 ? spacing[16] : spacing.layout.screenPadding, // Less padding on smaller screens
    paddingTop: spacing[24], // Add top padding for better spacing
    marginBottom: spacing[16],
  },
  ctaButton: {
    borderRadius: spacing.radius['2xl'],
    overflow: 'hidden',
    // Removed shadow to eliminate box appearance
  },
  ctaGradient: {
    borderRadius: spacing.radius['2xl'],
    padding: spacing[16],
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Slightly less transparent background
    // Remove all shadow properties to eliminate the box effect
  },
  ctaContent: {
    alignItems: 'flex-start', // Align content to the left
  },
  ctaTitle: {
    ...typography.textStyles.h4, // Smaller text style
    color: '#1f2937', // Darker, more contrasted color
    marginTop: spacing[4], // Push slightly lower
    marginBottom: spacing[6],
    textAlign: 'left', // Align to left
    letterSpacing: 0.5,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    fontWeight: '700', // Bolder for better visibility
    fontSize: 22, // Slightly bigger
  },
  ctaSubtitle: {
    ...typography.textStyles.body,
    color: '#374151', // Darker, more readable color
    marginBottom: spacing[14],
    textAlign: 'left', // Align to left
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    fontWeight: '500', // Medium weight for better readability
  },

  // Input Container (much wider)
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Less transparent, more opaque
    paddingHorizontal: width < 375 ? spacing[12] : spacing.layout.screenPadding,
    paddingVertical: spacing.components.cardGap,
    borderRadius: 50,
    gap: spacing.components.cardGap,
    width: '90%', // Use 90% of available width instead of maxWidth constraint
    alignSelf: 'flex-end', // Move towards right side
    marginRight: spacing[8], // Add some margin from edge
    paddingTop: spacing[8], // Extra top padding for turtle space
    ...shadows.md,
  },
  inputText: {
    flex: 1,
    ...typography.textStyles.body,
    color: colors.text.tertiary, // Lighter color
    fontWeight: typography.fontWeight.regular, // Lighter weight
    textAlign: 'center',
    fontSize: 17,
  },
  micButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // CTA Section
  ctaSection: {
    paddingHorizontal: width < 375 ? spacing[16] : spacing.layout.screenPadding,
    paddingTop: spacing[24],
    marginBottom: spacing[16],
  },
  ctaButton: {
    borderRadius: spacing.radius['2xl'],
    overflow: 'hidden',
  },
  ctaGradient: {
    borderRadius: spacing.radius['2xl'],
    padding: spacing[16],
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  ctaContent: {
    alignItems: 'flex-start',
  },
  ctaTitle: {
    ...typography.textStyles.h4,
    color: '#1f2937',
    marginTop: spacing[4],
    marginBottom: spacing[6],
    textAlign: 'left',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    fontWeight: '700',
    fontSize: 22,
  },
  ctaSubtitle: {
    ...typography.textStyles.body,
    color: '#374151',
    marginBottom: spacing[14],
    textAlign: 'left',
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    fontWeight: '500',
  },

  // Input Container
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: width < 375 ? spacing[12] : spacing.layout.screenPadding,
    paddingVertical: spacing.components.cardGap,
    borderRadius: 50,
    gap: spacing.components.cardGap,
    width: '90%',
    alignSelf: 'flex-end',
    marginRight: spacing[8],
    paddingTop: spacing[8],
    ...shadows.md,
  },
  inputText: {
    flex: 1,
    ...typography.textStyles.body,
    color: colors.text.tertiary,
    fontWeight: typography.fontWeight.regular,
    textAlign: 'center',
    fontSize: 17,
  },
  micButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Exercises Section
  exercisesSection: {
    paddingHorizontal: spacing.layout.screenPadding,
    marginBottom: spacing.layout.screenPadding,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.components.cardGap,
  },
  sectionTitle: {
    ...typography.textStyles.h4,
    color: '#1f2937',
    fontWeight: typography.fontWeight.bold,
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  seeAllButton: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: spacing.radius.sm,
  },
  seeAllText: {
    ...typography.textStyles.bodySmall,
    color: '#111827',
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
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
  },
  exerciseIconImage: {
    width: 36,
    height: 36,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    ...typography.textStyles.actionTitle,
    color: '#1f2937',
    marginBottom: spacing[2],
    fontWeight: '600',
    fontSize: 21,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  exerciseTime: {
    ...typography.textStyles.body,
    color: '#6b7280',
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
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
  quickActionText: {
    color: '#1f2937',
    ...typography.textStyles.body,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
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
    overflow: 'hidden',
  },
  quickActionGradient: {
    borderRadius: spacing.radius.lg,
    padding: spacing.components.cardGap,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 96,
    gap: spacing[4],
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
  quickActionText: {
    color: '#1f2937',
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
    padding: spacing[16],
    alignItems: 'center',
  },
  quoteIcon: {
    marginBottom: spacing.components.cardGap,
  },
  quoteIconGradient: {
    width: 48,
    height: 48,
    borderRadius: spacing.radius.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quoteSymbol: {
    ...typography.textStyles.h3,
    color: colors.text.inverse,
    fontWeight: typography.fontWeight.bold,
  },
  quoteText: {
    ...typography.textStyles.h4,
    color: '#1f2937',
    textAlign: 'center',
    lineHeight: typography.lineHeight.loose,
    marginBottom: spacing[6],
  },
  quoteAuthor: {
    ...typography.textStyles.bodySmall,
    color: '#6b7280',
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },

  // Legacy styles - keeping for any dependencies
  // (removed to simplify and focus on Stoic-inspired design)
});

// Gradient colors inspired by the user's specified accent colors
export const accentGradient = {
  colors: ['#04CCEF', '#0898D3'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
};