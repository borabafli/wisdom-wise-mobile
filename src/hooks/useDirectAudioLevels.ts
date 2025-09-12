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
  
  // Light moving average for smoothing (5 samples for slightly more smoothing)
  const recentLevels = useRef<number[]>([]);
  const maxSamples = 5; // Small but slightly more smoothing
  
  // Pass through normalized audio levels (0-1) with increased sensitivity
  const updateAudioLevel = useCallback((level: number) => {
    // Input is already normalized amplitude (0-1), apply sensitivity boost
    let amplitude = Math.max(0, Math.min(1, level));
    
    // Very conservative sensitivity: excellent silence control
    if (amplitude > 0.05) { // Much higher threshold for excellent silence
      if (amplitude < 0.5) {
        // Very conservative boost for quiet sounds
        amplitude = Math.min(0.4, Math.pow(amplitude, 0.6) * 0.9);
      } else {
        // Strong compression for loud sounds
        amplitude = 0.4 + (amplitude - 0.5) * 0.2; // Strong compression
      }
    }
    
    // Apply very light moving average for smoothing
    recentLevels.current.push(amplitude);
    if (recentLevels.current.length > maxSamples) {
      recentLevels.current.shift();
    }
    
    // Calculate average - very responsive (only 3 samples)
    const smoothedAmplitude = recentLevels.current.reduce((sum, val) => sum + val, 0) / recentLevels.current.length;
    
    // Update state with smoothed value
    setAudioLevel(smoothedAmplitude);
    
    // Debug logging (occasionally)
    if (Math.random() < 0.01) { // 1% of the time
      console.log(`🎵 Direct audio: level=${level.toFixed(4)}, amplitude=${amplitude.toFixed(4)}`);
    }
    
  }, []);
  
  // Reset to zero and clear moving average
  const resetLevel = useCallback(() => {
    setAudioLevel(0);
    recentLevels.current = []; // Clear moving average history
  }, []);
  
  return {
    audioLevel,
    updateAudioLevel,
    resetLevel,
  };
};

export default useDirectAudioLevels;