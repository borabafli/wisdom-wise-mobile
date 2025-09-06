// Re-export focused services with backward compatibility
export { chatService } from './chatService';
export { transcriptionService } from './transcriptionService';
export { modelService } from './modelService';
export type { AIResponse } from './chatService';
export { APIErrorHandler } from '../utils/apiErrorHandler';

// Legacy compatibility - delegate to focused services
import { chatService } from './chatService';
import { transcriptionService } from './transcriptionService';
import { modelService } from './modelService';

/**
 * Legacy APIService - now delegates to focused services
 * Maintains backward compatibility while promoting better architecture
 * @deprecated Use specific services: chatService, transcriptionService, modelService
 */
class LegacyAPIService {
  /**
   * @deprecated Use chatService.getChatCompletionWithContext instead
   */
  async getChatCompletionWithContext(messages: any[]) {
    return chatService.getChatCompletionWithContext(messages);
  }

  /**
   * @deprecated Use transcriptionService.transcribeAudioWithContext instead
   */
  async transcribeAudioWithContext(audioData: string, language: string = 'en', fileType: string = 'm4a') {
    return transcriptionService.transcribeAudioWithContext(audioData, language, fileType);
  }

  /**
   * @deprecated Use modelService.getAvailableModels instead
   */
  async getAvailableModels() {
    return modelService.getAvailableModels();
  }

  /**
   * @deprecated Use chatService.testConnection instead
   */
  async testConnection() {
    return chatService.testConnection();
  }

  /**
   * @deprecated Use chatService.updateConfig instead
   */
  updateConfig(updates: any) {
    return chatService.updateConfig(updates);
  }

  /**
   * @deprecated Use chatService.getConfig instead
   */
  getConfig() {
    return chatService.getConfig();
  }

  /**
   * @deprecated Use chatService.isReady instead
   */
  isReady() {
    return chatService.isReady();
  }

  /**
   * @deprecated Use chatService.getFallbackResponse instead
   */
  getFallbackResponse(userMessage: string) {
    return chatService.getFallbackResponse(userMessage);
  }

  /**
   * @deprecated No longer needed - Edge Function handles authentication
   */
  setApiKey(apiKey: string) {
    console.log('API key is now handled securely by Supabase Edge Function');
  }
}

// Export legacy instance for backward compatibility
export const apiService = new LegacyAPIService();