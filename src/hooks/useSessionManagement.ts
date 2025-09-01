import { useState, useCallback } from 'react';
import { Platform, Alert } from 'react-native';
import { Message, storageService } from '../services/storageService';
import { insightService } from '../services/insightService';

/**
 * Hook for session lifecycle management - extracted from useChatSession
 * Handles session initialization, saving, and cleanup
 */
export const useSessionManagement = () => {
  const [isLoading, setIsLoading] = useState(false);

  const initializeSession = useCallback(async (): Promise<Message[]> => {
    try {
      setIsLoading(true);
      
      // Always start with a fresh session - don't load existing messages
      await storageService.clearCurrentSession();
      
      // Create new conversation with welcome message
      const { contextService } = await import('../services/contextService');
      const welcomeMessage = contextService.createWelcomeMessage();
      
      // Save welcome message to storage
      await storageService.addMessage(welcomeMessage);
      
      return [welcomeMessage];
    } catch (error) {
      console.error('Error creating fresh chat session:', error);
      
      // Fallback to local welcome message
      const { contextService } = await import('../services/contextService');
      const welcomeMessage = contextService.createWelcomeMessage();
      
      return [welcomeMessage];
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