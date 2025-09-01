import axios, { AxiosInstance } from 'axios';
import { API_CONFIG } from '../config/constants';
import { APIErrorHandler } from '../utils/apiErrorHandler';

/**
 * Model Service - handles model management and information
 * Extracted from apiService for single responsibility
 */
class ModelService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_CONFIG.SUPABASE_URL}/functions/v1`,
      timeout: 30000,
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
        APIErrorHandler.logError('ModelService', error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get available models (for future use)
   */
  async getAvailableModels(): Promise<any[]> {
    try {
      const response = await this.client.post('/ai-chat', {
        action: 'getModels'
      });
      
      if (response.data.success) {
        return response.data.models || [];
      } else {
        console.error('Error fetching models:', response.data.error);
        return [];
      }
    } catch (error) {
      APIErrorHandler.logError('ModelService.getAvailableModels', error);
      return [];
    }
  }

  /**
   * Get model information
   */
  async getModelInfo(modelId: string): Promise<any> {
    try {
      const response = await this.client.post('/ai-chat', {
        action: 'getModelInfo',
        modelId: modelId
      });
      
      return response.data;
    } catch (error) {
      APIErrorHandler.logError('ModelService.getModelInfo', error);
      return {
        success: false,
        error: 'Failed to get model information'
      };
    }
  }

  /**
   * Test model availability
   */
  async testModel(modelId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.client.post('/ai-chat', {
        action: 'testModel',
        modelId: modelId
      });
      
      return response.data;
    } catch (error: any) {
      const apiError = APIErrorHandler.handleAxiosError(error);
      return {
        success: false,
        message: apiError.error
      };
    }
  }
}

export const modelService = new ModelService();