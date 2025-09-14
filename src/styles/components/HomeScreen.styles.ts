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
  // Scrollable turtle styles
  scrollableTurtleContainer: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 0,
    pointerEvents: 'none',
    top: height < 700 ? 100 : 120,
    left: 0,
    right: 0,
  },
  scrollableTurtleImage: {
    width: width * 0.45,
    height: width * 0.45,
    opacity: 1,
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
    alignItems: 'center',
    marginTop: height < 700 ? 190 : 210, // Lowered chatbar position
    position: 'relative',
    width: '100%',
  },

  // Header Section
  headerSection: {
    paddingHorizontal: width < 375 ? spacing[16] : spacing.layout.screenPadding,
    paddingTop: spacing[32],
    marginBottom: height < 700 ? 60 : 70, // Further reduced spacing below header
    minHeight: height < 700 ? 160 : 180, // Reduced for more compact layout
  },
  headerText: {
    position: 'absolute',
    left: width < 375 ? width * 0.08 : width * 0.1, // Moved more to the left
    top: height < 700 ? 20 : 40, // Even higher up in the blue header area
    zIndex: 2, // Above wave header
    maxWidth: width * 0.8, // Increased max width for left positioning
  },
  ctaTitle: {
    fontFamily: 'BubblegumSans-Regular',
    fontSize: width < 375 ? 34 : 38, // Even bigger font size
    fontWeight: 'normal', // Changed to normal since BubblegumSans is already styled
    color: '#002d14', // Even darker green color
    marginTop: spacing[2],
    marginBottom: spacing[4],
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: width < 375 ? 38 : 44, // Better line height for bigger text
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  ctaSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: width < 375 ? 17 : 19, // Bigger subtitle
    fontWeight: 'normal',
    color: '#002d14', // Even darker green color
    marginBottom: spacing[8],
    textAlign: 'center',
    lineHeight: width < 375 ? 22 : 26, // Better line height
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  // Input Container - Clean design with silver gradient
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width < 375 ? spacing[12] : spacing.layout.screenPadding,
    paddingVertical: spacing.components.cardGap,
    borderRadius: 50,
    gap: spacing.components.cardGap,
    width: '96%',
    alignSelf: 'center',
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
    color: '#64748B', // Lighter gray color
    fontWeight: '400', // Lighter weight
    textAlign: 'left',
    marginLeft: spacing[2], // Start with less margin
    paddingLeft: spacing[4], // Use padding instead of margin for better control
  },
  micButton: {
    width: 36, // Slightly smaller
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[1], // Less margin
  },

  // Exercises Section
  exercisesSection: {
    paddingHorizontal: spacing.layout.screenPadding,
    marginBottom: spacing.layout.screenPadding,
    marginTop: height < 700 ? 4 : 6, // Further reduced spacing below chatbar
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
    color: '#002d14',
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
    color: '#002d14',
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
    minHeight: 100, // Fixed height for all cards
  },
  exerciseCardGradient: {
    padding: spacing[12], // Reduced padding for less height
    marginBottom: spacing[3], // Reduced margin
    borderRadius: 20,
    minHeight: 100, // Fixed height for uniform appearance
    shadowColor: 'rgba(0, 0, 0, 0.15)', // Darker shadow
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2, // Higher opacity
    shadowRadius: 15,
    elevation: 8, // Higher elevation
  },
  exerciseCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.components.cardGap,
  },
  exerciseIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60, // Even smaller icon container for more text space
    height: 60,
  },
  exerciseIconImage: {
    width: 60, // Even smaller icon for more text space
    height: 60,
  },
  exerciseInfo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseName: {
    fontSize: 20,
    color: '#002d14',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    marginBottom: spacing[1],
    textAlign: 'center',
    letterSpacing: -0.3,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  exerciseTime: {
    fontSize: 11,
    color: '#002d14',
    fontWeight: '500',
    marginTop: spacing[1],
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    opacity: 0.7,
  },
  exerciseDescription: {
    fontSize: 12,
    color: '#002d14',
    fontWeight: '400',
    lineHeight: 17,
    textAlign: 'center',
    marginBottom: spacing[1],
    opacity: 0.8,
    letterSpacing: 0.1,
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
    color: '#002d14',
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
    opacity: 0.25,
    borderRadius: 24,
  },
  quoteText: {
    ...typography.textStyles.h4,
    color: '#002d14',
    textAlign: 'center',
    lineHeight: typography.lineHeight.loose,
    marginBottom: spacing[6],
  },
  quoteAuthor: {
    ...typography.textStyles.bodySmall,
    color: '#002d14',
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