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
  action: 'extract_patterns' | 'extract_insights' | 'generate_summary' | 'consolidate_summaries' | 'extract_vision_insights';
  summaries?: string[]; // For consolidation
}

interface ExtractInsightsResponse {
  success: boolean;
  patterns?: ThoughtPattern[];
  insights?: any[];
  summary?: string;
  consolidated_summary?: string;
  visionInsights?: any;
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

const INSIGHT_EXTRACTION_PROMPT = `You are analyzing a therapy conversation to extract meaningful long-term insights. Extract insights into these 6 categories ONLY if they are clearly present and therapeutically significant.

**EXTRACTION CRITERIA:**
- Only extract insights that represent clear patterns across multiple messages
- Focus on recurring themes, not isolated incidents
- Each insight should be 1-2 sentences and therapeutically valuable
- Assign confidence scores based on evidence strength

**CATEGORIES:**
1. **automatic_thoughts**: Recurring negative thought patterns, cognitive distortions, self-critical inner dialogue
2. **emotions**: Emotional patterns, regulation strategies, triggers, recurring feelings
3. **behaviors**: Coping behaviors, avoidance patterns, behavioral responses to stress
4. **values_goals**: Core values, life priorities, meaningful goals, what drives the person
5. **strengths**: Resilience factors, positive coping skills, personal resources
6. **life_context**: Important relationships, life circumstances, environmental factors

**RESPONSE FORMAT:**
Return only a JSON object with this structure:
{
  "insights": [
    {
      "category": "automatic_thoughts",
      "content": "Frequently engages in catastrophic thinking about work performance",
      "confidence": 0.85
    }
  ]
}`;

const SESSION_SUMMARY_PROMPT = `Create a meaningful and actionable session summary (1-5 sentences) that captures key insights the user can apply to their life. This will be used for therapeutic continuity and user reflection.

**PRIMARY FOCUS:**
- Start with "Insight:" when there's a clear breakthrough or realization
- Capture what the user discovered about themselves, their patterns, or their situation
- Include actionable elements - what they learned they can do differently
- Make it personal and specific to their experience

**EXAMPLES OF EXCELLENT SUMMARIES:**
- "Insight: You realized your anxiety stems from trying to control outcomes you can't influence, not from the actual situations themselves. This awareness gives you permission to focus energy on what you can control instead."
- "You made a powerful connection between your childhood need to be 'perfect' and your current difficulty accepting compliments. Understanding this pattern opens up space to practice receiving positive feedback without immediately dismissing it."
- "Insight: You discovered that your stress comes mainly from deadlines and time pressure, not from the work itself. This distinction helps you see that better time management rather than career change might address the root issue."
- "Through exploring your relationship patterns, you recognized that your fear of vulnerability stems from past betrayal. This insight helps explain why you pull away when relationships deepen, giving you awareness to choose differently next time."

**WHAT TO INCLUDE:**
- Specific insights, realizations, or "aha moments"
- Connections between past experiences and current patterns
- Emotional shifts or new perspectives gained
- Practical applications or next steps identified
- Root causes or underlying patterns discovered

**AVOID:**
- Generic statements like "discussed feelings about work"
- Vague summaries without specific insights
- Therapy jargon that doesn't help the user
- Simple recaps without meaningful discoveries

Return only the actionable summary text - no additional formatting or explanation.`;

const CONSOLIDATION_PROMPT = `You are consolidating multiple therapy session summaries to create a comprehensive overview of the user's therapeutic journey. This consolidated summary will be used to maintain long-term context continuity.

**ANALYZE AND SYNTHESIZE:**

1. **Recurring Patterns**: What themes, concerns, or emotional patterns appear across multiple sessions?

2. **Core Issues**: What are the underlying issues or root causes that keep emerging?

3. **Therapeutic Progress**: How has the user's self-awareness, coping skills, or emotional regulation evolved?

4. **Thought Pattern Evolution**: How have the user's automatic thoughts or cognitive patterns changed over time?

5. **Coping Strategy Development**: What tools, techniques, or insights have proven most helpful?

6. **Ongoing Challenges**: What areas still need continued therapeutic attention?

7. **Strengths & Growth**: What positive changes, strengths, or resilience factors have emerged?

**CONSOLIDATION FORMAT:**
Create a cohesive paragraph (4-6 sentences) that tells the story of the user's therapeutic journey. Focus on the most therapeutically significant themes and developments that would be essential for providing consistent, informed support.

**EXAMPLE GOOD CONSOLIDATION:**
"User's sessions have consistently centered around work-related perfectionism and its impact on self-worth and relationships. Initially struggled with all-or-nothing thinking and harsh self-criticism, particularly when receiving feedback. Over time, developed greater awareness of the connection between childhood experiences of criticism and current anxiety patterns. Has made progress in challenging catastrophic thinking and implementing self-compassion practices, though still working on applying these skills in high-pressure situations. Shows strong analytical abilities and willingness to examine difficult patterns, with increasing recognition of personal strengths and resilience."

Return only the consolidated summary text - no additional formatting or explanation.`;

const VISION_EXTRACTION_PROMPT = `You are analyzing a Vision of the Future exercise session to extract structured insights. The user has completed an exercise imagining their future self and connecting emotionally with that vision.

**EXTRACT THE FOLLOWING:**

1. **Core Qualities/Values**: Character traits and values the future self embodies (e.g., grounded, confident, connected, joyful, balanced, calm, etc.)

2. **Life Domains**: How the future self shows up in different areas:
   - Relationships (family, friends, community)
   - Health & Well-being (physical, mental, spiritual practices)
   - Career/Work (meaningful work, professional qualities)
   - Creativity/Hobbies (creative expression, personal interests)
   - Lifestyle (daily routines, environment, way of living)

3. **Guiding Sentences**: 2-3 short, meaningful affirmations or mantras that capture the essence of their vision (like "I live with balance and calm" or "I trust myself and my choices")

4. **Practical Takeaways**: 1-2 specific, small steps they identified for today/this week to align with their future self

5. **Full Description**: A beautifully written 2-3 sentence summary of their complete vision that they can return to for inspiration

6. **Emotional Connection**: How it feels to embody this future self (emotional states, body sensations, overall feeling)

7. **Wisdom Exchange**: Any guidance, encouragement, or perspective their future self offered to their present self

**RESPONSE FORMAT:**
Return only a JSON object with this structure:
{
  "coreQualities": ["quality1", "quality2"],
  "lifeDomains": {
    "relationships": "description of relationship vision",
    "health": "description of health/wellbeing vision",
    "career": "description of work/career vision",
    "creativity": "description of creative/hobby vision",
    "lifestyle": "description of lifestyle vision"
  },
  "guidingSentences": ["sentence1", "sentence2"],
  "practicalTakeaways": ["takeaway1", "takeaway2"],
  "fullDescription": "Beautiful 2-3 sentence vision summary",
  "emotionalConnection": "How it feels to be this future self",
  "wisdomExchange": "Guidance from future self to present self",
  "confidence": 0.85
}

**Only include domains that were meaningfully discussed. If a domain wasn't explored, omit it from lifeDomains.**`;

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
    let { messages, sessionId, userId, action = 'extract_patterns', summaries } = requestBody;

