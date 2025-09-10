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
    gap: 2, // Increased gap for better visual separation
    height: 36, // Slightly taller for better visibility
    width: '100%',
    paddingHorizontal: spacing[3],
  },
  waveBar: {
    flex: 1,
    maxWidth: 3, // Slightly wider bars
    backgroundColor: '#06B6D4', // Cyan color for better visibility
    borderRadius: 1.5, // More rounded for smoother appearance
    minHeight: 2,
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2, // Android shadow
  },
});