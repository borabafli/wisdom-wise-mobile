import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

const { width } = Dimensions.get('window');

export const storytellingStyles = StyleSheet.create({
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
    backgroundColor: colors.orange[100],
    borderRadius: 2,
    marginBottom: spacing.xs,
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.orange[500],
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
    minHeight: 500,
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

  // Turtle message
  turtleMessage: {
    backgroundColor: colors.orange[50],
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: colors.orange[400],
  },

  turtleText: {
    ...typography.body.md,
    color: colors.orange[800],
    lineHeight: 22,
  },

  turtleName: {
    fontWeight: '600',
  },

  // Benefits list
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

  // Timeline options
  optionsContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },

  optionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.gray[200],
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.sm,
  },

  optionCardSelected: {
    borderColor: colors.orange[500],
    backgroundColor: colors.orange[25],
  },

  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  optionContent: {
    flex: 1,
  },

  optionTitle: {
    ...typography.heading.sm,
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },

  optionTitleSelected: {
    color: colors.orange[900],
  },

  optionSubtitle: {
    ...typography.body.sm,
    color: colors.gray[600],
  },

  optionSubtitleSelected: {
    color: colors.orange[700],
  },

  // Theme selection
  themesContainer: {
    marginTop: spacing.lg,
  },

  themesTitle: {
    ...typography.heading.sm,
    color: colors.gray[800],
    marginBottom: spacing.md,
    textAlign: 'center',
  },

  themesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },

  themeCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[300],
    alignItems: 'center',
    width: (width - spacing.lg * 2 - spacing.sm) / 2,
    minHeight: 100,
  },

  themeCardSelected: {
    borderColor: colors.orange[400],
    backgroundColor: colors.orange[50],
  },

  themeTitle: {
    ...typography.body.sm,
    color: colors.gray[700],
    fontWeight: '500',
    marginTop: spacing.xs,
    textAlign: 'center',
  },

  themeTitleSelected: {
    color: colors.orange[800],
  },

  themeSubtitle: {
    ...typography.body.xs,
    color: colors.gray[500],
    textAlign: 'center',
    marginTop: spacing.xs / 2,
  },

  // Story input
  inputContainer: {
    marginBottom: spacing.xl,
  },

  storyTextArea: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 12,
    padding: spacing.lg,
    ...typography.body.md,
    minHeight: 200,
    textAlignVertical: 'top',
    ...shadows.sm,
    lineHeight: 22,
  },

  characterCount: {
    ...typography.body.xs,
    color: colors.gray[500],
    textAlign: 'right',
    marginTop: spacing.xs,
  },

  // Hints
  hintsContainer: {
    backgroundColor: colors.orange[25],
    borderRadius: 8,
    padding: spacing.md,
  },

  hintsTitle: {
    ...typography.body.md,
    color: colors.orange[800],
    fontWeight: '500',
    marginBottom: spacing.sm,
  },

  hintsList: {
    gap: spacing.xs,
  },

  hintText: {
    ...typography.body.sm,
    color: colors.orange[700],
    marginLeft: spacing.sm,
  },

  // Deepening questions
  deepeningQuestions: {
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },

  questionContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.gray[200],
    ...shadows.sm,
  },

  questionText: {
    ...typography.body.md,
    color: colors.gray[800],
    fontWeight: '500',
    marginBottom: spacing.md,
  },

  questionInput: {
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    padding: spacing.md,
    ...typography.body.md,
    minHeight: 80,
    textAlignVertical: 'top',
  },

  optionalNote: {
    backgroundColor: colors.blue[25],
    borderRadius: 8,
    padding: spacing.md,
    alignSelf: 'center',
  },

  optionalNoteText: {
    ...typography.body.sm,
    color: colors.blue[700],
    textAlign: 'center',
  },

  // Reflection
  reflectionCard: {
    backgroundColor: colors.green[25],
    borderRadius: 12,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: colors.green[400],
  },

  reflectionText: {
    ...typography.body.md,
    color: colors.green[800],
    lineHeight: 24,
    marginBottom: spacing.lg,
  },

  reflectionHighlight: {
    ...typography.body.md,
    color: colors.green[900],
    fontWeight: '500',
    lineHeight: 24,
    fontStyle: 'italic',
  },

  completeButton: {
    borderRadius: 12,
    overflow: 'hidden',
    ...shadows.md,
  },

  completeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },

  completeButtonText: {
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
    backgroundColor: colors.orange[500],
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