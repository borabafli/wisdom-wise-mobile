import { moodRatingService, MoodStats } from '../services/moodRatingService';

export interface ExerciseRecommendation {
  exerciseType: string;
  effectivenessScore: number;
  averageMoodImprovement: number;
  timesUsed: number;
  reason: string;
}

export interface MoodInsight {
  type: 'trend' | 'recommendation' | 'milestone' | 'pattern';
  title: string;
  description: string;
  data?: any;
  actionable?: boolean;
}

class MoodAnalytics {
  async generateInsights(dateRange?: { from: Date; to: Date }): Promise<MoodInsight[]> {
    const insights: MoodInsight[] = [];
    
    try {
      const stats = await moodRatingService.getMoodStats(dateRange);
      
      if (stats.totalRatings === 0) {
        return [{
          type: 'recommendation',
          title: 'Start tracking your mood',
          description: 'Complete a few exercises and rate how they help you to unlock personalized insights!',
          actionable: true
        }];
      }

      // Mood trend insight
      if (stats.moodTrend.length >= 3) {
        const recent = stats.moodTrend.slice(-7); // Last 7 days
        const oldAvg = recent.slice(0, Math.floor(recent.length / 2)).reduce((sum, d) => sum + d.rating, 0) / Math.floor(recent.length / 2);
        const newAvg = recent.slice(Math.floor(recent.length / 2)).reduce((sum, d) => sum + d.rating, 0) / Math.ceil(recent.length / 2);
        
        if (newAvg > oldAvg + 0.3) {
          insights.push({
            type: 'trend',
            title: 'Mood is improving! 📈',
            description: `Your average mood has increased by ${((newAvg - oldAvg) * 20).toFixed(0)}% over the past week.`,
            data: { oldAvg, newAvg, improvement: newAvg - oldAvg }
          });
        } else if (newAvg < oldAvg - 0.3) {
          insights.push({
            type: 'trend',
            title: 'Consider extra self-care',
            description: `Your mood has been lower recently. This is normal - be gentle with yourself.`,
            data: { oldAvg, newAvg, decline: oldAvg - newAvg },
            actionable: true
          });
        }
      }

      // Exercise effectiveness insights
      const mostEffective = await moodRatingService.getMostEffectiveExercises(3);
      if (mostEffective.length > 0) {
        const topExercise = mostEffective[0];
        insights.push({
          type: 'recommendation',
          title: `${topExercise.exerciseType} works well for you!`,
          description: `This exercise has an effectiveness score of ${topExercise.effectivenessScore.toFixed(1)}/5 based on your ${topExercise.count} sessions.`,
          data: mostEffective,
          actionable: true
        });
      }

      // Milestone insights
      if (stats.totalRatings >= 10) {
        insights.push({
          type: 'milestone',
          title: '🎉 10+ exercise sessions completed!',
          description: `You've completed ${stats.totalRatings} exercise sessions. Your average mood rating is ${stats.averageMoodRating.toFixed(1)}/5.`
        });
      }

      // Pattern insights
      if (stats.averageHelpfulnessRating > 3.5) {
        insights.push({
          type: 'pattern',
          title: 'Exercises are helping! 💫',
          description: `You consistently rate exercises as helpful (${stats.averageHelpfulnessRating.toFixed(1)}/5 average). Keep up the great work!`
        });
      }

      return insights;
    } catch (error) {
      console.error('Error generating mood insights:', error);
      return [];
    }
  }

  async getExerciseRecommendations(limit: number = 3): Promise<ExerciseRecommendation[]> {
    try {
      const mostEffective = await moodRatingService.getMostEffectiveExercises(limit);
      
      return mostEffective.map(exercise => ({
        exerciseType: exercise.exerciseType,
        effectivenessScore: exercise.effectiveness,
        averageMoodImprovement: exercise.effectiveness - 2.5, // Assuming 2.5 is neutral
        timesUsed: exercise.count,
        reason: this.getRecommendationReason(exercise.effectiveness, exercise.count)
      }));
    } catch (error) {
      console.error('Error getting exercise recommendations:', error);
      return [];
    }
  }

  private getRecommendationReason(effectiveness: number, count: number): string {
    if (effectiveness >= 4.5 && count >= 5) {
      return "Consistently excellent results";
    } else if (effectiveness >= 4.0) {
      return "Shows strong positive impact";
    } else if (effectiveness >= 3.5) {
      return "Moderate positive impact";
    } else if (count >= 10) {
      return "Frequently used - worth trying";
    } else {
      return "Based on your usage pattern";
    }
  }

  async getMoodTrendData(days: number = 30): Promise<{ date: string; rating: number }[]> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);
      
      const stats = await moodRatingService.getMoodStats({ from: startDate, to: endDate });
      return stats.moodTrend;
    } catch (error) {
      console.error('Error getting mood trend data:', error);
      return [];
    }
  }
}

export const moodAnalytics = new MoodAnalytics();