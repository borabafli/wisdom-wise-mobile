// Configuration constants
export const API_CONFIG = {
  // OpenRouter API Key - Replace with your actual key
  // Get your key at: https://openrouter.ai/keys
  OPENROUTER_API_KEY: 'YOUR_API_KEY_HERE', // TODO: Replace with real API key
  
  // App configuration
  APP_NAME: 'WisdomWise',
  APP_URL: 'https://wisdomwise.app', // Replace with your app URL
  
  // Rate limiting
  DEFAULT_DAILY_LIMIT: 50,
  
  // AI Model settings
  AI_MODEL: 'anthropic/claude-3-haiku', // Fast and cost-effective
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
  MOCK_API_RESPONSES: false // Set to true to test without API key
};