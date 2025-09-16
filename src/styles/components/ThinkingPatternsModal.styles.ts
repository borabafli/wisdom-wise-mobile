/**
 * ThinkingPatternsModal Component Styles
 * Enhanced styling with background image support and optimized text contrast
 */

import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

const { width, height } = Dimensions.get('window');

export const thinkingPatternsModalStyles = StyleSheet.create({
  // Background and container - Enhanced organic watercolor with gradient
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#F8FAFB', // Cool gray-blue for softer feel
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent', // No overlay needed for flowing design
  },
  container: {
    flex: 1,
    paddingTop: 60, // Account for status bar
    backgroundColor: '#F8FAFB', // Cool gray-blue background
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
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4A9B8E', // Teal outline
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 26, // 24-28px Ubuntu Bold per design principles
    fontFamily: 'Ubuntu-Bold',
    color: '#4A9B8E', // Primary Teal/Turquoise
    fontWeight: typography.fontWeight.bold,
  },
  headerSubtitle: {
    fontSize: 15, // 14-16px Ubuntu Regular
    fontFamily: 'Ubuntu-Regular',
    color: '#6B7280', // Medium gray for secondary text
    fontWeight: typography.fontWeight.regular,
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
    fontSize: 26, // 24-28px Ubuntu Bold
    fontFamily: 'Ubuntu-Bold',
    color: '#4A9B8E', // Primary Teal/Turquoise
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing[6], // More vertical spacing
    letterSpacing: 0.5,
  },

  // Education section - Soft Mint background per design principles
  educationSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[8],
    backgroundColor: '#E8F4F1', // Soft Mint for card backgrounds
    padding: spacing[6], // 16-24px generous padding
    borderRadius: spacing.radius.xl, // 8-16px border radius
    gap: spacing[4],
    marginHorizontal: spacing[3],
    ...shadows.components.card, // Subtle shadow (0 2px 4px rgba(0,0,0,0.05))
  },
  educationIcon: {
    marginTop: spacing[0.5],
  },
  educationText: {
    ...typography.textStyles.bodySmall,
    color: colors.text.primary,
    lineHeight: typography.lineHeight.relaxed,
    fontStyle: 'italic',
    flex: 1,
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

  // Fixed top patterns section - Clean white/soft gray per design principles
  fixedTopPatternsSection: {
    position: 'absolute',
    bottom: spacing[20],
    left: spacing.layout.screenPadding,
    right: spacing.layout.screenPadding,
    zIndex: 10,
  },
  fixedTopPatternsContainer: {
    backgroundColor: '#F5F5F5', // Soft gray for contrast
    borderRadius: spacing.radius.xl, // 8-16px border radius
    padding: spacing[6], // 16-24px generous padding
    borderWidth: 0,
    marginHorizontal: spacing[3],
    ...shadows.components.card, // Subtle shadow
  },
  fixedTopPatternsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[2],
    justifyContent: 'center',
  },
  fixedTopPatternsTitle: {
    fontSize: 19, // 18-20px Ubuntu Medium
    fontFamily: 'Ubuntu-Medium',
    color: '#6B7280', // Medium gray per design principles
    fontWeight: typography.fontWeight.medium,
    textTransform: 'none',
    letterSpacing: 0,
  },
  fixedTopPatternsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  fixedPatternStatItem: {
    alignItems: 'center',
    minWidth: '30%',
  },
  fixedPatternStatName: {
    fontSize: 14, // Better readability
    fontFamily: 'Ubuntu-Regular',
    color: '#4A9B8E', // Primary teal for pattern names
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
    marginBottom: spacing[1],
    backgroundColor: '#E8F4F1', // Soft teal background for pills
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: spacing.radius.full, // Fully rounded pills
  },
  fixedPatternStatCount: {
    fontSize: 12,
    fontFamily: 'Ubuntu-Light',
    color: '#6B7280', // Lighter gray for counts
    fontWeight: typography.fontWeight.light,
    textAlign: 'center',
    marginTop: spacing[1],
  },

  // Thoughts container - Enhanced flowing organic layout
  thoughtsContainer: {
    gap: spacing[7], // Even more generous spacing for breathing room
    marginBottom: spacing[8],
    paddingHorizontal: spacing[2], // Subtle inset for organic feel
  },
  thoughtLabel: {
    fontSize: 15, // 14-16px for good readability
    fontFamily: 'Ubuntu-Medium',
    color: '#4A9B8E', // Primary teal
    fontWeight: typography.fontWeight.medium,
    textTransform: 'none',
    letterSpacing: 0.3,
    marginBottom: spacing[3],
  },
  originalThought: {
    backgroundColor: '#FFEDE6', // Softer, desaturated salmon-pink
    padding: spacing[6], // 16-24px generous padding
    borderRadius: spacing.radius.xl, // 8-16px border radius
    borderLeftWidth: 4,
    borderLeftColor: '#FFB5A0', // Coral/Salmon accent
    marginBottom: spacing[6],
    marginHorizontal: spacing[3],
    ...shadows.components.card, // Subtle shadow
  },
  thoughtText: {
    ...typography.textStyles.body,
    color: colors.text.primary,
    fontStyle: 'italic',
    lineHeight: typography.lineHeight.loose, // More breathing room
    fontSize: 15, // Slightly larger for readability
  },
  reframedThought: {
    backgroundColor: '#E8F4F1', // Soft Mint for gentle teal
    padding: spacing[6], // 16-24px generous padding
    borderRadius: spacing.radius.xl, // 8-16px border radius
    borderLeftWidth: 4,
    borderLeftColor: '#6BB3A5', // Primary Teal range
    marginHorizontal: spacing[3],
    ...shadows.components.card, // Subtle shadow
  },
  reframedText: {
    ...typography.textStyles.body,
    color: colors.text.primary,
    fontStyle: 'italic',
    lineHeight: typography.lineHeight.loose, // More breathing room
    fontWeight: typography.fontWeight.medium,
    fontSize: 15, // Slightly larger for readability
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
});