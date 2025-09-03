/**
 * HomeScreen Component Styles
 * Clean, minimal design with sharp edges and modern fonts
 */

import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

const { width, height } = Dimensions.get('window');

export const homeScreenStyles = StyleSheet.create({
  // Container & Layout
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },

  // Turtle and Input Bar Layout
  inputWithTurtleWrapper: {
    alignItems: 'flex-end',
    marginTop: height < 700 ? 120 : 140, // Much reduced spacing for tighter layout
    position: 'relative',
    width: '100%',
  },
  turtleAtBarContainer: {
    position: 'absolute',
    top: -85, // Moved even higher up
    right: width < 375 ? 25 : 35,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  turtleAtBarImage: {
    width: width < 375 ? 100 : 120,
    height: width < 375 ? 100 : 120,
    opacity: 1.0,
  },

  // Header Section
  headerSection: {
    paddingHorizontal: width < 375 ? spacing[16] : spacing.layout.screenPadding,
    paddingTop: spacing[32],
    marginBottom: height < 700 ? 80 : 90, // Much reduced spacing below header
    minHeight: height < 700 ? 120 : 140, // Much reduced minimum height
  },
  headerText: {
    position: 'absolute',
    left: width < 375 ? width * 0.15 : width * 0.18, // Moved more towards center
    top: height < 700 ? 80 : 100, // Fixed positioning to ensure no overlap
    zIndex: 1,
    maxWidth: width * 0.7, // Adjusted max width for centered position
  },
  ctaTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: width < 375 ? 28 : 32, // Responsive font size - much bigger
    fontWeight: 'bold',
    color: '#003366',
    marginTop: spacing[2],
    marginBottom: spacing[4],
    textAlign: 'left',
    letterSpacing: -0.5,
    lineHeight: width < 375 ? 32 : 38, // Better line height
  },
  ctaSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: width < 375 ? 17 : 19, // Bigger subtitle
    fontWeight: 'normal',
    color: '#003366',
    marginBottom: spacing[8],
    textAlign: 'left',
    lineHeight: width < 375 ? 22 : 26, // Better line height
    opacity: 0.8, // Slightly softer than title
  },

  // Input Container - Clean design without borders
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: width < 375 ? spacing[12] : spacing.layout.screenPadding,
    paddingVertical: spacing.components.cardGap,
    borderRadius: 50,
    gap: spacing.components.cardGap,
    width: '90%',
    alignSelf: 'flex-end',
    marginRight: spacing[8],
    paddingTop: spacing[8],
    shadowColor: '#000000', // Dark shadow instead of light blue
    shadowOffset: { width: 0, height: 6 }, // Slightly more offset
    shadowOpacity: 0.15, // Darker but not too harsh
    shadowRadius: 15, // Larger radius for softer spread
    elevation: 10, // Higher elevation for Android
  },
  inputText: {
    flex: 1,
    fontSize: 18,
    color: '#002244',
    fontWeight: 'normal',
    textAlign: 'left',
    marginLeft: spacing[4],
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[2],
  },

  // Exercises Section
  exercisesSection: {
    paddingHorizontal: spacing.layout.screenPadding,
    marginBottom: spacing.layout.screenPadding,
    marginTop: height < 700 ? 40 : 50, // Reduced spacing below chatbar
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.components.cardGap,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002244',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: 'Poppins-Bold',
  },
  seeAllButton: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
  },
  seeAllText: {
    fontSize: 14,
    color: '#002244',
    fontWeight: 'normal',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Exercise List Items (No Cards)
  exercisesList: {
    gap: 0,
  },
  exerciseCard: {
    backgroundColor: 'transparent',
  },
  exerciseCardGradient: {
    padding: spacing[16],
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginBottom: spacing[4],
    borderRadius: 20,
  },
  exerciseCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.components.cardGap,
  },
  exerciseIcon: {
    width: 40,
    height: 40,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseIconImage: {
    width: 56,
    height: 56,
  },
  exerciseInfo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseName: {
    fontSize: 32,
    color: '#002244',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  exerciseTime: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: 'normal',
    marginTop: spacing[2],
    textAlign: 'center',
  },
  exerciseDescription: {
    fontSize: 20,
    color: '#003355',
    fontWeight: 'normal',
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: spacing[1],
  },
  exerciseAction: {
    marginLeft: 'auto',
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    padding: spacing.components.cardGap,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 96,
    gap: spacing[4],
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 18,
  },
  quickActionText: {
    color: '#002244',
    fontSize: 18,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },
  quickActionIconImage: {
    width: 48, // Bigger than the original 36px
    height: 48,
    borderRadius: 0,
  },

  // Quote Section
  quoteSection: {
    paddingHorizontal: spacing.layout.screenPadding,
    marginBottom: spacing.layout.screenPadding,
  },
  quoteCard: {
    overflow: 'hidden',
    padding: spacing[16],
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 24,
  },
  quoteIcon: {
    marginBottom: spacing.components.cardGap,
  },
  quoteIconImage: {
    width: 48,
    height: 48,
    borderRadius: 0,
  },
  quoteBackgroundImage: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingVertical: spacing[16],
    paddingHorizontal: spacing[16],
  },
  quoteBackgroundImageStyle: {
    opacity: 0.2, // Less transparent
    borderRadius: 24,
    transform: [{ scale: 1.2 }], // Zoom to fill entire area
  },
  quoteText: {
    ...typography.textStyles.h4,
    color: '#002244',
    textAlign: 'center',
    lineHeight: typography.lineHeight.loose,
    marginBottom: spacing[6],
  },
  quoteAuthor: {
    ...typography.textStyles.bodySmall,
    color: '#003355',
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
});

// Gradient colors inspired by the user's specified accent colors
export const accentGradient = {
  colors: ['#04CCEF', '#0898D3'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
};