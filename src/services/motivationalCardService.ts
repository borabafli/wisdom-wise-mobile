import { exerciseRatingService } from './exerciseRatingService';
import { visionInsightsService } from './visionInsightsService';
import { storageService } from './storageService';
import { memoryService } from './memoryService';

export interface MotivationalData {
  exerciseCompletions: number;
  exercisesThisWeek: number;
  lastReflectionType: string | null;
  visionQualities: string[];
  sessionsThisWeek: number;
  totalSessions: number;
  hasRecentActivity: boolean;
  daysSinceLastActivity: number;
}

export interface MotivationalMessage {
  emoji: string;
  text: string;
  category: 'achievement' | 'encouragement' | 'vision' | 'inspiration';
}

class MotivationalCardService {
  private messagePool: MotivationalMessage[] = [
    // Achievement messages (linked to activity)
    { emoji: '🎉', text: 'You completed {{exerciseCount}} exercises this week — building momentum!', category: 'achievement' },
    { emoji: '💡', text: 'Last session, you reflected on {{reflectionType}} — real progress!', category: 'achievement' },
    { emoji: '🌱', text: 'You reflected {{sessionCount}} times this week — growing stronger inside.', category: 'achievement' },
    { emoji: '✨', text: '{{totalSessions}} sessions completed — each one matters.', category: 'achievement' },

    // Encouragement messages (when no recent activity)
    { emoji: '🌿', text: 'Even one small reflection today can make a difference.', category: 'encouragement' },
    { emoji: '🌊', text: 'Remember: progress is like water, steady and flowing.', category: 'encouragement' },
    { emoji: '☀️', text: 'Your wellness journey continues — every step counts.', category: 'encouragement' },
    { emoji: '🕯️', text: 'Small moments of reflection can illuminate big changes.', category: 'encouragement' },

    // Vision tie-in messages (if vision data exists)
    { emoji: '🌿', text: 'Your vision: {{visionQualities}}. One step closer today.', category: 'vision' },
    { emoji: '✨', text: 'Building your {{visionQualities}} self — progress in motion.', category: 'vision' },
    { emoji: '🎯', text: 'Embodying {{visionQualities}} — your future self is proud.', category: 'vision' },

    // Inspirational messages (general wisdom)
    { emoji: '🌱', text: 'Growth happens in quiet moments of self-reflection.', category: 'inspiration' },
    { emoji: '🌊', text: 'Be water my friend — adapt, flow, and find your way.', category: 'inspiration' }
  ];

