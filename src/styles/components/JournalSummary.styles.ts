import { StyleSheet, Dimensions } from 'react-native';
import { spacing } from '../tokens';

const { width } = Dimensions.get('window');

export const journalSummaryStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeAreaWrapper: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[2],
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },

  headerTitle: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 16,
    fontWeight: '600',
    color: '#2B475E',
    flex: 1,
    textAlign: 'center',
  },

  closeButton: {
    padding: spacing[8],
  },

  scrollView: {
    flex: 1,
    paddingHorizontal: spacing[12],
  },

  summaryCard: {
    marginVertical: spacing[16],
    borderRadius: 20,
    padding: spacing[16],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#2B475E',
  },

  summaryHeader: {
    alignItems: 'center',
    marginBottom: spacing[12],
  },

  summaryTitle: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2B475E',
    textAlign: 'center',
  },

  summaryText: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 16,
    lineHeight: 24,
    color: '#2B475E',
    textAlign: 'left',
    marginBottom: spacing[12],
  },

  insightsContainer: {
    marginTop: spacing[12],
    paddingTop: spacing[12],
    borderTopWidth: 1,
    borderTopColor: 'rgba(43, 71, 94, 0.3)',
  },

  insightsTitle: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 16,
    fontWeight: '600',
    color: '#2B475E',
    marginBottom: spacing[8],
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
    backgroundColor: '#2B475E',
    marginTop: 8,
    marginRight: spacing[12],
  },

  insightText: {
    flex: 1,
    fontFamily: 'Ubuntu-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#2B475E',
    fontStyle: 'italic',
  },

  saveOptionsContainer: {
    paddingVertical: spacing[12],
  },

  saveOptionsTitle: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 18,
    fontWeight: '600',
    color: '#2B475E',
    textAlign: 'center',
    marginBottom: spacing[16],
  },

  saveButtonContainer: {
    borderRadius: 16,
    marginBottom: spacing[12],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[12],
    paddingHorizontal: spacing[16],
    borderRadius: 16,
    gap: spacing[6],
  },

  saveButtonText: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  saveAndPolishButtonContainer: {
    borderRadius: 16,
    marginBottom: spacing[8],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  saveAndPolishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[12],
    paddingHorizontal: spacing[16],
    borderRadius: 16,
    gap: spacing[6],
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
    color: 'rgba(43, 71, 94, 0.8)',
    textAlign: 'center',
    lineHeight: 16,
    fontStyle: 'italic',
    paddingHorizontal: spacing[8],
    marginTop: spacing[4],
  },
});