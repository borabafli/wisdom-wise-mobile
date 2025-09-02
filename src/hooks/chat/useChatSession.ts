import { useState, useCallback } from 'react';
import { Message, storageService } from '../../services/storageService';
import { contextService } from '../../services/contextService';
import { apiService } from '../../services/apiService';
import { rateLimitService } from '../../services/rateLimitService';
import { ttsService } from '../../services/ttsService';
import { useSessionManagement } from '../useSessionManagement';
import { getExerciseFlow, exerciseLibraryData } from '../../data/exerciseLibrary';

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
  currentExerciseStep: number | null;
  exerciseFlow: any | null;
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
  handleExerciseSendMessage: (text: string, currentStep: number) => Promise<void>;
  handleStartExercise: (exercise: any, preserveChat?: boolean) => Promise<void>;
  handleConfirmExerciseTransition: (exercise: any) => Promise<void>;
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
  const [currentExerciseStep, setCurrentExerciseStep] = useState<number | null>(null);
  const [exerciseFlow, setExerciseFlow] = useState<any>(null);

  const { isLoading, initializeSession, handleEndSession: sessionEndHandler } = useSessionManagement();

  const initializeChatSession = useCallback(async () => {
    try {
      const rateLimitStatus = await rateLimitService.getRateLimitStatus();
      setRateLimitStatus(rateLimitStatus);

      console.log('=== CHAT INITIALIZATION ===');

      if (currentExercise) {
        console.log('Exercise detected - delegating to handleStartExercise:', currentExercise.type);
        await handleStartExercise(currentExercise);
        return;
      } else {
        console.log('Starting fresh chat session');
        const initialMessages = await initializeSession();
        
        setMessages(initialMessages);
        setSuggestions([]); // No initial suggestions - wait for AI
      }
    } catch (error) {
      console.error('Error initializing chat session:', error);
    }
  }, [currentExercise, initializeSession]);

  const handleSuggestExercise = async () => {
    console.log('🎯 User requested exercise suggestion');
    const suggestionText = "I need some help right now. Could you suggest a therapeutic exercise for me?";
    await handleSendMessage(suggestionText);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: (Date.now() + Math.random()).toString(),
      type: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => {
      const filteredMessages = prev.filter(msg => msg.type !== 'welcome');
      return [...filteredMessages, userMessage];
    });

    try {
      await storageService.addMessage(userMessage);
    } catch (error) {
      console.error('Error saving user message:', error);
    }

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

      setIsTyping(true);

      const recentMessages = await storageService.getLastMessages(20);
      
      // Check if we're in exercise mode
      let context;
      if (exerciseFlow && currentExerciseStep) {
        console.log(`🎯 In exercise mode: Step ${currentExerciseStep}, using exercise context`);
        context = await contextService.assembleExerciseContext(
          recentMessages,
          exerciseFlow,
          currentExerciseStep,
          [],
          false // Not the first message in step
        );
      } else {
        console.log('🎯 In regular chat mode, using chat context');
        context = await contextService.assembleContext(recentMessages);
      }

      const response = await apiService.getChatCompletionWithContext(context);
      console.log('API response:', response);
      console.log('🔍 Exercise card debug - nextAction:', response.nextAction);
      console.log('🔍 Exercise card debug - exerciseData:', response.exerciseData);
      
      // Log if AI is now providing nextAction field
      if (response.nextAction !== undefined) {
        console.log('✅ AI is now providing nextAction field:', response.nextAction);
      } else {
        console.log('❌ AI still not providing nextAction field');
      }

      setIsTyping(false);

      if (response.success && response.message) {
        await rateLimitService.recordRequest();
        const newRateLimitStatus = await rateLimitService.getRateLimitStatus();
        setRateLimitStatus(newRateLimitStatus);

        // Create appropriate message type based on context
        let aiResponse: Message;
        if (exerciseFlow && currentExerciseStep) {
          // In exercise mode: create exercise-type message
          const currentStep = exerciseFlow.steps[currentExerciseStep - 1];
          aiResponse = {
            id: (Date.now() + Math.random()).toString(),
            type: 'exercise',
            title: `Step ${currentStep.stepNumber}: ${currentStep.title}`,
            content: response.message,
            exerciseType: exerciseFlow.type,
            color: exerciseFlow.color,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isAIGuided: true
          };
        } else {
          // Regular chat mode: create system message
          aiResponse = {
            id: (Date.now() + Math.random()).toString(),
            type: 'system',
            content: response.message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        }

        setMessages(prev => [...prev, aiResponse]);
        await storageService.addMessage(aiResponse);
        await ttsService.speakIfAutoPlay(response.message);

        // Handle exercise step progression if in exercise mode
        if (exerciseFlow && currentExerciseStep) {
          // Check if AI wants to advance to next step
          let shouldAdvanceStep = false;
          try {
            if (response.nextStep !== undefined) {
              shouldAdvanceStep = response.nextStep;
              console.log('🎯 AI decided nextStep:', shouldAdvanceStep);
            }
          } catch (parseError) {
            console.log('No nextStep flag found, staying in current step');
          }

          if (shouldAdvanceStep && currentExerciseStep < exerciseFlow.steps.length) {
            // Advance to next step
            const newStepIndex = currentExerciseStep + 1;
            setCurrentExerciseStep(newStepIndex);
            console.log('✅ AI advanced to step:', newStepIndex);
          } else if (shouldAdvanceStep && currentExerciseStep >= exerciseFlow.steps.length) {
            // Exercise completed
            console.log('🎉 AI completed exercise');
            setExerciseFlow(null);
            setCurrentExerciseStep(null);
          }

          // Use AI-generated suggestions for exercises
          if (response.suggestions && response.suggestions.length > 0) {
            setSuggestions(response.suggestions);
          } else {
            setSuggestions([]);
          }
        } else {
          // Regular chat suggestions
          if (response.suggestions && response.suggestions.length > 0) {
            console.log('Using AI-generated suggestions:', response.suggestions);
            setSuggestions(response.suggestions);
          } else {
            console.log('No AI suggestions provided, not showing any suggestions');
            setSuggestions([]); // Only show suggestions when AI provides them
          }
        }

        // Only show exercise cards if we're NOT already in an exercise
        if (!exerciseFlow && !currentExerciseStep) {
          console.log('🎯 Checking exercise card trigger...');
          if (response.nextAction === 'showExerciseCard' && response.exerciseData) {
          console.log('🎯 Exercise card should show! Type:', response.exerciseData.type);
          // Get complete exercise data from library
          const fullExerciseData = exerciseLibraryData[response.exerciseData.type];
          console.log('🎯 Full exercise data found:', fullExerciseData);
          if (fullExerciseData) {
            console.log('🎯 Setting exercise card state...');
            setShowExerciseCard(fullExerciseData);
          }
        } else {
          console.log('🎯 No exercise card trigger. nextAction:', response.nextAction, 'exerciseData:', response.exerciseData);
          
          // FALLBACK: Check if this might be a confirmation that AI missed
          const userText = text.toLowerCase();
          const confirmationWords = ['yes', 'sure', 'okay', 'ok', "let's try", "let's do", 'i want to', 'sounds good'];
          const isConfirmation = confirmationWords.some(word => userText.includes(word));
          
          if (isConfirmation) {
            console.log('🔍 FALLBACK: Detected potential exercise confirmation:', userText);
            // Check recent messages for exercise suggestions
            const recentMessages = await storageService.getLastMessages(5);
            const hasRecentExerciseSuggestion = recentMessages.some(msg => 
              msg.type === 'system' && (
                msg.content?.toLowerCase().includes('exercise') ||
                msg.content?.toLowerCase().includes('breathing') ||
                msg.content?.toLowerCase().includes('body scan') ||
                msg.content?.toLowerCase().includes('gratitude') ||
                msg.content?.toLowerCase().includes('automatic thought')
              )
            );
            
            if (hasRecentExerciseSuggestion) {
              console.log('🎯 FALLBACK: Found recent exercise suggestion, trying to match exercise type');
              // Try to determine exercise type from AI response or recent messages
              let exerciseType = 'breathing'; // Default fallback
              
              if (response.message?.toLowerCase().includes('breathing') || response.message?.toLowerCase().includes('breath')) {
                exerciseType = 'breathing';
              } else if (response.message?.toLowerCase().includes('body scan') || response.message?.toLowerCase().includes('body')) {
                exerciseType = 'mindfulness';
              } else if (response.message?.toLowerCase().includes('gratitude')) {
                exerciseType = 'gratitude';
              } else if (response.message?.toLowerCase().includes('thought') || response.message?.toLowerCase().includes('cognitive')) {
                exerciseType = 'automatic-thoughts';
              }
              
              console.log('🎯 FALLBACK: Using exercise type:', exerciseType);
              const fallbackExercise = exerciseLibraryData[exerciseType];
              if (fallbackExercise) {
                console.log('🎯 FALLBACK: Showing exercise card for:', fallbackExercise.name);
                setShowExerciseCard(fallbackExercise);
              }
            }
          }
        }
        } // Close the "only show exercise cards if we're NOT in exercise" block

      } else {
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

  const handleExerciseSendMessage = async (text: string, currentStep: number) => {
    console.log('Handling message within an exercise flow');
  };

  const handleConfirmExerciseTransition = useCallback(async (exercise: any) => {
    console.log(`🎯 User confirmed exercise transition to: ${exercise.name}`);
    
    // Clear the exercise card since we're transitioning
    setShowExerciseCard(null);
    
    // Use handleStartExercise with preserveChat = true
    await handleStartExercise(exercise, true);
  }, []);

  const handleStartExercise = useCallback(async (exercise: any, preserveChat: boolean = false) => {
    console.log(`Starting AI-guided exercise flow for: ${exercise.name}, preserveChat: ${preserveChat}`);

    try {
      // Get predefined exercise flow
      const flow = getExerciseFlow(exercise.type);
      if (!flow || !flow.steps || flow.steps.length === 0) {
        console.error(`Exercise flow not found for type: ${exercise.type}`);
        return;
      }

      console.log('Generated dynamic flow with', flow.steps.length, 'steps');
      
      // Set exercise flow state
      setExerciseFlow(flow);
      setCurrentExerciseStep(1);

      const currentStep = flow.steps[0];

      // Clear chat if not preserving (like library behavior)
      if (!preserveChat) {
        await storageService.clearCurrentSession();
      }

      // Use the rich exercise context system for AI-generated guidance
      console.log(`🎯 Starting AI-guided exercise: Step 1, isFirstMessageInStep=true`);
      console.log('🎯 Exercise flow:', flow);
      console.log('🎯 Exercise type:', exercise.type);
      
      const exerciseContext = await contextService.assembleExerciseContext(
        [], // No previous messages for first step
        flow,
        1, // Step 1
        [],
        true // This IS the first message in step 1
      );
      
      console.log('🎯 Exercise context assembled:', exerciseContext.length, 'messages');

      // Add the initial user message to start the exercise
      exerciseContext.push({
        role: 'user',
        content: `I'm ready to start the ${exercise.name} exercise. Please guide me through step 1.`
      });
      
      console.log('🎯 Final context for API:', exerciseContext.length, 'messages');
      console.log('🎯 Calling AI API...');

      setIsTyping(true);
      const response = await apiService.getChatCompletionWithContext(exerciseContext);
      setIsTyping(false);
      
      console.log('🎯 AI API Response received:', response);

      if (response.success && response.message) {
        const aiMessage: Message = {
          id: Date.now().toString(),
          type: 'exercise',
          title: `Step ${currentStep.stepNumber}: ${currentStep.title}`,
          content: response.message,
          exerciseType: exercise.type,
          color: flow.color,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAIGuided: true
        };

        if (preserveChat) {
          setMessages(prev => [...prev, aiMessage]);
        } else {
          setMessages([aiMessage]);
        }
        
        await storageService.addMessage(aiMessage);

        // Extract AI-generated suggestions
        if (response.suggestions && response.suggestions.length > 0) {
          setSuggestions(response.suggestions);
        } else {
          setSuggestions([]);
        }

        console.log('AI-guided exercise started successfully');
      } else {
        console.error('Failed to start AI-guided exercise - API call failed');
        console.error('AI Response:', response);
        
        // Don't create fake static messages - instead show error and retry
        const errorMessage: Message = {
          id: `exercise-error-${Date.now()}`,
          type: 'system',
          content: `I'm having trouble starting the ${exercise.name} exercise right now. Let me try again...`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        if (preserveChat) {
          setMessages(prev => [...prev, errorMessage]);
        } else {
          setMessages([errorMessage]);
        }
        
        await storageService.addMessage(errorMessage);
        
        // Retry the AI call after a short delay
        console.log('Retrying AI-guided exercise in 2 seconds...');
        setTimeout(async () => {
          try {
            setIsTyping(true);
            const retryResponse = await apiService.getChatCompletionWithContext(exerciseContext);
            setIsTyping(false);

            if (retryResponse.success && retryResponse.message) {
              const aiMessage: Message = {
                id: Date.now().toString(),
                type: 'exercise',
                title: `Step ${currentStep.stepNumber}: ${currentStep.title}`,
                content: retryResponse.message,
                exerciseType: exercise.type,
                color: flow.color,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isAIGuided: true
              };

              setMessages(prev => [...prev, aiMessage]);
              await storageService.addMessage(aiMessage);

              if (retryResponse.suggestions && retryResponse.suggestions.length > 0) {
                setSuggestions(retryResponse.suggestions);
              } else {
                setSuggestions([]);
              }

              console.log('AI-guided exercise started successfully on retry');
            } else {
              console.error('Retry also failed - giving up');
              const finalErrorMessage: Message = {
                id: `exercise-final-error-${Date.now()}`,
                type: 'system',
                content: `I'm sorry, I can't start the guided exercise right now. You can try again later or start a regular conversation.`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              };
              setMessages(prev => [...prev, finalErrorMessage]);
              await storageService.addMessage(finalErrorMessage);
              
              // Reset exercise state since it failed
              setExerciseFlow(null);
              setCurrentExerciseStep(null);
            }
          } catch (retryError) {
            console.error('Retry error:', retryError);
            setIsTyping(false);
          }
        }, 2000);

        setSuggestions([]);
      }

    } catch (error) {
      console.error('Error starting AI-guided exercise:', error);
      setIsTyping(false);
    }
  }, []);

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
    currentExerciseStep,
    exerciseFlow,
    setMessages,
    setSuggestions,
    setIsTyping,
    setShowExerciseCard,
    initializeChatSession,
    handleSendMessage,
    handleSuggestExercise,
    handleEndSession,
    handleExerciseSendMessage,
    handleStartExercise,
    handleConfirmExerciseTransition,
  };
};

export default useChatSession;
