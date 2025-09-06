// Exercise related types
export interface Exercise {
  id?: string;
  type: 'mindfulness' | 'stress-relief' | 'gratitude' | 'breathing' | 'meditation' | 'journaling';
  name: string;
  description: string;
  duration: string;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
}

// Insight and Analytics types
export interface Insight {
  id: string;
  type: 'mood' | 'progress' | 'pattern' | 'recommendation';
  title: string;
  description: string;
  value?: number | string;
  trend?: 'up' | 'down' | 'stable';
  date: Date;
}