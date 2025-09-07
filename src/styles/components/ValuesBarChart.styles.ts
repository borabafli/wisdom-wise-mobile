/**
 * ValuesBarChart Component Styles  
 * Bar chart visualization for user values
 */

import { StyleSheet } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

export const valuesBarChartStyles = StyleSheet.create({
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
    paddingBottom: spacing[20],
  },
  chartContainer: {
    gap: spacing[12],
  },
  valueBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[12],
  },
  valueInfo: {
    flex: 1,
    minWidth: 100,
  },
  valueName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[800],
    marginBottom: spacing[2],
  },
  importanceText: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral[500],
  },
  barContainer: {
    flex: 2,
    height: 24,
    backgroundColor: colors.neutral[100],
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  barFill: {
    height: '100%',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: spacing[8],
  },
  barValue: {
    fontSize: typography.fontSize.xs,
    color: colors.white,
    fontWeight: typography.fontWeight.semibold,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing[20],
  },
  emptyIcon: {
    marginBottom: spacing[12],
  },
  emptyText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[500],
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing[16],
  },
  addValuesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.purple[500],
    borderRadius: 12,
    paddingVertical: spacing[12],
    paddingHorizontal: spacing[16],
    gap: spacing[8],
  },
  addValuesText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: spacing[20],
  },
  loadingText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[500],
    marginTop: spacing[8],
  },
});