import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import { API_CONFIG } from '../config/constants';
import { apiService } from './apiService';

// Optional: Import react-native-audio-api if available (fallback to Expo Audio if not)
let AudioContext: any = null;
let AnalyserNode: any = null;
let AudioRecorder: any = null;
let RecorderAdapterNode: any = null;
try {
  const audioApi = require('react-native-audio-api');
  AudioContext = audioApi.AudioContext;
  AnalyserNode = audioApi.AnalyserNode;
  AudioRecorder = audioApi.AudioRecorder;
  RecorderAdapterNode = audioApi.RecorderAdapterNode;
} catch (error) {
  console.warn('react-native-audio-api not available, will use Expo Audio fallback:', error);
}


// Enhanced simulation for mobile audio levels (no native dependencies required)


export interface STTSettings {
  isEnabled: boolean;
  language: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
}

export interface STTResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

// For Web Speech API (works in web browsers)
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

class STTService {
  private recognition: any = null;
  private isRecording = false;

  private isCancelled = false;
  private shouldKeepRecording = false;

  private onResultCallback?: (result: STTResult) => void;
  private onErrorCallback?: (error: string) => void;
  private onEndCallback?: () => void;
  private audioRecording?: Audio.Recording;
  private recordingUnloaded = false;

  private audioContext?: AudioContext;
  private analyser?: AnalyserNode;
  private microphone?: MediaStreamAudioSourceNode;
  private audioLevelCallback?: (level: number, frequencyData?: number[]) => void;
  private restartTimeout?: NodeJS.Timeout;
  private restartCount = 0;
  private maxRestarts = 5;

  // Expo Speech Recognition specific properties
  private partialResultBuffer = '';
  private speechRecognitionTask?: any;


  private defaultSettings: STTSettings = {
    isEnabled: true,
    language: 'en-US',
    continuous: false, // Simple start/stop recording - no auto restart
    interimResults: true, // Show partial results
    maxAlternatives: 1
  };

  constructor() {
    this.setupWebSpeechAPI();
    this.setupComplete();
  }

  // Initialize Web Speech API (for web/browsers)
  private setupWebSpeechAPI() {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = this.defaultSettings.continuous;
        this.recognition.interimResults = this.defaultSettings.interimResults;
        this.recognition.maxAlternatives = this.defaultSettings.maxAlternatives;
        this.recognition.lang = this.defaultSettings.language;

        this.recognition.onresult = (event: any) => {
          const results = event.results;
          const lastResult = results[results.length - 1];
          const transcript = lastResult[0].transcript;
          const confidence = lastResult[0].confidence;
          const isFinal = lastResult.isFinal;

          if (this.onResultCallback) {
            this.onResultCallback({
              transcript,
              confidence: confidence || 1.0,
              isFinal
            });
          }
        };

        this.recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);

          
          // Handle different types of errors
          if (event.error === 'aborted') {
            // Aborted errors are usually from rapid start/stop - don't treat as fatal
            console.log('Speech recognition was aborted (usually from rapid start/stop)');
            return;
          }
          
          // For other errors, stop recording and notify user
          this.isRecording = false;
          this.shouldKeepRecording = false;

          
          let errorMessage = 'Speech recognition failed';
          switch (event.error) {
            case 'no-speech':
              errorMessage = 'No speech detected. Please try again.';
              break;
            case 'audio-capture':
              errorMessage = 'Microphone not available or permission denied.';
              break;
            case 'not-allowed':
              errorMessage = 'Microphone permission denied. Please enable it in your browser settings.';
              break;
            case 'network':
              errorMessage = 'Network error. Please check your internet connection.';
              break;
            case 'service-not-allowed':
              errorMessage = 'Speech service not available.';
              break;
          }

