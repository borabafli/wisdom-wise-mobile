import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import { nativeVoiceService } from './nativeVoiceService';
import { API_CONFIG } from '../config/constants';
import { apiService } from './apiService';


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
    this.setupExpoSpeechRecognition();
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

  // Setup Expo Speech Recognition for mobile platforms
  private setupExpoSpeechRecognition() {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      console.log('✅ Expo Speech Recognition setup completed');
    }
  }


  // Check if STT is supported
  isSupported(): boolean {
    if (Platform.OS === 'web') {
      return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    } else if (Platform.OS === 'ios' || Platform.OS === 'android') {
      // Native Voice service handles native speech recognition
      return true;
    }
    return false;
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

    try {
      if (Platform.OS === 'web') {
        // Ensure web speech recognition is properly stopped first
        if (this.recognition) {
          try {
            this.recognition.stop();
            // Wait a bit for it to fully stop
            await new Promise(resolve => setTimeout(resolve, 100));
          } catch (error) {
            console.log('Previous recognition already stopped');
          }
        }

        // For web, we'll use OpenRouter Whisper API too for consistency
        // But we'll also keep real-time audio visualization using Web Audio API
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
          
          // Start recording audio for transcription (similar to mobile)
          return await this.startWebRecording(stream, onResult, onError, onEnd);

        } catch (permissionError) {
          onError('Microphone permission denied. Please enable microphone access.');
          return false;
        }

      } else if (Platform.OS === 'ios' || Platform.OS === 'android') {
        // Use Native Voice Service for real-time speech recognition
        return await nativeVoiceService.startRecognition(onResult, onError, onEnd, onAudioLevel);
      } else {
        // Fallback simulation

        this.simulateNativeSTT(onResult, onError, onEnd);
        return true;
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
        
        // More responsive and realistic audio level calculation
        const baseLevel = average / 255; // 0 to 1
        
        // Use a more reasonable sensitivity that responds to actual voice
        const sensitivity = 2.5; // Moderate sensitivity
        const amplifiedLevel = Math.pow(baseLevel * sensitivity, 0.6); // Gentler curve
        const normalizedLevel = Math.min(1.0, amplifiedLevel);
        
        // Use a very low baseline that shows true silence
        const minLevel = 0.05; // Very low baseline for true silence
        frequencyData.push(Math.max(minLevel, normalizedLevel));
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

  // Web recording using MediaRecorder + OpenRouter Whisper
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

  // Transcribe web audio blob using Edge Function
  private async transcribeWebAudio(
    audioBlob: Blob,
    onResult: (result: STTResult) => void,
    onError: (error: string) => void
  ): Promise<void> {
    try {
      console.log('🎤 TRANSCRIBING WITH EDGE FUNCTION 🎤');
      console.log('Audio blob size:', audioBlob.size, 'bytes, type:', audioBlob.type);
      
      // Convert blob to base64 for transmission to Edge Function
      const base64Audio = await this.blobToBase64(audioBlob);
      
      console.log('📡 Sending request to Edge Function...');
      const result = await apiService.transcribeAudioWithContext(
        base64Audio,
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

  // Native speech recognition using Expo Speech Recognition
  private async startNativeSpeechRecognition(
    onResult: (result: STTResult) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): Promise<boolean> {
    try {
      console.log('🎤 Starting native speech recognition with Expo Speech Recognition...');
      
      // TEMPORARILY DISABLED: expo-speech-recognition causing expo start issues
      // Fallback to simulation for now
      console.log('⚠️ expo-speech-recognition temporarily disabled, using simulation');
      this.simulateNativeSTT(onResult, onError, onEnd);
      return true;

      // TODO: Re-enable when expo-speech-recognition issues are resolved
      // // Request permissions first
      // const { status } = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      // if (status !== 'granted') {
      //   onError('Microphone permission denied');
      //   return false;
      // }

      // // Check if speech recognition is available
      // const isAvailable = await ExpoSpeechRecognitionModule.getAvailableVoiceRecognitionServicesAsync();
      // console.log('📱 Available speech recognition services:', isAvailable);
      
      // // Stop any existing recognition
      // try {
      //   await ExpoSpeechRecognitionModule.stop();
      // } catch (stopError) {
      //   console.log('⚠️ No existing recognition to stop');
      // }
      
      // Clear partial result buffer
      this.partialResultBuffer = '';
      
      // TEMPORARILY DISABLED: expo-speech-recognition causing expo start issues
      // TODO: Re-enable this block when package issues are resolved
      // // Start speech recognition
      // const options = {
      //   lang: this.defaultSettings.language,
      //   interimResults: this.defaultSettings.interimResults,
      //   maxAlternatives: this.defaultSettings.maxAlternatives,
      //   continuous: this.defaultSettings.continuous,
      //   requiresOnDeviceRecognition: false,
      //   addsPunctuation: true,
      //   contextualStrings: []
      // };
      
      // this.speechRecognitionTask = await ExpoSpeechRecognitionModule.start(options);
      
      // // Set up event listeners
      // this.setupSpeechRecognitionListeners(onResult, onError, onEnd);
      
      // console.log('✅ Expo speech recognition started successfully');
      // this.isRecording = true;
      // return true;
      
    } catch (error: any) {
      console.error('❌ Error starting Expo speech recognition:', error);
      onError(`Failed to start speech recognition: ${error?.message || 'Unknown error'}`);
      return false;
    }
  }

  // Setup speech recognition event listeners
  private setupSpeechRecognitionListeners(
    onResult: (result: STTResult) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ) {
    // Handle speech recognition results
    const handleResult = (event: any) => {
      console.log('🎯 Speech recognition result:', event);
      
      if (event.results && event.results.length > 0) {
        const result = event.results[0];
        const transcript = result.transcript || '';
        const confidence = result.confidence || 0.95;
        const isFinal = event.isFinal || false;
        
        if (transcript.trim()) {
          onResult({
            transcript: transcript.trim(),
            confidence,
            isFinal
          });
        }
      }
    };
    
    // Handle speech recognition errors
    const handleError = (event: any) => {
      console.error('❌ Speech recognition error:', event);
      this.isRecording = false;
      this.shouldKeepRecording = false;
      
      let errorMessage = 'Speech recognition failed';
      if (event.error) {
        errorMessage = `Speech recognition error: ${event.error}`;
      }
      
      onError(errorMessage);
    };
    
    // Handle speech recognition end
    const handleEnd = (event: any) => {
      console.log('🏁 Speech recognition ended:', event);
      this.isRecording = false;
      
      if (!this.shouldKeepRecording || this.isCancelled) {
        onEnd();
      }
    };
    
    // Handle audio level changes for sound wave visualization
    const handleAudioLevel = (event: any) => {
      if (this.audioLevelCallback && event.db !== undefined) {
        // Convert decibel level to 0-1 range (typical range is -160 to 0 dB)
        const normalizedLevel = Math.min(1, Math.max(0.1, (event.db + 160) / 160));
        
        // Create frequency data for sound wave visualization
        const frequencyData = Array.from({ length: 7 }, (_, i) => {
          const variance = (Math.random() - 0.5) * 0.3;
          return Math.max(0.1, normalizedLevel + variance);
        });
        
        this.audioLevelCallback(normalizedLevel, frequencyData);
      }
    };
    
    // Note: Actual event listener setup would depend on the specific API
    // This is a placeholder for the event handling structure
    if (this.speechRecognitionTask) {
      // Set up listeners based on expo-speech-recognition API
      console.log('📡 Speech recognition listeners set up');
    }
  }

  // Cancel recording without processing
  async cancelRecognition(): Promise<void> {
    this.isCancelled = true;
    this.shouldKeepRecording = false;
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = undefined;
    }
    
    // Cancel native voice service on mobile
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      await nativeVoiceService.cancelRecognition();
    } else {
      await this.stopRecognition();
    }
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
      // Cleanup audio monitoring
      this.cleanupAudioMonitoring();
      
      if (Platform.OS === 'web' && this.audioRecording) {
        // Stop MediaRecorder for web
        if (this.audioRecording.state !== 'inactive') {
          this.audioRecording.stop();
        }
      } else if (Platform.OS === 'ios' || Platform.OS === 'android') {
        // Stop Native Voice Service
        console.log('🛑 Stopping native voice recognition...');
        await nativeVoiceService.stopRecognition();
      } else if (this.audioRecording) {
        // Legacy audio recording cleanup (fallback)
        console.log('Stopping audio recording...');
        await this.audioRecording.stopAndUnloadAsync();
        const uri = this.audioRecording.getURI();
        
        // Only transcribe if not cancelled
        if (uri && this.onResultCallback && !this.isCancelled) {
          console.log('Processing recording...');
          this.transcribeAudioFile(uri, this.onResultCallback, this.onErrorCallback || (() => {}));
        } else if (this.isCancelled) {
          console.log('Recording was cancelled, skipping transcription');
          if (this.onEndCallback) this.onEndCallback();
        }
        
        this.audioRecording = undefined;
      }
      
      this.isRecording = false;
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
      console.log('Transcribing audio with Edge Function...');
      console.log('Audio file URI:', audioUri);
      
      // For mobile platforms, read the file as base64 directly
      const base64Audio = await this.fileUriToBase64(audioUri);
      
      // Use Edge Function for transcription (mobile uses m4a format)
      const result = await apiService.transcribeAudioWithContext(
        base64Audio,
        this.defaultSettings.language.split('-')[0],
        'm4a'
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


  // Simulate STT for native platforms (placeholder)
  private simulateNativeSTT(
    onResult: (result: STTResult) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ) {
    // This is a placeholder for native STT
    // In a real implementation, we'd use react-native-voice or similar
    

    console.log('Starting STT simulation...');
    this.isRecording = true;
    
    // Sample responses for simulation
    const sampleResponses = [
      "I've been feeling stressed about work lately",
      "I need help with managing my anxiety",
      "Can you guide me through a breathing exercise?",
      "I'm feeling overwhelmed and need some support",
      "I'd like to talk about my feelings today",
      "Help me find some peace and calm",
      "I'm struggling with negative thoughts",
      "I want to practice mindfulness and meditation"
    ];
    
    const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
    
    // Show interim results for better UX
    let currentText = '';
    const words = randomResponse.split(' ');
    let wordIndex = 0;
    
    const showNextWord = () => {
      if (wordIndex < words.length && this.isRecording) {
        currentText += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
        wordIndex++;
        
        onResult({
          transcript: currentText,
          confidence: 0.8,
          isFinal: false
        });
        
        // Continue showing words every 300ms
        setTimeout(showNextWord, 300);
      } else if (this.isRecording) {
        // Final result
        onResult({
          transcript: randomResponse,

          confidence: 0.95,
          isFinal: true
        });
        this.isRecording = false;
        onEnd();

        console.log('STT simulation completed:', randomResponse);
      }
    };
    
    // Start showing words after a brief delay
    setTimeout(showNextWord, 500);

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
    this.shouldKeepRecording = false;
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = undefined;
    }
    
    if (this.recognition) {
      this.recognition.onresult = null;
      this.recognition.onerror = null;
      this.recognition.onend = null;
      this.recognition.onstart = null;
    }
    
    // Clean up Native Voice Service
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      await nativeVoiceService.destroy();
    }
    
    await this.stopRecognition();
  }
}

export const sttService = new STTService();