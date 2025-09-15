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
    backgroundColor: 'rgba(20, 184, 166, 0.2)',
    borderRadius: 2,
    marginRight: 12,
  },

  progressFill: {
    width: '57%', // 4/7 pages
    height: '100%',
    backgroundColor: colors.teal[500],
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
    paddingVertical: 20,
  },

  headerContainer: {
    alignItems: 'center',
    marginTop: height * 0.04,
    paddingHorizontal: 20,
  },

  headline: {
    fontSize: 32,
    fontFamily: 'BubblegumSans-Regular',
    color: colors.teal[800],
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 40,
    marginBottom: 16,
  },

  // Cards Container Styles
  cardsScrollView: {
    flex: 1,
    marginVertical: 16,
  } as any,

  cardsContent: {
    paddingBottom: 20,
  },

  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  } as any,

  cardWrapper: {
    width: (width - 48 - 16) / 2, // Account for padding and gap
    marginBottom: 20,
  },

  // Card Styles (Following organic watercolor minimalism)
  card: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: colors.teal[500],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },

  cardInner: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.08)',
    backdropFilter: 'blur(10px)',
  },

  cardContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Text Content Styles
  textContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconImage: {
    width: 56,
    height: 56,
    marginBottom: 12,
    opacity: 0.9,
  },

  cardTitle: {
    fontSize: 16,
    fontFamily: 'BubblegumSans-Regular',
    color: colors.teal[800],
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
    letterSpacing: -0.2,
  },

  cardDescription: {
    fontSize: 12,
    fontFamily: 'Ubuntu-Regular',
    color: colors.teal[600],
    textAlign: 'center',
    lineHeight: 16,
    opacity: 0.8,
  },


  // Action Button Styles
  actionContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
    marginTop: 8,
  },

  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    shadowColor: colors.teal[500],
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
    fontSize: 18,
    fontFamily: 'Ubuntu-Bold',
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