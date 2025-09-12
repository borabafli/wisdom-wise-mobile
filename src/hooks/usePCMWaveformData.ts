import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';

// Use react-native-audio-record for PCM audio data
let AudioRecord: any = null;
try {
  // @ts-ignore - Package might not have TypeScript declarations
  AudioRecord = require('react-native-audio-record').default;
} catch (error) {
  console.error('react-native-audio-record not available:', error);
}

interface PCMWaveformData {
  isRecording: boolean;
  waveformBars: number[];
  audioLevel: number;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  error: string | null;
}

const ROLLING_BUFFER_DURATION = 5; // 5 seconds of audio data
const SAMPLE_RATE = 16000; // 16kHz sample rate
const WAVEFORM_BARS = 40; // Number of bars for WhatsApp-style waveform
const RMS_WINDOW_SIZE = 512; // Window size for RMS calculation

export const usePCMWaveformData = (): PCMWaveformData => {
  const [isRecording, setIsRecording] = useState(false);
  const [waveformBars, setWaveformBars] = useState<number[]>(new Array(WAVEFORM_BARS).fill(0));
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Rolling buffer to store 5 seconds of RMS values
  const rollingBufferRef = useRef<number[]>([]);
  const audioRecorderRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  
  // Configuration for audio recording
  const audioConfig = {
    sampleRate: SAMPLE_RATE,
    bitsPerSample: 16,
    channelCount: 1, // Mono
    wavFile: 'audio.wav' // Temporary file name
  };

  // Basic PCM data processing
  const processPCMData = useCallback((pcmData: string) => {
    try {
      // Basic audio level simulation for now
      const level = Math.random() * 0.8 + 0.1;
      setAudioLevel(level);
      
      // Add to rolling buffer
      rollingBufferRef.current.push(level);
      if (rollingBufferRef.current.length > 100) {
        rollingBufferRef.current.shift();
      }
      
      // Update waveform bars
      const currentTime = Date.now();
      if (currentTime - lastUpdateTimeRef.current > 50) {
        updateWaveformBars();
        lastUpdateTimeRef.current = currentTime;
      }
      
    } catch (err) {
      console.error('Error processing PCM data:', err);
      setError('Failed to process audio data');
    }
  }, []);

  // Update waveform bars from rolling buffer
  const updateWaveformBars = useCallback(() => {
    const buffer = rollingBufferRef.current;
    if (buffer.length === 0) {
      setWaveformBars(new Array(WAVEFORM_BARS).fill(0));
      return;
    }
    
    const newBars = new Array(WAVEFORM_BARS).fill(0);
    const samplesPerBar = Math.max(1, Math.floor(buffer.length / WAVEFORM_BARS));
    
    for (let i = 0; i < WAVEFORM_BARS; i++) {
      const startIdx = i * samplesPerBar;
      const endIdx = Math.min(startIdx + samplesPerBar, buffer.length);
      
      // Calculate peak value for this bar
      let peak = 0;
      for (let j = startIdx; j < endIdx; j++) {
        peak = Math.max(peak, buffer[j]);
      }
      
      // Apply smoothing and minimum height for visual consistency
      const smoothedPeak = peak * 0.8 + newBars[i] * 0.2; // Simple low-pass filter
      newBars[i] = Math.max(smoothedPeak, 0.02); // Minimum bar height
    }
    
    setWaveformBars(newBars);
  }, []);

  // Start PCM recording
  const startRecording = useCallback(async () => {
    try {
      setError(null);
      
      if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
        setError('PCM recording only supported on mobile platforms');
        return;
      }
      
      if (!AudioRecord) {
        setError('PCM audio recording not available - package not found');
        console.warn('AudioRecord not available, skipping PCM recording');
        return;
      }
      
      // Initialize audio recorder
      AudioRecord.init(audioConfig);
      audioRecorderRef.current = AudioRecord;
      
      // Set up data callback (only 'data' event is supported)
      AudioRecord.on('data', (data: string) => {
        try {
          processPCMData(data);
        } catch (err: any) {
          console.error('PCM recording error:', err);
          setError('Audio recording failed');
          setIsRecording(false);
        }
      });
      
      // Start recording
      AudioRecord.start();
      setIsRecording(true);
      
      // Reset rolling buffer
      rollingBufferRef.current = [];
      
      console.log('✅ PCM recording started');
      
    } catch (err: any) {
      console.error('Failed to start PCM recording:', err);
      setError(err.message || 'Failed to start recording');
    }
  }, [processPCMData]);

  // Stop PCM recording
  const stopRecording = useCallback(() => {
    try {
      if (isRecording && AudioRecord) {
        AudioRecord.stop();
        // Remove listener by setting empty callback
        try {
          AudioRecord.on('data', () => {});
        } catch (e) {
          // Ignore cleanup errors
        }
        audioRecorderRef.current = null;
      }
      
      setIsRecording(false);
      
      // Fade out waveform gradually
      const fadeOut = () => {
        setWaveformBars(prev => prev.map(bar => Math.max(0, bar * 0.8)));
        if (rollingBufferRef.current.some(val => val > 0.01)) {
          setTimeout(fadeOut, 100);
        } else {
          setWaveformBars(new Array(WAVEFORM_BARS).fill(0));
          setAudioLevel(0);
        }
      };
      
      setTimeout(fadeOut, 200);
      
      console.log('✅ PCM recording stopped');
      
    } catch (err: any) {
      console.error('Error stopping PCM recording:', err);
      setError(err.message || 'Failed to stop recording');
    }
  }, [isRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRecorderRef.current) {
        try {
          audioRecorderRef.current.stop();
          audioRecorderRef.current.removeAllListeners();
        } catch (err) {
          console.warn('Error during cleanup:', err);
        }
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    isRecording,
    waveformBars,
    audioLevel,
    startRecording,
    stopRecording,
    error
  };
};