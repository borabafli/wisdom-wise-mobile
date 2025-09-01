/**
 * API Error Handler utility - extracted from apiService
 * Provides consistent error handling across the application
 */

export interface APIError {
  success: false;
  error: string;
  code?: string;
  statusCode?: number;
}

export interface APISuccess<T = any> {
  success: true;
  data?: T;
  message?: string;
}

export type APIResponse<T = any> = APISuccess<T> | APIError;

export class APIErrorHandler {
  /**
   * Handle axios errors consistently
   */
  static handleAxiosError(error: any): APIError {
    console.error('❌ API Request Failed:', {
      error: error.message,
      responseData: error.response?.data,
      responseStatus: error.response?.status,
      responseHeaders: error.response?.headers
    });

    // Handle different types of errors
    if (error.response?.data) {
      // Server returned an error response
      return {
        success: false,
        error: error.response.data.error || error.response.data.message || 'Server error occurred',
        code: error.response.data.code,
        statusCode: error.response.status
      };
    } 
    
    if (error.code === 'ECONNABORTED') {
      return {
        success: false,
        error: 'Request timeout. Please check your internet connection and try again.',
        code: 'TIMEOUT'
      };
    } 
    
    if (error.message?.includes('Network Error')) {
      return {
        success: false,
        error: 'Network error. Please check your internet connection.',
        code: 'NETWORK_ERROR'
      };
    }
    
    // Generic error
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
      code: 'UNKNOWN_ERROR'
    };
  }

  /**
   * Handle rate limit errors
   */
  static handleRateLimitError(rateLimitStatus: any): APIError {
    const remainingRequests = Math.max(0, (rateLimitStatus.total || 0) - (rateLimitStatus.used || 0));
    
    return {
      success: false,
      error: remainingRequests === 0 
        ? 'Daily limit reached. Please try again tomorrow.'
        : `Rate limit exceeded. ${remainingRequests} requests remaining today.`,
      code: 'RATE_LIMIT_EXCEEDED'
    };
  }

  /**
   * Handle storage errors
   */
  static handleStorageError(error: any): APIError {
    console.error('Storage error:', error);
    return {
      success: false,
      error: 'Failed to save data locally. Please check your device storage.',
      code: 'STORAGE_ERROR'
    };
  }

  /**
   * Handle transcription errors
   */
  static handleTranscriptionError(error: any): APIError {
    console.error('Transcription error:', error);
    return {
      success: false,
      error: 'Failed to transcribe audio. Please try speaking again.',
      code: 'TRANSCRIPTION_ERROR'
    };
  }

  /**
   * Generate fallback response for critical failures
   */
  static generateFallbackResponse(userMessage: string): string {
    const fallbackResponses = [
      "I hear you, gentle soul. I'm having trouble connecting right now, but I want you to know that your feelings are valid and important. 🌿",
      "Thank you for sharing with me. I'm experiencing some technical difficulties, but please know that you're not alone in whatever you're feeling. 💚",
      "I'm listening to your heart, even though I'm having connection issues right now. Take a deep breath with me - in... and out... 🌊",
      "Your words matter, dear one. While I work through some technical challenges, remember that you are worthy of care and compassion. 🌸"
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }

  /**
   * Log error for debugging
   */
  static logError(context: string, error: any, additionalInfo?: any): void {
    console.error(`[${context}] Error:`, {
      message: error.message || error,
      stack: error.stack,
      additionalInfo,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Check if error is retryable
   */
  static isRetryableError(error: APIError): boolean {
    const retryableCodes = ['TIMEOUT', 'NETWORK_ERROR', 'SERVER_ERROR'];
    return retryableCodes.includes(error.code || '');
  }

  /**
   * Get user-friendly error message
   */
  static getUserFriendlyMessage(error: APIError): string {
    switch (error.code) {
      case 'RATE_LIMIT_EXCEEDED':
        return 'You\'ve reached your daily limit. Please try again tomorrow.';
      case 'TIMEOUT':
        return 'The request timed out. Please check your connection and try again.';
      case 'NETWORK_ERROR':
        return 'Connection issue detected. Please check your internet and try again.';
      case 'STORAGE_ERROR':
        return 'Unable to save your data. Please check your device storage.';
      case 'TRANSCRIPTION_ERROR':
        return 'Couldn\'t understand the audio. Please try speaking again.';
      default:
        return error.error || 'Something went wrong. Please try again.';
    }
  }
}

export default APIErrorHandler;