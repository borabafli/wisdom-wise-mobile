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
    alignItems: 'flex-start',
    zIndex: 1, // Above chatbar to overlap slightly
    pointerEvents: 'none',
    top: height < 700 ? 25 : 45, // Move turtle up to align with text
    left: width * 0.05, // Just slightly to the right from original
    right: 40, // Adjust right to maintain alignment
  },
  scrollableTurtleImage: {
    width: width * 0.4, // Bigger turtle image
    height: width * 0.4,
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
    marginTop: height < 700 ? 100 : 130, // Move chatbar much higher to reduce top gap
    position: 'relative',
    width: '100%',
    zIndex: -1, // Behind other elements like turtle image
  },

  // Header Section
  headerSection: {
    paddingHorizontal: width < 375 ? spacing[16] : spacing.layout.screenPadding,
    paddingTop: spacing[16], // Reduced from spacing[32] to minimize top gap
    marginBottom: height < 700 ? 60 : 70, // Further reduced spacing below header
    minHeight: height < 700 ? 160 : 180, // Reduced for more compact layout
  },
  headerText: {
    position: 'absolute',
    left: width < 375 ? width * 0.45 : width * 0.47, // Move even more to the right
    top: height < 700 ? 45 : 65, // Move even higher up
    zIndex: 2, // Above wave header
    maxWidth: width * 0.53, // Adjust width for right positioning
    minWidth: width * 0.5, // Set minimum width to prevent text cutoff
  },
  ctaTitle: {
    fontFamily: 'BubblegumSans-Regular',
    fontSize: width < 375 ? 30 : 34, // Bigger text size
    fontWeight: 'normal', // Changed to normal since BubblegumSans is already styled
    color: '#002d14', // Even darker green color
    marginTop: spacing[2],
    marginBottom: spacing[2], // Reduced margin since removing subtitle
    textAlign: 'left', // Left align for first line
    letterSpacing: -0.5,
    lineHeight: width < 375 ? 34 : 38, // Adjusted line height for bigger text
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  ctaTitleSecondLine: {
    textAlign: 'left', // Left align for second line too
    marginTop: -spacing[2], // Reduce gap between lines
    fontSize: width < 375 ? 36 : 40, // Bigger font for second line
    lineHeight: width < 375 ? 40 : 44, // Adjusted line height for bigger text
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
    width: width *1.10, // Smaller chatbar
    height: 75, // Reduced height
    alignSelf: 'center',
  },
  
  // Chatbar text overlay
  chatbarText: {
    position: 'absolute',
    top: '45%', // Move slightly up
    left: '30%', // Move slightly to the left
    transform: [{ translateX: -50 }, { translateY: -10 }], // Adjust centering for left position
    color: '#64748B', // Grey color
    fontSize: 22, // Slightly bigger font size
    fontFamily: 'Ubuntu-Regular', // Ubuntu Regular font
    textAlign: 'left',
    opacity: 0.7,
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
    backgroundColor: '#4c908b',
    borderColor: '#4c908b',
    marginTop: 4, // More space downwards
    marginLeft: 4, // Slightly more to the right
    paddingHorizontal: spacing[10], // Slightly more padding left and right
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
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[0],
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
    gap: 0,
    paddingLeft: 24,
  },
  exerciseCardContainer: {
    position: 'relative',
    marginBottom: spacing[3],
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
    marginBottom: spacing[3],
    borderRadius: 20,
    height: 75, // Fixed height
    backgroundColor: 'transparent',
    position: 'relative', // For absolute positioned children
  },
  exerciseCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.components.cardGap,
    paddingTop: spacing[8], // Add padding back for content
    paddingBottom: spacing[8], // Add padding back for content
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
    fontSize: 18,
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
    left: -30,
    top: -68,
    width: 64,             // make it thicker
    height: undefined,     // let aspect ratio decide
    aspectRatio: 1 / 6,    // tweak this based on your image proportions
    opacity: 0.6,
    resizeMode: 'contain', // keeps proportions
  },
  
  

  // Quick Actions
  quickActions: {
    paddingHorizontal: spacing.layout.screenPadding,
    marginBottom: spacing.layout.screenPadding,
    marginTop: spacing[12], // Reduced padding above Quick Actions section
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.components.cardGap,
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    overflow: 'hidden',
    height: 120,
    borderRadius: 20,
  },
  quickActionBackgroundImage: {
    borderRadius: 20,
  },
  quickActionGradient: {
    padding: spacing.components.cardGap,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
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
    width: 36, // Smaller icons for cleaner look
    height: 36,
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