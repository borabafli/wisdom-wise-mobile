import { StyleSheet } from 'react-native';

export const sessionSummariesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC', // --off-white from style guide
  },

  header: {
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 24,
    position: 'relative',
  },

  closeButton: {
    position: 'absolute',
    top: 50,
    right: 24,
    width: 40,
    height: 40,
    borderRadius: 20, // --radius-full
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    shadowColor: '#357A8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },

  headerContent: {
    alignItems: 'center',
    marginTop: 12,
  },

  headerTitle: {
    fontSize: 26, // --text-2xl
    fontWeight: '600', // --font-semibold
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },

  headerSubtitle: {
    fontSize: 16, // --text-base
    fontWeight: '400', // --font-regular
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 24,
    textAlign: 'center',
  },

  infoContainer: {
    marginHorizontal: 24,
    marginTop: -20,
    marginBottom: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(53, 122, 138, 0.12)',
    shadowColor: '#357A8A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 4,
    gap: 14,
  },

  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A5F',
  },

  infoDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: '#0F172A',
  },

  infoMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  infoMetaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(91, 163, 184, 0.12)',
  },

  infoMetaText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1E3A5F',
  },

  infoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(194, 65, 12, 0.08)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },

  infoFooterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9A3412',
    letterSpacing: 0.2,
  },

  // Filter bar
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#F5F7FA', // --light-gray
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED', // --medium-gray
    gap: 8,
  },

  filterButton: {
    flex: 1,
    backgroundColor: '#FFFFFF', // --white
    borderRadius: 20, // --radius-xl
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1E8ED',
    shadowColor: '#5BA3B8',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },

  filterButtonActive: {
    backgroundColor: '#5BA3B8', // --primary-blue-teal
    borderColor: '#5BA3B8',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },

  filterText: {
    fontSize: 13, // --text-sm (slightly smaller)
    fontWeight: '500', // --font-medium
    color: '#64748B', // --text-gray
  },

  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '600', // --font-semibold
  },

  // Summaries list
  summariesList: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },

  summaryCard: {
    backgroundColor: '#FFFFFF', // --white
    borderRadius: 16, // --radius-lg
    padding: 24, // --space-3
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#5BA3B8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 3,
  },

  summaryHeader: {
    marginBottom: 16,
  },

  summaryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },

  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12, // --radius-md
  },

  typeBadgeSession: {
    backgroundColor: '#A8D5E8', // --primary-light
  },

  typeBadgeConsolidated: {
    backgroundColor: '#B5A7E6', // --lavender
  },

  typeBadgeText: {
    fontSize: 12, // --text-xs
    fontWeight: '600', // --font-semibold
  },

  typeBadgeTextSession: {
    color: '#357A8A', // --primary-dark
  },

  typeBadgeTextConsolidated: {
    color: '#5A4B8A',
  },

  summaryTitle: {
    fontSize: 18, // --text-lg
    fontWeight: '600', // --font-semibold
    color: '#1A2332', // --near-black
    flex: 1,
    lineHeight: 24,
  },

  summaryMeta: {
    flexDirection: 'row',
    gap: 16,
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  metaText: {
    fontSize: 12, // --text-xs
    color: '#64748B', // --text-gray
    fontWeight: '400',
  },

  summaryContent: {
    fontSize: 16, // --text-base
    fontWeight: '400', // --font-regular
    color: '#334155', // --dark-gray
    lineHeight: 28, // --leading-relaxed
    marginBottom: 12,
  },

  consolidatedInfo: {
    backgroundColor: 'rgba(181, 167, 230, 0.15)', // Lavender with transparency
    borderRadius: 8, // --radius-sm
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },

  consolidatedInfoText: {
    fontSize: 12, // --text-xs
    color: '#5A4B8A',
    fontWeight: '600', // --font-semibold
  },

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  emptyStateTitle: {
    fontSize: 22, // --text-xl
    fontWeight: '600', // --font-semibold
    color: '#334155', // --dark-gray
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },

  emptyStateText: {
    fontSize: 16, // --text-base
    fontWeight: '400', // --font-regular
    color: '#64748B', // --text-gray
    textAlign: 'center',
    lineHeight: 28, // --leading-relaxed
  },

  // Loading state
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  loadingText: {
    fontSize: 16, // --text-base
    fontWeight: '400', // --font-regular
    color: '#64748B', // --text-gray
  },
});