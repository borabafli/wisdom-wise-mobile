// Final, corrected useSessionManagement.ts
import { useState, useCallback } from 'react';
import { Message, storageService } from '../services/storageService';
import { insightService } from '../services/insightService';
import { contextService } from '../services/contextService';
import { memoryService } from '../services/memoryService';

/**
 * Hook for session lifecycle management - extracted from useChatSession
 * Handles session initialization, saving, and cleanup
 */
export const useSessionManagement = () => {
  const [isLoading, setIsLoading] = useState(false);

  const initializeSession = useCallback(async (): Promise<Message[]> => {
    try {
      setIsLoading(true);
      console.log('Starting a fresh session - clearing any existing messages.');
      
      // Always clear the current session to start fresh
      await storageService.clearCurrentSession();
      
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'welcome',
        content: "Hello! I'm Anu, your compassionate companion. I'm here to listen without judgment and help you explore your thoughts and feelings. What's on your mind today? 🌱",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      await storageService.addMessage(welcomeMessage);
      console.log('Fresh session started with welcome message.');
      return [welcomeMessage];
    } catch (error) {
      console.error('Error initializing chat session:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleEndSession = useCallback((onBack: () => void, messages: Message[]) => {
    console.log('handleEndSession called, messages length:', messages.length);
    
    // Check if we have any user messages (real conversation)
    const userMessages = messages.filter(msg => msg.type === 'user');
    console.log('User messages count:', userMessages.length);
    
    if (userMessages.length > 0) {
      console.log('Showing save dialog');
      // For now, let's proceed as if user chose to save.
      extractInsightsAndSaveSession(onBack);
    } else {
      console.log('No user messages, going back directly');
      onBack();
    }
  }, []);

  // Extract insights and save session - BACKGROUND PROCESSING
  const extractInsightsAndSaveSession = useCallback(async (onBack: () => void) => {
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
            // Extract traditional thought patterns
            const patterns = await insightService.extractAtSessionEnd(lastSession.messages);
            if (patterns.length > 0) {
              console.log(`✅ Background: Extracted ${patterns.length} thought patterns`);
            }

            // Extract memory insights
            const insightResult = await memoryService.extractInsights(lastSession.messages);
            if (insightResult.shouldExtract && insightResult.insights.length > 0) {
              console.log(`✅ Background: Extracted ${insightResult.insights.length} memory insights`);
            }

            // Generate session summary
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
  const extractInsightsAndEnd = useCallback(async (onBack: () => void) => {
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
          
          const patterns = await insightService.extractAtSessionEnd();
          if (patterns.length > 0) {
            console.log(`✅ Background: Extracted ${patterns.length} thought patterns (conversation not saved)`);
          }

          // Still extract memory insights even if not saving conversation
          if (currentMessages.length > 0) {
            const insightResult = await memoryService.extractInsights(currentMessages);
            if (insightResult.shouldExtract && insightResult.insights.length > 0) {
              console.log(`✅ Background: Extracted ${insightResult.insights.length} memory insights (conversation not saved)`);
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