import { useState, useCallback } from 'react';
import { Message, storageService } from '../services/storageService';
import { contextService } from '../services/contextService';
import { apiService } from '../services/apiService';
import { getExerciseFlow } from '../data/exerciseLibrary';
import { ttsService } from '../services/ttsService';

/**
 * Hook for exercise flow management - extracted from ChatInterface
 * Handles dynamic AI-guided exercise logic and step management
 */
export const useExerciseFlow = () => {
  const [exerciseMode, setExerciseMode] = useState(false);
  const [exerciseStep, setExerciseStep] = useState(0);
  const [exerciseData, setExerciseData] = useState<Record<string, any>>({});
  const [stepMessageCount, setStepMessageCount] = useState<Record<number, number>>({});

  const startDynamicAIGuidedExercise = useCallback(async (
    currentExercise: any,
    setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void,
    setIsTyping: (isTyping: boolean) => void,
    setSuggestions: (suggestions: string[]) => void
  ) => {
    try {
      console.log('Generating and starting dynamic exercise:', currentExercise.type);
      
      // Get predefined exercise flow
      const flow = getExerciseFlow(currentExercise.type);
      
      if (!flow || !flow.steps || flow.steps.length === 0) {
        console.error('Failed to generate exercise flow, falling back to simple chat');
        setExerciseMode(false);
        return false;
      }
      
      console.log('Generated dynamic flow with', flow.steps.length, 'steps');
      setExerciseMode(true);
      setExerciseStep(0);
      
      const currentStep = flow.steps[0];
      
      // Use the rich exercise context system for better suggestions
      const exerciseContext = await contextService.assembleExerciseContext(
        [], // No previous messages for first step
        flow,
        1, // Step 1
        []
      );
      
      // Add the initial user message to start the exercise
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
        
        setMessages([aiMessage]);
        await storageService.addMessage(aiMessage);
        
        // Extract suggestions using robust parsing
        const suggestions = extractSuggestionsFromResponse(response);
        setSuggestions(suggestions);
        
        // Store the dynamic flow for later use
        setExerciseData({ dynamicFlow: flow });
        
        return true;
      } else {
        console.error('Failed to start exercise with AI, exiting exercise mode');
        setExerciseMode(false);
        return false;
      }
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
    setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void,
    setIsTyping: (isTyping: boolean) => void,
    setSuggestions: (suggestions: string[]) => void,
    addAIMessageWithTypewriter: (message: Message) => Promise<void>
  ) => {
    try {
      console.log('🤖 Dynamic AI controlling exercise step:', exerciseStep + 1);
      
      const currentStep = flow.steps[exerciseStep];
      
      // Create user message
      const userMessage: Message = {
        id: (Date.now() + Math.random()).toString(),
        type: 'user',
        text: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Add user message to UI and storage
      setMessages((prev: Message[]) => [...prev, userMessage]);
      await storageService.addMessage(userMessage);
      
      // Determine if this is the first message in this step (before updating count)
      const currentStepCount = stepMessageCount[exerciseStep] || 0;
      const isFirstMessageInStep = currentStepCount === 0;
      
      console.log(`🔍 Step ${exerciseStep}: currentCount=${currentStepCount}, isFirst=${isFirstMessageInStep}`);
      
      // Update step message count after determining if it's first message
      const updatedStepCount = currentStepCount + 1;
      setStepMessageCount(prev => ({
        ...prev,
        [exerciseStep]: updatedStepCount
      }));
      
      // Build exercise context using new contextService method with appropriate prompt
      const recentMessages = await storageService.getLastMessages(10);
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
        // Parse the AI response to check nextStep flag
        let shouldAdvanceStep = false;
        
        try {
          // Check if response has nextStep flag (from structured output)
          if (response.nextStep !== undefined) {
            shouldAdvanceStep = response.nextStep;
            console.log('🎯 AI decided nextStep:', shouldAdvanceStep);
          }
        } catch (parseError) {
          console.log('No nextStep flag found, staying in current step');
        }

        // Force advancement after 8 messages in same step to prevent loops
        if (updatedStepCount >= 8 && !shouldAdvanceStep && exerciseStep < flow.steps.length - 1) {
          console.log('🔄 Fallback: Auto-advancing after 8 messages to prevent loop');
          shouldAdvanceStep = true;
        }

        // Determine step title based on AI decision
        let stepTitle = '';
        let newStepIndex = exerciseStep;
        
        if (shouldAdvanceStep && exerciseStep < flow.steps.length - 1) {
          // AI decided to advance to next step
          newStepIndex = exerciseStep + 1;
          const nextStep = flow.steps[newStepIndex];
          stepTitle = `Step ${nextStep.stepNumber}: ${nextStep.title}`;
          setExerciseStep(newStepIndex);
          
          // Reset message count for new step
          setStepMessageCount(prev => ({
            ...prev,
            [newStepIndex]: 0
          }));
          
          console.log('✅ AI advanced to step:', newStepIndex + 1);
        } else if (exerciseStep >= flow.steps.length - 1 && shouldAdvanceStep) {
          // Exercise completed
          console.log('🎉 AI completed exercise');
          
          const completionMessage: Message = {
            id: (Date.now() + Math.random()).toString(),
            type: 'exercise',
            title: '🎉 Exercise Complete!',
            content: `**Excellent work completing the ${currentExercise.name} exercise!** 🌟

Your insights have been captured and will be available in your Insights tab. Great job practicing this therapeutic skill! 💪`,
            exerciseType: currentExercise.type,
            color: flow.color,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isAIGuided: true
          };

          setMessages((prev: Message[]) => [...prev, completionMessage]);
          await storageService.addMessage(completionMessage);
          
          // Exit exercise mode
          setExerciseMode(false);
          setSuggestions([]);
          return;
        } else {
          // AI decided to stay in current step
          stepTitle = `Step ${currentStep.stepNumber}: ${currentStep.title}`;
          console.log('🔄 AI staying in current step for deeper work');
        }

        // Create AI response message
        const aiResponse: Message = {
          id: (Date.now() + Math.random()).toString(),
          type: 'exercise',
          title: stepTitle,
          content: response.message,
          exerciseType: currentExercise.type,
          color: flow.color,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAIGuided: true
        };

        await addAIMessageWithTypewriter(aiResponse);
        
        // Use AI-generated suggestions
        if (response.suggestions && response.suggestions.length > 0) {
          setSuggestions(response.suggestions);
        } else {
          setSuggestions([]);
        }
        
        await ttsService.speakIfAutoPlay(response.message);
      }
      
    } catch (error) {
      console.error('Error in handleDynamicAIGuidedExerciseResponse:', error);
      
      // Fallback: stay in current step
      const fallbackMessage: Message = {
        id: (Date.now() + Math.random()).toString(),
        type: 'exercise',
        title: `Step ${flow.steps[exerciseStep].stepNumber}: ${flow.steps[exerciseStep].title}`,
        content: "I want to make sure I understand you correctly. Could you tell me a bit more about that?",
        exerciseType: currentExercise.type,
        color: flow.color,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAIGuided: true
      };
      
      setMessages((prev: Message[]) => [...prev, fallbackMessage]);
      await storageService.addMessage(fallbackMessage);
    }
  }, [exerciseStep, stepMessageCount]);

  // Helper function to extract suggestions from AI response
  const extractSuggestionsFromResponse = (response: any): string[] => {
    console.log('🔍 Full AI Response:', response);
    
    // Method 1: Check if already parsed by Edge Function
    if (response.suggestions && response.suggestions.length > 0) {
      console.log('✅ Method 1: Using Edge Function parsed suggestions:', response.suggestions);
      return response.suggestions;
    }

    // Method 2: Parse from message content manually
    const content = response.message || '';
    console.log('🔍 Method 2: Attempting manual parsing from content:', content);
    
    // Method 2a: Check for JSON code block format
    const codeBlockMatch = content.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (codeBlockMatch) {
      try {
        console.log('🔧 Found JSON code block, attempting to parse...');
        const jsonString = codeBlockMatch[1].trim();
        const jsonResponse = JSON.parse(jsonString);
        
        if (jsonResponse.message && jsonResponse.suggestions && Array.isArray(jsonResponse.suggestions)) {
          console.log('✅ Method 2a: Parsed JSON from code block:', jsonResponse);
          return jsonResponse.suggestions.slice(0, 4);
        }
      } catch (e) {
        console.log('❌ Method 2a: Failed to parse JSON from code block:', e);
      }
    }
    
    console.log('❌ All methods failed: No suggestions found');
    return [];
  };

  const enterExerciseMode = useCallback(() => {
    setExerciseMode(true);
  }, []);

  const exitExerciseMode = useCallback(() => {
    setExerciseMode(false);
  }, []);

  return {
    exerciseMode,
    exerciseStep,
    exerciseData,
    stepMessageCount,
    startDynamicAIGuidedExercise,
    handleDynamicAIGuidedExerciseResponse,
    enterExerciseMode,
    exitExerciseMode,
    extractSuggestionsFromResponse
  };
};

export default useExerciseFlow;