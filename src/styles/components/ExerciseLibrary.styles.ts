/**
 * ExerciseLibrary Component Styles
 * Main library screen for browsing exercises
 */

import { StyleSheet } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

export const exerciseLibraryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[20],
    paddingTop: spacing[16],
    paddingBottom: spacing[8],
  },
  headerTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
  },
  devButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    paddingHorizontal: spacing[12],
    paddingVertical: spacing[8],
    backgroundColor: colors.orange[100],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.orange[300],
  },
  devButtonText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary[400],
  },
  devButtonSelected: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  filterButton: {
    padding: spacing[12],
    backgroundColor: colors.background.card,
    borderRadius: 12,
    position: 'relative',
    ...shadows.small,
  },
  filterButtonActive: {
    backgroundColor: colors.teal[100],
    borderWidth: 1,
    borderColor: colors.teal[400],
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.primary[600],
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },

  // Search
  searchSection: {
    paddingHorizontal: spacing[20],
    paddingBottom: spacing[16],
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[12],
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: 12,
    paddingHorizontal: spacing[16],
    paddingVertical: spacing[12],
    gap: spacing[12],
    ...shadows.small,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.regular,
  },

  // Dev Slider
  devSliderSection: {
    backgroundColor: colors.orange[50],
    borderRadius: 16,
    marginHorizontal: spacing[20],
    marginBottom: spacing[16],
    padding: spacing[16],
    borderWidth: 2,
    borderColor: colors.orange[100],
    ...shadows.small,
  },
  devSliderContainer: {
    alignItems: 'center',
  },

  // Filters
  filtersSection: {
    backgroundColor: colors.background.secondary,
    paddingVertical: spacing[12],
    paddingHorizontal: spacing[20],
    gap: spacing[12],
  },
  filtersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
  },
  filtersTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  clearFiltersButton: {
    paddingHorizontal: spacing[12],
    paddingVertical: spacing[6],
    backgroundColor: colors.primary[100],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary[300],
  },
  clearFiltersText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary[600],
  },
  filterGroup: {
    gap: spacing[6],
  },
  filterGroupTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
  },
  filterScrollView: {
    flexGrow: 0,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing[6],
    paddingRight: spacing[20],
  },
  filterChip: {
    paddingHorizontal: spacing[12],
    paddingVertical: spacing[6],
    backgroundColor: colors.teal[100],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.teal[300],
  },
  filterChipSelected: {
    backgroundColor: colors.teal[400],
    borderColor: colors.teal[400],
  },
  filterChipText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[800],
  },
  filterChipTextSelected: {
    color: colors.white,
  },

  // Results
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  resultsHeader: {
    paddingHorizontal: spacing[20],
    paddingVertical: spacing[16],
  },
  resultsCount: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },

  // Exercise Cards
  exercisesGrid: {
    paddingHorizontal: spacing[20],
    gap: spacing[12],
  },
  exerciseRow: {
    flexDirection: 'row',
    gap: spacing[12],
  },
  exerciseCardWrapper: {
    flex: 1,
  },
  exerciseCard: {
    borderRadius: 16,
    overflow: 'hidden',
    ...shadows.small,
    height: 160,
  },
  exerciseCardGradient: {
    flexDirection: 'row',
    padding: spacing[12],
    height: 160,
  },
  exerciseImageContainer: {
    width: 60,
    height: 136,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: spacing[12],
  },
  exerciseImage: {
    width: 60,
    height: 136,
  },
  exerciseContent: {
    flex: 1,
    gap: spacing[8],
  },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[4],
    borderRadius: 12,
  },
  categoryTagText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  exerciseTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    lineHeight: 20,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  exerciseDuration: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral[800],
    fontWeight: typography.fontWeight.medium,
  },
  exerciseDescription: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral[700],
    lineHeight: 16,
    opacity: 0.8,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: spacing[32],
  },
  emptyStateTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginTop: spacing[16],
    marginBottom: spacing[8],
  },
  emptyStateDescription: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});