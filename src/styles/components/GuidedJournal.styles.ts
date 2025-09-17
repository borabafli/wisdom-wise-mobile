import { StyleSheet, Dimensions } from 'react-native';
import { spacing } from '../tokens';

const { width, height } = Dimensions.get('window');

export const guidedJournalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D2B48C', // Light brown, earthy background
  },

  keyboardView: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[20],
    paddingVertical: spacing[16],
    backgroundColor: '#C19A6B', // Slightly darker brown for header
    borderBottomWidth: 1,
    borderBottomColor: '#B8956B',
  },

  backButton: {
    padding: spacing[8],
  },

  headerTitle: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 18,
    fontWeight: '600',
    color: '#5D4E37', // Dark brown
    textAlign: 'center',
    flex: 1,
  },

  stepIndicator: {
    backgroundColor: '#8B7355',
    paddingHorizontal: spacing[12],
    paddingVertical: spacing[6],
    borderRadius: 12,
  },

  stepText: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  scrollView: {
    flex: 1,
    paddingHorizontal: spacing[20],
  },

  promptContainer: {
    marginVertical: spacing[24],
    padding: spacing[20],
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 115, 85, 0.2)',
  },

  promptHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  promptText: {
    flex: 1,
    fontFamily: 'Ubuntu-Regular',
    fontSize: 18,
    lineHeight: 26,
    color: '#5D4E37', // Dark brown
    textAlign: 'left',
    fontWeight: '500',
    marginRight: spacing[12],
  },

  ttsButton: {
    padding: spacing[4],
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing[2],
  },

  ttsAnimationContainer: {
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    marginVertical: spacing[12],
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[16],
  },

  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    marginBottom: spacing[20],
    borderWidth: 1,
    borderColor: 'rgba(139, 115, 85, 0.3)',
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing[16],
    paddingVertical: spacing[12],
    minHeight: 56,
  },

  textInput: {
    flex: 1,
    fontFamily: 'Ubuntu-Regular',
    fontSize: 16,
    lineHeight: 24,
    color: '#5D4E37',
    textAlignVertical: 'top',
    minHeight: 40,
    maxHeight: 120,
    paddingVertical: 0,
  },

  inputButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing[8],
  },

  micButton: {
    padding: spacing[2],
    borderRadius: 20,
    backgroundColor: 'transparent',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Recording Interface - Exactly like chat
  recordingInterfaceWithTimer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flex: 1,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    minHeight: 48,
  },

  cancelButton: {
    width: 42,
    height: 42,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    marginHorizontal: spacing[3],
  },

  waveWithTimerInside: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing[3],
    flexDirection: 'column',
    marginTop: 6,
  },

  submitRecordingButton: {
    width: 42,
    height: 42,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#065F46',
    marginHorizontal: spacing[3],
  },

  previousEntriesContainer: {
    marginBottom: spacing[20],
  },

  previousEntriesTitle: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 14,
    color: '#5D4E37',
    marginBottom: spacing[12],
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  previousEntry: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: spacing[16],
    marginBottom: spacing[12],
    borderWidth: 1,
    borderColor: 'rgba(139, 115, 85, 0.2)',
  },

  previousPrompt: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 14,
    color: '#5D4E37',
    marginBottom: spacing[8],
    fontWeight: '600',
  },

  previousResponse: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#6B5B47',
    fontStyle: 'italic',
  },

  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the continue button
    paddingHorizontal: spacing[20],
    paddingVertical: spacing[16],
    backgroundColor: '#C19A6B', // Same as header
    borderTopWidth: 1,
    borderTopColor: '#B8956B',
    minHeight: 80, // Same as header
  },


  compactNextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#065F46',
    paddingVertical: spacing[8],
    paddingHorizontal: spacing[16],
    borderRadius: 12,
    gap: spacing[4],
    minWidth: 90,
  },

  compactNextButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },

  compactNextButtonText: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Legacy styles (keeping for compatibility)
  bottomContainer: {
    padding: spacing[20],
    backgroundColor: '#C19A6B',
    borderTopWidth: 1,
    borderTopColor: '#B8956B',
  },

  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#065F46',
    paddingVertical: spacing[16],
    paddingHorizontal: spacing[24],
    borderRadius: 16,
    gap: spacing[8],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  nextButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },

  nextButtonText: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },

  // Save Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[20],
  },

  saveModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing[24],
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  saveModalTitle: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: spacing[24],
    textAlign: 'center',
  },

  saveModalButton: {
    backgroundColor: '#065F46',
    paddingVertical: spacing[12],
    paddingHorizontal: spacing[24],
    borderRadius: 12,
    width: '100%',
    marginBottom: spacing[12],
    alignItems: 'center',
  },

  dontSaveButton: {
    backgroundColor: '#DC2626',
  },

  saveModalButtonText: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  dontSaveButtonText: {
    color: '#FFFFFF',
  },

  cancelButton: {
    paddingVertical: spacing[8],
    paddingHorizontal: spacing[16],
    marginTop: spacing[8],
  },

  cancelButtonText: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});