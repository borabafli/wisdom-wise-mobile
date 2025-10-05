import { useState, useRef } from 'react';
import { Alert } from 'react-native';
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
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  cancelRecording: () => Promise<void>;
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

  // Throttle audio level updates to prevent excessive re-renders
  const lastAudioUpdateTime = useRef(0);
  const AUDIO_UPDATE_THROTTLE = 50; // ms - 20 updates/sec for better reactivity

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
        }
      },
      // On audio level - use direct STT metering with throttling
      (level, freqData) => {
        // Throttle audioLevel updates to prevent excessive re-renders during consistent talking
        const now = Date.now();
        if (now - lastAudioUpdateTime.current >= AUDIO_UPDATE_THROTTLE) {
          updateAudioLevel(level); // Pass normalized level (0-1) to direct audio levels hook
          lastAudioUpdateTime.current = now;
        }

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
    lastAudioUpdateTime.current = 0; // Reset throttle timer

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
    lastAudioUpdateTime.current = 0; // Reset throttle timer

    try {
      // Then cleanup the service
      await sttService.cancelRecognition();
      console.log('✅ Recording cancelled successfully in useVoiceRecording');
    } catch (error) {
      console.error('❌ Error cancelling recording:', error);
      setSttError('Failed to cancel recording');
    }
  };

  return {
    isRecording,
    isListening,
    isTranscribing,
    sttError,
    partialTranscript,
    audioLevel, // Return single audio level instead of array
    frequencyData, // Return real-time frequency spectrum
    startRecording,
    stopRecording,
    cancelRecording,
  };
};

export default useVoiceRecording;