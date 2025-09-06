import { ApiError, handleApiError } from '../utils/apiErrorHandler';

export interface StoryData {
  timeline: string;
  mainStory: string;
  themes: string[];
  deepeningAnswers?: {
    question: string;
    answer: string;
  }[];
}

export interface StoryReflection {
  compassionateMessage: string;
  strengthsIdentified: string[];
  resiliencePatterns: string[];
  growthOpportunities: string[];
  encouragement: string;
}

class StoryReflectionService {
  private readonly baseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  private readonly apiKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  async generateReflection(storyData: StoryData): Promise<StoryReflection> {
    try {
      if (!this.baseUrl || !this.apiKey) {
        throw new ApiError('Configuration error', 500, 'MISSING_CONFIG');
      }

      // Create reflection prompt that emphasizes compassion and therapeutic insight
      const reflectionPrompt = this.createReflectionPrompt(storyData);

      const response = await fetch(`${this.baseUrl}/functions/v1/story-reflection`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storyData,
          prompt: reflectionPrompt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(
          errorData?.message || 'Failed to generate story reflection',
          response.status,
          errorData?.code || 'REFLECTION_ERROR'
        );
      }

      const result = await response.json();
      return result.reflection;
    } catch (error) {
      console.error('Story reflection error:', error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      return handleApiError(error, {
        fallbackMessage: "I'm having trouble generating a reflection right now, but I want you to know that sharing your story takes courage and I'm honored you trusted me with it.",
        context: 'story reflection'
      });
    }
  }

  private createReflectionPrompt(storyData: StoryData): string {
    return `
You are Anu, a wise and compassionate turtle therapist. A user has shared their personal story with you during a storytelling exercise. Your role is to provide a thoughtful, therapeutic reflection that:

1. Shows deep empathy and understanding
2. Identifies genuine strengths and resilience patterns
3. Offers gentle insights about growth opportunities
4. Provides warm, encouraging support

Story Context:
- Timeline: ${storyData.timeline}
- Main Story: ${storyData.mainStory}
- Themes explored: ${storyData.themes.join(', ')}
${storyData.deepeningAnswers ? `- Additional reflections: ${storyData.deepeningAnswers.map(qa => `${qa.question}: ${qa.answer}`).join('; ')}` : ''}

Please provide a structured reflection with:
1. A compassionate opening message (2-3 sentences acknowledging their courage in sharing)
2. 2-3 specific strengths you notice in their story
3. 1-2 resilience patterns or coping strategies they've demonstrated
4. 1-2 gentle growth opportunities (framed positively)
5. An encouraging closing message

Keep the tone warm, professional, and therapeutic. Avoid being overly clinical or prescriptive. Focus on their inherent wisdom and strength.
`;
  }

  // Fallback reflection for when AI service is unavailable
  generateFallbackReflection(storyData: StoryData): StoryReflection {
    return {
      compassionateMessage: "Thank you for sharing your story with me. It takes courage to reflect on our experiences and share them, and I'm honored that you trusted me with this part of your journey.",
      strengthsIdentified: [
        "Your willingness to engage in self-reflection",
        "The courage to share personal experiences",
        "Your commitment to growth and understanding"
      ],
      resiliencePatterns: [
        "You've shown the ability to look back on your experiences with perspective",
        "Your openness to exploring different themes in your life demonstrates emotional flexibility"
      ],
      growthOpportunities: [
        "Continuing to explore the themes that matter most to you",
        "Building on the insights you've gained through this reflection"
      ],
      encouragement: "Remember that every story has value, including yours. The themes you've explored and the experiences you've shared are all part of what makes your journey unique and meaningful. Keep being gentle with yourself as you continue to grow. 🐢💚"
    };
  }
}

export const storyReflectionService = new StoryReflectionService();