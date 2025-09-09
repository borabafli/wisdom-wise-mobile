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
  fullScreenBackground: {
    flex: 1,
    position: 'relative',
  },
  backgroundImageStyle: {
    opacity: 0.4,
    transform: [{ translateY: -120 }, { translateX: 80 }],
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },

  // Input Bar Layout
  inputWithTurtleWrapper: {
    alignItems: 'flex-end',
    marginTop: height < 700 ? 140 : 160,
    position: 'relative',
    width: '100%',
  },

  // Header Section
  headerSection: {
    paddingHorizontal: width < 375 ? spacing[16] : spacing.layout.screenPadding,
    paddingTop: spacing[32],
    marginBottom: height < 700 ? 80 : 90, // Much reduced spacing below header
    minHeight: height < 700 ? 180 : 200, // Increased for deeper header
  },
  headerText: {
    position: 'absolute',
    left: width < 375 ? width * 0.08 : width * 0.1, // Moved more to the left
    top: height < 700 ? 60 : 80, // Higher up in the blue header area
    zIndex: 2, // Above wave header
    maxWidth: width * 0.8, // Increased max width for left positioning
  },
  ctaTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: width < 375 ? 28 : 32, // Responsive font size - much bigger
    fontWeight: 'bold',
    color: '#002244', // Dark blue color
    marginTop: spacing[2],
    marginBottom: spacing[4],
    textAlign: 'left',
    letterSpacing: -0.5,
    lineHeight: width < 375 ? 32 : 38, // Better line height
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  ctaSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: width < 375 ? 17 : 19, // Bigger subtitle
    fontWeight: 'normal',
    color: '#002244', // Dark blue color
    marginBottom: spacing[8],
    textAlign: 'left',
    lineHeight: width < 375 ? 22 : 26, // Better line height
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  // Input Container - Clean design without borders
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // More white background
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
    color: '#1F2937', // Dark text for better contrast on white background
    fontWeight: '500', // Slightly bolder for better visibility
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
    marginBottom: spacing[4],
    borderRadius: 20,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  exerciseCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.components.cardGap,
  },
  exerciseIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
  },
  exerciseIconImage: {
    width: 120,
    height: 120,
  },
  exerciseInfo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseName: {
    fontSize: 28,
    color: '#002244',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    marginBottom: spacing[2],
    textAlign: 'center',
    letterSpacing: -0.3,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  exerciseTime: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
    marginTop: spacing[2],
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    opacity: 0.8,
  },
  exerciseDescription: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: spacing[1],
    opacity: 0.9,
    letterSpacing: 0.2,
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
    borderRadius: 18,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  quickActionText: {
    color: '#1e293b',
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
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
    borderRadius: 24,
    shadowColor: 'rgba(161, 214, 242, 0.4)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 6,
  },
  quoteOverlayGradient: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[16],
    paddingHorizontal: spacing[16],
    minHeight: 160,
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
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
  },
  quoteBackgroundImageStyle: {
    opacity: 0.60,
    borderRadius: 24,
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