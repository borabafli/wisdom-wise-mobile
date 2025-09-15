import { StyleSheet, Dimensions } from 'react-native';
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },

  card: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: spacing.radius.xl,
    borderTopRightRadius: spacing.radius.xl,
    maxHeight: height * 0.85,
    minHeight: height * 0.6,
    ...shadows.modal,
  },

  headerGradient: {
    borderTopLeftRadius: spacing.radius.xl,
    borderTopRightRadius: spacing.radius.xl,
    paddingBottom: spacing[6],
  },

  closeButton: {
    position: 'absolute',
    top: spacing[4],
    right: spacing[4],
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: spacing.radius.full,
    padding: spacing[2],
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingTop: spacing[6],
    gap: spacing[4],
  },

  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: spacing.radius.lg,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    ...shadows.card,
  },

  exerciseImage: {
    width: '100%',
    height: '100%',
  },

  headerInfo: {
    flex: 1,
  },

  title: {
    ...typography.textStyles.h3,
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing[2],
    lineHeight: typography.lineHeight.tight,
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
    gap: spacing[2],
  },

  starsContainer: {
    flexDirection: 'row',
    gap: spacing[1],
  },

  ratingText: {
    ...typography.textStyles.caption,
    color: colors.white,
    fontWeight: typography.fontWeight.medium,
  },

  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },

  metaText: {
    ...typography.textStyles.caption,
    color: colors.white,
    fontWeight: typography.fontWeight.medium,
  },

  categoryText: {
    ...typography.textStyles.caption,
    color: colors.white,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: spacing.radius.sm,
    fontWeight: typography.fontWeight.medium,
    overflow: 'hidden',
  },

  content: {
    flex: 1,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[6],
  },

  description: {
    ...typography.textStyles.body,
    color: colors.text.primary,
    lineHeight: typography.lineHeight.relaxed,
    marginBottom: spacing[6],
  },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginBottom: spacing[6],
  },

  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: spacing.radius.full,
    gap: spacing[1],
  },

  tagText: {
    ...typography.textStyles.caption,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
    textTransform: 'capitalize',
  },

  stepsSection: {
    marginBottom: spacing[6],
  },

  sectionTitle: {
    ...typography.textStyles.h5,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing[4],
  },

  stepsContainer: {
    gap: spacing[3],
  },

  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },

  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: spacing.radius.full,
    backgroundColor: colors.semantic.success.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing[1],
  },

  stepNumberText: {
    ...typography.textStyles.caption,
    color: colors.semantic.success.dark,
    fontWeight: typography.fontWeight.bold,
    fontSize: 12,
  },

  stepContent: {
    flex: 1,
  },

  stepTitle: {
    ...typography.textStyles.actionTitle,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing[1],
  },

  stepDescription: {
    ...typography.textStyles.body,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.relaxed,
    fontSize: 14,
  },

  noStepsText: {
    ...typography.textStyles.body,
    color: colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: spacing[4],
  },

  moreStepsText: {
    ...typography.textStyles.caption,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing[2],
    fontStyle: 'italic',
  },

  footer: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[6],
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },

  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.semantic.success.default,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    borderRadius: spacing.radius.lg,
    gap: spacing[2],
    ...shadows.button,
  },

  startButtonText: {
    ...typography.textStyles.actionTitle,
    color: colors.white,
    fontWeight: typography.fontWeight.semibold,
  },
});