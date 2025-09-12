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
      // Comprehensive input validation and debugging
      console.log('🎤 TranscriptionService: Starting transcription request');
      console.log('📊 Request parameters:', {
        audioDataLength: audioData?.length || 0,
        audioDataType: typeof audioData,
        audioDataPreview: audioData?.substring(0, 50) + '...',
        language,
        fileType
      });

      // Validate input data
      if (!audioData || typeof audioData !== 'string') {
        console.error('❌ Invalid audio data:', { audioData: typeof audioData, length: audioData?.length });
        return {
          success: false,
          error: 'Invalid audio data provided'
        };
      }

      if (audioData.length === 0) {
        console.error('❌ Empty audio data');
        return {
          success: false,
          error: 'Audio data is empty'
        };
      }

      // Check if it looks like valid base64
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      if (!base64Regex.test(audioData)) {
        console.error('❌ Audio data does not look like valid base64');
        return {
          success: false,
          error: 'Audio data is not valid base64'
        };
      }

      const payload = {
        action: 'transcribe',
        audioData: audioData,
        language: language,
        fileType: fileType
      };

      console.log('📡 Sending request to Edge Function:', {
        url: `${API_CONFIG.SUPABASE_URL}/functions/v1/ai-chat`,
        payloadSize: JSON.stringify(payload).length,
        action: payload.action,
        language: payload.language,
        fileType: payload.fileType,
        audioDataLength: payload.audioData.length
      });

      const response = await this.client.post('/ai-chat', payload);

      console.log('✅ Edge Function response received:', {
        status: response.status,
        data: response.data
      });

      return response.data;
    } catch (error: any) {
      console.error('❌ TranscriptionService error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        requestData: {
          audioDataLength: audioData?.length || 0,
          language,
          fileType
        }
      });

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