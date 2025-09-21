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
  },

  // Header Section - Consistent styling
  header: {
    paddingHorizontal: spacing.layout.screenPadding,
    paddingTop: spacing[16], // Reduced from spacing[20]
    paddingBottom: spacing[4], // Further reduced to move content up
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[2],
    marginLeft: -spacing[16],
    marginTop: -spacing[12],
  },
  headerTurtleIcon: {
    width: 162,
    height: 162,
    marginRight: spacing[4],
    marginTop: -spacing[8],
  },
  titleAndSubtitleContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: -spacing[12],
    marginTop: spacing[20],
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#002d14', // Consistent with HomeScreen green theme
    fontFamily: 'BubblegumSans-Regular',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: spacing[1],
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6b7280',
    fontFamily: 'Inter-Medium',
    letterSpacing: 0.2,
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
    backgroundColor: '#2B475E',
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
  
  // New filter button below search bar
  filterButtonBelow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    marginTop: spacing[8],
    alignSelf: 'flex-start',
    position: 'relative',
  },
  
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#87BAA3',
    fontFamily: 'Poppins-SemiBold',
  },
  
  // New circular filter button next to search bar
  filterButtonCircle: {
    width: 48, // Made bigger to match search bar height
    height: 48, // Made bigger to match search bar height
    borderRadius: 24, // Half of width/height for perfect circle
    backgroundColor: 'transparent', // Remove background
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  // Search Section - Enhanced styling for better visual consistency
  searchSection: {
    paddingHorizontal: spacing.layout.screenPadding,
    paddingBottom: spacing[8], // Reduced from spacing[16]
    paddingTop: spacing[4], // Reduced from spacing[8]
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8], // Even smaller gap between search and filter
    marginBottom: spacing[4],
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // More white
    borderRadius: 24, // Match filter button radius
    paddingHorizontal: spacing[12], // Reduced from 16 to 12 to move elements left
    paddingVertical: spacing[8], // Increased to match filter button height
    gap: spacing[8], // Reduced from 12 to 8 to move elements closer
    height: 48, // Fixed height instead of minHeight
  },
  searchInput: {
    flex: 1,
    fontSize: 14, // Reduced from 16 to make placeholder text smaller
    color: '#000000', // Pure black for maximum visibility
    fontWeight: '500', // Reduced from 600 to make it less bold
    fontFamily: 'Inter-Medium', // Slightly lighter font family
    includeFontPadding: false, // Remove extra padding for better text alignment
    height: 48, // Fixed height to match container
    paddingVertical: 0, // Remove vertical padding that could cause line breaks
    paddingLeft: 4, // Reduced from 8 to 4 to move text more to the left
    paddingRight: 0, // No right padding
    textAlignVertical: 'center', // Center text vertically
    backgroundColor: 'transparent', // Ensure transparent background
    multiline: false, // Ensure single line
    numberOfLines: 1, // Force single line
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

  // Filters Section - White transparent box
  filtersSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // White 80% transparent (less transparent)
    paddingTop: spacing[1], // Even more reduced top padding
    paddingBottom: spacing[12],
    paddingHorizontal: spacing.layout.screenPadding,
    gap: spacing[8],
    borderRadius: 16, // Rounded corners
    marginHorizontal: spacing[8], // Reduced horizontal margin for wider box
    marginBottom: spacing[8],
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    backgroundColor: '#DBEDF4', // Light blue to match tags
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B1D6EB', // Darker blue border
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2B475E', // Dark blue text
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

  // New image-based filter chip styles
  filterChipImage: {
    position: 'relative',
    height: 32, // Reduced height for compactness
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 1, // Reduced horizontal margin
    marginVertical: 2, // Small vertical margin for multi-row spacing
  },
  filterChipImageBackground: {
    height: 32, // Match reduced height
    borderRadius: 16, // Adjusted border radius
    position: 'absolute',
    top: 0,
    left: 0,
  },
  filterChipTextOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    fontSize: 11, // Reduced font size for compactness
    fontWeight: '700',
    fontFamily: 'Ubuntu-Bold',
    color: '#0A2A0D',
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 32, // Match reduced height
    letterSpacing: 0.1, // Reduced letter spacing
  },
  filterChipTextOverlaySelected: {
    color: '#0A2A0D', // Keep same color for selected state
    fontWeight: '800',
  },

  // New solid filter chip styles
  filterChipSolid: {
    paddingHorizontal: spacing[6], // Reduced from spacing[8] to spacing[6]
    paddingVertical: spacing[2],
    borderRadius: 16,
    marginHorizontal: spacing[1], // Reduced from spacing[2] to spacing[1]
    marginBottom: spacing[2],
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },

  // Compact filter group styles
  filterGroupCompact: {
    gap: 4, // Reduced gap between title and chips
  },
  filterGroupTitleCompact: {
    fontSize: 16, // Larger title font for better visibility
    fontWeight: '700',
    color: colors.text.primary,
    fontFamily: 'Poppins-Bold',
    marginBottom: 6, // Slightly more bottom margin
  },
  filterRowCompact: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow wrapping to multiple lines
    gap: 4, // Small gap between chips
    marginBottom: 8, // Small bottom margin between categories
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
    paddingVertical: spacing[4], // Further reduced from spacing[8]
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
    gap: spacing[8],
  },
  exerciseCardWrapper: {
    width: '100%',
  },
  exerciseCard: {
    borderTopLeftRadius: 55,
    borderBottomLeftRadius: 55,
    borderTopRightRadius: 0, // Remove right rounding
    borderBottomRightRadius: 0, // Remove right rounding
    overflow: 'hidden',
    shadowColor: 'rgba(0, 0, 0, 0.15)', // Darker shadow like home
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
    height: 110, // Reduced from 144 to 110
    backgroundColor: 'transparent',
  },
  exerciseCardGradient: {
    flexDirection: 'row',
    paddingTop: 0, // Remove top padding
    paddingBottom: 0, // Remove bottom padding  
    paddingLeft: 0, // Remove left padding
    paddingRight: spacing[12], // Keep only right padding
    height: 110, // Match reduced card height
  },
  exerciseImageContainer: {
    width: 55, // Reduced from 70 to 55 to give more space for text
    height: 110, // Match reduced card height
    borderTopLeftRadius: 55, // Match card corner
    borderBottomLeftRadius: 55, // Match card corner
    borderTopRightRadius: 0, // No right rounding
    borderBottomRightRadius: 0, // No right rounding
    overflow: 'hidden',
    marginRight: spacing[12],
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseImage: {
    width: 55, // Match reduced container width
    height: 110, // Match reduced container height
  },
  exerciseContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: spacing[4],
  },
  
  // New style for tag and time row
  tagAndTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[6],
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
  
  // New styles for category tag with image background
  categoryTagImageContainer: {
    position: 'relative',
    alignSelf: 'flex-start',
    marginBottom: 0, // Removed bottom margin since it's now in a row
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  
  categoryTagImage: {
    width: 85, // Increased from 70 to 85
    height: 28, // Increased from 24 to 28
    borderRadius: 14,
  },
  
  categoryTagTextOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    fontSize: 12, // Increased from 10 to 12
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'Ubuntu-Bold',
    color: '#0A2A0D', // Dark green close to black
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 28, // Updated to match new height
  },
  
  // Large button styles for longer benefit names
  categoryTagImageLarge: {
    width: 110, // Larger width for longer text
    height: 28, // Keep same height
  },
  
  categoryTagTextOverlayLarge: {
    fontSize: 11, // Slightly smaller font for longer text
    letterSpacing: 0.3, // Tighter letter spacing
    lineHeight: 28, // Match height
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
  return ['#F8FCFC', '#F4FAFA']; // Lighter colors for exercise cards
};