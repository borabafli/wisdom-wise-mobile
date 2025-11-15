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
  sessionId?: string; // Optional - required for extract_patterns, optional for others
  userId?: string;
  action: 'extract_patterns' | 'extract_insights' | 'generate_summary' | 'consolidate_summaries' | 'extract_vision_insights' | 'generate_vision_summary' | 'extract_values';
  summaries?: string[]; // For consolidation
}

interface ExtractInsightsResponse {
  success: boolean;
  patterns?: ThoughtPattern[];
  insights?: any[];
  summary?: string;
  consolidated_summary?: string;
  visionInsights?: any;
  values?: any[]; // Extracted values from values-clarification exercise
  message?: string; // For contextService compatibility
  error?: string;
  processingTime?: number;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
  'Access-Control-Max-Age': '86400',
};

// Helper function to filter out trivial extractions
function isTrivialgainextract(content: string): boolean {
  const trivialPatterns = [
    /^(good morning|hello|hi|hey|how are you|thank you|thanks|ok|okay|yes|no|sure|alright)$/i,
    /^(let's start|let's begin|i understand|got it|makes sense|that's right)$/i,
    /^(i see|i get it|sounds good|perfect|great|nice|cool)$/i,
    /^[^a-zA-Z]*$/,  // Only punctuation or numbers
    /^.{1,10}$/,     // Very short responses
  ];

  return trivialPatterns.some(pattern => pattern.test(content.trim()));
}

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

const INSIGHT_EXTRACTION_PROMPT = `You are analyzing a therapy conversation to extract meaningful long-term insights. Extract insights into these 6 categories ONLY if they are clearly present, therapeutically significant, and personally relevant.

**STRICT EXTRACTION CRITERIA:**
- NEVER extract trivial exchanges like greetings ("Good Morning", "Hello", "How are you?")
- NEVER extract procedural responses ("Let's start", "Thank you", "I understand")
- NEVER extract single-word or short phrase responses without context
- Only extract insights that represent clear patterns across multiple messages (minimum 3+ related exchanges)
- Focus on recurring themes, personal struggles, meaningful self-discovery, or emotional patterns
- Each insight must be personally relevant and therapeutically valuable (minimum 20 words)
- Assign confidence scores based on evidence strength and personal relevance
- Require minimum confidence of 0.75 for any extraction

**CATEGORIES (Only extract if substantial evidence exists):**
1. **automatic_thoughts**: Recurring negative thought patterns, cognitive distortions, self-critical inner dialogue that show consistent patterns
2. **emotions**: Emotional patterns, regulation strategies, triggers, recurring feelings that indicate deeper themes
3. **behaviors**: Coping behaviors, avoidance patterns, behavioral responses to stress that form recognizable patterns
4. **values_goals**: Core values, life priorities, meaningful goals, what drives the person (NOT superficial preferences)
5. **strengths**: Resilience factors, positive coping skills, personal resources demonstrated consistently
6. **life_context**: Important relationships, life circumstances, environmental factors with therapeutic relevance

**CRITICAL VALIDATION RULES:**

1. **BE SPECIFIC, NOT VAGUE**: Do not use generic statements that could apply to anyone. Include specific details from the conversation.
   - ❌ BAD: "User experiences stress at work"
   - ✅ GOOD: "User experiences acute anxiety during client presentations, particularly when presenting to senior stakeholders, stemming from fear of being perceived as incompetent"

2. **REQUIRE CLEAR EVIDENCE**: The pattern must appear in at least 3 different exchanges or be explicitly stated multiple times.
   - If user mentions something once in passing, do NOT extract it
   - If user explores a topic in depth across multiple messages, extract it

3. **NO HALLUCINATION**: Do not infer patterns that aren't explicitly discussed. Stick to what the user actually shared.

4. **RETURN EMPTY IF NOTHING CLEAR**: If the conversation is too brief, superficial, or lacks therapeutic depth, return:
{
  "insights": []
}
This is better than extracting weak patterns.

5. **MINIMUM CONFIDENCE 0.75**: Only extract patterns where you have high confidence based on clear, repeated evidence.

**QUALITY FILTERS:**
- Content must be at least 20 words describing a meaningful pattern with specific details
- Must relate to personal growth, mental health, or therapeutic development
- Must show evidence from multiple conversation exchanges
- Must be actionable or reflective for the user's journey
- Must be specific to this user, not generic therapy language

**VALID REASONS TO RETURN EMPTY ARRAY:**
- Conversation was too brief (fewer than 8-10 meaningful exchanges)
- Only surface-level topics were discussed
- No recurring patterns emerged
- Conversation was primarily logistical or procedural
- User didn't share enough personal or emotional content

**RESPONSE FORMAT:**
Return only a JSON object with this structure:
{
  "insights": [
    {
      "category": "automatic_thoughts",
      "content": "Shows a consistent pattern of catastrophic thinking about work performance, particularly anticipating negative outcomes when receiving feedback from managers, often imagining termination scenarios even when feedback is constructive",
      "confidence": 0.85
    }
  ]
}

**QUALITY OVER QUANTITY**: Better to extract 0-2 highly specific insights than 5+ vague ones.`;

const SESSION_SUMMARY_PROMPT = `Create a warm, personal session summary (1-4 sentences) that feels like clear feedback from a caring friend. Write directly TO the user, using "you" language. Make it encouraging and recognizable to them.

**TONE GUIDELINES:**
- Write like you're speaking directly to the user, not about them
- Use simple, everyday language - no therapy jargon or clinical terms  
- Focus on what they discovered, not what they "discussed" or "explored"
- Sound encouraging and motivated, like a supportive friend giving feedback
- Keep it conversational and warm, not formal or academic

**EXCELLENT EXAMPLES:**
- "You realized something important today: your anxiety isn't really about the situations themselves, but about trying to control things you can't change. This gives you permission to focus your energy where it actually makes a difference."
- "You made a powerful connection between always needing to be 'perfect' as a kid and why compliments feel so uncomfortable now. Recognizing this pattern means you can start practicing just saying 'thank you' instead of deflecting."
- "You discovered that it's not your job that's stressing you out - it's the time pressure and deadlines. This insight opens up some practical options like better planning or having honest conversations about workload."
- "You recognized how your past experience with betrayal makes you pull away when relationships get deeper. Now that you see this pattern, you can choose differently next time someone gets close."

**FOCUS ON:**
- What they personally realized or figured out
- How this insight helps them going forward  
- Specific, concrete discoveries they made
- Their strengths and growth in the conversation

**AVOID:**
- Clinical language like "explored themes" or "processed feelings"
- Talking ABOUT them instead of TO them ("The user discovered..." vs "You discovered...")
- Generic summaries that could apply to anyone
- Overly formal or academic tone

Write as if you're summarizing their insights back to them in a caring, clear way.`;

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

const VALUES_EXTRACTION_PROMPT = `You are analyzing a Values Clarification exercise conversation to extract the user's core values. The user has completed an exercise exploring what truly matters to them in life.

**EXTRACT THE FOLLOWING:**

For each clearly identified value, extract:
1. **Value Name**: A clear, concise name for the value (e.g., "Connection", "Freedom", "Growth", "Health", "Creativity", "Achievement")
2. **User Description**: The user's own words describing what this value means to them personally and why it's important (2-4 sentences, direct quotes preferred)
3. **Importance**: How important this value is to the user on a 1-5 scale:
   - 5: Absolutely essential, core to their identity, mentioned as "most important" or "everything"
   - 4: Very important, clearly significant, mentioned with strong emotion or emphasis
   - 3: Important but not central, mentioned as "matters" or "care about"
   - 2: Somewhat important, mentioned briefly without much emphasis
   - 1: Acknowledged but not deeply important
4. **Tags**: 3-5 related keywords that connect to this value (e.g., ["family", "connection", "relationships", "love"])

**EXTRACTION CRITERIA:**
- Only extract values that are clearly and explicitly discussed in depth
- The user must have shared personal meaning, not just mentioned the word
- Look for values that came up multiple times or were explored emotionally
- Prefer the user's own language and descriptions - avoid generic therapy language
- Each value should have substantial personal context (not just "I value health")
- Confidence threshold: only extract if you're 80%+ confident this is a genuine core value

**COMMON CORE VALUES (for reference, not exhaustive):**
Family, Friendship, Connection, Love, Growth, Learning, Creativity, Adventure, Stability, Security, Health, Wellness, Freedom, Independence, Achievement, Success, Authenticity, Compassion, Kindness, Justice, Peace, Beauty, Wisdom, Courage, Integrity, Spirituality, Service, Excellence, Balance, Fun, Humor

**RESPONSE FORMAT:**
Return only a JSON object with this structure:
{
  "values": [
    {
      "name": "Connection",
      "userDescription": "Being close to my family and friends gives me strength. I feel most alive when I'm sharing meaningful moments with people I care about. Deep relationships are what make life worth living for me.",
      "importance": 5,
      "tags": ["family", "friendship", "relationships", "love", "belonging"],
      "confidence": 0.95
    },
    {
      "name": "Growth",
      "userDescription": "I love learning new things and becoming a better version of myself. Every challenge is an opportunity to grow stronger and develop new skills.",
      "importance": 4,
      "tags": ["learning", "development", "improvement", "progress", "self-improvement"],
      "confidence": 0.88
    }
  ]
}

**QUALITY OVER QUANTITY**: Better to extract 2-4 deeply meaningful values than 10 superficial ones. If the conversation didn't deeply explore values, return fewer values or an empty array.`;

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
        if (!sessionId) {
          return new Response(JSON.stringify({
            success: false,
            error: 'sessionId is required for extract_patterns action'
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
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

        // Enhanced validation for insights
        const validatedInsights = insights.filter(insight => {
          // Check minimum confidence (0.75)
          if (insight.confidence < 0.75) {
            console.warn(`Skipping insight - confidence too low: ${insight.confidence}`);
            return false;
          }

          // Check minimum content length (20 words for specificity)
          const wordCount = insight.content?.split(/\s+/).length || 0;
          if (wordCount < 20) {
            console.warn(`Skipping insight - too short: ${wordCount} words`);
            return false;
          }

          // Check for vague language patterns
          const vagueIndicators = ['sometimes', 'might', 'could be', 'possibly', 'tends to', 'appears to', 'seems to'];
          const vagueCount = vagueIndicators.filter(v =>
            insight.content?.toLowerCase().includes(v)
          ).length;
          if (vagueCount > 2) {
            console.warn(`Skipping insight - too vague (${vagueCount} vague indicators)`);
            return false;
          }

          // Check it's not trivial
          if (isTrivialgainextract(insight.content || '')) {
            console.warn(`Skipping insight - trivial content`);
            return false;
          }

          // Check for generic therapy statements
          const genericPatterns = [
            /^(user|they|the person) (feels?|experiences?|has) (stress|anxiety|worry)/i,
            /^(user|they|the person) (wants?|needs?|desires?) (to feel|to be) (better|happy|calm)/i
          ];
          if (genericPatterns.some(pattern => pattern.test(insight.content || ''))) {
            console.warn(`Skipping insight - too generic`);
            return false;
          }

          return true;
        });

        console.log(`Insight validation: ${validatedInsights.length} of ${insights.length} insights passed`);

        response = {
          success: true,
          insights: validatedInsights,
          processingTime: Math.round(performance.now() - startTime)
        };
        break;

      case 'generate_summary':
        // Generate session summary
        const summary = await generateSessionSummary(OPENROUTER_API_KEY, messages);
        response = {
          success: true,
          summary,
          message: summary, // Also include as 'message' for contextService compatibility
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

      case 'generate_vision_summary':
        // Generate vision summary for contextService compatibility
        const visionSummary = await extractVisionInsights(OPENROUTER_API_KEY, messages);
        if (visionSummary) {
          // Convert to the format contextService expects
          const summaryData = {
            summary: visionSummary.fullDescription || "A meaningful vision of your future self was explored.",
            keyInsights: visionSummary.practicalTakeaways || []
          };
          response = {
            success: true,
            message: JSON.stringify(summaryData),
            processingTime: Math.round(performance.now() - startTime)
          };
        } else {
          response = {
            success: false,
            error: 'Failed to generate vision summary',
            processingTime: Math.round(performance.now() - startTime)
          };
        }
        break;

      case 'extract_values':
        // Extract values from values-clarification exercise
        const extractedValues = await extractValuesFromConversation(OPENROUTER_API_KEY, messages);

        // Validate extracted values
        const validatedValues = extractedValues.filter(value => {
          // Check minimum confidence (0.80)
          if (value.confidence < 0.80) {
            console.warn(`Skipping value - confidence too low: ${value.confidence}`);
            return false;
          }

          // Check that name and description exist
          if (!value.name || !value.userDescription) {
            console.warn(`Skipping value - missing required fields`);
            return false;
          }

          // Check minimum description length (meaningful context)
          const wordCount = value.userDescription?.split(/\s+/).length || 0;
          if (wordCount < 15) {
            console.warn(`Skipping value - description too short: ${wordCount} words`);
            return false;
          }

          return true;
        });

        console.log(`Values extraction: ${validatedValues.length} of ${extractedValues.length} values passed validation`);

        response = {
          success: true,
          values: validatedValues,
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

1. Quote the EXACT automatic thought from the user's message (word-for-word, no paraphrasing)
2. Identify the cognitive distortions present (from the list below)
3. Provide a realistic, balanced reframe
4. Assign a confidence score (0.0-1.0)

COGNITIVE DISTORTIONS TO IDENTIFY:
${COGNITIVE_DISTORTIONS.map((d, i) => `${i + 1}. ${d}`).join('\n')}

**CRITICAL VALIDATION RULES - You MUST follow these:**

1. **EXACT QUOTES ONLY**: The "originalThought" must be a direct quote from the user's message above. Do not paraphrase, summarize, or infer. If you cannot find an exact quote, do not extract that pattern.

2. **VERIFY DISTORTION EXISTS**: The quoted thought must clearly demonstrate the distortion type you're assigning. Do not assign distortions that "might" be there - only assign if it's evident in the exact words.

3. **MINIMUM CONFIDENCE 0.75**: Only extract patterns where you have high confidence (0.75+). If you're unsure, do not extract.

4. **MEANINGFUL REFRAMES**: The reframe must be meaningfully different from the original thought. If the reframe is too similar, do not extract.

5. **NO HALLUCINATION**: Do not invent thoughts or patterns that aren't clearly stated by the user. When in doubt, return an empty array.

6. **RETURN EMPTY IF NOTHING CLEAR**: If there are no clear, obvious automatic thoughts with distortions, return:
{
  "thoughtPatterns": []
}

This is better than extracting weak or uncertain patterns.

OUTPUT FORMAT (JSON):
{
  "thoughtPatterns": [
    {
      "originalThought": "exact quote from user - must match conversation above word-for-word",
      "distortionTypes": ["distortion name from the list above"],
      "reframedThought": "balanced, realistic alternative thought that is clearly different",
      "confidence": 0.85,
      "context": "brief context about when this occurred",
      "sourceMessage": "partial quote to identify source message"
    }
  ]
}

**QUALITY OVER QUANTITY**: It's better to extract 0-2 high-quality patterns than 5+ questionable ones.

GUIDELINES:
- Only extract thoughts that show clear cognitive distortions
- Be conservative - high accuracy over quantity
- Reframes should be realistic, not just positive
- Include enough context to understand the situation
- Confidence should reflect how clear the distortion is
- If the conversation is too brief or lacks clear distorted thoughts, return empty array

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

    // Map and validate patterns
    const validatedPatterns = thoughtPatterns
      .map((pattern: any, index: number) => {
        // Find the source message by matching content
        const sourceMessage = userMessages.find(msg => {
          const content = msg.text || msg.content || '';
          return content.includes(pattern.originalThought) ||
                 (pattern.sourceMessage && content.includes(pattern.sourceMessage));
        });

        // VALIDATION: If we can't find the quote in actual messages, skip this pattern
        if (!sourceMessage) {
          console.warn(`Skipping pattern - quote not found in messages: "${pattern.originalThought}"`);
          return null;
        }

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
      })
      .filter((pattern): pattern is ThoughtPattern => {
        if (!pattern) return false;

        // Additional validation checks

        // Check minimum confidence (0.75)
        if (pattern.confidence < 0.75) {
          console.warn(`Skipping pattern - confidence too low: ${pattern.confidence}`);
          return false;
        }

        // Check that originalThought is substantial (20+ characters)
        if (pattern.originalThought.length < 20) {
          console.warn(`Skipping pattern - thought too short: "${pattern.originalThought}"`);
          return false;
        }

        // Check that reframe is different from original
        const similarity = calculateTextSimilarity(pattern.originalThought, pattern.reframedThought);
        if (similarity > 0.8) {
          console.warn(`Skipping pattern - reframe too similar to original`);
          return false;
        }

        // Check that distortion types are valid
        const validDistortions = pattern.distortionTypes.filter(d =>
          COGNITIVE_DISTORTIONS.includes(d)
        );
        if (validDistortions.length === 0) {
          console.warn(`Skipping pattern - no valid distortion types`);
          return false;
        }
        pattern.distortionTypes = validDistortions;

        return true;
      });

    console.log(`Validation complete: ${validatedPatterns.length} of ${thoughtPatterns.length} patterns passed`);
    return validatedPatterns;

  } catch (error) {
    console.error('Failed to parse analysis result:', error);
    console.error('Raw result:', analysisResult);
    return [];
  }
}

// Helper function to calculate text similarity (simple word overlap)
function calculateTextSimilarity(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  const words2 = text2.toLowerCase().split(/\W+/).filter(w => w.length > 2);

  if (words1.length === 0 || words2.length === 0) return 0;

  const commonWords = words1.filter(word => words2.includes(word));
  const totalUniqueWords = new Set([...words1, ...words2]).size;

  return commonWords.length / totalUniqueWords;
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

    return summary || `You shared some meaningful thoughts and insights in our conversation today. Even though every session is different, the fact that you're taking time to reflect on your experiences shows real commitment to your growth.`;

  } catch (error) {
    console.error('Error generating session summary:', error);
    return `You took time to reflect and explore what's on your mind today. These moments of honest self-reflection are valuable steps in your journey, even when the insights aren't immediately clear.`;
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

async function extractValuesFromConversation(apiKey: string, messages: Message[]): Promise<any[]> {
  try {
    // Get relevant messages for values extraction
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
      return [];
    }

    // Check if this actually contains values-related content
    const valuesKeywords = [
      'values',
      'what matters',
      'important to me',
      'core value',
      'deeply care',
      'meaningful',
      'priority',
      'what I value'
    ];

    const relevantText = relevantMessages.toLowerCase();
    const hasValuesContent = valuesKeywords.some(keyword => relevantText.includes(keyword));

    if (!hasValuesContent) {
      console.log('No values-related keywords found in conversation');
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
            content: VALUES_EXTRACTION_PROMPT
          },
          {
            role: 'user',
            content: `Analyze this Values Clarification exercise conversation and extract the user's core values:\n\n${relevantMessages}`
          }
        ],
        max_tokens: 2000,
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

      // Validate that we have meaningful values
      if (!parsed.values || !Array.isArray(parsed.values) || parsed.values.length === 0) {
        return [];
      }

      console.log(`Extracted ${parsed.values.length} values from conversation`);
      return parsed.values;
    } catch (parseError) {
      console.error('JSON parse error for values extraction:', parseError);
      return [];
    }

  } catch (error) {
    console.error('Error extracting values from conversation:', error);
    return [];
  }
}