/**
 * ThinkingPatternsModal Component Styles
 * Enhanced styling with background image support and optimized text contrast
 */

import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

const { width, height } = Dimensions.get('window');

export const thinkingPatternsModalStyles = StyleSheet.create({
  // Background - Soft mint gradient (#E8F4F1 → #FFFFFF) with subtle watercolor texture
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#E8F4F1', // Soft mint base
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent', // No overlay needed for flowing design
  },
  container: {
    flex: 1,
    paddingTop: 60, // Account for status bar
    backgroundColor: 'transparent', // Let background gradient show
  },

  // Header - Enhanced with proper teal and spacing per design principles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.layout.screenPadding,
    paddingVertical: spacing[12], // 40-48px section spacing
    paddingTop: spacing[16], // Extra top padding for breathing room
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  closeButton: {
    width: 44, // 44x44px touch target
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F4F1', // Circular, soft mint background
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0, // No border for soft appearance
    ...shadows.components.card, // Subtle shadow
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 22, // Ubuntu Bold 22px as specified
    fontFamily: 'Ubuntu-Bold',
    color: '#2D3436', // Dark gray as specified
    fontWeight: typography.fontWeight.bold,
  },
  headerSubtitle: {
    fontSize: 14, // Ubuntu Light 14px as specified
    fontFamily: 'Ubuntu-Light',
    color: '#6B7280', // Soft gray as specified
    fontWeight: typography.fontWeight.light,
    marginTop: spacing[2],
  },
  headerRight: {
    width: 44, // Balance the close button
  },


  // List and cards
  flatList: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: spacing.layout.screenPadding,
    paddingBottom: spacing.layout.screenPadding,
  },
  patternCard: {
    width: width - (spacing.layout.screenPadding * 2),
    minHeight: height * 0.7, // Maintain good height for content
    marginRight: spacing.components.cardGap,
    marginBottom: spacing[6], // Add bottom margin for flow
    borderRadius: spacing.radius['2xl'], // More organic rounded corners
    overflow: 'visible', // Allow organic shadows to show
    backgroundColor: 'transparent', // No card background, organic flow
  },
  cardBlurContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: spacing.radius['2xl'],
    overflow: 'visible',
  },
  cardScrollView: {
    flex: 1,
  },
  cardContent: {
    flexGrow: 1,
    padding: spacing.layout.screenPadding * 2, // Even more generous padding
    paddingBottom: spacing.layout.screenPadding * 2.5,
    backgroundColor: 'white', // Individual sections get white backgrounds
    borderRadius: spacing.radius['3xl'], // More organic rounded corners
    ...shadows.components.card, // Subtle shadow for depth
    marginBottom: spacing[6], // More space between sections
    marginHorizontal: spacing[3], // Subtle inset for flowing feel
  },

  // Card header - Enhanced with proper title styling
  cardHeader: {
    marginBottom: spacing[10], // More generous spacing
    paddingBottom: spacing[6],
    paddingTop: spacing[6],
  },
  patternType: {
    fontSize: 24, // Ubuntu Bold 24px as specified
    fontFamily: 'Ubuntu-Bold',
    color: '#4A9B8E', // Teal as specified
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing[4], // Space for decorative accent
    letterSpacing: 0.5,
  },
  // Decorative icon - Small organic teal watercolor shape (leaf/feather silhouette)
  decorativeIcon: {
    alignSelf: 'center',
    marginBottom: spacing[6],
    width: 40,
    height: 40,
    tintColor: '#4A9B8E',
    opacity: 0.7,
  },

  // Pattern Description Section - Card container with soft mint background
  descriptionSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[8],
    backgroundColor: '#E8F4F1', // Soft mint background (#E8F4F1)
    padding: spacing[6], // 16-24px generous padding
    borderRadius: 16, // Rounded corners (16px)
    gap: spacing[4],
    marginHorizontal: spacing[3],
    ...shadows.components.card, // Subtle shadow
  },
  brainIcon: {
    marginTop: spacing[0.5],
  },
  descriptionText: {
    fontSize: 15, // Ubuntu Regular 15px
    fontFamily: 'Ubuntu-Regular',
    color: '#2D3436', // Dark gray (#2D3436)
    lineHeight: typography.lineHeight.relaxed,
    flex: 1,
  },

  // Enhanced organic progress section with therapeutic spacing
  compactEffectSection: {
    marginBottom: spacing[6], // More breathing room
    backgroundColor: '#F8FAFB', // Cool gray-blue background
    padding: spacing[4],
    borderRadius: spacing.radius['2xl'],
    marginHorizontal: spacing[2],
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3], // More generous gap
    marginBottom: spacing[4], // More space before progress bar
  },
  progressTitle: {
    ...typography.textStyles.body, // Larger for better hierarchy
    color: '#4A9B8E', // Teal for consistency
    fontWeight: typography.fontWeight.medium, // Softer weight
    letterSpacing: 0.3,
  },
  progressBar: {
    height: 8, // Slightly taller for better visibility
    backgroundColor: '#E8F4F1', // Soft mint background
    borderRadius: spacing.radius.full,
    overflow: 'hidden',
    marginHorizontal: spacing[1], // Subtle inset
  },
  progressFill: {
    height: '100%',
    borderRadius: spacing.radius.full,
    // Enhanced gradient for watercolor effect applied via component
  },

  // Progress Footer - Sticky footer card, white background with subtle shadow
  progressFooterSection: {
    position: 'absolute',
    bottom: spacing[20],
    left: spacing.layout.screenPadding,
    right: spacing.layout.screenPadding,
    zIndex: 10,
  },
  progressFooterContainer: {
    backgroundColor: 'white', // White background with subtle shadow
    borderRadius: spacing.radius.xl,
    padding: spacing[6],
    borderWidth: 0,
    marginHorizontal: spacing[3],
    ...shadows.components.card, // Subtle shadow
  },
  progressFooterTitle: {
    fontSize: 14, // Ubuntu Medium 14px
    fontFamily: 'Ubuntu-Medium',
    color: '#4A9B8E', // Teal
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  progressFooterChips: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  patternChip: {
    alignItems: 'center',
    minWidth: '30%',
  },
  patternChipText: {
    fontSize: 12,
    fontFamily: 'Ubuntu-Regular',
    color: '#4A9B8E', // Teal text
    fontWeight: typography.fontWeight.regular,
    textAlign: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: spacing.radius.full, // Rounded pills with teal outline
    borderWidth: 1,
    borderColor: '#4A9B8E', // Teal outline
  },

  // Examples Section
  examplesSection: {
    marginBottom: spacing[8],
    paddingHorizontal: spacing[2],
  },
  examplesTitle: {
    fontSize: 18,
    fontFamily: 'Ubuntu-Medium',
    color: '#2D3436',
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing[6],
    textAlign: 'center',
  },
  
  // Distorted Thought Card - Very light coral background
  distortedThoughtCard: {
    backgroundColor: '#FFF4E6', // Very light coral (#FFF4E6)
    padding: spacing[6],
    borderRadius: 16, // Rounded corners
    marginBottom: spacing[4],
    marginHorizontal: spacing[3],
    ...shadows.components.card,
  },
  distortedThoughtHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
    gap: spacing[2],
  },
  distortedThoughtIcon: {
    width: 16,
    height: 16,
    tintColor: '#FF6F61', // Orange color to match the coral theme
    opacity: 0.8,
  },
  distortedThoughtLabel: {
    fontSize: 14, // Ubuntu Medium 14px
    fontFamily: 'Ubuntu-Medium',
    color: '#FF6F61', // Coral (#FF6F61)
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing[3],
  },
  distortedThoughtText: {
    fontSize: 15, // Ubuntu Regular 15px
    fontFamily: 'Ubuntu-Regular',
    color: '#2D3436', // Dark gray
    lineHeight: typography.lineHeight.loose,
  },
  
  // Balanced Thought Card - Soft mint background
  balancedThoughtCard: {
    backgroundColor: '#E8F4F1', // Soft mint (#E8F4F1)
    padding: spacing[6],
    borderRadius: 16, // Rounded corners
    marginHorizontal: spacing[3],
    ...shadows.components.card,
  },
  balancedThoughtLabel: {
    fontSize: 14, // Ubuntu Medium 14px
    fontFamily: 'Ubuntu-Medium',
    color: '#4A9B8E', // Teal (#4A9B8E)
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing[3],
  },
  balancedThoughtText: {
    fontSize: 15, // Ubuntu Regular 15px
    fontFamily: 'Ubuntu-Regular',
    color: '#2D3436', // Dark gray
    lineHeight: typography.lineHeight.loose,
  },

  // Headers for thought cards with icons
  balancedThoughtHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
    gap: spacing[2],
  },
  thoughtCardIcon: {
    width: 16,
    height: 16,
    tintColor: '#4A9B8E',
    opacity: 0.7,
  },

  // Enhanced organic distortion tags with pastel treatment
  compactDistortionTags: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing[4], // More breathing room
    gap: spacing[2],
  },
  compactDistortionTag: {
    backgroundColor: '#F3F0FF', // Lavender mist for variety
    paddingHorizontal: spacing[4], // More generous padding
    paddingVertical: spacing[2],
    borderRadius: spacing.radius.full, // Fully rounded for organic pill shape
    borderWidth: 0, // No borders for organic flow
  },
  compactDistortionTagText: {
    ...typography.textStyles.caption,
    color: '#4A9B8E', // Teal for consistency
    fontWeight: typography.fontWeight.medium,
    fontSize: 11, // Slightly larger for readability
    letterSpacing: 0.2,
  },


  // Context (compact)
  contextText: {
    ...typography.textStyles.caption,
    color: colors.text.secondary,
    fontStyle: 'italic',
    lineHeight: typography.lineHeight.relaxed, // Better readability
    textAlign: 'center',
    fontSize: 11, // Slightly larger
    marginTop: spacing[4], // More breathing room
    marginBottom: spacing[2],
    paddingHorizontal: spacing[4], // Better text wrapping
  },


  // Navigation indicators - Enhanced organic design with breathing room
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[8], // Even more generous spacing
    gap: spacing[4],
    backgroundColor: 'transparent', // No background separation
    paddingHorizontal: spacing.layout.screenPadding,
    marginTop: spacing[4], // Additional top margin for flow
  },
  indicator: {
    width: 10, // Slightly larger
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6BB3A5', // Exact teal with transparency
    opacity: 0.3,
  },
  activeIndicator: {
    backgroundColor: '#4A9B8E', // Exact primary teal
    width: 28, // More prominent
    opacity: 1,
    ...shadows.components.actionButton,
  },

  // Empty state - Clean design
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.layout.screenPadding * 2,
    backgroundColor: 'white',
    margin: spacing.layout.screenPadding,
    borderRadius: spacing.radius.xl,
    ...shadows.components.card,
  },
  emptyStateText: {
    ...typography.textStyles.h4,
    color: colors.text.primary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.relaxed,
    fontWeight: typography.fontWeight.medium,
  },

  // Personalized thought shift section - Enhanced warm cream watercolor
  thoughtShiftSection: {
    marginTop: spacing[8],
    marginBottom: spacing[8],
    backgroundColor: '#FFF8F0', // Warm cream for softer feel
    padding: spacing[7], // More generous padding for therapeutic space
    borderRadius: spacing.radius['3xl'], // Even more organic curves
    borderWidth: 0, // No hard borders, organic flow
    marginHorizontal: spacing[1], // Subtle organic inset
    ...shadows.components.card,
  },
  thoughtShiftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  thoughtShiftTitle: {
    ...typography.textStyles.body, // Larger for better hierarchy
    color: '#4A9B8E', // Teal for consistency
    fontWeight: typography.fontWeight.medium, // Softer than bold
    textTransform: 'none', // More organic, less rigid
    letterSpacing: 0.3,
    marginBottom: spacing[3], // Better spacing
  },
  thoughtShiftText: {
    ...typography.textStyles.body, // Larger for readability
    color: colors.text.primary,
    fontStyle: 'italic',
    lineHeight: typography.lineHeight.loose, // More breathing room
    fontWeight: typography.fontWeight.regular, // Softer weight
  },
});