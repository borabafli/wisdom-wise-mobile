import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

const { width } = Dimensions.get('window');

export const goalSettingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },

  progressContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },

  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: colors.blue[100],
    borderRadius: 2,
    marginBottom: spacing.xs,
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.blue[500],
    borderRadius: 2,
  },

  progressText: {
    ...typography.body.sm,
    color: colors.gray[600],
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },

  stepContainer: {
    flex: 1,
    minHeight: 400,
  },

  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },

  stepTitle: {
    ...typography.heading.lg,
    color: colors.gray[900],
    textAlign: 'center',
    marginBottom: spacing.md,
  },

  stepDescription: {
    ...typography.body.md,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },

  // Benefits list (intro step)
  benefitsList: {
    marginBottom: spacing.xl,
  },

  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },

  benefitText: {
    ...typography.body.md,
    color: colors.gray[700],
    marginLeft: spacing.sm,
    flex: 1,
  },

  skipButton: {
    alignSelf: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },

  skipButtonText: {
    ...typography.body.md,
    color: colors.gray[500],
    textDecorationLine: 'underline',
  },

  // Focus area options
  optionsContainer: {
    gap: spacing.md,
  },

  optionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.gray[200],
    ...shadows.sm,
  },

  optionCardSelected: {
    borderColor: colors.blue[500],
    backgroundColor: colors.blue[50],
  },

  optionTitle: {
    ...typography.heading.sm,
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },

  optionTitleSelected: {
    color: colors.blue[900],
  },

  optionSubtitle: {
    ...typography.body.sm,
    color: colors.gray[600],
    marginBottom: spacing.sm,
  },

  optionSubtitleSelected: {
    color: colors.blue[700],
  },

  examplesContainer: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },

  exampleText: {
    ...typography.body.xs,
    color: colors.gray[500],
    marginBottom: spacing.xs / 2,
  },

  // Custom input
  customInputContainer: {
    marginTop: spacing.lg,
  },

  inputLabel: {
    ...typography.body.md,
    color: colors.gray[700],
    marginBottom: spacing.sm,
    fontWeight: '500',
  },

  textInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: spacing.md,
    ...typography.body.md,
    minHeight: 80,
    textAlignVertical: 'top',
  },

  // Text area input
  inputContainer: {
    marginBottom: spacing.lg,
  },

  textArea: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: spacing.md,
    ...typography.body.md,
    minHeight: 100,
    textAlignVertical: 'top',
    ...shadows.sm,
  },

  // Suggestions
  suggestionsContainer: {
    marginTop: spacing.lg,
  },

  suggestionsTitle: {
    ...typography.body.md,
    color: colors.orange[700],
    marginBottom: spacing.md,
    fontWeight: '500',
  },

  suggestionChip: {
    backgroundColor: colors.orange[50],
    borderWidth: 1,
    borderColor: colors.orange[200],
    borderRadius: 20,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    alignSelf: 'flex-start',
  },

  suggestionText: {
    ...typography.body.sm,
    color: colors.orange[800],
  },

  // Motivation tips
  motivationTips: {
    backgroundColor: colors.orange[50],
    borderRadius: 8,
    padding: spacing.md,
    marginTop: spacing.lg,
  },

  tipsTitle: {
    ...typography.body.md,
    color: colors.orange[700],
    marginBottom: spacing.sm,
    fontWeight: '500',
  },

  tipText: {
    ...typography.body.sm,
    color: colors.orange[600],
    marginBottom: spacing.xs,
  },

  // Timeline options
  timelineContainer: {
    gap: spacing.md,
  },

  timelineCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.gray[200],
    alignItems: 'center',
    ...shadows.sm,
  },

  timelineCardSelected: {
    borderColor: colors.blue[500],
    backgroundColor: colors.blue[50],
  },

  timelineTitle: {
    ...typography.heading.sm,
    color: colors.gray[900],
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },

  timelineTitleSelected: {
    color: colors.blue[900],
  },

  timelineDescription: {
    ...typography.body.sm,
    color: colors.gray[600],
    textAlign: 'center',
  },

  timelineDescriptionSelected: {
    color: colors.blue[700],
  },

  // Summary step
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },

  summarySection: {
    marginBottom: spacing.lg,
  },

  summaryLabel: {
    ...typography.body.sm,
    color: colors.gray[500],
    marginBottom: spacing.xs,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  summaryValue: {
    ...typography.body.md,
    color: colors.gray[900],
    lineHeight: 22,
  },

  nextStepsCard: {
    backgroundColor: colors.green[50],
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },

  nextStepsTitle: {
    ...typography.heading.sm,
    color: colors.green[800],
    marginBottom: spacing.sm,
  },

  nextStepsText: {
    ...typography.body.sm,
    color: colors.green[700],
    marginBottom: spacing.xs,
  },

  saveGoalButton: {
    borderRadius: 12,
    overflow: 'hidden',
    ...shadows.md,
  },

  saveGoalGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },

  saveGoalButtonText: {
    ...typography.body.lg,
    color: colors.white,
    fontWeight: '600',
  },

  // Navigation
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },

  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    gap: spacing.sm,
  },

  backButton: {
    backgroundColor: colors.gray[100],
  },

  backButtonText: {
    ...typography.body.md,
    color: colors.gray[600],
  },

  nextButton: {
    backgroundColor: colors.blue[500],
  },

  nextButtonDisabled: {
    backgroundColor: colors.gray[300],
  },

  nextButtonText: {
    ...typography.body.md,
    color: colors.white,
    fontWeight: '500',
  },

  nextButtonTextDisabled: {
    color: colors.gray[500],
  },
});