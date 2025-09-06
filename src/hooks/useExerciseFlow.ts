import { useState, useCallback } from 'react';
import { Message, storageService } from '../services/storageService';
import { contextService } from '../services/contextService';
import { apiService } from '../services/apiService';
import { getExerciseFlow } from '../data/exerciseLibrary';
import { ttsService } from '../services/ttsService';
import { memoryService } from '../services/memoryService';

export const useExerciseFlow = (initialExercise?: any) => {
  const [exerciseMode, setExerciseMode] = useState(false);
  const [exerciseStep, setExerciseStep] = useState(0);
  const [exerciseData, setExerciseData] = useState<Record<string, any>>({});
  const [stepMessageCount, setStepMessageCount] = useState<Record<number, number>>({});
  const [showPreExerciseMoodSlider, setShowPreExerciseMoodSlider] = useState(false);
  const [showMoodRating, setShowMoodRating] = useState(false);

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

  return {
    exerciseMode,
    exerciseStep,
    exerciseData,
    showMoodRating,
    showPreExerciseMoodSlider,
    startDynamicAIGuidedExercise,
    handleDynamicAIGuidedExerciseResponse,
    handleMoodRatingComplete,
    handleMoodRatingSkip,
    handlePreExerciseMoodComplete,
    enterExerciseMode: () => setExerciseMode(true),
    exitExerciseMode: () => setExerciseMode(false),
  };
};

export default useExerciseFlow;
