import axios, { AxiosInstance } from 'axios';
import { DEBUG } from '../config/constants';

export interface AIResponse {
  success: boolean;
  message?: string;
  error?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface APIConfig {
  apiKey: string;
  baseURL: string;
  model: string;
  maxTokens: number;
  temperature: number;
  timeout: number;
}

class APIService {
  private client: AxiosInstance;
  private config: APIConfig = {
    apiKey: '', // Will be set from environment or config
    baseURL: 'https://openrouter.ai/api/v1',
    model: 'anthropic/claude-3-haiku', // Fast and cost-effective for chat
    maxTokens: 500, // Keep responses concise
    temperature: 0.7, // Warm but not too random
    timeout: 30000 // 30 second timeout
  };

  constructor() {
    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Request interceptor to add auth
    this.client.interceptors.request.use((config) => {
      if (this.config.apiKey) {
        config.headers.Authorization = `Bearer ${this.config.apiKey}`;
        config.headers['HTTP-Referer'] = 'https://wisdomwise.app'; // Replace with your app URL
        config.headers['X-Title'] = 'WisdomWise'; // Your app name
      }
      return config;
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Set API key (call this on app startup)
  setApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
  }

  // Update configuration
  updateConfig(updates: Partial<APIConfig>): void {
    this.config = { ...this.config, ...updates };
    
    // Update axios instance if needed
    this.client.defaults.timeout = this.config.timeout;
    this.client.defaults.baseURL = this.config.baseURL;
  }

  // Main chat completion method
  async getChatCompletion(messages: any[]): Promise<AIResponse> {
    // Mock responses for testing without API key
    if (DEBUG.MOCK_API_RESPONSES) {
      return this.getMockResponse(messages);
    }

    try {
      if (!this.config.apiKey) {
        return {
          success: false,
          error: 'API key not configured. Please add your OpenRouter API key.'
        };
      }

      const response = await this.client.post('/chat/completions', {
        model: this.config.model,
        messages: messages,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        stream: false
      });

      const choice = response.data.choices?.[0];
      if (!choice?.message?.content) {
        return {
          success: false,
          error: 'No response content received from AI'
        };
      }

      return {
        success: true,
        message: choice.message.content.trim(),
        usage: response.data.usage
      };

    } catch (error: any) {
      // Handle different types of errors
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 401) {
          return {
            success: false,
            error: 'Invalid API key. Please check your OpenRouter API key.'
          };
        } else if (status === 429) {
          return {
            success: false,
            error: 'Rate limit exceeded. Please wait a moment before trying again.'
          };
        } else if (status === 402) {
          return {
            success: false,
            error: 'Insufficient credits. Please check your OpenRouter account balance.'
          };
        } else {
          return {
            success: false,
            error: data?.error?.message || `API error: ${status}`
          };
        }
      } else if (error.code === 'ECONNABORTED') {
        return {
          success: false,
          error: 'Request timeout. Please check your internet connection and try again.'
        };
      } else if (error.message?.includes('Network Error')) {
        return {
          success: false,
          error: 'Network error. Please check your internet connection.'
        };
      } else {
        return {
          success: false,
          error: 'An unexpected error occurred. Please try again.'
        };
      }
    }
  }

  // Get available models (for future use)
  async getAvailableModels(): Promise<any[]> {
    try {
      const response = await this.client.get('/models');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching models:', error);
      return [];
    }
  }

  // Test connection
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const testMessages = [
        { role: 'user', content: 'Hello, please respond with just "Connection successful"' }
      ];
      
      const result = await this.getChatCompletion(testMessages);
      
      if (result.success) {
        return {
          success: true,
          message: 'API connection successful'
        };
      } else {
        return {
          success: false,
          message: result.error || 'Connection test failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Connection test failed'
      };
    }
  }

  // Get current config (for debugging)
  getConfig(): APIConfig {
    return { ...this.config, apiKey: this.config.apiKey ? '***' : '' }; // Don't expose API key
  }

  // Check if service is ready
  isReady(): boolean {
    return !!this.config.apiKey;
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

  // Fallback method for offline/error scenarios
  getFallbackResponse(userMessage: string): string {
    const fallbackResponses = [
      "I hear you, gentle soul. I'm having trouble connecting right now, but I want you to know that your feelings are valid and important. 🌿",
      "Thank you for sharing with me. I'm experiencing some technical difficulties, but please know that you're not alone in whatever you're feeling. 💚",
      "I'm listening to your heart, even though I'm having connection issues right now. Take a deep breath with me - in... and out... 🌊",
      "Your words matter, dear one. While I work through some technical challenges, remember that you are worthy of care and compassion. 🌸"
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
}

export const apiService = new APIService();