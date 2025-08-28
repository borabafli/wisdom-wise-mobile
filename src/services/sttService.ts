import { Audio } from 'expo-av';
import { Platform } from 'react-native';

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
      // For native platforms, we'd need react-native-voice or similar
      // For now, return false - we'll handle this as a future enhancement
      return false;
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

    try {
      if (Platform.OS === 'web' && this.recognition) {
        // Request microphone permission first
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(track => track.stop()); // Stop the test stream
        } catch (permissionError) {
          onError('Microphone permission denied. Please enable microphone access.');
          return false;
        }

        this.recognition.start();
        return true;
      } else {
        // Native implementation would go here
        // For now, simulate recognition for testing
        this.simulateNativeSTT(onResult, onError, onEnd);
        return true;
      }
    } catch (error) {
      console.error('Error starting STT:', error);
      onError('Failed to start speech recognition');
      return false;
    }
  }

  // Stop speech recognition
  async stopRecognition(): Promise<void> {
    if (!this.isRecording) return;

    try {
      if (Platform.OS === 'web' && this.recognition) {
        this.recognition.stop();
      }
      
      // Stop audio recording if active
      if (this.audioRecording) {
        await this.audioRecording.stopAndUnloadAsync();
        this.audioRecording = undefined;
      }
      
      this.isRecording = false;
    } catch (error) {
      console.error('Error stopping STT:', error);
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
    
    this.isRecording = true;
    
    // Simulate listening for 5 seconds, then return a sample message
    setTimeout(() => {
      if (this.isRecording) {
        onResult({
          transcript: "I've been feeling stressed about work lately",
          confidence: 0.95,
          isFinal: true
        });
        this.isRecording = false;
        onEnd();
      }
    }, 3000);
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