import { useState, useEffect, useCallback, useRef } from 'react';
import { sttService } from '../services/sttService';

export interface AudioWaveformData {
  isRecording: boolean;
  audioLevels: number[];
  overallLevel: number;
  isListening: boolean;
}

export interface UseAudioWaveformReturn extends AudioWaveformData {
  startRecording: () => Promise<boolean>;
  stopRecording: () => Promise<void>;
  cancelRecording: () => Promise<void>;
  toggleRecording: () => Promise<void>;
}

export interface UseAudioWaveformOptions {
  sensitivity?: number;
  smoothing?: number;
  onTranscript?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onRecordingEnd?: () => void;
}

/**
 * Hook for real-time audio waveform visualization integrated with STT service
 */
export const useAudioWaveform = (options: UseAudioWaveformOptions = {}): UseAudioWaveformReturn => {
  const {
    sensitivity = 1.0,
    smoothing = 0.3,
    onTranscript,
    onError,
    onRecordingEnd
  } = options;

  // State management
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(7).fill(0.1));
  const [overallLevel, setOverallLevel] = useState(0.1);
  const [isListening, setIsListening] = useState(false);

  // Refs for cleanup and smoothing
  const animationFrameRef = useRef<number>();
  const previousLevelsRef = useRef<number[]>(new Array(7).fill(0.1));
  const recordingStateRef = useRef(false);

  // Smooth audio level transitions
  const smoothAudioLevels = useCallback((newLevels: number[], previousLevels: number[]) => {
    return newLevels.map((level, index) => {
      const prevLevel = previousLevels[index] || 0.1;
      return prevLevel + (level - prevLevel) * (1 - smoothing);
    });
  }, [smoothing]);

  // Audio level callback for STT service
  const handleAudioLevel = useCallback((level: number, frequencyData?: number[]) => {
    if (!recordingStateRef.current) return;

    let processedLevels = frequencyData || [level];
    
    // Ensure we have 7 bands for consistent visualization
    if (processedLevels.length !== 7) {
      processedLevels = Array.from({ length: 7 }, (_, i) => {
        if (frequencyData && frequencyData.length > 0) {
          const sourceIndex = Math.floor((i / 7) * frequencyData.length);
          return frequencyData[sourceIndex] || level;
        }
        return level;
      });
    }

    // Apply sensitivity and smoothing
    const sensitizedLevels = processedLevels.map(l => 
      Math.max(0.05, Math.min(1.0, l * sensitivity))
    );

    const smoothedLevels = smoothAudioLevels(sensitizedLevels, previousLevelsRef.current);
    previousLevelsRef.current = smoothedLevels;

    // Update state
    setAudioLevels(smoothedLevels);
    setOverallLevel(smoothedLevels.reduce((sum, l) => sum + l, 0) / smoothedLevels.length);
  }, [sensitivity, smoothAudioLevels]);

  // STT event handlers
  const handleTranscriptResult = useCallback((result: any) => {
    if (onTranscript) {
      onTranscript(result.transcript, result.isFinal);
    }
  }, [onTranscript]);

  const handleError = useCallback((error: string) => {
    console.error('Audio waveform STT error:', error);
    setIsRecording(false);
    setIsListening(false);
    recordingStateRef.current = false;
    
    if (onError) {
      onError(error);
    }
  }, [onError]);

  const handleRecordingEnd = useCallback(() => {
    console.log('Audio waveform: Recording ended');
    setIsRecording(false);
    setIsListening(false);
    recordingStateRef.current = false;
    
    // Fade out audio levels
    const fadeOut = () => {
      setAudioLevels(prev => {
        const fadedLevels = prev.map(level => Math.max(0.05, level * 0.9));
        const stillFading = fadedLevels.some(level => level > 0.1);
        
        if (stillFading) {
          animationFrameRef.current = requestAnimationFrame(fadeOut);
        }
        
        return fadedLevels;
      });
      setOverallLevel(prev => Math.max(0.05, prev * 0.9));
    };
    
    fadeOut();
    
    if (onRecordingEnd) {
      onRecordingEnd();
    }
  }, [onRecordingEnd]);

  // Start recording with waveform visualization
  const startRecording = useCallback(async (): Promise<boolean> => {
    if (isRecording) return true;

    console.log('🎤 Starting audio waveform recording...');
    
    try {
      setIsListening(true);
      recordingStateRef.current = true;

      const success = await sttService.startRecognition(
        handleTranscriptResult,
        handleError,
        handleRecordingEnd,
        handleAudioLevel // This enables real-time audio level monitoring
      );

      if (success) {
        setIsRecording(true);
        console.log('✅ Audio waveform recording started successfully');
        return true;
      } else {
        setIsListening(false);
        recordingStateRef.current = false;
        console.log('❌ Failed to start audio waveform recording');
        return false;
      }
    } catch (error) {
      console.error('Error starting audio waveform recording:', error);
      setIsListening(false);
      recordingStateRef.current = false;
      return false;
    }
  }, [isRecording, handleTranscriptResult, handleError, handleRecordingEnd, handleAudioLevel]);

  // Stop recording
  const stopRecording = useCallback(async (): Promise<void> => {
    if (!isRecording) return;

    console.log('🛑 Stopping audio waveform recording...');
    recordingStateRef.current = false;
    
    try {
      await sttService.stopRecognition();
      console.log('✅ Audio waveform recording stopped');
    } catch (error) {
      console.error('Error stopping audio waveform recording:', error);
    }
  }, [isRecording]);

  // Cancel recording
  const cancelRecording = useCallback(async (): Promise<void> => {
    if (!isRecording) return;

    console.log('🚫 Cancelling audio waveform recording...');
    recordingStateRef.current = false;
    
    try {
      await sttService.cancelRecognition();
      setIsRecording(false);
      setIsListening(false);
      
      // Immediate reset to idle state
      setAudioLevels(new Array(7).fill(0.1));
      setOverallLevel(0.1);
      previousLevelsRef.current = new Array(7).fill(0.1);
      
      console.log('✅ Audio waveform recording cancelled');
    } catch (error) {
      console.error('Error cancelling audio waveform recording:', error);
    }
  }, [isRecording]);

  // Toggle recording state
  const toggleRecording = useCallback(async (): Promise<void> => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (recordingStateRef.current) {
        sttService.stopRecognition().catch(console.error);
      }
    };
  }, []);

  return {
    isRecording,
    audioLevels,
    overallLevel,
    isListening,
    startRecording,
    stopRecording,
    cancelRecording,
    toggleRecording,
  };
};