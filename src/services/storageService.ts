import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Message {
  id: string;
  type: 'user' | 'system' | 'exercise' | 'welcome';
  text?: string;
  content?: string;
  title?: string;
  exerciseType?: string;
  color?: string;
  timestamp: string;
  isAIGuided?: boolean;
  showName?: boolean;
}

export interface ThoughtPattern {
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

export interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  thoughtPatterns?: ThoughtPattern[];
}

const STORAGE_KEYS = {
  CURRENT_SESSION: 'chat_current_session',
  CHAT_HISTORY: 'chat_history',
  USER_SETTINGS: 'user_settings',
  THOUGHT_PATTERNS: 'thought_patterns',
  INSIGHTS_HISTORY: 'insights_history'
};

class StorageService {
  // Current session management
  async getCurrentSession(): Promise<ChatSession | null> {
    try {
      const sessionData = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Error loading current session:', error);
      return null;
    }
  }

  async saveCurrentSession(session: ChatSession): Promise<void> {
    try {
      session.updatedAt = new Date().toISOString();
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));
    } catch (error) {
      console.error('Error saving current session:', error);
      throw error;
    }
  }

  async createNewSession(): Promise<ChatSession> {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await this.saveCurrentSession(newSession);
    return newSession;
  }

  // Message management
  async addMessage(message: Message): Promise<void> {
    try {
      let session = await this.getCurrentSession();
      
      if (!session) {
        session = await this.createNewSession();
      }
      
      session.messages.push(message);
      await this.saveCurrentSession(session);
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }

  async getMessages(): Promise<Message[]> {
    try {
      const session = await this.getCurrentSession();
      return session?.messages || [];
    } catch (error) {
      console.error('Error loading messages:', error);
      return [];
    }
  }

  // Get last N messages for context
  async getLastMessages(count: number): Promise<Message[]> {
    try {
      const messages = await this.getMessages();
      return messages.slice(-count);
    } catch (error) {
      console.error('Error loading last messages:', error);
      return [];
    }
  }

  // Clear current session (start fresh)
  async clearCurrentSession(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
    } catch (error) {
      console.error('Error clearing current session:', error);
      throw error;
    }
  }

  // Chat history management
  async saveToHistory(): Promise<void> {
    try {
      const currentSession = await this.getCurrentSession();
      if (!currentSession || currentSession.messages.length === 0) {
        return;
      }

      // Add session metadata
      const userMessages = currentSession.messages.filter(msg => msg.type === 'user');
      const systemMessages = currentSession.messages.filter(msg => msg.type === 'system');
      
      const sessionWithMetadata = {
        ...currentSession,
        metadata: {
          messageCount: currentSession.messages.length,
          userMessageCount: userMessages.length,
          systemMessageCount: systemMessages.length,
          duration: this.calculateSessionDuration(currentSession.messages),
          firstMessage: userMessages[0]?.text?.substring(0, 50) + '...' || 'New session',
          savedAt: new Date().toISOString()
        }
      };

      const historyData = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      const history: any[] = historyData ? JSON.parse(historyData) : [];
      
      history.unshift(sessionWithMetadata); // Add to beginning (most recent first)
      
      // Keep only last 20 sessions to avoid storage bloat
      if (history.length > 20) {
        history.splice(20);
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  }

  // Calculate session duration from messages
  private calculateSessionDuration(messages: Message[]): string {
    if (messages.length < 2) return '< 1 min';
    
    const firstMessage = messages[0];
    const lastMessage = messages[messages.length - 1];
    
    // Simple duration calculation based on message timestamps
    const messageCount = messages.filter(msg => msg.type === 'user').length;
    const estimatedMinutes = Math.max(1, Math.floor(messageCount * 2)); // ~2 minutes per exchange
    
    if (estimatedMinutes < 60) {
      return `${estimatedMinutes} min`;
    } else {
      const hours = Math.floor(estimatedMinutes / 60);
      const mins = estimatedMinutes % 60;
      return `${hours}h ${mins}m`;
    }
  }

  async getChatHistory(): Promise<ChatSession[]> {
    try {
      const historyData = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      return historyData ? JSON.parse(historyData) : [];
    } catch (error) {
      console.error('Error loading chat history:', error);
      return [];
    }
  }

  // Delete specific session from history
  async deleteSessionFromHistory(sessionId: string): Promise<void> {
    try {
      const historyData = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      const history: any[] = historyData ? JSON.parse(historyData) : [];
      
      const filteredHistory = history.filter(session => session.id !== sessionId);
      
      await AsyncStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(filteredHistory));
    } catch (error) {
      console.error('Error deleting session from history:', error);
      throw error;
    }
  }

  // Clear all chat history
  async clearChatHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
    } catch (error) {
      console.error('Error clearing chat history:', error);
      throw error;
    }
  }

  // User settings (rate limiting, preferences)
  async getUserSettings(): Promise<any> {
    try {
      const settingsData = await AsyncStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
      return settingsData ? JSON.parse(settingsData) : {
        dailyRequestCount: 0,
        dailyRequestLimit: 300, // Default limit
        lastRequestDate: null
      };
    } catch (error) {
      console.error('Error loading user settings:', error);
      return { dailyRequestCount: 0, dailyRequestLimit: 300, lastRequestDate: null };
    }
  }

  async saveUserSettings(settings: any): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving user settings:', error);
      throw error;
    }
  }

  // Debug/utility methods
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.CURRENT_SESSION,
        STORAGE_KEYS.CHAT_HISTORY,
        STORAGE_KEYS.USER_SETTINGS,
        STORAGE_KEYS.THOUGHT_PATTERNS,
        STORAGE_KEYS.INSIGHTS_HISTORY
      ]);
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }

  // Thought Patterns Management
  async addThoughtPattern(pattern: ThoughtPattern): Promise<void> {
    try {
      const patterns = await this.getThoughtPatterns();
      patterns.push(pattern);
      await AsyncStorage.setItem(STORAGE_KEYS.THOUGHT_PATTERNS, JSON.stringify(patterns));
    } catch (error) {
      console.error('Error adding thought pattern:', error);
      throw error;
    }
  }

  async getThoughtPatterns(): Promise<ThoughtPattern[]> {
    try {
      const patternsData = await AsyncStorage.getItem(STORAGE_KEYS.THOUGHT_PATTERNS);
      return patternsData ? JSON.parse(patternsData) : [];
    } catch (error) {
      console.error('Error loading thought patterns:', error);
      return [];
    }
  }

  async getThoughtPatternsBySession(sessionId: string): Promise<ThoughtPattern[]> {
    try {
      const patterns = await this.getThoughtPatterns();
      return patterns.filter(pattern => pattern.extractedFrom.sessionId === sessionId);
    } catch (error) {
      console.error('Error loading patterns for session:', error);
      return [];
    }
  }

  async getRecentThoughtPatterns(limit: number = 10): Promise<ThoughtPattern[]> {
    try {
      const patterns = await this.getThoughtPatterns();
      return patterns
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Error loading recent patterns:', error);
      return [];
    }
  }

  async saveSessionInsights(sessionId: string, patterns: ThoughtPattern[]): Promise<void> {
    try {
      // Add patterns to global storage
      for (const pattern of patterns) {
        await this.addThoughtPattern(pattern);
      }

      // Also save to session
      const session = await this.getCurrentSession();
      if (session && session.id === sessionId) {
        session.thoughtPatterns = (session.thoughtPatterns || []).concat(patterns);
        await this.saveCurrentSession(session);
      }
    } catch (error) {
      console.error('Error saving session insights:', error);
      throw error;
    }
  }

  async clearThoughtPatterns(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.THOUGHT_PATTERNS);
    } catch (error) {
      console.error('Error clearing thought patterns:', error);
      throw error;
    }
  }

  async getStorageInfo(): Promise<any> {
    try {
      const currentSession = await this.getCurrentSession();
      const history = await this.getChatHistory();
      const settings = await this.getUserSettings();
      const patterns = await this.getThoughtPatterns();
      
      return {
        currentSessionMessages: currentSession?.messages.length || 0,
        historySessions: history.length,
        totalHistoryMessages: history.reduce((acc, session) => acc + session.messages.length, 0),
        thoughtPatterns: patterns.length,
        settings
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return null;
    }
  }
}

export const storageService = new StorageService();