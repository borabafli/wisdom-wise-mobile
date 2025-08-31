import { useState, useEffect } from 'react';
import { ttsService } from '../../services/ttsService';

interface TTSStatus {
  isSpeaking: boolean;
  isPaused: boolean;
  currentSpeechId: string | null;
}

interface UseTTSControlsReturn {
  ttsStatus: TTSStatus;
  playingMessageId: string | null;
  handlePlayTTS: (messageId: string, text: string) => Promise<void>;
  handleStopTTS: () => Promise<void>;
}

export const useTTSControls = (): UseTTSControlsReturn => {
  const [ttsStatus, setTtsStatus] = useState<TTSStatus>({ 
    isSpeaking: false, 
    isPaused: false, 
    currentSpeechId: null 
  });
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

  // TTS Control Functions
  const handlePlayTTS = async (messageId: string, text: string) => {
    try {
      // Stop any current speech
      await ttsService.stop();
      
      // Start speaking with turtle voice settings
      const speechId = await ttsService.speak(text, ttsService.getTurtleVoiceSettings());
      
      if (speechId) {
        setPlayingMessageId(messageId);
        setTtsStatus({ isSpeaking: true, isPaused: false, currentSpeechId: speechId });
      }
    } catch (error) {
      console.error('Error starting TTS:', error);
    }
  };

  const handleStopTTS = async () => {
    try {
      await ttsService.stop();
      setPlayingMessageId(null);
      setTtsStatus({ isSpeaking: false, isPaused: false, currentSpeechId: null });
    } catch (error) {
      console.error('Error stopping TTS:', error);
    }
  };

  // Update TTS status periodically
  useEffect(() => {
    const updateTTSStatus = () => {
      const status = ttsService.getStatus();
      setTtsStatus(status);
      
      // Clear playing message if speech stopped
      if (!status.isSpeaking && playingMessageId) {
        setPlayingMessageId(null);
      }
    };

    const interval = setInterval(updateTTSStatus, 500); // Check every 500ms
    return () => clearInterval(interval);
  }, [playingMessageId]);

  return {
    ttsStatus,
    playingMessageId,
    handlePlayTTS,
    handleStopTTS,
  };
};

export default useTTSControls;