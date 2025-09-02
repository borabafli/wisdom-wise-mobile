// API Response types
export interface AIResponse {
  success: boolean;
  message?: string;
  error?: string;
  suggestions?: string[];
  nextAction?: string;
  exerciseData?: {
    type: string;
    name: string;
  };
  nextStep?: boolean;
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