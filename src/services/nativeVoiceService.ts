import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
  SpeechStartEvent,
  SpeechEndEvent,
  SpeechPartialResultsEvent,
  SpeechVolumeChangedEvent,
} from '@react-native-voice/voice';
import { Platform } from 'react-native';

export interface STTResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface STTSettings {
  isEnabled: boolean;
  language: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
}

class NativeVoiceService {
  private isRecording = false;
  private onResultCallback?: (result: STTResult) => void;
  private onErrorCallback?: (error: string) => void;
  private onEndCallback?: () => void;
  private audioLevelCallback?: (level: number, frequencyData?: number[]) => void;

  private defaultSettings: STTSettings = {
    isEnabled: true,
    language: 'en-US',
    continuous: true,
    interimResults: true,
    maxAlternatives: 1
  };

  constructor() {
    this.setupVoiceListeners();
  }

  private setupVoiceListeners() {
    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
    Voice.onSpeechError = this.onSpeechError.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged.bind(this);
  }

  private onSpeechStart = (event: SpeechStartEvent) => {
    console.log('🎤 Native voice recognition started:', event);
    this.isRecording = true;
  };

  private onSpeechRecognized = (event: SpeechRecognizedEvent) => {
    console.log('🎯 Speech recognized:', event);
  };

  private onSpeechEnd = (event: SpeechEndEvent) => {
    console.log('🏁 Native voice recognition ended:', event);
    this.isRecording = false;
    if (this.onEndCallback) {
      this.onEndCallback();
    }
  };

  private onSpeechError = (event: SpeechErrorEvent) => {
    console.error('❌ Native voice recognition error:', event);
    this.isRecording = false;
    
    let errorMessage = 'Speech recognition failed';
    
    if (event.error) {
      const error = event.error.message || event.error;
      switch (error) {
        case '7': // ERROR_NO_MATCH
        case 'No speech input':
          errorMessage = 'No speech detected. Please try again.';
          break;
        case '6': // ERROR_SPEECH_TIMEOUT
        case 'Speech timeout':
          errorMessage = 'Speech timeout. Please speak more clearly.';
          break;
        case '5': // ERROR_CLIENT
          errorMessage = 'Speech recognition service error.';
          break;
        case '8': // ERROR_RECOGNIZER_BUSY
          errorMessage = 'Speech recognizer is busy. Please try again.';
          break;
        case '9': // ERROR_INSUFFICIENT_PERMISSIONS
        case 'Insufficient permissions':
          errorMessage = 'Microphone permission denied. Please enable it in settings.';
          break;
        default:
          errorMessage = `Speech recognition error: ${error}`;
      }
    }

    if (this.onErrorCallback) {
      this.onErrorCallback(errorMessage);
    }
  };

  private onSpeechResults = (event: SpeechResultsEvent) => {
    console.log('📨 Native voice results:', event);
    
    if (event.value && event.value.length > 0) {
      const transcript = event.value[0];
      const confidence = 0.95; // Native doesn't provide confidence scores consistently
      
      if (this.onResultCallback) {
        this.onResultCallback({
          transcript: transcript.trim(),
          confidence,
          isFinal: true
        });
      }
    }
  };

  private onSpeechPartialResults = (event: SpeechPartialResultsEvent) => {
    console.log('⚡ Native voice partial results:', event);
    
    if (event.value && event.value.length > 0) {
      // On iOS, partial results contain the complete transcript so far
      // We should pass the complete transcript, not accumulate it
      const transcript = event.value[0];
      const confidence = 0.8; // Lower confidence for partial results
      
      if (this.onResultCallback && transcript.trim()) {
        this.onResultCallback({
          transcript: transcript.trim(),
          confidence,
          isFinal: false
        });
      }
    }
  };

  private onSpeechVolumeChanged = (event: SpeechVolumeChangedEvent) => {
    if (this.audioLevelCallback && event.value !== undefined) {
      // Convert dB level to 0-1 range (typical range is -160 to 0 dB)
      const normalizedLevel = Math.min(1, Math.max(0.1, (event.value + 160) / 160));
      
      // Create frequency data for sound wave visualization
      const frequencyData = Array.from({ length: 7 }, (_, i) => {
        // Create dynamic variation for organic feel
        const timeOffset = Date.now() / 200 + i;
        const variation = Math.sin(timeOffset) * 0.15 + (Math.random() - 0.5) * 0.1;
        return Math.max(0.1, Math.min(1, normalizedLevel + variation));
      });
      
      this.audioLevelCallback(normalizedLevel, frequencyData);
    }
  };

