import { useState, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { sttService } from '../../services/sttService';
import { useDirectAudioLevels } from '../useDirectAudioLevels';

interface UseVoiceRecordingReturn {
  isRecording: boolean;
  isListening: boolean;
  isTranscribing: boolean;
  sttError: string | null;
  partialTranscript: string;
  audioLevel: number; // Single audio level instead of array
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

  // Use direct audio levels hook
  const { audioLevel, updateAudioLevel, resetLevel } = useDirectAudioLevels();

  // Throttle audio level updates to match wave update interval (83ms = ~12 updates/sec)
  const lastAudioUpdateTime = useRef(0);
  const AUDIO_UPDATE_THROTTLE = 83; // ms - Match wave update rate for optimal performance

  // Cleanup effect: ensure keep-awake is deactivated when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup on unmount - deactivate keep-awake if component unmounts during recording
      deactivateKeepAwake('voice-recording').catch((error) => {
        console.warn('⚠️ Failed to deactivate keep-awake on unmount:', error);
      });
    };
  }, []);

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

    // Activate keep-awake to prevent screen from turning off during recording
    try {
      await activateKeepAwakeAsync('voice-recording');
      console.log('✅ Keep-awake activated for voice recording');
    } catch (error) {
      console.warn('⚠️ Failed to activate keep-awake:', error);
    }

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
      async (error) => {
        setSttError(error);
        setIsRecording(false);
        setIsListening(false);
        setIsTranscribing(false);
        setPartialTranscript('');
        // Deactivate keep-awake on error
        try {
          await deactivateKeepAwake('voice-recording');
          console.log('✅ Keep-awake deactivated after error');
        } catch (err) {
          console.warn('⚠️ Failed to deactivate keep-awake after error:', err);
        }
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

    // Deactivate keep-awake after stopping recording
    try {
      await deactivateKeepAwake('voice-recording');
      console.log('✅ Keep-awake deactivated after stop recording');
    } catch (error) {
      console.warn('⚠️ Failed to deactivate keep-awake after stop:', error);
    }

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

    // Deactivate keep-awake when cancelling
    try {
      await deactivateKeepAwake('voice-recording');
      console.log('✅ Keep-awake deactivated after cancel');
    } catch (error) {
      console.warn('⚠️ Failed to deactivate keep-awake after cancel:', error);
    }

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
    startRecording,
    stopRecording,
    cancelRecording,
  };
};

export default useVoiceRecording;