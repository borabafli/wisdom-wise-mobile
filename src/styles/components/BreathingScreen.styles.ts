/**
 * BreathingScreen Component Styles
 * Breathing exercise interface with animation and controls
 */

import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, shadows } from '../tokens';

const { width } = Dimensions.get('window');

export const breathingScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[20],
    paddingTop: spacing[12],
    paddingBottom: spacing[8],
  },
  backButton: {
    padding: spacing[12],
    backgroundColor: colors.white,
    borderRadius: 12,
    ...shadows.small,
  },
  settingsButton: {
    padding: spacing[12],
    backgroundColor: colors.white,
    borderRadius: 12,
    ...shadows.small,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[20],
  },
  exerciseInfo: {
    alignItems: 'center',
    marginBottom: spacing[40],
  },
  exerciseTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing[8],
  },
  exerciseDescription: {
    fontSize: typography.fontSize.base,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.8,
  },
  breathingCircle: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[40],
  },
  breathingInstructions: {
    position: 'absolute',
    alignItems: 'center',
  },
  phaseText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.white,
    marginBottom: spacing[8],
  },
  countText: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[20],
    marginBottom: spacing[20],
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  progressInfo: {
    alignItems: 'center',
  },
  cycleText: {
    fontSize: typography.fontSize.base,
    color: colors.white,
    opacity: 0.8,
  },
  progressBar: {
    width: width * 0.6,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    marginTop: spacing[8],
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: 2,
  },
  settingsModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  settingsContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing[20],
    maxHeight: '80%',
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[20],
  },
  settingsTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
  },
  closeButton: {
    padding: spacing[8],
  },
  presetCard: {
    backgroundColor: colors.neutral[50],
    borderRadius: 12,
    padding: spacing[16],
    marginBottom: spacing[12],
    borderWidth: 2,
    borderColor: 'transparent',
  },
  presetCardSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  presetName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[800],
    marginBottom: spacing[4],
  },
  presetPattern: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[600],
    marginBottom: spacing[4],
  },
  presetDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[500],
  },
  customSection: {
    marginTop: spacing[20],
  },
  customTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[800],
    marginBottom: spacing[16],
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[12],
  },
  inputLabel: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.neutral[700],
  },
  input: {
    backgroundColor: colors.neutral[100],
    borderRadius: 8,
    padding: spacing[12],
    fontSize: typography.fontSize.base,
    color: colors.neutral[800],
    textAlign: 'center',
    minWidth: 60,
  },
  applyButton: {
    backgroundColor: colors.primary[500],
    borderRadius: 12,
    padding: spacing[16],
    alignItems: 'center',
    marginTop: spacing[20],
  },
  applyButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.white,
  },
});