import { useState, useCallback, useRef } from 'react';

interface UseDirectAudioLevelsReturn {
  audioLevel: number;
  updateAudioLevel: (level: number) => void;
  resetLevel: () => void;
}

/**
 * Direct audio level hook that preserves raw STT metering data
 * without artificial processing or smoothing
 */
export const useDirectAudioLevels = (): UseDirectAudioLevelsReturn => {
  const [audioLevel, setAudioLevel] = useState<number>(0);
  
  // Pass through normalized audio levels (0-1) with increased sensitivity
  const updateAudioLevel = useCallback((level: number) => {
    // Input is already normalized amplitude (0-1), apply sensitivity boost
    let amplitude = Math.max(0, Math.min(1, level));
    
    // Smart sensitivity: boost quiet sounds, compress loud sounds
    if (amplitude > 0.005) {
      if (amplitude < 0.3) {
        // Boost quiet sounds dramatically
        amplitude = Math.min(0.7, Math.pow(amplitude, 0.3) * 1.5);
      } else {
        // Compress loud sounds to prevent hitting maximum
        amplitude = 0.7 + (amplitude - 0.3) * 0.3; // Gentle compression for loud sounds
      }
    }
    
    // Update state immediately - no processing needed
    setAudioLevel(amplitude);
    
    // Debug logging (occasionally)
    if (Math.random() < 0.01) { // 1% of the time
      console.log(`🎵 Direct audio: level=${level.toFixed(4)}, amplitude=${amplitude.toFixed(4)}`);
    }
    
  }, []);
  
  // Reset to zero
  const resetLevel = useCallback(() => {
    setAudioLevel(0);
  }, []);
  
  return {
    audioLevel,
    updateAudioLevel,
    resetLevel,
  };
};

export default useDirectAudioLevels;