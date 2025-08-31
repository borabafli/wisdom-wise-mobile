import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatCompletionRequest {
  action: 'chat' | 'transcribe' | 'healthCheck' | 'getModels' | 'generateSuggestions';
  messages?: ChatMessage[];
  audioData?: string;
  language?: string;
  fileType?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  aiResponse?: string; // For suggestion generation
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
  suggestions?: string[];
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
    // Get API keys from environment
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    // Parse request body
    const requestBody: ChatCompletionRequest = await req.json();
    const { action, messages, audioData, language, model, maxTokens, temperature } = requestBody;

    // Handle different actions
    switch (action) {
      case 'chat':
        if (!OPENROUTER_API_KEY) {
          return new Response(JSON.stringify({
            success: false,
            error: 'OpenRouter API key not configured in environment'
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        return await handleChatCompletion(
          OPENROUTER_API_KEY,
          messages || [],
          model || 'google/gemini-flash-1.5',
          maxTokens || 500,
          temperature || 0.7
        );

      case 'transcribe':
        if (!OPENAI_API_KEY) {
          return new Response(JSON.stringify({
            success: false,
            error: 'OpenAI API key not configured in environment'
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        const fileType = requestBody.fileType || 'm4a';
        return await handleWhisperTranscription(OPENAI_API_KEY, audioData || '', language || 'en', fileType);
      
      case 'healthCheck':
        return await handleConnectionTest(OPENROUTER_API_KEY);
      
      case 'getModels':
        return await handleGetModels(OPENROUTER_API_KEY);
      
      case 'generateSuggestions':
        if (!OPENROUTER_API_KEY) {
          return new Response(JSON.stringify({
            success: false,
            error: 'OpenRouter API key not configured in environment'
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        return await handleSuggestionGeneration(
          OPENROUTER_API_KEY,
          requestBody.aiResponse || '',
          model || 'google/gemini-flash-1.5'
        );
      
      default:
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Invalid action. Use: chat, transcribe, healthCheck, getModels, or generateSuggestions' 
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

    // Extract suggestion chips and clean message
    const originalContent: string = (choice.message.content || '').trim();
    const { cleanedMessage, suggestions } = extractSuggestionsFromContent(originalContent);

    const aiResponse: AIResponse = {
      success: true,
      message: cleanedMessage,
      usage: data.usage,
      suggestions: suggestions.length > 0 ? suggestions : undefined
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

// Handle Whisper transcription via OpenAI
async function handleWhisperTranscription(apiKey: string, audioData: string, language: string, fileType: string = 'm4a'): Promise<Response> {
  try {
    // Decode base64 audio data
    const audioBytes = Uint8Array.from(atob(audioData), c => c.charCodeAt(0));
    
    // Determine correct MIME type and filename based on file type
    const mimeType = fileType === 'webm' ? 'audio/webm' : 'audio/m4a';
    const filename = fileType === 'webm' ? 'recording.webm' : 'recording.m4a';
    
    const audioBlob = new Blob([audioBytes], { type: mimeType });

    // Prepare form data
    const formData = new FormData();
    formData.append('file', audioBlob, filename);
    formData.append('model', 'whisper-1');
    formData.append('language', language);
    formData.append('response_format', 'json');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({
        success: false,
        error: `OpenAI Whisper API error: ${response.status} - ${errorText}`
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const result = await response.json();
    const transcript = result.text?.trim() || '';

    if (!transcript) {
      return new Response(JSON.stringify({
        success: false,
        error: 'No speech detected in the recording'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      transcript: transcript,
      confidence: 0.95
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Whisper transcription error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to transcribe audio'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// Utility: Extract SUGGESTION_CHIPS from the tail of content and return cleaned text + suggestions
function extractSuggestionsFromContent(content: string): { cleanedMessage: string; suggestions: string[] } {
  try {
    const match = content.match(/\s*SUGGESTION_CHIPS:\s*(\[[\s\S]*?\])\s*$/i);
    if (!match) {
      return { cleanedMessage: content, suggestions: [] };
    }
    const jsonPart = match[1];
    const parsed = JSON.parse(jsonPart);
    const suggestions = Array.isArray(parsed)
      ? parsed
          .filter((s: any) => typeof s === 'string')
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0 && s.length <= 25)
          .slice(0, 4)
      : [];
    const cleanedMessage = content.replace(match[0], '').trim();
    return { cleanedMessage, suggestions };
  } catch (_e) {
    // If parsing fails, return original content
    return { cleanedMessage: content.replace(/\s*SUGGESTION_CHIPS:\s*\[[\s\S]*?\]\s*$/i, '').trim(), suggestions: [] };
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

// Handle AI-powered suggestion generation
async function handleSuggestionGeneration(
  apiKey: string,
  aiResponse: string,
  model: string = 'google/gemini-flash-1.5'
): Promise<Response> {
  if (!aiResponse || aiResponse.trim().length === 0) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'AI response is required for suggestion generation'
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    // Create specialized prompt for suggestion generation
    const suggestionPrompt = `You are analyzing an AI therapist's response to generate contextual user reply suggestions.

AI Response: "${aiResponse}"

Generate 4 short, natural user reply suggestions (max 25 chars each) that would be appropriate responses to this therapeutic message. Focus on:

1. Emotional validation responses ("I feel understood", "That helps")
2. Continuation prompts ("Tell me more", "I want to try that")  
3. Emotional state responses ("I'm feeling anxious", "That resonates")
4. Practical responses ("How does that work?", "I'm ready")

Make suggestions authentic, therapeutic, and conversational. Consider the emotional tone and content of the AI response.

Respond with ONLY a JSON array of 4 strings, no other text:
["suggestion1", "suggestion2", "suggestion3", "suggestion4"]`;

    const messages = [
      {
        role: 'user',
        content: suggestionPrompt
      }
    ];

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
        max_tokens: 200,
        temperature: 0.8,
        stream: false
      }),
    });

    if (!response.ok) {
      console.error('Suggestion generation API error:', response.status);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to generate suggestions via AI'
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await response.json();
    const aiSuggestionResponse = data.choices?.[0]?.message?.content?.trim();

    if (!aiSuggestionResponse) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No suggestion response from AI'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse the AI response as JSON array
    try {
      const suggestions = JSON.parse(aiSuggestionResponse);
      
      if (!Array.isArray(suggestions)) {
        throw new Error('Response is not an array');
      }

      // Validate and filter suggestions
      const validSuggestions = suggestions
        .filter((s: any) => typeof s === 'string' && s.length > 0 && s.length <= 25)
        .slice(0, 4);

      return new Response(
        JSON.stringify({
          success: true,
          suggestions: validSuggestions,
          usage: data.usage
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );

    } catch (parseError) {
      // Fallback: try to extract suggestions from free-form text
      console.error('Failed to parse AI suggestions as JSON, attempting extraction:', parseError);
      
      // Try to extract quoted strings or bullet points
      const extractedSuggestions = aiSuggestionResponse
        .match(/"([^"]{1,25})"/g)?.map((s: string) => s.replace(/"/g, '')) || 
        aiSuggestionResponse
          .split('\n')
          .map((line: string) => line.replace(/^[\d\-\*\•]\s*/, '').trim())
          .filter((s: string) => s.length > 0 && s.length <= 25)
          .slice(0, 4);

      if (extractedSuggestions && extractedSuggestions.length > 0) {
        return new Response(
          JSON.stringify({
            success: true,
            suggestions: extractedSuggestions,
            usage: data.usage,
            fallback: true
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      } else {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Could not parse AI suggestions'
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

  } catch (error) {
    console.error('Suggestion generation error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to generate contextual suggestions'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}