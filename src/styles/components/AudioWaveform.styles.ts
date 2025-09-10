import { StyleSheet } from 'react-native';
import { colors, spacing, shadows } from '../tokens';

export const audioWaveformStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  waveformContainer: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: spacing.md,
    ...shadows.card,
  },
  
  recordingContainer: {
    backgroundColor: colors.background.glass,
    borderRadius: 20,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.teal[400] + '20',
    ...shadows.elevated,
  },
  
  circularContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.card + '80',
    borderRadius: 100,
    padding: spacing.md,
  },
  
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.semantic.error,
  },
  
  recordingText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontFamily: 'Inter-Medium',
  },
  
  levelIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  
  levelBar: {
    height: 3,
    backgroundColor: colors.teal[400] + '40',
    borderRadius: 2,
  },
  
  levelBarActive: {
    backgroundColor: colors.teal[400],
  },
  
  visualizerTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  
  // Variants
  compact: {
    padding: spacing.sm,
    borderRadius: 12,
  },
  
  fullWidth: {
    width: '100%',
  },
  
  floating: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.background.glass,
    backdropFilter: 'blur(20px)',
    borderRadius: 20,
  },
  
  // Animation states
  idle: {
    opacity: 0.6,
  },
  
  active: {
    opacity: 1,
    transform: [{ scale: 1.02 }],
  },
  
  // Therapeutic theme variants
  calmWave: {
    backgroundColor: colors.green[400] + '10',
    borderColor: colors.green[400] + '30',
  },
  
  energeticWave: {
    backgroundColor: colors.orange[400] + '10',
    borderColor: colors.orange[400] + '30',
  },
  
  focusedWave: {
    backgroundColor: colors.teal[400] + '10',
    borderColor: colors.teal[400] + '30',
  },
});