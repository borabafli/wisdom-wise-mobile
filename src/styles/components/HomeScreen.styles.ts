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
    paddingTop: 0,
    backgroundColor: colors.appBackground,
  },
  backgroundImage: {
    position: 'absolute',
    top: -50,
    left: 0,
    right: 0,
    width: '100%',
    height: 350,
    zIndex: 0,
  },
  scrollableContainer: {
    position: 'relative',
    flex: 1,
  },
  backgroundImageScrollable: {
    position: 'absolute',
    top: -50,
    left: 0,
    right: 0,
    width: '100%',
    height: 350,
    zIndex: 0,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  backgroundGradientScrollable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: -2,
  },
  fullScreenBackground: {
    flex: 1,
    position: 'relative',
  },
  // Turtle Hero styles
  turtleHeroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
    marginTop: -spacing[8], // Move turtle up
  },
  turtleHeroImage: {
    width: width * 0.55, // Reduced from 0.68 to 0.55
    height: width * 0.55, // Reduced from 0.68 to 0.55
    opacity: 1,
  },

  // Scroll View
  scrollView: {
    flex: 1,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingBottom: 10, // Minimal bottom space
  },

  // Input Bar Layout
  inputWithTurtleWrapper: {
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },

  // Header Section
  headerSection: {
    paddingHorizontal: width < 375 ? spacing[16] : spacing.layout.screenPadding,
    paddingTop: spacing[16], // Reduced from spacing[32] to minimize top gap
    marginBottom: height < 700 ? 40 : 50, // Reduced spacing below header
    minHeight: height < 700 ? 160 : 180, // Reduced for more compact layout
  },
  headerText: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4], // Reduced distance to turtle image
    marginTop: spacing[16], // Added top margin to move text lower
  },
  ctaTitle: {
    fontFamily: 'IBMPlexSans-Bold',
    fontSize: width < 375 ? 29.5 : 33.5, // Reduced by 0.5
    fontWeight: '700',
    color: '#2B475E', // Darker color from #36526f
    marginTop: spacing[2],
    marginBottom: spacing[2],
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: width < 375 ? 33.5 : 37.5, // Adjusted line height proportionally
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  ctaSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: width < 375 ? 15 : 17, // Slightly smaller subtitle
    fontWeight: 'normal',
    color: '#002d14', // Even darker green color
    marginBottom: spacing[8],
    textAlign: 'left', // Changed to left align
    lineHeight: width < 375 ? 20 : 24, // Adjusted line height
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  // Chatbar - Just the image
  chatbarImage: {
    width: width * 0.91, // 95% of screen width
    height: 75, // Reduced height
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Chatbar text overlay
  chatbarText: {
    position: 'absolute',
    top: '50%', // Move slightly lower
    left: '22%', // Move more to the left
    transform: [{ translateX: -50 }, { translateY: -10 }], // Adjust centering for left position
    color: '#64748B', // Grey color
    fontSize: 20, // Slightly smaller font size
    fontFamily: 'Ubuntu-Regular', // Ubuntu Regular font
    textAlign: 'left',
    opacity: 0.6,
    zIndex: 10,
  },

  // Start Check-In Button - Clean and Simple
  checkInButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[32], // Increased width
    paddingVertical: spacing[8], // Reduced height
    alignSelf: 'center', // Center the button
    borderRadius: 12,
    shadowColor: '#0388bb',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1.0,
    shadowRadius: 7,
    elevation: 25,
    marginBottom: spacing[24], // Added space below button
  },
  checkInButtonText: {
    fontSize: 24, // Bigger text
    fontWeight: '500',
    color: '#2B475E', // Darker color to match title
    fontFamily: 'IBMPlexSans-Medium',
  },
  checkInButtonIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[12],
    marginTop: spacing[4], // Reduced space below text
  },
  iconCircle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: 12,
    backgroundColor: '#f7fcfc',
    borderWidth: 1,
    borderColor: '#7d9db6',
    gap: spacing[3],
  },
  iconLabel: {
    fontSize: 12,
    fontFamily: 'Ubuntu-Bold',
    color: '#7d9db6',
    textAlign: 'center',
  },

  // Exercises Section
  exercisesSection: {
    paddingHorizontal: spacing.layout.screenPadding,
    marginBottom: spacing.layout.screenPadding,
    marginTop: height < 700 ? -10 : -8, // Much closer spacing below chatbar
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.components.cardGap,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
  },
  testButton: {
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[4],
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  testButtonActive: {
    backgroundColor: '#002d14',
    borderColor: '#002d14',
  },
  testButtonText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  testButtonTextActive: {
    color: '#FFFFFF',
  },
  promptTestButton: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    marginTop: 4, // More space downwards
    marginLeft: 4, // Slightly more to the right
    paddingHorizontal: spacing[10], // Slightly more padding left and right
  },
  promptTestButtonText: {
    fontSize: 11,
    color: '#2B475E',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#002d14',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: 'IBMPlexSans_SemiCondensed-SemiBold',
  },
  seeAllButton: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderWidth: 1,
    borderColor: '#002d14',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  seeAllText: {
    fontSize: 11,
    color: '#002d14',
    fontWeight: 'normal',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Exercise List Items (No Cards)
  exercisesList: {
    gap: -20, // Negative gap for overlapping closer cards
    paddingLeft: 0,
    marginVertical: 0,
    paddingVertical: 0,
  },
  exerciseCardContainer: {
    position: 'relative',
    marginBottom: -8, // Negative margin to bring cards closer
  },
  exerciseCard: {
    backgroundColor: 'transparent',
    minHeight: 75, // Slightly increased height
  },
  checkboxContainer: {
    position: 'absolute',
    top: -25,
    left: -40,
    zIndex: 10,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkImage: {
    width: 28,
    height: 28,
  },
  // First checkmark - double size
  checkboxContainerFirst: {
    width: 84, // 300% of the default 28
    height: 84,
    left: -40,
    top: -25,
  },
  checkmarkImageFirst: {
    width: 84,
    height: 84,
  },
  // Second checkmark - 50% bigger
  checkboxContainerSecond: {
    width: 56, // 100% bigger than 28
    height: 56,
    left: -40,
    top: -20,
  },
  checkmarkImageSecond: {
    width: 56,
    height: 56,
  },
  // Third checkmark - 20% bigger
  checkboxContainerThird: {
    width: 42,
    height: 42,
  },
  checkmarkImageThird: {
    width: 42,
    height: 42,
  },
  testButtonsContainer: {
    position: 'absolute',
    left: -40,
    top: '50%',
    transform: [{ translateY: -25 }],
    flexDirection: 'row',
    gap: spacing[4],
  },
  testButtonsContainerFirst: {
    left: -40,
    transform: [{ translateY: -25 }],
  },
  testButtonsContainerSecond: {
    left: -40,
    transform: [{ translateY: -20 }],
  },
  testToggleButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  completeButton: {
    backgroundColor: '#22C55E',
  },
  uncompleteButton: {
    backgroundColor: '#EF4444',
  },
  testToggleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  testCheckmarkButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testCheckmarkImage: {
    width: 28,
    height: 28,
  },
  // First test checkmark - double size (56x56)
  testCheckmarkButtonFirst: {
    width: 84,
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testCheckmarkImageFirst: {
    width: 84,
    height: 84,
  },
  // Second test checkmark - 50% bigger (42x42)
  testCheckmarkButtonSecond: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testCheckmarkImageSecond: {
    width: 42,
    height: 42,
  },
  // Third test checkmark - 20% bigger (34x34)
  testCheckmarkButtonThird: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testCheckmarkImageThird: {
    width: 34,
    height: 34,
  },
  exerciseCardGradient: {
    paddingTop: 0, // No top padding so image can fill edge
    paddingBottom: 0, // No bottom padding so image can fill edge
    paddingRight: spacing[8],
    paddingLeft: 0, // No left padding so image can fill edge
    marginBottom: spacing[0],
    borderRadius: 20,
    height: 75, // Fixed height
    backgroundColor: 'transparent',
    position: 'relative', // For absolute positioned children
  },
  exerciseCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.components.cardGap,
    paddingTop: spacing[0], // Add padding back for content
    paddingBottom: spacing[0], // Add padding back for content
  },
  exerciseIcon: {
    position: 'absolute', // Position absolutely to fill edges
    left: 0, // Flush with left edge
    top: 0, // Flush with top edge
    width: 75, // Fixed width
    height: 75, // Fixed height
    overflow: 'hidden', // Ensure image doesn't overflow
    borderTopLeftRadius: 20, // Match card corner
    borderBottomLeftRadius: 20, // Match card corner
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseIconImage: {
    width: '100%', // Fill container width
    height: '100%', // Fill complete height to match card height
  },
  exerciseIconImageTest: {
    width: '70%', // Slightly bigger test icons
    height: '70%',
  },
  exerciseInfo: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 75 + spacing.components.cardGap, // Account for absolute positioned image + gap
  },
  exerciseName: {
    fontSize: 22,
    color: '#002d14',
    fontWeight: 'bold',
    fontFamily: 'Ubuntu-Light',
    marginBottom: spacing[1],
    textAlign: 'left',
    letterSpacing: -0.3,
  },
  exerciseTime: {
    fontSize: 11,
    color: '#002d14',
    fontWeight: '500',
    fontFamily: 'Ubuntu-Light',
    textAlign: 'left',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    opacity: 0.7,
  },
  exerciseDescriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: spacing[2],
  },
  exerciseDescription: {
    fontSize: 13,
    color: '#002d14',
    fontWeight: '400',
    fontFamily: 'Ubuntu-Light',
    lineHeight: 18,
    textAlign: 'left',
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

  exercisesWrapper: {
    position: 'relative',
  },
  
  exercisesLineBackground: {
    position: 'absolute',
    left: -35,
    right: -25,
    top: -50,
    width: '190%',
    height: 450,
    opacity: 1.0,
    zIndex: -1,
  },
  
  

  // Quick Actions
  quickActions: {
    paddingHorizontal: spacing.layout.screenPadding,
    marginBottom: spacing.layout.screenPadding,
    marginTop: spacing[4], // Further reduced from spacing[12] to spacing[4]
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10, // Small gap between cards for closer spacing
    justifyContent: 'flex-start',
  },
  quickActionButton: {
    width: '31%', // Two cards per row with 8px gap
    overflow: 'hidden',
    height: 140,
    borderRadius: 20,
  },
  quickActionBackgroundImage: {
    borderRadius: 20,
  },
  quickActionGradient: {
    padding: spacing.components.cardGap,
    alignItems: 'center',
    justifyContent: 'center',
    height: 140,
    gap: spacing[4],
    borderRadius: 20,
  },
  quickActionText: {
    color: '#002d14',
    fontSize: 13,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
    letterSpacing: 0.3,
    flexWrap: 'wrap',
    maxWidth: '100%',
  },
  quickActionIconImage: {
    width: 42,
    height: 42,
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
    paddingVertical: spacing[20],
    paddingHorizontal: spacing[20],
    paddingRight: spacing[24],
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
    fontFamily: 'BubblegumSans-Regular',
    fontSize: 20, // Increased font size
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

  // Daily Reflection Section
  dailyReflectionSection: {
    paddingHorizontal: spacing.layout.screenPadding,
    marginBottom: spacing.layout.screenPadding,
    marginTop: spacing[12], // Same as Quick Actions section
  },
});

// Gradient colors inspired by the user's specified accent colors
export const accentGradient = {
  colors: ['#04CCEF', '#0898D3'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
};