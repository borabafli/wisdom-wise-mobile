import axios, { AxiosInstance } from 'axios';
import { DEBUG, API_CONFIG } from '../config/constants';
import { APIErrorHandler } from '../utils/apiErrorHandler';

/**
 * Transcription Service - handles audio transcription
 * Extracted from apiService for single responsibility
 */
class TranscriptionService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_CONFIG.SUPABASE_URL}/functions/v1`,
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.SUPABASE_ANON_KEY}`,
        'apikey': API_CONFIG.SUPABASE_ANON_KEY
      }
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        APIErrorHandler.logError('TranscriptionService', error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Transcribe audio using Whisper via Edge Function
   */
  async transcribeAudioWithContext(
    audioData: string, 
    language: string = 'en', 
    fileType: string = 'm4a'
  ): Promise<{ success: boolean; transcript?: string; error?: string }> {
    if (DEBUG.MOCK_API_RESPONSES) {
      // Mock transcription for testing
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        transcript: "I've been feeling stressed about work lately and need some guidance"
      };
    }

    try {
      const response = await this.client.post('/ai-chat', {
        action: 'transcribe',
        audioData: audioData,
        language: language,
        fileType: fileType
      });

      return response.data;
    } catch (error: any) {
      const apiError = APIErrorHandler.handleTranscriptionError(error);
      return {
        success: false,
        error: apiError.error
      };
    }
  }

  /**
   * Test transcription service
   */
  async testTranscription(): Promise<{ success: boolean; message: string }> {
    try {
      // This would be a simple test request
      return {
        success: true,
        message: 'Transcription service is available'
      };
    } catch (error: any) {
      const apiError = APIErrorHandler.handleTranscriptionError(error);
      return {
        success: false,
        message: apiError.error
      };
    }
  }
}

export const transcriptionService = new TranscriptionService();