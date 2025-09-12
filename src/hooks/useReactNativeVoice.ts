import { useState, useEffect, useCallback, useRef } from 'react';
import Voice from '@react-native-voice/voice';

interface UseReactNativeVoiceReturn {
  isRecording: boolean;
  audioLevels: number[];
  transcriptResult: string;
  partialTranscript: string;
  error: string | null;
  startVoiceRecording: () => Promise<void>;
  stopVoiceRecording: () => Promise<void>;
  cancelVoiceRecording: () => Promise<void>;
}

export const useReactNativeVoice = (
  onFinalTranscript?: (transcript: string) => void
): UseReactNativeVoiceReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(7).fill(0));
  const [transcriptResult, setTranscriptResult] = useState('');
  const [partialTranscript, setPartialTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Initialize Voice events
  useEffect(() => {
    // Speech recognition events
    Voice.onSpeechStart = () => {
      console.log('🎤 Speech recognition started');
      setIsRecording(true);
      setError(null);
    };
    
    Voice.onSpeechEnd = () => {
      console.log('🛑 Speech recognition ended');
      setIsRecording(false);
      // Clear audio levels
      setAudioLevels(Array(7).fill(0));
    };
    
    Voice.onSpeechResults = (event: any) => {
      console.log('✅ Final speech result:', event.value);
      if (event.value && event.value.length > 0) {
        const finalResult = event.value[0];
        setTranscriptResult(finalResult);
        if (onFinalTranscript) {
          onFinalTranscript(finalResult);
        }
      }
      setPartialTranscript('');
    };
    
    Voice.onSpeechPartialResults = (event: any) => {
      console.log('📝 Partial speech result:', event.value);
      if (event.value && event.value.length > 0) {
        setPartialTranscript(event.value[0]);
      }
    };
    
    Voice.onSpeechError = (event: any) => {
      console.error('❌ Speech recognition error:', event.error);
      setError(event.error?.message || 'Speech recognition error');
      setIsRecording(false);
      setAudioLevels(Array(7).fill(0));
    };
    
    // 🔥 THIS IS THE KEY - Real-time volume levels!
    Voice.onSpeechVolumeChanged = (event: any) => {
      // event.value is the raw volume level (0-1)
      const volumeLevel = event.value || 0;
      
      // Convert to true amplitude (no artificial floor)
      const amplitude = volumeLevel < 0.001 ? 0 : volumeLevel;
      
      // Generate 7-band visualization from volume
      const visualBands = generateVisualizationBands(amplitude);
      
      // Update audio levels immediately
      setAudioLevels(visualBands);
      
      // Debug logging (occasionally)
      if (Math.random() < 0.05) { // 5% of the time
        console.log(`🔊 RN Voice volume: ${volumeLevel.toFixed(4)} → bands=[${visualBands.map(b => b.toFixed(2)).join(',')}]`);
      }
    };
    
    return () => {
      // Cleanup
      Voice.destroy().then(() => {
        console.log('🧹 React Native Voice destroyed');
      });
    };
  }, [onFinalTranscript]);
  
  const startVoiceRecording = useCallback(async () => {
    try {
      setError(null);
      setTranscriptResult('');
      setPartialTranscript('');
      
      console.log('🎤 Starting React Native Voice recording...');
      
      await Voice.start('en-US', {
        RECOGNIZER_ENGINE: 'googleRecognizer',
        EXTRA_PARTIAL_RESULTS: true,
        EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 5000,
        EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS: 5000,
      });
      
      console.log('✅ React Native Voice recording started');
      
    } catch (err: any) {
      console.error('❌ Error starting voice recording:', err);
      setError(err.message || 'Failed to start voice recording');
      setIsRecording(false);
    }
  }, []);
  
  const stopVoiceRecording = useCallback(async () => {
    try {
      console.log('🛑 Stopping React Native Voice recording...');
      await Voice.stop();
      console.log('✅ Voice recording stopped');
    } catch (err: any) {
      console.error('❌ Error stopping voice recording:', err);
      setError(err.message || 'Failed to stop voice recording');
    }
  }, []);
  
  const cancelVoiceRecording = useCallback(async () => {
    try {
      console.log('🚫 Cancelling React Native Voice recording...');
      await Voice.cancel();
      setTranscriptResult('');
      setPartialTranscript('');
      setAudioLevels(Array(7).fill(0));
      console.log('✅ Voice recording cancelled');
    } catch (err: any) {
      console.error('❌ Error cancelling voice recording:', err);
      setError(err.message || 'Failed to cancel voice recording');
    }
  }, []);
  
  // Generate 7-band visualization from single volume level
  const generateVisualizationBands = useCallback((volume: number): number[] => {
    const bands: number[] = [];
    
    // If truly silent, return all zeros
    if (volume === 0) {
      return Array(7).fill(0);
    }
    
    // Create variation across bands while preserving immediate response
    for (let i = 0; i < 7; i++) {
      // Slight frequency-like distribution (lower frequencies get more energy)
      const frequencyWeight = Math.pow(0.91, i);
      
      // Small random variation for visual interest
      const variation = 0.88 + (Math.random() * 0.24); // 0.88 to 1.12
      
      let bandLevel = volume * frequencyWeight * variation;
      
      // Ensure we stay within bounds
      bands.push(Math.max(0, Math.min(1.0, bandLevel)));
    }
    
    return bands;
  }, []);
  
  return {
    isRecording,
    audioLevels,
    transcriptResult,
    partialTranscript,
    error,
    startVoiceRecording,
    stopVoiceRecording,
    cancelVoiceRecording,
  };
};

export default useReactNativeVoice;