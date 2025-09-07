import { StyleSheet } from 'react-native';
import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { typography } from '../tokens/typography';

export const moodSliderStyles = StyleSheet.create({
  container: {
    padding: spacing[24],
    marginVertical: spacing[20],
  },
  
  header: {
    alignItems: 'center',
    marginBottom: spacing[4],
    paddingHorizontal: spacing[20],
  },
  
  title: {
    ...typography.textStyles.bodyMedium,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing[8],
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 20,
  },
  
  promptText: {
    ...typography.textStyles.h3,
    color: colors.text.primary,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 26,
    marginTop: spacing[3],
  },
  
  smileyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[6],
    marginTop: spacing[6],
    height: 80,
  },
  
  smileyImage: {
    width: 280,
    height: 60,
  },
  
  effectivenessImage: {
    width: 280,
    height: 72,
  },
  
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[8],
    paddingHorizontal: spacing[20],
    position: 'relative',
  },
  
  trackBackground: {
    height: 6,
    width: 280,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  
  filledTrack: {
    height: '100%',
    backgroundColor: '#446D78',
    borderRadius: 3,
  },
  
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#446D78',
    top: -9,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  
  labelContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  
  currentLabel: {
    ...typography.textStyles.h3,
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: spacing.xs,
    fontSize: 20,
  },
  
  ratingValue: {
    ...typography.textStyles.bodySmall,
    color: colors.text.tertiary,
    fontWeight: '400',
    fontSize: 12,
  },
  
  extremeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[32],
    marginTop: spacing[4],
    marginBottom: spacing[8],
  },
  
  extremeLabel: {
    ...typography.textStyles.caption,
    color: colors.text.tertiary,
    fontSize: 14,
    fontWeight: '300',
    opacity: 0.8,
  },

  submitSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing[16],
    paddingHorizontal: spacing[24],
  },
  
  skipText: {
    ...typography.textStyles.body,
    color: colors.text.tertiary,
    fontSize: 14,
    fontWeight: '400',
    opacity: 0.8,
  },

  submitButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
});