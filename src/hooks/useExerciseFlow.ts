import { useState, useCallback } from 'react';
import { Message, storageService } from '../services/storageService';
import { contextService } from '../services/contextService';
import { apiService } from '../services/apiService';
import { getExerciseFlow, exerciseLibraryData } from '../data/exerciseLibrary';
import { ttsService } from '../services/ttsService';
import { memoryService } from '../services/memoryService';
import { valuesService } from '../services/valuesService';
import { thinkingPatternsService } from '../services/thinkingPatternsService';

export const useExerciseFlow = (initialExercise?: any, t?: (key: string) => string) => {
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
  const [thinkingPatternSummary, setThinkingPatternSummary] = useState<{summary: string; keyInsights: string[]} | null>(null);
  const [thinkingPatternContext, setThinkingPatternContext] = useState<{originalThought: string; distortionType: string; reframedThought: string; prompt: string} | null>(null);
  const [showVisionSummary, setShowVisionSummary] = useState(false);
  const [visionSummary, setVisionSummary] = useState<{summary: string; keyInsights: string[]} | null>(null);
  const [showTherapyGoalSummary, setShowTherapyGoalSummary] = useState(false);
  const [therapyGoalSummary, setTherapyGoalSummary] = useState<{summary: string; keyInsights: string[]} | null>(null);
  
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

      // Standardize breathing exercises to use the same flow
      const isBreathingExercise = currentExercise.category === 'Breathing' || currentExercise.type.includes('breathing');
      const exerciseTypeForFlow = isBreathingExercise ? 'breathing' : currentExercise.type;
      
      console.log(`Exercise type for flow lookup: ${exerciseTypeForFlow}`);

      const flow = getExerciseFlow(exerciseTypeForFlow, t || ((key: string) => key));

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
    setSuggestions: (suggestions: string[]) => void
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
          
          // Check if this is a Vision of the Future exercise and generate summary
          if (currentExercise.type === 'vision-of-future') {
            try {
              const recentMessages = await storageService.getLastMessages(15);
              const visionSummary = await contextService.generateVisionSummary(recentMessages);
              setVisionSummary(visionSummary);
              setShowVisionSummary(true);
            } catch (error) {
              console.error('Error generating vision summary:', error);
              // Still show mood rating even if summary fails
              setShowMoodRating(true);
            }
          } else if (currentExercise.type === 'therapy-goal-definition') {
            try {
              const recentMessages = await storageService.getLastMessages(15);
              const therapyGoalSummary = await contextService.generateTherapyGoalSummary(recentMessages);
              setTherapyGoalSummary(therapyGoalSummary);
              setShowTherapyGoalSummary(true);
            } catch (error) {
              console.error('Error generating therapy goal summary:', error);
              // Still show mood rating even if summary fails
              setShowMoodRating(true);
            }
          } else {
            // Show mood rating for other exercises
            setShowMoodRating(true);
          }
          
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
          title: `Step ${exerciseStep + 1}: ${currentStep.title ? (t ? t(currentStep.title) : currentStep.title) : `Step ${exerciseStep + 1}`}`,
          content: response.message,
          exerciseType: currentExercise.type,
          color: flow.color,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAIGuided: true
        };

        setMessages(prev => [...prev, aiResponse]);
        await storageService.addMessage(aiResponse);
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
        title: `Step 1: ${currentStep.title ? (t ? t(currentStep.title) : currentStep.title) : 'Step 1'}`,
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
    setSuggestions: (suggestions: string[]) => void
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

        setMessages(prev => [...prev, aiMessage]);
        await storageService.addMessage(aiMessage);
        
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
    setSuggestions: (suggestions: string[]) => void
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

        setMessages(prev => [...prev, aiMessage]);
        await storageService.addMessage(aiMessage);
        
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
      console.log('Current exerciseData:', exerciseData);
      console.log('Current thinkingPatternContext:', thinkingPatternContext);
      
      // Validate that we have the pattern context before proceeding
      const patternContext = exerciseData.patternContext || thinkingPatternContext;
      if (!patternContext) {
        console.error('Pattern context is missing from both exerciseData and thinkingPatternContext, cannot generate summary');
        setIsThinkingPatternReflection(false);
        setThinkingPatternContext(null);
        setExerciseData({});
        return;
      }
      
      // Get recent messages for summary generation
      const recentMessages = await storageService.getLastMessages(15);
      
      // Generate a proper thinking pattern reflection summary using contextService
      setIsTyping(true);
      const summaryResult = await contextService.generateThinkingPatternReflectionSummary(
        recentMessages.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.text || msg.content || ''
        })),
        patternContext
      );
      setIsTyping(false);
      
      if (summaryResult && summaryResult.summary) {
        // Store the summary for display
        setThinkingPatternSummary(summaryResult);
        setShowThinkingPatternSummary(true);
        setSuggestions([]);
        
        // Save the reflection summary to persistent storage for insights tab
        try {
          await thinkingPatternsService.saveReflectionSummary({
            originalThought: patternContext.originalThought,
            distortionType: patternContext.distortionType,
            reframedThought: patternContext.reframedThought,
            prompt: patternContext.prompt,
            summary: summaryResult.summary,
            keyInsights: summaryResult.keyInsights,
            sessionId: `session_${Date.now()}`
          });
          console.log('✅ Thinking pattern reflection saved to insights');
        } catch (storageError) {
          console.error('❌ Failed to save thinking pattern reflection to insights:', storageError);
        }
      } else {
        console.error('Failed to generate thinking pattern summary');
        // Fallback to ending without summary
        setIsThinkingPatternReflection(false);
        setThinkingPatternContext(null);
        setExerciseData({});
      }
      
    } catch (error) {
      console.error('Error ending thinking pattern reflection:', error);
      setIsTyping(false);
      // Fallback to ending without summary
      setIsThinkingPatternReflection(false);
      setThinkingPatternContext(null);
      setExerciseData({});
    }
  }, [exerciseData, thinkingPatternContext]);

  const saveThinkingPatternSummary = useCallback(async () => {
    try {
      const patternContext = exerciseData.patternContext || thinkingPatternContext;
      if (!thinkingPatternSummary || !patternContext) return;
      
      // Save the reflection summary using the dedicated ThinkingPatternsService
      await thinkingPatternsService.saveReflectionSummary({
        originalThought: patternContext.originalThought,
        distortionType: patternContext.distortionType,
        reframedThought: patternContext.reframedThought,
        prompt: patternContext.prompt,
        summary: thinkingPatternSummary.summary,
        keyInsights: thinkingPatternSummary.keyInsights,
        sessionId: Date.now().toString()
      });
      
      console.log('Thinking pattern reflection summary saved successfully');
      
      // Reset states
      setShowThinkingPatternSummary(false);
      setThinkingPatternSummary(null);
      setThinkingPatternContext(null);
      setIsThinkingPatternReflection(false);
      setExerciseData({});
      
    } catch (error) {
      console.error('Error saving thinking pattern summary:', error);
    }
  }, [thinkingPatternSummary, exerciseData]);

  const cancelThinkingPatternSummary = useCallback(() => {
    setShowThinkingPatternSummary(false);
    setThinkingPatternSummary(null);
    // Don't reset isThinkingPatternReflection - user can continue the conversation
  }, []);

  const saveVisionSummary = useCallback(async () => {
    try {
      if (!visionSummary) return;
      
      console.log('Vision summary saved successfully');
      
      // Reset states
      setShowVisionSummary(false);
      setVisionSummary(null);
      
      // Now show mood rating after saving vision summary
      setShowMoodRating(true);
      
    } catch (error) {
      console.error('Error saving vision summary:', error);
    }
  }, [visionSummary]);

  const cancelVisionSummary = useCallback(() => {
    setShowVisionSummary(false);
    setVisionSummary(null);
    // Show mood rating when canceling
    setShowMoodRating(true);
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
    setSuggestions: (suggestions: string[]) => void
  ) => {
    try {
      console.log('Starting thinking pattern reflection with context:', patternContext);
      
      setIsThinkingPatternReflection(true);
      setThinkingPatternContext(patternContext);
      setExerciseData({ patternContext });
      console.log('✅ Thinking pattern context set:', patternContext);
      
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

        setMessages(prev => [...prev, aiMessage]);
        await storageService.addMessage(aiMessage);
        
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
    setSuggestions: (suggestions: string[]) => void
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
      const patternContext = exerciseData.patternContext || thinkingPatternContext;
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
            distortionType: patternContext?.distortionType,
            originalThought: patternContext?.originalThought
          }
        };

        setMessages(prev => [...prev, aiMessage]);
        await storageService.addMessage(aiMessage);
        
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
  }, [exerciseData, thinkingPatternContext, reflectionMessageCount, reflectionStartTime]);

  // Therapy Goal Summary handlers
  const saveTherapyGoalSummary = useCallback(async () => {
    try {
      if (therapyGoalSummary) {
        // Save to insights/memory service for display in insights screen
        const goalSummaryEntry = {
          id: `therapy_goal_summary_${Date.now()}`,
          type: 'therapy_goal_summary',
          summary: therapyGoalSummary.summary,
          keyInsights: therapyGoalSummary.keyInsights,
          timestamp: new Date().toISOString(),
          date: new Date().toLocaleDateString(),
          category: 'goal_setting'
        };

        // Store in memory service as an insight entry
        await memoryService.storeInsight({
          id: goalSummaryEntry.id,
          type: 'therapy_goals',
          content: {
            summary: therapyGoalSummary.summary,
            keyInsights: therapyGoalSummary.keyInsights,
            category: 'therapy_goal_definition'
          },
          timestamp: new Date().toISOString(),
          source: 'exercise_completion'
        });

        console.log('Therapy goal summary saved successfully');

        setShowTherapyGoalSummary(false);
        setTherapyGoalSummary(null);
        setShowMoodRating(true);
      }
    } catch (error) {
      console.error('Error saving therapy goal summary:', error);
      // Still hide the summary and show mood rating even if save fails
      setShowTherapyGoalSummary(false);
      setTherapyGoalSummary(null);
      setShowMoodRating(true);
    }
  }, [therapyGoalSummary]);

  const cancelTherapyGoalSummary = useCallback(() => {
    setShowTherapyGoalSummary(false);
    setTherapyGoalSummary(null);
    setShowMoodRating(true);
  }, []);

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
    showVisionSummary,
    visionSummary,
    showTherapyGoalSummary,
    therapyGoalSummary,
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
    saveVisionSummary,
    cancelVisionSummary,
    saveTherapyGoalSummary,
    cancelTherapyGoalSummary,
    handleMoodRatingComplete,
    handleMoodRatingSkip,
    handlePreExerciseMoodComplete,
    enterExerciseMode: () => setExerciseMode(true),
    exitExerciseMode: () => setExerciseMode(false),
  };
};

export default useExerciseFlow;
