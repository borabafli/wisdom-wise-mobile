// Configuration constants
export const API_CONFIG = {
  // App configuration
  APP_NAME: 'WisdomWise',
  APP_URL: 'https://wisdomwise.app',
  
  // Supabase configuration
  SUPABASE_URL: 'https://tarwryruagxsoaljzoot.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhcndyeXJ1YWd4c29hbGp6b290Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MTIwNDIsImV4cCI6MjA3MTk4ODA0Mn0.mCjT32oChZaF1DNAUCYMmU8XP49q4og_IBlHRO3Vdqg',
  
  // Rate limiting
  DEFAULT_DAILY_LIMIT: 50,
  
  // AI Model settings - now handled securely by Supabase Edge Function
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
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// Debug settings
export const DEBUG = {
  LOG_API_CALLS: isDevelopment,
  LOG_STORAGE: isDevelopment,
  MOCK_API_RESPONSES: false // Set to true for testing without API key
};