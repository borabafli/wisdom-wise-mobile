import { StyleSheet } from 'react-native';
import { colors, spacing, typography, shadows } from '../tokens';

export const dataPrivacyStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9eff1',
  },

  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },

  // Header
  header: {
    paddingHorizontal: spacing.layout.screenPadding,
    paddingTop: spacing[16],
    paddingBottom: spacing[12],
    flexDirection: 'column',
    gap: spacing[12],
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[12],
  },

  headerTurtleIcon: {
    width: 48,
    height: 48,
  },

  headerTitle: {
    fontSize: 28,
    fontFamily: 'IBMPlexSans-Bold',
    color: '#2B475E',
    letterSpacing: -0.5,
  },

  simplifiedHeaderContent: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing[4],
    flex: 1,
  },
  simplifiedHeaderTitle: {
    fontSize: 24,
    fontFamily: 'Ubuntu-Bold',
    color: '#2B475E',
    textAlign: 'center',
  },
  simplifiedHeaderIcon: {
    width: 48,
    height: 48,
    marginBottom: spacing[2],
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: spacing[32],
  },

  contentContainer: {
    paddingHorizontal: spacing.layout.screenPadding,
  },



  cardText: {
    fontSize: 16,
    fontFamily: 'Ubuntu-Regular',
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: spacing[16],
    textAlign: 'left',
  },

  // Features Section
  featuresSection: {
    marginBottom: spacing[24],
  },

  sectionTitle: {
    fontSize: 18,
    fontFamily: 'IBMPlexSans_SemiCondensed-SemiBold',
    color: '#002d14',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing[16],
  },

  featuresList: {
    gap: spacing[12],
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    padding: spacing[16],
    gap: spacing[12],
    ...shadows.sm,
  },

  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(54, 101, 125, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  featureContent: {
    flex: 1,
  },

  featureTitle: {
    fontSize: 16,
    fontFamily: 'Ubuntu-Bold',
    color: '#1F2937',
    marginBottom: spacing[4],
  },

  featureDescription: {
    fontSize: 14,
    fontFamily: 'Ubuntu-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },

  // Actions Section
  actionsSection: {
    gap: spacing[12],
    marginBottom: spacing[24],
  },

  actionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...shadows.sm,
  },

  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[16],
    paddingHorizontal: spacing[24],
    gap: spacing[12],
  },

  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Ubuntu-Medium',
    color: '#002d14',
  },

  // Contact Section
  policyLinkButton: {
    marginTop: spacing[20],
    marginBottom: spacing[16],
    borderRadius: 16,
    overflow: 'hidden',
  },

  policyLinkGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[8],
    paddingVertical: spacing[16],
    paddingHorizontal: spacing[20],
    borderWidth: 1,
    borderColor: 'rgba(54, 101, 125, 0.15)',
  },

  policyLinkText: {
    fontSize: 16,
    fontFamily: 'Ubuntu-Medium',
    color: '#36657d',
  },

  contactSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    padding: spacing[20],
    alignItems: 'center',
  },

  contactText: {
    fontSize: 14,
    fontFamily: 'Ubuntu-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },

  contactLink: {
    color: '#36657d',
    fontFamily: 'Ubuntu-Bold',
  },
});
