import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../tokens/colors';

const { width, height } = Dimensions.get('window');

export const onboardingValuePropStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
  },

  // Progress Indicator Styles
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 20,
  },

  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(91, 163, 184, 0.2)', // Using style guide primary color
    borderRadius: 2,
    marginRight: 12,
  },

  progressFill: {
    width: '57%', // 4/7 pages
    height: '100%',
    backgroundColor: '#5BA3B8', // Primary blue-teal from style guide
    borderRadius: 2,
  },

  progressText: {
    fontSize: 14,
    fontFamily: 'Ubuntu-Medium',
    color: '#5BA3B8',
  },

  // Main Content Styles
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },

  headerContainer: {
    alignItems: 'center',
    marginTop: height * 0.02,
    paddingHorizontal: 20,
    marginBottom: 32,
  },

  headline: {
    fontSize: 32, // --text-3xl from style guide
    fontFamily: 'BubblegumSans-Regular',
    color: '#1A2332', // --near-black from style guide
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 40, // --leading-tight equivalent
  },

  // Cards Container Styles
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 20,
  },

  cardScrollView: {
    flexGrow: 0,
  },

  scrollContent: {
    paddingHorizontal: 0,
    alignItems: 'center',
  },

  // Card Styles (Following style guide card patterns)
  card: {
    height: 320,
    marginHorizontal: 0,
    borderRadius: 20, // --radius-xl from style guide
    overflow: 'hidden',
    // Shadow from style guide
    shadowColor: '#5BA3B8',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.16, // --shadow-lg equivalent
    shadowRadius: 24,
    elevation: 8,
  },

  cardInner: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(91, 163, 184, 0.10)',
  },

  cardContent: {
    flex: 1,
    padding: 24, // --space-3 from style guide
    justifyContent: 'space-between',
    position: 'relative',
  },

  blobWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    opacity: 0.9,
  },


  // Text Content Styles
  textContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },

  iconImage: {
    width: 84,
    height: 84,
    marginBottom: 14,
  },

  cardTitle: {
    fontSize: 24, // Slightly larger for better hierarchy
    fontFamily: 'BubblegumSans-Regular',
    color: '#1A2332',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 30, // --leading-tight
    textShadowColor: 'rgba(255, 255, 255, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    letterSpacing: -0.3,
  },

  cardDescription: {
    fontSize: 17, // Slightly larger for readability
    fontFamily: 'Ubuntu-Regular',
    color: '#334155', // Darker gray for better contrast
    textAlign: 'center',
    lineHeight: 26, // Better line spacing
    paddingHorizontal: 12,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Subtle Decorative Accent
  decorativeAccent: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 4,
    height: 40,
    borderRadius: 2,
    opacity: 0.4,
  },

  // Dots Indicator Styles
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
    paddingHorizontal: 20,
  },

  dotTouchable: {
    padding: 8,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(91, 163, 184, 0.3)',
    marginHorizontal: 4,
    // Smooth transition from style guide
    // This would be: transition: all var(--duration-normal) var(--ease-default);
  },

  activeDot: {
    backgroundColor: '#5BA3B8',
    width: 24,
    borderRadius: 12,
  },

  // Action Button Styles (Following style guide button patterns)
  actionContainer: {
    alignItems: 'center',
    paddingBottom: 20,
    marginTop: 16,
  },

  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 28, // --radius-full equivalent
    shadowColor: '#5BA3B8',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },

  buttonGradient: {
    flex: 1,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  primaryButtonText: {
    fontSize: 18, // --text-lg from style guide
    fontFamily: 'Ubuntu-Bold', // --font-semibold
    color: colors.white,
    letterSpacing: 0.3,
    marginRight: 8,
  },

  // Responsive adjustments
  '@media (max-height: 700)': {
    headerContainer: {
      marginTop: height * 0.01,
      marginBottom: 24,
    },
    
    card: {
      height: 280,
    },
    
    headline: {
      fontSize: 28,
      lineHeight: 34,
    },

    cardContent: {
      padding: 20,
    },

    iconWrapper: {
      width: 70,
      height: 70,
    },

    cardTitle: {
      fontSize: 20,
      marginBottom: 12,
    },

    cardDescription: {
      fontSize: 15,
      lineHeight: 24,
    },
  },
});