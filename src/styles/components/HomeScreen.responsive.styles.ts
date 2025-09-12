/**
 * HomeScreen Responsive Styles - Cross-platform optimized
 */

import { StyleSheet } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';
import { 
  screenDimensions, 
  responsiveSpacing, 
  responsiveFontSize, 
  platformStyles, 
  containerStyles,
  responsivePatterns 
} from '../../utils/crossPlatform';

export const homeScreenResponsiveStyles = StyleSheet.create({
  // Container & Layout
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
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

  // Scroll View - Responsive
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    paddingBottom: responsiveSpacing(120),
    minHeight: screenDimensions.height * 0.9,
  },

  // Header Section - Responsive Layout
  headerSection: {
    ...containerStyles.screenPadding,
    paddingTop: responsiveSpacing(32),
    marginBottom: screenDimensions.isSmall ? responsiveSpacing(60) : responsiveSpacing(80),
    minHeight: screenDimensions.isSmall ? 160 : 180,
  },

  headerText: {
    position: 'absolute',
    left: screenDimensions.isSmall 
      ? screenDimensions.width * 0.08 
      : screenDimensions.width * 0.1,
    top: screenDimensions.isSmall ? 50 : 70,
    zIndex: 2,
    maxWidth: screenDimensions.width * 0.75,
  },

  // Typography with Design System
  ctaTitle: {
    ...typography.textStyles.welcomeTitle,
    fontSize: responsiveFontSize(typography.textStyles.welcomeTitle.fontSize),
    color: colors.text.primary,
    marginBottom: responsiveSpacing(4),
    textAlign: 'left',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  ctaSubtitle: {
    ...typography.textStyles.welcomeSubtitle,
    fontSize: responsiveFontSize(typography.textStyles.welcomeSubtitle.fontSize),
    color: colors.text.secondary,
    marginBottom: responsiveSpacing(8),
    textAlign: 'left',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  // Turtle and Input Layout - Responsive
  inputWithTurtleWrapper: {
    alignItems: 'flex-end',
    marginTop: screenDimensions.isSmall ? 120 : 140,
    position: 'relative',
    width: '100%',
    ...containerStyles.screenPadding,
  },

  turtleAtBarContainer: {
    position: 'absolute',
    top: -75,
    right: screenDimensions.isSmall ? 20 : 30,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  turtleAtBarImage: {
    width: screenDimensions.isSmall ? 90 : 110,
    height: screenDimensions.isSmall ? 90 : 110,
    opacity: 1.0,
  },

  // Input Container - Modern Design
  inputContainer: {
    ...responsivePatterns.card,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: platformStyles.borderRadius,
    marginHorizontal: responsiveSpacing(16),
    paddingHorizontal: responsiveSpacing(20),
    paddingVertical: responsiveSpacing(16),
    minHeight: screenDimensions.isTablet ? 60 : 56,
    ...shadows.medium,
  },

  placeholderText: {
    ...typography.textStyles.body,
    fontSize: responsiveFontSize(typography.textStyles.body.fontSize),
    color: colors.text.placeholder,
    flex: 1,
    marginRight: responsiveSpacing(12),
  },

  micButton: {
    ...responsivePatterns.buttonSize.small,
    backgroundColor: colors.primary[500],
    borderRadius: platformStyles.borderRadius / 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },

  // Quote Section - Responsive
  quoteSection: {
    ...containerStyles.cardPadding,
    marginTop: responsiveSpacing(40),
    marginHorizontal: responsiveSpacing(20),
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: platformStyles.borderRadius,
    ...shadows.medium,
  },

  quoteText: {
    ...typography.textStyles.quote,
    fontSize: responsiveFontSize(typography.textStyles.quote.fontSize),
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: responsiveSpacing(8),
    fontStyle: 'italic',
  },

  quoteAuthor: {
    ...typography.textStyles.caption,
    fontSize: responsiveFontSize(typography.textStyles.caption.fontSize),
    color: colors.text.secondary,
    textAlign: 'center',
    fontWeight: '500',
  },

  // Action Cards - Responsive Grid
  actionCardsContainer: {
    paddingHorizontal: responsiveSpacing(20),
    marginTop: responsiveSpacing(32),
  },

  actionCardsGrid: {
    flexDirection: screenDimensions.isTablet ? 'row' : 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  actionCard: {
    ...responsivePatterns.card,
    width: screenDimensions.isTablet 
      ? (screenDimensions.width - responsiveSpacing(60)) / 2
      : '100%',
    marginBottom: responsiveSpacing(16),
    padding: responsiveSpacing(20),
    alignItems: 'center',
    minHeight: screenDimensions.isTablet ? 120 : 100,
  },

  actionCardIcon: {
    marginBottom: responsiveSpacing(8),
  },

  actionCardTitle: {
    ...typography.textStyles.actionTitle,
    fontSize: responsiveFontSize(typography.textStyles.actionTitle.fontSize),
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: responsiveSpacing(4),
  },

  actionCardDescription: {
    ...typography.textStyles.actionDescription,
    fontSize: responsiveFontSize(typography.textStyles.actionDescription.fontSize),
    color: colors.text.secondary,
    textAlign: 'center',
  },

  // Session History - Responsive
  historySection: {
    ...containerStyles.section,
    paddingHorizontal: responsiveSpacing(20),
  },

  historySectionTitle: {
    ...typography.textStyles.sessionTitle,
    fontSize: responsiveFontSize(typography.textStyles.sessionTitle.fontSize),
    color: colors.text.primary,
    marginBottom: responsiveSpacing(16),
  },

  historyItem: {
    ...responsivePatterns.listItem,
    backgroundColor: colors.background.secondary,
    borderRadius: platformStyles.borderRadius,
    marginBottom: responsiveSpacing(12),
    flexDirection: 'row',
    alignItems: 'center',
  },

  historyItemText: {
    ...typography.textStyles.body,
    fontSize: responsiveFontSize(typography.textStyles.body.fontSize),
    color: colors.text.primary,
    flex: 1,
    marginLeft: responsiveSpacing(12),
  },

  historyItemTime: {
    ...typography.textStyles.caption,
    fontSize: responsiveFontSize(typography.textStyles.caption.fontSize),
    color: colors.text.secondary,
  },

  // Loading states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },

  loadingText: {
    ...typography.textStyles.body,
    fontSize: responsiveFontSize(typography.textStyles.body.fontSize),
    color: colors.text.secondary,
    marginTop: responsiveSpacing(16),
  },
});