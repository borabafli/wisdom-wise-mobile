import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Types for thought pattern extraction
interface Message {
  id: string;
  type: 'user' | 'system' | 'exercise';
  text?: string;
  content?: string;
  timestamp: string;
}

interface ThoughtPattern {
  id: string;
  originalThought: string;
  distortionTypes: string[];
  reframedThought: string;
  confidence: number;
  extractedFrom: {
    messageId: string;
    sessionId: string;
  };
  timestamp: string;
  context?: string;
}

interface ExtractInsightsRequest {
  messages: Message[];
  sessionId: string;
  userId?: string;
}

interface ExtractInsightsResponse {
  success: boolean;
  patterns?: ThoughtPattern[];
  error?: string;
  processingTime?: number;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
  'Access-Control-Max-Age': '86400',
};

// CBT cognitive distortions reference
const COGNITIVE_DISTORTIONS = [
  'All-or-Nothing Thinking',
  'Overgeneralization', 
  'Mental Filter',
  'Disqualifying the Positive',
  'Jumping to Conclusions',
  'Mind Reading',
  'Fortune Telling',
  'Magnification/Catastrophizing',
  'Minimization',
  'Emotional Reasoning',
  'Should Statements',
  'Labeling',
  'Personalization',
  'Blame'
];

Deno.serve(async (req: Request) => {
  const startTime = performance.now();
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
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
    // Get API key from environment
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    
    if (!OPENROUTER_API_KEY) {
      return new Response(JSON.stringify({
        success: false,
        error: 'API key not configured'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Parse request body
    const requestBody: ExtractInsightsRequest = await req.json();
    const { messages, sessionId, userId } = requestBody;

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Messages array is required and cannot be empty'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Extract insights using LLM
    const patterns = await extractThoughtPatterns(OPENROUTER_API_KEY, messages, sessionId);
    
    const processingTime = performance.now() - startTime;

    const response: ExtractInsightsResponse = {
      success: true,
      patterns,
      processingTime: Math.round(processingTime)
    };

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Insight extraction error:', error);
    const processingTime = performance.now() - startTime;
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to extract insights',
        processingTime: Math.round(processingTime)
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function extractThoughtPatterns(
  apiKey: string, 
  messages: Message[], 
  sessionId: string
): Promise<ThoughtPattern[]> {
  
  // Filter user messages that might contain automatic thoughts
  const userMessages = messages.filter(msg => 
    msg.type === 'user' && 
    (msg.text || msg.content) && 
    (msg.text || msg.content)!.length > 10
  );

  if (userMessages.length === 0) {
    return [];
  }

  // Prepare conversation context
  const conversationContext = messages
    .slice(-10) // Last 10 messages for context
    .map(msg => {
      const content = msg.text || msg.content || '';
      const speaker = msg.type === 'user' ? 'User' : 'Therapist';
      return `${speaker}: ${content}`;
    })
    .join('\n\n');

  // Create analysis prompt
  const analysisPrompt = createAnalysisPrompt(conversationContext, userMessages);

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
        model: 'anthropic/claude-3.5-sonnet', // Best model for analysis
        messages: [
          {
            role: 'system',
            content: `You are an expert CBT therapist analyzing conversation patterns. Extract automatic thoughts and cognitive distortions with high accuracy.`
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.3, // Lower temperature for consistent analysis
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisResult = data.choices?.[0]?.message?.content;

    if (!analysisResult) {
      throw new Error('No analysis result received');
    }

    // Parse the LLM response to extract structured thought patterns
    return parseAnalysisResult(analysisResult, userMessages, sessionId);

  } catch (error) {
    console.error('LLM analysis error:', error);
    return [];
  }
}

function createAnalysisPrompt(conversationContext: string, userMessages: Message[]): string {
  return `
Analyze this therapy conversation for CBT thought patterns. Focus on identifying automatic thoughts and cognitive distortions.

CONVERSATION:
${conversationContext}

TASK: Extract thought patterns from the user's messages. For each automatic thought identified:

1. Quote the EXACT automatic thought from the user's message
2. Identify the cognitive distortions present (from the list below)
3. Provide a realistic, balanced reframe
4. Assign a confidence score (0.0-1.0)

COGNITIVE DISTORTIONS TO IDENTIFY:
${COGNITIVE_DISTORTIONS.map((d, i) => `${i + 1}. ${d}`).join('\n')}

OUTPUT FORMAT (JSON):
{
  "thoughtPatterns": [
    {
      "originalThought": "exact quote from user",
      "distortionTypes": ["distortion name", "another distortion"],
      "reframedThought": "balanced, realistic alternative thought",
      "confidence": 0.85,
      "context": "brief context about when this occurred",
      "sourceMessage": "partial quote to identify source message"
    }
  ]
}

GUIDELINES:
- Only extract thoughts that show clear cognitive distortions
- Be conservative - high accuracy over quantity
- Reframes should be realistic, not just positive
- Include enough context to understand the situation
- Confidence should reflect how clear the distortion is

Analyze the conversation now:`;
}

function parseAnalysisResult(
  analysisResult: string, 
  userMessages: Message[], 
  sessionId: string
): ThoughtPattern[] {
  try {
    // Extract JSON from the response
    const jsonMatch = analysisResult.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in analysis result');
      return [];
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const thoughtPatterns = parsed.thoughtPatterns || [];

    return thoughtPatterns.map((pattern: any, index: number) => {
      // Find the source message by matching content
      const sourceMessage = userMessages.find(msg => {
        const content = msg.text || msg.content || '';
        return content.includes(pattern.originalThought) || 
               (pattern.sourceMessage && content.includes(pattern.sourceMessage));
      }) || userMessages[0]; // Fallback to first message

      return {
        id: `pattern_${sessionId}_${Date.now()}_${index}`,
        originalThought: pattern.originalThought || '',
        distortionTypes: Array.isArray(pattern.distortionTypes) ? pattern.distortionTypes : [],
        reframedThought: pattern.reframedThought || '',
        confidence: Math.min(1, Math.max(0, pattern.confidence || 0.5)),
        extractedFrom: {
          messageId: sourceMessage.id,
          sessionId: sessionId
        },
        timestamp: new Date().toISOString(),
        context: pattern.context || ''
      } as ThoughtPattern;
    });

  } catch (error) {
    console.error('Failed to parse analysis result:', error);
    console.error('Raw result:', analysisResult);
    return [];
  }
}