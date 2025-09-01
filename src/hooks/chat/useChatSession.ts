import { useState, useEffect, useCallback } from 'react';
import { Platform, Alert } from 'react-native';
import { Message, storageService } from '../../services/storageService';
import { contextService } from '../../services/contextService';
import { apiService } from '../../services/apiService';
import { rateLimitService } from '../../services/rateLimitService';
import { ttsService } from '../../services/ttsService';
import { insightService } from '../../services/insightService';
import { EXERCISE_KEYWORDS, getExerciseByType } from '../../data/exerciseLibrary';


// Detect exercise suggestions in AI messages (returns exercise type key, not full object)
function detectExerciseFromMessage(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  // Look for exercise suggestions in the message
  for (const [exerciseType, keywords] of Object.entries(EXERCISE_KEYWORDS)) {
    const hasKeyword = keywords.some(keyword => lowerMessage.includes(keyword));
    const hasSuggestion = lowerMessage.includes('would you like to try') ||
      lowerMessage.includes('want to try') ||
      lowerMessage.includes('exercise') ||
      lowerMessage.includes('practice');
    
    if (hasKeyword && hasSuggestion) {
      console.log(`🎯 Detected ${exerciseType} exercise suggestion in message`);
      return exerciseType;
    }
  }
  
  return null;
}

// Detect when user confirms they want to do an exercise
function detectExerciseConfirmation(userMessage: string, recentMessages: Message[]): any | null {
  const lowerUserMessage = userMessage.toLowerCase();
  
  // Check if user is responding positively to exercise suggestion
  const positiveResponses = [
    'yes', 'yeah', 'ok', 'okay', 'sure', 'let\'s try', 'let me try', 'i want to try',
    'yes please', 'sounds good', 'i\'d like to', 'i want to', 'let\'s do it',
    'help me', 'show me', 'i\'m ready', 'let\'s start', 'i need this'
  ];
  
  const isPositiveResponse = positiveResponses.some(response => 
    lowerUserMessage.includes(response)
  );
  
  if (!isPositiveResponse) {
    return null;
  }
  
  // Look in recent AI messages for exercise suggestions
  const recentAIMessages = recentMessages
    .filter(msg => msg.type === 'system')
    .slice(-3); // Check last 3 AI messages
  
  for (const aiMessage of recentAIMessages.reverse()) {
    const aiContent = aiMessage.content || aiMessage.text || '';
    const detectedExerciseType = detectExerciseFromMessage(aiContent);
    if (detectedExerciseType) {
      const exerciseData = getExerciseByType(detectedExerciseType);
      if (exerciseData) {
        console.log(`✅ User confirmed exercise: ${exerciseData.name}`);
        return exerciseData;
      }
    }
  }
  
  return null;
}


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
  handleSuggestExercise: () => Promise<void>;
  handleEndSession: (onBack: () => void) => void;
}

export const useChatSession = (
  currentExercise?: any
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
      
      // If there's a current exercise, delegate to parent for dynamic flow handling
      if (currentExercise) {
        console.log('Exercise detected - delegating to parent component for dynamic flow:', currentExercise.type);
        return; // Let parent handle all exercises dynamically
      } else {
        // Regular chat - load from storage or create welcome
        await loadOrCreateChatSession();
      }
    } catch (error) {
      console.error('Error initializing chat session:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentExercise]);

  const loadOrCreateChatSession = async () => {
    try {
      // Always start with a fresh session - don't load existing messages
      await storageService.clearCurrentSession();
      
      // Create new conversation with welcome message
      const welcomeMessage = contextService.createWelcomeMessage();
      
      setMessages([welcomeMessage]);
      // Don't set initial suggestions - let AI generate them if needed
      setSuggestions([]);
      
      // Save welcome message to storage
      await storageService.addMessage(welcomeMessage);
    } catch (error) {
      console.error('Error creating fresh chat session:', error);
      // Fallback to local welcome message
      const welcomeMessage = contextService.createWelcomeMessage();
      
      setMessages([welcomeMessage]);
      setSuggestions([]); // No hardcoded suggestions
    }
  };

  const handleSuggestExercise = async () => {
    console.log('🎯 User requested exercise suggestion');
    
    // Send a special message to get exercise recommendation
    const suggestionText = "Please suggest an exercise that might be helpful for me right now based on our conversation.";
    await handleSendMessage(suggestionText);
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

    // Check if user is confirming an exercise suggestion
    const exerciseConfirmation = detectExerciseConfirmation(text, messages);
    if (exerciseConfirmation) {
      console.log('🎯 User confirmed exercise:', exerciseConfirmation);
      setShowExerciseCard(exerciseConfirmation);
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

        // Server-side parsing now handles JSON code blocks, but keep minimal fallback
        const cleanedMessage = response.message;

        // Create AI response message
        const aiResponse: Message = {
          id: (Date.now() + Math.random()).toString(),
          type: 'system',
          content: cleanedMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, aiResponse]);
        await storageService.addMessage(aiResponse);

        // Auto-play TTS if enabled
        await ttsService.speakIfAutoPlay(response.message);

        // Don't show exercise card on AI suggestion - wait for user confirmation
        // The card will be shown when user responds positively to the suggestion

        // Only use AI-provided suggestions, no hardcoded fallbacks
        if (response.suggestions && response.suggestions.length > 0) {
          console.log('Using AI-generated suggestions:', response.suggestions);
          setSuggestions(response.suggestions);
        } else {
          console.log('No AI suggestions provided, showing none');
          setSuggestions([]);
        }
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
    handleSuggestExercise,
    handleEndSession,
  };
};

export default useChatSession;