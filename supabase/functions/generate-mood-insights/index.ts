import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SessionData {
  id: string;
  date: string;
  summary: string;
  keyTopics: string[];
  sentiment: string;
}

interface MoodInsight {
  id: string;
  text: string;
  category: 'strength' | 'progress' | 'clarity' | 'challenge' | 'growth';
  confidence: number;
  sessionsReferenced: string[];
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { sessions, analysisType, targetInsights, focusPeriod } = await req.json() as { 
      sessions: SessionData[];
      analysisType: string;
      targetInsights: number;
      focusPeriod: string;
    }

    if (!sessions || !sessions.length) {
      return new Response(
        JSON.stringify({ 
          error: 'Session data is required',
          code: 'MISSING_SESSION_DATA'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Initialize Supabase client for potential future use
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get OpenAI API key
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.error('OpenAI API key not found')
      throw new Error('AI service configuration error')
    }

    // Create insights generation prompt
    const insightsPrompt = createInsightsPrompt(sessions, analysisType, focusPeriod);

    // Call OpenAI API for mood insights generation
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: insightsPrompt
          }
        ],
        max_tokens: 600,
        temperature: 0.6,
        functions: [{
          name: 'generate_mood_insights',
          description: 'Generate positive, therapeutic insights from session data',
          parameters: {
            type: 'object',
            properties: {
              insights: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                      description: 'Unique identifier for the insight'
                    },
                    text: {
                      type: 'string',
                      description: 'The insight text, written in a positive, encouraging tone'
                    },
                    category: {
                      type: 'string',
                      enum: ['strength', 'progress', 'clarity', 'growth'],
                      description: 'Category of the insight'
                    },
                    confidence: {
                      type: 'number',
                      minimum: 0.1,
                      maximum: 1.0,
                      description: 'Confidence score for the insight'
                    },
                    sessionsReferenced: {
                      type: 'array',
                      items: { type: 'string' },
                      description: 'Session IDs this insight is based on'
                    }
                  },
                  required: ['id', 'text', 'category', 'confidence', 'sessionsReferenced']
                },
                minItems: targetInsights,
                maxItems: targetInsights
              }
            },
            required: ['insights']
          }
        }],
        function_call: { name: 'generate_mood_insights' }
      }),
    })

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text()
      console.error('OpenAI API error:', errorText)
      throw new Error(`OpenAI API error: ${openaiResponse.status}`)
    }

    const aiResult = await openaiResponse.json()
    
    if (!aiResult.choices?.[0]?.message?.function_call?.arguments) {
      console.error('Unexpected AI response format:', aiResult)
      throw new Error('Invalid AI response format')
    }

    // Parse the structured insights
    const result = JSON.parse(aiResult.choices[0].message.function_call.arguments)
    
    if (!result.insights || !Array.isArray(result.insights)) {
      console.error('Invalid insights structure:', result)
      throw new Error('AI generated invalid insights structure')
    }

    // Log successful insights generation (without sensitive data)
    console.log('Mood insights generated successfully:', {
      sessionsAnalyzed: sessions.length,
      insightsGenerated: result.insights.length,
      analysisType,
      focusPeriod
    })

    return new Response(
      JSON.stringify({ insights: result.insights }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Mood insights generation error:', error)
    
    // Return graceful fallback insights
    const fallbackInsights: MoodInsight[] = [
      {
        id: 'fallback-1',
        text: 'Showing consistent commitment to personal growth and mental wellness',
        category: 'strength',
        confidence: 0.7,
        sessionsReferenced: []
      },
      {
        id: 'fallback-2', 
        text: 'Building emotional awareness and developing positive coping strategies',
        category: 'progress',
        confidence: 0.6,
        sessionsReferenced: []
      },
      {
        id: 'fallback-3',
        text: 'Demonstrating courage in exploring personal challenges and growth opportunities',
        category: 'growth',
        confidence: 0.6,
        sessionsReferenced: []
      }
    ]

    return new Response(
      JSON.stringify({ 
        insights: fallbackInsights,
        fallback: true 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

function createInsightsPrompt(sessions: SessionData[], analysisType: string, focusPeriod: string): string {
  const sessionSummaries = sessions.map(session => 
    `Session ${session.date}: ${session.summary} (Topics: ${session.keyTopics.join(', ')}, Sentiment: ${session.sentiment})`
  ).join('\n');

  return `
You are Anu, a compassionate AI therapist analyzing a user's recent therapy session summaries to generate positive, encouraging insights about their mental health journey.

Analysis Period: ${focusPeriod}
Analysis Type: ${analysisType}
Sessions to Analyze:
${sessionSummaries}

Generate exactly 3 positive insights that:
1. Focus on strengths, progress, and growth opportunities
2. Are encouraging and therapeutic in tone
3. Highlight specific patterns or themes from the sessions
4. Avoid clinical jargon - use warm, accessible language
5. Celebrate the user's commitment to their wellbeing

Categories to use:
- strength: Highlight existing strengths and positive traits
- progress: Show measurable improvement or forward movement  
- clarity: Areas where understanding has increased
- growth: Opportunities for continued development

Ensure each insight:
- Is based on actual session content when possible
- Uses positive, strength-based language
- Feels personal and specific to this user's journey
- Encourages continued engagement with therapy
- Has appropriate confidence scores (0.5-0.9 range)

Remember: These insights will be shown to the user to motivate and support their mental health journey. They should feel uplifting and meaningful.
`;
}