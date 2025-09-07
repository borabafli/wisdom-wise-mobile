import { useState, useCallback } from 'react';
import { Message, storageService } from '../services/storageService';
import { contextService } from '../services/contextService';
import { apiService } from '../services/apiService';
import { getExerciseFlow } from '../data/exerciseLibrary';
import { ttsService } from '../services/ttsService';
import { memoryService } from '../services/memoryService';
import { valuesService } from '../services/valuesService';

export const useExerciseFlow = (initialExercise?: any) => {
  const [exerciseMode, setExerciseMode] = useState(false);
  const [exerciseStep, setExerciseStep] = useState(0);
  const [exerciseData, setExerciseData] = useState<Record<string, any>>({});
  const [stepMessageCount, setStepMessageCount] = useState<Record<number, number>>({});
  const [showPreExerciseMoodSlider, setShowPreExerciseMoodSlider] = useState(false);
  const [showMoodRating, setShowMoodRating] = useState(false);
  const [isValueReflection, setIsValueReflection] = useState(false);
  const [isThinkingPatternReflection, setIsThinkingPatternReflection] = useState(false);
  const [showValueReflectionSummary, setShowValueReflectionSummary] = useState(false);
  const [valueReflectionSummary, setValueReflectionSummary] = useState<{summary: string; keyInsights: string[]} | null>(null);
  const [showThinkingPatternSummary, setShowThinkingPatternSummary] = useState(false);
  const [thinkingPatternSummary, setThinkingPatternSummary] = useState<string | null>(null);
  
  // Reflection session tracking
  const [reflectionMessageCount, setReflectionMessageCount] = useState(0);
  const [reflectionStartTime, setReflectionStartTime] = useState<number | null>(null);
  const [canEndReflection, setCanEndReflection] = useState(false);

  const startDynamicAIGuidedExercise = useCallback(async (
    currentExercise: any,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setIsTyping: (isTyping: boolean) => void,
    setSuggestions: (suggestions: string[]) => void
  ) => {
    try {
      console.log('Generating and starting dynamic exercise:', currentExercise.type);
      const flow = getExerciseFlow(currentExercise.type);

      if (!flow || !flow.steps || flow.steps.length === 0) {
        console.error('Failed to generate exercise flow');
        setExerciseMode(false);
        return false;
      }

      setExerciseData({ dynamicFlow: flow, currentExercise });
      
      // Show pre-exercise mood slider first
      setShowPreExerciseMoodSlider(true);
      return true;
    } catch (error) {
      console.error('Error starting dynamic AI-guided exercise:', error);
      setExerciseMode(false);
      return false;
    }
  }, []);

  const handleDynamicAIGuidedExerciseResponse = useCallback(async (
    userText: string,
    flow: any,
    currentExercise: any,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setIsTyping: (isTyping: boolean) => void,
    setSuggestions: (suggestions: string[]) => void,
    addAIMessageWithTypewriter: (message: Message) => Promise<void>
  ) => {
    try {
      const currentStep = flow.steps[exerciseStep];

      const userMessage: Message = {
        id: (Date.now() + Math.random()).toString(),
        type: 'user',
        text: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, userMessage]);
      await storageService.addMessage(userMessage);

      const recentMessages = await storageService.getLastMessages(10);
      const stepCount = stepMessageCount[exerciseStep] || 0;
      const isFirstMessageInStep = stepCount === 0;
      setStepMessageCount(prev => ({ ...prev, [exerciseStep]: stepCount + 1 }));

      const exerciseContext = await contextService.assembleExerciseContext(
        recentMessages,
        flow,
        exerciseStep + 1,
        [],
        isFirstMessageInStep
      );

      setIsTyping(true);
      const response = await apiService.getChatCompletionWithContext(exerciseContext);
      setIsTyping(false);

      if (response.success && response.message) {
        let shouldAdvance = response.nextStep ?? false;

        if (shouldAdvance && exerciseStep < flow.steps.length - 1) {
          setExerciseStep(prev => prev + 1);
          setStepMessageCount(prev => ({ ...prev, [exerciseStep + 1]: 1 }));
        } else if (shouldAdvance && exerciseStep >= flow.steps.length - 1) {
          const completion: Message = {
            id: Date.now().toString(),
            type: 'exercise',
            title: '🎉 Exercise Complete!',
            content: `Great work finishing the ${currentExercise.name} exercise! 🌟`,
            exerciseType: currentExercise.type,
            color: flow.color,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isAIGuided: true
          };
          setMessages(prev => [...prev, completion]);
          await storageService.addMessage(completion);
          
          // Show mood rating after exercise completion
          setShowMoodRating(true);
          setExerciseMode(false);
          setSuggestions([]);
          
          // Extract insights after exercise completion (background processing)
          setTimeout(async () => {
            try {
              const messages = await storageService.getMessages();
              const insightResult = await memoryService.extractInsights(messages);
              if (insightResult.shouldExtract && insightResult.insights.length > 0) {
                console.log(`✅ Exercise completion: Extracted ${insightResult.insights.length} memory insights`);
              }
            } catch (error) {
              console.error('Error extracting insights after exercise completion:', error);
            }
          }, 100);
          
          return;
        }

        const aiResponse: Message = {
          id: Date.now().toString(),
          type: 'exercise',
          title: `Step ${currentStep.stepNumber}: ${currentStep.title}`,
          content: response.message,
          exerciseType: currentExercise.type,
          color: flow.color,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAIGuided: true
        };

        await addAIMessageWithTypewriter(aiResponse);
        setSuggestions(response.suggestions ?? []);
        await ttsService.speakIfAutoPlay(response.message);
      }
    } catch (err) {
      console.error('Error in exercise response:', err);
    }
  }, [exerciseStep, stepMessageCount]);

  const handleMoodRatingComplete = useCallback((rating: any) => {
    console.log('Mood rating completed:', rating);
    setShowMoodRating(false);
  }, []);

  const handleMoodRatingSkip = useCallback(() => {
    console.log('Mood rating skipped');
    setShowMoodRating(false);
  }, []);

  const handlePreExerciseMoodComplete = useCallback(async (
    rating: number,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setIsTyping: (isTyping: boolean) => void,
    setSuggestions: (suggestions: string[]) => void
  ) => {
    console.log('Pre-exercise mood rating:', rating);
    setShowPreExerciseMoodSlider(false);
    
    // Now start the actual exercise
    const { dynamicFlow: flow, currentExercise } = exerciseData;
    
    setExerciseMode(true);
    setExerciseStep(0);
    setStepMessageCount({ 0: 1 });

    const currentStep = flow.steps[0];
    const exerciseContext = await contextService.assembleExerciseContext([], flow, 1, [], true);

    exerciseContext.push({
      role: 'user',
      content: `I'm ready to start the ${currentExercise.name} exercise. Please guide me through step 1.`
    });

    setIsTyping(true);
    const response = await apiService.getChatCompletionWithContext(exerciseContext);
    setIsTyping(false);

    if (response.success && response.message) {
      const aiMessage: Message = {
        id: Date.now().toString(),
        type: 'exercise',
        title: `Step ${currentStep.stepNumber}: ${currentStep.title}`,
        content: response.message,
        exerciseType: currentExercise.type,
        color: flow.color,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAIGuided: true
      };

      setMessages(prev => [...prev, aiMessage]);
      await storageService.addMessage(aiMessage);
      setSuggestions(response.suggestions ?? []);
    } else {
      setExerciseMode(false);
    }
  }, [exerciseData]);

  const startValueReflection = useCallback(async (
    valueContext: any,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setIsTyping: (isTyping: boolean) => void,
    setSuggestions: (suggestions: string[]) => void,
    addAIMessageWithTypewriter: (message: Message) => Promise<void>
  ) => {
    try {
      console.log('Starting value reflection with context:', valueContext);
      
      setIsValueReflection(true);
      setExerciseData({ valueContext });
      
      // Initialize reflection tracking
      setReflectionMessageCount(0);
      setReflectionStartTime(Date.now());
      setCanEndReflection(false);
      
      // Get the AI's opening message for the value reflection
      const context = await contextService.assembleValueReflectionContext(valueContext);
      
      setIsTyping(true);
      const response = await apiService.getChatCompletionWithContext(context);
      setIsTyping(false);

      if (response.success && response.message) {
        const aiMessage: Message = {
          id: Date.now().toString(),
          type: 'ai',
          text: response.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAIGuided: true,
          context: { type: 'value_reflection', value: valueContext.valueName }
        };

        await addAIMessageWithTypewriter(aiMessage);
        
        if (response.suggestions) {
          setSuggestions(response.suggestions);
        }

        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error starting value reflection:', error);
      setIsValueReflection(false);
      return false;
    }
  }, []);

  const handleValueReflectionResponse = useCallback(async (
    userText: string,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setIsTyping: (isTyping: boolean) => void,
    setSuggestions: (suggestions: string[]) => void,
    addAIMessageWithTypewriter: (message: Message) => Promise<void>
  ) => {
    try {
      // Check if user wants to end the reflection
      const userTextLower = userText.toLowerCase();
      if (userTextLower.includes('end here and create a summary') || 
          userTextLower.includes('finish the reflection') ||
          userTextLower.includes('create a summary now')) {
        // End the reflection and show summary
        await endValueReflection(setMessages, setIsTyping, setSuggestions);
        return;
      }
      const userMessage: Message = {
        id: (Date.now() + Math.random()).toString(),
        type: 'user',
        text: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, userMessage]);
      await storageService.addMessage(userMessage);

      // Update reflection tracking
      const newMessageCount = reflectionMessageCount + 1;
      setReflectionMessageCount(newMessageCount);
      
      // Enable end button after 3 meaningful exchanges or 2 minutes
      const timeElapsed = reflectionStartTime ? (Date.now() - reflectionStartTime) / 1000 : 0;
      if (newMessageCount >= 3 || timeElapsed >= 120) {
        setCanEndReflection(true);
      }

      const recentMessages = await storageService.getLastMessages(10);
      
      // For value reflection, we need to maintain the value context throughout the conversation
      const valueContext = exerciseData.valueContext;
      const context = await contextService.assembleValueReflectionContext(valueContext);
      
      // Add the recent conversation messages to the context
      const conversationMessages = recentMessages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
      
      context.push(...conversationMessages);

      setIsTyping(true);
      const response = await apiService.getChatCompletionWithContext(context);
      setIsTyping(false);

      if (response.success && response.message) {
        const aiMessage: Message = {
          id: Date.now().toString(),
          type: 'ai',
          text: response.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAIGuided: true,
          context: { type: 'value_reflection', value: exerciseData.valueContext?.valueName }
        };

        await addAIMessageWithTypewriter(aiMessage);
        
        if (response.suggestions) {
          setSuggestions(response.suggestions);
        }

        // Check if this is a summary offer from the AI
        const messageText = response.message.toLowerCase();
        if (messageText.includes('summarize') && messageText.includes('insights') && messageText.includes('reflection')) {
          // Add special suggestions for ending the reflection
          const endReflectionSuggestion = "Yes, let's end here and create a summary";
          const continueReflectionSuggestion = "I'd like to explore this a bit more";
          setSuggestions([endReflectionSuggestion, continueReflectionSuggestion, ...(response.suggestions?.slice(0, 2) || [])]);
        }
      }
    } catch (error) {
      console.error('Error handling value reflection response:', error);
    }
  }, [exerciseData]);

  const endValueReflection = useCallback(async (
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setIsTyping: (isTyping: boolean) => void,
    setSuggestions: (suggestions: string[]) => void
  ) => {
    try {
      console.log('Ending value reflection and generating summary...');
      
      // Get recent messages for summary generation
      const recentMessages = await storageService.getLastMessages(15);
      const valueContext = exerciseData.valueContext;

      // Generate the reflection summary
      setIsTyping(true);
      const summary = await contextService.generateValueReflectionSummary(recentMessages, valueContext);
      setIsTyping(false);
      
      // Store the summary for display
      setValueReflectionSummary(summary);
      setShowValueReflectionSummary(true);
      setSuggestions([]);
      
    } catch (error) {
      console.error('Error ending value reflection:', error);
      setIsTyping(false);
    }
  }, [exerciseData]);

  const saveValueReflectionSummary = useCallback(async () => {
    try {
      if (!valueReflectionSummary || !exerciseData.valueContext) return;
      
      const valueContext = exerciseData.valueContext;
      
      await valuesService.saveReflectionSummary({
        valueId: valueContext.valueId,
        valueName: valueContext.valueName,
        prompt: valueContext.prompt,
        summary: valueReflectionSummary.summary,
        keyInsights: valueReflectionSummary.keyInsights,
        sessionId: Date.now().toString()
      });
      
      console.log('Reflection summary saved successfully');
      
      // Reset states
      setShowValueReflectionSummary(false);
      setValueReflectionSummary(null);
      setIsValueReflection(false);
      setExerciseData({});
      
    } catch (error) {
      console.error('Error saving reflection summary:', error);
    }
  }, [valueReflectionSummary, exerciseData]);

  const cancelValueReflectionSummary = useCallback(() => {
    setShowValueReflectionSummary(false);
    setValueReflectionSummary(null);
    // Don't reset isValueReflection - user can continue the conversation
  }, []);

  const endThinkingPatternReflection = useCallback(async (
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setIsTyping: (isTyping: boolean) => void,
    setSuggestions: (suggestions: string[]) => void
  ) => {
    try {
      console.log('Ending thinking pattern reflection and generating summary...');
      
      // Get recent messages for summary generation
      const recentMessages = await storageService.getLastMessages(15);
      
      // Generate a session summary using the memoryService
      setIsTyping(true);
      const summaryResult = await memoryService.generateSessionSummary('temp_session_' + Date.now(), recentMessages);
      setIsTyping(false);
      
      if (summaryResult.success && summaryResult.summary) {
        // Store the summary for display
        setThinkingPatternSummary(summaryResult.summary);
        setShowThinkingPatternSummary(true);
        setSuggestions([]);
      } else {
        console.error('Failed to generate thinking pattern summary');
        // Fallback to ending without summary
        setIsThinkingPatternReflection(false);
        setExerciseData({});
      }
      
    } catch (error) {
      console.error('Error ending thinking pattern reflection:', error);
      setIsTyping(false);
      // Fallback to ending without summary
      setIsThinkingPatternReflection(false);
      setExerciseData({});
    }
  }, []);

  const saveThinkingPatternSummary = useCallback(async () => {
    try {
      if (!thinkingPatternSummary) return;
      
      // Save the summary to memory service
      const recentMessages = await storageService.getLastMessages(15);
      await memoryService.generateSessionSummary('reflection_session_' + Date.now(), recentMessages);
      
      console.log('Thinking pattern reflection summary saved successfully');
      
      // Reset states
      setShowThinkingPatternSummary(false);
      setThinkingPatternSummary(null);
      setIsThinkingPatternReflection(false);
      setExerciseData({});
      
    } catch (error) {
      console.error('Error saving thinking pattern summary:', error);
    }
  }, [thinkingPatternSummary]);

  const cancelThinkingPatternSummary = useCallback(() => {
    setShowThinkingPatternSummary(false);
    setThinkingPatternSummary(null);
    // Don't reset isThinkingPatternReflection - user can continue the conversation
  }, []);

  const startThinkingPatternReflection = useCallback(async (
    patternContext: {
      originalThought: string;
      distortionType: string;
      reframedThought: string;
      prompt: string;
    },
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setIsTyping: (isTyping: boolean) => void,
    setSuggestions: (suggestions: string[]) => void,
    addAIMessageWithTypewriter: (message: Message) => Promise<void>
  ) => {
    try {
      console.log('Starting thinking pattern reflection with context:', patternContext);
      
      setIsThinkingPatternReflection(true);
      setExerciseData({ patternContext });
      
      // Initialize reflection tracking
      setReflectionMessageCount(0);
      setReflectionStartTime(Date.now());
      setCanEndReflection(false);
      
      // Get the AI's opening message for the thinking pattern reflection
      const context = await contextService.assembleThinkingPatternReflectionContext(patternContext);
      
      setIsTyping(true);
      const response = await apiService.getChatCompletionWithContext(context);
      setIsTyping(false);

      if (response.success && response.message) {
        const aiMessage: Message = {
          id: Date.now().toString(),
          type: 'ai',
          text: response.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAIGuided: true,
          context: { 
            type: 'thinking_pattern_reflection', 
            distortionType: patternContext.distortionType,
            originalThought: patternContext.originalThought
          }
        };

        await addAIMessageWithTypewriter(aiMessage);
        
        if (response.suggestions) {
          setSuggestions(response.suggestions);
        }

        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error starting thinking pattern reflection:', error);
      setIsThinkingPatternReflection(false);
      return false;
    }
  }, []);

  const handleThinkingPatternReflectionResponse = useCallback(async (
    userText: string,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setIsTyping: (isTyping: boolean) => void,
    setSuggestions: (suggestions: string[]) => void,
    addAIMessageWithTypewriter: (message: Message) => Promise<void>
  ) => {
    try {
      // Check if user wants to end the reflection
      const userTextLower = userText.toLowerCase();
      if (userTextLower.includes('end here and create a summary') || 
          userTextLower.includes('finish the reflection') ||
          userTextLower.includes('create a summary now')) {
        // End the reflection and show summary
        await endThinkingPatternReflection(setMessages, setIsTyping, setSuggestions);
        return;
      }
      const userMessage: Message = {
        id: (Date.now() + Math.random()).toString(),
        type: 'user',
        text: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, userMessage]);
      await storageService.addMessage(userMessage);

      // Update reflection tracking
      const newMessageCount = reflectionMessageCount + 1;
      setReflectionMessageCount(newMessageCount);
      
      // Enable end button after 3 meaningful exchanges or 2 minutes
      const timeElapsed = reflectionStartTime ? (Date.now() - reflectionStartTime) / 1000 : 0;
      
      if (newMessageCount >= 3 || timeElapsed >= 120) {
        setCanEndReflection(true);
      }

      const recentMessages = await storageService.getLastMessages(10);
      
      // For thinking pattern reflection, we need to maintain the pattern context throughout the conversation
      const patternContext = exerciseData.patternContext;
      const context = await contextService.assembleThinkingPatternReflectionContext(patternContext);
      
      // Add the recent conversation messages to the context
      const conversationMessages = recentMessages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
      
      context.push(...conversationMessages);

      setIsTyping(true);
      const response = await apiService.getChatCompletionWithContext(context);
      setIsTyping(false);

      if (response.success && response.message) {
        const aiMessage: Message = {
          id: Date.now().toString(),
          type: 'ai',
          text: response.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAIGuided: true,
          context: { 
            type: 'thinking_pattern_reflection', 
            distortionType: exerciseData.patternContext?.distortionType,
            originalThought: exerciseData.patternContext?.originalThought
          }
        };

        await addAIMessageWithTypewriter(aiMessage);
        
        if (response.suggestions) {
          setSuggestions(response.suggestions);
        }

        // Check if this is a summary offer from the AI for thinking patterns
        const messageText = response.message.toLowerCase();
        if (messageText.includes('summarize') && messageText.includes('insights') && messageText.includes('pattern')) {
          // Add special suggestions for ending the reflection
          const endReflectionSuggestion = "Yes, let's end here and create a summary";
          const continueReflectionSuggestion = "I'd like to explore this pattern more";
          setSuggestions([endReflectionSuggestion, continueReflectionSuggestion, ...(response.suggestions?.slice(0, 2) || [])]);
        }
      }
    } catch (error) {
      console.error('Error handling thinking pattern reflection response:', error);
    }
  }, [exerciseData]);

  return {
    exerciseMode,
    exerciseStep,
    exerciseData,
    showMoodRating,
    showPreExerciseMoodSlider,
    isValueReflection,
    isThinkingPatternReflection,
    showValueReflectionSummary,
    valueReflectionSummary,
    showThinkingPatternSummary,
    thinkingPatternSummary,
    reflectionMessageCount,
    canEndReflection,
    startDynamicAIGuidedExercise,
    handleDynamicAIGuidedExerciseResponse,
    startValueReflection,
    handleValueReflectionResponse,
    endValueReflection,
    saveValueReflectionSummary,
    cancelValueReflectionSummary,
    startThinkingPatternReflection,
    handleThinkingPatternReflectionResponse,
    endThinkingPatternReflection,
    saveThinkingPatternSummary,
    cancelThinkingPatternSummary,
    handleMoodRatingComplete,
    handleMoodRatingSkip,
    handlePreExerciseMoodComplete,
    enterExerciseMode: () => setExerciseMode(true),
    exitExerciseMode: () => setExerciseMode(false),
  };
};

export default useExerciseFlow;
