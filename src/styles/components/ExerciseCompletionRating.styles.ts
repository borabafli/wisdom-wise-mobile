/**
 * ExerciseCompletionRating Component Styles
 * Modal interface for rating exercise completion
 */

import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

const { width, height } = Dimensions.get('window');

export const exerciseCompletionRatingStyles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 20,
    width: width * 0.9,
    maxWidth: 400,
    padding: spacing[24],
    alignItems: 'center',
    ...shadows.large,
  },
  closeButton: {
    position: 'absolute',
    top: spacing[16],
    right: spacing[16],
    padding: spacing[8],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing[24],
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[16],
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    textAlign: 'center',
    marginBottom: spacing[8],
  },
  exerciseName: {
    fontSize: typography.fontSize.base,
    color: colors.neutral[600],
    textAlign: 'center',
  },
  ratingSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing[24],
  },
  question: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[800],
    textAlign: 'center',
    marginBottom: spacing[20],
  },
  sliderContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing[16],
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderTrack: {
    backgroundColor: colors.neutral[200],
    height: 6,
    borderRadius: 3,
  },
  sliderThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.green[500],
    ...shadows.small,
  },
  ratingLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing[12],
  },
  ratingLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral[500],
    textAlign: 'center',
    flex: 1,
  },
  ratingText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.green[600],
    textAlign: 'center',
  },
  ratingStars: {
    flexDirection: 'row',
    gap: spacing[4],
    marginTop: spacing[8],
  },
  star: {
    opacity: 0.3,
  },
  starFilled: {
    opacity: 1,
  },
  submitButton: {
    backgroundColor: colors.green[500],
    borderRadius: 12,
    paddingVertical: spacing[14],
    paddingHorizontal: spacing[32],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
    ...shadows.small,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
});