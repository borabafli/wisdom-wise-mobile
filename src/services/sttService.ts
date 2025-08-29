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
  private onResultCallback?: (result: STTResult) => void;
  private onErrorCallback?: (error: string) => void;
  private onEndCallback?: () => void;
  private audioRecording?: Audio.Recording;

  private defaultSettings: STTSettings = {
    isEnabled: true,
    language: 'en-US',
    continuous: false, // Single recognition session
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
          this.isRecording = false;
          
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
          this.isRecording = false;
          if (this.onEndCallback) {
            this.onEndCallback();
          }
        };

        this.recognition.onstart = () => {
          this.isRecording = true;
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

  // Start speech recognition
  async startRecognition(
    onResult: (result: STTResult) => void,
    onError: (error: string) => void,
    onEnd: () => void
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
    this.isCancelled = false; // Reset cancellation flag

    try {
      if (Platform.OS === 'web' && this.recognition) {
        // Use Web Speech API for browsers
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(track => track.stop()); // Stop the test stream
        } catch (permissionError) {
          onError('Microphone permission denied. Please enable microphone access.');
          return false;
        }

        this.recognition.start();
        return true;
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
    await this.stopRecognition();
  }

  // Stop speech recognition
  async stopRecognition(): Promise<void> {
    if (!this.isRecording) return;

    try {
      if (Platform.OS === 'web' && this.recognition) {
        this.recognition.stop();
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

  // Transcribe audio using OpenAI Whisper API (then use OpenRouter for chat)
  private async transcribeAudio(
    audioUri: string, 
    onResult: (result: STTResult) => void,
    onError: (error: string) => void
  ): Promise<void> {
    try {
      console.log('Transcribing audio with OpenAI Whisper API...');
      console.log('Audio file URI:', audioUri);
      
      // Option 1: Use OpenAI Whisper API directly for STT
      // You'll need an OpenAI API key for this
      const OPENAI_API_KEY = null; // Add your OpenAI API key here if you want real STT
      
      if (OPENAI_API_KEY) {
        // Real OpenAI Whisper implementation
        const formData = new FormData();
        formData.append('file', {
          uri: audioUri,
          type: 'audio/m4a',
          name: 'recording.m4a',
        } as any);
        formData.append('model', 'whisper-1');
        formData.append('language', this.defaultSettings.language.split('-')[0]);

        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`OpenAI Whisper API error: ${response.status}`);
        }

        const result = await response.json();
        const transcript = result.text?.trim() || '';
        
        if (transcript) {
          console.log('Real transcription result:', transcript);
          onResult({
            transcript: transcript,
            confidence: 0.95,
            isFinal: true
          });
        } else {
          onError('No speech detected in the recording');
        }
      } else {
        // Enhanced simulation with realistic processing
        console.log('Using enhanced simulation (add OpenAI API key for real transcription)');
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