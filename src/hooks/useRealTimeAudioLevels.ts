import { useState, useCallback, useRef, useEffect } from 'react';

interface UseRealTimeAudioLevelsReturn {
  audioLevels: number[];
  updateAudioLevel: (dbLevel: number) => void;
  resetLevels: () => void;
}

export const useRealTimeAudioLevels = (): UseRealTimeAudioLevelsReturn => {
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(7).fill(0));
  
  // Convert dB to amplitude and generate visualization bands
  const updateAudioLevel = useCallback((dbLevel: number) => {
    // Convert Expo Audio metering (-160 to 0 dB) to normalized amplitude
    let amplitude: number;
    
    if (dbLevel <= -80) {
      // True silence - return actual zero
      amplitude = 0;
    } else {
      // Convert dB to linear amplitude (0 to 1)
      // Focus on the useful range: -80dB to 0dB
      const clampedDb = Math.max(-80, Math.min(0, dbLevel));
      amplitude = Math.pow(10, clampedDb / 20); // dB to linear conversion
      
      // Scale to a more usable range for visualization
      amplitude = Math.min(1.0, amplitude * 8); // Amplify for better visual response
    }
    
    // Generate 7-band visualization from single amplitude
    const visualBands = generateVisualizationBands(amplitude);
    
    // Update state
    setAudioLevels(visualBands);
    
    // Debug logging (occasionally)
    if (Math.random() < 0.02) { // 2% of the time
      console.log(`🎵 Real-time audio: dB=${dbLevel.toFixed(1)}, amplitude=${amplitude.toFixed(4)}, bands=[${visualBands.map(b => b.toFixed(2)).join(',')}]`);
    }
    
  }, []);
  
  // Reset to true zero
  const resetLevels = useCallback(() => {
    const zeroLevels = Array(7).fill(0);
    setAudioLevels(zeroLevels);
  }, []);
  
  // Generate 7-band visualization from single amplitude value
  const generateVisualizationBands = useCallback((amplitude: number): number[] => {
    const bands: number[] = [];
    
    // If truly silent, return all zeros
    if (amplitude === 0) {
      return Array(7).fill(0);
    }
    
    // Create variation across bands while preserving immediate response
    for (let i = 0; i < 7; i++) {
      // Slight frequency-like distribution (lower frequencies get more energy)
      const frequencyWeight = Math.pow(0.92, i);
      
      // Small random variation for visual interest (but minimal)
      const variation = 0.9 + (Math.random() * 0.2); // 0.9 to 1.1
      
      let bandLevel = amplitude * frequencyWeight * variation;
      
      // Ensure we stay within bounds
      bands.push(Math.max(0, Math.min(1.0, bandLevel)));
    }
    
    return bands;
  }, []);
  
  return {
    audioLevels,
    updateAudioLevel,
    resetLevels,
  };
};

export default useRealTimeAudioLevels;