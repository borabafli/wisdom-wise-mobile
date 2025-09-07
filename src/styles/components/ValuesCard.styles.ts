/**
 * ValuesCard Component Styles
 * Card component for displaying user values
 */

import { StyleSheet } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

export const valuesCardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginHorizontal: spacing[20],
    marginVertical: spacing[8],
    ...shadows.medium,
    overflow: 'hidden',
  },
  accent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.purple[500],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[20],
    paddingBottom: spacing[12],
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[12],
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.purple[700],
    marginBottom: spacing[2],
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[500],
  },
  content: {
    paddingHorizontal: spacing[20],
    paddingBottom: spacing[8],
  },
  scrollView: {
    maxHeight: 200,
  },
  valueItem: {
    backgroundColor: colors.neutral[50],
    borderRadius: 12,
    padding: spacing[16],
    marginBottom: spacing[12],
    borderLeftWidth: 4,
  },
  valueHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing[8],
  },
  valueHeaderLeft: {
    flex: 1,
  },
  valueName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[800],
    marginBottom: spacing[4],
  },
  importanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
  },
  importanceLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral[600],
  },
  importanceBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.neutral[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  importanceBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  valueQuote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[8],
    marginBottom: spacing[8],
  },
  valueDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[600],
    fontStyle: 'italic',
    lineHeight: 18,
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[6],
    alignItems: 'center',
  },
  tag: {
    backgroundColor: colors.purple[100],
    borderRadius: 8,
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[2],
  },
  tagText: {
    fontSize: typography.fontSize.xs,
    color: colors.purple[700],
    fontWeight: typography.fontWeight.medium,
  },
  moreTagsText: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral[500],
    fontWeight: typography.fontWeight.medium,
  },
  viewAllButton: {
    alignItems: 'center',
    padding: spacing[16],
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  viewAllText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.purple[600],
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing[20],
  },
  emptyText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[500],
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing[16],
  },
  addValueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.purple[500],
    borderRadius: 12,
    paddingVertical: spacing[12],
    paddingHorizontal: spacing[16],
    gap: spacing[8],
  },
  addValueText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
});