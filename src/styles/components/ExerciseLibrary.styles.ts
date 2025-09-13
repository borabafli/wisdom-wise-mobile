/**
 * ExerciseLibrary Component Styles
 * Consistent design with HomeScreen using shared design patterns
 */

import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

const { width, height } = Dimensions.get('window');

export const exerciseLibraryStyles = StyleSheet.create({
  // Container & Layout - Consistent with HomeScreen
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },

  // Header Section - Consistent styling
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.layout.screenPadding,
    paddingTop: spacing[20],
    paddingBottom: spacing[12],
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#002d14', // Consistent with HomeScreen green theme
    fontFamily: 'BubblegumSans-Regular',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
  },
  // Dev Buttons - Maintain existing functionality
  devButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    paddingHorizontal: spacing[12],
    paddingVertical: spacing[8],
    backgroundColor: '#FFE4B5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DEB887',
  },
  devButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary[400],
  },
  devButtonSelected: {
    backgroundColor: '#446D78',
    borderColor: '#446D78',
  },
  // Filter Button - Enhanced styling
  filterButton: {
    padding: spacing[14],
    backgroundColor: 'rgba(135, 186, 163, 0.15)',
    borderRadius: 25,
    position: 'relative',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(135, 186, 163, 0.3)',
    minWidth: 56,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: 'rgba(135, 186, 163, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(135, 186, 163, 0.5)',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#87BAA3',
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

  // Search Section - Enhanced styling for better visual consistency
  searchSection: {
    paddingHorizontal: spacing.layout.screenPadding,
    paddingBottom: spacing[16],
    paddingTop: spacing[8],
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[16],
    marginBottom: spacing[4],
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    paddingHorizontal: spacing[16],
    paddingVertical: spacing[12],
    gap: spacing[12],
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(135, 186, 163, 0.3)',
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.regular,
  },

  // Dev Slider Section
  devSliderSection: {
    backgroundColor: '#FFF9E6',
    borderRadius: 20, // Consistent with home card styling
    marginHorizontal: spacing.layout.screenPadding,
    marginBottom: spacing[16],
    padding: spacing[16],
    borderWidth: 2,
    borderColor: '#FFE4B5',
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  devSliderContainer: {
    alignItems: 'center',
  },

  // Filters Section - Improved styling
  filtersSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Glass morphism effect
    paddingVertical: spacing[16],
    paddingHorizontal: spacing.layout.screenPadding,
    gap: spacing[12],
    borderRadius: 24,
    marginHorizontal: spacing.layout.screenPadding,
    marginBottom: spacing[16],
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  filtersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[8],
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#002d14',
    fontFamily: 'Poppins-Bold',
  },
  clearFiltersButton: {
    paddingHorizontal: spacing[12],
    paddingVertical: spacing[6],
    backgroundColor: 'rgba(134, 239, 172, 0.3)', // Light green
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(134, 239, 172, 0.5)',
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#002d14',
  },
  filterGroup: {
    gap: spacing[8],
  },
  filterGroupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    fontFamily: 'Poppins-SemiBold',
  },
  filterScrollView: {
    flexGrow: 0,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing[8],
    paddingRight: spacing[20],
  },
  filterChip: {
    paddingHorizontal: spacing[16], // Increased from 12 for better touch targets
    paddingVertical: spacing[12], // Increased from 8 for 44px minimum touch target
    backgroundColor: 'rgba(236, 250, 248, 0.8)', // Light teal background
    borderRadius: 20, // More rounded
    borderWidth: 1,
    borderColor: 'rgba(134, 239, 172, 0.4)',
    minHeight: 44, // Ensure minimum touch target
  },
  filterChipSelected: {
    backgroundColor: '#ECFAF8', // Consistent green theme
    borderColor: '#86efac',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#002d14',
  },
  filterChipTextSelected: {
    color: '#002d14', // Keep dark text for readability
  },

  // Results
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  resultsHeader: {
    paddingHorizontal: spacing.layout.screenPadding,
    paddingVertical: spacing[16],
  },
  resultsCount: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
    fontFamily: 'Poppins-Regular',
  },

  // Exercise Cards - Match HomeScreen exercise card styling
  exercisesGrid: {
    paddingHorizontal: spacing.layout.screenPadding,
    gap: spacing[12],
  },
  exerciseCardWrapper: {
    width: '100%',
  },
  exerciseCard: {
    borderRadius: 20, // Consistent with home
    overflow: 'hidden',
    shadowColor: 'rgba(0, 0, 0, 0.15)', // Darker shadow like home
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
    height: 144, // Fixed height to match image container + padding
    backgroundColor: 'transparent',
  },
  exerciseCardGradient: {
    flexDirection: 'row',
    padding: spacing[12],
    height: 144, // Match card height
  },
  exerciseImageContainer: {
    width: 70, // Fixed width for consistency
    height: 120, // Fixed height for consistency
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: spacing[12],
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseImage: {
    width: 70, // Match container width
    height: 120, // Match container height
  },
  exerciseContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: spacing[4],
  },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing[10],
    paddingVertical: spacing[6],
    borderRadius: 14,
    marginBottom: spacing[8],
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryTagText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'Poppins-SemiBold',
  },
  exerciseTitle: {
    fontSize: width < 375 ? 15 : 17, // Increased font size for better readability
    fontWeight: '700',
    color: '#001a0e', // Even darker green for better contrast
    lineHeight: width < 375 ? 18 : 22, // Better line height
    fontFamily: 'Poppins-Bold',
    textShadowColor: 'rgba(255, 255, 255, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    marginBottom: spacing[2], // Add spacing
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
    fontSize: 11,
    color: '#001a0e',
    fontWeight: '600', // Increased font weight
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    opacity: 0.8, // Slightly more visible
  },
  exerciseDescription: {
    fontSize: 13, // Increased font size
    color: '#002d14',
    lineHeight: 17,
    opacity: 0.9, // Increased opacity for better readability
    letterSpacing: 0.1,
    marginTop: spacing[1], // Add spacing
  },

  // Empty State - Consistent styling
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[64],
    paddingHorizontal: spacing[32],
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: spacing[16],
    marginBottom: spacing[8],
    fontFamily: 'Poppins-SemiBold',
  },
  emptyStateDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Poppins-Regular',
  },
});

// Tag colors with enhanced visibility and accessibility
export const getTagColor = (category: string) => {
  const tagColors = {
    'CBT': { bg: 'rgba(22, 163, 74, 0.9)', text: '#ffffff' }, // Strong green background
    'BREATHING': { bg: 'rgba(34, 197, 94, 0.9)', text: '#ffffff' }, // Medium green
    'Breathing': { bg: 'rgba(34, 197, 94, 0.9)', text: '#ffffff' }, // Medium green  
    'Meditation': { bg: 'rgba(21, 128, 61, 0.9)', text: '#ffffff' }, // Dark green
    'Mindfulness': { bg: 'rgba(5, 150, 105, 0.9)', text: '#ffffff' }, // Teal green
    'Journaling': { bg: 'rgba(6, 78, 59, 0.9)', text: '#ffffff' }, // Very dark green
    'ACT': { bg: 'rgba(4, 120, 87, 0.9)', text: '#ffffff' }, // Dark teal
    'Self-Care': { bg: 'rgba(15, 118, 110, 0.9)', text: '#ffffff' }, // Teal
  };
  return tagColors[category] || { bg: 'rgba(22, 163, 74, 0.9)', text: '#ffffff' };
};

// Exercise card gradients consistent with home
export const getExerciseCardGradient = () => {
  return ['#ECFAF8', '#EDF8F8']; // Consistent with home exercise cards
};