  async getMotivationalData(): Promise<MotivationalData> {
    try {
      // Get exercise data
      const exerciseInsights = await exerciseRatingService.getRatingInsights();
      const weeklyExerciseSummary = await exerciseRatingService.getRatingSummary(7);

      // Get vision data
      const latestVision = await visionInsightsService.getLatestVisionInsight();
      const visionQualities = latestVision?.coreQualities.slice(0, 2) || []; // Take first 2 qualities

      // Get session data from storage
      const chatHistory = await storageService.getChatHistory();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const sessionsThisWeek = chatHistory.filter(session => 
        new Date(session.createdAt) >= oneWeekAgo
      ).length;

      // Get recent memory summaries to understand last reflection type
      const summaries = await memoryService.getSummaries();
      const recentSummary = summaries && summaries.length > 0 ? summaries[0] : null;
      let lastReflectionType: string | null = null;

      if (recentSummary && recentSummary.content && typeof recentSummary.content === 'string') {
        const summaryText = recentSummary.content.toLowerCase();
        if (summaryText.includes('value') || summaryText.includes('values')) {
          lastReflectionType = 'your values';
        } else if (summaryText.includes('thought') || summaryText.includes('thinking')) {
          lastReflectionType = 'thinking patterns';
        } else if (summaryText.includes('vision') || summaryText.includes('future')) {
          lastReflectionType = 'your future vision';
        } else if (summaryText.includes('goal') || summaryText.includes('goals')) {
          lastReflectionType = 'your goals';
        } else if (summaryText.includes('strength') || summaryText.includes('strengths')) {
          lastReflectionType = 'your strengths';
        } else if (summaryText.includes('emotion') || summaryText.includes('feelings')) {
          lastReflectionType = 'emotions';
        }
      }

      // Calculate days since last activity
      const latestSessionDate = chatHistory.length > 0 
        ? new Date(chatHistory[0].createdAt)
        : new Date(0);
      const daysSinceLastActivity = Math.floor(
        (Date.now() - latestSessionDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      const hasRecentActivity = daysSinceLastActivity <= 3; // Active if used within 3 days

      return {
        exerciseCompletions: exerciseInsights.totalRatings,
        exercisesThisWeek: weeklyExerciseSummary.totalSessions,
        lastReflectionType,
        visionQualities,
        sessionsThisWeek,
        totalSessions: chatHistory.length,
        hasRecentActivity,
        daysSinceLastActivity
      };
    } catch (error) {
      console.error('Error getting motivational data:', error);
      return {
        exerciseCompletions: 0,
        exercisesThisWeek: 0,
        lastReflectionType: null,
        visionQualities: [],
        sessionsThisWeek: 0,
        totalSessions: 0,
        hasRecentActivity: false,
        daysSinceLastActivity: 999
      };
    }
  }

  generateMotivationalMessage(data: MotivationalData): MotivationalMessage {
    let availableMessages: MotivationalMessage[] = [];

    // Priority 1: Vision tie-in (if user has vision qualities)
    if (data.visionQualities.length > 0) {
      availableMessages = this.messagePool.filter(msg => msg.category === 'vision');
    }
    // Priority 2: Achievement messages (if recent activity)
    else if (data.hasRecentActivity) {
      availableMessages = this.messagePool.filter(msg => msg.category === 'achievement');
    }
    // Priority 3: Encouragement (if no recent activity)
    else if (!data.hasRecentActivity) {
      availableMessages = this.messagePool.filter(msg => msg.category === 'encouragement');
    }
    // Priority 4: Inspiration (fallback)
    else {
      availableMessages = this.messagePool.filter(msg => msg.category === 'inspiration');
    }

    // If no messages found, fallback to all encouragement messages
    if (availableMessages.length === 0) {
      availableMessages = this.messagePool.filter(msg => msg.category === 'encouragement');
    }

    // Randomly select from available messages
    const selectedMessage = availableMessages[Math.floor(Math.random() * availableMessages.length)] ||
      { emoji: '🌿', text: 'Your wellness journey continues', category: 'encouragement' as const };

    // Substitute placeholders with safe values
    let text = selectedMessage.text || 'Your wellness journey continues';
    text = text.replace('{{exerciseCount}}', (data.exercisesThisWeek || 0).toString());
    text = text.replace('{{reflectionType}}', data.lastReflectionType || 'wellness');
    text = text.replace('{{sessionCount}}', (data.sessionsThisWeek || 0).toString());
    text = text.replace('{{totalSessions}}', (data.totalSessions || 0).toString());
    text = text.replace('{{visionQualities}}', this.formatVisionQualities(data.visionQualities || []));

    return {
      emoji: selectedMessage.emoji || '🌿',
      text,
      category: selectedMessage.category || 'encouragement'
    };
  }

  private formatVisionQualities(qualities: string[]): string {
    if (qualities.length === 0) return 'mindful & present';
    if (qualities.length === 1) return qualities[0];
    if (qualities.length === 2) return `${qualities[0]} & ${qualities[1]}`;
    return `${qualities[0]}, ${qualities[1]} & ${qualities[2]}`;
  }

  generateStatsText(data: MotivationalData): string {
    if (data.exercisesThisWeek > 0 && data.sessionsThisWeek > 0) {
      return `${data.exercisesThisWeek} exercises • ${data.sessionsThisWeek} sessions this week`;
    } else if (data.exercisesThisWeek > 0) {
      return `${data.exercisesThisWeek} exercises completed this week`;
    } else if (data.sessionsThisWeek > 0) {
      return `${data.sessionsThisWeek} reflective sessions this week`;
    } else if (data.totalSessions > 0) {
      return `${data.totalSessions} total sessions — keep building!`;
    } else {
      return 'Your wellness journey starts here';
    }
  }

  getMotivationalStats(data: MotivationalData): Array<{ value: string; label: string }> {
    const stats = [];

    if (data.sessionsThisWeek > 0) {
      stats.push({ value: data.sessionsThisWeek.toString(), label: 'sessions' });
    }

    if (data.exercisesThisWeek > 0) {
      stats.push({ value: data.exercisesThisWeek.toString(), label: 'exercises' });
    }

    // If no weekly activity, show total sessions
    if (stats.length === 0 && data.totalSessions > 0) {
      stats.push({ value: data.totalSessions.toString(), label: 'total sessions' });
    }

    // Always show streak indicator if there's recent activity
    if (data.hasRecentActivity) {
      const streakDays = Math.max(1, 7 - data.daysSinceLastActivity);
      stats.push({ value: streakDays.toString(), label: 'day streak' });
    }

    // Fallback for new users
    if (stats.length === 0) {
      stats.push({ value: '1', label: 'starting today' });
    }

    return stats.slice(0, 3); // Max 3 stats
  }

  async getCompleteMotivationalCard(): Promise<{
    message: MotivationalMessage;
    statsText: string;
    stats: Array<{ value: string; label: string }>;
    data: MotivationalData;
  }> {
    const data = await this.getMotivationalData();
    const message = this.generateMotivationalMessage(data);
    const statsText = this.generateStatsText(data);
    const stats = this.getMotivationalStats(data);

    return {
      message,
      statsText,
      stats,
      data
    };
  }
}

export const motivationalCardService = new MotivationalCardService();