    // Normalize message format - convert role field to type field if needed
    if (messages) {
      messages = messages.map(msg => {
        // If message has 'role' field, convert to 'type' field
        if ('role' in msg && !('type' in msg)) {
          return {
            ...msg,
            type: msg.role === 'assistant' ? 'system' : msg.role,
            text: msg.content || msg.text
          };
        }
        return msg;
      });
    }

    if (!messages && action !== 'consolidate_summaries') {
      return new Response(JSON.stringify({
        success: false,
        error: 'Messages array is required for this action'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    let response: ExtractInsightsResponse = { success: false };

    switch (action) {
      case 'extract_patterns':
        // Original thought pattern extraction
        const patterns = await extractThoughtPatterns(OPENROUTER_API_KEY, messages, sessionId);
        response = {
          success: true,
          patterns,
          processingTime: Math.round(performance.now() - startTime)
        };
        break;

      case 'extract_insights':
        // New memory insights extraction
        const insights = await extractMemoryInsights(OPENROUTER_API_KEY, messages);
        response = {
          success: true,
          insights: insights.filter(insight => insight.confidence >= 0.6),
          processingTime: Math.round(performance.now() - startTime)
        };
        break;

      case 'generate_summary':
        // Generate session summary
        const summary = await generateSessionSummary(OPENROUTER_API_KEY, messages);
        response = {
          success: true,
          summary,
          processingTime: Math.round(performance.now() - startTime)
        };
        break;

      case 'consolidate_summaries':
        // Consolidate multiple summaries
        if (!summaries || summaries.length === 0) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Summaries array is required for consolidation'
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        
        const consolidatedSummary = await consolidateSummaries(OPENROUTER_API_KEY, summaries);
        response = {
          success: true,
          consolidated_summary: consolidatedSummary,
          processingTime: Math.round(performance.now() - startTime)
        };
        break;

      case 'extract_vision_insights':
        // Extract vision of the future insights
        const visionInsights = await extractVisionInsights(OPENROUTER_API_KEY, messages);
        response = {
          success: !!visionInsights,
          visionInsights,
          processingTime: Math.round(performance.now() - startTime)
        };
        break;

      default:
        return new Response(JSON.stringify({
          success: false,
          error: `Unknown action: ${action}`
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

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

async function extractMemoryInsights(apiKey: string, messages: Message[]): Promise<any[]> {
  try {
    // Get relevant messages for insight extraction
    const relevantMessages = messages
      .filter(msg => (msg.type === 'user' || msg.type === 'system') && (msg.text || msg.content))
      .slice(-20)
      .map(msg => {
        const content = msg.text || msg.content || '';
        const speaker = msg.type === 'user' ? 'User' : 'Therapist';
        return `${speaker}: ${content}`;
      })
      .join('\n\n');

    if (!relevantMessages.trim()) {
      return [];
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://wisdomwise.app',
        'X-Title': 'WisdomWise',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'system',
            content: INSIGHT_EXTRACTION_PROMPT
          },
          {
            role: 'user',
            content: `Analyze this therapy conversation and extract meaningful insights:\n\n${relevantMessages}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.3,
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;

    if (!result) {
      return [];
    }

    // Parse JSON response
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return [];
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.insights || [];
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return [];
    }

  } catch (error) {
    console.error('Error extracting memory insights:', error);
    return [];
  }
}

async function generateSessionSummary(apiKey: string, messages: Message[]): Promise<string> {
  try {
    // Get relevant messages for summary
    const relevantMessages = messages
      .filter(msg => (msg.type === 'user' || msg.type === 'system') && (msg.text || msg.content))
      .slice(-30)
      .map(msg => {
        const content = msg.text || msg.content || '';
        const speaker = msg.type === 'user' ? 'User' : 'Therapist';
        return `${speaker}: ${content}`;
      })
      .join('\n\n');

    if (!relevantMessages.trim()) {
      return `Session covered ${messages.filter(msg => msg.type === 'user').length} user exchanges focusing on personal reflection and therapeutic dialogue.`;
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://wisdomwise.app',
        'X-Title': 'WisdomWise',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'system',
            content: SESSION_SUMMARY_PROMPT
          },
          {
            role: 'user',
            content: `Create a concise summary of this therapy session:\n\n${relevantMessages}`
          }
        ],
        max_tokens: 200,
        temperature: 0.3,
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`);
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content?.trim();

    return summary || `Therapeutic session with ${messages.filter(msg => msg.type === 'user').length} user responses, exploring personal insights and emotional patterns.`;

  } catch (error) {
    console.error('Error generating session summary:', error);
    return `Therapeutic session with ${messages.filter(msg => msg.type === 'user').length} user responses, exploring personal insights and emotional patterns.`;
  }
}

async function consolidateSummaries(apiKey: string, summaries: string[]): Promise<string> {
  try {
    const summariesText = summaries
      .map((summary, index) => `Session ${index + 1}: ${summary}`)
      .join('\n\n');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://wisdomwise.app',
        'X-Title': 'WisdomWise',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'system',
            content: CONSOLIDATION_PROMPT
          },
          {
            role: 'user',
            content: `Consolidate these therapy session summaries:\n\n${summariesText}`
          }
        ],
        max_tokens: 300,
        temperature: 0.3,
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`);
    }

    const data = await response.json();
    const consolidatedSummary = data.choices?.[0]?.message?.content?.trim();

    return consolidatedSummary || `Consolidated analysis of ${summaries.length} therapy sessions showing ongoing therapeutic progress and recurring themes in personal development.`;

  } catch (error) {
    console.error('Error consolidating summaries:', error);
    return `Consolidated analysis of ${summaries.length} therapy sessions showing ongoing therapeutic progress and recurring themes in personal development.`;
  }
}

async function extractVisionInsights(apiKey: string, messages: Message[]): Promise<any | null> {
  try {
    // Get relevant messages for vision insight extraction
    const relevantMessages = messages
      .filter(msg => (msg.type === 'user' || msg.type === 'system') && (msg.text || msg.content))
      .slice(-30)
      .map(msg => {
        const content = msg.text || msg.content || '';
        const speaker = msg.type === 'user' ? 'User' : 'Therapist';
        return `${speaker}: ${content}`;
      })
      .join('\n\n');

    if (!relevantMessages.trim()) {
      return null;
    }

    // Check if this actually contains vision-related content
    const visionKeywords = [
      'vision of the future',
      'future self',
      'imagine your future',
      'envisioning',
      'future vision',
      'how will you live',
      'your future life',
      'future you',
      'years from now'
    ];

    const relevantText = relevantMessages.toLowerCase();
    const hasVisionContent = visionKeywords.some(keyword => relevantText.includes(keyword));

    if (!hasVisionContent) {
      return null;
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://wisdomwise.app',
        'X-Title': 'WisdomWise',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'system',
            content: VISION_EXTRACTION_PROMPT
          },
          {
            role: 'user',
            content: `Analyze this Vision of the Future exercise session and extract structured insights:\n\n${relevantMessages}`
          }
        ],
        max_tokens: 1500,
        temperature: 0.3,
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;

    if (!result) {
      return null;
    }

    // Parse JSON response
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return null;
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate that we have meaningful vision content
      if (!parsed.coreQualities || parsed.coreQualities.length === 0) {
        return null;
      }

      return parsed;
    } catch (parseError) {
      console.error('JSON parse error for vision insights:', parseError);
      return null;
    }

  } catch (error) {
    console.error('Error extracting vision insights:', error);
    return null;
  }
}