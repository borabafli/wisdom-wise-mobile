// Configuration constants
export const API_CONFIG = {
  // OpenRouter API Key - Replace with your actual key
  // Get your key at: https://openrouter.ai/keys
  OPENROUTER_API_KEY: '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', // TODO: Replace with real API key
  
  // App configuration
  APP_NAME: 'WisdomWise',
  APP_URL: 'https://wisdomwise.app', // Replace with your app URL
  
  // Rate limiting
  DEFAULT_DAILY_LIMIT: 50,
  
  // AI Model settings
  AI_MODEL: 'google/gemini-flash-1.5', // Fast, affordable, great for therapy
  // Premium options:
  // AI_MODEL: 'anthropic/claude-3-haiku', // Excellent for therapy conversations
  // AI_MODEL: 'anthropic/claude-3.5-sonnet', // Best quality (more expensive)
  MAX_TOKENS: 500,
  TEMPERATURE: 0.7,
  
  // Context settings
  MAX_CONTEXT_TURNS: 10
};

// Environment check
export const isDevelopment = __DEV__;
export const isProduction = !__DEV__;

// Debug settings
export const DEBUG = {
  LOG_API_CALLS: isDevelopment,
  LOG_STORAGE: isDevelopment,
  MOCK_API_RESPONSES: false // Set to true for testing without API key
};