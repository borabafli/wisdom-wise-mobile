import { useState, useRef } from 'react';
import { Alert, Animated } from 'react-native';
import { sttService } from '../../services/sttService';

interface UseVoiceRecordingReturn {
  isRecording: boolean;
  isListening: boolean;
  sttError: string | null;
  partialTranscript: string;
  audioLevels: number[];
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
  const [sttError, setSttError] = useState<string | null>(null);
  const [partialTranscript, setPartialTranscript] = useState('');
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(7).fill(0.3));

  // Audio level animations for real sound wave visualization
  const waveAnimations = useRef(
    Array.from({ length: 7 }, () => new Animated.Value(0.3))
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
          // Final result - update input text
          onTranscriptUpdate(result.transcript);
          setPartialTranscript('');
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
        setPartialTranscript('');
        Alert.alert('Speech Recognition Error', error, [{ text: 'OK' }]);
      },
      // On end
      () => {
        console.log('STT service ended - checking if should update UI');
        if (!isRecording) {
          console.log('Updating UI - recording ended');
          setIsListening(false);
          setPartialTranscript('');
          resetSoundWaves();
        }
      },
      // On audio level
      (level, frequencyData) => {
        updateSoundWaves(level, frequencyData);
      }
    );

    if (success) {
      setIsRecording(true);
      setIsListening(true);
    }
  };

  const stopRecording = async () => {
    console.log('🛑 stopRecording called - current state:', isRecording);
    // Always stop the service regardless of current state
    await sttService.stopRecognition();
    // Reset all recording-related states
    setIsRecording(false);
    setIsListening(false);
    setPartialTranscript('');
    setSttError(null);
    resetSoundWaves();
    console.log('✅ Recording stopped and state reset');
  };

  const cancelRecording = async () => {
    console.log('Cancelling recording...');
    try {
      await sttService.cancelRecognition();
      setIsRecording(false);
      setIsListening(false);
      setPartialTranscript('');
      setSttError(null);
      resetSoundWaves();
      console.log('Recording cancelled successfully');
    } catch (error) {
      console.error('Error cancelling recording:', error);
      setSttError('Failed to cancel recording');
    }
  };

  // Update sound waves based on real frequency spectrum data
  const updateSoundWaves = (audioLevel: number, frequencyData?: number[]) => {
    if (frequencyData && frequencyData.length >= 7) {
      // Use real frequency data for each bar - animate smoothly to new values
      frequencyData.forEach((level, index) => {
        if (index < waveAnimations.length) {
          const targetHeight = Math.max(0.3, Math.min(1, level));
          
          // Animate to the new frequency level with smooth transition
          Animated.timing(waveAnimations[index], {
            toValue: targetHeight,
            duration: 80, // Fast response for real-time feel
            useNativeDriver: false,
          }).start();
        }
      });
      
      // Also update state for immediate rendering (fallback)
      setAudioLevels(frequencyData.map(level => Math.max(0.3, Math.min(1, level))));
    } else {
      // Fallback to single level distributed across bars with animation
      const baseLevel = Math.max(0.3, Math.min(1, audioLevel));
      const newLevels = Array.from({ length: 7 }, (_, i) => {
        // Create dynamic variation for organic feel
        const timeOffset = Date.now() / 200 + i;
        const variation = Math.sin(timeOffset) * 0.15 + (Math.random() - 0.5) * 0.1;
        return Math.max(0.3, Math.min(1, baseLevel + variation));
      });
      
      // Animate all bars
      newLevels.forEach((targetLevel, index) => {
        Animated.timing(waveAnimations[index], {
          toValue: targetLevel,
          duration: 80,
          useNativeDriver: false,
        }).start();
      });
      
      setAudioLevels(newLevels);
    }
  };

  const resetSoundWaves = () => {
    // Reset all animations to baseline
    waveAnimations.forEach(anim => {
      Animated.timing(anim, {
        toValue: 0.3,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
    
    setAudioLevels(Array(7).fill(0.3));
  };

  return {
    isRecording,
    isListening,
    sttError,
    partialTranscript,
    audioLevels,
    waveAnimations,
    startRecording,
    stopRecording,
    cancelRecording,
    resetSoundWaves,
  };
};

export default useVoiceRecording;