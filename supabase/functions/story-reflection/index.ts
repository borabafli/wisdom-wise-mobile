import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface StoryData {
  timeline: string;
  mainStory: string;
  themes: string[];
  deepeningAnswers?: {
    question: string;
    answer: string;
  }[];
}

interface StoryReflection {
  compassionateMessage: string;
  strengthsIdentified: string[];
  resiliencePatterns: string[];
  growthOpportunities: string[];
  encouragement: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { storyData, prompt } = await req.json() as { 
      storyData: StoryData; 
      prompt: string; 
    }

    if (!storyData || !storyData.mainStory) {
      return new Response(
        JSON.stringify({ 
          error: 'Story data is required',
          code: 'MISSING_STORY_DATA'
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

    // Call OpenAI API for story reflection
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
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
        functions: [{
          name: 'create_story_reflection',
          description: 'Create a structured therapeutic reflection on a user\'s story',
          parameters: {
            type: 'object',
            properties: {
              compassionateMessage: {
                type: 'string',
                description: 'A warm, empathetic opening message acknowledging their courage in sharing (2-3 sentences)'
              },
              strengthsIdentified: {
                type: 'array',
                items: { type: 'string' },
                description: 'Specific strengths noticed in their story (2-3 items)',
                minItems: 2,
                maxItems: 4
              },
              resiliencePatterns: {
                type: 'array',
                items: { type: 'string' },
                description: 'Resilience patterns or coping strategies they\'ve demonstrated (1-2 items)',
                minItems: 1,
                maxItems: 3
              },
              growthOpportunities: {
                type: 'array',
                items: { type: 'string' },
                description: 'Gentle growth opportunities framed positively (1-2 items)',
                minItems: 1,
                maxItems: 2
              },
              encouragement: {
                type: 'string',
                description: 'An encouraging closing message that feels warm and supportive'
              }
            },
            required: ['compassionateMessage', 'strengthsIdentified', 'resiliencePatterns', 'growthOpportunities', 'encouragement']
          }
        }],
        function_call: { name: 'create_story_reflection' }
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

    // Parse the structured reflection
    const reflection: StoryReflection = JSON.parse(
      aiResult.choices[0].message.function_call.arguments
    )

    // Validate the reflection structure
    if (!reflection.compassionateMessage || 
        !reflection.strengthsIdentified?.length || 
        !reflection.resiliencePatterns?.length ||
        !reflection.growthOpportunities?.length ||
        !reflection.encouragement) {
      console.error('Incomplete reflection structure:', reflection)
      throw new Error('AI generated incomplete reflection')
    }

    // Log successful reflection generation (without sensitive data)
    console.log('Story reflection generated successfully:', {
      storyLength: storyData.mainStory.length,
      themes: storyData.themes,
      timeline: storyData.timeline,
      hasDeepening: !!storyData.deepeningAnswers?.length
    })

    return new Response(
      JSON.stringify({ reflection }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Story reflection function error:', error)
    
    // Return a graceful fallback response
    const fallbackReflection: StoryReflection = {
      compassionateMessage: "Thank you for sharing your story with me. It takes courage to reflect on our experiences and share them, and I'm honored that you trusted me with this part of your journey.",
      strengthsIdentified: [
        "Your willingness to engage in self-reflection shows emotional maturity",
        "The courage you've shown in sharing personal experiences",
        "Your commitment to growth and understanding yourself better"
      ],
      resiliencePatterns: [
        "You've demonstrated the ability to look back on experiences with perspective",
        "Your openness to exploring different aspects of your life shows emotional flexibility"
      ],
      growthOpportunities: [
        "Continuing to explore the themes that resonate most deeply with you",
        "Building on the insights you've gained through this meaningful reflection"
      ],
      encouragement: "Remember that every story has value, including yours. The experiences you've shared and the themes you've explored are all part of what makes your journey unique and meaningful. Keep being gentle with yourself as you continue to grow. 🐢💚"
    }

    return new Response(
      JSON.stringify({ 
        reflection: fallbackReflection,
        fallback: true 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})