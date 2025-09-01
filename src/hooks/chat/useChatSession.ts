import { useState, useCallback } from 'react';
import { Message, storageService } from '../../services/storageService';
import { contextService } from '../../services/contextService';
import { apiService } from '../../services/apiService';
import { rateLimitService } from '../../services/rateLimitService';
import { ttsService } from '../../services/ttsService';
import { EXERCISE_KEYWORDS, getExerciseByType } from '../../data/exerciseLibrary';
import { useSessionManagement } from '../useSessionManagement';


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
  isLoading: boolean;
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
  const [isTyping, setIsTyping] = useState(false);
  const [rateLimitStatus, setRateLimitStatus] = useState({ 
    used: 0, 
    total: 300, 
    percentage: 0, 
    message: '' 
  });
  const [showExerciseCard, setShowExerciseCard] = useState<any>(null);

  // Use the session management hook
  const { isLoading, initializeSession, handleEndSession: sessionEndHandler } = useSessionManagement();

  const initializeChatSession = useCallback(async () => {
    try {
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
        // Regular chat - use session management hook
        const welcomeMessages = await initializeSession();
        setMessages(welcomeMessages);
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error initializing chat session:', error);
    }
  }, [currentExercise, initializeSession]);

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
      const context = await contextService.assembleContext(recentMessages);

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

  // Handle session end with confirmation - delegate to session management hook
  const handleEndSession = useCallback((onBack: () => void) => {
    sessionEndHandler(onBack, messages);
  }, [sessionEndHandler, messages]);

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