import axios, { AxiosInstance } from 'axios';


import { DEBUG, API_CONFIG } from '../config/constants';
import { APIErrorHandler } from '../utils/apiErrorHandler';
import { getLanguageInstruction } from './i18nService';
import { getExerciseTypeEnum } from '../data/exerciseEnum';

export interface AIResponse {
  success: boolean;
  message?: string;
  error?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  suggestions?: string[];
  nextStep?: boolean;
  nextAction?: string;
  exerciseData?: {
    type: string;
    name: string;
  };
}

/**
 * Chat Service - handles AI chat completions
 * Extracted from apiService for single responsibility
 */
class ChatService {
  private client: AxiosInstance;
  private config = {
    baseURL: `${API_CONFIG.SUPABASE_URL}/functions/v1`,
    model: API_CONFIG.AI_MODEL,
    maxTokens: API_CONFIG.MAX_TOKENS,
    temperature: API_CONFIG.TEMPERATURE,
    timeout: 60000
  };

  constructor() {
    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
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
        APIErrorHandler.logError('ChatService', error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Send message with conversation context to AI therapist
   */
  async getChatCompletionWithContext(messages: any[], systemMessage?: string, bypassJsonSchema?: boolean): Promise<AIResponse> {
    // Mock responses for testing without API key
    if (DEBUG.MOCK_API_RESPONSES) {
      return this.getMockResponse(messages);
    }

    try {
      // Add language instruction to system message
      const languageInstruction = getLanguageInstruction();
      const enhancedSystemMessage = systemMessage ? languageInstruction + systemMessage : undefined;
      console.log('🚀 Chat Request Details:', {
        model: this.config.model,
        maxTokens: this.config.maxTokens,
        temperature: this.config.temperature,
        messagesCount: messages.length
      });
      
      // Debug: Check if memory context is in the system message
      console.log('🧠 [CHAT DEBUG] System message length:', messages[0]?.content?.length || 0);
      console.log('🧠 [CHAT DEBUG] System message preview:', messages[0]?.content?.substring(0, 300) + '...');
      console.log('🧠 [CHAT DEBUG] Contains memory indicators:', {
        hasLongTermInsights: messages[0]?.content?.includes('Long-term Insights') || false,
        hasRecentSessions: messages[0]?.content?.includes('Recent Sessions') || false,
        hasConsolidatedThemes: messages[0]?.content?.includes('Consolidated Themes') || false
      });
      
      console.log('=== SENDING REQUEST TO EDGE FUNCTION ===');
      console.log('Model:', this.config.model);

// Construct the final message array, prioritizing the provided system message
const finalMessages = [];

if (enhancedSystemMessage && typeof enhancedSystemMessage === 'string') {
  // Use the enhanced system message and skip any existing system messages
  finalMessages.push({ role: 'system', content: enhancedSystemMessage });

  // Add only non-system messages from the original array
  const nonSystemMessages = messages.filter(msg => msg.role !== 'system');
  finalMessages.push(...nonSystemMessages);

  console.log('🎯 [JOURNAL DEBUG] Using enhanced system message:', enhancedSystemMessage.substring(0, 100) + '...');
  console.log('🎯 [JOURNAL DEBUG] Filtered out system messages, remaining:', nonSystemMessages.length);
} else {
  // Fallback to original behavior for other use cases
  finalMessages.push(...messages);
  console.log('🎯 [JOURNAL DEBUG] Using original message flow with', messages.length, 'messages');
}

      const requestData: any = {
        action: 'chat',
        messages: finalMessages,
        model: this.config.model,
        maxTokens: this.config.maxTokens,
        temperature: this.config.temperature
      };

      // Add bypass parameter if specified
      if (bypassJsonSchema) {
        requestData.bypassJsonSchema = true;
        console.log('🎯 [JOURNAL DEBUG] Adding bypassJsonSchema=true to request');
      }

      const response = await this.client.post('/ai-chat', requestData);

      console.log('📥 Raw API Response:', {
        status: response.status,
        data: response.data,
        model: this.config.model,
        maxTokens: this.config.maxTokens
      });
      
      // Check if response was truncated
      if (response.data.usage) {
        console.log('📊 Token Usage:', {
          prompt_tokens: response.data.usage.prompt_tokens,
          completion_tokens: response.data.usage.completion_tokens,
          total_tokens: response.data.usage.total_tokens,
        });
      }

      if (response.data.nextAction === 'showExerciseCard' && response.data.exerciseData) {
        const ExerciseType = getExerciseTypeEnum();
        if (!Object.values(ExerciseType).includes(response.data.exerciseData.type)) {
          console.error('Invalid exercise type from AI:', response.data.exerciseData.type);
          response.data.nextAction = 'none';
        }
      }

      return response.data;

    } catch (error: any) {
      const apiError = APIErrorHandler.handleAxiosError(error);
      return {
        success: false,
        error: apiError.error
      };
    }
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<typeof this.config>): void {
    this.config = { ...this.config, ...updates };
    this.client.defaults.timeout = this.config.timeout;
    this.client.defaults.baseURL = this.config.baseURL;
  }

  /**
   * Get current config (for debugging)
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * Test connection
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.client.post('/ai-chat', {
        action: 'healthCheck'
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

  /**
   * Check if service is ready
   */
  isReady(): boolean {
    return true; // Always ready now - Edge Function handles authentication
  }

  /**
   * Generate fallback response for critical failures
   */
  getFallbackResponse(userMessage: string): string {
    return APIErrorHandler.generateFallbackResponse(userMessage);
  }



 // Send a simple message and get response with metadata
async sendMessageWithMetadata(prompt: string, context: any[] = [], systemMessage?: string): Promise<AIResponse> {
  try {
    const languageInstruction = getLanguageInstruction();
    const enhancedPrompt = languageInstruction + prompt;

    const messages = [
      ...context.map(item => ({
        role: item.role || 'user',
        content: item.content || item.message || String(item)
      })),
      {
        role: 'user',
        content: enhancedPrompt
      }
    ];

    const enhancedSystemMessage = systemMessage ? languageInstruction + systemMessage : undefined;

    const response = await this.getChatCompletionWithContext(messages, enhancedSystemMessage);

    if (response.success) {
      return response;
    }

    throw new Error(response.error || 'Failed to get AI response');
  } catch (error) {
    console.error('Error in sendMessageWithMetadata:', error);
    throw error;
  }
}

 // Send a simple message and get response (for journal prompts)
async sendMessage(prompt: string, context: any[] = [], systemMessage?: string): Promise<string> {
  try {
    const response = await this.sendMessageWithMetadata(prompt, context, systemMessage);

    if (response.success && response.message) {
      return response.message;
    }

    throw new Error(response.error || 'Failed to get AI response');
  } catch (error) {
    console.error('Error in sendMessage:', error);
    throw error;
  }
}

  // Mock responses for testing without API key
  private async getMockResponse(messages: any[]): Promise<AIResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const lastMessage = messages[messages.length - 1];
    const userContent = lastMessage?.content?.toLowerCase() || '';
    
    const turtleResponses = [
      {
        condition: (msg: string) => msg.includes('stress') || msg.includes('anxious'),
        responses: [
          "I can feel the weight you're carrying, dear one 🌿\n\nStress moves through us like weather through the sky. Let's breathe together - imagine your breath as gentle waves, washing over the shores of your worries. What feels most heavy right now?",
          "Your stress is valid, gentle soul 🌊\n\nLike a turtle, I know the wisdom of moving slowly when the world feels fast. Take a moment to feel your feet on the ground. You don't have to carry everything at once.",
          "Thank you for trusting me with your stress 💚\n\nIn my many years, I've learned that stress is often love with nowhere to go. You care deeply about things. Let's explore what matters most to your heart right now."
        ]
      },
      {
        condition: (msg: string) => msg.includes('sad') || msg.includes('down') || msg.includes('difficult'),
        responses: [
          "I see the tenderness in your heart, dear one 🌸\n\nSadness is like rain - it nourishes even as it falls. Your feelings are welcome here in our peaceful space. What would comfort feel like to you right now?",
          "Your sadness speaks of your deep capacity to care 💙\n\nLike roots that grow stronger in rich, dark soil, sometimes our hearts need to feel the depths to find new growth. I'm here with you in this.",
          "Thank you for sharing your heart with me 🌱\n\nIn the gentle rhythm of turtle wisdom, I know that all feelings have their season. This sadness won't stay forever, but right now, let's honor what it's trying to tell you."
        ]
      },
      {
        condition: (msg: string) => msg.includes('grateful') || msg.includes('good') || msg.includes('happy'),
        responses: [
          "Your gratitude warms my old turtle heart 🌟\n\nLike sunlight dancing on water, your appreciation creates ripples of joy. What has touched your heart most deeply today?",
          "I feel the lightness in your spirit, dear one ✨\n\nGratitude is like the morning dew - it makes everything more beautiful. Tell me more about this gift you've discovered.",
          "Your joy is a precious pearl 🐚\n\nIn my slow, steady way, I've learned that happiness shared grows larger. What would you like to celebrate in this moment?"
        ]
      },
      {
        condition: () => true, // Default responses
        responses: [
          "I hear you, gentle soul 🐢\n\nYour words settle into my heart like stones into still water, creating gentle ripples of understanding. Take all the time you need - there's no rush in our peaceful space.",
          "Thank you for trusting me with your thoughts 💚\n\nLike morning light filtering through ancient trees, your sharing brings warmth to our conversation. What feels most important to explore right now?",
          "I'm listening with my whole being 🌿\n\nIn the patient way of turtles, I hold space for whatever you're experiencing. Your feelings are safe here, and so are you.",
          "Your heart speaks wisdom, dear one 🌊\n\nEven in uncertainty, there's something beautiful about your willingness to share. What would support feel like to you in this moment?"
        ]
      }
    ];
    
    // Find matching response category
    let selectedResponses = turtleResponses[turtleResponses.length - 1].responses; // default
    for (const category of turtleResponses) {
      if (category.condition(userContent)) {
        selectedResponses = category.responses;
        break;
      }
    }
    
    const randomResponse = selectedResponses[Math.floor(Math.random() * selectedResponses.length)];
    
    return {
      success: true,
      message: randomResponse,
      usage: {
        prompt_tokens: 150,
        completion_tokens: 100,
        total_tokens: 250
      }
    };
  }
}

export const chatService = new ChatService();