          if (this.onErrorCallback) {
            this.onErrorCallback(errorMessage);
          }
        };

        this.recognition.onend = () => {
          console.log('Speech recognition ended');
          
          // Simple approach - just stop when recognition ends
          this.isRecording = false;
          this.shouldKeepRecording = false;
          
          if (this.onEndCallback) {
            this.onEndCallback();
          }
        };

        this.recognition.onstart = () => {
          this.isRecording = true;

          this.restartCount = 0; // Reset restart counter on successful start
          console.log('Speech recognition started successfully');

        };
      }
    }
  }

  // Setup complete - Whisper API works on all platforms
  private setupComplete() {
    console.log('✅ STT Service initialized - using Whisper API for all platforms');
  }


  // Check if STT is supported - now always returns true since we use Whisper API
  isSupported(): boolean {
    // Whisper API works on all platforms through Edge Function
    return true;
  }


  // Start speech recognition with optional audio level monitoring
  async startRecognition(
    onResult: (result: STTResult) => void,
    onError: (error: string) => void,
    onEnd: () => void,
    onAudioLevel?: (level: number, frequencyData?: number[]) => void

  ): Promise<boolean> {
    if (!this.isSupported()) {
      onError('Speech recognition not supported on this device');
      return false;
    }

    // Always ensure we stop any existing recognition first
    console.log('🧹 Cleaning up any existing recognition before starting new one...');
    await this.stopRecognition();

    this.onResultCallback = onResult;
    this.onErrorCallback = onError;
    this.onEndCallback = onEnd;

    this.audioLevelCallback = onAudioLevel;
    this.isCancelled = false; // Reset cancellation flag
    this.shouldKeepRecording = false; // Simple recording - no auto restart
    this.restartCount = 0; // Reset restart counter
    this.recordingUnloaded = false; // Reset unload state for new recording

    try {
      console.log('🎤 Starting Whisper-based recording for platform:', Platform.OS);
      
      if (Platform.OS === 'web') {
        // Web: Use MediaRecorder + Audio API for visualization
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
              echoCancellation: false,
              noiseSuppression: false,
              autoGainControl: false
            }
          });
          
          console.log('Got media stream for web recording');
          
          // Setup audio level monitoring for real-time visualization
          if (onAudioLevel) {
            console.log('Setting up audio level monitoring...');
            await this.setupAudioLevelMonitoring(stream);
          }
          
          // Start recording audio for Whisper transcription
          return await this.startWebRecording(stream, onResult, onError, onEnd);

        } catch (permissionError) {
          onError('Microphone permission denied. Please enable microphone access.');
          return false;
        }

      } else if (Platform.OS === 'ios' || Platform.OS === 'android') {
        // Mobile: Use Expo Audio recording + Whisper API
        return await this.startMobileRecording(onResult, onError, onEnd, onAudioLevel);
      } else {
        // Fallback - shouldn't happen but handle gracefully
        onError('Platform not supported');
        return false;
      }
    } catch (error) {
      console.error('Error starting STT:', error);
      onError('Failed to start speech recognition');
      return false;
    }
  }


  // Setup audio level monitoring for real-time sound wave visualization
  private async setupAudioLevelMonitoring(stream: MediaStream): Promise<void> {
    try {
      console.log('=== SETTING UP AUDIO LEVEL MONITORING ===');
      console.log('Stream tracks:', stream.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled, readyState: t.readyState })));
      
      // Create audio context and analyser
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      console.log('AudioContext created, state:', this.audioContext.state);
      
      this.analyser = this.audioContext.createAnalyser();
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      
      // Configure analyser for smooth sound wave visualization
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.3;
      console.log('Analyser configured - fftSize:', this.analyser.fftSize, 'frequencyBinCount:', this.analyser.frequencyBinCount);
      
      // Connect microphone to analyser
      this.microphone.connect(this.analyser);
      console.log('Microphone connected to analyser');
      
      // Start monitoring audio levels
      this.monitorAudioLevel();
      
      console.log('Audio level monitoring setup complete');
    } catch (error) {
      console.error('Error setting up audio level monitoring:', error);
    }
  }

  // Monitor audio levels and call callback with frequency spectrum data
  private monitorAudioLevel(): void {
    if (!this.analyser || !this.audioLevelCallback || !this.isRecording) {
      return;
    }

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    let debugCounter = 0;
    
    const updateLevel = () => {
      if (!this.isRecording || !this.analyser || !this.audioLevelCallback) {
        console.log('Stopping audio level monitoring - recording ended');
        return;
      }
      
      this.analyser.getByteFrequencyData(dataArray);
      
      // Check for total silence (microphone issues)
      const totalEnergy = dataArray.reduce((sum, val) => sum + val, 0);
      if (debugCounter % 120 === 0) { // Every 2 seconds
        console.log('Total audio energy:', totalEnergy, 'Max possible:', 255 * dataArray.length);
      }
      
      // Get frequency data for different ranges optimized for voice
      const bands = 7;
      const frequencyData: number[] = [];
      
      // Define frequency ranges more suitable for voice (focus on lower frequencies where voice energy is)
      const voiceRanges = [
        [0, Math.floor(bufferLength * 0.05)],   // Very low
        [Math.floor(bufferLength * 0.02), Math.floor(bufferLength * 0.08)],  // Low bass
        [Math.floor(bufferLength * 0.06), Math.floor(bufferLength * 0.15)],  // Bass
        [Math.floor(bufferLength * 0.12), Math.floor(bufferLength * 0.25)],  // Low mid (main voice)
        [Math.floor(bufferLength * 0.2), Math.floor(bufferLength * 0.4)],    // Mid (harmonics)
        [Math.floor(bufferLength * 0.35), Math.floor(bufferLength * 0.6)],   // High mid
        [Math.floor(bufferLength * 0.5), Math.floor(bufferLength * 0.8)]     // High
      ];
      
      for (let i = 0; i < bands; i++) {
        let sum = 0;
        const [start, end] = voiceRanges[i];
        
        for (let j = start; j < end; j++) {
          sum += dataArray[j];
        }
        
        const average = sum / (end - start);
        
        // Log raw data to understand what we're getting
        if (debugCounter % 120 === 0 && i === 0) { // Log once every 2 seconds
          console.log('Raw audio data sample:', Array.from(dataArray.slice(start, Math.min(start + 10, end))));
          console.log('Band', i, 'average:', average, 'out of 255');
        }
        
        // Enhanced audio level calculation for bigger, more responsive waves
        const baseLevel = average / 255; // 0 to 1
        
        // Increased sensitivity for bigger waves
        const sensitivity = 4.0; // Higher sensitivity for more dramatic waves
        const amplifiedLevel = Math.pow(baseLevel * sensitivity, 0.5); // More aggressive curve for bigger waves
        const normalizedLevel = Math.min(1.0, amplifiedLevel);
        
        // Allow true silence (no artificial minimum)
        frequencyData.push(normalizedLevel);
      }
      
      const overallAverage = frequencyData.reduce((sum, level) => sum + level, 0) / frequencyData.length;
      
      // Minimal debug logging
      debugCounter++;
      if (debugCounter % 120 === 0) { // Every 2 seconds
        console.log('Audio levels:', frequencyData.map(f => f.toFixed(2)));
      }
      
      // Pass frequency spectrum data to the callback
      this.audioLevelCallback(overallAverage, frequencyData);
      
      // Continue monitoring
      requestAnimationFrame(updateLevel);
    };
    
    updateLevel();
  }

  // Store the detected recording format for transcription
  private detectedRecordingFormat: any = null;

  // Mobile recording using Expo Audio + Whisper API + react-native-audio-record for better waveform
  private async startMobileRecording(
    onResult: (result: STTResult) => void,
    onError: (error: string) => void,
    onEnd: () => void,
    onAudioLevel?: (level: number, frequencyData?: number[]) => void
  ): Promise<boolean> {
    try {
      console.log('🎤 Starting mobile audio recording for Whisper transcription...');
      
      // Request permissions
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        onError('Microphone permission denied');
        return false;
      }

      // Configure audio session with iOS-specific settings
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // iOS-specific: Longer delay and session verification
      if (Platform.OS === 'ios') {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Test audio session by checking recording permission again
        const { canAskAgain, granted } = await Audio.getPermissionsAsync();
        console.log('🔍 iOS Audio session check:', { canAskAgain, granted });
      }

      // Start Expo Audio recording for STT transcription
      const recording = new Audio.Recording();
      
      console.log('🎯 Preparing mobile recording with enhanced waveform data...');
      
      // Use cross-platform recording options (expo-av requires both ios and android)
      const customOptions = {
        isMeteringEnabled: true,
        ios: {
          extension: '.m4a',
          outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
          audioQuality: Audio.IOSAudioQuality.MEDIUM,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 64000,
        },
        android: {
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 64000,
        },
      };
      
      console.log('📊 Recording options with metering:', customOptions);

      // Store format info for transcription
      this.detectedRecordingFormat = {
        name: 'M4A/AAC',
        extension: '.m4a',
        mimeType: 'audio/mp4'
      };

      try {
        console.log('🔧 Preparing recording with iOS-optimized settings...');
        await recording.prepareToRecordAsync(customOptions);
        console.log('✅ Recording prepared successfully');
        
        console.log('▶️ Starting recording...');
        await recording.startAsync();
        console.log('✅ Recording started successfully');
      } catch (prepareError: any) {
        console.log('ℹ️ Primary recording config not compatible, trying fallback...');
        
        // iOS Fallback: Try with minimal options
        if (Platform.OS === 'ios') {
          console.log('🔄 Using iOS compatibility mode...');
          
          try {
            const fallbackOptions = {
              isMeteringEnabled: true,
              ios: {
                extension: '.m4a',
                outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
                audioQuality: Audio.IOSAudioQuality.LOW, // Use LOW for maximum compatibility
                sampleRate: 44100, // Use default sample rate
                numberOfChannels: 1,
              },
              android: {
                extension: '.m4a',
                outputFormat: Audio.AndroidOutputFormat.MPEG_4,
                audioEncoder: Audio.AndroidAudioEncoder.AAC,
                sampleRate: 44100,
                numberOfChannels: 1,
                bitRate: 64000,
              },
            };
            
            console.log('📊 Using compatibility options for iOS');
            
            // Create a new recording instance for fallback
            const fallbackRecording = new Audio.Recording();
            await fallbackRecording.prepareToRecordAsync(fallbackOptions);
            await fallbackRecording.startAsync();
            
            this.audioRecording = fallbackRecording; // Use fallback recording
            console.log('✅ iOS compatibility mode recording started successfully');
          } catch (fallbackError: any) {
            console.error('❌ iOS fallback also failed:', fallbackError);
            onError('iOS recording failed. Please check microphone permissions and try restarting the app.');
            return false;
          }
        } else {
          onError(`Recording failed: ${prepareError?.message || 'Unknown error'}`);
          return false;
        }
      }
      
      // Only assign recording if fallback wasn't used
      if (!this.audioRecording) {
        this.audioRecording = recording;
      }
      this.isRecording = true;
      this.recordingUnloaded = false;

      console.log('✅ Mobile audio recording started successfully');

      // Setup enhanced real-time waveform data
      if (onAudioLevel) {
        await this.startEnhancedMobileWaveform(onAudioLevel, recording);
      }

      return true;
      
    } catch (error: any) {
      console.error('Error starting mobile recording:', error);
      onError(`Failed to start mobile recording: ${error?.message || 'Unknown error'}`);
      return false;
    }
  }

  // Modern real-time audio monitoring with react-native-audio-api
  private audioContext?: AudioContext;
  private audioRecorder?: AudioRecorder;
  private recorderAdapterNode?: RecorderAdapterNode;
  private analyserNode?: AnalyserNode;
  private audioAnalysisInterval?: NodeJS.Timeout;
  
  // Real-time metering callback approach
  private meteringCallbackActive = false;

  // Enhanced mobile waveform method using react-native-audio-api or Expo Audio metering
  private async startEnhancedMobileWaveform(
    onAudioLevel: (level: number, frequencyData?: number[]) => void,
    expoRecording: Audio.Recording
  ): Promise<void> {
    console.log('🎵 Starting mobile audio visualization...');

    // Use react-native-audio-api or fall back to Expo Audio metering
    console.log('🔬 Attempting react-native-audio-api initialization...');

    this.startModernAudioAnalysis(onAudioLevel)
      .then(() => {
        console.log('✅ react-native-audio-api initialized successfully');
      })
      .catch((error) => {
        console.warn('⚠️ react-native-audio-api failed, falling back to Expo Audio metering:', error.message);
        console.log('🔄 Starting Expo Audio metering fallback...');
        this.startExpoAudioMeteringVisualization(onAudioLevel, expoRecording);
      });
  }

  
  // Setup real-time metering using status update callbacks (the proper way)
  private setupRealTimeMeteringCallback(
    onAudioLevel: (level: number, frequencyData?: number[]) => void,
    recording: Audio.Recording
  ) {
    console.log('🎤 Setting up REAL-TIME metering via status callbacks...');
    
    this.meteringCallbackActive = true;
    let meteringHistory: number[] = []; // Track recent levels for smoothing
    
    // Set up status update callback for real-time metering
    recording.setOnRecordingStatusUpdate((status) => {
      if (!this.meteringCallbackActive || !onAudioLevel || !this.isRecording) {
        return;
      }
      
      if (status.isRecording && typeof status.metering === 'number') {
        // Convert Expo Audio metering (-160 to 0 dB) to normalized level (0 to 1)
        const dbLevel = status.metering;
        
        // Debug logging for metering analysis
        if (Math.random() < 0.05) { // 5% of the time
          console.log(`🎙️ Raw Expo metering: ${dbLevel.toFixed(1)}dB, type: ${typeof status.metering}, isRecording: ${status.isRecording}`);
        }
        
        // Proper dB to amplitude conversion (logarithmic, not linear)
        let amplitude: number;
        if (dbLevel <= -80) {
          // True silence
          amplitude = 0;
        } else {
          // Convert dB to linear amplitude: amplitude = 10^(dB/20)
          const clampedDb = Math.max(-80, Math.min(0, dbLevel));
          amplitude = Math.pow(10, clampedDb / 20);
          // Light amplification for better visualization
          amplitude = Math.min(1.0, amplitude * 3);
        }
        const normalizedLevel = amplitude;
        
        // Keep history for smoothing (last 3 readings for faster response)
        meteringHistory.push(normalizedLevel);
        if (meteringHistory.length > 3) {
          meteringHistory.shift();
        }
        
        // Smooth the audio level using recent history
        const smoothedLevel = meteringHistory.reduce((sum, val) => sum + val, 0) / meteringHistory.length;
        
        // Generate 7-band frequency spectrum based on REAL metering level
        const frequencyData = this.generateVoiceOptimizedSpectrum(smoothedLevel);
        
        // Call the callback with REAL audio data
        onAudioLevel(smoothedLevel, frequencyData);
        
        // Debug logging with real values (occasional)
        if (Math.random() < 0.02) { // 2% of the time
          console.log(`🔊 REAL metering callback: dB=${dbLevel.toFixed(1)}, normalized=${normalizedLevel.toFixed(3)}, smoothed=${smoothedLevel.toFixed(3)}`);
        }
      }
    });
    
    console.log('✅ Real-time metering callback established');
  }
  
  private startMobileAudioLevelMonitoring(
    onAudioLevel: (level: number, frequencyData?: number[]) => void, 
    recording: Audio.Recording
  ) {
    console.log('🎵 Starting mobile audio monitoring...');
    
    // Try react-native-audio-api first, fallback to Expo Audio metering if it fails
    console.log('🔬 Attempting react-native-audio-api initialization...');
    
    this.startModernAudioAnalysis(onAudioLevel)
      .then(() => {
        console.log('✅ react-native-audio-api initialized successfully');
      })
      .catch((error) => {
        console.warn('⚠️ react-native-audio-api failed, falling back to Expo Audio metering:', error.message);
        console.log('🔄 Starting Expo Audio metering fallback...');
        this.startExpoAudioMeteringVisualization(onAudioLevel, recording);
      });
  }

  private async startModernAudioAnalysis(
    onAudioLevel: (level: number, frequencyData?: number[]) => void
  ) {
    try {
      console.log('🎤 Initializing modern audio pipeline: AudioRecorder → RecorderAdapterNode → AnalyserNode');
      
      // Debug: Check what objects are actually imported
      console.log('🔍 Debugging react-native-audio-api imports:', {
        AudioContextType: typeof AudioContext,
        AudioRecorderType: typeof AudioRecorder,
        RecorderAdapterNodeType: typeof RecorderAdapterNode,
        AnalyserNodeType: typeof AnalyserNode,
        AudioContextConstructor: AudioContext?.constructor?.name,
        AudioRecorderConstructor: AudioRecorder?.constructor?.name
      });
      
      // Create AudioContext with proper options
      this.audioContext = new AudioContext({
        sampleRate: 48000,
        initSuspended: false
      });
      
      console.log('📊 AudioContext created:', {
        state: this.audioContext.state,
        sampleRate: this.audioContext.sampleRate,
        currentTime: this.audioContext.currentTime,
        prototype: Object.getPrototypeOf(this.audioContext)
      });
      
      // Create AudioRecorder for microphone input with proper options
      this.audioRecorder = new AudioRecorder({
        sampleRate: 48000,
        bufferLengthInSamples: 1024
      });
      
      console.log('🎙️ AudioRecorder created:', {
        recorder: this.audioRecorder,
        recorderType: typeof this.audioRecorder,
        recorderKeys: Object.keys(this.audioRecorder),
        prototype: Object.getPrototypeOf(this.audioRecorder)
      });
      
      // Create RecorderAdapterNode to connect recorder to audio graph
      console.log('🔌 About to create RecorderAdapterNode...');
      this.recorderAdapterNode = new RecorderAdapterNode(this.audioContext);
      
      console.log('🔌 RecorderAdapterNode created:', {
        node: this.recorderAdapterNode,
        nodeType: typeof this.recorderAdapterNode,
        nodeKeys: Object.keys(this.recorderAdapterNode),
        nodePrototype: Object.getPrototypeOf(this.recorderAdapterNode),
        hasNumberOfInputs: 'numberOfInputs' in this.recorderAdapterNode,
        numberOfInputsValue: this.recorderAdapterNode.numberOfInputs,
        numberOfInputsType: typeof this.recorderAdapterNode.numberOfInputs
      });
      
      // Create AnalyserNode for frequency analysis
      this.analyserNode = new AnalyserNode(this.audioContext, {
        fftSize: 512,
        smoothingTimeConstant: 0.3,
      });
      
      console.log('📈 AnalyserNode created:', {
        fftSize: this.analyserNode.fftSize,
        frequencyBinCount: this.analyserNode.frequencyBinCount
      });
      
      // Connect AudioRecorder to RecorderAdapterNode
      console.log('🔗 Connecting AudioRecorder to RecorderAdapterNode...');
      this.audioRecorder.connect(this.recorderAdapterNode);
      console.log('✅ AudioRecorder connected to RecorderAdapterNode');
      
      // Connect RecorderAdapterNode to AnalyserNode
      console.log('🔗 Connecting RecorderAdapterNode to AnalyserNode...');
      this.recorderAdapterNode.connect(this.analyserNode);
      console.log('✅ RecorderAdapterNode connected to AnalyserNode');
      
      // Start recording
      console.log('▶️ Starting AudioRecorder...');
      this.audioRecorder.start();
      console.log('✅ AudioRecorder started');
      
      console.log('✅ Modern audio pipeline started successfully');
      
      // Start real-time analysis
      this.startRealTimeFrequencyAnalysis(onAudioLevel);
      
    } catch (error) {
      console.error('❌ Failed to start modern audio analysis:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Don't use fallback - let the error show so we can debug
      throw error;
    }
  }
  
  private startRealTimeFrequencyAnalysis(
    onAudioLevel: (level: number, frequencyData?: number[]) => void
  ) {
    if (!this.analyserNode) return;
    
    // Create data arrays for frequency analysis
    const bufferLength = this.analyserNode.frequencyBinCount;
    const frequencyData = new Uint8Array(bufferLength);
    
    console.log(`🔍 Starting real-time frequency analysis with ${bufferLength} frequency bins`);
    
    const analyzeAudio = () => {
      if (!this.isRecording || !this.analyserNode || !onAudioLevel) {
        return;
      }
      
      try {
        // Get real-time frequency data from the analyser
        this.analyserNode.getByteFrequencyData(frequencyData);
        
        // Calculate overall audio level (RMS)
        let sum = 0;
        for (let i = 0; i < frequencyData.length; i++) {
          sum += frequencyData[i] * frequencyData[i];
        }
        const rmsLevel = Math.sqrt(sum / frequencyData.length) / 255; // Normalize to 0-1
        
        // Create 7-band frequency spectrum for visualization
        const visualBands = this.createSevenBandSpectrum(frequencyData);
        
        // Debug logging (reduce frequency)
        if (Math.random() < 0.02) { // 2% of the time
          console.log(`🔥 REAL-TIME audio: RMS=${rmsLevel.toFixed(3)}, bands=[${visualBands.map(b => b.toFixed(2)).join(',')}]`);
        }
        
        onAudioLevel(rmsLevel, visualBands);
        
      } catch (error) {
        console.warn('⚠️ Error in real-time frequency analysis:', error);
      }
    };
    
    // Start analysis loop at 60fps
    this.audioAnalysisInterval = setInterval(analyzeAudio, 16);
  }
  
  private createSevenBandSpectrum(fullFrequencyData: Uint8Array): number[] {
    const bands = [];
    const bandSize = Math.floor(fullFrequencyData.length / 7);
    
    for (let band = 0; band < 7; band++) {
      const startIndex = band * bandSize;
      const endIndex = Math.min(startIndex + bandSize, fullFrequencyData.length);
      
      let sum = 0;
      for (let i = startIndex; i < endIndex; i++) {
        sum += fullFrequencyData[i];
      }
      
      // Normalize to 0-1 range with minimum visibility
      const normalizedLevel = Math.max(0.03, (sum / (endIndex - startIndex)) / 255);
      bands.push(normalizedLevel);
    }
    
    return bands;
  }


  // Real-time audio level monitoring using Expo Audio metering
  private realAudioMeteringInterval?: NodeJS.Timeout;
  private meteringFallbackActive = false;

  // Expo Audio metering visualization (fallback when react-native-audio-api fails)
  private startExpoAudioMeteringVisualization(
    onAudioLevel: (level: number, frequencyData?: number[]) => void,
    recording: Audio.Recording
  ) {
    console.log('📊 Starting Expo Audio metering visualization with REAL microphone data...');
    
    this.meteringFallbackActive = true;
    let meteringHistory: number[] = []; // Track recent levels for smoothing
    
    // Store reference to this for use in async function
    const self = this;
    
    const getMeteringData = async () => {
      if (!self.isRecording || !onAudioLevel || !self.meteringFallbackActive) {
        return;
      }
      
      try {
        // Get REAL metering data from Expo Audio
        const status = await recording.getStatusAsync();
        
        // Enhanced debugging for metering
        if (Math.random() < 0.005) { // Very occasional detailed logging
          console.log('📊 Recording status debug:', {
            isRecording: status.isRecording,
            meteringType: typeof status.metering,
            meteringValue: status.metering,
            canRecord: status.canRecord,
            isDoneRecording: status.isDoneRecording
          });
        }
        
        if (status.isRecording && typeof status.metering === 'number') {
          // Convert Expo Audio metering (-160 to 0 dB) to normalized level (0 to 1)
          const dbLevel = status.metering;
          
          // Debug logging for metering analysis (fallback)
          if (Math.random() < 0.05) { // 5% of the time
            console.log(`🎙️ Raw Expo metering (fallback): ${dbLevel.toFixed(1)}dB, type: ${typeof status.metering}, isRecording: ${status.isRecording}`);
          }
          
          // Proper dB to amplitude conversion (logarithmic, not linear)
          let amplitude: number;
          if (dbLevel <= -80) {
            // True silence
            amplitude = 0;
          } else {
            // Convert dB to linear amplitude: amplitude = 10^(dB/20)
            const clampedDb = Math.max(-80, Math.min(0, dbLevel));
            amplitude = Math.pow(10, clampedDb / 20);
            // Light amplification for better visualization
            amplitude = Math.min(1.0, amplitude * 3);
          }
          const normalizedLevel = amplitude;
          
          // Keep history for smoothing (last 5 readings)
          meteringHistory.push(normalizedLevel);
          if (meteringHistory.length > 5) {
            meteringHistory.shift();
          }
          
          // Smooth the audio level using recent history
          const smoothedLevel = meteringHistory.reduce((sum, val) => sum + val, 0) / meteringHistory.length;
          
          // Generate 7-band frequency spectrum based on REAL metering level
          const frequencyData = self.generateVoiceOptimizedSpectrum(smoothedLevel);
          
          // Call the callback with REAL audio data
          onAudioLevel(smoothedLevel, frequencyData);
          
          // Debug logging with real values
          if (Math.random() < 0.03) { // 3% of the time
            console.log(`🔊 REAL mic data: dB=${dbLevel.toFixed(1)}, normalized=${normalizedLevel.toFixed(3)}, smoothed=${smoothedLevel.toFixed(3)}`);
          }
        } else {
          // If metering not available, provide organic movement without fake levels
          if (Math.random() < 0.02) { // Only log occasionally
            console.warn('⚠️ Expo Audio metering not available - status:', status.isRecording, 'metering:', status.metering);
          }
          
          // No fallback movement - wait for real metering data
          // This prevents artificial audio levels during silence
          onAudioLevel(0, []);
        }
      } catch (error) {
        console.warn('⚠️ Error getting REAL metering data:', error);
        
        // Only as last resort - provide minimal levels
        const minimalSpectrum = self.generateVoiceOptimizedSpectrum(0.02);
        onAudioLevel(0.02, minimalSpectrum);
      }
    };
    
    // Start metering loop at 60fps for smooth real-time visualization
    this.realAudioMeteringInterval = setInterval(getMeteringData, 16);
    console.log('✅ Expo Audio metering visualization started - using REAL microphone levels');
  }

  // Generate voice-optimized frequency spectrum based on REAL audio level
  private generateVoiceOptimizedSpectrum(audioLevel: number): number[] {
    const spectrum: number[] = [];
    const time = Date.now() / 1000;
    
    // Voice frequency distribution optimized for human speech (125Hz - 8kHz range)
    // Lower frequencies (bass, fundamental) have more energy in voice
    const voiceFrequencyWeights = [
      1.0,    // 125-250Hz - Fundamental frequency range
      0.9,    // 250-500Hz - First harmonic range  
      0.75,   // 500-1kHz - Formant clarity range
      0.6,    // 1-2kHz - Consonant definition
      0.45,   // 2-4kHz - Presence and clarity
      0.3,    // 4-6kHz - Sibilance and details
      0.15    // 6-8kHz - High frequency harmonics
    ];
    
    for (let i = 0; i < 7; i++) {
      const frequencyWeight = voiceFrequencyWeights[i];
      
      // Add organic movement that responds to real audio level
      const levelResponsive = audioLevel > 0.1 ? audioLevel * 2 : 0.2; // More movement with higher levels
      const primaryWave = Math.sin(time * (0.8 + i * 0.25)) * (0.03 * levelResponsive);
      const secondaryWave = Math.sin(time * (1.5 + i * 0.4)) * (0.02 * levelResponsive);
      const movement = primaryWave + secondaryWave;
      
      // Calculate base band level from REAL audio data
      const baseLevel = audioLevel * frequencyWeight;
      
      // Voice-realistic variation (less random, more structured)
      const voiceVariation = 0.85 + (Math.sin(time * (0.5 + i * 0.1)) * 0.15); // 0.7 to 1.0
      let bandLevel = baseLevel * voiceVariation + movement;
      
      // Inter-band correlation - voice frequencies are related
      if (i > 0) {
        const prevInfluence = spectrum[i - 1] * 0.25; // Stronger correlation for voice
        bandLevel += prevInfluence;
      }
      
      // Voice-specific level mapping with better visual response
      if (audioLevel > 0.2) {
        // Enhance higher levels for better visual feedback
        bandLevel *= (1 + (audioLevel - 0.2) * 0.5);
      }
      
      // Ensure reasonable bounds with good minimum visibility
      spectrum.push(Math.max(0.03, Math.min(0.95, bandLevel)));
    }
    
    return spectrum;
  }

  // Generate realistic frequency spectrum based on audio level (legacy method)
  private generateRealisticFrequencySpectrum(audioLevel: number): number[] {
    return this.generateVoiceOptimizedSpectrum(audioLevel);
  }
  
  
  // Generate frequency spectrum based on real audio level
  private generateFrequencySpectrum(realLevel: number): number[] {
    // Create 7 frequency bands with realistic distribution
    const spectrum: number[] = [];
    
    for (let i = 0; i < 7; i++) {
      // Voice energy is typically concentrated in lower frequencies
      const frequencyWeight = Math.pow(0.85, i); // Decreases with frequency
      const randomVariation = 0.7 + (Math.random() * 0.6); // 0.7 to 1.3
      
      let bandLevel = realLevel * frequencyWeight * randomVariation;
      
      // Add some organic movement
      const time = Date.now() / 1000;
      const organicMovement = Math.sin(time * (0.5 + i * 0.3)) * 0.1;
      bandLevel += organicMovement;
      
      // Ensure reasonable bounds
      spectrum.push(Math.max(0.02, Math.min(1.0, bandLevel)));
    }
    
    return spectrum;
  }

  // Enhanced frequency spectrum for better visual appearance
  private generateEnhancedFrequencySpectrum(realLevel: number): number[] {
    const spectrum: number[] = [];
    const time = Date.now() / 1000;
    
    for (let i = 0; i < 7; i++) {
      // More sophisticated frequency distribution for voice
      const voiceFrequencyWeights = [1.0, 0.9, 0.85, 0.7, 0.55, 0.4, 0.25]; // Voice-optimized
      const frequencyWeight = voiceFrequencyWeights[i];
      
      // Enhanced organic movement with multiple sine waves
      const primaryWave = Math.sin(time * (0.8 + i * 0.4)) * 0.12;
      const secondaryWave = Math.sin(time * (1.5 + i * 0.2)) * 0.06;
      const tertiaryWave = Math.sin(time * (0.3 + i * 0.6)) * 0.03;
      const organicMovement = primaryWave + secondaryWave + tertiaryWave;
      
      // Random variation with controlled bounds
      const randomVariation = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2
      
      // Calculate base level with real audio influence
      let bandLevel = realLevel * frequencyWeight * randomVariation + organicMovement;
      
      // Add subtle inter-band correlation for more natural look
      if (i > 0) {
        const prevBandInfluence = spectrum[i - 1] * 0.15;
        bandLevel += prevBandInfluence;
      }
      
      // Apply smooth compression curve for better visual range
      if (bandLevel > 0.3) {
        bandLevel = 0.3 + Math.pow((bandLevel - 0.3) / 0.7, 0.8) * 0.7;
      }
      
      // Ensure reasonable bounds with higher minimum for visibility
      spectrum.push(Math.max(0.04, Math.min(1.0, bandLevel)));
    }
    
    return spectrum;
  }
  

  // Web recording using MediaRecorder + Whisper API
  private async startWebRecording(
    stream: MediaStream,
    onResult: (result: STTResult) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): Promise<boolean> {
    try {
      console.log('Starting web audio recording for OpenAI Whisper transcription...');
      
      // Use MediaRecorder to capture audio
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const audioChunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        console.log('Web recording stopped, processing audio...');
        
        if (audioChunks.length === 0 || this.isCancelled) {
          console.log('No audio data or recording was cancelled');
          return;
        }
        
        try {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          await this.transcribeWebAudio(audioBlob, onResult, onError);
        } catch (error: any) {
          console.error('Error processing web audio:', error);
          onError(`Audio processing failed: ${error?.message || 'Unknown error'}`);
        }
        
        onEnd();
      };
      
      mediaRecorder.start();
      this.audioRecording = mediaRecorder as any; // Store reference for stopping
      this.isRecording = true;
      
      // Start audio level monitoring now that recording has begun
      this.monitorAudioLevel();
      
      console.log('Web audio recording started successfully');
      return true;
      
    } catch (error: any) {
      console.error('Error starting web recording:', error);
      onError(`Failed to start web recording: ${error?.message || 'Unknown error'}`);
      return false;
    }
  }

  // Transcribe web audio blob using Edge Function with file upload
  private async transcribeWebAudio(
    audioBlob: Blob,
    onResult: (result: STTResult) => void,
    onError: (error: string) => void
  ): Promise<void> {
    try {
      console.log('🎤 TRANSCRIBING WEB AUDIO WITH FILE UPLOAD 🎤');
      console.log('Audio blob size:', audioBlob.size, 'bytes, type:', audioBlob.type);
      
      // Use file upload approach instead of base64 for consistency and better error handling
      const result = await this.transcribeWithFileUploadFromBlob(
        audioBlob,
        this.defaultSettings.language.split('-')[0],
        'webm'
      );

      console.log('📨 Edge Function Response:', result);
      
      if (result.success && result.transcript) {
        console.log('✅ Whisper transcription SUCCESS:', result.transcript);
        onResult({
          transcript: result.transcript,
          confidence: 0.95,
          isFinal: true
        });
      } else {
        console.log('⚠️ Transcription failed:', result.error);
        onError(result.error || 'No speech detected in the recording');
      }
      
    } catch (error: any) {
      console.error('Error transcribing web audio:', error);
      onError(`Transcription failed: ${error?.message || 'Unknown error'}`);
    }
  }

  // Convert blob to base64 (React Native compatible)
  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1]; // Remove data:audio/webm;base64, prefix
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Cleanup audio monitoring
  private cleanupAudioMonitoring(): void {
    // Clear the audio level callback to stop any further audio monitoring
    this.audioLevelCallback = undefined;
    
    if (this.microphone) {
      this.microphone.disconnect();
      this.microphone = undefined;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = undefined;
    }
    this.analyser = undefined;
  }

  // Cleanup modern audio monitoring
  private async cleanupRealAudioLevelMonitoring(): Promise<void> {
    console.log('🧹 Cleaning up modern audio analysis pipeline...');

    // Stop real-time analysis interval
    if (this.audioAnalysisInterval) {
      clearInterval(this.audioAnalysisInterval);
      this.audioAnalysisInterval = undefined;
      console.log('✅ Cleared real-time audio analysis interval');
    }
    
    // Stop and cleanup AudioRecorder
    if (this.audioRecorder) {
      try {
        this.audioRecorder.stop();
        this.audioRecorder = undefined;
        console.log('✅ AudioRecorder stopped');
      } catch (error) {
        console.warn('⚠️ Error stopping AudioRecorder:', error);
      }
    }
    
    // Disconnect and cleanup audio nodes
    if (this.recorderAdapterNode) {
      try {
        this.recorderAdapterNode.disconnect();
        this.recorderAdapterNode = undefined;
        console.log('✅ RecorderAdapterNode disconnected');
      } catch (error) {
        console.warn('⚠️ Error disconnecting RecorderAdapterNode:', error);
      }
    }
    
    if (this.analyserNode) {
      this.analyserNode = undefined;
      console.log('✅ AnalyserNode cleaned up');
    }
    
    // Cleanup AudioContext
    if (this.audioContext) {
      try {
        this.audioContext.close();
        this.audioContext = undefined;
        console.log('✅ AudioContext closed');
      } catch (error) {
        console.warn('⚠️ Error closing AudioContext:', error);
      }
    }
    
    // Cleanup Expo Audio metering fallback
    if (this.realAudioMeteringInterval) {
      clearInterval(this.realAudioMeteringInterval);
      this.realAudioMeteringInterval = undefined;
      console.log('✅ Expo Audio metering interval cleared');
    }
    
    // Cleanup metering callback
    this.meteringCallbackActive = false;
    this.meteringFallbackActive = false;
    
    console.log('✅ Modern audio analysis pipeline cleaned up completely');
  }


  // Cancel recording without processing
  async cancelRecognition(): Promise<void> {
    console.log('🚫 Cancelling recording...');
    this.isCancelled = true;
    this.shouldKeepRecording = false;
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = undefined;
    }
    
    // Always use the same stop logic, just mark as cancelled
    await this.stopRecognition();
  }

  // Stop speech recognition
  async stopRecognition(): Promise<void> {
    console.log('Stopping speech recognition... current isRecording:', this.isRecording);
    
    // Disable continuous recording
    this.shouldKeepRecording = false;
    
    // Always clean up regardless of current state
    this.isRecording = false;
    
    // Clear any pending restart
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = undefined;
    }

    try {
      // Cleanup audio monitoring for web
      this.cleanupAudioMonitoring();
      
      // Cleanup real audio level monitoring
      await this.cleanupRealAudioLevelMonitoring();
      
      if (this.audioRecording) {
        if (Platform.OS === 'web' && (this.audioRecording as any).state !== 'inactive') {
          // Stop MediaRecorder for web
          console.log('🛑 Stopping web MediaRecorder...');
          (this.audioRecording as any).stop();
        } else if ((Platform.OS === 'ios' || Platform.OS === 'android')) {
          // Stop Expo Audio recording for mobile
          console.log('🛑 Stopping mobile audio recording...');
          
          // Prevent double unload
          if (!this.recordingUnloaded) {
            await this.audioRecording.stopAndUnloadAsync();
            this.recordingUnloaded = true;
            
            const uri = this.audioRecording.getURI();
            
            // Only transcribe if not cancelled
            if (uri && this.onResultCallback && !this.isCancelled) {
              console.log('📱 Processing mobile recording with Whisper...');
              await this.transcribeAudioFile(uri, this.onResultCallback, this.onErrorCallback || (() => {}));
            } else if (this.isCancelled) {
              console.log('Recording was cancelled, skipping transcription');
              if (this.onEndCallback) this.onEndCallback();
            }
          } else {
            console.log('⚠️ Recording already unloaded, skipping double unload');
            if (this.onEndCallback) this.onEndCallback();
          }
        }
        
        this.audioRecording = undefined;
      }
      
      this.isRecording = false;
      console.log('✅ Recording stopped and cleaned up');
    } catch (error) {
      console.error('Error stopping STT:', error);
    }
  }


  // Transcribe audio file using Edge Function  
  private async transcribeAudioFile(
    audioUri: string, 
    onResult: (result: STTResult) => void,
    onError: (error: string) => void
  ): Promise<void> {
    try {
      console.log('=== TRANSCRIBING AUDIO FILE ===');
      console.log('Audio file URI:', audioUri);
      
      // Get file info for debugging
      try {
        const response = await fetch(audioUri);
        const blob = await response.blob();
        console.log('📁 File details:', {
          size: blob.size,
          type: blob.type,
          uri: audioUri
        });
      } catch (infoError) {
        console.warn('Could not get file info:', infoError);
      }
      
      // For mobile platforms, send the file directly as multipart/form-data
      const fileType = this.detectedRecordingFormat ? this.detectedRecordingFormat.extension.replace('.', '') : 'm4a';
      console.log(`🎯 Transcribing with detected format: ${fileType}`);
      
      const result = await this.transcribeWithFileUpload(
        audioUri,
        this.defaultSettings.language.split('-')[0],
        fileType
      );
      
      if (result.success && result.transcript) {
        console.log('Edge Function transcription result:', result.transcript);
        onResult({
          transcript: result.transcript,
          confidence: 0.95,
          isFinal: true
        });
      } else {
        console.log('Transcription failed:', result.error);
        onError(result.error || 'No speech detected in the recording');
      }

      if (this.onEndCallback) {
        this.onEndCallback();
      }

    } catch (error: any) {
      console.error('Error in audio transcription:', error);
      onError(`Transcription failed: ${error?.message || 'Unknown error'}`);
      if (this.onEndCallback) {
        this.onEndCallback();
      }
    }
  }

  // New method to handle file upload to Edge Function
  private async transcribeWithFileUpload(
    audioUri: string,
    language: string,
    fileType: string
  ): Promise<{ success: boolean; transcript?: string; error?: string }> {
    try {
      console.log('🎤 Uploading audio file to Edge Function...');
      
      // Create FormData for multipart upload
      const formData = new FormData();
      
      // Get the proper MIME type and filename based on detected format
      const mimeType = this.detectedRecordingFormat ? this.detectedRecordingFormat.mimeType : 'audio/mp4';
      const filename = `recording${this.detectedRecordingFormat ? this.detectedRecordingFormat.extension : '.m4a'}`;
      
      console.log(`📎 Upload details: MIME=${mimeType}, filename=${filename}`);
      
      // Add the audio file with proper MIME type
      formData.append('file', {
        uri: audioUri,
        type: mimeType,
        name: filename
      } as any);
      
      // Add other parameters
      formData.append('action', 'transcribe');
      formData.append('language', language);
      formData.append('fileType', fileType);

      console.log('📡 Sending multipart request to Edge Function...');
      console.log('FormData contents:', {
        language,
        fileType,
        audioUri: audioUri.substring(0, 100) + '...'
      });
      
      const response = await fetch(`${API_CONFIG.SUPABASE_URL}/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.SUPABASE_ANON_KEY}`,
          'apikey': API_CONFIG.SUPABASE_ANON_KEY,
          // Don't set Content-Type - let FormData set it with boundary
        },
        body: formData,
      });

      console.log('📨 Edge Function response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Edge Function error:', errorText);
        return {
          success: false,
          error: `Edge Function error: ${response.status} - ${errorText}`
        };
      }

      const result = await response.json();
      console.log('✅ Edge Function response:', result);
      
      return result;
      
    } catch (error: any) {
      console.error('❌ File upload error:', error);
      return {
        success: false,
        error: `File upload failed: ${error?.message || 'Unknown error'}`
      };
    }
  }

  // Method to handle file upload from Blob (for web platform)
  private async transcribeWithFileUploadFromBlob(
    audioBlob: Blob,
    language: string,
    fileType: string
  ): Promise<{ success: boolean; transcript?: string; error?: string }> {
    try {
      console.log('🎤 Uploading audio blob to Edge Function...');
      
      // Create FormData for multipart upload
      const formData = new FormData();
      
      // Create a File from the Blob with proper metadata
      const filename = `recording.${fileType}`;
      const audioFile = new File([audioBlob], filename, { 
        type: audioBlob.type || `audio/${fileType}` 
      });
      
      console.log(`📎 Upload details: size=${audioBlob.size}, type=${audioBlob.type}, filename=${filename}`);
      
      // Add the audio file
      formData.append('file', audioFile);
      
      // Add other parameters
      formData.append('action', 'transcribe');
      formData.append('language', language);
      formData.append('fileType', fileType);

      console.log('📡 Sending multipart request to Edge Function...');
      console.log('FormData contents:', {
        language,
        fileType,
        audioSize: audioBlob.size,
        audioType: audioBlob.type
      });
      
      const response = await fetch(`${API_CONFIG.SUPABASE_URL}/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.SUPABASE_ANON_KEY}`,
          'apikey': API_CONFIG.SUPABASE_ANON_KEY,
          // Don't set Content-Type - let FormData set it with boundary
        },
        body: formData,
      });

      console.log('📨 Edge Function response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Edge Function error:', errorText);
        return {
          success: false,
          error: `Edge Function error: ${response.status} - ${errorText}`
        };
      }

      const result = await response.json();
      console.log('✅ Edge Function response:', result);
      
      return result;
      
    } catch (error: any) {
      console.error('❌ Blob upload error:', error);
      return {
        success: false,
        error: `Blob upload failed: ${error?.message || 'Unknown error'}`
      };
    }
  }

  // Convert file URI to base64 (for React Native)
  private async fileUriToBase64(uri: string): Promise<string> {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return await this.blobToBase64(blob);
    } catch (error) {
      console.error('Error converting file to base64:', error);
      throw new Error('Failed to read audio file');
    }
  }



  // Get current recording status
  getStatus() {
    return {
      isRecording: this.isRecording,
      isSupported: this.isSupported()
    };
  }

  // Update settings
  updateSettings(settings: Partial<STTSettings>) {
    this.defaultSettings = { ...this.defaultSettings, ...settings };
    
    if (this.recognition) {
      this.recognition.continuous = this.defaultSettings.continuous;
      this.recognition.interimResults = this.defaultSettings.interimResults;
      this.recognition.maxAlternatives = this.defaultSettings.maxAlternatives;
      this.recognition.lang = this.defaultSettings.language;
    }
  }

  // Get supported languages (web only)
  getSupportedLanguages(): string[] {
    // Common languages supported by most browsers
    return [
      'en-US', 'en-GB', 'en-AU', 'en-CA',
      'es-ES', 'es-MX', 'fr-FR', 'de-DE',
      'it-IT', 'pt-BR', 'ru-RU', 'ja-JP',
      'ko-KR', 'zh-CN', 'zh-TW', 'ar-SA'
    ];
  }

  // Clean up
  async destroy() {
    console.log('🧹 Destroying STT service...');
    this.shouldKeepRecording = false;
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = undefined;
    }
    
    // Clean up web recognition if exists
    if (this.recognition) {
      this.recognition.onresult = null;
      this.recognition.onerror = null;
      this.recognition.onend = null;
      this.recognition.onstart = null;
    }
    
    // Stop any ongoing recording
    await this.stopRecognition();
    
    // Final cleanup
    await this.cleanupRealAudioLevelMonitoring();
    
    console.log('✅ STT service destroyed');
  }
}

export const sttService = new STTService();