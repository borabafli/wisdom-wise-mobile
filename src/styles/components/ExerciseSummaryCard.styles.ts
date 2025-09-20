import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

const { width, height } = Dimensions.get('window');

export const exerciseSummaryCardStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },

  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  backgroundTouchable: {
    flex: 1,
  },

  blurView: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  card: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: spacing.radius.xl,
    borderTopRightRadius: spacing.radius.xl,
    height: height * 0.8,
    flexDirection: 'column',
    ...shadows.modal,
  },

  // Full-width Image Header
  imageHeader: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: spacing.radius.xl,
    borderTopRightRadius: spacing.radius.xl,
    overflow: 'hidden',
    position: 'relative',
  },

  fullWidthImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // This ensures full width with horizontal cropping
  },

  fallbackGradient: {
    width: '100%',
    height: '100%',
  },

  closeButton: {
    position: 'absolute',
    top: spacing[4],
    right: spacing[4],
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: spacing.radius.full,
    padding: spacing[2],
  },

  ratingOverlay: {
    position: 'absolute',
    bottom: spacing[4],
    left: spacing[4],
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: spacing.radius.lg,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },

  starsContainer: {
    flexDirection: 'row',
    gap: spacing[1],
  },

  // Content Section
  content: {
    flex: 1,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[6],
    paddingBottom: spacing[6],
  },

  exerciseName: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: Platform.select({
      ios: 'Ubuntu-Bold',
      android: 'Ubuntu-Bold',
      default: 'System'
    }),
    color: colors.text.primary,
    lineHeight: 28,
    marginBottom: spacing[2],
  },

  exerciseShortDescription: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: Platform.select({
      ios: 'Ubuntu-Regular',
      android: 'Ubuntu-Regular',
      default: 'System'
    }),
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: spacing[4],
    paddingBottom: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  // Benefit Tags
  benefitTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginBottom: spacing[5],
  },

  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6B7280',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: spacing.radius.lg,
    gap: spacing[1],
    borderWidth: 1,
    borderColor: '#4B5563',
  },

  tagDuration: {
    backgroundColor: '#3F7D7B',
    borderColor: '#2F6B69',
  },

  tagCategory: {
    backgroundColor: '#4B5563',
    borderColor: '#374151',
  },

  tagDifficulty: {
    backgroundColor: '#6B7280',
    borderColor: '#4B5563',
  },

  tagBenefit: {
    backgroundColor: '#3F7D7B',
    borderColor: '#2F6B69',
  },

  tagApproach: {
    backgroundColor: '#4B5563',
    borderColor: '#374151',
  },

  tagText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Ubuntu-Medium',
      android: 'Ubuntu-Medium',
      default: 'System'
    }),
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },

  tagTextDuration: {
    color: '#FFFFFF',
  },

  tagTextCategory: {
    color: '#FFFFFF',
  },

  tagTextDifficulty: {
    color: '#FFFFFF',
  },

  tagTextBenefit: {
    color: '#FFFFFF',
  },

  tagTextApproach: {
    color: '#FFFFFF',
  },

  // Meta Information
  metaInfoContainer: {
    flexDirection: 'row',
    gap: spacing[5],
    marginBottom: spacing[6],
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },

  metaText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Ubuntu-Medium',
      android: 'Ubuntu-Medium',
      default: 'System'
    }),
    color: colors.text.secondary,
  },

  // Steps Section
  stepsSection: {
    marginBottom: spacing[6],
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Platform.select({
      ios: 'Ubuntu-SemiBold',
      android: 'Ubuntu-SemiBold',
      default: 'System'
    }),
    color: colors.text.primary,
    marginBottom: spacing[4],
  },

  stepsContainer: {
    paddingLeft: 0,
  },

  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'relative',
  },

  stepIndicatorContainer: {
    alignItems: 'center',
    width: 40,
    marginRight: spacing[3],
    position: 'relative',
    flexShrink: 0,
    paddingTop: spacing[1],
    minHeight: 55,
  },

  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    borderWidth: 2,
    borderColor: '#3F7D7B',
  },

  stepCircleNumber: {
    fontSize: 12,
    color: '#3F7D7B',
    fontWeight: '700',
    fontFamily: Platform.select({
      ios: 'Ubuntu-Bold',
      android: 'Ubuntu-Bold',
      default: 'System'
    }),
  },

  stepConnectorLine: {
    position: 'absolute',
    left: 19, // Center line with circle in 40px container (40/2 - 1px)
    top: 28, // Start below the circle
    width: 2,
    height: 35, // Reduced height to match tighter spacing
    backgroundColor: '#3F7D7B',
    zIndex: 1,
  },

  stepContent: {
    flex: 1,
    paddingTop: spacing[1],
  },

  stepContentCard: {
    flex: 1,
    paddingVertical: spacing[2],
    paddingBottom: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    minHeight: 45,
  },

  stepTitle: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: Platform.select({
      ios: 'Ubuntu-SemiBold',
      android: 'Ubuntu-SemiBold',
      default: 'System'
    }),
    color: colors.text.primary,
    marginBottom: spacing[1],
    lineHeight: 20,
  },

  stepDescription: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: Platform.select({
      ios: 'Ubuntu-Regular',
      android: 'Ubuntu-Regular',
      default: 'System'
    }),
    color: colors.text.secondary,
    lineHeight: 16,
  },

  // More Steps
  moreStepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[2],
  },

  moreStepsCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },

  moreStepsText: {
    ...typography.textStyles.caption,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.bold,
    fontSize: 10,
  },

  moreStepsLabel: {
    ...typography.textStyles.caption,
    color: colors.text.secondary,
    marginLeft: spacing[4],
    fontStyle: 'italic',
  },

  // No Steps State
  noStepsContainer: {
    paddingVertical: spacing[4],
    alignItems: 'center',
  },

  noStepsText: {
    ...typography.textStyles.body,
    color: colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // Footer
  footer: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    flexShrink: 0,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
  },

  startButton: {
    backgroundColor: '#3F7D7B',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    borderRadius: spacing.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    width: '100%',
    borderWidth: 2,
    borderColor: '#2F6B69',
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  startButtonText: {
    fontSize: 16,
    color: '#FFFFFF', // Explicit white color
    fontWeight: '700',
    fontFamily: Platform.select({
      ios: 'Ubuntu-Bold',
      android: 'Ubuntu-Bold',
      default: 'System'
    }),
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});