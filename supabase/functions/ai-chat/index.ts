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
        messages: messages.map(msg => ({
          role: msg.role,
          content: typeof msg.content === 'string' 
            ? [{ type: "text", text: msg.content }]
            : msg.content
        })),
        max_tokens: maxTokens,
        temperature: temperature,
        stream: false,
        reasoning_effort: "low",
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "therapeutic_response",
            strict: true,
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  description: "The therapeutic response message from Anu"
                },
                suggestions: {
                  type: "array",
                  items: {
                    type: "string"
                  },
                  minItems: 2,
                  maxItems: 4,
                  description: "2-4 short user reply suggestions (2-5 words each) that are direct responses to the message"
                },
                nextStep: {
                  type: "boolean",
                  description: "For exercises only: true if the therapeutic goal of current step is achieved and ready to advance, false to stay in current step for deeper exploration"
                }
              },
              required: ["message", "suggestions"],
              additionalProperties: false
            }
          }
        }
      }),
    });

    // Handle non-streaming response
    if (!response.ok) {
      const errorData = await response.json();
      console.log('🔴 OpenRouter API error response:', { status: response.status, data: errorData, model: model });
      
      // Check if the error is related to structured output not being supported
      if (errorData?.error?.message?.includes('json_schema') || errorData?.error?.message?.includes('response_format')) {
        console.log('🔴 Model may not support structured output, falling back...');
        // TODO: Implement fallback without structured output
      }
      let errorMessage = 'API request failed';
      
      if (response.status === 401) {
        errorMessage = 'Invalid API key';
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please wait a moment before trying again.';
      } else if (response.status === 402) {
        errorMessage = 'Insufficient credits. Please check your OpenRouter account balance.';
      } else if (response.status === 400 && errorData?.error?.message?.includes('model')) {
        errorMessage = `Model '${model}' not found or not available. Please check the model name.`;
      } else if (errorData?.error?.message) {
        errorMessage = errorData.error.message;
      }
      
      console.error('OpenRouter API error:', { status: response.status, error: errorMessage, fullData: errorData });

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

    // Process regular response
    const data = await response.json();
    console.log('API response data:', data);

    const choice = data.choices?.[0];
    console.log('AI choice received:', choice);
    console.log('Choice message:', choice?.message);
    console.log('Choice content:', choice?.message?.content);
    
    // Handle both string content and structured content array
    let messageContent = '';
    
    if (choice?.message?.content) {
      if (typeof choice.message.content === 'string') {
        messageContent = choice.message.content;
      } else if (Array.isArray(choice.message.content)) {
        // Extract text from structured content array
        messageContent = choice.message.content
          .filter(item => item.type === 'text')
          .map(item => item.text)
          .join(' ');
      }
    }
    
    console.log('🔍 Extracted messageContent type:', typeof messageContent);
    console.log('🔍 Extracted messageContent preview:', messageContent.substring(0, 300) + '...');
    
    if (!messageContent || messageContent.trim().length === 0) {
      console.error('No content in AI response:', { 
        choices: data.choices, 
        choice,
        messageContent,
        contentType: typeof choice?.message?.content
      });
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `No response content received from AI. Model: ${model}. Content type: ${typeof choice?.message?.content}. Response structure: ${JSON.stringify(data).substring(0, 300)}...` 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('🔍 Raw messageContent before parsing:', messageContent);
    
    // With structured output, the content should already be parsed JSON
    let cleanedMessage = '';
    let suggestions: string[] = [];
    
    try {
      // First, try to extract JSON from markdown code blocks if present
      let jsonString = messageContent;
      console.log('🔍 Initial messageContent:', messageContent);
      
      const codeBlockMatch = messageContent.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
      if (codeBlockMatch) {
        jsonString = codeBlockMatch[1].trim();
        console.log('🔧 Found code block, extracted JSON:', jsonString);
      } else {
        console.log('🔍 No code block found, trying direct parsing');
      }
      
      console.log('🔍 About to parse JSON string:', jsonString.substring(0, 300));
      const jsonResponse = JSON.parse(jsonString);
      console.log('🔍 Successfully parsed JSON response:', jsonResponse);
      
      if (jsonResponse.message && jsonResponse.suggestions) {
        cleanedMessage = jsonResponse.message.trim();
        suggestions = Array.isArray(jsonResponse.suggestions) 
          ? jsonResponse.suggestions.slice(0, 4) 
          : [];
        console.log('✅ Successfully extracted from JSON:', { cleanedMessage: cleanedMessage.substring(0, 100), suggestions });
      } else {
        console.log('⚠️ JSON missing required fields, using fallback');
        cleanedMessage = messageContent;
        suggestions = [];
      }
    } catch (e) {
      console.log('⚠️ Not JSON, using fallback parsing');
      const result = parseStructuredResponse(messageContent);
      cleanedMessage = result.cleanedMessage;
      suggestions = result.suggestions;
    }
    
    console.log('🔍 After parsing - cleanedMessage:', cleanedMessage);
    console.log('🔍 After parsing - suggestions:', suggestions);
    
    // Final validation before sending response
    if (!cleanedMessage || cleanedMessage.includes('```json')) {
      console.error('🔴 PARSING FAILED - cleanedMessage still contains raw content!');
      console.error('🔴 Raw messageContent:', messageContent);
      console.error('🔴 cleanedMessage:', cleanedMessage);
    }

    const aiResponse: AIResponse = {
      success: true,
      message: cleanedMessage || 'Error processing response',
      usage: data.usage,
      suggestions: suggestions.length > 0 ? suggestions : undefined
    };
    
    console.log('🔍 Final API response being sent:', aiResponse);

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

// Check if model supports structured output
function supportsStructuredOutput(model: string): boolean {
  const supportedModels = [
    'openai/gpt-4o',
    'openai/gpt-4o-mini',
    'openai/gpt-4o-2024-08-06',
    // Add other supported models as needed
  ];
  
  return supportedModels.some(supportedModel => model.includes(supportedModel.split('/')[1]));
}

// Parse legacy response with mixed text and embedded suggestions
function parseLegacyResponse(content: string): { cleanedMessage: string; suggestions: string[] } {
  console.log('🔍 Parsing legacy response:', content.substring(0, 200) + '...');
  
  try {
    // Method 1: Try to parse if AI returned pure JSON despite no schema requirement
    const jsonResponse = JSON.parse(content);
    if (jsonResponse.message && jsonResponse.suggestions) {
      console.log('✅ Found JSON in legacy response');
      return {
        cleanedMessage: jsonResponse.message.trim(),
        suggestions: Array.isArray(jsonResponse.suggestions) ? jsonResponse.suggestions.slice(0, 4) : []
      };
    }
  } catch (e) {
    // Not JSON, continue with text parsing
  }
  
  // Method 2: Look for "suggestions:" text followed by list
  const suggestionsMatch = content.match(/suggestions:\s*\n((?:\*\s*"[^"]+"\s*\n?)*)/i);
  if (suggestionsMatch) {
    const suggestionLines = suggestionsMatch[1];
    const suggestions = suggestionLines
      .match(/"([^"]+)"/g)
      ?.map(s => s.replace(/"/g, '').trim())
      .filter(s => s.length > 0)
      .slice(0, 4) || [];
    
    const cleanedMessage = content.replace(suggestionsMatch[0], '').replace(/---+/, '').trim();
    console.log('✅ Parsed suggestions from text format');
    return { cleanedMessage, suggestions };
  }
  
  // Method 3: Remove any visible suggestion formatting and return message only
  const cleaned = content
    .replace(/---+/g, '')
    .replace(/suggestions:\s*\n(?:\*\s*"[^"]*"\s*\n?)*/gi, '')
    .trim();
  
  console.log('⚠️ No structured suggestions found, returning cleaned text');
  return { cleanedMessage: cleaned, suggestions: [] };
}

// Parse structured JSON response from OpenRouter's json_schema
function parseStructuredResponse(content: string): { cleanedMessage: string; suggestions: string[] } {
  console.log('🔍 Parsing structured JSON response:', content.substring(0, 200) + '...');
  
  try {
    // With structured outputs, the content should always be valid JSON
    const jsonResponse = JSON.parse(content);
    
    if (jsonResponse.message && jsonResponse.suggestions) {
      console.log('✅ Successfully parsed structured JSON response');
      
      const suggestions = Array.isArray(jsonResponse.suggestions)
        ? jsonResponse.suggestions
            .filter((s: any) => typeof s === 'string')
            .map((s: string) => s.trim())
            .filter((s: string) => s.length > 0 && s.length <= 30) // Allow slightly longer
            .slice(0, 4)
        : [];
      
      return {
        cleanedMessage: jsonResponse.message.trim(),
        suggestions
      };
    } else {
      console.log('⚠️ JSON structure missing required fields:', jsonResponse);
    }
  } catch (e) {
    console.log('❌ Failed to parse structured response:', e);
    console.log('Raw content:', content);
    
    // Enhanced fallback: try to extract suggestions from bullet points or lines
    const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const suggestions: string[] = [];
    let messageLines: string[] = [];
    let inSuggestionMode = false;
    
    for (const line of lines) {
      // Check if this line indicates suggestions start
      if (line.toLowerCase().includes('suggestions') || line.match(/^\*\s+/)) {
        inSuggestionMode = true;
      }
      
      if (inSuggestionMode && line.match(/^\*\s+(.+)/)) {
        // Extract suggestion from bullet point
        const suggestion = line.replace(/^\*\s+/, '').replace(/"/g, '').trim();
        if (suggestion.length > 0 && suggestion.length <= 30) {
          suggestions.push(suggestion);
        }
      } else if (!inSuggestionMode) {
        // Add to message if not in suggestion mode
        messageLines.push(line);
      }
    }
    
    const cleanedMessage = messageLines.join(' ').trim();
    console.log('🔧 Fallback parsing extracted:', { cleanedMessage: cleanedMessage.substring(0, 100), suggestions });
    
    return {
      cleanedMessage: cleanedMessage || content.trim(),
      suggestions: suggestions.slice(0, 4)
    };
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