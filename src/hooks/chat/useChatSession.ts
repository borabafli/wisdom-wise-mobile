import { useState, useEffect, useCallback } from 'react';
import { Platform, Alert } from 'react-native';
import { Message, storageService } from '../../services/storageService';
import { contextService } from '../../services/contextService';
import { apiService } from '../../services/apiService';
import { rateLimitService } from '../../services/rateLimitService';
import { ttsService } from '../../services/ttsService';
import { insightService } from '../../services/insightService';

interface ChatSessionState {
  messages: Message[];
  suggestions: string[];
  isLoading: boolean;
  isTyping: boolean;
  rateLimitStatus: {
    used: number;
    total: number;
    percentage: number;
    message: string;
  };
  showExerciseCard: any;
}

interface UseChatSessionReturn extends ChatSessionState {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setSuggestions: React.Dispatch<React.SetStateAction<string[]>>;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  setShowExerciseCard: React.Dispatch<React.SetStateAction<any>>;
  initializeChatSession: () => Promise<void>;
  handleSendMessage: (text: string) => Promise<void>;
  handleEndSession: (onBack: () => void) => void;
}

export const useChatSession = (
  currentExercise?: any,
  exerciseFlows?: Record<string, any>
): UseChatSessionReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [rateLimitStatus, setRateLimitStatus] = useState({ 
    used: 0, 
    total: 300, 
    percentage: 0, 
    message: '' 
  });
  const [showExerciseCard, setShowExerciseCard] = useState<any>(null);

  const initializeChatSession = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Load rate limit status
      const rateLimitStatus = await rateLimitService.getRateLimitStatus();
      setRateLimitStatus(rateLimitStatus);
      
      console.log('=== CHAT INITIALIZATION ===');
      console.log('currentExercise:', currentExercise);
      console.log('Exercise type:', currentExercise?.type);
      console.log('Available exercise flows:', Object.keys(exerciseFlows || {}));
      console.log('Flow found:', exerciseFlows?.[currentExercise?.type]);
      
      // Handle exercise flow vs regular chat
      if (currentExercise && exerciseFlows?.[currentExercise.type]) {
        const flow = exerciseFlows[currentExercise.type];
        
        if (flow.useAI && flow.steps?.length > 0) {
          // AI-guided exercise with step structure - delegate to parent
          console.log('AI-guided exercise detected - delegating to parent component:', currentExercise.type);
          return; // Let parent handle AI-guided exercises
        } else if (flow.useAI) {
          // AI-driven exercise - delegate to parent
          console.log('AI-driven exercise detected - delegating to parent component:', currentExercise.type);
          return; // Let parent handle AI-driven exercises  
        } else {
          // Static exercise flow
          const initialMessage: Message = {
            id: Date.now().toString(),
            type: 'exercise',
            title: flow.steps?.[0]?.title,
            content: flow.steps?.[0]?.content,
            exerciseType: currentExercise.type,
            color: flow.color,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages([initialMessage]);
          setSuggestions(flow.steps?.[0]?.suggestions || []);
        }
      } else {
        // Regular chat - load from storage or create welcome
        await loadOrCreateChatSession();
      }
    } catch (error) {
      console.error('Error initializing chat session:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentExercise, exerciseFlows]);

  const loadOrCreateChatSession = async () => {
    try {
      // Always start with a fresh session - don't load existing messages
      await storageService.clearCurrentSession();
      
      // Create new conversation with welcome message
      const welcomeMessage = contextService.createWelcomeMessage();
      const firstSuggestions = contextService.generateSuggestions([]);
      
      setMessages([welcomeMessage]);
      setSuggestions(firstSuggestions);
      
      // Save welcome message to storage
      await storageService.addMessage(welcomeMessage);
    } catch (error) {
      console.error('Error creating fresh chat session:', error);
      // Fallback to local welcome message
      const welcomeMessage = contextService.createWelcomeMessage();
      const fallbackSuggestions = contextService.generateSuggestions([]);
      
      setMessages([welcomeMessage]);
      setSuggestions(fallbackSuggestions);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Create user message
    const userMessage: Message = {
      id: (Date.now() + Math.random()).toString(),
      type: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Add user message to UI and storage - remove welcome message if it exists
    setMessages(prev => {
      const filteredMessages = prev.filter(msg => msg.type !== 'welcome');
      return [...filteredMessages, userMessage];
    });
    
    try {
      await storageService.addMessage(userMessage);
    } catch (error) {
      console.error('Error saving user message:', error);
    }

    // Check rate limit first
    try {
      const rateLimit = await rateLimitService.canMakeRequest();
      
      if (rateLimit.isLimitReached) {
        const limitMessage: Message = {
          id: (Date.now() + Math.random()).toString(),
          type: 'system',
          content: rateLimitService.getRateLimitMessage(rateLimit),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, limitMessage]);
        await storageService.addMessage(limitMessage);
        return;
      }

      // Show typing indicator
      setIsTyping(true);

      // Get conversation context
      const recentMessages = await storageService.getLastMessages(20);
      const context = contextService.assembleContext(recentMessages);

      // Make API call
      const response = await apiService.getChatCompletionWithContext(context);
      console.log('API response:', response);

      setIsTyping(false);

      if (response.success && response.message) {
        // Record successful request for rate limiting
        await rateLimitService.recordRequest();
        
        // Update rate limit status
        const newRateLimitStatus = await rateLimitService.getRateLimitStatus();
        setRateLimitStatus(newRateLimitStatus);

        // Create AI response message
        const aiResponse: Message = {
          id: (Date.now() + Math.random()).toString(),
          type: 'system',
          content: response.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, aiResponse]);
        await storageService.addMessage(aiResponse);

        // Auto-play TTS if enabled
        await ttsService.speakIfAutoPlay(response.message);

        // Prefer server-provided suggestions; fallback to contextual generator
        const contextualSuggestions = response.suggestions && response.suggestions.length > 0
          ? response.suggestions
          : contextService.generateSuggestions([
              ...recentMessages,
              userMessage,
              aiResponse,
            ]);
        setSuggestions(contextualSuggestions);
      } else {
        // API error - show fallback response
        const fallbackMessage: Message = {
          id: (Date.now() + Math.random()).toString(),
          type: 'system',
          content: apiService.getFallbackResponse(text),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, fallbackMessage]);
        await storageService.addMessage(fallbackMessage);
        console.error('API Error:', response.error || 'Connection failed');
      }
    } catch (error) {
      setIsTyping(false);
      console.error('Error in handleSendMessage:', error);
      
      // Show fallback response for any unexpected errors
      const fallbackMessage: Message = {
        id: (Date.now() + Math.random()).toString(),
        type: 'system',
        content: apiService.getFallbackResponse(text),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, fallbackMessage]);
      try {
        await storageService.addMessage(fallbackMessage);
      } catch (storageError) {
        console.error('Error saving fallback message:', storageError);
      }
    }
  };

  // Handle session end with confirmation
  const handleEndSession = (onBack: () => void) => {
    console.log('handleEndSession called, messages length:', messages.length);
    
    // Check if we have any user messages (real conversation)
    const userMessages = messages.filter(msg => msg.type === 'user');
    console.log('User messages count:', userMessages.length);
    
    if (userMessages.length > 0) {
      console.log('Showing save dialog');
      
      if (Platform.OS === 'web') {
        // Use browser's native confirm for web
        const shouldSave = window.confirm(
          "Would you like to save this conversation to your history?\n\nClick 'OK' to save or 'Cancel' to discard."
        );
        
        if (shouldSave) {
          console.log('User chose: Save & End (web)');
          extractInsightsAndSaveSession(onBack);
        } else {
          console.log('User chose: Don\'t Save (web)');
          extractInsightsAndEnd(onBack);
        }
      } else {
        // Use React Native Alert for mobile
        Alert.alert(
          "End Session?",
          "Would you like to save this conversation to your history?",
          [
            {
              text: "Don't Save",
              style: "destructive",
              onPress: () => {
                console.log('User chose: Don\'t Save');
                extractInsightsAndEnd(onBack);
              }
            },
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => console.log('User chose: Cancel')
            },
            {
              text: "Save & End",
              style: "default", 
              onPress: () => {
                console.log('User chose: Save & End');
                extractInsightsAndSaveSession(onBack);
              }
            }
          ],
          { cancelable: false }
        );
      }
    } else {
      console.log('No user messages, going back directly');
      onBack();
    }
  };

  // Extract insights and save session - BACKGROUND PROCESSING
  const extractInsightsAndSaveSession = async (onBack: () => void) => {
    try {
      console.log('Starting background session save and insight extraction...');
      
      // IMMEDIATELY return to main app - don't block the user!
      onBack();
      
      // Continue processing in background
      await storageService.saveToHistory();
      await storageService.clearCurrentSession();
      console.log('Session saved to history and cleared');
      
      // Process insights in background (slow AI operations)
      setTimeout(async () => {
        try {
          const patterns = await insightService.extractAtSessionEnd();
          
          if (patterns.length > 0) {
            console.log(`✅ Background: Extracted ${patterns.length} thought patterns`);
          }
        } catch (error) {
          console.error('Background insight extraction failed:', error);
        }
      }, 100);
      
    } catch (error) {
      console.error('Error in extractInsightsAndSaveSession:', error);
      onBack();
    }
  };

  // Extract insights but don't save conversation - BACKGROUND PROCESSING
  const extractInsightsAndEnd = async (onBack: () => void) => {
    try {
      console.log('Background insight extraction (not saving conversation)...');
      
      // IMMEDIATELY return to main app - don't block the user!
      onBack();
      
      // Clear session first (fast operation)
      await storageService.clearCurrentSession();
      console.log('Session cleared');
      
      // Extract insights in background (slow AI operation)
      setTimeout(async () => {
        try {
          const patterns = await insightService.extractAtSessionEnd();
          
          if (patterns.length > 0) {
            console.log(`✅ Background: Extracted ${patterns.length} thought patterns (conversation not saved)`);
          }
        } catch (error) {
          console.error('Background insight extraction failed:', error);
        }
      }, 100);
      
    } catch (error) {
      console.error('Error in extractInsightsAndEnd:', error);
      onBack();
    }
  };

  return {
    messages,
    suggestions,
    isLoading,
    isTyping,
    rateLimitStatus,
    showExerciseCard,
    setMessages,
    setSuggestions,
    setIsTyping,
    setShowExerciseCard,
    initializeChatSession,
    handleSendMessage,
    handleEndSession,
  };
};

export default useChatSession;