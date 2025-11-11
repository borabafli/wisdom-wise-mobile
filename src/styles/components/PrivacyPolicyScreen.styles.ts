import { StyleSheet } from 'react-native';
import { typography } from '../tokens/typography';
import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';

export const privacyPolicyScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    backgroundColor: colors.background.primary,
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  headerTitle: {
    ...typography.heading.h3,
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 32, // Same width as back button to center the title
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  title: {
    ...typography.heading.h1,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
    fontWeight: '700',
  },
  lastUpdated: {
    ...typography.body.small,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    fontStyle: 'italic',
  },
  sectionTitle: {
    ...typography.heading.h2,
    color: colors.text.primary,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    fontWeight: '600',
  },
  subsectionTitle: {
    ...typography.heading.h3,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  mainText: {
    ...typography.body.medium,
    color: colors.text.primary,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  shortText: {
    ...typography.body.medium,
    color: colors.text.secondary,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
    fontWeight: '500',
  },
  bulletPoint: {
    ...typography.body.medium,
    color: colors.text.primary,
    lineHeight: 22,
    marginBottom: spacing.xs,
    marginLeft: spacing.sm,
  },
  keyPoint: {
    ...typography.body.medium,
    color: colors.text.primary,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  keyPointTitle: {
    fontWeight: '600',
    color: colors.text.primary,
  },
  boldText: {
    fontWeight: '600',
    color: colors.text.primary,
  },
  contactInfo: {
    ...typography.body.medium,
    color: colors.text.primary,
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: 8,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    fontFamily: 'monospace',
  },
  fullPolicyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: '#E3EEF3',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: '#36657d20',
  },
  fullPolicyButtonText: {
    ...typography.body.medium,
    color: '#36657d',
    fontWeight: '600',
  },
});