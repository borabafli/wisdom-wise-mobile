import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatCompletionRequest {
  action: 'chat' | 'healthCheck' | 'getModels';
  messages?: ChatMessage[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

interface AIResponse {
  success: boolean;
  message?: string;
  error?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    // Get OpenRouter API key from environment
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    if (!OPENROUTER_API_KEY) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'OpenRouter API key not configured in environment' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse request body
    const requestBody: ChatCompletionRequest = await req.json();
    const { action, messages, model, maxTokens, temperature } = requestBody;

    // Handle different actions
    switch (action) {
      case 'chat':
        return await handleChatCompletion(
          OPENROUTER_API_KEY,
          messages || [],
          model || 'google/gemini-flash-1.5',
          maxTokens || 500,
          temperature || 0.7
        );
      
      case 'healthCheck':
        return await handleConnectionTest(OPENROUTER_API_KEY);
      
      case 'getModels':
        return await handleGetModels(OPENROUTER_API_KEY);
      
      default:
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Invalid action. Use: chat, healthCheck, or getModels' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
    }

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function handleChatCompletion(
  apiKey: string,
  messages: ChatMessage[],
  model: string,
  maxTokens: number,
  temperature: number
): Promise<Response> {
  if (!messages || messages.length === 0) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Messages array is required and cannot be empty' 
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://wisdomwise.app',
        'X-Title': 'WisdomWise',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        max_tokens: maxTokens,
        temperature: temperature,
        stream: false
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      let errorMessage = 'API request failed';
      
      if (response.status === 401) {
        errorMessage = 'Invalid API key';
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please wait a moment before trying again.';
      } else if (response.status === 402) {
        errorMessage = 'Insufficient credits. Please check your OpenRouter account balance.';
      } else if (data?.error?.message) {
        errorMessage = data.error.message;
      }

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: errorMessage 
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const choice = data.choices?.[0];
    if (!choice?.message?.content) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No response content received from AI' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const aiResponse: AIResponse = {
      success: true,
      message: choice.message.content.trim(),
      usage: data.usage
    };

    return new Response(
      JSON.stringify(aiResponse),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('OpenRouter API error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to communicate with AI service' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

async function handleConnectionTest(apiKey: string): Promise<Response> {
  const testMessages: ChatMessage[] = [
    { role: 'user', content: 'Hello, please respond with just "Connection successful"' }
  ];

  try {
    const response = await handleChatCompletion(
      apiKey,
      testMessages,
      'google/gemini-flash-1.5',
      50,
      0.1
    );

    const data = await response.json();
    
    if (data.success) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'API connection successful'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: data.error || 'Connection test failed'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Connection test failed'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

async function handleGetModels(apiKey: string): Promise<Response> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://wisdomwise.app',
        'X-Title': 'WisdomWise',
      },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to fetch models' 
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await response.json();
    
    return new Response(
      JSON.stringify({
        success: true,
        models: data.data || []
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Models API error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to fetch available models' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}