  // Check if native voice recognition is supported
  async isSupported(): Promise<boolean> {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
      return false;
    }

    try {
      const available = await Voice.isAvailable();
      console.log('🔍 Native voice availability:', available);
      return available === 1 || available === true;
    } catch (error) {
      console.error('Error checking voice availability:', error);
      return false;
    }
  }

  // Start speech recognition
  async startRecognition(
    onResult: (result: STTResult) => void,
    onError: (error: string) => void,
    onEnd: () => void,
    onAudioLevel?: (level: number, frequencyData?: number[]) => void
  ): Promise<boolean> {
    if (!(await this.isSupported())) {
      onError('Native speech recognition not supported on this device');
      return false;
    }

    // Always ensure we stop any existing recognition first
    console.log('🧹 Cleaning up any existing native voice recognition...');
    await this.stopRecognition();

    this.onResultCallback = onResult;
    this.onErrorCallback = onError;
    this.onEndCallback = onEnd;
    this.audioLevelCallback = onAudioLevel;

    try {
      console.log('🎤 Starting native voice recognition...');
      await Voice.start(this.defaultSettings.language);
      return true;
    } catch (error: any) {
      console.error('❌ Error starting native voice recognition:', error);
      onError(`Failed to start speech recognition: ${error.message || 'Unknown error'}`);
      return false;
    }
  }

  // Stop speech recognition
  async stopRecognition(): Promise<void> {
    console.log('🛑 Stopping native voice recognition...');
    
    try {
      // Make sure to stop and destroy any existing Voice instance
      if (this.isRecording) {
        await Voice.stop();
      }
      await Voice.destroy();
      this.isRecording = false;
      
      // Clear callbacks to prevent any lingering references
      this.audioLevelCallback = undefined;
      
      console.log('✅ Native voice recognition stopped and cleaned up');
    } catch (error) {
      console.error('Error stopping native voice recognition:', error);
      // Even if there's an error, reset the state
      this.isRecording = false;
      this.audioLevelCallback = undefined;
    }
  }

  // Cancel speech recognition
  async cancelRecognition(): Promise<void> {
    console.log('🚫 Cancelling native voice recognition...');
    
    try {
      await Voice.cancel();
      this.isRecording = false;
    } catch (error) {
      console.error('Error cancelling native voice recognition:', error);
    }
  }

  // Get current recording status
  getStatus() {
    return {
      isRecording: this.isRecording,
      isSupported: true // Will be checked async when needed
    };
  }

  // Update settings
  updateSettings(settings: Partial<STTSettings>) {
    this.defaultSettings = { ...this.defaultSettings, ...settings };
  }

  // Get supported languages - returns common languages
  getSupportedLanguages(): string[] {
    return [
      'en-US', 'en-GB', 'en-AU', 'en-CA',
      'es-ES', 'es-MX', 'fr-FR', 'de-DE',
      'it-IT', 'pt-BR', 'ru-RU', 'ja-JP',
      'ko-KR', 'zh-CN', 'zh-TW', 'ar-SA'
    ];
  }

  // Check if currently recognizing
  async isRecognizing(): Promise<boolean> {
    try {
      return await Voice.isRecognizing();
    } catch (error) {
      console.error('Error checking recognition status:', error);
      return false;
    }
  }

  // Get available speech recognition services (Android only)
  async getSpeechRecognitionServices(): Promise<string[]> {
    if (Platform.OS !== 'android') {
      return [];
    }

    try {
      const services = await Voice.getSpeechRecognitionServices();
      console.log('📱 Available speech recognition services:', services);
      return services || [];
    } catch (error) {
      console.error('Error getting speech recognition services:', error);
      return [];
    }
  }

  // Clean up
  async destroy() {
    console.log('🧹 Destroying native voice service...');
    
    try {
      await Voice.destroy();
      Voice.removeAllListeners();
      this.isRecording = false;
    } catch (error) {
      console.error('Error destroying native voice service:', error);
    }
  }
}

export const nativeVoiceService = new NativeVoiceService();