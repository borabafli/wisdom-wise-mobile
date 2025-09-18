import { StyleSheet, Dimensions } from 'react-native';
import { spacing } from '../tokens';

const { width } = Dimensions.get('window');

export const journalSummaryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D2B48C', // Matching earthy background
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[20],
    paddingVertical: spacing[16],
    backgroundColor: '#C19A6B',
    borderBottomWidth: 1,
    borderBottomColor: '#B8956B',
  },

  headerTitle: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 18,
    fontWeight: '600',
    color: '#5D4E37',
    flex: 1,
    textAlign: 'center',
  },

  closeButton: {
    padding: spacing[8],
  },

  scrollView: {
    flex: 1,
    paddingHorizontal: spacing[20],
  },

  summaryCard: {
    marginVertical: spacing[24],
    borderRadius: 20,
    padding: spacing[24],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 115, 85, 0.2)',
  },

  summaryHeader: {
    alignItems: 'center',
    marginBottom: spacing[20],
  },

  summaryTitle: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5D4E37',
    textAlign: 'center',
  },

  summaryText: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 16,
    lineHeight: 24,
    color: '#5D4E37',
    textAlign: 'left',
    marginBottom: spacing[20],
  },

  insightsContainer: {
    marginTop: spacing[16],
    paddingTop: spacing[16],
    borderTopWidth: 1,
    borderTopColor: 'rgba(139, 115, 85, 0.3)',
  },

  insightsTitle: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 16,
    fontWeight: '600',
    color: '#5D4E37',
    marginBottom: spacing[12],
  },

  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[8],
  },

  insightBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#065F46',
    marginTop: 8,
    marginRight: spacing[12],
  },

  insightText: {
    flex: 1,
    fontFamily: 'Ubuntu-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#6B5B47',
    fontStyle: 'italic',
  },

  saveOptionsContainer: {
    paddingVertical: spacing[20],
  },

  saveOptionsTitle: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 18,
    fontWeight: '600',
    color: '#5D4E37',
    textAlign: 'center',
    marginBottom: spacing[24],
  },

  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#065F46',
    paddingVertical: spacing[16],
    paddingHorizontal: spacing[24],
    borderRadius: 16,
    marginBottom: spacing[16],
    gap: spacing[8],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  saveButtonText: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  saveAndPolishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7C2D12', // Darker brown/orange for polish option
    paddingVertical: spacing[16],
    paddingHorizontal: spacing[24],
    borderRadius: 16,
    marginBottom: spacing[12],
    gap: spacing[8],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  saveAndPolishButtonText: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  polishDescription: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 12,
    color: '#6B5B47',
    textAlign: 'center',
    lineHeight: 16,
    fontStyle: 'italic',
    paddingHorizontal: spacing[12],
  },
});