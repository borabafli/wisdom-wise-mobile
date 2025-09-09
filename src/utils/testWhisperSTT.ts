// Simple test utility to verify Whisper STT implementation
import { sttService } from '../services/sttService';

export const testWhisperSTT = () => {
  console.log('🧪 Testing Whisper STT Implementation');
  console.log('📱 Platform support:', sttService.isSupported());
  console.log('📊 Current status:', sttService.getStatus());
  console.log('🔧 Available languages:', sttService.getSupportedLanguages());
  
  // Test the service initialization
  if (sttService.isSupported()) {
    console.log('✅ STT Service ready - Whisper API will be used for transcription');
  } else {
    console.log('❌ STT Service not supported');
  }
};

// Export for manual testing in development
(global as any).testWhisperSTT = testWhisperSTT;