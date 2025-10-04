import { useState, useRef } from 'react';
import { Alert, Animated } from 'react-native';
import { sttService } from '../../services/sttService';
import { useDirectAudioLevels } from '../useDirectAudioLevels';

interface UseVoiceRecordingReturn {
  isRecording: boolean;
  isListening: boolean;
  isTranscribing: boolean;
  sttError: string | null;
  partialTranscript: string;
  audioLevel: number; // Single audio level instead of array
  frequencyData: number[]; // Real-time frequency spectrum data
  waveAnimations: Animated.Value[];
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  cancelRecording: () => Promise<void>;
  resetSoundWaves: () => void;
}

export const useVoiceRecording = (
  onTranscriptUpdate: (text: string) => void
): UseVoiceRecordingReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [sttError, setSttError] = useState<string | null>(null);
  const [partialTranscript, setPartialTranscript] = useState('');
  const [frequencyData, setFrequencyData] = useState<number[]>([]);

  // Use direct audio levels hook
  const { audioLevel, updateAudioLevel, resetLevel } = useDirectAudioLevels();

  // Audio level animations for real sound wave visualization
  const waveAnimations = useRef(
    Array.from({ length: 7 }, () => new Animated.Value(0.05))
  ).current;

  const startRecording = async () => {
    console.log('🎤 Starting recording...');
    
    if (!sttService.isSupported()) {
      console.log('STT not supported, showing alert');
      Alert.alert(
        'Not Supported',
        'Speech recognition is not supported on this device. Please type your message instead.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (isRecording) {
      console.log('Already recording, ignoring start request');
      return;
    }

    console.log('Starting STT recording...');
    setSttError(null);
    setPartialTranscript('');
    
    const success = await sttService.startRecognition(
      // On result
      (result) => {
        if (result.isFinal) {
          // Final result - update input text and clear transcribing state
          onTranscriptUpdate(result.transcript);
          setPartialTranscript('');
          setIsTranscribing(false);
        } else {
          // Partial result - show as preview
          setPartialTranscript(result.transcript);
        }
      },
      // On error
      (error) => {
        setSttError(error);
        setIsRecording(false);
        setIsListening(false);
        setIsTranscribing(false);
        setPartialTranscript('');
        Alert.alert('Speech Recognition Error', error, [{ text: 'OK' }]);
      },
      // On end
      () => {
        console.log('STT service ended - checking if should update UI');
        if (!isRecording) {
          console.log('Updating UI - recording ended');
          setIsListening(false);
          setIsTranscribing(false);
          setPartialTranscript('');
          resetSoundWaves();
        }
      },
      // On audio level - use direct STT metering
      (level, freqData) => {
        updateAudioLevel(level); // Pass normalized level (0-1) to direct audio levels hook
        // Use the incoming level directly for immediate wave updates
        updateSoundWaves(level);

        // Update frequency data for Skia waveform
        if (freqData && freqData.length > 0) {
          setFrequencyData(freqData);
        }

        // Debug logging for silence issue
        if (Math.random() < 0.02) { // 2% of the time
          console.log(`🎤 Voice recording: level=${level.toFixed(4)}, freqBands=${freqData?.length || 0}`);
        }
      }
    );

    if (success) {
      setIsRecording(true);
      setIsListening(true);
    }
  };

  const stopRecording = async () => {
    console.log('🛑 stopRecording called - current state:', isRecording);
    
    // Set transcribing state before stopping
    setIsTranscribing(true);
    setIsRecording(false);
    setIsListening(false);
    setPartialTranscript('');
    resetLevel(); // Reset direct audio level
    resetSoundWaves();
    
    // Always stop the service regardless of current state
    await sttService.stopRecognition();
    
    console.log('✅ Recording stopped and state reset');
  };

  const cancelRecording = async () => {
    console.log('🚫🚫🚫 CANCEL RECORDING CALLED - useVoiceRecording 🚫🚫🚫');
    console.log('Current state before cancel:', { isRecording, isListening, isTranscribing });

    // Reset UI state immediately
    setIsRecording(false);
    setIsListening(false);
    setIsTranscribing(false);
    setPartialTranscript('');
    setSttError(null);
    resetLevel(); // Reset direct audio level
    resetSoundWaves();

    try {
      // Then cleanup the service
      await sttService.cancelRecognition();
      console.log('✅ Recording cancelled successfully in useVoiceRecording');
    } catch (error) {
      console.error('❌ Error cancelling recording:', error);
      setSttError('Failed to cancel recording');
    }
  };

  // Update sound waves - simplified to just animate wave bars based on single audio level
  const updateSoundWaves = (currentAudioLevel: number) => {
    // Use the processed audio level from direct audio levels hook
    const baseLevel = Math.max(0.02, Math.min(1, currentAudioLevel));
    
    // Create minimal variation across bars for visual interest only
    const newLevels = Array.from({ length: 7 }, (_, i) => {
      if (baseLevel < 0.05) {
        // True silence - all bars very low
        return 0.02;
      } else {
        // During speech, minimal natural variation (±10%)
        const variation = (Math.random() - 0.5) * 0.1;
        return Math.max(0.02, Math.min(1, baseLevel + variation));
      }
    });
    
    // Animate all bars with very fast response for continuous movement
    newLevels.forEach((targetLevel, index) => {
      Animated.timing(waveAnimations[index], {
        toValue: targetLevel,
        duration: 100, // Fast but smooth animation
        useNativeDriver: false,
      }).start();
    });
  };

  const resetSoundWaves = () => {
    // Reset all animations to true baseline for silence
    waveAnimations.forEach(anim => {
      Animated.timing(anim, {
        toValue: 0.02, // True silence baseline
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
  };

  return {
    isRecording,
    isListening,
    isTranscribing,
    sttError,
    partialTranscript,
    audioLevel, // Return single audio level instead of array
    frequencyData, // Return real-time frequency spectrum
    waveAnimations,
    startRecording,
    stopRecording,
    cancelRecording,
    resetSoundWaves,
  };
};

export default useVoiceRecording;