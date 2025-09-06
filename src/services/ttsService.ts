import * as Speech from 'expo-speech';
import { storageService } from './storageService';

export interface TTSSettings {
  isEnabled: boolean;
  autoPlay: boolean;
  rate: number;        // 0.1 - 2.0 (speed)
  pitch: number;       // 0.5 - 2.0 (pitch)
  language: string;    // 'en-US', 'en-GB', etc.
  voice?: string;      // Voice identifier
}

export interface TTSVoice {
  identifier: string;
  name: string;
  quality: string;
  language: string;
}

class TTSService {
  private currentSpeechId: string | null = null;
  private isSpeaking = false;
  private isPaused = false;
  private defaultSettings: TTSSettings = {
    isEnabled: true,
    autoPlay: false, // Don't auto-play by default
    rate: 0.8,       // Slightly slower for relaxing effect
    pitch: 0.9,      // Slightly lower pitch for calming voice
    language: 'en-US',
    voice: undefined
  };

  // Get current TTS settings from storage
  async getSettings(): Promise<TTSSettings> {
    try {
      const userSettings = await storageService.getUserSettings();
      return {
        ...this.defaultSettings,
        ...userSettings.ttsSettings
      };
    } catch (error) {
      console.error('Error loading TTS settings:', error);
      return this.defaultSettings;
    }
  }

  // Save TTS settings
  async saveSettings(settings: Partial<TTSSettings>): Promise<void> {
    try {
      const userSettings = await storageService.getUserSettings();
      const updatedSettings = {
        ...userSettings,
        ttsSettings: {
          ...this.defaultSettings,
          ...userSettings.ttsSettings,
          ...settings
        }
      };
      await storageService.saveUserSettings(updatedSettings);
    } catch (error) {
      console.error('Error saving TTS settings:', error);
    }
  }

  // Get available voices
  async getAvailableVoices(): Promise<TTSVoice[]> {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      return voices.map(voice => ({
        identifier: voice.identifier,
        name: voice.name,
        quality: voice.quality,
        language: voice.language
      }));
    } catch (error) {
      console.error('Error getting available voices:', error);
      return [];
    }
  }

  // Clean text for better speech (remove markdown, emojis, etc.)
  private cleanTextForSpeech(text: string): string {
    return text
      // Remove markdown formatting
      .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
      .replace(/\*(.*?)\*/g, '$1')     // Italic
      .replace(/__(.*?)__/g, '$1')     // Bold
      .replace(/_(.*?)_/g, '$1')       // Italic
      
      // Replace emojis with descriptive text or remove
      .replace(/🐢/g, '') // Remove turtle emoji
      .replace(/🌿/g, '') // Remove leaf emoji
      .replace(/🌊/g, '') // Remove wave emoji
      .replace(/💚/g, '') // Remove green heart
      .replace(/🌸/g, '') // Remove blossom emoji
      .replace(/✨/g, '') // Remove sparkles
      .replace(/🌱/g, '') // Remove seedling
      .replace(/🙏/g, '') // Remove prayer hands
      .replace(/❤️/g, '') // Remove red heart
      
      // Clean up extra spaces and newlines
      .replace(/\n\n+/g, '. ') // Replace double newlines with period
      .replace(/\n/g, ', ')    // Replace single newlines with comma
      .replace(/\s+/g, ' ')    // Replace multiple spaces with single space
      .trim();
  }

  // Speak text with current settings
  async speak(text: string, options?: Partial<TTSSettings>): Promise<string> {
    try {
      const settings = await this.getSettings();
      const finalSettings = { ...settings, ...options };

      if (!finalSettings.isEnabled) {
        console.log('TTS is disabled');
        return '';
      }

      // Stop current speech if any
      if (this.isSpeaking) {
        await this.stop();
      }

      const cleanText = this.cleanTextForSpeech(text);
      if (!cleanText.trim()) {
        console.log('No text to speak after cleaning');
        return '';
      }

      const speechOptions: Speech.SpeechOptions = {
        rate: finalSettings.rate,
        pitch: finalSettings.pitch,
        language: finalSettings.language,
        voice: finalSettings.voice,
        onStart: () => {
          this.isSpeaking = true;
          this.isPaused = false;
        },
        onDone: () => {
          this.isSpeaking = false;
          this.isPaused = false;
          this.currentSpeechId = null;
        },
        onStopped: () => {
          this.isSpeaking = false;
          this.isPaused = false;
          this.currentSpeechId = null;
        },
        onError: (error) => {
          console.error('TTS Error:', error);
          this.isSpeaking = false;
          this.isPaused = false;
          this.currentSpeechId = null;
        }
      };

      // Generate unique ID for this speech
      const speechId = Date.now().toString();
      this.currentSpeechId = speechId;

      // Start speaking
      Speech.speak(cleanText, speechOptions);
      
      return speechId;
    } catch (error) {
      console.error('Error starting TTS:', error);
      return '';
    }
  }

  // Stop current speech
  async stop(): Promise<void> {
    try {
      if (this.isSpeaking) {
        Speech.stop();
        this.isSpeaking = false;
        this.isPaused = false;
        this.currentSpeechId = null;
      }
    } catch (error) {
      console.error('Error stopping TTS:', error);
    }
  }

  // Pause current speech (if platform supports it)
  async pause(): Promise<void> {
    try {
      if (this.isSpeaking && !this.isPaused) {
        // Note: expo-speech doesn't have pause/resume, so we stop
        // This is a limitation we'd need to work around
        await this.stop();
        this.isPaused = true;
      }
    } catch (error) {
      console.error('Error pausing TTS:', error);
    }
  }

  // Get current speech status
  getStatus() {
    return {
      isSpeaking: this.isSpeaking,
      isPaused: this.isPaused,
      currentSpeechId: this.currentSpeechId
    };
  }

  // Check if TTS is supported
  async isSupported(): Promise<boolean> {
    try {
      // Try to get voices - if it works, TTS is supported
      await Speech.getAvailableVoicesAsync();
      return true;
    } catch (error) {
      console.error('TTS not supported:', error);
      return false;
    }
  }

  // Speak AI message automatically if auto-play is enabled
  async speakIfAutoPlay(text: string): Promise<string> {
    try {
      const settings = await this.getSettings();
      if (settings.autoPlay && settings.isEnabled) {
        return await this.speak(text);
      }
      return '';
    } catch (error) {
      console.error('Error in auto-play TTS:', error);
      return '';
    }
  }

  // Get optimal settings for turtle voice (calm, soothing)
  getTurtleVoiceSettings(): Partial<TTSSettings> {
    return {
      rate: 0.7,    // Slower, more deliberate
      pitch: 0.8,   // Lower, more calming
      language: 'en-US'
    };
  }
}

export const ttsService = new TTSService();