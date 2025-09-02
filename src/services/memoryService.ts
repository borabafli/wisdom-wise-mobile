import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message, storageService } from './storageService';
import axios from 'axios';
import { API_CONFIG } from '../config/constants';

export interface Insight {
  id: string;
  category: 'automatic_thoughts' | 'emotions' | 'behaviors' | 'values_goals' | 'strengths' | 'life_context';
  content: string;
  date: string;
  sourceMessageIds: string[];
  confidence: number; // 0-1 score of insight quality
}

export interface Summary {
  id: string;
  text: string;
  date: string;
  type: 'session' | 'consolidated';
  sessionIds?: string[]; // For consolidated summaries
  messageCount: number;
}

export interface MemoryContext {
  insights: Insight[];
  summaries: Summary[];
  consolidatedSummary?: Summary;
}

interface ExtractionResult {
  insights: Insight[];
  shouldExtract: boolean;
  messageCount: number;
}

interface SummaryResult {
  summary: Summary;
  shouldConsolidate: boolean;
}

const STORAGE_KEYS = {
  INSIGHTS: 'memory_insights',
  SUMMARIES: 'memory_summaries',
  EXTRACTION_METADATA: 'memory_extraction_metadata'
};

const EXTRACTION_CONFIG = {
  MIN_MESSAGE_THRESHOLD: 5,
  MAX_INSIGHT_AGE_DAYS: 30,
  SUMMARY_CONSOLIDATION_THRESHOLD: 10,
  MAX_CONTEXT_INSIGHTS: 20,
  MAX_CONTEXT_SUMMARIES: 3
};

const INSIGHT_EXTRACTION_PROMPT = `You are analyzing a therapy conversation to extract meaningful insights. Extract insights into these 6 categories ONLY if they are clearly present and therapeutically significant.

**EXTRACTION CRITERIA:**
- Only extract insights that are clearly evident and therapeutically valuable
- Avoid repetition of existing insights
- Focus on patterns, not single occurrences
- Each insight should be 1-2 sentences maximum

**CATEGORIES:**
1. **automatic_thoughts**: Recurring negative thought patterns, cognitive distortions, self-talk
2. **emotions**: Emotional patterns, triggers, coping mechanisms, emotional regulation
3. **behaviors**: Behavioral patterns, coping strategies, avoidance behaviors
4. **values_goals**: Core values, life goals, what matters most to the person
5. **strengths**: Positive qualities, resilience factors, existing coping skills
6. **life_context**: Important life circumstances, relationships, stressors

**RESPONSE FORMAT:**
Return a JSON object with this structure:
{
  "insights": [
    {
      "category": "automatic_thoughts",
      "content": "Often catastrophizes about work performance, jumping to worst-case scenarios",
      "confidence": 0.85
    }
  ]
}

**CONVERSATION TO ANALYZE:**`;

const SESSION_SUMMARY_PROMPT = `Create a concise 2-3 sentence summary of this therapy session. Focus on:
- Key emotional themes discussed
- Main insights or breakthroughs
- Any shifts in perspective or understanding

**SESSION MESSAGES:**`;

const CONSOLIDATION_PROMPT = `Analyze these session summaries and create a consolidated paragraph summary. Identify:
- Recurring themes and patterns
- Overall therapeutic progress
- Key areas of focus across sessions

**SUMMARIES TO CONSOLIDATE:**`;

class MemoryService {
  private extractionMetadata: { lastExtraction: string; messageCount: number } = {
    lastExtraction: '',
    messageCount: 0
  };

  constructor() {
    this.loadExtractionMetadata();
  }

