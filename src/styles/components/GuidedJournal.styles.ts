import { StyleSheet, Dimensions } from 'react-native';
import { spacing, colors } from '../tokens';

const { width, height } = Dimensions.get('window');

export const guidedJournalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },

  backgroundSolid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },

  keyboardView: {
    flex: 1,
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

  backButton: {
    padding: spacing[8],
  },

  headerTitle: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 16,
    fontWeight: '600',
    color: '#2B475E', // Dark blue color
    textAlign: 'center',
    flex: 1,
  },

  stepIndicator: {
    backgroundColor: '#2B475E',
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[4],
    borderRadius: 8,
  },

  stepText: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  scrollView: {
    flex: 1,
    paddingHorizontal: spacing[12],
  },

  promptContainer: {
    marginTop: spacing[8],
    marginBottom: spacing[12],
    paddingHorizontal: spacing[4],
  },

  promptHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  promptText: {
    flex: 1,
    fontFamily: 'Ubuntu-Medium',
    fontSize: 18,
    lineHeight: 26,
    color: '#2B475E', // Dark blue
    textAlign: 'center',
    fontWeight: '500',
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
    marginBottom: spacing[8],
    borderWidth: 1,
    borderColor: '#2B475E',
    marginHorizontal: spacing[4],
  },

  transcribingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing[12],
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[20],
    paddingVertical: spacing[14],
    minHeight: 96,
  },

  textInput: {
    flex: 1,
    fontFamily: 'Ubuntu-Regular',
    fontSize: 16,
    lineHeight: 24,
    color: '#2B475E',
    textAlignVertical: 'top',
    minHeight: 60,
    maxHeight: 150,
    paddingVertical: spacing[4],
  },

  inputButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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

  // Recording Interface - Improved layout
  recordingInterfaceWithTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    paddingVertical: 0,
    height: 96,
  },
  recordingButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    height: '100%',
    paddingVertical: 0,
    flexShrink: 0,
  },
  waveContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing[10],
  },

  recordingCancelButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(148, 163, 184, 0.9)',
    zIndex: 30,
    marginLeft: -spacing[8],
    transform: [{ translateY: 12 }],
  },

  waveWithTimerInside: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: spacing[8],
  },

  submitRecordingButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2B475E',
    zIndex: 30,
    marginRight: -spacing[8],
    transform: [{ translateY: 12 }],
  },

  previousEntriesContainer: {
    marginBottom: spacing[20],
  },

  previousEntriesTitle: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 14,
    color: '#2B475E',
    marginBottom: spacing[8],
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  previousEntry: {
    borderRadius: 16,
    paddingVertical: spacing[10],
    paddingHorizontal: spacing[12],
    marginBottom: spacing[10],
    backgroundColor: 'rgba(41, 69, 98, 0.18)',
  },

  previousPrompt: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 13.5,
    color: '#2B475E',
    marginBottom: spacing[4],
    fontWeight: '600',
  },

  previousResponse: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 13,
    lineHeight: 18,
    color: '#2B475E',
  },

  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the continue button
    paddingHorizontal: spacing[16],
    paddingVertical: spacing[8],
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    minHeight: 50,
  },


  compactNextButtonContainer: {
    borderRadius: 8,
    alignSelf: 'center',
  },

  compactNextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[12],
    borderRadius: 8,
    gap: spacing[3],
  },

  compactNextButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },

  compactNextButtonText: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 13.5,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  scrollableContinueButtonContainer: {
    alignItems: 'center',
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[6],
    marginTop: spacing[4],
    marginBottom: spacing[4],
  },

  loadingTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  continueButtonIcon: {
    width: 82,
    height: 82,
    marginTop: spacing[18],
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

  // Save Modal Styles - Compact version matching app button styles
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
    padding: spacing[20],
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  saveModalTitle: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 17,
    fontWeight: '600',
    color: '#2B475E',
    marginBottom: spacing[20],
    textAlign: 'center',
  },

  saveModalButton: {
    backgroundColor: '#36657D',
    height: 48,
    paddingHorizontal: spacing[20],
    borderRadius: 16,
    width: '100%',
    marginBottom: spacing[10],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  dontSaveButton: {
    backgroundColor: '#d28686',
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
    marginTop: spacing[6],
  },

  cancelButtonText: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
