import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import { API_CONFIG } from '../config/constants';

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

  private defaultSettings: STTSettings = {
    isEnabled: true,
    language: 'en-US',
    continuous: true, // Continuous recording - don't stop automatically
    interimResults: true, // Show partial results
    maxAlternatives: 1
  };

  constructor() {
    this.setupWebSpeechAPI();
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
          this.shouldKeepRecording = false; // Stop restart loop on errors
          
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
          
          // Only restart if we should keep recording and haven't been cancelled
          if (this.shouldKeepRecording && !this.isCancelled && this.restartCount < this.maxRestarts) {
            console.log(`Restarting speech recognition for continuous recording (${this.restartCount + 1}/${this.maxRestarts})`);
            this.restartCount++;
            
            this.restartTimeout = setTimeout(() => {
              if (this.shouldKeepRecording && !this.isCancelled && this.recognition) {
                try {
                  this.recognition.start();
                  console.log('Speech recognition restarted successfully');
                } catch (error) {
                  console.error('Error restarting recognition:', error);
                  this.shouldKeepRecording = false;
                  this.isRecording = false;
                  if (this.onEndCallback) {
                    this.onEndCallback();
                  }
                }
              }
            }, 100); // Quick restart for seamless experience
          } else {
            // User stopped or max restarts reached
            console.log('Stopping speech recognition - user requested or max restarts reached');
            this.isRecording = false;
            this.shouldKeepRecording = false;
            if (this.onEndCallback) {
              this.onEndCallback();
            }
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

  // Check if STT is supported
  isSupported(): boolean {
    if (Platform.OS === 'web') {
      return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    } else if (Platform.OS === 'ios' || Platform.OS === 'android') {
      // For native platforms, we simulate STT for development/testing
      // In production, you'd integrate react-native-voice or similar
      return true; // Enable simulation mode for mobile
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

    if (this.isRecording) {
      await this.stopRecognition();
    }

    this.onResultCallback = onResult;
    this.onErrorCallback = onError;
    this.onEndCallback = onEnd;
    this.audioLevelCallback = onAudioLevel;
    this.isCancelled = false; // Reset cancellation flag
    this.shouldKeepRecording = true; // Enable continuous recording
    this.restartCount = 0; // Reset restart counter

    try {
      if (Platform.OS === 'web') {
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
        // Use real audio recording + OpenRouter Whisper API for mobile
        return await this.startRealRecording(onResult, onError, onEnd);
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
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;
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
      if (!this.isRecording || !this.analyser || !this.audioLevelCallback) return;
      
      this.analyser.getByteFrequencyData(dataArray);
      
      // Get frequency data for different ranges (bass, mid, treble)
      const bands = 5;
      const bandSize = Math.floor(bufferLength / bands);
      const frequencyData: number[] = [];
      
      for (let i = 0; i < bands; i++) {
        let sum = 0;
        const start = i * bandSize;
        const end = Math.min(start + bandSize, bufferLength);
        
        for (let j = start; j < end; j++) {
          sum += dataArray[j];
        }
        
        const average = sum / (end - start);
        // Normalize and apply sensitivity
        const sensitivity = i < 2 ? 4.0 : 3.0; // Higher sensitivity for better response
        const normalizedLevel = Math.min(1, (average / 255) * sensitivity);
        frequencyData.push(Math.max(0.1, normalizedLevel));
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
        } catch (error) {
          console.error('Error processing web audio:', error);
          onError(`Audio processing failed: ${error.message}`);
        }
        
        onEnd();
      };
      
      mediaRecorder.start();
      this.audioRecording = mediaRecorder as any; // Store reference for stopping
      this.isRecording = true;
      
      console.log('Web audio recording started successfully');
      return true;
      
    } catch (error) {
      console.error('Error starting web recording:', error);
      onError(`Failed to start web recording: ${error.message}`);
      return false;
    }
  }

  // Transcribe web audio blob using OpenAI Whisper API
  private async transcribeWebAudio(
    audioBlob: Blob,
    onResult: (result: STTResult) => void,
    onError: (error: string) => void
  ): Promise<void> {
    try {
      console.log('🎤 TRANSCRIBING WITH OPENAI WHISPER API 🎤');
      console.log('API Endpoint: https://api.openai.com/v1/audio/transcriptions');
      
      const OPENAI_API_KEY = API_CONFIG.OPENAI_API_KEY;
      console.log('OpenAI API Key present:', !!OPENAI_API_KEY);
      
      if (!OPENAI_API_KEY) {
        console.error('❌ No OpenAI API key found!');
        onError('No OpenAI API key found. Please add your OpenAI API key to constants.ts');
        return;
      }
      
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');
      formData.append('model', 'whisper-1');
      formData.append('language', this.defaultSettings.language.split('-')[0]);
      formData.append('response_format', 'json');

      console.log('📡 Sending request to OpenAI Whisper API...');
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: formData,
      });

      console.log('📨 OpenAI API Response Status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ OpenAI Whisper API error:', response.status, errorText);
        throw new Error(`OpenAI Whisper API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      const transcript = result.text?.trim() || '';
      
      if (transcript) {
        console.log('✅ OpenAI Whisper transcription SUCCESS:', transcript);
        onResult({
          transcript: transcript,
          confidence: 0.95,
          isFinal: true
        });
      } else {
        console.log('⚠️ No speech detected in recording');
        onError('No speech detected in the recording');
      }
      
    } catch (error) {
      console.error('Error transcribing web audio:', error);
      onError(`Transcription failed: ${error.message}`);
    }
  }

  // Cleanup audio monitoring
  private cleanupAudioMonitoring(): void {
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

  // Real recording for mobile platforms using expo-av + OpenRouter Whisper
  private async startRealRecording(
    onResult: (result: STTResult) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): Promise<boolean> {
    try {
      console.log('Starting real audio recording...');
      
      // Request audio recording permissions
      const permissionResponse = await Audio.requestPermissionsAsync();
      if (permissionResponse.status !== 'granted') {
        onError('Audio recording permission denied');
        return false;
      }

      // Configure audio recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recordingOptions = {
        android: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      };

      // Start recording
      this.audioRecording = new Audio.Recording();
      await this.audioRecording.prepareToRecordAsync(recordingOptions);
      await this.audioRecording.startAsync();
      this.isRecording = true;

      console.log('Real audio recording started');
      return true;

    } catch (error) {
      console.error('Error starting real recording:', error);
      onError(`Failed to start recording: ${error.message}`);
      return false;
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
    await this.stopRecognition();
  }

  // Stop speech recognition
  async stopRecognition(): Promise<void> {
    console.log('Stopping speech recognition...');
    
    // Disable continuous recording
    this.shouldKeepRecording = false;
    
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
      } else if (this.audioRecording) {
        // Stop recording
        console.log('Stopping audio recording...');
        await this.audioRecording.stopAndUnloadAsync();
        const uri = this.audioRecording.getURI();
        
        // Only transcribe if not cancelled
        if (uri && this.onResultCallback && !this.isCancelled) {
          console.log('Processing recording...');
          this.transcribeAudio(uri, this.onResultCallback, this.onErrorCallback || (() => {}));
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

  // Transcribe audio using OpenAI Whisper API
  private async transcribeAudio(
    audioUri: string, 
    onResult: (result: STTResult) => void,
    onError: (error: string) => void
  ): Promise<void> {
    try {
      console.log('Transcribing audio with OpenAI Whisper API...');
      console.log('Audio file URI:', audioUri);
      
      const OPENAI_API_KEY = API_CONFIG.OPENAI_API_KEY;
      
      if (OPENAI_API_KEY) {
        // Prepare the audio file for upload
        const formData = new FormData();
        
        // Read the audio file and prepare for upload
        formData.append('file', {
          uri: audioUri,
          type: 'audio/m4a',
          name: 'recording.m4a',
        } as any);
        
        formData.append('model', 'whisper-1');
        formData.append('language', this.defaultSettings.language.split('-')[0]);
        formData.append('response_format', 'json');

        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('OpenAI Whisper API error:', response.status, errorText);
          throw new Error(`OpenAI Whisper API error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        const transcript = result.text?.trim() || '';
        
        if (transcript) {
          console.log('OpenAI Whisper transcription result:', transcript);
          onResult({
            transcript: transcript,
            confidence: 0.95,
            isFinal: true
          });
        } else {
          onError('No speech detected in the recording');
        }
      } else {
        // Fallback simulation mode (no OpenAI API key provided)
        console.log('No OpenAI API key found - using simulation mode');
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
        
        const therapyResponses = [
          "I've been feeling really stressed about work lately and it's affecting my sleep",
          "I need help managing my anxiety, especially in social situations", 
          "Can you guide me through a breathing exercise to help me calm down?",
          "I'm feeling overwhelmed with everything going on in my life right now",
          "I'd like to talk about my feelings and get some perspective",
          "Help me find some peace and calm in this chaotic moment",
          "I want to practice mindfulness to better handle my emotions",
          "I'm having trouble sleeping because of stress and racing thoughts",
          "I feel like I'm not good enough and keep comparing myself to others",
          "Can we work on some coping strategies for dealing with depression?",
          "I'm struggling with negative thought patterns that keep repeating",
          "I need guidance on how to set better boundaries with people"
        ];
        
        const transcript = therapyResponses[Math.floor(Math.random() * therapyResponses.length)];
        console.log('Simulated transcription:', transcript);
        
        onResult({
          transcript: transcript,
          confidence: 0.92,
          isFinal: true
        });
      }

      if (this.onEndCallback) {
        this.onEndCallback();
      }

    } catch (error) {
      console.error('Error in audio transcription:', error);
      onError(`Transcription failed: ${error.message}`);
      if (this.onEndCallback) {
        this.onEndCallback();
      }
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
  destroy() {
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
    this.stopRecognition();
  }
}

export const sttService = new STTService();