  private async loadExtractionMetadata(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.EXTRACTION_METADATA);
      if (data) {
        this.extractionMetadata = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading extraction metadata:', error);
    }
  }

  private async saveExtractionMetadata(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.EXTRACTION_METADATA, 
        JSON.stringify(this.extractionMetadata)
      );
    } catch (error) {
      console.error('Error saving extraction metadata:', error);
    }
  }

  // INSIGHT MANAGEMENT

  async saveInsight(insight: Insight): Promise<void> {
    try {
      const insights = await this.getInsights();
      
      // Check for duplicates based on content similarity
      const isDuplicate = insights.some(existing => 
        existing.category === insight.category && 
        this.calculateSimilarity(existing.content, insight.content) > 0.8
      );

      if (!isDuplicate) {
        insights.push(insight);
        await AsyncStorage.setItem(STORAGE_KEYS.INSIGHTS, JSON.stringify(insights));
      }
    } catch (error) {
      console.error('Error saving insight:', error);
      throw error;
    }
  }

  async getInsights(): Promise<Insight[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.INSIGHTS);
      if (!data) return [];
      
      const insights: Insight[] = JSON.parse(data);
      
      // Filter out old insights
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - EXTRACTION_CONFIG.MAX_INSIGHT_AGE_DAYS);
      
      return insights.filter(insight => 
        new Date(insight.date) > cutoffDate
      );
    } catch (error) {
      console.error('Error loading insights:', error);
      return [];
    }
  }

  async getInsightsByCategory(category: Insight['category']): Promise<Insight[]> {
    const insights = await this.getInsights();
    return insights.filter(insight => insight.category === category);
  }

  // SUMMARY MANAGEMENT

  async saveSummary(summary: Summary): Promise<void> {
    try {
      const summaries = await this.getSummaries();
      summaries.unshift(summary); // Add to beginning (most recent first)
      await AsyncStorage.setItem(STORAGE_KEYS.SUMMARIES, JSON.stringify(summaries));
    } catch (error) {
      console.error('Error saving summary:', error);
      throw error;
    }
  }

  async getSummaries(): Promise<Summary[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SUMMARIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading summaries:', error);
      return [];
    }
  }

  async getSessionSummaries(): Promise<Summary[]> {
    const summaries = await this.getSummaries();
    return summaries.filter(summary => summary.type === 'session');
  }

  async getConsolidatedSummaries(): Promise<Summary[]> {
    const summaries = await this.getSummaries();
    return summaries.filter(summary => summary.type === 'consolidated');
  }

  // EXTRACTION LOGIC

  async shouldExtractInsights(messages: Message[]): Promise<boolean> {
    const userMessages = messages.filter(msg => msg.type === 'user');
    const newMessageCount = userMessages.length - this.extractionMetadata.messageCount;
    
    // Check minimum threshold
    if (newMessageCount < EXTRACTION_CONFIG.MIN_MESSAGE_THRESHOLD) {
      return false;
    }

    // Check if conversation has meaningful content (not just short responses)
    const meaningfulMessages = userMessages.filter(msg => 
      msg.text && msg.text.trim().split(' ').length > 3
    );
    
    return meaningfulMessages.length >= Math.ceil(EXTRACTION_CONFIG.MIN_MESSAGE_THRESHOLD * 0.7);
  }

  async extractInsights(messages: Message[]): Promise<ExtractionResult> {
    try {
      const shouldExtract = await this.shouldExtractInsights(messages);
      
      if (!shouldExtract) {
        return {
          insights: [],
          shouldExtract: false,
          messageCount: messages.filter(msg => msg.type === 'user').length
        };
      }

      // Get last ~20 relevant messages for context
      const relevantMessages = messages
        .filter(msg => msg.type === 'user' || msg.type === 'system')
        .slice(-20)
        .map(msg => `${msg.type}: ${msg.text || msg.content}`)
        .join('\n');

      // Call the Supabase Edge Function for insight extraction
      const response = await axios.post(`${API_CONFIG.SUPABASE_URL}/functions/v1/extract-insights`, {
        action: 'extract_insights',
        messages: messages.slice(-20).map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.text || msg.content || ''
        })),
        sessionId: 'session_' + Date.now()
      }, {
        headers: {
          'Authorization': `Bearer ${API_CONFIG.SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.data.success || !response.data.insights) {
        return {
          insights: [],
          shouldExtract: false,
          messageCount: messages.filter(msg => msg.type === 'user').length
        };
      }

      // Convert to our Insight format
      const insights: Insight[] = response.data.insights.map((insight: any) => ({
        id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
        category: insight.category,
        content: insight.content,
        confidence: insight.confidence || 0.7,
        date: new Date().toISOString(),
        sourceMessageIds: messages.slice(-10).map(msg => msg.id) // Last 10 message IDs
      }));

      // Save insights
      for (const insight of insights) {
        await this.saveInsight(insight);
      }

      // Update extraction metadata
      this.extractionMetadata = {
        lastExtraction: new Date().toISOString(),
        messageCount: messages.filter(msg => msg.type === 'user').length
      };
      await this.saveExtractionMetadata();

      return {
        insights,
        shouldExtract: true,
        messageCount: this.extractionMetadata.messageCount
      };

    } catch (error) {
      console.error('Error extracting insights:', error);
      return {
        insights: [],
        shouldExtract: false,
        messageCount: messages.filter(msg => msg.type === 'user').length
      };
    }
  }

  // SESSION SUMMARY GENERATION

  async generateSessionSummary(sessionId: string, messages: Message[]): Promise<SummaryResult> {
    try {
      // Get relevant messages for summary
      const relevantMessages = messages
        .filter(msg => (msg.type === 'user' || msg.type === 'system') && msg.text)
        .slice(-30) // Last 30 messages
        .map(msg => `${msg.type}: ${msg.text}`)
        .join('\n');

      if (!relevantMessages.trim()) {
        return {
          summary: {
            id: Date.now().toString(),
            text: 'Brief conversation session',
            date: new Date().toISOString(),
            type: 'session',
            messageCount: messages.length
          },
          shouldConsolidate: false
        };
      }

      // Call the Supabase Edge Function for summary generation
      const response = await axios.post(`${API_CONFIG.SUPABASE_URL}/functions/v1/extract-insights`, {
        action: 'generate_summary',
        messages: messages.slice(-30).map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.text || msg.content || ''
        })),
        sessionId: sessionId
      }, {
        headers: {
          'Authorization': `Bearer ${API_CONFIG.SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const summaryText = response.data.success && response.data.summary 
        ? response.data.summary.trim()
        : `Session covered ${messages.filter(msg => msg.type === 'user').length} user exchanges focusing on personal reflection and therapeutic dialogue.`;

      const summary: Summary = {
        id: sessionId + '_summary_' + Date.now(),
        text: summaryText,
        date: new Date().toISOString(),
        type: 'session',
        messageCount: messages.length
      };

      await this.saveSummary(summary);

      // Check if consolidation is needed
      const sessionSummaries = await this.getSessionSummaries();
      const shouldConsolidate = sessionSummaries.length >= EXTRACTION_CONFIG.SUMMARY_CONSOLIDATION_THRESHOLD;

      return {
        summary,
        shouldConsolidate
      };

    } catch (error) {
      console.error('Error generating session summary:', error);
      
      // Return basic summary
      const fallbackSummary: Summary = {
        id: sessionId + '_summary_' + Date.now(),
        text: `Therapeutic session with ${messages.filter(msg => msg.type === 'user').length} user responses, exploring personal insights and emotional patterns.`,
        date: new Date().toISOString(),
        type: 'session',
        messageCount: messages.length
      };

      return {
        summary: fallbackSummary,
        shouldConsolidate: false
      };
    }
  }

  // CONSOLIDATION

  async consolidateSummaries(): Promise<Summary | null> {
    try {
      const sessionSummaries = await this.getSessionSummaries();
      
      if (sessionSummaries.length < EXTRACTION_CONFIG.SUMMARY_CONSOLIDATION_THRESHOLD) {
        return null;
      }

      // Take the oldest summaries for consolidation
      const summariesToConsolidate = sessionSummaries.slice(-EXTRACTION_CONFIG.SUMMARY_CONSOLIDATION_THRESHOLD);
      const summaryTexts = summariesToConsolidate.map((s, i) => `Session ${i + 1}: ${s.text}`).join('\n\n');

      // Call the Supabase Edge Function for consolidation
      const response = await axios.post(`${API_CONFIG.SUPABASE_URL}/functions/v1/extract-insights`, {
        action: 'consolidate_summaries',
        summaries: summariesToConsolidate.map(s => s.text)
      }, {
        headers: {
          'Authorization': `Bearer ${API_CONFIG.SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.data.success || !response.data.consolidated_summary) {
        return null;
      }

      const consolidatedSummary: Summary = {
        id: 'consolidated_' + Date.now(),
        text: response.data.consolidated_summary.trim(),
        date: new Date().toISOString(),
        type: 'consolidated',
        sessionIds: summariesToConsolidate.map(s => s.id),
        messageCount: summariesToConsolidate.reduce((acc, s) => acc + s.messageCount, 0)
      };

      await this.saveSummary(consolidatedSummary);

      // Remove the consolidated session summaries
      const remainingSummaries = await this.getSummaries();
      const filteredSummaries = remainingSummaries.filter(summary => 
        !summariesToConsolidate.some(old => old.id === summary.id)
      );
      
      await AsyncStorage.setItem(STORAGE_KEYS.SUMMARIES, JSON.stringify(filteredSummaries));

      return consolidatedSummary;

    } catch (error) {
      console.error('Error consolidating summaries:', error);
      return null;
    }
  }

  // CONTEXT INJECTION

  async getMemoryContext(): Promise<MemoryContext> {
    try {
      const [insights, summaries] = await Promise.all([
        this.getInsights(),
        this.getSummaries()
      ]);

      // Sort insights by confidence and recency, take top results
      const topInsights = insights
        .sort((a, b) => {
          const scoreA = b.confidence * 0.7 + (new Date(b.date).getTime() * 0.3);
          const scoreB = a.confidence * 0.7 + (new Date(a.date).getTime() * 0.3);
          return scoreB - scoreA;
        })
        .slice(0, EXTRACTION_CONFIG.MAX_CONTEXT_INSIGHTS);

      // Get recent summaries
      const recentSummaries = summaries.slice(0, EXTRACTION_CONFIG.MAX_CONTEXT_SUMMARIES);
      const consolidatedSummary = summaries.find(s => s.type === 'consolidated');

      return {
        insights: topInsights,
        summaries: recentSummaries.filter(s => s.type === 'session'),
        consolidatedSummary
      };

    } catch (error) {
      console.error('Error getting memory context:', error);
      return {
        insights: [],
        summaries: []
      };
    }
  }

  formatMemoryForContext(memoryContext: MemoryContext): string {
    let contextString = '';

    // Add instruction for handling memories
    contextString += `The following are long-term insights about the user. They represent important recurring patterns, values, and context, not transient states. Use them to better understand the user, recall past experiences, and provide continuity. Do not repeat them back verbatim unless directly relevant. Integrate them naturally into your guidance and reflections.\n\n`;

    // Add insights by category
    if (memoryContext.insights.length > 0) {
      contextString += '**Long-term Insights:**\n';
      
      const insightsByCategory = memoryContext.insights.reduce((acc, insight) => {
        if (!acc[insight.category]) acc[insight.category] = [];
        acc[insight.category].push(insight.content);
        return acc;
      }, {} as Record<string, string[]>);

      const categoryLabels = {
        'automatic_thoughts': 'Automatic Thoughts',
        'emotions': 'Emotional Patterns', 
        'behaviors': 'Behavioral Patterns',
        'values_goals': 'Values & Goals',
        'strengths': 'Strengths',
        'life_context': 'Life Context'
      };

      // Show all categories, with content if available or empty if not
      Object.entries(categoryLabels).forEach(([categoryKey, categoryLabel]) => {
        const contents = insightsByCategory[categoryKey];
        if (contents && contents.length > 0) {
          contextString += `- **${categoryLabel}:** ${contents.join('; ')}\n`;
        } else {
          contextString += `- **${categoryLabel}:** (no patterns identified yet)\n`;
        }
      });
      
      contextString += '\n';
    }

    // Add recent summaries
    if (memoryContext.summaries.length > 0) {
      contextString += '**Recent Sessions:**\n';
      memoryContext.summaries.forEach((summary, index) => {
        contextString += `- Session ${index + 1}: ${summary.text}\n`;
      });
      contextString += '\n';
    }

    // Add consolidated themes
    if (memoryContext.consolidatedSummary) {
      contextString += '**Consolidated Themes:**\n';
      contextString += `- ${memoryContext.consolidatedSummary.text}\n\n`;
    }

    return contextString;
  }

  // UTILITY METHODS

  private calculateSimilarity(text1: string, text2: string): number {
    // Simple word-based similarity calculation
    const words1 = text1.toLowerCase().split(/\W+/).filter(w => w.length > 2);
    const words2 = text2.toLowerCase().split(/\W+/).filter(w => w.length > 2);
    
    const commonWords = words1.filter(word => words2.includes(word));
    const totalWords = new Set([...words1, ...words2]).size;
    
    return totalWords > 0 ? commonWords.length / totalWords : 0;
  }

  async pruneOldData(): Promise<void> {
    try {
      // Prune old insights
      const insights = await this.getInsights(); // This already filters by age
      await AsyncStorage.setItem(STORAGE_KEYS.INSIGHTS, JSON.stringify(insights));

      // Keep only recent summaries (last 50)
      const summaries = await this.getSummaries();
      const recentSummaries = summaries.slice(0, 50);
      await AsyncStorage.setItem(STORAGE_KEYS.SUMMARIES, JSON.stringify(recentSummaries));

    } catch (error) {
      console.error('Error pruning old data:', error);
    }
  }

  async clearAllMemories(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.INSIGHTS,
        STORAGE_KEYS.SUMMARIES,
        STORAGE_KEYS.EXTRACTION_METADATA
      ]);
      
      this.extractionMetadata = {
        lastExtraction: '',
        messageCount: 0
      };
    } catch (error) {
      console.error('Error clearing all memories:', error);
      throw error;
    }
  }

  async getMemoryStats(): Promise<any> {
    try {
      const [insights, summaries] = await Promise.all([
        this.getInsights(),
        this.getSummaries()
      ]);

      const insightsByCategory = insights.reduce((acc, insight) => {
        acc[insight.category] = (acc[insight.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalInsights: insights.length,
        insightsByCategory,
        sessionSummaries: summaries.filter(s => s.type === 'session').length,
        consolidatedSummaries: summaries.filter(s => s.type === 'consolidated').length,
        lastExtraction: this.extractionMetadata.lastExtraction,
        totalMessageCount: this.extractionMetadata.messageCount
      };
    } catch (error) {
      console.error('Error getting memory stats:', error);
      return null;
    }
  }
}

export const memoryService = new MemoryService();