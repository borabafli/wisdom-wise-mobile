import { StyleSheet } from 'react-native';
import { spacing } from '../tokens';

export const soundWaveStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[1],
    width: '100%',
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    height: 32,
    width: '100%',
    paddingHorizontal: spacing[2],
  },
  waveBar: {
    flex: 1,
    maxWidth: 2,
    backgroundColor: '#3b82f6',
    borderRadius: 1,
    minHeight: 3,
  },
});