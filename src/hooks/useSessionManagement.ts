// Final, corrected useSessionManagement.ts
import { useState, useCallback } from 'react';
import { Message, storageService } from '../services/storageService';
import { insightService } from '../services/insightService';
import { contextService } from '../services/contextService';
import { memoryService } from '../services/memoryService';
import { visionInsightsService } from '../services/visionInsightsService';
import { firstMessageService } from '../services/firstMessageService';

// Exercise context interface for targeted extraction
export interface ExerciseContext {
  exerciseMode: boolean;
  exerciseType?: string;
  isValueReflection: boolean;
  isThinkingPatternReflection: boolean;
  isVisionExercise: boolean;
}

/**
 * Hook for session lifecycle management - extracted from useChatSession
 * Handles session initialization, saving, and cleanup
 */
export const useSessionManagement = () => {
  const [isLoading, setIsLoading] = useState(false);

  const initializeSession = useCallback(async (): Promise<{ messages: Message[], suggestions: string[] }> => {
    try {
      setIsLoading(true);
      console.log('Starting a fresh session - clearing any existing messages.');

      // Always clear the current session to start fresh
      await storageService.clearCurrentSession();

      // Generate AI-powered first message with context
      console.log('🎯 Generating personalized first message...');
      const firstMessageResponse = await firstMessageService.generateFirstMessage();

      const welcomeMessage: Message = {
        id: 'welcome_' + Date.now(),
        type: 'system',
        content: firstMessageResponse.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      await storageService.addMessage(welcomeMessage);
      console.log('✅ Fresh session started with AI-generated welcome message');
      console.log('💬 Message:', firstMessageResponse.message);
      console.log('🎯 Chips:', firstMessageResponse.chips);

      return {
        messages: [welcomeMessage],
        suggestions: firstMessageResponse.chips
      };
    } catch (error) {
      console.error('Error initializing chat session:', error);
      // Fallback to simple welcome message with user's name
      const firstName = await storageService.getFirstName().catch(() => '');
      const greeting = firstName ? `Hey ${firstName}. What's on your mind today? 🌱` : "Hey. What's on your mind today? 🌱";

      const fallbackMessage: Message = {
        id: 'welcome',
        type: 'welcome',
        content: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      await storageService.addMessage(fallbackMessage);
      return {
        messages: [fallbackMessage],
        suggestions: []
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleEndSession = useCallback((onBack: () => void, messages: Message[], exerciseContext?: ExerciseContext) => {
    console.log('handleEndSession called, messages length:', messages.length);
    console.log('Exercise context:', exerciseContext);
    
    // Check if we have any user messages (real conversation)
    const userMessages = messages.filter(msg => msg.type === 'user');
    console.log('User messages count:', userMessages.length);
    
    if (userMessages.length > 0) {
      console.log('Showing save dialog');
      // For now, let's proceed as if user chose to save.
      extractInsightsAndSaveSession(onBack, exerciseContext);
    } else {
      console.log('No user messages, going back directly');
      onBack();
    }
  }, []);

  // Extract insights and save session - BACKGROUND PROCESSING
  const extractInsightsAndSaveSession = useCallback(async (onBack: () => void, exerciseContext?: ExerciseContext) => {
    try {
      console.log('Starting background session save and insight extraction...');
      
      // IMMEDIATELY return to main app - don't block the user!
      onBack();
      
      // Continue processing in background
      await storageService.saveToHistory();
      await storageService.clearCurrentSession();
      console.log('Session saved to history and cleared');
      
      // Process insights and memory in background (slow AI operations)
      setTimeout(async () => {
        try {
          const currentSession = await storageService.getChatHistory();
          const lastSession = currentSession[0]; // Most recent session
          
          if (lastSession && lastSession.messages) {
            // Check if this was the Automatic Thoughts exercise
            const isAutomaticThoughtsExercise = exerciseContext?.exerciseType === 'automatic-thoughts';

            // ONLY extract CBT thought patterns after Automatic Thoughts exercise
            if (isAutomaticThoughtsExercise) {
              console.log('🧠 Automatic Thoughts exercise completed - extracting CBT thought patterns with distortions and reframes');
              const patterns = await insightService.extractAtSessionEnd(lastSession.messages);
              if (patterns.length > 0) {
                console.log(`✅ Background: Extracted ${patterns.length} CBT thought patterns`);
              } else {
                console.log(`ℹ️ No clear thought patterns with distortions found in this session`);
              }
            } else {
              console.log(`⏭️ Skipping CBT thought pattern extraction - not Automatic Thoughts exercise`);
            }

            // Exercise-specific insight extraction based on context
            if (exerciseContext) {
              if (exerciseContext.isVisionExercise) {
                console.log('🔮 Vision exercise - extracting only vision insights');
                const visionInsight = await visionInsightsService.extractVisionInsight(lastSession.messages, lastSession.id);
                if (visionInsight) {
                  console.log(`✨ Background: Extracted Vision of the Future insight`);
                }
                // Skip other extractions for vision exercises - they have their own structured summary
                console.log('⏭️ Skipping memory insights and session summary for vision exercise');
              } else if (exerciseContext.isThinkingPatternReflection) {
                console.log('🧠 Thinking pattern reflection - extracting memory insights only');
                const insightResult = await memoryService.extractInsights(lastSession.messages);
                if (insightResult.shouldExtract && insightResult.insights.length > 0) {
                  console.log(`✅ Background: Extracted ${insightResult.insights.length} memory insights`);
                }
              } else if (exerciseContext.isValueReflection) {
                console.log('💎 Value reflection - extracting memory insights only');
                const insightResult = await memoryService.extractInsights(lastSession.messages);
                if (insightResult.shouldExtract && insightResult.insights.length > 0) {
                  console.log(`✅ Background: Extracted ${insightResult.insights.length} memory insights`);
                }
              } else {
                console.log(`⚡ ${exerciseContext.exerciseType || 'Regular'} exercise - standard processing`);
                // Extract memory insights for other exercises
                const insightResult = await memoryService.extractInsights(lastSession.messages);
                if (insightResult.shouldExtract && insightResult.insights.length > 0) {
                  console.log(`✅ Background: Extracted ${insightResult.insights.length} memory insights`);
                }
              }
            } else {
              console.log('❓ No exercise context - extracting memory insights only');
              // Extract memory insights for regular therapy sessions
              const insightResult = await memoryService.extractInsights(lastSession.messages);
              if (insightResult.shouldExtract && insightResult.insights.length > 0) {
                console.log(`✅ Background: Extracted ${insightResult.insights.length} memory insights`);
              }
            }

            // Generate session summary and consolidation - ONLY for non-vision exercises
            if (!exerciseContext?.isVisionExercise) {
              const summaryResult = await memoryService.generateSessionSummary(
                lastSession.id, 
                lastSession.messages
              );
              console.log(`✅ Background: Generated session summary`);

              // Check for consolidation
              if (summaryResult.shouldConsolidate) {
                const consolidatedSummary = await memoryService.consolidateSummaries();
                if (consolidatedSummary) {
                  console.log(`✅ Background: Created consolidated summary`);
                }
              }
            }

            // Prune old data periodically
            await memoryService.pruneOldData();
          }
        } catch (error) {
          console.error('Background insight extraction failed:', error);
        }
      }, 100);
      
    } catch (error) {
      console.error('Error in extractInsightsAndSaveSession:', error);
      onBack();
    }
  }, []);

  // Extract insights but don't save conversation - BACKGROUND PROCESSING
  const extractInsightsAndEnd = useCallback(async (onBack: () => void, exerciseContext?: ExerciseContext) => {
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
          // Get current messages before clearing
          const currentMessages = await storageService.getMessages();

          // Check if this was the Automatic Thoughts exercise
          const isAutomaticThoughtsExercise = exerciseContext?.exerciseType === 'automatic-thoughts';

          // ONLY extract CBT thought patterns after Automatic Thoughts exercise
          if (isAutomaticThoughtsExercise) {
            console.log('🧠 Automatic Thoughts exercise completed - extracting CBT thought patterns (conversation not saved)');
            const patterns = await insightService.extractAtSessionEnd();
            if (patterns.length > 0) {
              console.log(`✅ Background: Extracted ${patterns.length} CBT thought patterns (conversation not saved)`);
            } else {
              console.log(`ℹ️ No clear thought patterns with distortions found (conversation not saved)`);
            }
          } else {
            console.log(`⏭️ Skipping CBT thought pattern extraction - not Automatic Thoughts exercise (conversation not saved)`);
          }

          // Extract insights based on exercise type even if not saving conversation
          if (currentMessages.length > 0) {
            // Exercise-specific insight extraction based on context (conversation not saved)
            if (exerciseContext) {
              if (exerciseContext.isVisionExercise) {
                console.log('🔮 Vision exercise - extracting only vision insights (conversation not saved)');
                const sessionId = 'temp_' + Date.now(); // Temporary session ID
                const visionInsight = await visionInsightsService.extractVisionInsight(currentMessages, sessionId);
                if (visionInsight) {
                  console.log(`✨ Background: Extracted Vision of the Future insight (conversation not saved)`);
                }
                console.log('⏭️ Skipping memory insights for vision exercise (conversation not saved)');
              } else if (exerciseContext.isThinkingPatternReflection) {
                console.log('🧠 Thinking pattern reflection - extracting memory insights only (conversation not saved)');
                const insightResult = await memoryService.extractInsights(currentMessages);
                if (insightResult.shouldExtract && insightResult.insights.length > 0) {
                  console.log(`✅ Background: Extracted ${insightResult.insights.length} memory insights (conversation not saved)`);
                }
              } else if (exerciseContext.isValueReflection) {
                console.log('💎 Value reflection - extracting memory insights only (conversation not saved)');
                const insightResult = await memoryService.extractInsights(currentMessages);
                if (insightResult.shouldExtract && insightResult.insights.length > 0) {
                  console.log(`✅ Background: Extracted ${insightResult.insights.length} memory insights (conversation not saved)`);
                }
              } else {
                console.log(`⚡ ${exerciseContext.exerciseType || 'Regular'} exercise - extracting memory insights (conversation not saved)`);
                const insightResult = await memoryService.extractInsights(currentMessages);
                if (insightResult.shouldExtract && insightResult.insights.length > 0) {
                  console.log(`✅ Background: Extracted ${insightResult.insights.length} memory insights (conversation not saved)`);
                }
              }
            } else {
              console.log('❓ No exercise context - extracting memory insights only (conversation not saved)');
              const insightResult = await memoryService.extractInsights(currentMessages);
              if (insightResult.shouldExtract && insightResult.insights.length > 0) {
                console.log(`✅ Background: Extracted ${insightResult.insights.length} memory insights (conversation not saved)`);
              }
            }
          }
        } catch (error) {
          console.error('Background insight extraction failed:', error);
        }
      }, 100);
      
    } catch (error) {
      console.error('Error in extractInsightsAndEnd:', error);
      onBack();
    }
  }, []);

  return {
    isLoading,
    initializeSession,
    handleEndSession,
    extractInsightsAndSaveSession,
    extractInsightsAndEnd
  };
};

export default useSessionManagement;