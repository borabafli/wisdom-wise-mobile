// Configuration constants
export const API_CONFIG = {
  // OpenRouter API Key (set in .env)
  API_KEY: process.env.OPENROUTER_API_KEY || "DUMMY_KEY",
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || "DUMMY_KEY", // alias

  // OpenAI API Key for Whisper transcription (set in .env)
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "DUMMY_KEY",


  
  // App configuration
  APP_NAME: 'WisdomWise',
  APP_URL: 'https://wisdomwise.app', // Replace with your app URL
  
  // Rate limiting
  DEFAULT_DAILY_LIMIT: 50,
  
  // AI Model settings
  AI_MODEL: 'google/gemini-2.0-flash-exp', // Gemini 2.0 Flash (latest experimental)
  // Alternative: 'google/gemini-flash-1.5' // Stable version
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