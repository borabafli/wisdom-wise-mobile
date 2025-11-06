import { useState, useCallback, useEffect } from 'react';
import { Message, storageService } from '../../services/storageService';
import { contextService } from '../../services/contextService';
import { apiService } from '../../services/apiService';
import { rateLimitService } from '../../services/rateLimitService';
import { entitlementService } from '../../services/entitlementService';
import { ttsService } from '../../services/ttsService';
import { useSessionManagement, ExerciseContext } from '../useSessionManagement';
import { EXERCISE_KEYWORDS, getExerciseLibraryData, getExercisesArray } from '../../data/exerciseLibrary';
import { memoryService } from '../../services/memoryService';

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
  handleEndSession: (onBack: () => void, exerciseContext?: ExerciseContext) => void;
  handleExerciseSendMessage: (text: string, currentStep: number) => Promise<void>;
  handleStartExercise: (exercise: any, preserveChat?: boolean) => Promise<void>;
  handleConfirmExerciseTransition: (exercise: any) => Promise<void>;
}

export const useChatSession = (
  currentExercise?: any,
  t: (key: string) => string = (key) => key
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
  const [showExerciseCard, _setShowExerciseCard] = useState<any>(null);

  const setShowExerciseCard = (exercise: any) => {
    _setShowExerciseCard(exercise);
  };
  const [currentExerciseStep, setCurrentExerciseStep] = useState<number | null>(null);
  const [exerciseFlow, setExerciseFlow] = useState<any>(null);

  const {
    isLoading,
    initializeSession,
    handleEndSession: sessionEndHandler,
    showExitConfirmation,
    confirmExit,
    cancelExit,
  } = useSessionManagement();

  const initializeChatSession = useCallback(async () => {
    try {
      const rateLimitStatus = await rateLimitService.getRateLimitStatus();
      setRateLimitStatus(rateLimitStatus);


      if (currentExercise) {
        await handleStartExercise(currentExercise);
        return;
      } else {
        const sessionData = await initializeSession();

        setMessages(sessionData.messages);
        setSuggestions(sessionData.suggestions); // AI-generated contextual chips
      }
    } catch (error) {
      console.error('Error initializing chat session:', error);
    }
  }, [currentExercise, initializeSession]);

  const handleSuggestExercise = async () => {
    console.log('🎯 User requested exercise suggestion');
    const suggestionText = "I need some help right now. Could you suggest an exercise for me?";
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
      
      let context;
      if (exerciseFlow && currentExerciseStep) {
        context = await contextService.assembleExerciseContext(
          recentMessages,
          exerciseFlow,
          currentExerciseStep,
          [],
          false
        );
      } else {
        context = await contextService.assembleContext(recentMessages);
      }

      const response = await apiService.getChatCompletionWithContext(context);
      
      if (response.nextAction !== undefined) {
      } else {
      }

      setIsTyping(false);

      if (response.success && response.message) {
        await rateLimitService.recordRequest();
        await entitlementService.incrementMessageCount();
        const newRateLimitStatus = await rateLimitService.getRateLimitStatus();
        setRateLimitStatus(newRateLimitStatus);

        let aiResponse: Message;
        if (exerciseFlow && currentExerciseStep) {
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

        if (exerciseFlow && currentExerciseStep) {
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
            const newStepIndex = currentExerciseStep + 1;
            setCurrentExerciseStep(newStepIndex);
            console.log('✅ AI advanced to step:', newStepIndex);
          } else if (shouldAdvanceStep && currentExerciseStep >= exerciseFlow.steps.length) {
            console.log('🎉 AI completed exercise');
            setExerciseFlow(null);
            setCurrentExerciseStep(null);
          }

          if (response.suggestions && response.suggestions.length > 0) {
            setSuggestions(response.suggestions);
          } else {
            setSuggestions([]);
          }
        } else {
          if (response.suggestions && response.suggestions.length > 0) {
            console.log('Using AI-generated suggestions:', response.suggestions);
            setSuggestions(response.suggestions);
          } else {
            console.log('No AI suggestions provided, not showing any suggestions');
            setSuggestions([]);
          }
        }

        if (response.nextAction === 'showExerciseCard') {
          console.log('🎯 AI wants to show exercise card. Verifying exercise...');
          const exercises = getExercisesArray(t);
          const sortedExercises = [...exercises].sort((a, b) => b.name.length - a.name.length);
          const aiMessage = response.message.toLowerCase();

          let foundExercise = null;

          if (response.exerciseData?.type) {
            const exerciseFromAI = sortedExercises.find(ex => ex.type === response.exerciseData.type);
            if (exerciseFromAI && aiMessage.includes(exerciseFromAI.name.toLowerCase())) {
              console.log('✅ Found matching exercise in AI response using exerciseData:', exerciseFromAI.name);
              foundExercise = exerciseFromAI;
            } else {
              console.warn('AI exerciseData.type does not match exercise name in message. Will search message text.');
            }
          }

          if (!foundExercise) {
            for (const exercise of sortedExercises) {
              if (aiMessage.includes(exercise.name.toLowerCase())) {
                console.log('🎯 Found exercise by name in message text:', exercise.name);
                foundExercise = exercise;
                break;
              }
            }
          }

          if (!foundExercise) {
            console.log('Fallback: Searching for exercise keywords in AI message...');
            const exerciseScores: { [type: string]: number } = {};

            for (const [type, keywords] of Object.entries(EXERCISE_KEYWORDS)) {
              for (const keyword of keywords) {
                if (aiMessage.includes(keyword)) {
                  exerciseScores[type] = (exerciseScores[type] || 0) + 1;
                }
              }
            }

            let bestMatch: { type: string; score: number } | null = null;
            for (const type in exerciseScores) {
              if (!bestMatch || exerciseScores[type] > bestMatch.score) {
                bestMatch = { type, score: exerciseScores[type] };
              }
            }

            if (bestMatch) {
              console.log(`Found best keyword match: ${bestMatch.type} (score: ${bestMatch.score})`);
              foundExercise = sortedExercises.find(ex => ex.type === bestMatch.type) || null;
            }
          }

          if (foundExercise) {
            setShowExerciseCard(foundExercise);
          } else {
            console.error("AI set nextAction to showExerciseCard, but no valid exercise could be determined.", {
              message: response.message,
              exerciseData: response.exerciseData
            });
          }
        } else {
          console.log('🎯 No exercise card trigger. nextAction:', response.nextAction, 'exerciseData:', response.exerciseData);
          
          const userText = text.toLowerCase();
          const confirmationWords = ['yes', 'sure', 'okay', 'ok', "let's try", "let's do", 'i want to', 'sounds good'];
          const isConfirmation = confirmationWords.some(word => userText.includes(word));
          
          if (isConfirmation) {
            console.log('🔍 FALLBACK: Detected potential exercise confirmation:', userText);
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
              let exerciseType: string | null = null;

              if (response.exerciseData?.type && EXERCISE_KEYWORDS[response.exerciseData.type]) {
                exerciseType = response.exerciseData.type;
              }

              if (!exerciseType) {
                const sortedKeywords = Object.entries(EXERCISE_KEYWORDS).sort((a, b) => {
                  const aMax = Math.max(...a[1].map(k => k.length));
                  const bMax = Math.max(...b[1].map(k => k.length));
                  return bMax - aMax;
                });

                for (const [type, keywords] of sortedKeywords) {
                  if (keywords.some(keyword => response.message?.toLowerCase().includes(keyword))) {
                    exerciseType = type;
                    break;
                  }
                }
              }

              if (!exerciseType) {
                for (const [type, keywords] of Object.entries(EXERCISE_KEYWORDS)) {
                  if (keywords.some(keyword => recentMessages.some(msg => msg.content?.toLowerCase().includes(keyword)))) {
                    exerciseType = type;
                    break;
                  }
                }
              }

              if (exerciseType) {
                console.log('🎯 FALLBACK: Using exercise type:', exerciseType);
                const exerciseLibraryData = getExerciseLibraryData(t);
                const fallbackExercise = exerciseLibraryData[exerciseType];
                if (fallbackExercise) {
                  console.log('🎯 FALLBACK: Showing exercise card for:', fallbackExercise.name);
                  setShowExerciseCard(fallbackExercise);
                }
              }
            }
          }
        }
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

  // STUBS – exercises are now fully handled by useExerciseFlow
const handleExerciseSendMessage = async (text: string, currentStep: number) => {
  console.log("⚠️ handleExerciseSendMessage is now handled by useExerciseFlow. Called with:", text, currentStep);
};

const handleStartExercise = async (exercise: any, preserveChat: boolean = false) => {
  console.log("⚠️ handleStartExercise is now handled by useExerciseFlow. Called with:", exercise, preserveChat);
};

const handleConfirmExerciseTransition = async (exercise: any) => {
  console.log("⚠️ handleConfirmExerciseTransition is now handled by useExerciseFlow. Called with:", exercise);
};


  const handleEndSession = useCallback((onBack: () => void, exerciseContext?: ExerciseContext) => {
    sessionEndHandler(onBack, messages, exerciseContext);
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
    // Exit confirmation state and handlers
    showExitConfirmation,
    confirmExit,
    cancelExit,
  };
};

export default useChatSession;
